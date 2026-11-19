import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  FileText,
  Film,
  Pencil,
  Play,
} from 'lucide-react';
import { BlogPostItem } from '../types';
import { EditorialImage } from '../components/EditorialImage';
import { formatDateTimeVi, parseVideoSource } from '../utils/video';

interface BlogDetailPageProps {
  article: BlogPostItem;
  allPosts: BlogPostItem[];
  isAdmin: boolean;
  onEditArticle: (post: BlogPostItem) => void;
  onBackToBlog: () => void;
  onOpenArticle: (slug: string) => void;
  onSelectServiceForContact: (serviceValue: string) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  article,
  allPosts,
  isAdmin,
  onEditArticle,
  onBackToBlog,
  onOpenArticle,
  onSelectServiceForContact,
}) => {
  const relatedPosts = allPosts
    .filter(
      (post) =>
        post.slug !== article.slug && (post.status ?? 'published') === 'published'
    )
    .slice(0, 3);

  const parsedVideo =
    article.contentType === 'video'
      ? parseVideoSource(article.videoUrl)
      : { kind: 'invalid' as const };

  const status = article.status ?? 'published';

  return (
    <div>
      {/* Article Header & Content */}
      <article className="bg-white py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBackToBlog}
              className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-xl border border-[#233B53]/15 bg-[#F5F1E8]/60 px-5 py-2 text-[15px] font-semibold text-[#233B53] transition-colors hover:bg-[#F5F1E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Quay lại Blog</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => onEditArticle(article)}
                className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-xl bg-[#233B53] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1A2D40]"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                <span>Chỉnh sửa bài đăng</span>
              </button>
            )}
          </div>

          {/* Admin status banner for scheduled / draft */}
          {isAdmin && status !== 'published' && (
            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm font-medium text-amber-900">
              {status === 'scheduled' ? (
                <>
                  <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    Bài viết đang ở trạng thái <strong>Đã lên lịch</strong> — sẽ tự động hiển thị công khai vào{' '}
                    <strong>{formatDateTimeVi(article.scheduledAt)}</strong>.
                  </span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    Đây là <strong>Bản nháp</strong> — chỉ tài khoản Admin mới có thể xem.
                  </span>
                </>
              )}
            </div>
          )}

          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-2 text-[15px] text-[#332C28]/75">
              {article.contentType === 'video' && (
                <>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#E99A78]/25 px-2.5 py-0.5 text-xs font-semibold text-[#233B53]">
                    <Film className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Video</span>
                  </span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span className="font-semibold text-[#233B53]">
                {article.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{article.dateLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{article.readTime}</span>
            </div>

            <h1 className="mt-3 font-[var(--font-display)] text-[clamp(2rem,3.6vw,3.1rem)] font-bold leading-[1.18] tracking-tight text-[#233B53]">
              {article.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[#332C28]/85 sm:text-xl">
              {article.excerpt}
            </p>
          </header>

          {/* Hero Media: Video Player OR Cover Image */}
          <div className="mt-9 rounded-[24px] bg-[#F5F1E8] p-3">
            {parsedVideo.kind !== 'invalid' ? (
              <div className="aspect-video w-full overflow-hidden rounded-[16px] bg-black">
                {parsedVideo.kind === 'iframe' ? (
                  <iframe
                    src={parsedVideo.embedUrl}
                    title={article.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={parsedVideo.src}
                    poster={article.image}
                    controls
                    playsInline
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            ) : (
              <EditorialImage
                src={article.image}
                alt={article.imageAlt}
                aspectClass="aspect-[16/9]"
                priority
                className="rounded-[16px]"
              />
            )}
          </div>

          <div className="mx-auto mt-12 max-w-4xl space-y-9">
            {article.sections.map((section, sectionIdx) => (
              <section key={`${section.heading}-${sectionIdx}`} className="space-y-4">
                <h2 className="font-[var(--font-display)] text-2xl font-bold leading-snug text-[#233B53] sm:text-[1.75rem]">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-base leading-[1.8] text-[#332C28]/90 sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-2.5 rounded-[16px] bg-[#F5F1E8]/70 p-5 text-sm leading-relaxed text-[#332C28]/90 sm:text-base">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={`${bullet}-${bIdx}`} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E99A78]"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Helpful consultation bridge */}
            <div className="mt-10 rounded-[20px] border border-[#233B53]/10 bg-[#F5F1E8] p-6 sm:p-8">
              <h3 className="font-[var(--font-display)] text-lg font-bold text-[#233B53]">
                Bạn muốn tìm hiểu dịch vụ phù hợp với bài viết này?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#332C28]/80 sm:text-base">
                Hãy chia sẻ thông tin về thú cưng của bạn để PETCARE PLUS hỗ trợ định hướng lựa chọn phù hợp nhất.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onSelectServiceForContact(article.relatedServiceValue)
                  }
                  className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233B53] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1A2D40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                >
                  <span>Tư vấn dịch vụ liên quan</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onBackToBlog}
                  className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-[#233B53]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#233B53] transition-colors hover:bg-[#F5F1E8]"
                >
                  Quay lại Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#F5F1E8] py-14 sm:py-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
            <h2 className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-[#233B53] sm:text-3xl">
              Bài viết liên quan
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 xl:gap-10">
              {relatedPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col justify-between rounded-[22px] border border-[#233B53]/10 bg-white p-5 transition-transform duration-200 hover:-translate-y-1"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenArticle(post.slug)}
                      className="relative block w-full cursor-pointer text-left"
                    >
                      <EditorialImage
                        src={post.image}
                        alt={post.imageAlt}
                        aspectClass="aspect-[4/3]"
                        className="rounded-[14px]"
                      />
                      {post.contentType === 'video' && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#233B53]/85 text-white shadow-md">
                            <Play
                              className="ml-0.5 h-4 w-4 fill-current"
                              aria-hidden="true"
                            />
                          </span>
                        </span>
                      )}
                    </button>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#332C28]/70">
                      <span className="font-semibold text-[#233B53]">
                        {post.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{post.dateLabel}</span>
                    </div>

                    <h3 className="mt-2 font-[var(--font-display)] text-base font-bold leading-snug text-[#233B53]">
                      <button
                        type="button"
                        onClick={() => onOpenArticle(post.slug)}
                        className="cursor-pointer text-left transition-colors hover:text-[#E99A78]"
                      >
                        {post.title}
                      </button>
                    </h3>
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenArticle(post.slug)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-[#233B53] transition-colors hover:text-[#E99A78]"
                    >
                      <span>
                        {post.contentType === 'video' ? 'Xem video' : 'Đọc thêm'}
                      </span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
