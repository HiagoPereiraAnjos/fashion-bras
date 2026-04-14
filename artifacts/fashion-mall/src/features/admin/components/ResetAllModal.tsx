import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export function ResetAllModal({
  open,
  onCancel,
  onConfirm,
  isProcessing = false,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  isProcessing?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            role="dialog"
            aria-modal="true"
            aria-label="Resetar tudo?"
            className="bg-white px-4 py-5 sm:p-8 max-w-sm w-full max-h-[calc(100vh-1.5rem)] overflow-y-auto sm:rounded-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={22} className="text-amber-600 shrink-0" />
              <h3 className="font-serif text-xl font-bold text-stone-900">Resetar tudo?</h3>
            </div>
            <p className="text-stone-500 text-sm mb-6">
              Todas as personalizacoes serao removidas e o conteudo padrao sera restaurado. Esta
              acao nao pode ser desfeita.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:flex-1 h-10 border border-stone-200 text-xs uppercase tracking-[0.14em] sm:tracking-wider text-stone-600 hover:border-stone-400 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50"
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="w-full sm:flex-1 h-10 bg-red-600 text-white text-xs uppercase tracking-[0.14em] sm:tracking-wider hover:bg-red-700 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-70 disabled:cursor-wait"
                disabled={isProcessing}
              >
                {isProcessing ? 'Resetando...' : 'Resetar'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
