import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BLOG_POSTS } from '../src/data/petcareData';
import { BlogPostItem } from '../src/types';

export interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: 'member';
  createdAt: string;
}

interface BlogPostRow {
  slug: string;
  title: string;
  category: BlogPostItem['category'];
  content_type: 'article' | 'video';
  video_url: string | null;
  status: 'published' | 'scheduled' | 'draft';
  scheduled_at: string | null;
  published_at: string | null;
  author: string | null;
  date_label: string;
  read_time: string;
  excerpt: string;
  image: string;
  image_alt: string;
  featured: boolean;
  related_service_value: string;
  sections: BlogPostItem['sections'];
}

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: 'member';
  created_at: string;
}

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'blog-posts.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
export const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
).trim();
const SUPABASE_STORAGE_BUCKET =
  (process.env.SUPABASE_STORAGE_BUCKET || 'petcare-media').trim();

export const ALLOWED_MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
  'video/ogg': '.ogv',
};

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_SERVICE_ROLE_KEY &&
    !SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
    !SUPABASE_SERVICE_ROLE_KEY.includes('YOUR_SUPABASE')
);

const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export function getStorageMode(): 'supabase' | 'local' {
  return supabase ? 'supabase' : 'local';
}

export function formatDateVi(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function seedInitialPosts(): BlogPostItem[] {
  const baseTime = new Date('2026-10-14T08:00:00.000Z').getTime();
  return BLOG_POSTS.map((post, idx) => ({
    ...post,
    contentType: post.contentType ?? 'article',
    status: post.status ?? 'published',
    publishedAt:
      post.publishedAt ??
      new Date(baseTime - idx * 4 * 24 * 3600 * 1000).toISOString(),
    author: post.author ?? 'PETCARE PLUS',
  }));
}

function postToRow(post: BlogPostItem): BlogPostRow {
  return {
    slug: post.slug,
    title: post.title,
    category: post.category,
    content_type: post.contentType ?? 'article',
    video_url: post.videoUrl ?? null,
    status: post.status ?? 'published',
    scheduled_at: post.scheduledAt ?? null,
    published_at: post.publishedAt ?? null,
    author: post.author ?? null,
    date_label: post.dateLabel,
    read_time: post.readTime,
    excerpt: post.excerpt,
    image: post.image,
    image_alt: post.imageAlt,
    featured: Boolean(post.featured),
    related_service_value: post.relatedServiceValue,
    sections: post.sections,
  };
}

function rowToPost(row: BlogPostRow): BlogPostItem {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    contentType: row.content_type ?? 'article',
    videoUrl: row.video_url ?? undefined,
    status: row.status ?? 'published',
    scheduledAt: row.scheduled_at ?? undefined,
    publishedAt: row.published_at ?? undefined,
    author: row.author ?? undefined,
    dateLabel: row.date_label,
    readTime: row.read_time,
    excerpt: row.excerpt,
    image: row.image,
    imageAlt: row.image_alt,
    featured: Boolean(row.featured),
    relatedServiceValue: row.related_service_value,
    sections: Array.isArray(row.sections) ? row.sections : [],
  };
}

function sortPosts(posts: BlogPostItem[]): BlogPostItem[] {
  return [...posts].sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.scheduledAt || 0).getTime();
    const timeB = new Date(b.publishedAt || b.scheduledAt || 0).getTime();
    return timeB - timeA;
  });
}

