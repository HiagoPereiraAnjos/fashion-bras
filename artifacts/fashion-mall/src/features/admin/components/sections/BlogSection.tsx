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

type SaveNotice = { tone: 'success' | 'error'; message: string } | null;

export default function BlogSection() {
  const { blogPosts, setBlogPosts, resetSection, blogCategories } = useAdminData();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState<SaveNotice>(null);
  const defaultCategory =
    blogCategories.find((category) => category !== BLOG_ALL_CATEGORY) ??
    blogPosts[0]?.category ??
    'Categoria';

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
    void (async () => {
      if (!confirm('Remover este artigo?')) return;
      try {
        await setBlogPosts(blogPosts.filter((post) => post.slug !== slug));
        toggleSaved();
        setNotice({ tone: 'success', message: 'Artigo removido com sucesso.' });
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error ? error.message : 'Nao foi possivel remover o artigo agora.',
        });
      }
    })();
  };

  const addPost = () => {
    void (async () => {
      const newPost = buildNewBlogPostDraft(defaultCategory);
      try {
        await setBlogPosts([...blogPosts, newPost]);
        setEditing(newPost);
        toggleSaved();
        setNotice({
          tone: 'success',
          message: 'Novo artigo criado. Complete os campos no editor.',
        });
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error ? error.message : 'Nao foi possivel criar um novo artigo.',
        });
      }
    })();
  };

  const resetBlog = () => {
    void (async () => {
      try {
        await resetSection('blogPosts');
        setNotice({ tone: 'success', message: 'Lista de artigos restaurada para o padrao.' });
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Nao foi possivel restaurar os artigos padrao.',
        });
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
      />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}

      <div className="space-y-2">
        {blogPosts.length === 0 ? (
          <EmptyAdminState
            title="Nenhum artigo cadastrado"
            description="Crie conteudos para alimentar a pagina de blog e o destaque da home."
            action={<AdminCreateButton onClick={addPost} label="Novo Artigo" />}
          />
        ) : (
          blogPosts.map((post) => (
            <div key={post.slug} className="bg-white border border-stone-100 p-4">
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
                    <p className="font-medium text-stone-800 text-sm md:truncate">
                      {post.title || 'Sem titulo'}
                    </p>
                    {post.featured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 shrink-0">
                        Destaque
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {post.category || 'Sem categoria'} - {post.date || 'Data nao informada'} -{' '}
                    {post.readTime || 'Tempo nao informado'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed md:truncate">
                    {post.excerpt || 'Sem resumo.'}
                  </p>
                </div>
                <div className="flex gap-2 sm:shrink-0 sm:flex-col md:flex-row">
                  <button
                    onClick={() => setEditing(post)}
                    aria-label={`Editar artigo ${post.title || 'sem titulo'}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:h-9 sm:w-9 sm:px-0 text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    <Edit3 size={15} />
                    <span className="text-xs sm:hidden">Editar</span>
                  </button>
                  <button
                    onClick={() => deletePost(post.slug)}
                    aria-label={`Remover artigo ${post.title || 'sem titulo'}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:h-9 sm:w-9 sm:px-0 text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                    <span className="text-xs sm:hidden">Remover</span>
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
