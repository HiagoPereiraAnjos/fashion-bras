import type { ContentSection, ContentState } from '@/types';

export type ContentRepositorySnapshot = Partial<ContentState>;

export interface ContentRepository {
  loadSection<K extends ContentSection>(section: K): ContentState[K] | null;
  loadInitialState?: () => Promise<ContentRepositorySnapshot>;
  saveSection<K extends ContentSection>(
    section: K,
    value: ContentState[K],
  ): Promise<ContentState[K]>;
  removeSection<K extends ContentSection>(section: K): Promise<ContentState[K]>;
  clearAll(): Promise<ContentState>;
  hasStoredSection(section: ContentSection): boolean;
  hasAnyStoredSection(): boolean;
}
