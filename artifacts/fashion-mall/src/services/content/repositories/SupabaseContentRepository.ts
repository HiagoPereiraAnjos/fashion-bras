import type {
  ContentRepository,
  ContentRepositorySnapshot,
} from '@/services/content/repositories/ContentRepository';

interface SupabaseRepositoryOptions {
  fallbackRepository: ContentRepository;
  onFallback?: (message: string) => void;
}

let hasWarnedFallback = false;

export function createSupabaseContentRepository({
  fallbackRepository,
  onFallback,
}: SupabaseRepositoryOptions): ContentRepository {
  // Future integration point: replace this fallback with Supabase implementation.
  if (!hasWarnedFallback) {
    const message =
      '[content] Supabase repository is not configured yet. Falling back to local repository.';
    if (onFallback) {
      onFallback(message);
    } else {
      console.warn(message);
    }
    hasWarnedFallback = true;
  }

  const loadInitialState = async (): Promise<ContentRepositorySnapshot> => {
    // Future integration point: replace fallback reads with remote Supabase bootstrap.
    const snapshot: ContentRepositorySnapshot = {};

    const stores = fallbackRepository.loadSection('stores');
    if (stores !== null) snapshot.stores = stores;

    const blogPosts = fallbackRepository.loadSection('blogPosts');
    if (blogPosts !== null) snapshot.blogPosts = blogPosts;

    const partners = fallbackRepository.loadSection('partners');
    if (partners !== null) snapshot.partners = partners;

    const siteSettings = fallbackRepository.loadSection('siteSettings');
    if (siteSettings !== null) snapshot.siteSettings = siteSettings;

    const homeContent = fallbackRepository.loadSection('homeContent');
    if (homeContent !== null) snapshot.homeContent = homeContent;

    const leasingBenefits = fallbackRepository.loadSection('leasingBenefits');
    if (leasingBenefits !== null) snapshot.leasingBenefits = leasingBenefits;

    const spaceTypes = fallbackRepository.loadSection('spaceTypes');
    if (spaceTypes !== null) snapshot.spaceTypes = spaceTypes;

    const testimonials = fallbackRepository.loadSection('testimonials');
    if (testimonials !== null) snapshot.testimonials = testimonials;

    const leasingDifferentials = fallbackRepository.loadSection('leasingDifferentials');
    if (leasingDifferentials !== null) snapshot.leasingDifferentials = leasingDifferentials;

    const aboutData = fallbackRepository.loadSection('aboutData');
    if (aboutData !== null) snapshot.aboutData = aboutData;

    return snapshot;
  };

  return {
    ...fallbackRepository,
    loadInitialState,
  };
}
