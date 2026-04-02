import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, CalendarDays } from 'lucide-react';
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
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="group relative overflow-hidden bg-stone-900"
      >
        <div className="relative h-[440px]">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <span className="text-amber-400 text-xs tracking-widest uppercase font-medium mb-3">
              {post.category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
              {post.title}
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed mb-5 line-clamp-2 max-w-xl">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-stone-400 text-xs">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={12} />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  {post.readTime} de leitura
                </span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <span className="inline-flex items-center gap-2 text-amber-400 text-xs font-medium tracking-widest uppercase cursor-pointer group-hover:gap-3 transition-all">
                  Ler artigo
                  <ArrowRight size={14} />
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white border border-stone-100 overflow-hidden hover:shadow-md transition-shadow duration-500"
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-stone-700 text-xs px-3 py-1 tracking-wider uppercase font-medium">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4 text-stone-400 text-xs mb-3">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={11} />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            {post.readTime}
          </span>
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <Link href={`/blog/${post.slug}`}>
          <span className="inline-flex items-center gap-2 text-amber-700 text-xs font-medium tracking-widest uppercase cursor-pointer group-hover:gap-3 transition-all">
            Ler artigo
            <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
