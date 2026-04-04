import { Link } from 'wouter';
import { AlertCircle } from 'lucide-react';
import { getSeoMetadata } from '@/seo/pages';
import { usePageSeo } from '@/seo/usePageSeo';

export default function NotFound() {
  usePageSeo(getSeoMetadata('notFound'));

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md bg-white border border-stone-100 p-7">
        <div className="flex mb-4 gap-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-stone-900">404 - Página não encontrada</h1>
        </div>

        <p className="mt-4 text-sm text-stone-600">
          O endereço acessado não existe ou foi movido.
        </p>
        <Link href="/">
          <span className="mt-6 inline-block text-amber-700 text-xs tracking-widest uppercase font-medium hover:underline cursor-pointer">
            Voltar para o início
          </span>
        </Link>
      </div>
    </div>
  );
}

