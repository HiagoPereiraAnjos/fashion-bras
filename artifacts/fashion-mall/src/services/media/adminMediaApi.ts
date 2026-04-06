import { ApiRequestError, requestApi } from '@/services/api/request';
import { getSupabaseAccessToken } from '@/services/auth/supabaseClient';
import type { MediaUploadResponse } from '@workspace/api-zod';

export type AdminMediaUpload = MediaUploadResponse;

interface UploadAdminMediaParams {
  file: File;
  folder?: string;
  token?: string | null;
}

async function resolveToken(providedToken?: string | null): Promise<string> {
  if (providedToken && providedToken.trim().length > 0) {
    return providedToken;
  }

  const sessionToken = await getSupabaseAccessToken();
  if (sessionToken) return sessionToken;

  throw new ApiRequestError(
    'Sessao administrativa expirada. Faca login novamente para enviar imagens.',
    401,
  );
}

export async function uploadAdminMedia({
  file,
  folder,
  token,
}: UploadAdminMediaParams): Promise<AdminMediaUpload> {
  const authToken = await resolveToken(token);
  const body = new FormData();

  body.append('file', file);
  if (folder?.trim()) body.append('folder', folder.trim());

  return requestApi(
    '/api/admin/media/upload',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body,
    },
    {
      parse(value: unknown): AdminMediaUpload {
        if (!value || typeof value !== 'object') {
          throw new Error('Invalid upload response.');
        }

        const payload = value as Record<string, unknown>;
        const bucket = typeof payload.bucket === 'string' ? payload.bucket.trim() : '';
        const path = typeof payload.path === 'string' ? payload.path.trim() : '';
        const url = typeof payload.url === 'string' ? payload.url.trim() : '';

        if (!bucket || !path || !url.startsWith('http')) {
          throw new Error('Invalid upload response.');
        }

        return { bucket, path, url };
      },
    },
  );
}
