import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CalendarDays, User } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import BlogCard from '@/components/cards/BlogCard';
import { useSiteContent } from '@/features/content';
import { usePageSeo } from '@/seo/usePageSeo';

export default function BlogPostPage() {
  const { blogPosts } = useSiteContent();
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  usePageSeo(
    post
      ? {
          title: post.title,
          description: post.excerpt,
          canonicalPath: `/blog/${post.slug}`,
          image: post.coverImage,
          type: 'article',
        }
      : {
          title: 'Artigo não encontrado',
          description: 'O artigo solicitado não foi encontrado no blog do Fashion Bras.',
          canonicalPath: '/blog',
          noIndex: true,
        },
  );

  if (!post) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="font-serif text-3xl text-stone-400 mb-4">Artigo não encontrado</p>
            <Link href="/blog">
              <span className="text-amber-700 text-xs tracking-widest uppercase font-medium hover:underline cursor-pointer">
                Voltar para o Blog
              </span>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const fallbackRelated = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const relatedPosts = related.length > 0 ? related : fallbackRelated;
  const coverImage =
    post.coverImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80';
  const author = post.author || 'Equipe Fashion Bras';
  const readTime = post.readTime || 'Tempo não informado';
  const excerpt = post.excerpt || 'Conteúdo em atualização.';

  // Simple markdown-like renderer
  const renderContent = (content: string) => {
    const normalizedContent = content.trim();
    if (!normalizedContent) {
      return (
        <p className="text-stone-600 leading-relaxed mb-4">
          Este artigo está em atualização e será publicado em breve.
        </p>
      );
    }

    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('**') && block.endsWith('**')) {
        return (
          <h3 key={i} className="font-serif text-xl font-bold text-stone-900 mt-8 mb-3">
            {block.replace(/\*\*/g, '')}
          </h3>
        );
      }
      // Handle inline bold
      const parts = block.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-stone-600 leading-relaxed mb-4">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="font-semibold text-stone-800">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative pt-20">
        <div className="h-[50vh] min-h-[400px] overflow-hidden relative">
          <img
            src={coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="inline-block bg-amber-500 text-white text-xs px-4 py-1.5 tracking-widest uppercase font-medium mb-4">
                {post.category}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Back */}
      <div className="section-shell py-4 max-w-4xl mx-auto">
        <Link href="/blog">
          <span className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-700 text-xs tracking-widest uppercase cursor-pointer transition-colors">
            <ArrowLeft size={14} />
            Voltar para o Blog
          </span>
        </Link>
      </div>

      {/* Article */}
      <article className="section-shell max-w-4xl mx-auto pb-20">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-stone-400 text-sm py-6 border-b border-stone-100 mb-8">
          <span className="flex items-center gap-2">
            <User size={14} />
            {author}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays size={14} />
            {post.date || 'Data não informada'}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} />
            {readTime} de leitura
          </span>
        </div>

        {/* Excerpt */}
        <p className="text-lg text-stone-700 leading-relaxed italic border-l-2 border-amber-500 pl-6 mb-8">
          {excerpt}
        </p>

        {/* Content */}
        <div className="prose-stone max-w-none">
          {renderContent(post.content)}
        </div>
      </article>

      {/* Related */}
      {relatedPosts.length > 0 && (
        <section className="section-shell py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-10">
              Artigos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
