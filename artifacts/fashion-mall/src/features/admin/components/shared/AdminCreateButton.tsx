import { Plus } from 'lucide-react';

type AdminCreateButtonProps = {
  onClick: () => void;
  label: string;
};

export function AdminCreateButton({ onClick, label }: AdminCreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-stone-900 text-white text-xs px-4 py-2 uppercase tracking-wider hover:bg-amber-700 transition-colors"
    >
      <Plus size={14} />
      {label}
    </button>
  );
}
