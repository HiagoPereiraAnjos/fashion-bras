import {
  readJson,
  removeKey,
  resolveStorage,
  writeJson,
} from '@/services/content/adapters/storage/localStorageAdapter';
import {
  createSectionStorageKey,
  mapDomainToStoredValue,
  mapStoredToDomainSectionValue,
} from '@/services/content/mappers/contentStorageMapper';
import type { ContentRepository } from '@/services/content/repositories/ContentRepository';
import { getDefaultSection } from '@/services/content/defaults';
import { CONTENT_SECTIONS, type ContentSection, type ContentState } from '@/types';

const DEFAULT_STORAGE_NAMESPACE = 'fashionbras_admin_data';

export function createLocalContentRepository(
  storage?: Storage,
  namespace = DEFAULT_STORAGE_NAMESPACE,
): ContentRepository {
  // Adapter boundary: replace localStorage here with Supabase persistence later.
  const resolvedStorage = resolveStorage(storage);

  const sectionKey = (section: ContentSection) => createSectionStorageKey(namespace, section);

  const loadSection = <K extends ContentSection>(section: K): ContentState[K] | null => {
    const storedValue = readJson<unknown>(resolvedStorage, sectionKey(section));
    if (storedValue === null) return null;
    return mapStoredToDomainSectionValue(section, storedValue);
  };

  const saveSection = async <K extends ContentSection>(
    section: K,
    value: ContentState[K],
  ): Promise<ContentState[K]> => {
    writeJson(resolvedStorage, sectionKey(section), mapDomainToStoredValue(value));
    return value;
  };

  const removeSection = async <K extends ContentSection>(
    section: K,
  ): Promise<ContentState[K]> => {
    removeKey(resolvedStorage, sectionKey(section));
    return getDefaultSection(section);
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

  const clearAll = async (): Promise<ContentState> => {
    for (const section of CONTENT_SECTIONS) {
      await removeSection(section);
    }

    return {
      stores: getDefaultSection('stores'),
      blogPosts: getDefaultSection('blogPosts'),
      partners: getDefaultSection('partners'),
      siteSettings: getDefaultSection('siteSettings'),
      homeContent: getDefaultSection('homeContent'),
      leasingBenefits: getDefaultSection('leasingBenefits'),
      spaceTypes: getDefaultSection('spaceTypes'),
      testimonials: getDefaultSection('testimonials'),
      leasingDifferentials: getDefaultSection('leasingDifferentials'),
      aboutData: getDefaultSection('aboutData'),
    };
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
