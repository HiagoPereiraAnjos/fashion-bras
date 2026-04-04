import type { ContentSection, ContentState } from '@/types';

export type ContentRepositorySnapshot = Partial<ContentState>;

// Single contract used by UI/context. Swap implementation, not consumers.
// Current contract is sync for local persistence; keep this boundary when introducing async remote data.
export interface ContentRepository {
  loadSection<K extends ContentSection>(section: K): ContentState[K] | null;
  // Optional async bootstrap for remote repositories (ex: Supabase).
  loadInitialState?: () => Promise<ContentRepositorySnapshot>;
  saveSection<K extends ContentSection>(section: K, value: ContentState[K]): void;
  removeSection(section: ContentSection): void;
  clearAll(): void;
  hasStoredSection(section: ContentSection): boolean;
  hasAnyStoredSection(): boolean;
}
