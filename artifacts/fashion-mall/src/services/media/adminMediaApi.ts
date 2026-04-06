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
const STORAGE_OBJECT_PATH_PATTERN = /^[a-z0-9/_\-.]+$/i;
const MAX_STORAGE_OBJECT_PATH_LENGTH = 400;
const MAX_FOLDER_LENGTH = 120;

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

function isAllowedMediaType(value: string): value is (typeof ADMIN_MEDIA_ALLOWED_TYPES)[number] {
  return ADMIN_MEDIA_ALLOWED_TYPES.includes(value as (typeof ADMIN_MEDIA_ALLOWED_TYPES)[number]);
}

function normalizeFolder(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/_-]+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^\/+|\/+$/g, '');
}

export async function uploadAdminMedia({
  file,
  folder,
  replacePath,
  token,
}: UploadAdminMediaParams): Promise<AdminMediaUpload> {
  if (!isAllowedMediaType(file.type)) {
    throw new ApiRequestError('Formato invalido. Envie JPG, PNG, WEBP ou AVIF.', 400);
  }

  if (file.size <= 0) {
    throw new ApiRequestError('Arquivo vazio. Envie uma imagem valida.', 400);
  }

  if (file.size > ADMIN_MEDIA_MAX_SIZE_BYTES) {
    throw new ApiRequestError('Arquivo excede 8MB.', 413);
  }

  const authToken = await resolveToken(token);
  const body = new FormData();
  const normalizedFolder = folder?.trim() ? normalizeFolder(folder) : '';
  if (normalizedFolder && normalizedFolder.length > MAX_FOLDER_LENGTH) {
    throw new ApiRequestError(
      `Pasta de upload excede ${MAX_FOLDER_LENGTH} caracteres.`,
      400,
    );
  }
  const normalizedReplacePath = resolveStorageObjectPath(replacePath);
  if (replacePath?.trim() && !normalizedReplacePath) {
    throw new ApiRequestError('Caminho de substituicao invalido.', 400);
  }

  body.append('file', file);
  if (normalizedFolder) body.append('folder', normalizedFolder);
  if (normalizedReplacePath) body.append('replacePath', normalizedReplacePath);

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

        if (
          !bucket ||
          !resolveStorageObjectPath(path) ||
          !url.startsWith('http')
        ) {
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
  if (!normalized || normalized.length > MAX_STORAGE_OBJECT_PATH_LENGTH) return null;
  if (!STORAGE_OBJECT_PATH_PATTERN.test(normalized)) return null;
  const parts = normalized.split('/');
  if (parts.some((part) => part === '.' || part === '..')) return null;
  return normalized;
}

export async function deleteAdminMedia({
  path,
  token,
}: DeleteAdminMediaParams): Promise<AdminMediaDelete> {
  const authToken = await resolveToken(token);
  const normalizedPath = resolveStorageObjectPath(path);
  if (!normalizedPath) {
    throw new ApiRequestError('Caminho de arquivo invalido para remocao.', 400);
  }

  return requestApi(
    '/api/admin/media/object',
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ path: normalizedPath }),
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

        if (!bucket || !resolveStorageObjectPath(deletedPath) || !deleted) {
          throw new Error('Invalid delete response.');
        }

        return { bucket, path: deletedPath, deleted };
      },
    },
  );
}
