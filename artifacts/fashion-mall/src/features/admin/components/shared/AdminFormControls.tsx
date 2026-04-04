import { useState, type ReactNode } from 'react';
import { Check, RotateCcw, Save } from 'lucide-react';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="admin-field-label">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`admin-control ${className}`}
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="admin-control resize-vertical"
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="admin-control"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
        saved ? 'bg-green-600 text-white' : 'bg-stone-900 text-white hover:bg-amber-700'
      }`}
    >
      {saved ? <Check size={14} /> : <Save size={14} />}
      {saved ? 'Salvo!' : 'Salvar alterações'}
    </button>
  );
}

export function InlineNotice({
  tone = 'info',
  message,
}: {
  tone?: 'info' | 'success' | 'error';
  message: string;
}) {
  const toneClassName =
    tone === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : tone === 'success'
        ? 'border-green-200 bg-green-50 text-green-700'
        : 'border-stone-200 bg-stone-50 text-stone-600';

  return <p className={`text-xs border px-3 py-2 ${toneClassName}`}>{message}</p>;
}

export function EmptyAdminState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card p-6 text-center">
      <p className="font-medium text-stone-800 text-sm">{title}</p>
      <p className="text-xs text-stone-500 mt-2">{description}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function useSaveState() {
  const [saved, setSaved] = useState(false);

  const trigger = (action: () => void) => {
    action();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return { saved, trigger };
}

export function SectionCard({
  title,
  children,
  onReset,
}: {
  title: string;
  children: ReactNode;
  onReset?: () => void;
}) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
        <h3 className="font-medium text-stone-800 text-sm">{title}</h3>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw size={12} />
            Restaurar padrão
          </button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
