import type { ReactNode } from 'react';
import { Link } from 'wouter';
import { ExternalLink, RotateCcw, Settings } from 'lucide-react';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';
import type { AdminTabId } from '@/features/admin/constants/tabs';

type AdminLayoutProps = {
  activeTab: AdminTabId;
  onTabChange: (tab: AdminTabId) => void;
  hasCustomData: boolean;
  onRequestResetAll: () => void;
  children: ReactNode;
};

export function AdminLayout({
  activeTab,
  onTabChange,
  hasCustomData,
  onRequestResetAll,
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-stone-950 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-amber-500 flex items-center justify-center">
              <Settings size={13} className="text-white" />
            </div>
            <span className="font-serif font-bold tracking-wider text-sm">FASHION BRAS</span>
            <span className="text-stone-500 text-xs">/ Painel Administrativo</span>
          </div>
          <div className="flex items-center gap-3">
            {hasCustomData && (
              <button
                onClick={onRequestResetAll}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-400 transition-colors"
              >
                <RotateCcw size={12} />
                Resetar tudo
              </button>
            )}
            <Link href="/">
              <span className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 transition-colors cursor-pointer">
                <ExternalLink size={12} />
                Ver Site
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-900 mb-1">Painel de Administração</h1>
          <p className="text-stone-500 text-sm">
            Gerencie todo o conteúdo do site Fashion Bras. As alterações são salvas localmente e aplicadas
            imediatamente.
          </p>
        </div>

        <div className="flex gap-8">
          <AdminSidebar activeTab={activeTab} onTabChange={onTabChange} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
