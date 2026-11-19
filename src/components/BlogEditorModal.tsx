import React, { useEffect, useState } from 'react';
import {
  CalendarClock,
  FileText,
  Film,
  Image as ImageIcon,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { BLOG_CATEGORIES, SERVICE_OPTIONS } from '../data/petcareData';
import {
  SavePostPayload,
  createBlogPost,
  updateBlogPost,
  uploadMediaFile,
} from '../services/blogApi';
import {
  BlogContentType,
  BlogPostItem,
  BlogPostStatus,
} from '../types';
import {
  formatDateTimeVi,
  parseVideoSource,
  toDatetimeLocalValue,
} from '../utils/video';

interface BlogEditorModalProps {
  open: boolean;
  editingPost: BlogPostItem | null;
  onClose: () => void;
  onSaved: (post: BlogPostItem) => void;
}

interface EditableSection {
  heading: string;
  bodyText: string;
  bulletsText: string;
  image: string;
  imageCaption: string;
}

const PRESET_IMAGES = [
  {
    label: 'Chó & mèo nghỉ ngơi',
    url: '/src/assets/images/blog_dog_cat_hero_1794822133750.jpg',
  },
  {
    label: 'Chăm sóc chó tại nhà',
    url: '/src/assets/images/blog_pet_care_home_1794822134079.jpg',
  },
  {
    label: 'Chăm sóc chó Shiba',
    url: '/src/assets/images/service_dog_care_1794822129836.jpg',
  },
  {
    label: 'Chăm sóc mèo thư giãn',
    url: '/src/assets/images/service_cat_care_1794822130399.jpg',
  },
  {
    label: 'Tư vấn cùng thú cưng',
    url: '/src/assets/images/service_consultation_care_1794822132029.jpg',
  },
  {
    label: 'Chủ nuôi & Golden',
    url: '/src/assets/images/about_owner_pet_1794822132133.jpg',
  },
];

const SELECTABLE_CATEGORIES = BLOG_CATEGORIES.filter(
  (c): c is BlogPostItem['category'] => c !== 'Tất cả bài viết'
);

export const BlogEditorModal: React.FC<BlogEditorModalProps> = ({
  open,
  editingPost,
  onClose,
  onSaved,
}) => {
  const [contentType, setContentType] = useState<BlogContentType>('article');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlogPostItem['category']>(
    SELECTABLE_CATEGORIES[0]
  );
  const [excerpt, setExcerpt] = useState('');
  const [readTime, setReadTime] = useState('4 phút đọc');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [imageAlt, setImageAlt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [relatedServiceValue, setRelatedServiceValue] = useState(
    SERVICE_OPTIONS[0]
  );
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<BlogPostStatus>('published');
  const [scheduledLocal, setScheduledLocal] = useState(toDatetimeLocalValue());
  const [sections, setSections] = useState<EditableSection[]>([
    { heading: '', bodyText: '', bulletsText: '', image: '', imageCaption: '' },
  ]);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingSectionIdx, setUploadingSectionIdx] = useState<number | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);

    if (editingPost) {
      setContentType(editingPost.contentType ?? 'article');
      setTitle(editingPost.title);
      setCategory(editingPost.category);
      setExcerpt(editingPost.excerpt);
      setReadTime(editingPost.readTime);
      setImage(editingPost.image);
      setImageAlt(editingPost.imageAlt);
      setVideoUrl(editingPost.videoUrl ?? '');
      setRelatedServiceValue(
        editingPost.relatedServiceValue || SERVICE_OPTIONS[0]
      );
      setFeatured(Boolean(editingPost.featured));
      setStatus(editingPost.status ?? 'published');
      setScheduledLocal(toDatetimeLocalValue(editingPost.scheduledAt));
      setSections(
        editingPost.sections.length > 0
          ? editingPost.sections.map((s) => ({
              heading: s.heading,
              bodyText: s.paragraphs.join('\n\n'),
              bulletsText: (s.bullets ?? []).join('\n'),
              image: s.image ?? '',
              imageCaption: s.imageCaption ?? '',
            }))
          : [
              {
                heading: '',
                bodyText: '',
                bulletsText: '',
                image: '',
                imageCaption: '',
              },
            ]
      );
    } else {
      setContentType('article');
      setTitle('');
      setCategory(SELECTABLE_CATEGORIES[0]);
      setExcerpt('');
      setReadTime('4 phút đọc');
      setImage(PRESET_IMAGES[0].url);
      setImageAlt('');
      setVideoUrl('');
      setRelatedServiceValue(SERVICE_OPTIONS[0]);
      setFeatured(false);
      setStatus('published');
      setScheduledLocal(toDatetimeLocalValue());
      setSections([
        { heading: '', bodyText: '', bulletsText: '', image: '', imageCaption: '' },
      ]);
    }
  }, [open, editingPost]);

  if (!open) return null;

  const handleContentTypeChange = (nextType: BlogContentType) => {
    setContentType(nextType);
    if (!editingPost) {
      setReadTime(nextType === 'video' ? '3 phút xem' : '4 phút đọc');
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingImage(true);
    try {
      const url = await uploadMediaFile(file);
      setImage(url);
      if (!imageAlt.trim()) {
        setImageAlt(title.trim() || file.name);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể tải ảnh bìa lên.'
      );
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingVideo(true);
    try {
      const url = await uploadMediaFile(file);
      setVideoUrl(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể tải tệp video lên.'
      );
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const updateSection = (
    index: number,
    field: keyof EditableSection,
    value: string
  ) => {
    setSections((prev) =>
      prev.map((sec, idx) => (idx === index ? { ...sec, [field]: value } : sec))
    );
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { heading: '', bodyText: '', bulletsText: '', image: '', imageCaption: '' },
    ]);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUploadSectionImage = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingSectionIdx(index);
    try {
      const url = await uploadMediaFile(file);
      updateSection(index, 'image', url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tải ảnh minh họa cho mục nội dung.'
      );
    } finally {
      setUploadingSectionIdx(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết hoặc video.');
      return;
    }
    if (!excerpt.trim()) {
      setError('Vui lòng nhập mô tả ngắn (tóm tắt).');
      return;
    }
    if (contentType === 'video' && !videoUrl.trim()) {
      setError('Vui lòng dán đường dẫn video (YouTube/Vimeo/MP4) hoặc tải tệp video lên.');
      return;
    }
    if (status === 'scheduled' && !scheduledLocal) {
      setError('Vui lòng chọn ngày và giờ lên lịch đăng bài.');
      return;
    }

    const formattedSections = sections
      .map((s) => {
        const paragraphs = s.bodyText
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean);
        const bullets = s.bulletsText
          .split(/\n+/)
          .map((b) => b.replace(/^[-•*]\s*/, '').trim())
          .filter(Boolean);
        const sectionImage = s.image.trim();
        const sectionCaption = s.imageCaption.trim();

        return {
          heading: s.heading.trim() || title.trim(),
          paragraphs:
            paragraphs.length > 0 || bullets.length > 0 || sectionImage
              ? paragraphs
              : [excerpt.trim()],
          ...(bullets.length > 0 ? { bullets } : {}),
          ...(sectionImage ? { image: sectionImage } : {}),
          ...(sectionImage && sectionCaption
            ? { imageCaption: sectionCaption }
            : {}),
        };
      })
      .filter(
        (s) =>
          s.heading ||
          s.paragraphs.length > 0 ||
          (s.bullets && s.bullets.length > 0) ||
          Boolean(s.image)
      );

    const payload: SavePostPayload = {
      title: title.trim(),
      category,
      contentType,
      videoUrl: contentType === 'video' ? videoUrl.trim() : undefined,
      status,
      scheduledAt:
        status === 'scheduled'
          ? new Date(scheduledLocal).toISOString()
          : undefined,
      readTime:
        readTime.trim() ||
        (contentType === 'video' ? 'Video hướng dẫn' : '4 phút đọc'),
      excerpt: excerpt.trim(),
      image: image.trim() || PRESET_IMAGES[0].url,
      imageAlt: imageAlt.trim() || title.trim(),
      featured,
      relatedServiceValue,
      sections:
        formattedSections.length > 0
          ? formattedSections
          : [{ heading: title.trim(), paragraphs: [excerpt.trim()] }],
    };

    setSubmitting(true);
    try {
      const saved = editingPost
        ? await updateBlogPost(editingPost.slug, payload)
        : await createBlogPost(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể lưu bài viết.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const parsedVideo =
    contentType === 'video' ? parseVideoSource(videoUrl) : { kind: 'invalid' as const };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-editor-title"
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#233B53]/55 p-4 py-8 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl rounded-[24px] border border-[#233B53]/10 bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#233B53]/10 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#E99A78]">
              Quản trị nội dung Blog
            </p>
            <h2
              id="blog-editor-title"
              className="mt-1 font-[var(--font-display)] text-2xl font-bold text-[#233B53]"
            >
              {editingPost ? 'Chỉnh sửa bài đăng' : 'Tạo bài viết / Video mới'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng trình soạn thảo"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-[#332C28]/70 transition-colors hover:bg-[#F5F1E8] hover:text-[#233B53]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Content Type Switcher */}
          <div>
            <label className="block text-sm font-semibold text-[#233B53]">
              Loại nội dung
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleContentTypeChange('article')}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  contentType === 'article'
                    ? 'border-[#233B53] bg-[#233B53] text-white'
                    : 'border-[#233B53]/15 bg-[#F5F1E8]/50 text-[#233B53] hover:bg-[#F5F1E8]'
                }`}
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>Bài viết (Article)</span>
              </button>
              <button
                type="button"
                onClick={() => handleContentTypeChange('video')}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  contentType === 'video'
                    ? 'border-[#233B53] bg-[#233B53] text-white'
                    : 'border-[#233B53]/15 bg-[#F5F1E8]/50 text-[#233B53] hover:bg-[#F5F1E8]'
                }`}
              >
                <Film className="h-4 w-4" aria-hidden="true" />
                <span>Video (YouTube / MP4)</span>
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="post-title"
                className="block text-sm font-semibold text-[#233B53]"
              >
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Hướng dẫn chải lông đúng cách cho mèo lông dài"
                className="mt-1.5 w-full rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/40 px-4 py-3 text-base text-[#332C28] outline-none focus:border-[#233B53] focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="post-category"
                className="block text-sm font-semibold text-[#233B53]"
              >
                Chuyên mục
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as BlogPostItem['category'])
                }
                className="mt-1.5 w-full rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/40 px-4 py-3 text-sm text-[#332C28] outline-none focus:border-[#233B53] focus:bg-white"
              >
                {SELECTABLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="post-read-time"
                className="block text-sm font-semibold text-[#233B53]"
              >
                {contentType === 'video' ? 'Thời lượng video' : 'Thời lượng đọc'}
              </label>
              <input
                id="post-read-time"
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder={
                  contentType === 'video' ? '3 phút xem' : '4 phút đọc'
                }
                className="mt-1.5 w-full rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/40 px-4 py-3 text-sm text-[#332C28] outline-none focus:border-[#233B53] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="post-excerpt"
                className="block text-sm font-semibold text-[#233B53]"
              >
                Tóm tắt ngắn <span className="text-red-500">*</span>
              </label>
              <textarea
                id="post-excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Mô tả ngắn gọn nội dung chính hiển thị trên thẻ bài viết..."
                className="mt-1.5 w-full rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/40 px-4 py-3 text-sm text-[#332C28] outline-none focus:border-[#233B53] focus:bg-white"
              />
            </div>
          </div>

          {/* Video Source Section */}
          {contentType === 'video' && (
            <div className="rounded-[18px] border border-[#233B53]/15 bg-[#F5F1E8]/55 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label
                  htmlFor="post-video-url"
                  className="flex items-center gap-2 text-sm font-semibold text-[#233B53]"
                >
                  <Film className="h-4 w-4 text-[#E99A78]" aria-hidden="true" />
                  <span>Nguồn Video (YouTube, Vimeo hoặc tải tệp MP4/WebM)</span>
                </label>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#233B53]/20 bg-white px-3.5 py-2 text-xs font-semibold text-[#233B53] transition-colors hover:bg-[#233B53] hover:text-white">
                  <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {uploadingVideo ? 'Đang tải video...' : 'Tải video từ máy'}
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/ogg"
                    onChange={handleUploadVideo}
                    disabled={uploadingVideo}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                id="post-video-url"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Dán link YouTube (https://youtube.com/watch?v=...), Vimeo, hoặc link .mp4..."
                className="mt-3 w-full rounded-xl border border-[#233B53]/20 bg-white px-4 py-2.5 text-sm text-[#332C28] outline-none focus:border-[#233B53]"
              />
              <p className="mt-2 text-xs text-[#332C28]/70">
                Gợi ý: Với video dài hoặc nặng (&gt; 50MB), hãy đăng lên YouTube (có thể để chế độ Không công khai) rồi dán link vào đây để phát mượt và tiết kiệm dung lượng.
              </p>

              {parsedVideo.kind !== 'invalid' && (
                <div className="mt-4 overflow-hidden rounded-xl border border-[#233B53]/10 bg-black">
                  <div className="aspect-video w-full">
                    {parsedVideo.kind === 'iframe' ? (
                      <iframe
                        src={parsedVideo.embedUrl}
                        title="Xem trước video"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={parsedVideo.src}
                        controls
                        playsInline
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cover Image Picker & Upload */}
          <div className="rounded-[18px] border border-[#233B53]/10 bg-[#F5F1E8]/40 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor="post-image-url"
                className="flex items-center gap-2 text-sm font-semibold text-[#233B53]"
              >
                <ImageIcon className="h-4 w-4 text-[#E99A78]" aria-hidden="true" />
                <span>Ảnh bìa hiển thị (Thumbnail)</span>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#233B53]/20 bg-white px-3.5 py-2 text-xs font-semibold text-[#233B53] transition-colors hover:bg-[#233B53] hover:text-white">
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {uploadingImage ? 'Đang nén & tải ảnh...' : 'Tải ảnh từ máy'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleUploadImage}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-12">
              <div className="sm:col-span-8 space-y-3">
                <input
                  id="post-image-url"
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Đường dẫn ảnh bìa hoặc chọn ảnh có sẵn bên dưới"
                  className="w-full rounded-xl border border-[#233B53]/20 bg-white px-4 py-2.5 text-sm text-[#332C28] outline-none focus:border-[#233B53]"
                />
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                        image === preset.url
                          ? 'border-[#233B53] bg-[#233B53] text-white'
                          : 'border-[#233B53]/15 bg-white text-[#233B53] hover:bg-[#F5F1E8]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-4">
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#233B53]/10 bg-white">
                  {image ? (
                    <img
                      src={image}
                      alt={imageAlt || 'Xem trước ảnh bìa'}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Article Body Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#233B53]">
                Nội dung chi tiết ({sections.length} mục)
              </h3>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/70 px-3.5 py-1.5 text-xs font-semibold text-[#233B53] transition-colors hover:bg-[#F5F1E8]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Thêm mục nội dung</span>
              </button>
            </div>

            {sections.map((section, idx) => (
              <div
                key={idx}
                className="rounded-[18px] border border-[#233B53]/10 bg-[#F5F1E8]/35 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#233B53]/75">
                    Mục {idx + 1}
                  </span>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(idx)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Xóa mục</span>
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={section.heading}
                  onChange={(e) =>
                    updateSection(idx, 'heading', e.target.value)
                  }
                  placeholder="Tiêu đề mục (ví dụ: 1. Chuẩn bị dụng cụ phù hợp)"
                  className="w-full rounded-xl border border-[#233B53]/15 bg-white px-3.5 py-2.5 text-sm font-medium text-[#332C28] outline-none focus:border-[#233B53]"
                />

                <textarea
                  rows={3}
                  value={section.bodyText}
                  onChange={(e) =>
                    updateSection(idx, 'bodyText', e.target.value)
                  }
                  placeholder="Nhập các đoạn nội dung (mỗi lần xuống dòng sẽ tạo đoạn mới)..."
                  className="w-full rounded-xl border border-[#233B53]/15 bg-white px-3.5 py-2.5 text-sm text-[#332C28] outline-none focus:border-[#233B53]"
                />

                <textarea
                  rows={2}
                  value={section.bulletsText}
                  onChange={(e) =>
                    updateSection(idx, 'bulletsText', e.target.value)
                  }
                  placeholder="Danh sách gạch đầu dòng (tùy chọn — mỗi dòng là 1 ý)..."
                  className="w-full rounded-xl border border-[#233B53]/15 bg-white px-3.5 py-2.5 text-sm text-[#332C28] outline-none focus:border-[#233B53]"
                />

                {/* Optional illustration image after this section */}
                <div className="rounded-xl border border-[#233B53]/10 bg-white/80 p-3 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#233B53]">
                      <ImageIcon
                        className="h-3.5 w-3.5 text-[#E99A78]"
                        aria-hidden="true"
                      />
                      <span>Ảnh minh họa sau mục này (tùy chọn)</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#233B53]/20 bg-[#F5F1E8]/70 px-3 py-1.5 text-xs font-semibold text-[#233B53] transition-colors hover:bg-[#233B53] hover:text-white">
                        <Upload className="h-3 w-3" aria-hidden="true" />
                        <span>
                          {uploadingSectionIdx === idx
                            ? 'Đang nén & tải ảnh...'
                            : 'Tải ảnh từ máy'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => handleUploadSectionImage(idx, e)}
                          disabled={uploadingSectionIdx !== null}
                          className="hidden"
                        />
                      </label>

                      {section.image && (
                        <button
                          type="button"
                          onClick={() => {
                            updateSection(idx, 'image', '');
                            updateSection(idx, 'imageCaption', '');
                          }}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                          <span>Xóa ảnh</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      value={section.image}
                      onChange={(e) =>
                        updateSection(idx, 'image', e.target.value)
                      }
                      placeholder="Hoặc dán đường dẫn ảnh..."
                      className="w-full rounded-lg border border-[#233B53]/15 bg-white px-3 py-2 text-xs text-[#332C28] outline-none focus:border-[#233B53]"
                    />
                    <input
                      type="text"
                      value={section.imageCaption}
                      onChange={(e) =>
                        updateSection(idx, 'imageCaption', e.target.value)
                      }
                      placeholder="Chú thích ảnh (tùy chọn)..."
                      className="w-full rounded-lg border border-[#233B53]/15 bg-white px-3 py-2 text-xs text-[#332C28] outline-none focus:border-[#233B53]"
                    />
                  </div>

                  {section.image && (
                    <div className="overflow-hidden rounded-lg border border-[#233B53]/10 bg-[#F5F1E8]/40">
                      <img
                        src={section.image}
                        alt={section.imageCaption || `Ảnh minh họa mục ${idx + 1}`}
                        className="max-h-48 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Publishing & Scheduling Controls */}
          <div className="rounded-[18px] border border-[#233B53]/15 bg-[#F5F1E8]/60 p-4 sm:p-5 space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#233B53]">
              <CalendarClock className="h-4 w-4 text-[#E99A78]" aria-hidden="true" />
              <span>Chế độ đăng &amp; Lên lịch xuất bản</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  status === 'published'
                    ? 'border-[#233B53] bg-[#233B53] text-white'
                    : 'border-[#233B53]/15 bg-white text-[#233B53] hover:bg-[#F5F1E8]'
                }`}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>Đăng ngay</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('scheduled')}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  status === 'scheduled'
                    ? 'border-[#233B53] bg-[#233B53] text-white'
                    : 'border-[#233B53]/15 bg-white text-[#233B53] hover:bg-[#F5F1E8]'
                }`}
              >
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                <span>Lên lịch đăng</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  status === 'draft'
                    ? 'border-[#233B53] bg-[#233B53] text-white'
                    : 'border-[#233B53]/15 bg-white text-[#233B53] hover:bg-[#F5F1E8]'
                }`}
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>Lưu bản nháp</span>
              </button>
            </div>

            {status === 'scheduled' && (
              <div className="rounded-xl border border-[#233B53]/15 bg-white p-4">
                <label
                  htmlFor="post-schedule-time"
                  className="block text-sm font-semibold text-[#233B53]"
                >
                  Chọn ngày &amp; giờ tự động đăng bài
                </label>
                <input
                  id="post-schedule-time"
                  type="datetime-local"
                  value={scheduledLocal}
                  onChange={(e) => setScheduledLocal(e.target.value)}
                  className="mt-2 w-full max-w-xs rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/40 px-4 py-2.5 text-sm font-medium text-[#233B53] outline-none focus:border-[#233B53] focus:bg-white"
                />
                {scheduledLocal && (
                  <p className="mt-2 text-xs text-[#332C28]/75">
                    Bài viết sẽ ẩn với khách truy cập và tự động xuất bản công khai vào:{' '}
                    <strong className="text-[#233B53]">
                      {formatDateTimeVi(new Date(scheduledLocal).toISOString())}
                    </strong>
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2 sm:items-center">
              <div>
                <label
                  htmlFor="post-related-service"
                  className="block text-xs font-semibold text-[#233B53]"
                >
                  Dịch vụ tư vấn gợi ý cuối bài
                </label>
                <select
                  id="post-related-service"
                  value={relatedServiceValue}
                  onChange={(e) => setRelatedServiceValue(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#233B53]/15 bg-white px-3.5 py-2 text-xs text-[#332C28] outline-none focus:border-[#233B53]"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#233B53]/15 bg-white px-4 py-2.5 text-sm font-medium text-[#233B53]">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 accent-[#233B53]"
                />
                <Sparkles className="h-4 w-4 text-[#E99A78]" aria-hidden="true" />
                <span>Đặt làm bài viết nổi bật</span>
              </label>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#233B53]/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[46px] cursor-pointer items-center justify-center rounded-xl border border-[#233B53]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#233B53] transition-colors hover:bg-[#F5F1E8]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={
                submitting ||
                uploadingImage ||
                uploadingVideo ||
                uploadingSectionIdx !== null
              }
              className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233B53] px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1A2D40] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {submitting
                  ? 'Đang lưu...'
                  : editingPost
                  ? 'Lưu thay đổi'
                  : status === 'scheduled'
                  ? 'Lên lịch đăng bài'
                  : status === 'draft'
                  ? 'Lưu bản nháp'
                  : 'Đăng lên Blog ngay'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

