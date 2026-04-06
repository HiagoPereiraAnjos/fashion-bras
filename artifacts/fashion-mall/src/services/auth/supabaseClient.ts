import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, runtimeConfig } from '@/config/runtime';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (cachedClient) return cachedClient;

  cachedClient = createClient(runtimeConfig.supabaseUrl, runtimeConfig.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: 'fashionbras-admin-auth',
    },
  });

  return cachedClient;
}

export async function getSupabaseAccessToken(): Promise<string | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return null;

  const { data } = await client.auth.getSession();
  return data.session?.access_token ?? null;
}
