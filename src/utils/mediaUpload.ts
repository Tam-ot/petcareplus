const MAX_IMAGE_WIDTH = 1600;
const IMAGE_QUALITY = 0.82;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_RAW_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB before compression

/**
 * Compresses and resizes raster images (JPG/PNG/WebP) on the client
 * using an offscreen Canvas before uploading to save storage & bandwidth.
 * Animated GIFs are kept untouched.
 */
export async function optimizeImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }

  if (file.size > MAX_RAW_IMAGE_BYTES) {
    throw new Error('Ảnh gốc vượt quá 15MB. Vui lòng chọn ảnh nhẹ hơn.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Không thể đọc tệp ảnh này.'));
      el.src = objectUrl;
    });

    const scale =
      img.naturalWidth > MAX_IMAGE_WIDTH
        ? MAX_IMAGE_WIDTH / img.naturalWidth
        : 1;
    const targetWidth = Math.max(1, Math.round(img.naturalWidth * scale));
    const targetHeight = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const outputType = 'image/webp';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, IMAGE_QUALITY)
    );

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.webp`, { type: outputType });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function validateVideoForUpload(file: File): void {
  if (!file.type.startsWith('video/')) {
    throw new Error('Vui lòng chọn tệp video hợp lệ (MP4, WebM, MOV).');
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error(
      'Tệp video vượt quá 50MB. Với video dài hoặc chất lượng cao, hãy đăng lên YouTube/Vimeo rồi dán đường dẫn vào ô Video để tải nhanh hơn.'
    );
  }
}

