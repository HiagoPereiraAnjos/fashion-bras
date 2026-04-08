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
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
        <span className="text-sm text-stone-500">{countLabel}</span>
        {saved && (
          <span className="text-xs text-green-600 inline-flex items-center gap-1">
            <Check size={12} />
            Salvo
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:justify-end">
        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors px-3 py-2 border border-stone-200 whitespace-nowrap"
        >
          <RotateCcw size={12} />
          Restaurar
        </button>
        <AdminCreateButton onClick={onCreate} label={createLabel} className="w-full sm:w-auto" />
      </div>
    </div>
  );
}
