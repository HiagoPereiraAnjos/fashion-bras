import { Loader2, Plus } from 'lucide-react';

type AdminCreateButtonProps = {
  onClick: () => void;
  label: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
};

export function AdminCreateButton({
  onClick,
  label,
  className = '',
  disabled = false,
  isLoading = false,
  loadingLabel,
}: AdminCreateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 h-10 bg-stone-900 text-white text-xs px-4 uppercase tracking-[0.14em] sm:tracking-wider hover:bg-amber-700 transition-colors whitespace-nowrap rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
      {isLoading ? loadingLabel ?? 'Criando...' : label}
    </button>
  );
}
