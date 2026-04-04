import type { DomainDateLabel, DomainId, Draft, Slug, UrlString } from '@/types/domain/base';
import type { SiteSettings } from '@/types/domain/site';

export type BlogCategory = string;

export interface StoreCategory {
  label: string;
  slug: string;
}

export interface Store {
  id: DomainId;
  name: string;
  segment: StoreCategory['label'];
  segmentSlug: StoreCategory['slug'];
  floor: string;
  description: string;
  longDescription: string;
  phone: string;
  instagram: string;
  images: UrlString[];
  featured?: boolean;
}

export interface BlogPost {
  slug: Slug;
  title: string;
  category: BlogCategory;
  date: DomainDateLabel;
  excerpt: string;
  content: string;
  coverImage: UrlString;
  author: string;
  readTime: string;
  featured?: boolean;
}

export interface Partner {
  id: DomainId;
  name: string;
  logo?: UrlString;
}

export interface HomeHeroSlide {
  id?: DomainId;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: UrlString;
}

// Backward-compatible alias for existing naming.
export type HeroSlide = HomeHeroSlide;

export interface LeasingBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface SpaceType {
  name: string;
  size: string;
  description: string;
}

export interface Testimonial {
  name: string;
  store: string;
  text: string;
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutTeamMember {
  name: string;
  role: string;
  description: string;
}

export interface AboutContent {
  history: string[];
  mission: string;
  vision: string;
  values: AboutValue[];
  differentials: string[];
  team: AboutTeamMember[];
}

export interface LeasingContent {
  benefits: LeasingBenefit[];
  spaceTypes: SpaceType[];
  testimonials: Testimonial[];
  differentials: string[];
}

export interface HomeData {
  featuredStores: Store[];
  featuredBlogPost: BlogPost | null;
  blogPreviewPosts: BlogPost[];
  partners: Partner[];
}

export interface ContentPersistenceSnapshot {
  stores: Store[];
  blogPosts: BlogPost[];
  partners: Partner[];
  siteSettings: SiteSettings;
  leasingContent: LeasingContent;
  aboutContent: AboutContent;
}

export type StoreFormData = Draft<Store, 'id'>;
export type BlogPostFormData = Draft<BlogPost, 'slug'>;
export type PartnerFormData = Draft<Partner, 'id'>;
export type SiteSettingsFormData = SiteSettings;
export type LeasingContentFormData = LeasingContent;
export type AboutContentFormData = AboutContent;

// Backward-compatible aliases for incremental adoption.
export type AboutData = AboutContent;
export type StoreSegment = StoreCategory;
