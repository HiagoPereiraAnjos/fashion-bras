import type {
  ContentRepository,
} from '@/services/content/repositories/ContentRepository';
import { createRemoteContentRepository } from '@/services/content/repositories/RemoteContentRepository';

interface SupabaseRepositoryOptions {
  fallbackRepository: ContentRepository;
}

export function createSupabaseContentRepository({
  fallbackRepository,
}: SupabaseRepositoryOptions): ContentRepository {
  return createRemoteContentRepository({ fallbackRepository });
}
