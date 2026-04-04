import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Edit3, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import type { Store, StoreFormData } from '@/types';
import {
  EmptyAdminState,
  Field,
  Input,
  InlineNotice,
  Select,
  Textarea,
} from '@/features/admin/components/shared/AdminFormControls';
import {
  hasMinLength,
  isRequired,
  isValidHttpUrl,
  isValidPhone,
  normalizeText,
} from '@/utils/validation';

function toStoreFormData(store: Store): StoreFormData {
  return { ...store, images: [...store.images] };
}

function toStoreEntity(form: StoreFormData): Store {
  const { id, ...rest } = form;
  return { id: id ?? `store-${Date.now()}`, ...rest };
}

type StoreFormErrorKey =
  | 'name'
  | 'segmentSlug'
  | 'floor'
  | 'phone'
  | 'instagram'
  | 'description'
  | 'longDescription'
  | 'images';

type StoreFormErrors = Partial<Record<StoreFormErrorKey, string>>;

function isValidInstagram(value: string): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return true;
  if (isValidHttpUrl(normalized)) return true;
  return /^@?[a-zA-Z0-9._]{2,30}$/.test(normalized);
}

function sanitizeStoreForm(form: StoreFormData): StoreFormData {
  return {
    ...form,
    name: normalizeText(form.name),
    segment: normalizeText(form.segment),
    segmentSlug: normalizeText(form.segmentSlug),
    floor: normalizeText(form.floor),
    description: normalizeText(form.description),
    longDescription: normalizeText(form.longDescription),
    phone: normalizeText(form.phone),
    instagram: normalizeText(form.instagram),
    images: form.images.map((image) => normalizeText(image)).filter(isRequired),
  };
}

function validateStoreForm(form: StoreFormData): StoreFormErrors {
  const errors: StoreFormErrors = {};
  const normalized = sanitizeStoreForm(form);

  if (!isRequired(normalized.name)) {
    errors.name = 'Nome da loja é obrigatório.';
  } else if (!hasMinLength(normalized.name, 2)) {
    errors.name = 'Use pelo menos 2 caracteres no nome.';
  }

  if (!isRequired(normalized.segmentSlug)) {
    errors.segmentSlug = 'Selecione um segmento.';
  }

  if (!isRequired(normalized.floor)) {
    errors.floor = 'Informe piso/localização.';
  }

  if (!isRequired(normalized.description)) {
    errors.description = 'Descrição curta é obrigatória.';
  } else if (!hasMinLength(normalized.description, 12)) {
    errors.description = 'Descrição curta deve ter ao menos 12 caracteres.';
  }

  if (!isRequired(normalized.longDescription)) {
    errors.longDescription = 'Descrição completa é obrigatória.';
  } else if (!hasMinLength(normalized.longDescription, 20)) {
    errors.longDescription = 'Descrição completa deve ter ao menos 20 caracteres.';
  }

  if (isRequired(normalized.phone) && !isValidPhone(normalized.phone)) {
    errors.phone = 'Telefone inválido. Use DDD e número.';
  }

  if (!isValidInstagram(normalized.instagram)) {
    errors.instagram = 'Use @usuario ou URL válida do Instagram.';
  }

  if (normalized.images.length === 0) {
    errors.images = 'Adicione ao menos uma imagem.';
  } else if (normalized.images.some((image) => !isValidHttpUrl(image))) {
    errors.images = 'Todas as imagens devem ser URLs válidas (http/https).';
  }

  return errors;
}

