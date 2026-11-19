export type PageRoute = 'home' | 'blog' | 'blog-detail' | 'contact';

export type BlogCategory =
  | 'Tất cả bài viết'
  | 'Chăm sóc chó'
  | 'Chăm sóc mèo'
  | 'Kiến thức thú cưng'
  | 'Tư vấn dịch vụ';

export type PetTypeOption = 'Chó' | 'Mèo' | 'Khác';

export interface ServiceCategoryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  targetServiceValue: string;
}

export interface FeaturedServiceItem {
  id: string;
  serviceValue: string;
  name: string;
  description: string;
  processHighlight: string;
  suitableFor: string;
  image: string;
  imageAlt: string;
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
  iconKey: 'search' | 'check' | 'message' | 'clipboard';
}

export interface BrandValueItem {
  id: string;
  title: string;
  description: string;
  iconKey: 'book' | 'compass' | 'heart';
}

export type BlogContentType = 'article' | 'video';

export type BlogPostStatus = 'published' | 'scheduled' | 'draft';

export interface BlogArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  image?: string;
  imageCaption?: string;
}

export interface BlogPostItem {
  slug: string;
  title: string;
  category: Exclude<BlogCategory, 'Tất cả bài viết'>;
  contentType?: BlogContentType;
  videoUrl?: string;
  status?: BlogPostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  author?: string;
  dateLabel: string;
  readTime: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  relatedServiceValue: string;
  sections: BlogArticleSection[];
}

export type UserRole = 'admin' | 'member';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthSession {
  authenticated: boolean;
  user?: AuthUser;
}

export interface ContactInfoCardItem {
  id: string;
  label: string;
  value: string;
  note: string;
  iconKey: 'mail' | 'phone' | 'clock' | 'share';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  petType: PetTypeOption;
  service: string;
  message: string;
}
