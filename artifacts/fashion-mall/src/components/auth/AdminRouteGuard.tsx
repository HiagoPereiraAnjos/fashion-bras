import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/context/auth/AdminAuthProvider';
import { fetchAdminProfile } from '@/services/auth/adminApi';
import { ApiRequestError } from '@/services/api/request';
import { resolveUserFacingError } from '@/services/errors/userFacingError';

type AccessStatus = 'idle' | 'checking' | 'allowed' | 'forbidden' | 'api_unavailable';

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { isRemoteMode, isConfigured, isLoading, session, signOut, getAccessToken } = useAdminAuth();
  const [accessStatus, setAccessStatus] = useState<AccessStatus>('idle');
  const [accessMessage, setAccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isRemoteMode) {
      setAccessStatus('allowed');
      setAccessMessage(null);
      return;
    }

    if (!isConfigured) {
      setAccessStatus('forbidden');
      setAccessMessage(
        'Autenticacao administrativa indisponivel neste ambiente.',
      );
      return;
    }

    if (isLoading) return;

    if (!session) {
      setLocation('/admin/login');
      return;
    }

    let isCancelled = false;
    setAccessStatus('checking');
    setAccessMessage(null);

    void (async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          await signOut();
          if (!isCancelled) setLocation('/admin/login');
          return;
        }

        await fetchAdminProfile(token);
        if (isCancelled) return;
        setAccessStatus('allowed');
      } catch (error) {
        if (isCancelled) return;

        const status = error instanceof ApiRequestError ? error.status : 0;
        const isAuthError = status === 401;
        const isForbidden = status === 403;
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage:
            'Nao foi possivel validar seu acesso no momento. Tente novamente em instantes.',
          authenticationMessage: 'Sua sessao expirou. Faca login novamente.',
          forbiddenMessage:
            'Sua conta esta autenticada, mas nao possui permissao para acessar o painel administrativo.',
          networkMessage:
            'Nao foi possivel validar seu acesso por falha de conexao. Tente novamente.',
        });

        if (isAuthError) {
          await signOut();
          setLocation('/admin/login');
          return;
        }

        if (isForbidden) {
          setAccessStatus('forbidden');
          setAccessMessage(message);
          return;
        }

        setAccessStatus('api_unavailable');
        setAccessMessage(message);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [
    getAccessToken,
    isConfigured,
    isLoading,
    isRemoteMode,
    session,
    setLocation,
    signOut,
  ]);

  if (!isRemoteMode) return <>{children}</>;

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-lg bg-white border border-stone-200 p-8 space-y-3">
          <h1 className="font-serif text-2xl text-stone-900">Admin indisponivel</h1>
          <p className="text-sm text-stone-600">
            {accessMessage ??
              'Autenticacao administrativa nao esta configurada para este ambiente.'}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || accessStatus === 'checking' || accessStatus === 'idle') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white border border-stone-200 px-4 py-3 inline-flex items-center gap-2 text-sm text-stone-600">
          <Loader2 size={16} className="animate-spin text-amber-700" />
          Validando acesso administrativo...
        </div>
      </div>
    );
  }

  if (accessStatus === 'allowed') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-lg bg-white border border-stone-200 p-8 space-y-3">
        <h1 className="font-serif text-2xl text-stone-900">
          {accessStatus === 'api_unavailable' ? 'Servico temporariamente indisponivel' : 'Acesso negado'}
        </h1>
        <p className="text-sm text-stone-600">
          {accessMessage ?? 'Nao foi possivel acessar o painel administrativo.'}
        </p>
      </div>
    </div>
  );
}
