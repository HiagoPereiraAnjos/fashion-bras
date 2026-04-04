import { Link } from 'wouter';
import { ExternalLink, RotateCcw, Settings } from 'lucide-react';
import type { AdminHeaderProps } from '@/features/admin/types/admin';

export function AdminHeader({ hasCustomData, onRequestResetAll }: AdminHeaderProps) {
  return (
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
  );
}
