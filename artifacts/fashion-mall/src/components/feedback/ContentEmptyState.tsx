import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

type ContentEmptyStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
  compact?: boolean;
};

export default function ContentEmptyState({
  title = 'Conteudo em atualizacao',
  message,
  action,
  compact = false,
}: ContentEmptyStateProps) {
  return (
    <div className={`surface-card text-center ${compact ? 'p-8' : 'p-10'}`}>
      <div className="flex justify-center mb-4">
        <span className="w-10 h-10 rounded-full bg-stone-100 text-stone-500 inline-flex items-center justify-center">
          <AlertCircle size={16} />
        </span>
      </div>
      <p className="font-medium text-stone-800 text-sm">{title}</p>
      <p className="text-sm text-stone-500 mt-2 leading-relaxed max-w-xl mx-auto">{message}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
