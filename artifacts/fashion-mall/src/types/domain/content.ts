import type { DomainDateLabel, DomainId, Draft, Slug, UrlString } from '@/types/domain/base';
import type { NavLink, SiteSettings } from '@/types/domain/site';

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

export interface HomeStatItem {
  value: string;
  label: string;
}

export interface HomeHeroContent {
  eyebrow: string;
  slides: HomeHeroSlide[];
}

export interface HomeInstitutionalContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  leadParagraph: string;
  secondaryParagraph: string;
  ctaLabel: string;
  ctaHref: string;
  imagePrimary: UrlString;
  imageSecondary: UrlString;
  floatingStatValue: string;
  floatingStatLabel: string;
}

export interface HomeSectionHighlightContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  ctaLabel: string;
  ctaHref: string;
  emptyMessage: string;
}

export interface HomePartnersSectionContent {
  eyebrow: string;
  emptyMessage: string;
}

export interface HomeStatsContent {
  backgroundWord: string;
  items: HomeStatItem[];
}

export interface HomeLeasingCtaContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage: UrlString;
}

export interface HomePageContent {
  hero: HomeHeroContent;
  institutional: HomeInstitutionalContent;
  stats: HomeStatsContent;
  featuredStores: HomeSectionHighlightContent;
  partners: HomePartnersSectionContent;
  blogPreview: HomeSectionHighlightContent;
  leasingCta: HomeLeasingCtaContent;
}

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

export interface HomeContent {
  featuredStores: Store[];
  featuredBlogPost: BlogPost | null;
  blogPreviewPosts: BlogPost[];
  partners: Partner[];
}

export interface SiteContentState {
  stores: Store[];
  blogPosts: BlogPost[];
  partners: Partner[];
  siteSettings: SiteSettings;
  homeContent: HomePageContent;
  leasingBenefits: LeasingBenefit[];
  spaceTypes: SpaceType[];
  testimonials: Testimonial[];
  leasingDifferentials: string[];
  aboutData: AboutContent;
}

export const SITE_CONTENT_SECTIONS = [
  'stores',
  'blogPosts',
  'partners',
  'siteSettings',
  'homeContent',
  'leasingBenefits',
  'spaceTypes',
  'testimonials',
  'leasingDifferentials',
  'aboutData',
] as const;

export type SiteContentSection = (typeof SITE_CONTENT_SECTIONS)[number];

export interface SiteContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface SiteBranding {
  fullName: string;
  mainName: string;
  secondaryName: string;
}

export interface SiteSocialProfile {
  rawValue: string;
  href: string;
  displayValue: string;
  isAvailable: boolean;
}

export interface SiteSocialLinks {
  instagram: SiteSocialProfile;
  facebook: SiteSocialProfile;
}

export interface SiteFooterContent {
  description: string;
  links: NavLink[];
  leasingLink: NavLink;
  legalNote: string;
}

export interface SiteContentSnapshot extends SiteContentState {
  storeSegments: StoreCategory[];
  blogCategories: BlogCategory[];
  featuredStores: Store[];
  featuredBlogPost: BlogPost | null;
  blogFeedPosts: BlogPost[];
  blogPreviewPosts: BlogPost[];
  homeData: HomeContent;
  leasingContent: LeasingContent;
  aboutContent: AboutContent;
  navigationLinks: NavLink[];
  contactInfo: SiteContactInfo;
  branding: SiteBranding;
  socialLinks: SiteSocialLinks;
  footer: SiteFooterContent;
}

export type SiteContentPersistence = SiteContentState;

export const CONTACT_REQUEST_STATUSES = [
  'novo',
  'em_contato',
  'atendido',
  'arquivado',
] as const;

export type ContactRequestStatus = (typeof CONTACT_REQUEST_STATUSES)[number];

export interface ContactRequestListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  spaceType: string;
  segment: string;
  status: ContactRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactRequestDetail extends ContactRequestListItem {
  message: string;
  internalNotes: string;
}

export type StoreFormData = Draft<Store, 'id'>;
export type BlogPostFormData = Draft<BlogPost, 'slug'>;
export type PartnerFormData = Draft<Partner, 'id'>;
export type SiteSettingsFormData = SiteSettings;
export type HomeContentFormData = HomePageContent;
export type LeasingContentFormData = LeasingContent;
export type AboutContentFormData = AboutContent;

// Backward-compatible aliases for incremental adoption.
export type HeroSlide = HomeHeroSlide;
export type StoreSegment = StoreCategory;
export type HomeData = HomeContent;
export type ContentState = SiteContentState;
export type ContentSection = SiteContentSection;
export const CONTENT_SECTIONS = SITE_CONTENT_SECTIONS;
export type AdminContentState = SiteContentState;
export type ContentPersistenceSnapshot = SiteContentPersistence;
export type AboutData = AboutContent;
