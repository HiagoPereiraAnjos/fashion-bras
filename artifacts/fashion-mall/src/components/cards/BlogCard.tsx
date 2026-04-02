import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  featured?: boolean;
}

export default function BlogCard({ post, index = 0, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="group relative overflow-hidden img-zoom"
      >
        <div className="relative" style={{ aspectRatio: '21/9', minHeight: '420px' }}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Layered gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14">
            <div className="section-label mb-5">
              <span>{post.category}</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-light text-white mb-4 leading-tight tracking-wide max-w-3xl italic">
              {post.title}
            </h2>
            <p className="text-stone-300/80 text-sm leading-relaxed mb-7 line-clamp-2 max-w-2xl font-light">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-stone-400 text-[10px] tracking-[0.15em] uppercase">
                <span>{post.author}</span>
                <span className="w-px h-3 bg-stone-600" />
                <span className="flex items-center gap-1.5">
                  <Clock size={11} strokeWidth={1.5} />
                  {post.readTime}
                </span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <span className="btn-primary py-3 px-8 shadow-lg cursor-pointer text-[10px]">
                  Ler artigo <ArrowRight size={13} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group card-premium overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden img-zoom" style={{ aspectRatio: '3/2' }}>
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Category tag */}
        <div className="absolute top-4 left-4">
          <span className="bg-white text-stone-800 text-[10px] px-3 py-1.5 tracking-[0.2em] uppercase font-medium shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 bg-white">
        {/* Meta */}
        <div className="flex items-center gap-3 text-stone-400 text-[10px] tracking-[0.16em] uppercase mb-4">
          <span>{post.date}</span>
          <span className="w-px h-3 bg-stone-200" />
          <span className="flex items-center gap-1.5">
            <Clock size={10} strokeWidth={1.5} />
            {post.readTime}
          </span>
        </div>

        <h3 className="font-serif text-[1.1rem] font-bold text-stone-900 mb-3 leading-snug group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-stone-500 text-[0.8rem] leading-relaxed mb-5 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Gold bottom border reveal on hover */}
        <div className="relative pt-4 border-t border-stone-100">
          <div className="absolute top-0 left-0 h-px bg-amber-600 w-0 group-hover:w-full transition-all duration-500" />
          <Link href={`/blog/${post.slug}`}>
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase font-semibold text-stone-800 cursor-pointer group-hover:text-amber-700 transition-colors duration-300">
              Ler artigo
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
