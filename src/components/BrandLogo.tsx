import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'dark' }) => {
  const isLight = variant === 'light';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      {isLight ? (
        <span
          aria-hidden="true"
          className="relative h-10 w-12 shrink-0 overflow-hidden rounded-xl bg-white"
        >
          <img
            src="/assets/aistudio/logo_e170d431.png"
            alt=""
            referrerPolicy="no-referrer"
            className="absolute -left-[42%] -top-[44%] h-auto w-[184%] max-w-none"
          />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="relative h-10 w-12 shrink-0 overflow-hidden"
        >
          <img
            src="/assets/aistudio/logo_e170d431.png"
            alt=""
            referrerPolicy="no-referrer"
            className="absolute -left-[50%] -top-[52.5%] h-auto w-[200%] max-w-none mix-blend-multiply"
          />
        </span>
      )}
      <span
        className={`font-[var(--font-display)] text-[19px] font-extrabold tracking-[0.04em] whitespace-nowrap shrink-0 ${
          isLight ? 'text-white' : 'text-[#233B53]'
        }`}
      >
        PETCARE{' '}
        <span className="font-light tracking-[0.06em] text-[#E99A78]">
          PLUS
        </span>
      </span>
    </span>
  );
};
