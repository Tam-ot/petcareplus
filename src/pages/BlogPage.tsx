import React, { useState } from 'react';
import {
  ArrowRight,
  CalendarClock,
  FileText,
  Film,
  Pencil,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_HERO_MEDIA } from '../data/petcareData';
import { BlogCategory, BlogPostItem, BlogPostStatus } from '../types';
import { EditorialImage } from '../components/EditorialImage';
import { formatDateTimeVi } from '../utils/video';

interface BlogPageProps {
  posts: BlogPostItem[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  adminName?: string;
  onOpenArticle: (slug: string) => void;
  onOpenCreatePost: () => void;
  onEditPost: (post: BlogPostItem) => void;
  onDeletePost: (post: BlogPostItem) => void;
  onPublishNow: (post: BlogPostItem) => void;
  onOpenAdminLogin: () => void;
}

type AdminStatusFilter = 'all' | BlogPostStatus;
type ContentTypeFilter = 'all' | 'article' | 'video';

export const BlogPage: React.FC<BlogPageProps> = ({
  posts,
  isAuthenticated,
  isAdmin,
  adminName,
  onOpenArticle,
  onOpenCreatePost,
  onEditPost,
  onDeletePost,
  onPublishNow,
  onOpenAdminLogin,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<BlogCategory>('Tất cả bài viết');
  const [selectedType, setSelectedType] = useState<ContentTypeFilter>('all');
  const [adminStatusFilter, setAdminStatusFilter] =
    useState<AdminStatusFilter>('all');

  const publishedCount = posts.filter(
    (p) => (p.status ?? 'published') === 'published'
  ).length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  const filteredPosts = posts.filter((post) => {
    const postStatus = post.status ?? 'published';
    if (!isAdmin && postStatus !== 'published') return false;
    if (isAdmin && adminStatusFilter !== 'all' && postStatus !== adminStatusFilter) {
      return false;
    }
    if (
      selectedCategory !== 'Tất cả bài viết' &&
      post.category !== selectedCategory
    ) {
      return false;
    }
    const postType = post.contentType ?? 'article';
    if (selectedType !== 'all' && postType !== selectedType) {
      return false;
    }
    return true;
  });

  const featuredPost =
    selectedCategory === 'Tất cả bài viết' &&
    selectedType === 'all' &&
    (!isAdmin || adminStatusFilter === 'all' || adminStatusFilter === 'published')
      ? filteredPosts.find(
          (post) => post.featured && (post.status ?? 'published') === 'published'
        ) ?? filteredPosts[0]
      : filteredPosts[0];

  const gridPosts = featuredPost
    ? filteredPosts.filter((post) => post.slug !== featuredPost.slug)
    : filteredPosts;

  const renderStatusBadge = (post: BlogPostItem) => {
    const status = post.status ?? 'published';
    if (status === 'scheduled') {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Lên lịch: {formatDateTimeVi(post.scheduledAt)}</span>
        </span>
      );
    }
    if (status === 'draft') {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Bản nháp</span>
        </span>
      );
    }
    return null;
  };

