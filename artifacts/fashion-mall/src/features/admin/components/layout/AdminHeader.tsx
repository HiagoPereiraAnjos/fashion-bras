import { Link } from 'wouter';
import { ExternalLink, LogOut, RotateCcw, Settings } from 'lucide-react';
import type { AdminHeaderProps } from '@/features/admin/types/admin';

export function AdminHeader({
  hasCustomData,
  onRequestResetAll,
  onLogout,
  isLoggingOut = false,
}: AdminHeaderProps) {
  return (
    <header className="bg-stone-950/95 text-white sticky top-0 z-40 backdrop-blur border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0 sm:flex-1 sm:pr-4">
          <div className="w-6 h-6 bg-amber-500 flex items-center justify-center">
            <Settings size={13} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold tracking-wider text-sm truncate">
                FASHION BRAS
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 sm:hidden">
                Admin
              </span>
            </div>
            <span className="hidden md:block text-stone-500 text-xs">Painel Administrativo</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {hasCustomData && (
            <button
              type="button"
              data-testid="admin-reset-all-trigger"
              onClick={onRequestResetAll}
              className="w-full sm:w-auto h-10 sm:h-8 px-3 inline-flex items-center justify-center gap-1.5 text-xs text-stone-300 hover:text-red-300 transition-colors whitespace-nowrap border border-stone-700 hover:border-red-300/40 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
            >
              <RotateCcw size={12} />
              <span className="sm:hidden">Resetar</span>
              <span className="hidden sm:inline">Resetar tudo</span>
            </button>
          )}
          {onLogout && (
            <button
              type="button"
              data-testid="admin-logout-trigger"
              onClick={onLogout}
              className="w-full sm:w-auto h-10 sm:h-8 px-3 inline-flex items-center justify-center gap-1.5 text-xs text-stone-300 hover:text-white transition-colors whitespace-nowrap border border-stone-700 hover:border-stone-500 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 disabled:text-stone-600 disabled:border-stone-800 disabled:cursor-not-allowed"
              disabled={isLoggingOut}
            >
              <LogOut size={12} />
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </button>
          )}
          <Link href="/">
            <span className="w-full sm:w-auto h-10 sm:h-8 px-3 inline-flex items-center justify-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer whitespace-nowrap border border-amber-500 rounded-sm">
              <ExternalLink size={12} />
              <span className="sm:hidden">Site</span>
              <span className="hidden sm:inline">Ver Site</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
