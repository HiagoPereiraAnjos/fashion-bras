import { Plus } from 'lucide-react';

type AdminCreateButtonProps = {
  onClick: () => void;
  label: string;
  className?: string;
};

export function AdminCreateButton({ onClick, label, className = '' }: AdminCreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 bg-stone-900 text-white text-xs px-4 py-2 uppercase tracking-wider hover:bg-amber-700 transition-colors whitespace-nowrap ${className}`}
    >
      <Plus size={14} />
      {label}
    </button>
  );
}
