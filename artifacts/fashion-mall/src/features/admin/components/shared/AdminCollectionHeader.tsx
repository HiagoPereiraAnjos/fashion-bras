import { Check, Loader2, RotateCcw } from 'lucide-react';
import { AdminCreateButton } from '@/features/admin/components/shared/AdminCreateButton';

type AdminCollectionHeaderProps = {
  countLabel: string;
  saved: boolean;
  onReset: () => void;
  onCreate: () => void;
  createLabel: string;
  isResetting?: boolean;
  isCreating?: boolean;
  disableActions?: boolean;
  resetLoadingLabel?: string;
  createLoadingLabel?: string;
};

export function AdminCollectionHeader({
  countLabel,
  saved,
  onReset,
  onCreate,
  createLabel,
  isResetting = false,
  isCreating = false,
  disableActions = false,
  resetLoadingLabel = 'Restaurando...',
  createLoadingLabel = 'Criando...',
}: AdminCollectionHeaderProps) {
  const actionsDisabled = disableActions || isResetting || isCreating;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
        <span className="inline-flex items-center px-2.5 py-1 text-xs sm:text-sm text-stone-600 bg-stone-100 border border-stone-200">
          {countLabel}
        </span>
        {saved && (
          <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 inline-flex items-center gap-1">
            <Check size={12} />
            Salvo
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:justify-end">
        <button
          type="button"
          onClick={onReset}
          disabled={actionsDisabled}
          className="w-full sm:w-auto h-10 inline-flex items-center justify-center gap-1.5 text-xs tracking-[0.12em] sm:tracking-wide text-stone-500 hover:text-red-500 transition-colors px-3 border border-stone-200 hover:border-red-200 rounded-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isResetting ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
          {isResetting ? resetLoadingLabel : 'Restaurar'}
        </button>
        <AdminCreateButton
          onClick={onCreate}
          label={createLabel}
          className="w-full sm:w-auto"
          disabled={actionsDisabled}
          isLoading={isCreating}
          loadingLabel={createLoadingLabel}
        />
      </div>
    </div>
  );
}
