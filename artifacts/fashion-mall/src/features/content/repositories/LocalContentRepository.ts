import {
  readJson,
  removeKey,
  resolveStorage,
  writeJson,
} from '@/features/content/adapters/storage/localStorageAdapter';
import {
  createSectionStorageKey,
  mapDomainToStoredValue,
  mapStoredToDomainValue,
} from '@/features/content/mappers/contentStorageMapper';
import type { ContentRepository } from '@/features/content/repositories/ContentRepository';
import { CONTENT_SECTIONS, type ContentSection, type ContentState } from '@/features/content/types/content';

const DEFAULT_STORAGE_NAMESPACE = 'fashionbras_admin_data';

export function createLocalContentRepository(
  storage?: Storage,
  namespace = DEFAULT_STORAGE_NAMESPACE,
): ContentRepository {
  // Adapter boundary: replace localStorage here with Supabase persistence later.
  const resolvedStorage = resolveStorage(storage);

  const sectionKey = (section: ContentSection) => createSectionStorageKey(namespace, section);

  const loadSection = <K extends ContentSection>(section: K): ContentState[K] | null => {
    const storedValue = readJson<ContentState[K]>(resolvedStorage, sectionKey(section));
    if (storedValue === null) return null;
    return mapStoredToDomainValue(storedValue);
  };

  const saveSection = <K extends ContentSection>(section: K, value: ContentState[K]) => {
    writeJson(resolvedStorage, sectionKey(section), mapDomainToStoredValue(value));
  };

  const removeSection = (section: ContentSection) => {
    removeKey(resolvedStorage, sectionKey(section));
  };

  const hasStoredSection = (section: ContentSection): boolean => {
    if (!resolvedStorage) return false;

    try {
      return resolvedStorage.getItem(sectionKey(section)) !== null;
    } catch {
      return false;
    }
  };

  const hasAnyStoredSection = () => CONTENT_SECTIONS.some(hasStoredSection);

  const clearAll = () => {
    for (const section of CONTENT_SECTIONS) {
      removeSection(section);
    }
  };

  return {
    loadSection,
    saveSection,
    removeSection,
    clearAll,
    hasStoredSection,
    hasAnyStoredSection,
  };
}
