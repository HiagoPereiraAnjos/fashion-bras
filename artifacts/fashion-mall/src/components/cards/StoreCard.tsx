import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import type { Store } from '@/types';

interface StoreCardProps {
  store: Store;
  index?: number;
}

export default function StoreCard({ store, index = 0 }: StoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group card-premium overflow-hidden"
    >
      {/* Image — portrait aspect for editorial feel */}
      <div className="relative overflow-hidden img-zoom" style={{ aspectRatio: '4/5' }}>
        <img
          src={store.images[0]}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white text-stone-800 text-[10px] px-3 py-1.5 tracking-[0.2em] uppercase font-medium shadow-sm">
            {store.segment}
          </span>
        </div>

        {/* Hover CTA overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <Link href={`/lojas/${store.id}`}>
            <span className="btn-primary text-[10px] py-3 px-6 shadow-lg cursor-pointer">
              Ver Loja <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 bg-white">
        <div className="flex items-center gap-1.5 text-stone-400 text-[10px] tracking-[0.18em] uppercase mb-2 font-medium">
          <MapPin size={10} strokeWidth={1.5} />
          <span>{store.floor}</span>
        </div>
        <h3 className="font-serif text-[1.15rem] font-bold text-stone-900 leading-snug mb-2 group-hover:text-amber-700 transition-colors duration-300">
          {store.name}
        </h3>
        <p className="text-stone-500 text-[0.8rem] leading-relaxed line-clamp-2 mb-4">
          {store.description}
        </p>
        {/* Animated underline link */}
        <Link href={`/lojas/${store.id}`}>
          <span className="relative inline-block text-[10px] tracking-[0.22em] uppercase font-semibold text-stone-800 cursor-pointer overflow-hidden group/link">
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover/link:text-amber-700">
              Explorar
              <ArrowRight size={12} className="transition-transform duration-300 group-hover/link:translate-x-1" />
            </span>
            <span className="absolute bottom-0 left-0 h-px w-full bg-amber-600 scale-x-0 origin-left group-hover/link:scale-x-100 transition-transform duration-400" />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
