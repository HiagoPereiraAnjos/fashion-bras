import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { isRemoteContentMode } from '@/config/runtime';
import { useAdminAuth } from '@/context/auth/AdminAuthProvider';
import { getSeoMetadata } from '@/seo/pages';
import { usePageSeo } from '@/seo/usePageSeo';

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { isConfigured, isLoading, session, signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  usePageSeo(getSeoMetadata('adminLogin'));

  useEffect(() => {
    if (!isRemoteContentMode) {
      setLocation('/admin');
      return;
    }

    if (!isLoading && session) {
      setLocation('/admin');
    }
  }, [isLoading, session, setLocation]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Informe email e senha para acessar o painel.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const error = await signIn(email, password);
      if (error) {
        setErrorMessage(error);
        return;
      }

      setLocation('/admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isRemoteContentMode) {
    return <div className="min-h-screen bg-stone-50" />;
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 p-6 sm:p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Painel Administrativo</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-2">Login</h1>
          <p className="text-sm text-stone-500 mt-3">
            Acesso restrito para usuarios admin cadastrados.
          </p>
        </div>

        {!isConfigured && (
          <p className="text-sm text-red-700 border border-red-200 bg-red-50 px-3 py-2">
            O acesso administrativo nao esta disponivel neste ambiente no momento.
          </p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-700 border border-red-200 bg-red-50 px-3 py-2">
            {errorMessage}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Email</label>
            <input
              type="email"
              data-testid="admin-login-email"
              className="w-full min-h-10 border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={!isConfigured || isSubmitting}
              autoComplete="email"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.2em] text-stone-500">Senha</label>
            <input
              type="password"
              data-testid="admin-login-password"
              className="w-full min-h-10 border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={!isConfigured || isSubmitting}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            data-testid="admin-login-submit"
            className="w-full h-10 bg-stone-900 text-white text-xs uppercase tracking-[0.2em] hover:bg-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!isConfigured || isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar no Admin'}
          </button>
        </form>

        <div className="text-center">
          <Link href="/">
            <span className="text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-amber-700 cursor-pointer">
              Voltar para o site
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
