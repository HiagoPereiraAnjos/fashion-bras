import type { ContentSection, ContentState } from '@/services/content/types/content';

// Single contract used by UI/context. Swap implementation, not consumers.
export interface ContentRepository {
  loadSection<K extends ContentSection>(section: K): ContentState[K] | null;
  saveSection<K extends ContentSection>(section: K, value: ContentState[K]): void;
  removeSection(section: ContentSection): void;
  clearAll(): void;
  hasStoredSection(section: ContentSection): boolean;
  hasAnyStoredSection(): boolean;
}
