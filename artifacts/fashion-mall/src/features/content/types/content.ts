import type {
  AboutContent,
  BlogPost,
  LeasingBenefit,
  Partner,
  SiteSettings,
  SpaceType,
  Store,
  Testimonial,
} from '@/types';

export const CONTENT_SECTIONS = [
  'stores',
  'blogPosts',
  'partners',
  'siteSettings',
  'leasingBenefits',
  'spaceTypes',
  'testimonials',
  'leasingDifferentials',
  'aboutData',
] as const;

export type ContentSection = (typeof CONTENT_SECTIONS)[number];

export interface ContentState {
  stores: Store[];
  blogPosts: BlogPost[];
  partners: Partner[];
  siteSettings: SiteSettings;
  leasingBenefits: LeasingBenefit[];
  spaceTypes: SpaceType[];
  testimonials: Testimonial[];
  leasingDifferentials: string[];
  aboutData: AboutContent;
}

// Backward-compatible alias for existing imports during incremental refactors.
export type AdminContentState = ContentState;
