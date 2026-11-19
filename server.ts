import 'dotenv/config';
import crypto from 'crypto';
import path from 'path';
import zlib from 'zlib';
import express, { Request, Response, NextFunction } from 'express';
import { AuthUser, BlogPostItem, UserRole } from './src/types';
import {
  ALLOWED_MIME_EXTENSIONS,
  createPost,
  createUser,
  deletePost,
  findUserByEmail,
  formatDateVi,
  getStorageMode,
  initStorage,
  listAndSyncPosts,
  MAX_UPLOAD_BYTES,
  StoredUser,
  updatePost,
  uploadMedia,
  UPLOADS_DIR,
} from './server/storage';

const PORT = Number(process.env.PORT || 3000);
const IS_PROD =
  process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

const ROOT_DIR = process.cwd();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || 'admin@petcareplus.vn'
).toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Petcare@2026';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin PETCARE PLUS';
const SESSION_SECRET =
  process.env.ADMIN_SECRET || 'petcare-plus-local-admin-secret-2026';
const SESSION_COOKIE = 'petcare_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPasswordHash(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(keyHex, 'hex');
  if (derivedBuf.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derivedBuf, keyBuf);
}

function slugifyVi(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function signSessionToken(user: AuthUser): string {
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      exp: Date.now() + SESSION_TTL_MS,
    })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token?: string): AuthUser | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf-8')
    ) as {
      id?: string;
      email?: string;
      fullName?: string;
      role?: UserRole;
      exp?: number;
    };
    if (
      !decoded.id ||
      !decoded.email ||
      !decoded.fullName ||
      (decoded.role !== 'admin' && decoded.role !== 'member') ||
      !decoded.exp ||
      decoded.exp < Date.now()
    ) {
      return null;
    }
    return {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const pair of cookieHeader.split(';')) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    const val = decodeURIComponent(pair.slice(idx + 1).trim());
    cookies[key] = val;
  }
  return cookies;
}

function getSessionUser(req: Request): AuthUser | null {
  const cookies = parseCookies(req.headers.cookie);
  return verifySessionToken(cookies[SESSION_COOKIE]);
}

function isHttpsRequest(req: Request): boolean {
  return (
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https'
  );
}

function setSessionCookie(req: Request, res: Response, user: AuthUser): void {
  const token = signSessionToken(user);
  const maxAgeSec = Math.floor(SESSION_TTL_MS / 1000);
  const secureFlag = IS_PROD && isHttpsRequest(req) ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(
      token
    )}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAgeSec}${secureFlag}`
  );
}

function clearSessionCookie(req: Request, res: Response): void {
  const secureFlag = IS_PROD && isHttpsRequest(req) ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secureFlag}`
  );
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({
      error: 'Bạn cần đăng nhập tài khoản Admin để thực hiện thao tác này.',
    });
    return;
  }
  if (user.role !== 'admin') {
    res.status(403).json({
      error:
        'Chỉ tài khoản Admin mới có quyền đăng hoặc quản lý bài viết Blog.',
    });
    return;
  }
  next();
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

