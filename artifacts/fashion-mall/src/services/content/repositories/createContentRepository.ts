import type { ContentRepository } from '@/services/content/repositories/ContentRepository';
import { createLocalContentRepository } from '@/services/content/repositories/LocalContentRepository';
import { createSupabaseContentRepository } from '@/services/content/repositories/SupabaseContentRepository';
import type { ContentRepositoryFactoryOptions } from '@/services/content/repositories/types';

export function createContentRepository(
  options: ContentRepositoryFactoryOptions = {},
): ContentRepository {
  // Repository selection is centralized here to keep provider/pages agnostic of persistence source.
  const { kind = 'local', storage, namespace } = options;
  const localRepository = createLocalContentRepository(storage, namespace);

  if (kind === 'supabase') {
    return createSupabaseContentRepository({
      fallbackRepository: localRepository,
    });
  }

  return localRepository;
}
