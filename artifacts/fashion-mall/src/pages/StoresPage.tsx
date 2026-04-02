import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import StoreCard from '@/components/cards/StoreCard';
import StoreFilters from '@/components/filters/StoreFilters';
import { useAdminData } from '@/context/AdminDataContext';

export default function StoresPage() {
  const { stores } = useAdminData();
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('todos');

  const filtered = useMemo(() => {
    return stores.filter((store) => {
      const matchSearch =
        search === '' ||
        store.name.toLowerCase().includes(search.toLowerCase()) ||
        store.segment.toLowerCase().includes(search.toLowerCase());
      const matchSegment = segment === 'todos' || store.segmentSlug === segment;
      return matchSearch && matchSegment;
    });
  }, [search, segment]);

  return (
    <MainLayout>
      {/* Page Header */}
      <section className="relative pt-40 pb-20 bg-stone-950">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
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
              Nossas Lojas
            </h1>
            <p className="text-stone-400 max-w-xl leading-relaxed">
              Explore nosso mix exclusivo de lojas selecionadas. Aqui, cada marca foi escolhida
              com critério para oferecer o melhor da moda e do estilo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters + Listing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <StoreFilters
              search={search}
              onSearchChange={setSearch}
              activeSegment={segment}
              onSegmentChange={setSegment}
            />
          </div>

          {filtered.length > 0 ? (
            <>
              <p className="text-stone-400 text-sm mb-8">
                {filtered.length} {filtered.length === 1 ? 'loja encontrada' : 'lojas encontradas'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((store, i) => (
                  <StoreCard key={store.id} store={store} index={i} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <p className="font-serif text-2xl text-stone-400 mb-3">Nenhuma loja encontrada</p>
              <p className="text-stone-400 text-sm">Tente ajustar sua busca ou filtros.</p>
              <button
                onClick={() => { setSearch(''); setSegment('todos'); }}
                className="mt-6 text-amber-700 text-xs tracking-widest uppercase font-medium hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
