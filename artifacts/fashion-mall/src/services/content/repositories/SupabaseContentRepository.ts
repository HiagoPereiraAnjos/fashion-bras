import type { ContentRepository } from '@/services/content/repositories/ContentRepository';

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

  return fallbackRepository;
}
