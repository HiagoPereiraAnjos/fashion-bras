import { Check, RotateCcw } from 'lucide-react';
import { AdminCreateButton } from '@/features/admin/components/shared/AdminCreateButton';

type AdminCollectionHeaderProps = {
  countLabel: string;
  saved: boolean;
  onReset: () => void;
  onCreate: () => void;
  createLabel: string;
};

export function AdminCollectionHeader({
  countLabel,
  saved,
  onReset,
  onCreate,
  createLabel,
}: AdminCollectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-500">{countLabel}</span>
        {saved && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <Check size={12} />
            Salvo
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors px-3 py-2 border border-stone-200"
        >
          <RotateCcw size={12} />
          Restaurar
        </button>
        <AdminCreateButton onClick={onCreate} label={createLabel} />
      </div>
    </div>
  );
}
