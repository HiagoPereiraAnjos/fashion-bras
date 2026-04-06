/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTENT_BACKEND_MODE?: 'local' | 'remote';
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly NEXT_PUBLIC_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
