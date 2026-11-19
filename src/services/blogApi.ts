import { AuthSession, BlogPostItem } from '../types';
import {
  optimizeImageForUpload,
  validateVideoForUpload,
} from '../utils/mediaUpload';

export interface SavePostPayload {
  title: string;
  category: BlogPostItem['category'];
  contentType: 'article' | 'video';
  videoUrl?: string;
  status: 'published' | 'scheduled' | 'draft';
  scheduledAt?: string;
  readTime: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  relatedServiceValue: string;
  sections: BlogPostItem['sections'];
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof (data as { error?: string }).error === 'string'
        ? (data as { error: string }).error
        : `Yêu cầu thất bại (mã ${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export async function fetchAuthSession(): Promise<AuthSession> {
  const res = await fetch('/api/auth/me', {
    credentials: 'include',
  });
  return parseJsonResponse<AuthSession>(res);
}

export async function loginAccount(
  identifier: string,
  password: string
): Promise<AuthSession> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ identifier, password }),
  });
  return parseJsonResponse<AuthSession>(res);
}

export async function registerWithEmail(
  fullName: string,
  email: string,
  password: string
): Promise<AuthSession> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ fullName, email, password }),
  });
  return parseJsonResponse<AuthSession>(res);
}

export async function logoutAccount(): Promise<void> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  await parseJsonResponse<{ ok: boolean }>(res);
}

export async function fetchBlogPosts(): Promise<BlogPostItem[]> {
  const res = await fetch(`/api/posts?_t=${Date.now()}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  const data = await parseJsonResponse<{ posts: BlogPostItem[] }>(res);
  return data.posts;
}

export async function createBlogPost(
  payload: SavePostPayload
): Promise<BlogPostItem> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await parseJsonResponse<{ post: BlogPostItem }>(res);
  return data.post;
}

export async function updateBlogPost(
  slug: string,
  payload: Partial<SavePostPayload>
): Promise<BlogPostItem> {
  const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await parseJsonResponse<{ post: BlogPostItem }>(res);
  return data.post;
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  await parseJsonResponse<{ ok: boolean }>(res);
}

export async function uploadMediaFile(file: File): Promise<string> {
  let preparedFile = file;

  if (file.type.startsWith('image/')) {
    preparedFile = await optimizeImageForUpload(file);
  } else if (file.type.startsWith('video/')) {
    validateVideoForUpload(file);
  } else {
    throw new Error(
      'Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh (JPG, PNG, WEBP, GIF) hoặc video (MP4, WebM, MOV).'
    );
  }

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': preparedFile.type,
    },
    credentials: 'include',
    body: preparedFile,
  });
  const data = await parseJsonResponse<{ url: string }>(res);
  return data.url;
}

