export type ParsedVideoSource =
  | { kind: 'iframe'; embedUrl: string; provider: 'youtube' | 'vimeo' }
  | { kind: 'video'; src: string }
  | { kind: 'invalid' };

export function parseVideoSource(rawUrl?: string): ParsedVideoSource {
  if (!rawUrl || !rawUrl.trim()) {
    return { kind: 'invalid' };
  }

  const trimmed = rawUrl.trim();

  // Relative uploaded video path (e.g. /uploads/...)
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('blob:') || trimmed.startsWith('data:video/')) {
    return { kind: 'video', src: trimmed };
  }

  // YouTube patterns: watch?v=, youtu.be/, shorts/, embed/
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      kind: 'iframe',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      provider: 'youtube',
    };
  }

  // Vimeo pattern
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      kind: 'iframe',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      provider: 'vimeo',
    };
  }

  // Direct video URLs (.mp4, .webm, .ogg, .mov) or general https video links
  if (/^https?:\/\/.+\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return { kind: 'video', src: trimmed };
  }

  // Fallback for direct URLs that may serve video streams
  if (/^https?:\/\//i.test(trimmed)) {
    return { kind: 'video', src: trimmed };
  }

  return { kind: 'invalid' };
}

export function formatDateVi(isoString?: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTimeVi(isoString?: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} · ${hours}:${minutes}`;
}

export function toDatetimeLocalValue(isoString?: string): string {
  const date = isoString ? new Date(isoString) : new Date(Date.now() + 60 * 60 * 1000);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

