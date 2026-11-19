import React from 'react';
import { ExternalLink } from 'lucide-react';
import { PageRoute } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onSelectServiceForContact: (serviceValue: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectServiceForContact,
}) => {
  const footerServices = [
    {
      label: 'Chăm sóc chó',
      serviceValue: 'Tư vấn định hướng chăm sóc chó',
    },
    {
      label: 'Chăm sóc mèo',
      serviceValue: 'Tư vấn định hướng chăm sóc mèo',
    },
    {
      label: 'Tư vấn chăm sóc',
      serviceValue: 'Hỗ trợ xây dựng thói quen và lịch sinh hoạt',
    },
    {
      label: 'Hỗ trợ lựa chọn dịch vụ',
      serviceValue: 'Trao đổi quy trình chuẩn bị trước khi sử dụng dịch vụ',
    },
  ];

  return (
    <footer className="border-t border-[#233B53]/10 bg-[#233B53] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8 lg:px-10 lg:py-16 xl:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              aria-label="PETCARE PLUS — Về đầu trang"
              className="cursor-pointer rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <BrandLogo variant="light" />
            </button>
            <p className="text-[15px] leading-relaxed text-pretty text-white/80">
              Thương hiệu chăm sóc thú cưng cho dự án giáo dục, đồng hành cùng chủ nuôi chó mèo bằng thông tin rõ ràng và tận tâm.
            </p>
          </div>

          {/* Column 2: Điều hướng */}
          <div>
            <h3 className="font-[var(--font-display)] text-[15px] font-semibold tracking-wide text-[#E99A78]">
              Điều hướng
            </h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="cursor-pointer text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('blog')}
                  className="cursor-pointer text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="cursor-pointer text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Liên hệ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Dịch vụ */}
          <div>
            <h3 className="font-[var(--font-display)] text-[15px] font-semibold tracking-wide text-[#E99A78]">
              Dịch vụ
            </h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              {footerServices.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => onSelectServiceForContact(item.serviceValue)}
                    className="cursor-pointer text-left text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Kết nối (Placeholders only) */}
          <div>
            <h3 className="font-[var(--font-display)] text-[15px] font-semibold tracking-wide text-[#E99A78]">
              Kết nối
            </h3>
            <ul className="mt-4 space-y-3 text-[15px] text-white/85">
              <li>
                <span className="block text-xs text-white/60">Email</span>
                <span>lienhe@petcareplus.example</span>
              </li>
              <li>
                <span className="block text-xs text-white/60">Mạng xã hội</span>
                <a
                  href="https://www.facebook.com/profile.php?id=61584712196254"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/90 underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#E99A78] hover:decoration-[#E99A78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Fanpage Facebook PETCARE PLUS</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-75" aria-hidden="true" />
                </a>
              </li>
              <li>
                <span className="block text-xs text-white/60">Thông tin liên hệ</span>
                <span>(000) 000-0000 · Hỗ trợ trực tuyến</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/15 pt-8 text-xs text-white/70 sm:flex-row sm:items-center">
          <p>
            © 2026 PETCARE PLUS. Dự án thương hiệu chăm sóc thú cưng phục vụ mục đích học tập và giáo dục.
          </p>
          <p>
            Các thông tin liên hệ và ngày đăng trên website đều là dữ liệu minh họa.
          </p>
        </div>
      </div>
    </footer>
  );
};
