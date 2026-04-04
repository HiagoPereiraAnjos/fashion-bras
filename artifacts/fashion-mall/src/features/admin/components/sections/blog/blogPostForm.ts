import type { BlogPost, BlogPostFormData } from '@/types';
import {
  hasMinLength,
  isRequired,
  isValidHttpUrl,
  isValidSlug,
  normalizeText,
} from '@/utils/validation';

export type BlogPostErrorKey =
  | 'title'
  | 'slug'
  | 'category'
  | 'date'
  | 'excerpt'
  | 'content'
  | 'coverImage'
  | 'author'
  | 'readTime';

export type BlogPostErrors = Partial<Record<BlogPostErrorKey, string>>;

export function toBlogPostFormData(post: BlogPost): BlogPostFormData {
  return { ...post };
}

export function toBlogPostEntity(form: BlogPostFormData): BlogPost {
  const { slug, ...rest } = form;
  return { slug: slug ?? `post-${Date.now()}`, ...rest };
}

export function buildNewBlogPostDraft(defaultCategory: string): BlogPost {
  return {
    slug: `post-${Date.now()}`,
    title: 'Novo Artigo',
    category: defaultCategory,
    date: new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
    author: '',
    readTime: '5 min',
    featured: false,
  };
}

export function sanitizePostForm(form: BlogPostFormData): BlogPostFormData {
  return {
    ...form,
    slug: normalizeText(form.slug ?? ''),
    title: normalizeText(form.title),
    category: normalizeText(form.category),
    date: normalizeText(form.date),
    excerpt: normalizeText(form.excerpt),
    content: normalizeText(form.content),
    coverImage: normalizeText(form.coverImage),
    author: normalizeText(form.author),
    readTime: normalizeText(form.readTime),
  };
}

export function validatePostForm(form: BlogPostFormData): BlogPostErrors {
  const errors: BlogPostErrors = {};
  const normalized = sanitizePostForm(form);

  if (!isRequired(normalized.title)) {
    errors.title = 'Título é obrigatório.';
  } else if (!hasMinLength(normalized.title, 4)) {
    errors.title = 'Use pelo menos 4 caracteres no título.';
  }

  if (!isRequired(normalized.slug ?? '')) {
    errors.slug = 'Slug é obrigatório.';
  } else if (!isValidSlug(normalized.slug ?? '')) {
    errors.slug = 'Use slug em minúsculas, sem espaços (ex: moda-verao-2026).';
  }

  if (!isRequired(normalized.category)) {
    errors.category = 'Categoria é obrigatória.';
  }

  if (!isRequired(normalized.date)) {
    errors.date = 'Data de publicação é obrigatória.';
  }

  if (!isRequired(normalized.author)) {
    errors.author = 'Autor é obrigatório.';
  }

  if (!isRequired(normalized.readTime)) {
    errors.readTime = 'Tempo de leitura é obrigatório.';
  }

  if (!isRequired(normalized.coverImage)) {
    errors.coverImage = 'Imagem de capa é obrigatória.';
  } else if (!isValidHttpUrl(normalized.coverImage)) {
    errors.coverImage = 'Use uma URL válida para a imagem de capa.';
  }

  if (!isRequired(normalized.excerpt)) {
    errors.excerpt = 'Resumo é obrigatório.';
  } else if (!hasMinLength(normalized.excerpt, 16)) {
    errors.excerpt = 'Resumo deve ter ao menos 16 caracteres.';
  }

  if (!isRequired(normalized.content)) {
    errors.content = 'Conteúdo completo é obrigatório.';
  } else if (!hasMinLength(normalized.content, 30)) {
    errors.content = 'Conteúdo deve ter ao menos 30 caracteres.';
  }

  return errors;
}
