import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  HeartHandshake,
  MessageSquare,
  Play,
  Search,
} from 'lucide-react';
import {
  ABOUT_MEDIA,
  BRAND_VALUES,
  FEATURED_SERVICES,
  PROCESS_STEPS,
  SERVICE_CATEGORIES,
} from '../data/petcareData';
import { BlogPostItem, PageRoute } from '../types';
import { EditorialImage } from '../components/EditorialImage';

interface HomePageProps {
  posts: BlogPostItem[];
  onNavigate: (page: PageRoute) => void;
  onOpenArticle: (slug: string) => void;
  onSelectServiceForContact: (serviceValue: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  posts,
  onNavigate,
  onOpenArticle,
  onSelectServiceForContact,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderProcessIcon = (
    key: 'search' | 'check' | 'message' | 'clipboard'
  ) => {
    const iconProps = { className: 'h-5 w-5 text-[#233B53]', 'aria-hidden': true as const };
    switch (key) {
      case 'search':
        return <Search {...iconProps} />;
      case 'check':
        return <CheckCircle2 {...iconProps} />;
      case 'message':
        return <MessageSquare {...iconProps} />;
      case 'clipboard':
        return <ClipboardCheck {...iconProps} />;
    }
  };

  const renderValueIcon = (key: 'book' | 'compass' | 'heart') => {
    const iconProps = { className: 'h-6 w-6 text-[#233B53]', 'aria-hidden': true as const };
    switch (key) {
      case 'book':
        return <BookOpen {...iconProps} />;
      case 'compass':
        return <Compass {...iconProps} />;
      case 'heart':
        return <HeartHandshake {...iconProps} />;
    }
  };

  const latestPosts = posts
    .filter((post) => (post.status ?? 'published') === 'published')
    .slice(0, 3);

  return (
    <div>
      {/* SECTION 1: HERO BANNER */}
      <section className="relative overflow-hidden bg-[#F5F1E8] py-12 sm:py-16 lg:py-24">
        {/* Soft organic decorative backdrop shapes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#E99A78]/15 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#233B53]/5 blur-2xl"
        />

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div>
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10 lg:gap-14">
              {/* Left messaging */}
              <div className="md:col-span-7">
                <p className="text-[15px] font-semibold tracking-wide text-[#233B53]/80 sm:text-base">
                  PETCARE PLUS · Đồng hành cùng chủ nuôi chó mèo
                </p>
                <div aria-hidden="true" className="mt-2.5 h-0.5 w-12 rounded-full bg-[#E99A78]" />
                <h1 className="mt-5 font-[var(--font-display)] text-[clamp(1.25rem,5.2vw,2rem)] font-bold leading-[1.18] tracking-[-0.02em] text-[#233B53] [text-wrap:normal] md:text-[clamp(1.65rem,3vw,3rem)]">
                  <span className="block whitespace-nowrap">MINH BẠCH MỌI QUY TRÌNH,</span>
                  <span className="block whitespace-nowrap">AN TÂM GIAO PHÓ THÚ CƯNG</span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#332C28]/85 sm:text-xl">
                  Đồng hành cùng bạn trong việc lựa chọn dịch vụ chăm sóc phù hợp cho chó và mèo.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => scrollToSection('danh-muc-dich-vu')}
                    className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233B53] px-8 py-3.5 text-base font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#1A2D40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                  >
                    <span>Khám phá dịch vụ</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('gioi-thieu')}
                    className="inline-flex min-h-[52px] cursor-pointer items-center justify-center rounded-xl border border-[#233B53]/25 bg-white/80 px-8 py-3.5 text-base font-semibold text-[#233B53] whitespace-nowrap transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                  >
                    Tìm hiểu thêm
                  </button>
                </div>
              </div>

              {/* Right editorial photography */}
              <div className="md:col-span-5">
                <div className="mx-auto w-full max-w-[640px]">
                  <EditorialImage
                    src="/assets/aistudio/Golden_Retriever_and_Cozy_Cat_Companions_b2cc2ea9.jpg"
                    alt="Chú chó Golden Retriever, chó Corgi, mèo xám và mèo con lông cam nằm cạnh nhau trên thảm kem ấm áp"
                    aspectClass="aspect-[4/3]"
                    imgClassName="object-center rounded-[28px]"
                    priority
                    className="!rounded-[28px] !bg-transparent [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_80%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_80%,transparent_100%)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: GIỚI THIỆU PETCARE PLUS */}
      <section id="gioi-thieu" className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left content */}
            <div className="lg:col-span-6">
              <p className="text-[15px] font-semibold text-[#233B53]/80 sm:text-base">
                Về PETCARE PLUS
              </p>
              <div aria-hidden="true" className="mt-2 h-0.5 w-10 rounded-full bg-[#E99A78]" />
              <h2 className="mt-3.5 font-[var(--font-display)] text-3xl font-bold leading-snug tracking-tight text-[#233B53] sm:text-4xl lg:text-[2.65rem]">
                Chăm sóc thú cưng bằng sự thấu hiểu
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#332C28]/85 sm:text-lg lg:text-[19px]">
                PETCARE PLUS mong muốn trở thành người bạn đồng hành của những người yêu thú cưng, mang đến thông tin rõ ràng và hỗ trợ bạn tìm kiếm giải pháp chăm sóc phù hợp.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#332C28]/75 sm:text-lg">
                Chúng tôi tin rằng mỗi chú chó, chú mèo đều xứng đáng được lắng nghe nhu cầu riêng từ thói quen sinh hoạt đến cảm xúc khi tiếp xúc môi trường mới. Vì vậy, mọi cuộc trao đổi tại PETCARE PLUS luôn bắt đầu từ sự rõ ràng và minh bạch.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-[#233B53]/10 pt-6">
                <button
                  type="button"
                  onClick={() => scrollToSection('quy-trinh')}
                  className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-[#233B53] transition-colors hover:text-[#E99A78]"
                >
                  <span>Xem quy trình 4 bước minh bạch</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right lifestyle photography */}
            <div className="lg:col-span-6">
              <div className="group rounded-[24px] bg-[#F5F1E8] p-3">
                <EditorialImage
                  src={ABOUT_MEDIA.image}
                  alt={ABOUT_MEDIA.alt}
                  aspectClass="aspect-[4/3]"
                  className="rounded-[16px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DANH MỤC DỊCH VỤ */}
      <section
        id="danh-muc-dich-vu"
        className="relative overflow-hidden bg-[#F5F1E8] bg-[radial-gradient(circle_at_12%_28%,rgba(233,154,120,0.28),transparent_42%),radial-gradient(circle_at_88%_72%,rgba(35,59,83,0.14),transparent_45%),radial-gradient(circle_at_50%_20%,rgba(233,154,120,0.18),transparent_40%)] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="max-w-3xl">
            <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#233B53] sm:text-4xl lg:text-[2.65rem]">
              Dịch vụ dành cho thú cưng
            </h2>
            <p className="mt-3 text-base text-[#332C28]/80 sm:text-lg lg:text-xl">
              Mỗi thú cưng đều có những nhu cầu chăm sóc riêng.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8">
            {SERVICE_CATEGORIES.map((category, index) => (
              <motion.article
                key={category.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: shouldReduceMotion ? 0 : index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }
                }
                className="group flex flex-col justify-between rounded-[22px] border border-white/75 bg-white/45 p-5 shadow-[0_10px_32px_-10px_rgba(35,59,83,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-1 ring-[#233B53]/8 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-200 hover:bg-white/60 hover:shadow-[0_14px_36px_-10px_rgba(35,59,83,0.16),inset_0_1px_1px_rgba(255,255,255,0.95)]"
              >
                <div>
                  <EditorialImage
                    src={category.image}
                    alt={category.imageAlt}
                    aspectClass="aspect-[4/3]"
                    className="rounded-[14px]"
                  />
                  <h3 className="mt-5 font-[var(--font-display)] text-lg font-bold tracking-tight text-[#233B53]">
                    {category.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#332C28]/80 sm:text-base">
                    {category.description}
                  </p>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectServiceForContact(category.targetServiceValue)
                    }
                    className="inline-flex cursor-pointer items-center gap-1.5 text-[15px] font-semibold text-[#233B53] transition-colors hover:text-[#E99A78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                  >
                    <span>Tìm hiểu thêm</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: DỊCH VỤ NỔI BẬT */}
      <section
        id="dich-vu-noi-bat"
        className="bg-white py-16 sm:py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[15px] font-semibold text-[#233B53]/80 sm:text-base">
                Thông tin &amp; Định hướng minh bạch
              </p>
              <div aria-hidden="true" className="mt-2 h-0.5 w-10 rounded-full bg-[#E99A78]" />
              <h2 className="mt-2.5 font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#233B53] sm:text-4xl lg:text-[2.65rem]">
                Khám phá các dịch vụ nổi bật
              </h2>
            </div>
            <p className="max-w-lg text-[15px] leading-relaxed text-[#332C28]/75 sm:text-base">
              Tập trung cung cấp thông tin chi tiết, minh bạch từng bước chuẩn bị và hỗ trợ bạn chọn đúng giải pháp cho người bạn nhỏ.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-10">
            {FEATURED_SERVICES.map((service, index) => (
              <motion.article
                key={service.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }
                }
                className="group flex flex-col justify-between rounded-[22px] border border-[#233B53]/10 bg-[#F5F1E8]/55 p-6 transition-colors duration-200 hover:bg-[#F5F1E8]"
              >
                <div>
                  <EditorialImage
                    src={service.image}
                    alt={service.imageAlt}
                    aspectClass="aspect-[4/3]"
                    className="rounded-[14px]"
                  />

                  <p className="mt-5 text-[13px] font-medium text-[#233B53]/75 sm:text-sm">
                    Phù hợp: {service.suitableFor}
                  </p>

                  <h3 className="mt-2.5 font-[var(--font-display)] text-xl font-bold leading-snug text-[#233B53]">
                    {service.name}
                  </h3>

                  <p className="mt-3 text-[15px] leading-relaxed text-[#332C28]/85 sm:text-base">
                    {service.description}
                  </p>

                  <div className="mt-4 border-t border-[#233B53]/10 pt-4">
                    <p className="text-sm leading-relaxed text-[#332C28]/75">
                      <span className="font-semibold text-[#233B53]">
                        Điểm minh bạch quy trình:{' '}
                      </span>
                      {service.processHighlight}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectServiceForContact(service.serviceValue)
                    }
                    className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233B53] px-5 py-3 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-[#1A2D40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                  >
                    <span>Tìm hiểu dịch vụ</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: QUY TRÌNH SỬ DỤNG DỊCH VỤ */}
      <section
        id="quy-trinh"
        className="relative overflow-hidden bg-[#F5F1E8] bg-[radial-gradient(circle_at_15%_75%,rgba(233,154,120,0.28),transparent_42%),radial-gradient(circle_at_85%_35%,rgba(35,59,83,0.14),transparent_45%),radial-gradient(circle_at_52%_85%,rgba(233,154,120,0.2),transparent_40%)] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="max-w-2xl">
            <p className="text-[15px] font-semibold text-[#233B53]/80 sm:text-base">
              Quy trình 4 bước rõ ràng
            </p>
            <div aria-hidden="true" className="mt-2 h-0.5 w-10 rounded-full bg-[#E99A78]" />
            <h2 className="mt-2.5 font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#233B53] sm:text-4xl lg:text-[2.65rem]">
              Đơn giản trong từng bước
            </h2>
          </div>

          <div className="relative mt-12">
            {/* Subtle horizontal timeline connector on desktop */}
            <div
              aria-hidden="true"
              className="absolute left-8 right-8 top-6 hidden h-px bg-[#233B53]/20 lg:block"
            />

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4 xl:gap-8">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="relative flex flex-col rounded-[22px] border border-white/75 bg-white/45 p-7 shadow-[0_10px_32px_-10px_rgba(35,59,83,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-1 ring-[#233B53]/8 backdrop-blur-xl backdrop-saturate-150 transition-all duration-200 hover:bg-white/60 hover:shadow-[0_14px_36px_-10px_rgba(35,59,83,0.16),inset_0_1px_1px_rgba(255,255,255,0.95)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/75 bg-white/65 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md">
                      {renderProcessIcon(step.iconKey)}
                    </span>
                    <span className="font-[var(--font-display)] text-2xl font-bold tabular-nums text-[#233B53]/40 sm:text-3xl">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 font-[var(--font-display)] text-lg font-bold tracking-tight text-[#233B53]">
                    {step.number} – {step.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#332C28]/85 sm:text-base">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE US */}
      <section className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="max-w-2xl">
            <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#233B53] sm:text-4xl lg:text-[2.65rem]">
              Vì sao chọn PETCARE PLUS?
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 xl:gap-10">
            {BRAND_VALUES.map((item) => (
              <div
                key={item.id}
                className="rounded-[22px] border border-[#233B53]/10 bg-[#F5F1E8]/45 p-8"
              >
                <div className="inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-[#E99A78]/20">
                  {renderValueIcon(item.iconKey)}
                </div>
                <h3 className="mt-5 font-[var(--font-display)] text-xl font-bold tracking-tight text-[#233B53]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#332C28]/80 sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: LATEST BLOG POSTS */}
      <section className="relative overflow-hidden bg-[#F5F1E8] bg-[radial-gradient(circle_at_14%_72%,rgba(233,154,120,0.28),transparent_42%),radial-gradient(circle_at_86%_30%,rgba(35,59,83,0.14),transparent_45%),radial-gradient(circle_at_52%_82%,rgba(233,154,120,0.18),transparent_40%)] py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[15px] font-semibold text-[#233B53]/80 sm:text-base">
                Chia sẻ từ PETCARE PLUS
              </p>
              <div aria-hidden="true" className="mt-2 h-0.5 w-10 rounded-full bg-[#E99A78]" />
              <h2 className="mt-2.5 font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#233B53] sm:text-4xl lg:text-[2.65rem]">
                Kiến thức chăm sóc thú cưng
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('blog')}
              className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl border border-[#233B53]/20 bg-white px-6 py-3 text-[15px] font-semibold text-[#233B53] whitespace-nowrap transition-colors hover:bg-[#233B53] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53] sm:self-auto"
            >
              <span>Xem tất cả bài viết</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 xl:gap-10">
            {latestPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-[22px] border border-white/75 bg-white/45 p-5 shadow-[0_10px_32px_-10px_rgba(35,59,83,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-1 ring-[#233B53]/8 backdrop-blur-xl backdrop-saturate-150 transition-all duration-200 hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_14px_36px_-10px_rgba(35,59,83,0.16),inset_0_1px_1px_rgba(255,255,255,0.95)]"
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
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#233B53]/85 text-white shadow-md">
                          <Play
                            className="ml-0.5 h-5 w-5 fill-current"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                    )}
                  </button>

                  {/* Unboxed metadata per zero-pill discipline */}
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
                      className="cursor-pointer text-left transition-colors hover:text-[#E99A78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                    >
                      {post.title}
                    </button>
                  </h3>

                  <p className="mt-3 text-[15px] leading-relaxed text-[#332C28]/80 sm:text-base">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenArticle(post.slug)}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-[15px] font-semibold text-[#233B53] transition-colors hover:text-[#E99A78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                  >
                    <span>Đọc thêm</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="relative overflow-hidden rounded-[26px] bg-[#F5F1E8] px-6 py-14 sm:px-14 sm:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#E99A78]/20"
            />
            <div className="relative mx-auto max-w-3xl text-center">
              <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#233B53] sm:text-4xl lg:text-[2.65rem]">
                Bạn cần hỗ trợ lựa chọn dịch vụ?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#332C28]/85 sm:text-xl">
                PETCARE PLUS sẵn sàng đồng hành cùng bạn tìm hiểu những giải pháp chăm sóc phù hợp cho thú cưng.
              </p>
              <div className="mt-9">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233B53] px-9 py-3.5 text-base font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#1A2D40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53]"
                >
                  <span>Liên hệ với chúng tôi</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
