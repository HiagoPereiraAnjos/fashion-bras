import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export function ResetAllModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white p-8 max-w-sm w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={22} className="text-amber-600 shrink-0" />
              <h3 className="font-serif text-xl font-bold text-stone-900">Resetar tudo?</h3>
            </div>
            <p className="text-stone-500 text-sm mb-6">
              Todas as suas personalizações serão removidas e o conteúdo padrão será restaurado.
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 border border-stone-200 py-2.5 text-xs uppercase tracking-wider text-stone-600 hover:border-stone-400"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-600 text-white py-2.5 text-xs uppercase tracking-wider hover:bg-red-700"
              >
                Resetar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
