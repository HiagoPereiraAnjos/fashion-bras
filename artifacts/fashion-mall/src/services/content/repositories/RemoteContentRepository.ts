import {
  GetContentSnapshotResponse,
  PostAdminResetAllContentResponse,
  PostAdminResetContentSectionResponse,
  PutAdminContentSectionBody,
  PutAdminContentSectionResponse,
} from '@workspace/api-zod';
import { getSupabaseAccessToken } from '@/services/auth/supabaseClient';
import { ApiRequestError, requestApi } from '@/services/api/request';
import type {
  ContentRepository,
  ContentRepositorySnapshot,
} from '@/services/content/repositories/ContentRepository';
import type { ContentSection, ContentState } from '@/types';

interface RemoteRepositoryOptions {
  fallbackRepository: ContentRepository;
  getAuthToken?: () => Promise<string | null>;
}

function parseSectionValue<K extends ContentSection>(section: K, value: unknown): ContentState[K] {
  const schema = GetContentSnapshotResponse.shape[section];
  return schema.parse(value) as ContentState[K];
}

async function resolveAuthToken(
  getAuthToken: (() => Promise<string | null>) | undefined,
): Promise<string> {
  // Future auth swap point: keep token acquisition centralized to replace Supabase later.
  const token = (await getAuthToken?.()) ?? (await getSupabaseAccessToken());
  if (!token) {
    throw new ApiRequestError(
      'Sessao administrativa expirada. Faca login novamente para salvar.',
      401,
    );
  }

  return token;
}

export function createRemoteContentRepository({
  fallbackRepository,
  getAuthToken,
}: RemoteRepositoryOptions): ContentRepository {
  const loadInitialState = async (): Promise<ContentRepositorySnapshot> => {
    return requestApi(
      '/api/content/snapshot',
      { method: 'GET' },
      GetContentSnapshotResponse,
    );
  };

  const saveSection = async <K extends ContentSection>(
    section: K,
    value: ContentState[K],
  ): Promise<ContentState[K]> => {
    const token = await resolveAuthToken(getAuthToken);
    const body = PutAdminContentSectionBody.parse({ value });

    const response = await requestApi(
      `/api/admin/content/sections/${section}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
      PutAdminContentSectionResponse,
    );

    return parseSectionValue(section, response.value);
  };

  const removeSection = async <K extends ContentSection>(
    section: K,
  ): Promise<ContentState[K]> => {
    const token = await resolveAuthToken(getAuthToken);
    const response = await requestApi(
      `/api/admin/content/reset/${section}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      PostAdminResetContentSectionResponse,
    );

    return parseSectionValue(section, response.value);
  };

  const clearAll = async (): Promise<ContentState> => {
    const token = await resolveAuthToken(getAuthToken);
    return requestApi(
      '/api/admin/content/reset-all',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      PostAdminResetAllContentResponse,
    );
  };

  return {
    loadSection: (section) => fallbackRepository.loadSection(section),
    loadInitialState,
    saveSection,
    removeSection,
    clearAll,
    hasStoredSection: () => true,
    hasAnyStoredSection: () => true,
  };
}
