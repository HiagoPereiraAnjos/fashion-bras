import type { ContentRepository } from '@/services/content/repositories/ContentRepository';
import { createLocalContentRepository } from '@/services/content/repositories/LocalContentRepository';
import { createRemoteContentRepository } from '@/services/content/repositories/RemoteContentRepository';
import { createSupabaseContentRepository } from '@/services/content/repositories/SupabaseContentRepository';
import type { ContentRepositoryFactoryOptions } from '@/services/content/repositories/types';

export function createContentRepository(
  options: ContentRepositoryFactoryOptions = {},
): ContentRepository {
  // Repository selection is centralized here to keep provider/pages agnostic of persistence source.
  const { kind = 'local', storage, namespace } = options;
  const localRepository = createLocalContentRepository(storage, namespace);

  if (kind === 'remote') {
    return createRemoteContentRepository({
      fallbackRepository: localRepository,
    });
  }

  if (kind === 'supabase') {
    return createSupabaseContentRepository({
      fallbackRepository: localRepository,
    });
  }

  return localRepository;
}
