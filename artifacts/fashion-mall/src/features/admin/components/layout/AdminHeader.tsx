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
    <header className="bg-stone-950 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:h-14 sm:py-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
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
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:justify-end">
          {hasCustomData && (
            <button
              onClick={onRequestResetAll}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-400 hover:text-red-400 transition-colors whitespace-nowrap"
            >
              <RotateCcw size={12} />
              <span className="sm:hidden">Resetar</span>
              <span className="hidden sm:inline">Resetar tudo</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-400 hover:text-white transition-colors whitespace-nowrap disabled:text-stone-600 disabled:cursor-not-allowed"
              disabled={isLoggingOut}
            >
              <LogOut size={12} />
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </button>
          )}
          <Link href="/">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap">
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
