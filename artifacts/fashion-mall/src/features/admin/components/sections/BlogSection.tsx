import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { BLOG_ALL_CATEGORY } from '@/services/content/defaults';
import { AdminCollectionHeader } from '@/features/admin/components/shared/AdminCollectionHeader';
import { AdminCreateButton } from '@/features/admin/components/shared/AdminCreateButton';
import {
  EmptyAdminState,
  InlineNotice,
} from '@/features/admin/components/shared/AdminFormControls';
import { BlogPostEditorModal } from '@/features/admin/components/sections/blog/BlogPostEditorModal';
import {
  buildNewBlogPostDraft,
  toBlogPostEntity,
} from '@/features/admin/components/sections/blog/blogPostForm';
import type { BlogPost, BlogPostFormData } from '@/types';
import { resolveUserFacingError } from '@/services/errors/userFacingError';

type SaveNotice = { tone: 'info' | 'success' | 'error'; message: string } | null;

export default function BlogSection() {
  const { blogPosts, setBlogPosts, resetSection, blogCategories } = useAdminData();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState<SaveNotice>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [deletingPostSlug, setDeletingPostSlug] = useState<string | null>(null);
  const defaultCategory =
    blogCategories.find((category) => category !== BLOG_ALL_CATEGORY) ??
    blogPosts[0]?.category ??
    'Categoria';
  const hasPendingAction = isCreating || isResetting || deletingPostSlug !== null;

  const toggleSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const savePost = async (updated: BlogPostFormData) => {
    const normalizedPost = toBlogPostEntity(updated);
    await setBlogPosts(
      blogPosts.map((post) => (post.slug === normalizedPost.slug ? normalizedPost : post)),
    );
    toggleSaved();
    setNotice({ tone: 'success', message: 'Artigo salvo com sucesso.' });
  };

  const deletePost = (slug: string) => {
    if (hasPendingAction) return;

    void (async () => {
      if (!confirm('Remover este artigo?')) return;

      setDeletingPostSlug(slug);
      setNotice({ tone: 'info', message: 'Removendo artigo...' });
      try {
        await setBlogPosts(blogPosts.filter((post) => post.slug !== slug));
        toggleSaved();
        setNotice({ tone: 'success', message: 'Artigo removido com sucesso.' });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel remover o artigo agora.',
          validationMessage: 'Nao foi possivel remover o artigo com os dados enviados.',
        });
        setNotice({
          tone: 'error',
          message,
        });
      } finally {
        setDeletingPostSlug(null);
      }
    })();
  };

  const addPost = () => {
    if (hasPendingAction) return;

    void (async () => {
      const newPost = buildNewBlogPostDraft(defaultCategory);
      setIsCreating(true);
      setNotice({ tone: 'info', message: 'Criando novo artigo...' });
      try {
        await setBlogPosts([...blogPosts, newPost]);
        setEditing(newPost);
        toggleSaved();
        setNotice({
          tone: 'success',
          message: 'Novo artigo criado. Complete os campos no editor.',
        });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel criar um novo artigo.',
          validationMessage: 'Nao foi possivel criar o artigo com os dados enviados.',
        });
        setNotice({
          tone: 'error',
          message,
        });
      } finally {
        setIsCreating(false);
      }
    })();
  };

  const resetBlog = () => {
    if (hasPendingAction) return;

    void (async () => {
      setIsResetting(true);
      setNotice({ tone: 'info', message: 'Restaurando lista de artigos...' });
      try {
        await resetSection('blogPosts');
        setNotice({ tone: 'success', message: 'Lista de artigos restaurada para o padrao.' });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel restaurar os artigos padrao.',
          validationMessage: 'Nao foi possivel restaurar os artigos no momento.',
        });
        setNotice({
          tone: 'error',
          message,
        });
      } finally {
        setIsResetting(false);
      }
    })();
  };

  return (
    <div className="space-y-4">
      <AdminCollectionHeader
        countLabel={`${blogPosts.length} artigos`}
        saved={saved}
        onReset={resetBlog}
        onCreate={addPost}
        createLabel="Novo Artigo"
        isResetting={isResetting}
        isCreating={isCreating}
        disableActions={deletingPostSlug !== null}
        resetLoadingLabel="Restaurando..."
        createLoadingLabel="Criando artigo..."
      />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}

      <div className="space-y-2">
        {blogPosts.length === 0 ? (
          <EmptyAdminState
            title="Nenhum artigo cadastrado"
            description="Crie conteudos para alimentar a pagina de blog e o destaque da home."
            action={
              <AdminCreateButton
                onClick={addPost}
                label="Novo Artigo"
                isLoading={isCreating}
                disabled={hasPendingAction}
                loadingLabel="Criando artigo..."
              />
            }
          />
        ) : (
          blogPosts.map((post) => (
            <div
              key={post.slug}
              className="bg-white border border-stone-100 p-4 hover:border-stone-200 hover:shadow-[0_1px_3px_rgba(28,25,23,0.08)] transition-all"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <img
                  src={
                    post.coverImage ||
                    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80'
                  }
                  alt=""
                  className="w-full h-40 sm:w-20 sm:h-14 object-cover bg-stone-100 sm:shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-stone-800 text-sm break-words md:truncate">
                      {post.title || 'Sem titulo'}
                    </p>
                    {post.featured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 shrink-0">
                        Destaque
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 break-words">
                    {post.category || 'Sem categoria'} - {post.date || 'Data nao informada'} -{' '}
                    {post.readTime || 'Tempo nao informado'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed break-words md:truncate">
                    {post.excerpt || 'Sem resumo.'}
                  </p>
                </div>
                <div className="flex gap-2 sm:shrink-0 sm:flex-col md:flex-row">
                  <button
                    type="button"
                    onClick={() => setEditing(post)}
                    aria-label={`Editar artigo ${post.title || 'sem titulo'}`}
                    disabled={hasPendingAction}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:h-9 sm:w-9 sm:px-0 text-stone-500 hover:text-amber-700 hover:bg-amber-50 border border-stone-200 sm:border-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Edit3 size={15} />
                    <span className="text-xs sm:hidden">Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(post.slug)}
                    aria-label={`Remover artigo ${post.title || 'sem titulo'}`}
                    disabled={hasPendingAction}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:h-9 sm:w-9 sm:px-0 text-stone-500 hover:text-red-600 hover:bg-red-50 border border-stone-200 sm:border-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                  >
                    <Trash2 size={15} className={deletingPostSlug === post.slug ? 'animate-pulse' : ''} />
                    <span className="text-xs sm:hidden">
                      {deletingPostSlug === post.slug ? 'Removendo...' : 'Remover'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <BlogPostEditorModal
            post={editing}
            blogCategories={blogCategories}
            onSave={savePost}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