function ensureLocalDirs(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function saveLocalPosts(posts: BlogPostItem[]): void {
  ensureLocalDirs();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

function readLocalPosts(): BlogPostItem[] {
  ensureLocalDirs();
  if (!fs.existsSync(POSTS_FILE)) {
    const seeded = seedInitialPosts();
    saveLocalPosts(seeded);
    return seeded;
  }
  try {
    const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedInitialPosts();
  } catch {
    const seeded = seedInitialPosts();
    saveLocalPosts(seeded);
    return seeded;
  }
}

function readLocalUsers(): StoredUser[] {
  ensureLocalDirs();
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: StoredUser[]): void {
  ensureLocalDirs();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function initStorage(): Promise<void> {
  if (!supabase) {
    ensureLocalDirs();
    readLocalPosts();
    return;
  }

  // Seed initial posts into Supabase if the blog_posts table is empty
  const { count, error } = await supabase
    .from('blog_posts')
    .select('slug', { count: 'exact', head: true });

  if (error) {
    console.error(
      '[Supabase] Không thể kết nối bảng blog_posts. Hãy chắc chắn bạn đã chạy file supabase/schema.sql trong SQL Editor:',
      error.message
    );
    return;
  }

  if (count === 0) {
    const seededRows = seedInitialPosts().map(postToRow);
    const { error: insertErr } = await supabase
      .from('blog_posts')
      .insert(seededRows);
    if (insertErr) {
      console.error('[Supabase] Lỗi khi khởi tạo bài viết mẫu:', insertErr.message);
    } else {
      console.log(`[Supabase] Đã khởi tạo ${seededRows.length} bài viết Blog mẫu.`);
    }
  }
}

export async function listAndSyncPosts(): Promise<BlogPostItem[]> {
  const nowIso = new Date().toISOString();
  const nowMs = Date.now();

  if (supabase) {
    // 1. Find scheduled posts due to publish
    const { data: dueRows, error: dueErr } = await supabase
      .from('blog_posts')
      .select('slug, scheduled_at')
      .eq('status', 'scheduled')
      .lte('scheduled_at', nowIso);

    if (!dueErr && dueRows && dueRows.length > 0) {
      await Promise.all(
        dueRows.map((row) => {
          const targetIso = row.scheduled_at || nowIso;
          return supabase
            .from('blog_posts')
            .update({
              status: 'published',
              published_at: targetIso,
              date_label: formatDateVi(targetIso),
              updated_at: nowIso,
            })
            .eq('slug', row.slug);
        })
      );
    }

    // 2. Fetch all posts
    const { data, error } = await supabase.from('blog_posts').select('*');
    if (error) {
      throw new Error(`Lỗi tải danh sách bài viết từ Supabase: ${error.message}`);
    }
    return sortPosts(((data || []) as BlogPostRow[]).map(rowToPost));
  }

  // Local fallback
  let posts = readLocalPosts();
  let changed = false;
  posts = posts.map((post) => {
    if (post.status === 'scheduled' && post.scheduledAt) {
      const scheduledTime = new Date(post.scheduledAt).getTime();
      if (!Number.isNaN(scheduledTime) && scheduledTime <= nowMs) {
        changed = true;
        return {
          ...post,
          status: 'published' as const,
          publishedAt: post.scheduledAt,
          dateLabel: formatDateVi(post.scheduledAt),
        };
      }
    }
    return post;
  });

  if (changed) {
    saveLocalPosts(posts);
  }
  return sortPosts(posts);
}

export async function createPost(post: BlogPostItem): Promise<BlogPostItem> {
  if (supabase) {
    if (post.featured) {
      await supabase
        .from('blog_posts')
        .update({ featured: false })
        .eq('featured', true);
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postToRow(post))
      .select('*')
      .single();

    if (error) {
      throw new Error(`Không thể lưu bài viết lên Supabase: ${error.message}`);
    }
    return rowToPost(data as BlogPostRow);
  }

  const posts = readLocalPosts();
  const updated = post.featured
    ? [post, ...posts.map((p) => ({ ...p, featured: false }))]
    : [post, ...posts];
  saveLocalPosts(updated);
  return post;
}

export async function updatePost(
  slug: string,
  updatedPost: BlogPostItem
): Promise<BlogPostItem> {
  if (supabase) {
    if (updatedPost.featured) {
      await supabase
        .from('blog_posts')
        .update({ featured: false })
        .neq('slug', slug)
        .eq('featured', true);
    }

    const { slug: _ignoredSlug, ...updateFields } = postToRow(updatedPost);
    const row = {
      ...updateFields,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('blog_posts')
      .update(row)
      .eq('slug', slug)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Không thể cập nhật bài viết trên Supabase: ${error.message}`);
    }
    return rowToPost(data as BlogPostRow);
  }

  const posts = readLocalPosts();
  const nextPosts = posts.map((post) => {
    if (post.slug === slug) return updatedPost;
    if (updatedPost.featured) return { ...post, featured: false };
    return post;
  });
  saveLocalPosts(nextPosts);
  return updatedPost;
}

export async function deletePost(slug: string): Promise<boolean> {
  if (supabase) {
    const { data, error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('slug', slug)
      .select('slug');

    if (error) {
      throw new Error(`Không thể xóa bài viết trên Supabase: ${error.message}`);
    }
    return Boolean(data && data.length > 0);
  }

  const posts = readLocalPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (filtered.length === posts.length) return false;
  saveLocalPosts(filtered);
  return true;
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const normalized = email.trim().toLowerCase();

  if (supabase) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalized)
      .maybeSingle();

    if (error) {
      throw new Error(`Lỗi truy vấn tài khoản Supabase: ${error.message}`);
    }
    if (!data) return null;
    const row = data as UserRow;
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
    };
  }

  const users = readLocalUsers();
  return users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export async function createUser(user: StoredUser): Promise<StoredUser> {
  if (supabase) {
    const { error } = await supabase.from('users').insert({
      id: user.id,
      email: user.email.toLowerCase(),
      full_name: user.fullName,
      password_hash: user.passwordHash,
      role: user.role,
      created_at: user.createdAt,
    });
    if (error) {
      throw new Error(`Không thể tạo tài khoản trên Supabase: ${error.message}`);
    }
    return user;
  }

  const users = readLocalUsers();
  saveLocalUsers([...users, user]);
  return user;
}

export async function uploadMedia(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const ext = ALLOWED_MIME_EXTENSIONS[mimeType];
  if (!ext) {
    throw new Error(
      'Định dạng tệp không được hỗ trợ. Chỉ chấp nhận ảnh (JPG, PNG, WEBP, GIF) hoặc video (MP4, WEBM, MOV).'
    );
  }

  if (buffer.length === 0) {
    throw new Error('Tệp tải lên rỗng.');
  }

  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error('Dung lượng tệp vượt quá giới hạn 50MB.');
  }

  const folder = mimeType.startsWith('video/') ? 'videos' : 'images';
  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;

  if (supabase) {
    const storagePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: mimeType,
        cacheControl: '31536000',
        upsert: false,
      });

    if (error) {
      throw new Error(`Không thể tải tệp lên Supabase Storage: ${error.message}`);
    }

    const { data } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return data.publicUrl;
  }

  // Local fallback
  ensureLocalDirs();
  const targetPath = path.join(UPLOADS_DIR, fileName);
  fs.writeFileSync(targetPath, buffer);
  return `/uploads/${fileName}`;
}

