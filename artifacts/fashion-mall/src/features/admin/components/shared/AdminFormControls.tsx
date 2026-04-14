import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AlertCircle, Check, CheckCircle2, Info, Loader2, RotateCcw, Save } from 'lucide-react';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="admin-field-label">{label}</label>
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
  disabled = false,
  dataTestId,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  dataTestId?: string;
}) {
  return (
    <input
      type={type}
      data-testid={dataTestId}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`admin-control ${className}`}
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className="admin-control resize-vertical"
    />
  );
}

export function Select({
  value,
  onChange,
  options,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
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

export function SaveButton({
  onClick,
  saved,
  isSaving = false,
  disabled = false,
}: {
  onClick: () => void | Promise<void>;
  saved: boolean;
  isSaving?: boolean;
  disabled?: boolean;
}) {
  const isDisabled = isSaving || disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full sm:w-auto h-10 inline-flex items-center justify-center gap-2 px-4 sm:px-5 text-xs font-medium uppercase tracking-[0.14em] sm:tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
        saved
          ? 'bg-green-600 text-white'
          : isDisabled
            ? 'bg-stone-600 text-white cursor-wait'
            : 'bg-stone-900 text-white hover:bg-amber-700'
      }`}
    >
      {isSaving ? (
        <Loader2 size={14} className="animate-spin" />
      ) : saved ? (
        <Check size={14} />
      ) : (
        <Save size={14} />
      )}
      {saved ? 'Salvo!' : isSaving ? 'Salvando...' : 'Salvar alteracoes'}
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
  const toneConfig =
    tone === 'error'
      ? {
          className: 'border-red-200 bg-red-50 text-red-700',
          icon: AlertCircle,
          role: 'alert' as const,
        }
      : tone === 'success'
        ? {
            className: 'border-green-200 bg-green-50 text-green-700',
            icon: CheckCircle2,
            role: 'status' as const,
          }
        : {
            className: 'border-stone-200 bg-stone-50 text-stone-600',
            icon: Info,
            role: 'status' as const,
          };

  const Icon = toneConfig.icon;

  return (
    <div
      role={toneConfig.role}
      className={`w-full rounded-sm text-xs border px-3 py-2.5 flex items-start gap-2 leading-relaxed ${toneConfig.className}`}
    >
      <Icon size={14} className="mt-0.5 shrink-0" />
      <span className="break-words">{message}</span>
    </div>
  );
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
    <div className="surface-card p-5 sm:p-6 text-center border-dashed rounded-sm">
      <p className="font-medium text-stone-800 text-sm leading-relaxed">{title}</p>
      <p className="text-xs text-stone-500 mt-2 leading-relaxed max-w-xl mx-auto">{description}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function useSaveState() {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const trigger = async (action: () => void | Promise<void>) => {
    setIsSaving(true);
    try {
      await action();
      setSaved(true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setSaved(false);
        timeoutRef.current = null;
      }, 2500);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { saved, isSaving, trigger };
}

export function SectionCard({
  title,
  children,
  onReset,
  isResetting = false,
  resetLabel = 'Restaurar padrao',
  resettingLabel = 'Restaurando...',
}: {
  title: string;
  children: ReactNode;
  onReset?: () => void;
  isResetting?: boolean;
  resetLabel?: string;
  resettingLabel?: string;
}) {
  return (
    <div className="surface-card overflow-hidden rounded-sm shadow-[0_1px_2px_rgba(28,25,23,0.05)]">
      <div className="flex flex-col gap-2 px-4 py-4 border-b border-stone-100 bg-stone-50 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-medium text-stone-800 text-sm leading-relaxed break-words">{title}</h3>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={isResetting}
            className="w-full sm:w-auto h-10 sm:h-9 inline-flex items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-red-500 transition-colors whitespace-nowrap border border-stone-200 hover:border-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isResetting ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
            {isResetting ? resettingLabel : resetLabel}
          </button>
        )}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
