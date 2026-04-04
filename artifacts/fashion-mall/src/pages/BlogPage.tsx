import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import BlogCard from '@/components/cards/BlogCard';
import { BLOG_ALL_CATEGORY, useSiteContent } from '@/features/content';
import { usePageSeo } from '@/seo/usePageSeo';

export default function BlogPage() {
  const { featuredBlogPost, blogFeedPosts, blogCategories } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState(BLOG_ALL_CATEGORY);

  usePageSeo({
    title: 'Blog de Moda e Tendências',
    description:
      'Acompanhe tendências, dicas de estilo, eventos e novidades do universo fashion no blog oficial do Fashion Bras.',
    canonicalPath: '/blog',
  });

  useEffect(() => {
    if (!blogCategories.includes(activeCategory)) {
      setActiveCategory(BLOG_ALL_CATEGORY);
    }
  }, [activeCategory, blogCategories]);

  const filtered = useMemo(() => {
    if (activeCategory === BLOG_ALL_CATEGORY) return blogFeedPosts;
    return blogFeedPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory, blogFeedPosts]);

  const hasAnyPosts = blogFeedPosts.length > 0;

  return (
    <MainLayout>
      {/* Header */}
      <section className="relative pt-40 pb-20 bg-stone-950">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="section-shell relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="page-hero-kicker">
              Fashion Bras
            </p>
            <h1 className="page-hero-title">
              Blog & Novidades
            </h1>
            <p className="page-hero-description">
              Tendências, dicas de estilo, eventos e muito mais. Fique por dentro do que
              há de mais novo no universo da moda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {featuredBlogPost && (
      <section className="section-shell py-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-6">Artigo em Destaque</p>
            <BlogCard post={featuredBlogPost} featured />
          </div>
        </section>
      )}

      {/* Category Filters */}
      <section className="section-shell py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs tracking-wider uppercase font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-stone-400">
                {hasAnyPosts ? 'Nenhum artigo nesta categoria ainda.' : 'Nenhum artigo publicado ainda.'}
              </p>
              <p className="text-stone-400 text-sm mt-2">
                {hasAnyPosts
                  ? 'Escolha outra categoria para ver mais conteúdos.'
                  : 'Novos conteúdos serão disponibilizados em breve.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
