import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

type AdminEditorModalProps = {
  title: string;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  saveLabel: string;
  children: ReactNode;
  titleClassName?: string;
  isSaving?: boolean;
};

export function AdminEditorModal({
  title,
  onClose,
  onSave,
  saveLabel,
  children,
  titleClassName = 'font-medium text-stone-800',
  isSaving = false,
}: AdminEditorModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[1px] p-2 sm:p-4 sm:py-6 md:py-8 overflow-y-auto overscroll-contain"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="mx-auto w-full max-w-2xl bg-white max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-3rem)] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.18)] sm:rounded-sm"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-stone-100 bg-stone-50">
          <h3 className={`${titleClassName} min-w-0 leading-snug break-words text-sm sm:text-base`}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 shrink-0 w-10 h-10 sm:w-auto sm:h-auto p-1 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            disabled={isSaving}
            aria-label="Fechar editor"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">{children}</div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-stone-100 bg-white flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pb-[max(env(safe-area-inset-bottom),0.75rem)] sm:pb-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-10 px-4 text-xs text-stone-500 border border-stone-200 hover:border-stone-400 uppercase tracking-[0.14em] sm:tracking-wider rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="w-full sm:w-auto h-10 px-5 bg-stone-900 text-white text-xs uppercase tracking-[0.14em] sm:tracking-wider hover:bg-amber-700 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-70 disabled:cursor-wait"
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : saveLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