async function startServer(): Promise<void> {
  await initStorage();

  const app = express();
  app.set('trust proxy', 1);

  // Small JSON limit for regular API calls (uploads use binary stream endpoint below)
  app.use(express.json({ limit: '2mb' }));

  // Prevent browser/CDN caching on all dynamic API endpoints
  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Serve local fallback uploads when not using Supabase Storage
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- HEALTH CHECK ---
  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      storage: getStorageMode(),
      env: IS_PROD ? 'production' : 'development',
    });
  });

  // --- AUTH API ---
  app.get('/api/auth/me', (req, res) => {
    const user = getSessionUser(req);
    if (!user) {
      res.json({ authenticated: false });
      return;
    }
    res.json({ authenticated: true, user });
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { fullName, email, password } = req.body as {
        fullName?: string;
        email?: string;
        password?: string;
      };

      const cleanName = (fullName || '').trim();
      const cleanEmail = (email || '').trim().toLowerCase();

      if (!cleanName || cleanName.length < 2) {
        res
          .status(400)
          .json({ error: 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự).' });
        return;
      }

      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
        res.status(400).json({ error: 'Địa chỉ email không hợp lệ.' });
        return;
      }

      if (typeof password !== 'string' || password.length < 6) {
        res.status(400).json({ error: 'Mật khẩu cần có tối thiểu 6 ký tự.' });
        return;
      }

      if (
        cleanEmail === ADMIN_EMAIL ||
        cleanEmail === ADMIN_USERNAME.toLowerCase()
      ) {
        res.status(409).json({
          error:
            'Email này thuộc hệ thống quản trị. Vui lòng sử dụng email khác.',
        });
        return;
      }

      const existing = await findUserByEmail(cleanEmail);
      if (existing) {
        res.status(409).json({
          error:
            'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.',
        });
        return;
      }

      const newStoredUser: StoredUser = {
        id: `usr_${crypto.randomBytes(8).toString('hex')}`,
        email: cleanEmail,
        fullName: cleanName,
        passwordHash: hashPassword(password),
        role: 'member',
        createdAt: new Date().toISOString(),
      };

      await createUser(newStoredUser);

      const authUser: AuthUser = {
        id: newStoredUser.id,
        email: newStoredUser.email,
        fullName: newStoredUser.fullName,
        role: 'member',
      };

      setSessionCookie(req, res, authUser);
      res.status(201).json({ authenticated: true, user: authUser });
    } catch (err) {
      res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : 'Không thể đăng ký tài khoản lúc này.',
      });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const body = req.body as {
        identifier?: string;
        email?: string;
        username?: string;
        password?: string;
      };

      const rawIdentifier = (
        body.identifier ??
        body.email ??
        body.username ??
        ''
      ).trim();
      const password = body.password;

      if (!rawIdentifier || typeof password !== 'string' || !password) {
        res.status(400).json({
          error: 'Vui lòng nhập email (hoặc tên đăng nhập) và mật khẩu.',
        });
        return;
      }

      const normalizedId = rawIdentifier.toLowerCase();

      // 1. Admin account check
      const isAdminIdentifier =
        safeCompare(normalizedId, ADMIN_EMAIL) ||
        safeCompare(normalizedId, ADMIN_USERNAME.toLowerCase());

      if (isAdminIdentifier) {
        if (!safeCompare(password, ADMIN_PASSWORD)) {
          res.status(401).json({
            error: 'Email/tên đăng nhập hoặc mật khẩu không chính xác.',
          });
          return;
        }

        const adminUser: AuthUser = {
          id: 'admin',
          email: ADMIN_EMAIL,
          fullName: ADMIN_NAME,
          role: 'admin',
        };
        setSessionCookie(req, res, adminUser);
        res.json({ authenticated: true, user: adminUser });
        return;
      }

      // 2. Member account check
      const found = await findUserByEmail(normalizedId);
      if (!found || !verifyPasswordHash(password, found.passwordHash)) {
        res.status(401).json({
          error: 'Email hoặc mật khẩu không chính xác.',
        });
        return;
      }

      const memberUser: AuthUser = {
        id: found.id,
        email: found.email,
        fullName: found.fullName,
        role: 'member',
      };
      setSessionCookie(req, res, memberUser);
      res.json({ authenticated: true, user: memberUser });
    } catch (err) {
      res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : 'Không thể đăng nhập lúc này.',
      });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    clearSessionCookie(req, res);
    res.json({ ok: true });
  });

  // --- BLOG POSTS API ---
  app.get('/api/posts', async (req, res) => {
    try {
      const user = getSessionUser(req);
      const isAdmin = user?.role === 'admin';
      const allPosts = await listAndSyncPosts();
      const visiblePosts = isAdmin
        ? allPosts
        : allPosts.filter(
            (post) => (post.status ?? 'published') === 'published'
          );
      res.json({ posts: visiblePosts });
    } catch (err) {
      res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : 'Không thể tải danh sách bài viết.',
      });
    }
  });

  app.post('/api/posts', requireAdmin, async (req, res) => {
    try {
      const admin = getSessionUser(req)!;
      const body = req.body as Partial<BlogPostItem>;

      const title = (body.title || '').trim();
      const excerpt = (body.excerpt || '').trim();
      const category = body.category;
      const contentType = body.contentType === 'video' ? 'video' : 'article';
      const videoUrl = (body.videoUrl || '').trim();

      if (!title || !excerpt || !category) {
        res.status(400).json({
          error: 'Vui lòng nhập đầy đủ tiêu đề, chuyên mục và tóm tắt bài viết.',
        });
        return;
      }

      if (contentType === 'video' && !videoUrl) {
        res.status(400).json({
          error: 'Vui lòng nhập đường dẫn video hoặc tải lên tệp video.',
        });
        return;
      }

      const requestedStatus = body.status || 'published';
      let finalStatus: 'published' | 'scheduled' | 'draft' =
        requestedStatus === 'scheduled' || requestedStatus === 'draft'
          ? requestedStatus
          : 'published';

      let scheduledAt: string | undefined;
      let publishedAt: string | undefined;
      let dateLabel = formatDateVi(new Date().toISOString());

      if (finalStatus === 'scheduled') {
        if (!body.scheduledAt) {
          res.status(400).json({
            error: 'Vui lòng chọn thời gian lên lịch đăng bài.',
          });
          return;
        }
        const parsedDate = new Date(body.scheduledAt);
        if (Number.isNaN(parsedDate.getTime())) {
          res.status(400).json({
            error: 'Thời gian lên lịch không hợp lệ.',
          });
          return;
        }
        if (parsedDate.getTime() <= Date.now()) {
          finalStatus = 'published';
          publishedAt = parsedDate.toISOString();
          dateLabel = formatDateVi(publishedAt);
        } else {
          scheduledAt = parsedDate.toISOString();
          dateLabel = formatDateVi(scheduledAt);
        }
      } else if (finalStatus === 'published') {
        publishedAt = new Date().toISOString();
        dateLabel = formatDateVi(publishedAt);
      }

      const existingPosts = await listAndSyncPosts();
      const baseSlug = slugifyVi(title) || `bai-viet-${Date.now()}`;
      let slug = baseSlug;
      let counter = 2;
      while (existingPosts.some((p) => p.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter += 1;
      }

      const sections =
        Array.isArray(body.sections) && body.sections.length > 0
          ? body.sections
          : [
              {
                heading: title,
                paragraphs: [excerpt],
              },
            ];

      const newPost: BlogPostItem = {
        slug,
        title,
        category,
        contentType,
        videoUrl: contentType === 'video' ? videoUrl : undefined,
        status: finalStatus,
        scheduledAt,
        publishedAt,
        author: admin.fullName,
        dateLabel,
        readTime:
          (body.readTime || '').trim() ||
          (contentType === 'video' ? 'Video hướng dẫn' : '4 phút đọc'),
        excerpt,
        image:
          (body.image || '').trim() ||
          '/src/assets/images/blog_dog_cat_hero_1794822133750.jpg',
        imageAlt: (body.imageAlt || '').trim() || title,
        featured: Boolean(body.featured),
        relatedServiceValue:
          body.relatedServiceValue ||
          'Trao đổi quy trình chuẩn bị trước khi sử dụng dịch vụ',
        sections,
      };

      const saved = await createPost(newPost);
      res.status(201).json({ post: saved });
    } catch (err) {
      res.status(500).json({
        error:
          err instanceof Error ? err.message : 'Không thể tạo bài viết mới.',
      });
    }
  });

  app.put('/api/posts/:slug', requireAdmin, async (req, res) => {
    try {
      const targetSlug = req.params.slug;
      const body = req.body as Partial<BlogPostItem>;
      const posts = await listAndSyncPosts();
      const existing = posts.find((p) => p.slug === targetSlug);

      if (!existing) {
        res.status(404).json({ error: 'Không tìm thấy bài viết cần cập nhật.' });
        return;
      }

      const nextContentType =
        body.contentType ?? existing.contentType ?? 'article';
      const nextVideoUrl =
        nextContentType === 'video'
          ? (body.videoUrl ?? existing.videoUrl ?? '').trim()
          : undefined;

      if (nextContentType === 'video' && !nextVideoUrl) {
        res.status(400).json({
          error: 'Bài đăng dạng video cần có đường dẫn hoặc tệp video.',
        });
        return;
      }

      let nextStatus = body.status ?? existing.status ?? 'published';
      let nextScheduledAt = body.scheduledAt ?? existing.scheduledAt;
      let nextPublishedAt = existing.publishedAt;
      let nextDateLabel = existing.dateLabel;

      if (nextStatus === 'scheduled') {
        if (!nextScheduledAt) {
          res.status(400).json({
            error: 'Vui lòng chọn thời gian lên lịch đăng bài.',
          });
          return;
        }
        const parsedDate = new Date(nextScheduledAt);
        if (Number.isNaN(parsedDate.getTime())) {
          res.status(400).json({ error: 'Thời gian lên lịch không hợp lệ.' });
          return;
        }
        if (parsedDate.getTime() <= Date.now()) {
          nextStatus = 'published';
          nextPublishedAt = parsedDate.toISOString();
          nextScheduledAt = undefined;
          nextDateLabel = formatDateVi(nextPublishedAt);
        } else {
          nextScheduledAt = parsedDate.toISOString();
          nextDateLabel = formatDateVi(nextScheduledAt);
        }
      } else if (nextStatus === 'published') {
        nextScheduledAt = undefined;
        if (existing.status !== 'published' || !nextPublishedAt) {
          nextPublishedAt = new Date().toISOString();
          nextDateLabel = formatDateVi(nextPublishedAt);
        }
      } else if (nextStatus === 'draft') {
        nextScheduledAt = undefined;
      }

      const updatedPost: BlogPostItem = {
        ...existing,
        title: body.title !== undefined ? body.title.trim() : existing.title,
        category: body.category ?? existing.category,
        contentType: nextContentType,
        videoUrl: nextVideoUrl,
        status: nextStatus,
        scheduledAt: nextScheduledAt,
        publishedAt: nextPublishedAt,
        dateLabel: nextDateLabel,
        readTime:
          body.readTime !== undefined ? body.readTime.trim() : existing.readTime,
        excerpt:
          body.excerpt !== undefined ? body.excerpt.trim() : existing.excerpt,
        image: body.image !== undefined ? body.image.trim() : existing.image,
        imageAlt:
          body.imageAlt !== undefined ? body.imageAlt.trim() : existing.imageAlt,
        featured:
          body.featured !== undefined
            ? Boolean(body.featured)
            : existing.featured,
        relatedServiceValue:
          body.relatedServiceValue ?? existing.relatedServiceValue,
        sections:
          Array.isArray(body.sections) && body.sections.length > 0
            ? body.sections
            : existing.sections,
      };

      const saved = await updatePost(targetSlug, updatedPost);
      res.json({ post: saved });
    } catch (err) {
      res.status(500).json({
        error:
          err instanceof Error ? err.message : 'Không thể cập nhật bài viết.',
      });
    }
  });

  app.delete('/api/posts/:slug', requireAdmin, async (req, res) => {
    try {
      const deleted = await deletePost(req.params.slug);
      if (!deleted) {
        res.status(404).json({ error: 'Không tìm thấy bài viết cần xóa.' });
        return;
      }
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Không thể xóa bài viết.',
      });
    }
  });

  // --- OPTIMIZED BINARY MEDIA UPLOAD API (zero Base64 overhead) ---
  app.post(
    '/api/upload',
    requireAdmin,
    express.raw({
      type: Object.keys(ALLOWED_MIME_EXTENSIONS),
      limit: MAX_UPLOAD_BYTES,
    }),
    async (req, res) => {
      try {
        const mimeType = (req.headers['content-type'] || '')
          .split(';')[0]
          .trim()
          .toLowerCase();

        if (!ALLOWED_MIME_EXTENSIONS[mimeType]) {
          res.status(400).json({
            error:
              'Định dạng tệp không được hỗ trợ. Chỉ chấp nhận ảnh (JPG, PNG, WEBP, GIF) hoặc video (MP4, WEBM, MOV).',
          });
          return;
        }

        if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
          res.status(400).json({ error: 'Thiếu dữ liệu tệp tải lên.' });
          return;
        }

        const url = await uploadMedia(req.body, mimeType);
        res.status(201).json({ url, storage: getStorageMode() });
      } catch (err) {
        res.status(500).json({
          error:
            err instanceof Error ? err.message : 'Không thể tải tệp lên lúc này.',
        });
      }
    }
  );

  // Handle payload-too-large cleanly
  app.use(
    (
      err: { status?: number; type?: string; message?: string },
      _req: Request,
      res: Response,
      next: NextFunction
    ) => {
      if (err?.type === 'entity.too.large' || err?.status === 413) {
        res.status(413).json({
          error:
            'Dung lượng tệp vượt quá giới hạn 50MB. Với video dài, hãy dán link YouTube/Vimeo để tối ưu tốc độ.',
        });
        return;
      }
      next(err);
    }
  );

  // --- FRONTEND (Vite Middleware in Dev / Static in Prod) ---
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT_DIR, 'dist');

    // Gzip compression for text/JS/CSS/JSON responses in production
    app.use((req, res, next) => {
      const acceptEncoding = String(req.headers['accept-encoding'] || '');
      if (!acceptEncoding.includes('gzip') || req.path.startsWith('/api/upload')) {
        next();
        return;
      }

      const originalSend = res.send.bind(res);
      res.send = ((body?: unknown) => {
        const contentType = String(res.getHeader('Content-Type') || '');
        const isCompressible =
          /text\/|application\/javascript|application\/json|image\/svg\+xml/i.test(
            contentType
          );
        if (
          isCompressible &&
          !res.getHeader('Content-Encoding') &&
          (typeof body === 'string' || Buffer.isBuffer(body))
        ) {
          const buf = Buffer.isBuffer(body) ? body : Buffer.from(body);
          if (buf.length > 1024) {
            const compressed = zlib.gzipSync(buf);
            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Vary', 'Accept-Encoding');
            res.setHeader('Content-Length', String(compressed.length));
            return originalSend(compressed);
          }
        }
        return originalSend(body);
      }) as typeof res.send;
      next();
    });

    // Long-term immutable cache for hashed Vite JS/CSS bundles
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );

    // 7-day browser cache for static images and other public assets
    app.use(
      express.static(distDir, {
        maxAge: '7d',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      })
    );

    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const mode = getStorageMode();
    console.log(`PETCARE PLUS server running at http://localhost:${PORT}/`);
    console.log(
      `Storage mode: ${
        mode === 'supabase'
          ? 'Supabase (PostgreSQL + Storage CDN)'
          : 'Local fallback (data/ + public/uploads/) — set SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY in .env to enable Supabase'
      }`
    );
    console.log(`Admin login: ${ADMIN_EMAIL} (or username: ${ADMIN_USERNAME})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
