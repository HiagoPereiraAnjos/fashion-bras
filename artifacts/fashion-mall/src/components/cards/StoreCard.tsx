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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white border border-stone-100 overflow-hidden hover:shadow-lg transition-shadow duration-500"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={store.images[0]}
          alt={store.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-stone-700 text-xs px-3 py-1 tracking-wider uppercase font-medium">
            {store.segment}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
            {store.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-3">
          <MapPin size={12} />
          <span>{store.floor}</span>
        </div>
        <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {store.description}
        </p>
        <Link href={`/lojas/${store.id}`}>
          <span className="inline-flex items-center gap-2 text-amber-700 text-xs font-medium tracking-widest uppercase cursor-pointer group-hover:gap-3 transition-all">
            Ver loja
            <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
