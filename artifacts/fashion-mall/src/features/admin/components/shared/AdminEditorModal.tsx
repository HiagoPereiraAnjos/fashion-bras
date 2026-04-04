import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

type AdminEditorModalProps = {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel: string;
  children: ReactNode;
  titleClassName?: string;
};

export function AdminEditorModal({
  title,
  onClose,
  onSave,
  saveLabel,
  children,
  titleClassName = 'font-medium text-stone-800',
}: AdminEditorModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center pt-16 pb-8 px-4"
    >
      <div className="bg-white w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <h3 className={titleClassName}>{title}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>
        <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-stone-500 border border-stone-200 hover:border-stone-400 uppercase tracking-wider"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 bg-stone-900 text-white text-xs uppercase tracking-wider hover:bg-amber-700 transition-colors"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
