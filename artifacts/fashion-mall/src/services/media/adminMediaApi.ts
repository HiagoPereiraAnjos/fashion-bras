import { ApiRequestError, requestApi } from '@/services/api/request';
import { getSupabaseAccessToken } from '@/services/auth/supabaseClient';
import type { MediaDeleteResponse, MediaUploadResponse } from '@workspace/api-zod';

export type AdminMediaUpload = MediaUploadResponse;
export type AdminMediaDelete = MediaDeleteResponse;

export const ADMIN_MEDIA_MAX_SIZE_BYTES = 8 * 1024 * 1024;
export const ADMIN_MEDIA_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

interface UploadAdminMediaParams {
  file: File;
  folder?: string;
  replacePath?: string | null;
  token?: string | null;
}

interface DeleteAdminMediaParams {
  path: string;
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
  replacePath,
  token,
}: UploadAdminMediaParams): Promise<AdminMediaUpload> {
  const authToken = await resolveToken(token);
  const body = new FormData();

  body.append('file', file);
  if (folder?.trim()) body.append('folder', folder.trim());
  if (replacePath?.trim()) body.append('replacePath', replacePath.trim());

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

function extractPathFromSupabasePublicUrl(url: URL): string | null {
  const marker = '/storage/v1/object/public/';
  const index = url.pathname.indexOf(marker);
  if (index < 0) return null;

  const relative = decodeURIComponent(url.pathname.slice(index + marker.length));
  const slashIndex = relative.indexOf('/');
  if (slashIndex < 0) return null;

  const objectPath = relative.slice(slashIndex + 1).trim();
  return objectPath.length > 0 ? objectPath : null;
}

export function resolveStorageObjectPath(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      return extractPathFromSupabasePublicUrl(new URL(trimmed));
    } catch {
      return null;
    }
  }

  const normalized = trimmed.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
  if (!normalized || normalized.includes('..')) return null;
  return normalized;
}

export async function deleteAdminMedia({
  path,
  token,
}: DeleteAdminMediaParams): Promise<AdminMediaDelete> {
  const authToken = await resolveToken(token);

  return requestApi(
    '/api/admin/media/object',
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ path: path.trim() }),
    },
    {
      parse(value: unknown): AdminMediaDelete {
        if (!value || typeof value !== 'object') {
          throw new Error('Invalid delete response.');
        }

        const payload = value as Record<string, unknown>;
        const bucket = typeof payload.bucket === 'string' ? payload.bucket.trim() : '';
        const deletedPath = typeof payload.path === 'string' ? payload.path.trim() : '';
        const deleted = payload.deleted === true;

        if (!bucket || !deletedPath || !deleted) {
          throw new Error('Invalid delete response.');
        }

        return { bucket, path: deletedPath, deleted };
      },
    },
  );
}
