import { useState } from 'react';
import { BLOG_ALL_CATEGORY } from '@/services/content/defaults';
import { AdminEditorModal } from '@/features/admin/components/shared/AdminEditorModal';
import {
  Field,
  InlineNotice,
  Input,
  Select,
  Textarea,
} from '@/features/admin/components/shared/AdminFormControls';
import {
  sanitizePostForm,
  toBlogPostFormData,
  type BlogPostErrors,
  validatePostForm,
} from '@/features/admin/components/sections/blog/blogPostForm';
import type { BlogPost, BlogPostFormData } from '@/types';

interface BlogPostEditorModalProps {
  post: BlogPost;
  blogCategories: string[];
  onSave: (post: BlogPostFormData) => void;
  onClose: () => void;
}

export function BlogPostEditorModal({
  post,
  blogCategories,
  onSave,
  onClose,
}: BlogPostEditorModalProps) {
  const [form, setForm] = useState<BlogPostFormData>(() => toBlogPostFormData(post));
  const [errors, setErrors] = useState<BlogPostErrors>({});
  const [attemptedSave, setAttemptedSave] = useState(false);
  const update = (key: keyof BlogPostFormData, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateWithValidation = (key: keyof BlogPostFormData, value: string | boolean) => {
    update(key, value);
    if (!attemptedSave) return;
    const nextForm = { ...form, [key]: value };
    setErrors(validatePostForm(nextForm));
  };

  const handleSave = () => {
    setAttemptedSave(true);
    const nextErrors = validatePostForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSave(sanitizePostForm(form));
    onClose();
  };

  const selectableCategories = Array.from(
    new Set([
      form.category,
      ...blogCategories.filter((category) => category !== BLOG_ALL_CATEGORY),
    ]),
  ).filter(Boolean);

  return (
    <AdminEditorModal
      title={`Editar Post: ${form.title}`}
      onClose={onClose}
      onSave={handleSave}
      saveLabel="Salvar Post"
      titleClassName="font-medium text-stone-800 truncate pr-4"
    >
      <Field label="Título">
        <Input value={form.title} onChange={(value) => updateWithValidation('title', value)} />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Slug (URL)">
          <Input
            value={form.slug ?? ''}
            onChange={(value) => updateWithValidation('slug', value)}
            placeholder="titulo-do-post"
          />
          {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
        </Field>
        <Field label="Categoria">
          <Select
            value={form.category}
            onChange={(value) => updateWithValidation('category', value)}
            options={selectableCategories.map((category) => ({
              value: category,
              label: category,
            }))}
          />
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Autor">
          <Input value={form.author} onChange={(value) => updateWithValidation('author', value)} />
          {errors.author && <p className="mt-1 text-xs text-red-600">{errors.author}</p>}
        </Field>
        <Field label="Tempo de Leitura">
          <Input
            value={form.readTime}
            onChange={(value) => updateWithValidation('readTime', value)}
            placeholder="5 min"
          />
          {errors.readTime && <p className="mt-1 text-xs text-red-600">{errors.readTime}</p>}
        </Field>
      </div>
      <Field label="Data de Publicação">
        <Input value={form.date} onChange={(value) => updateWithValidation('date', value)} />
        {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
      </Field>
      <Field label="Imagem de Capa (URL)">
        <Input
          value={form.coverImage}
          onChange={(value) => updateWithValidation('coverImage', value)}
        />
        {errors.coverImage && <p className="mt-1 text-xs text-red-600">{errors.coverImage}</p>}
      </Field>
      {form.coverImage && (
        <img src={form.coverImage} alt="" className="w-full h-32 object-cover border border-stone-100" />
      )}
      <Field label="Resumo (excerpt)">
        <Textarea
          value={form.excerpt}
          onChange={(value) => updateWithValidation('excerpt', value)}
          rows={2}
        />
        {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>}
      </Field>
      <Field label="Conteúdo Completo">
        <Textarea
          value={form.content}
          onChange={(value) => updateWithValidation('content', value)}
          rows={10}
          placeholder="Use **texto** para negrito, duas linhas em branco para novo parágrafo..."
        />
        {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
      </Field>
      <Field label="Destaque">
        <label className="flex items-center gap-2 cursor-pointer mt-1">
          <input
            type="checkbox"
            checked={!!form.featured}
            onChange={(event) => updateWithValidation('featured', event.target.checked)}
            className="accent-amber-600"
          />
          <span className="text-sm text-stone-700">
            Exibir como artigo em destaque no topo do blog
          </span>
        </label>
      </Field>
      {attemptedSave && Object.keys(errors).length > 0 && (
        <InlineNotice
          tone="error"
          message="Corrija os campos destacados antes de salvar este artigo."
        />
      )}
    </AdminEditorModal>
  );
}
