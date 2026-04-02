import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import BlogCard from '@/components/cards/BlogCard';
import { blogCategories } from '@/data/blogPostsData';
import { useAdminData } from '@/context/AdminDataContext';

export default function BlogPage() {
  const { blogPosts } = useAdminData();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const featured = blogPosts.find((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  const filtered = useMemo(() => {
    if (activeCategory === 'Todos') return rest;
    return rest.filter((p) => p.category === activeCategory);
  }, [activeCategory, rest]);

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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase font-medium mb-4">
              Fashion Bras
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
              Blog & Novidades
            </h1>
            <p className="text-stone-400 max-w-xl leading-relaxed">
              Tendências, dicas de estilo, eventos e muito mais. Fique por dentro do que
              há de mais novo no universo da moda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-6">Artigo em Destaque</p>
            <BlogCard post={featured} featured />
          </div>
        </section>
      )}

      {/* Category Filters */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
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
                Nenhum artigo nesta categoria ainda.
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
