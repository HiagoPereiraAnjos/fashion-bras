import { aboutData } from '@/features/content/mocks/aboutData';
import { blogCategories, blogPostsData } from '@/features/content/mocks/blogPostsData';
import {
  leasingBenefits,
  leasingDifferentials,
  spaceTypes,
  testimonials,
} from '@/features/content/mocks/leasingData';
import { partnersData } from '@/features/content/mocks/partnersData';
import { siteSettings } from '@/features/content/mocks/siteSettings';
import { storesData, storeSegments } from '@/features/content/mocks/storesData';
import type { ContentSection, ContentState } from '@/features/content/types/content';
import type { BlogCategory } from '@/types';

export const BLOG_ALL_CATEGORY = 'Todos';
export const defaultStoreSegments = storeSegments;
export const defaultBlogCategories: BlogCategory[] = blogCategories;

const defaultContentBySection: ContentState = {
  stores: storesData,
  blogPosts: blogPostsData,
  partners: partnersData,
  siteSettings,
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
