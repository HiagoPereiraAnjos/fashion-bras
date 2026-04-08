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
      className="fixed inset-0 z-50 bg-black/50 p-3 sm:p-4 sm:py-6 md:py-8 overflow-y-auto"
    >
      <div className="mx-auto w-full max-w-2xl bg-white max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] flex flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-stone-100 bg-stone-50">
          <h3 className={`${titleClassName} min-w-0`}>{title}</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 shrink-0 p-1"
            disabled={isSaving}
            aria-label="Fechar editor"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">{children}</div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-stone-100 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-10 px-4 text-xs text-stone-500 border border-stone-200 hover:border-stone-400 uppercase tracking-wider disabled:opacity-50"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="w-full sm:w-auto h-10 px-5 bg-stone-900 text-white text-xs uppercase tracking-wider hover:bg-amber-700 transition-colors disabled:opacity-70 disabled:cursor-wait"
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : saveLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
