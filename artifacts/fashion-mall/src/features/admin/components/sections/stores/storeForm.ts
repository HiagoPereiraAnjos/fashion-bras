import type { Store, StoreFormData } from '@/types';
import {
  hasMinLength,
  isRequired,
  isValidHttpUrl,
  isValidPhone,
  normalizeText,
} from '@/utils/validation';

export type StoreFormErrorKey =
  | 'name'
  | 'segmentSlug'
  | 'floor'
  | 'phone'
  | 'instagram'
  | 'description'
  | 'longDescription'
  | 'images';

export type StoreFormErrors = Partial<Record<StoreFormErrorKey, string>>;

export function toStoreFormData(store: Store): StoreFormData {
  return { ...store, images: [...store.images] };
}

export function toStoreEntity(form: StoreFormData): Store {
  const { id, ...rest } = form;
  return { id: id ?? `store-${Date.now()}`, ...rest };
}

export function buildNewStoreDraft(): Store {
  return {
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
}

function isValidInstagram(value: string): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return true;
  if (isValidHttpUrl(normalized)) return true;
  return /^@?[a-zA-Z0-9._]{2,30}$/.test(normalized);
}

export function sanitizeStoreForm(form: StoreFormData): StoreFormData {
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

export function validateStoreForm(form: StoreFormData): StoreFormErrors {
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
