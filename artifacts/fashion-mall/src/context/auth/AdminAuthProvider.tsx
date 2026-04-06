import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { isRemoteContentMode, isSupabaseConfigured } from '@/config/runtime';
import { getSupabaseBrowserClient } from '@/services/auth/supabaseClient';

type AdminAuthState = {
  isRemoteMode: boolean;
  isConfigured: boolean;
  isLoading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AdminAuthContext = createContext<AdminAuthState | null>(null);

function useSupabaseSession(client: SupabaseClient | null): {
  session: Session | null;
  isLoading: boolean;
} {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!client) {
      setSession(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    void client.auth.getSession().then(({ data }) => {
      if (isCancelled) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (isCancelled) return;
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isCancelled = true;
      subscription.unsubscribe();
    };
  }, [client]);

  return { session, isLoading };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const client = useMemo(
    () => (isRemoteContentMode && isSupabaseConfigured ? getSupabaseBrowserClient() : null),
    [],
  );
  const { session, isLoading } = useSupabaseSession(client);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    if (!client) {
      return 'Autenticacao administrativa nao configurada neste ambiente.';
    }

    const { error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (!error) return null;

    if (error.status === 400 || error.status === 401) {
      return 'Credenciais invalidas.';
    }

    return 'Nao foi possivel autenticar agora. Tente novamente em instantes.';
  };

  const signOut = async () => {
    if (!client) return;
    await client.auth.signOut();
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data.session?.access_token ?? null;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isRemoteMode: isRemoteContentMode,
        isConfigured: Boolean(client),
        isLoading,
        session,
        signIn,
        signOut,
        getAccessToken,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider.');
  }

  return context;
}
