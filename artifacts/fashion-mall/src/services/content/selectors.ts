import type { BlogCategory, BlogPost, Store, StoreCategory } from '@/types';
import {
  BLOG_ALL_CATEGORY,
  defaultBlogCategories,
  defaultStoreSegments,
} from './defaults';

function normalizeValue(value: string): string {
  return value.trim();
}

function addUnique(items: string[], value: string) {
  const normalized = normalizeValue(value);
  if (!normalized || items.includes(normalized)) return;
  items.push(normalized);
}

export function buildStoreSegments(stores: Store[]): StoreCategory[] {
  const segmentMap = new Map<string, StoreCategory>();

  for (const segment of defaultStoreSegments) {
    segmentMap.set(segment.slug, segment);
  }

  for (const store of stores) {
    const slug = normalizeValue(store.segmentSlug);
    if (!slug || segmentMap.has(slug)) continue;

    const label = normalizeValue(store.segment) || slug;
    segmentMap.set(slug, { slug, label });
  }

  return Array.from(segmentMap.values());
}

export function buildBlogCategories(posts: BlogPost[]): BlogCategory[] {
  const categories: BlogCategory[] = [];

  addUnique(categories, BLOG_ALL_CATEGORY);

  for (const defaultCategory of defaultBlogCategories) {
    if (normalizeValue(defaultCategory) === BLOG_ALL_CATEGORY) continue;
    addUnique(categories, defaultCategory);
  }

  for (const post of posts) {
    addUnique(categories, post.category);
  }

  return categories;
}
