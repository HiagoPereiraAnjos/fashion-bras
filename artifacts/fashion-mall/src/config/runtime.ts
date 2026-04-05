import type { ContentRepositoryKind } from '@/services/content/repositories/types';

function normalizeApiBaseUrl(value: string | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return '';
  return trimmed.replace(/\/+$/, '');
}

function resolveContentBackendMode(): ContentRepositoryKind {
  const mode = import.meta.env.VITE_CONTENT_BACKEND_MODE;
  return mode === 'remote' ? 'remote' : 'local';
}

export const runtimeConfig = {
  contentBackendMode: resolveContentBackendMode(),
  apiBaseUrl: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  supabaseUrl:
    import.meta.env.VITE_SUPABASE_URL?.trim() ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ??
    '',
  supabaseAnonKey:
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ??
    '',
} as const;

export const isRemoteContentMode = runtimeConfig.contentBackendMode === 'remote';
export const isSupabaseConfigured =
  runtimeConfig.supabaseUrl.length > 0 && runtimeConfig.supabaseAnonKey.length > 0;
