import type { ContentSection } from '@/features/content/types/content';

export function createSectionStorageKey(namespace: string, section: ContentSection): string {
  return `${namespace}_${section}`;
}

// Keep payload mapping explicit in one place; Supabase adapters can evolve this shape.
export function mapDomainToStoredValue<T>(value: T): T {
  return value;
}

export function mapStoredToDomainValue<T>(value: T): T {
  return value;
}
