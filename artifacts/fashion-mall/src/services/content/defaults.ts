import { aboutData } from '@/data/content/aboutData';
import { blogCategories, blogPostsData } from '@/data/content/blogPostsData';
import { homeContentData } from '@/data/content/homeContentData';
import {
  leasingBenefits,
  leasingDifferentials,
  spaceTypes,
  testimonials,
} from '@/data/content/leasingData';
import { partnersData } from '@/data/content/partnersData';
import { siteSettings } from '@/data/content/siteSettings';
import { storesData, storeSegments } from '@/data/content/storesData';
import type { BlogCategory, ContentSection, ContentState } from '@/types';

// Single fallback source: UI never imports mock files directly.
export const BLOG_ALL_CATEGORY = 'Todos';
export const defaultStoreSegments = storeSegments;
export const defaultBlogCategories: BlogCategory[] = blogCategories;

const defaultContentBySection: ContentState = {
  stores: storesData,
  blogPosts: blogPostsData,
  partners: partnersData,
  siteSettings,
  homeContent: homeContentData,
  leasingBenefits,
  spaceTypes,
  testimonials,
  leasingDifferentials,
  aboutData,
};

function cloneValue<T>(value: T): T {
  if (typeof globalThis.structuredClone === 'function') {
    return globalThis.structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

export function getDefaultSection<K extends ContentSection>(section: K): ContentState[K] {
  return cloneValue(defaultContentBySection[section]);
}
