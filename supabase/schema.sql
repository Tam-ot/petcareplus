-- =====================================================================
-- PETCARE PLUS — Supabase Database & Storage Setup
-- Chạy toàn bộ file này 1 lần trong Supabase Dashboard -> SQL Editor
-- =====================================================================

-- 1. Bảng bài viết & video Blog
create table if not exists public.blog_posts (
  slug text primary key,
  title text not null,
  category text not null,
  content_type text not null default 'article' check (content_type in ('article', 'video')),
  video_url text,
  status text not null default 'published' check (status in ('published', 'scheduled', 'draft')),
  scheduled_at timestamptz,
  published_at timestamptz,
  author text,
  date_label text not null,
  read_time text not null,
  excerpt text not null,
  image text not null,
  image_alt text not null,
  featured boolean not null default false,
  related_service_value text not null,
  sections jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_status_scheduled
  on public.blog_posts (status, scheduled_at);

create index if not exists idx_blog_posts_published_at
  on public.blog_posts (published_at desc);

-- 2. Bảng tài khoản thành viên đăng ký bằng Email
create table if not exists public.users (
  id text primary key,
  email text not null unique,
  full_name text not null,
  password_hash text not null,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

create index if not exists idx_users_email_lower
  on public.users (lower(email));

-- 3. Bật Row Level Security và cấp quyền đầy đủ cho service_role (Backend)
alter table public.blog_posts enable row level security;
alter table public.users enable row level security;

grant usage on schema public to service_role;
grant all privileges on table public.blog_posts to service_role;
grant all privileges on table public.users to service_role;

-- 4. Tạo Storage Bucket công khai cho ảnh bìa & video tải lên
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'petcare-media',
  'petcare-media',
  true,
  52428800, -- 50MB
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/ogg'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Cho phép mọi khách truy cập xem/tải ảnh & video công khai trong bucket petcare-media
drop policy if exists "Public read petcare-media" on storage.objects;
create policy "Public read petcare-media"
  on storage.objects
  for select
  using (bucket_id = 'petcare-media');

