import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Edit3, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { BLOG_ALL_CATEGORY } from '@/features/content/services/defaults';
import {
  EmptyAdminState,
  Field,
  Input,
  InlineNotice,
  Select,
  Textarea,
} from '@/features/admin/components/shared/AdminFormControls';
import type { BlogPost, BlogPostFormData } from '@/types';
import {
  hasMinLength,
  isRequired,
  isValidHttpUrl,
  isValidSlug,
  normalizeText,
} from '@/utils/validation';

function toBlogPostFormData(post: BlogPost): BlogPostFormData {
  return { ...post };
}

function toBlogPostEntity(form: BlogPostFormData): BlogPost {
  const { slug, ...rest } = form;
  return { slug: slug ?? `post-${Date.now()}`, ...rest };
}

type BlogPostErrorKey =
  | 'title'
  | 'slug'
  | 'category'
  | 'date'
  | 'excerpt'
  | 'content'
  | 'coverImage'
  | 'author'
  | 'readTime';

type BlogPostErrors = Partial<Record<BlogPostErrorKey, string>>;

function sanitizePostForm(form: BlogPostFormData): BlogPostFormData {
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

function validatePostForm(form: BlogPostFormData): BlogPostErrors {
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

function PostEditor({
  post,
  onSave,
  onClose,
}: {
  post: BlogPost;
  onSave: (post: BlogPostFormData) => void;
  onClose: () => void;
}) {
  const { blogCategories } = useAdminData();
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
    new Set([form.category, ...blogCategories.filter((category) => category !== BLOG_ALL_CATEGORY)]),
  ).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center pt-16 pb-8 px-4"
    >
      <div className="bg-white w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <h3 className="font-medium text-stone-800 truncate pr-4">Editar Post: {form.title}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
            <Input value={form.coverImage} onChange={(value) => updateWithValidation('coverImage', value)} />
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
            Salvar Post
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BlogTab() {
  const { blogPosts, setBlogPosts, resetSection, blogCategories } = useAdminData();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saved, setSaved] = useState(false);
  const defaultCategory =
    blogCategories.find((category) => category !== BLOG_ALL_CATEGORY) ??
    blogPosts[0]?.category ??
    'Categoria';

  const savePost = (updated: BlogPostFormData) => {
    const normalizedPost = toBlogPostEntity(updated);
    setBlogPosts(blogPosts.map((post) => (post.slug === normalizedPost.slug ? normalizedPost : post)));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deletePost = (slug: string) => {
    if (confirm('Remover este artigo?')) {
      setBlogPosts(blogPosts.filter((post) => post.slug !== slug));
    }
  };

  const addPost = () => {
    const newPost: BlogPost = {
      slug: `post-${Date.now()}`,
      title: 'Novo Artigo',
      category: defaultCategory,
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
      author: '',
      readTime: '5 min',
      featured: false,
    };

    setBlogPosts([...blogPosts, newPost]);
    setEditing(newPost);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">{blogPosts.length} artigos</span>
          {saved && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Check size={12} />
              Salvo
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => resetSection('blogPosts')}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 px-3 py-2 border border-stone-200"
          >
            <RotateCcw size={12} />
            Restaurar
          </button>
          <button
            onClick={addPost}
            className="flex items-center gap-2 bg-stone-900 text-white text-xs px-4 py-2 uppercase tracking-wider hover:bg-amber-700 transition-colors"
          >
            <Plus size={14} />
            Novo Artigo
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {blogPosts.length === 0 ? (
          <EmptyAdminState
            title="Nenhum artigo cadastrado"
            description="Crie conteúdos para alimentar a página de blog e o destaque da home."
            action={(
              <button
                onClick={addPost}
                className="flex items-center gap-2 bg-stone-900 text-white text-xs px-4 py-2 uppercase tracking-wider hover:bg-amber-700 transition-colors"
              >
                <Plus size={14} />
                Novo Artigo
              </button>
            )}
          />
        ) : (
          blogPosts.map((post) => (
            <div key={post.slug} className="flex items-center gap-4 bg-white border border-stone-100 p-4">
              <img
                src={post.coverImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80'}
                alt=""
                className="w-20 h-14 object-cover shrink-0 bg-stone-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-stone-800 text-sm truncate">{post.title || 'Sem título'}</p>
                  {post.featured && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 shrink-0">
                      Destaque
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  {post.category || 'Sem categoria'} · {post.date || 'Data não informada'} · {post.readTime || 'Tempo não informado'}
                </p>
                <p className="text-xs text-stone-500 mt-1 truncate">{post.excerpt || 'Sem resumo.'}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditing(post)}
                  className="p-2 text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => deletePost(post.slug)}
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
        {editing && <PostEditor post={editing} onSave={savePost} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </div>
  );
}
