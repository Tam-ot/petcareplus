import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectClass?: string;
  priority?: boolean;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = 'object-center',
  aspectClass = 'aspect-[4/3]',
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] bg-[#EFE9DC] ${aspectClass} ${className}`}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] ${imgClassName}`}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F5F1E8] to-[#EAE2D3] p-6 text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#233B53]/10 text-[#233B53]">
            <PawPrint className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="max-w-xs text-sm font-medium text-[#233B53]/80">
            {alt}
          </p>
        </div>
      )}
    </div>
  );
};
