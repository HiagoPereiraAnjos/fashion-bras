import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import StoreCard from '@/components/cards/StoreCard';
import StoreFilters from '@/components/filters/StoreFilters';
import { useSiteContent } from '@/features/content';
import { usePageSeo } from '@/seo/usePageSeo';

export default function StoresPage() {
  const { stores, storeSegments } = useSiteContent();
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('todos');

  usePageSeo({
    title: 'Lojas de Moda',
    description:
      'Explore as lojas do Fashion Bras por segmento e encontre marcas premium de moda, acessórios, esportes e lifestyle em São Paulo.',
    canonicalPath: '/lojas',
  });

  const filtered = useMemo(() => {
    return stores.filter((store) => {
      const matchSearch =
        search === '' ||
        store.name.toLowerCase().includes(search.toLowerCase()) ||
        store.segment.toLowerCase().includes(search.toLowerCase());
      const matchSegment = segment === 'todos' || store.segmentSlug === segment;
      return matchSearch && matchSegment;
    });
  }, [stores, search, segment]);

  const hasAnyStores = stores.length > 0;

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
              Nossas Lojas
            </h1>
            <p className="page-hero-description">
              Explore nosso mix exclusivo de lojas selecionadas. Aqui, cada marca foi escolhida
              com critério para oferecer o melhor da moda e do estilo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters + Listing */}
      <section className="section-shell py-16 bg-stone-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <StoreFilters
              segments={storeSegments}
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
              <p className="font-serif text-2xl text-stone-400 mb-3">
                {hasAnyStores ? 'Nenhuma loja encontrada' : 'Nenhuma loja cadastrada'}
              </p>
              <p className="text-stone-400 text-sm">
                {hasAnyStores
                  ? 'Tente ajustar sua busca ou filtros.'
                  : 'O catálogo de lojas ainda está sendo preparado.'}
              </p>
              {hasAnyStores && (
                <button
                  onClick={() => { setSearch(''); setSegment('todos'); }}
                  className="mt-6 text-amber-700 text-xs tracking-widest uppercase font-medium hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
