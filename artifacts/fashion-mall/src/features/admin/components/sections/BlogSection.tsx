import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { BLOG_ALL_CATEGORY } from '@/services/content/defaults';
import { AdminCollectionHeader } from '@/features/admin/components/shared/AdminCollectionHeader';
import { AdminCreateButton } from '@/features/admin/components/shared/AdminCreateButton';
import { EmptyAdminState } from '@/features/admin/components/shared/AdminFormControls';
import { BlogPostEditorModal } from '@/features/admin/components/sections/blog/BlogPostEditorModal';
import {
  buildNewBlogPostDraft,
  toBlogPostEntity,
} from '@/features/admin/components/sections/blog/blogPostForm';
import type { BlogPost, BlogPostFormData } from '@/types';

export default function BlogSection() {
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
    const newPost = buildNewBlogPostDraft(defaultCategory);
    setBlogPosts([...blogPosts, newPost]);
    setEditing(newPost);
  };

  return (
    <div className="space-y-4">
      <AdminCollectionHeader
        countLabel={`${blogPosts.length} artigos`}
        saved={saved}
        onReset={() => resetSection('blogPosts')}
        onCreate={addPost}
        createLabel="Novo Artigo"
      />

      <div className="space-y-2">
        {blogPosts.length === 0 ? (
          <EmptyAdminState
            title="Nenhum artigo cadastrado"
            description="Crie conteúdos para alimentar a página de blog e o destaque da home."
            action={<AdminCreateButton onClick={addPost} label="Novo Artigo" />}
          />
        ) : (
          blogPosts.map((post) => (
            <div key={post.slug} className="flex items-center gap-4 bg-white border border-stone-100 p-4">
              <img
                src={
                  post.coverImage ||
                  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80'
                }
                alt=""
                className="w-20 h-14 object-cover shrink-0 bg-stone-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-stone-800 text-sm truncate">
                    {post.title || 'Sem título'}
                  </p>
                  {post.featured && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 shrink-0">
                      Destaque
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  {post.category || 'Sem categoria'} · {post.date || 'Data não informada'} ·{' '}
                  {post.readTime || 'Tempo não informado'}
                </p>
                <p className="text-xs text-stone-500 mt-1 truncate">
                  {post.excerpt || 'Sem resumo.'}
                </p>
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