function StoreEditor({
  store,
  onSave,
  onClose,
}: {
  store: Store;
  onSave: (store: StoreFormData) => void;
  onClose: () => void;
}) {
  const { storeSegments } = useAdminData();
  const [form, setForm] = useState<StoreFormData>(() => toStoreFormData(store));
  const [errors, setErrors] = useState<StoreFormErrors>({});
  const [attemptedSave, setAttemptedSave] = useState(false);
  const update = (key: keyof StoreFormData, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateWithValidation = (key: keyof StoreFormData, value: string) => {
    update(key, value);

    if (!attemptedSave) return;
    const nextForm = { ...form, [key]: value };
    setErrors(validateStoreForm(nextForm));
  };

  const handleSave = () => {
    setAttemptedSave(true);
    const nextErrors = validateStoreForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSave(sanitizeStoreForm(form));
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center pt-16 pb-8 px-4"
    >
      <div className="bg-white w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <h3 className="font-medium text-stone-800">Editar Loja: {form.name}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
                }}
                options={storeSegments
                  .filter((item) => item.slug !== 'todos')
                  .map((item) => ({ value: item.slug, label: item.label }))}
              />
              {errors.segmentSlug && (
                <p className="mt-1 text-xs text-red-600">{errors.segmentSlug}</p>
              )}
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Piso / Localização">
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
          <Field label="Descrição Curta">
            <Textarea
              value={form.description}
              onChange={(value) => updateWithValidation('description', value)}
              rows={2}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </Field>
          <Field label="Descrição Completa">
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
                Exibir como loja em destaque na página inicial
              </span>
            </label>
          </Field>
          {attemptedSave && Object.keys(errors).length > 0 && (
            <InlineNotice
              tone="error"
              message="Corrija os campos destacados antes de salvar esta loja."
            />
          )}
        </div>
        <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-stone-500 border border-stone-200 hover:border-stone-400 uppercase tracking-wider"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-stone-900 text-white text-xs uppercase tracking-wider hover:bg-amber-700 transition-colors"
          >
            Salvar Loja
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function StoresTab() {
  const { stores, setStores, resetSection } = useAdminData();
  const [editing, setEditing] = useState<Store | null>(null);
  const [saved, setSaved] = useState(false);

  const saveStore = (updated: StoreFormData) => {
    const normalizedStore = toStoreEntity(updated);
    setStores(stores.map((store) => (store.id === normalizedStore.id ? normalizedStore : store)));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteStore = (id: string) => {
    if (confirm('Remover esta loja?')) {
      setStores(stores.filter((store) => store.id !== id));
    }
  };

  const addStore = () => {
    const newStore: Store = {
      id: `store-${Date.now()}`,
      name: 'Nova Loja',
      segment: 'Moda Feminina',
      segmentSlug: 'feminina',
      floor: 'Piso 1',
      description: '',
      longDescription: '',
      phone: '',
      instagram: '',
      images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80'],
      featured: false,
    };

    setStores([...stores, newStore]);
    setEditing(newStore);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">{stores.length} lojas cadastradas</span>
          {saved && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Check size={12} />
              Salvo
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => resetSection('stores')}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors px-3 py-2 border border-stone-200"
          >
            <RotateCcw size={12} />
            Restaurar
          </button>
          <button
            onClick={addStore}
            className="flex items-center gap-2 bg-stone-900 text-white text-xs px-4 py-2 uppercase tracking-wider hover:bg-amber-700 transition-colors"
          >
            <Plus size={14} />
            Nova Loja
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {stores.length === 0 ? (
          <EmptyAdminState
            title="Nenhuma loja cadastrada"
            description="Adicione sua primeira loja para exibir conteúdo na página de lojas."
            action={(
              <button
                onClick={addStore}
                className="flex items-center gap-2 bg-stone-900 text-white text-xs px-4 py-2 uppercase tracking-wider hover:bg-amber-700 transition-colors"
              >
                <Plus size={14} />
                Nova Loja
              </button>
            )}
          />
        ) : (
          stores.map((store) => (
            <div
              key={store.id}
              className="flex items-center gap-4 bg-white border border-stone-100 p-4 hover:border-stone-200 transition-colors"
            >
              <img
                src={store.images[0] || 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80'}
                alt={store.name}
                className="w-14 h-14 object-cover shrink-0 bg-stone-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-stone-800 text-sm">{store.name || 'Loja sem nome'}</p>
                  {store.featured && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5">Destaque</span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  {store.segment || 'Segmento não definido'} · {store.floor || 'Localização não definida'}
                </p>
                <p className="text-xs text-stone-500 mt-1 truncate">
                  {store.description || 'Sem descrição.'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditing(store)}
                  className="p-2 text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => deleteStore(store.id)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {editing && <StoreEditor store={editing} onSave={saveStore} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </div>
  );
}
