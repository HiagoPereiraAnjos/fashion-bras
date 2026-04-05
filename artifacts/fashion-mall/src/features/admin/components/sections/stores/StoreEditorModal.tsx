import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminEditorModal } from '@/features/admin/components/shared/AdminEditorModal';
import {
  Field,
  InlineNotice,
  Input,
  Select,
  Textarea,
} from '@/features/admin/components/shared/AdminFormControls';
import {
  sanitizeStoreForm,
  toStoreFormData,
  type StoreFormErrors,
  validateStoreForm,
} from '@/features/admin/components/sections/stores/storeForm';
import type { Store, StoreCategory, StoreFormData } from '@/types';

interface StoreEditorModalProps {
  store: Store;
  storeSegments: StoreCategory[];
  onSave: (store: StoreFormData) => Promise<void>;
  onClose: () => void;
}

export function StoreEditorModal({
  store,
  storeSegments,
  onSave,
  onClose,
}: StoreEditorModalProps) {
  const [form, setForm] = useState<StoreFormData>(() => toStoreFormData(store));
  const [errors, setErrors] = useState<StoreFormErrors>({});
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const update = (key: keyof StoreFormData, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (saveError) setSaveError(null);
  };

  const updateWithValidation = (key: keyof StoreFormData, value: string) => {
    update(key, value);

    if (!attemptedSave) return;
    const nextForm = { ...form, [key]: value };
    setErrors(validateStoreForm(nextForm));
  };

  const handleSave = async () => {
    setAttemptedSave(true);
    const nextErrors = validateStoreForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSaveError(null);
    setIsSaving(true);
    try {
      await onSave(sanitizeStoreForm(form));
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Nao foi possivel salvar esta loja.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminEditorModal
      title={`Editar Loja: ${form.name}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel="Salvar Loja"
      isSaving={isSaving}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome da Loja">
          <Input value={form.name} onChange={(value) => updateWithValidation('name', value)} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </Field>
        <Field label="Segmento">
          <Select
            value={form.segmentSlug}
            onChange={(value) => {
              const segment = storeSegments.find((item) => item.slug === value);
              const nextForm = {
                ...form,
                segmentSlug: value,
                segment: segment?.label || value,
              };
              setForm((current) => ({
                ...current,
                segmentSlug: value,
                segment: segment?.label || value,
              }));

              if (attemptedSave) setErrors(validateStoreForm(nextForm));
              if (saveError) setSaveError(null);
            }}
            options={storeSegments
              .filter((item) => item.slug !== 'todos')
              .map((item) => ({ value: item.slug, label: item.label }))}
          />
          {errors.segmentSlug && <p className="mt-1 text-xs text-red-600">{errors.segmentSlug}</p>}
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Piso / Localizacao">
          <Input value={form.floor} onChange={(value) => updateWithValidation('floor', value)} />
          {errors.floor && <p className="mt-1 text-xs text-red-600">{errors.floor}</p>}
        </Field>
        <Field label="Telefone">
          <Input value={form.phone} onChange={(value) => updateWithValidation('phone', value)} />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </Field>
      </div>
      <Field label="Instagram">
        <Input value={form.instagram} onChange={(value) => updateWithValidation('instagram', value)} />
        {errors.instagram && <p className="mt-1 text-xs text-red-600">{errors.instagram}</p>}
      </Field>
      <Field label="Descricao Curta">
        <Textarea
          value={form.description}
          onChange={(value) => updateWithValidation('description', value)}
          rows={2}
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </Field>
      <Field label="Descricao Completa">
        <Textarea
          value={form.longDescription}
          onChange={(value) => updateWithValidation('longDescription', value)}
          rows={5}
        />
        {errors.longDescription && (
          <p className="mt-1 text-xs text-red-600">{errors.longDescription}</p>
        )}
      </Field>
      <div>
        <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">
          Imagens (URLs)
        </label>
        {form.images.map((image, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              value={image}
              onChange={(value) => {
                const images = [...form.images];
                images[index] = value;
                const nextForm = { ...form, images };
                setForm((current) => ({ ...current, images }));
                if (attemptedSave) setErrors(validateStoreForm(nextForm));
                if (saveError) setSaveError(null);
              }}
              placeholder="https://..."
            />
            <button
              onClick={() => {
                const nextImages = form.images.filter((_, imageIndex) => imageIndex !== index);
                const nextForm = { ...form, images: nextImages };
                setForm((current) => ({
                  ...current,
                  images: current.images.filter((_, imageIndex) => imageIndex !== index),
                }));
                if (attemptedSave) setErrors(validateStoreForm(nextForm));
                if (saveError) setSaveError(null);
              }}
              className="text-red-400 hover:text-red-600 px-2"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const nextForm = { ...form, images: [...form.images, ''] };
            setForm((current) => ({ ...current, images: [...current.images, ''] }));
            if (attemptedSave) setErrors(validateStoreForm(nextForm));
            if (saveError) setSaveError(null);
          }}
          className="text-xs text-amber-700 hover:underline flex items-center gap-1 mt-1"
        >
          <Plus size={12} />
          Adicionar imagem
        </button>
        {errors.images && <p className="mt-2 text-xs text-red-600">{errors.images}</p>}
      </div>
      <Field label="Destaque na Home">
        <label className="flex items-center gap-2 cursor-pointer mt-1">
          <input
            type="checkbox"
            checked={!!form.featured}
            onChange={(event) =>
              setForm((current) => ({ ...current, featured: event.target.checked }))
            }
            className="accent-amber-600"
          />
          <span className="text-sm text-stone-700">
            Exibir como loja em destaque na pagina inicial
          </span>
        </label>
      </Field>
      {attemptedSave && Object.keys(errors).length > 0 && (
        <InlineNotice
          tone="error"
          message="Corrija os campos destacados antes de salvar esta loja."
        />
      )}
      {saveError && <InlineNotice tone="error" message={saveError} />}
    </AdminEditorModal>
  );
}