  const renderAdminActions = (post: BlogPostItem) => {
    if (!isAdmin) return null;
    const status = post.status ?? 'published';
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#233B53]/10 pt-3">
        <button
          type="button"
          onClick={() => onEditPost(post)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#233B53]/20 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#233B53] transition-colors hover:bg-[#F5F1E8]"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sửa</span>
        </button>

        {status !== 'published' && (
          <button
            type="button"
            onClick={() => onPublishNow(post)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#233B53] px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A2D40]"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Đăng ngay</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onDeletePost(post)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Xóa</span>
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Blog Hero */}
      <section className="bg-[#F5F1E8] py-12 sm:py-16 lg:py-22">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="text-[15px] font-semibold text-[#233B53]/80 sm:text-base">
                Blog PETCARE PLUS
              </p>
              <div
                aria-hidden="true"
                className="mt-2 h-0.5 w-10 rounded-full bg-[#E99A78]"
              />
              <h1 className="mt-3.5 font-[var(--font-display)] text-[clamp(2.2rem,3.8vw,3.35rem)] font-bold leading-[1.15] tracking-tight text-[#233B53]">
                Góc kiến thức thú cưng
              </h1>
              <p className="mt-5 text-base leading-relaxed text-[#332C28]/85 sm:text-xl">
                Những bài viết và video hữu ích giúp bạn hiểu và chăm sóc người bạn nhỏ tốt hơn mỗi ngày.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[24px] bg-white p-3 shadow-[0_12px_36px_-16px_rgba(35,59,83,0.12)]">
                <EditorialImage
                  src={BLOG_HERO_MEDIA.image}
                  alt={BLOG_HERO_MEDIA.alt}
                  aspectClass="aspect-[16/9]"
                  priority
                  className="rounded-[16px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Articles */}
      <section className="bg-white py-14 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          {/* Admin Management Bar */}
          {isAdmin ? (
            <div className="mb-8 rounded-[20px] border border-[#233B53]/15 bg-[#F5F1E8]/80 p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#233B53]">
                    <ShieldCheck
                      className="h-4 w-4 text-[#E99A78]"
                      aria-hidden="true"
                    />
                    <span>Chế độ Quản trị ({adminName ?? 'Admin'})</span>
                  </div>
                  <p className="mt-1 text-sm text-[#332C28]/80">
                    Bạn có quyền đăng bài viết, đăng video, chỉnh sửa và lên lịch tự động xuất bản.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenCreatePost}
                  className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233B53] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1A2D40]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Đăng bài viết / Video mới</span>
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#233B53]/10 pt-4">
                {(
                  [
                    { key: 'all', label: `Tất cả (${posts.length})` },
                    { key: 'published', label: `Đã đăng (${publishedCount})` },
                    { key: 'scheduled', label: `Đã lên lịch (${scheduledCount})` },
                    { key: 'draft', label: `Bản nháp (${draftCount})` },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setAdminStatusFilter(tab.key)}
                    className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      adminStatusFilter === tab.key
                        ? 'bg-[#233B53] text-white'
                        : 'bg-white text-[#233B53] hover:bg-[#EAE2D3]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#233B53]/15 bg-[#F5F1E8]/60 px-3.5 py-2 text-xs font-semibold text-[#233B53] transition-colors hover:bg-[#F5F1E8]"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#E99A78]" aria-hidden="true" />
                <span>Đăng nhập tài khoản Admin để đăng bài</span>
              </button>
            </div>
          ) : null}

          {/* Interactive Category & Content-Type Filter Controls */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#233B53]/10 pb-6 lg:flex-row lg:items-center">
            <div
              role="tablist"
              aria-label="Lọc bài viết theo chuyên mục"
              className="flex flex-wrap items-center gap-2"
            >
              {BLOG_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-[40px] cursor-pointer rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53] ${
                      isActive
                        ? 'bg-[#233B53] text-white'
                        : 'bg-[#F5F1E8] text-[#332C28]/85 hover:bg-[#EAE2D3] hover:text-[#233B53]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 self-start rounded-xl bg-[#F5F1E8] p-1 lg:self-auto">
              {(
                [
                  { key: 'all', label: 'Tất cả' },
                  { key: 'article', label: 'Bài viết' },
                  { key: 'video', label: 'Video' },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedType(item.key)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    selectedType === item.key
                      ? 'bg-white text-[#233B53] shadow-xs'
                      : 'text-[#332C28]/75 hover:text-[#233B53]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Article */}
          {featuredPost && (
            <article className="group mt-10 grid grid-cols-1 items-center gap-8 rounded-[24px] border border-[#233B53]/10 bg-[#F5F1E8]/60 p-4 sm:p-6 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <button
                  type="button"
                  onClick={() => onOpenArticle(featuredPost.slug)}
                  className="relative block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                >
                  <EditorialImage
                    src={featuredPost.image}
                    alt={featuredPost.imageAlt}
                    aspectClass="aspect-[16/10]"
                    className="rounded-[16px]"
                  />
                  {featuredPost.contentType === 'video' && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#233B53]/85 text-white shadow-lg backdrop-blur-xs transition-transform duration-200 group-hover:scale-105">
                        <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                  )}
                </button>
              </div>

              <div className="lg:col-span-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#332C28]/75">
                  <span className="font-semibold text-[#233B53]">
                    {featuredPost.contentType === 'video'
                      ? 'Video nổi bật'
                      : 'Bài viết nổi bật'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#233B53]/85">
                    {featuredPost.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{featuredPost.dateLabel}</span>
                </div>

                {isAdmin && renderStatusBadge(featuredPost) && (
                  <div className="mt-2.5">{renderStatusBadge(featuredPost)}</div>
                )}

                <h2 className="mt-3 font-[var(--font-display)] text-2xl font-bold leading-snug text-[#233B53] sm:text-3xl">
                  <button
                    type="button"
                    onClick={() => onOpenArticle(featuredPost.slug)}
                    className="cursor-pointer text-left transition-colors hover:text-[#E99A78]"
                  >
                    {featuredPost.title}
                  </button>
                </h2>

                <p className="mt-4 text-base leading-relaxed text-[#332C28]/85 sm:text-[17px]">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => onOpenArticle(featuredPost.slug)}
                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233B53] px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1A2D40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                  >
                    <span>
                      {featuredPost.contentType === 'video'
                        ? 'Xem video'
                        : 'Đọc bài viết'}
                    </span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {renderAdminActions(featuredPost)}
              </div>
            </article>
          )}

          {/* Responsive 3-column Article Grid */}
          {gridPosts.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
              {gridPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col justify-between rounded-[22px] border border-[#233B53]/10 bg-white p-5 transition-transform duration-200 hover:-translate-y-1"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenArticle(post.slug)}
                      className="relative block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                    >
                      <EditorialImage
                        src={post.image}
                        alt={post.imageAlt}
                        aspectClass="aspect-[4/3]"
                        className="rounded-[14px]"
                      />
                      {post.contentType === 'video' && (
                        <>
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#233B53]/85 text-white shadow-md backdrop-blur-xs transition-transform duration-200 group-hover:scale-105">
                              <Play
                                className="ml-0.5 h-5 w-5 fill-current"
                                aria-hidden="true"
                              />
                            </span>
                          </span>
                          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-[#233B53]/90 px-2.5 py-1 text-xs font-semibold text-white">
                            <Film className="h-3 w-3 text-[#E99A78]" aria-hidden="true" />
                            <span>Video</span>
                          </span>
                        </>
                      )}
                    </button>

                    {isAdmin && renderStatusBadge(post) && (
                      <div className="mt-3">{renderStatusBadge(post)}</div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-[#332C28]/70">
                      <span className="font-semibold text-[#233B53]">
                        {post.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{post.dateLabel}</span>
                    </div>

                    <h3 className="mt-2.5 font-[var(--font-display)] text-xl font-bold leading-snug text-[#233B53]">
                      <button
                        type="button"
                        onClick={() => onOpenArticle(post.slug)}
                        className="cursor-pointer text-left transition-colors hover:text-[#E99A78]"
                      >
                        {post.title}
                      </button>
                    </h3>

                    <p className="mt-3 text-[15px] leading-relaxed text-[#332C28]/80 sm:text-base">
                      {post.excerpt}
                    </p>
                  </div>

                  <div>
                    <div className="mt-6 pt-2">
                      <button
                        type="button"
                        onClick={() => onOpenArticle(post.slug)}
                        className="inline-flex cursor-pointer items-center gap-1.5 text-[15px] font-semibold text-[#233B53] transition-colors hover:text-[#E99A78]"
                      >
                        <span>
                          {post.contentType === 'video' ? 'Xem video' : 'Đọc thêm'}
                        </span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    {renderAdminActions(post)}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            !featuredPost && (
              <div className="mt-10 rounded-[20px] border border-[#233B53]/10 bg-[#F5F1E8]/50 p-10 text-center">
                <p className="text-base font-medium text-[#233B53]">
                  Hiện chưa có bài viết hoặc video nào phù hợp với bộ lọc này.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};
