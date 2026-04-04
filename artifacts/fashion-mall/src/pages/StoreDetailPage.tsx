import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useSiteContent } from '@/services/content';
import StoreCard from '@/components/cards/StoreCard';
import { getSeoMetadata } from '@/seo/pages';
import { usePageSeo } from '@/seo/usePageSeo';

export default function StoreDetailPage() {
  const { stores } = useSiteContent();
  const { id } = useParams<{ id: string }>();
  const store = stores.find((s) => s.id === id);
  const [galleryIndex, setGalleryIndex] = useState(0);

  usePageSeo(
    store
      ? getSeoMetadata('stores', {
          title: `${store.name} - Loja`,
          description: store.description || `Conheca a loja ${store.name} no Fashion Bras.`,
          canonicalPath: `/lojas/${store.id}`,
          image: store.images[0],
          imageAlt: `${store.name} no Fashion Bras`,
        })
      : getSeoMetadata('storeDetailFallback'),
  );

  if (!store) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-3xl text-stone-400 mb-4">Loja não encontrada</p>
            <Link href="/lojas">
              <span className="text-amber-700 text-xs tracking-widest uppercase font-medium hover:underline cursor-pointer">
                Voltar para Lojas
              </span>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const galleryImages = store.images.filter((image) => image && image.trim().length > 0);
  const hasGallery = galleryImages.length > 0;
  const currentImage =
    galleryImages[galleryIndex] ??
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80';
  const instagramHandle = store.instagram?.replace('@', '').trim();
  const hasPhone = Boolean(store.phone?.trim());
  const hasInstagram = Boolean(instagramHandle);

  const related = stores.filter((s) => s.id !== store.id && s.segmentSlug === store.segmentSlug).slice(0, 3);

  const prevImage = () => setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  const nextImage = () => setGalleryIndex((i) => (i + 1) % galleryImages.length);

  return (
    <MainLayout>
      {/* Back */}
      <div className="section-shell pt-24 pb-4 bg-white max-w-7xl mx-auto">
        <Link href="/lojas">
          <span className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-700 text-xs tracking-widest uppercase cursor-pointer transition-colors">
            <ArrowLeft size={14} />
            Voltar para Lojas
          </span>
        </Link>
      </div>

      {/* Hero Gallery */}
      <section className="section-shell max-w-7xl mx-auto pb-8">
        <div className="relative overflow-hidden aspect-[16/7] bg-stone-100">
          <motion.img
            key={galleryIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src={currentImage}
            alt={store.name}
            className="w-full h-full object-cover"
          />
          {hasGallery && galleryImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft size={20} className="text-stone-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight size={20} className="text-stone-700" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`h-1 transition-all ${i === galleryIndex ? 'w-8 bg-white' : 'w-3 bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 text-stone-700 text-xs px-3 py-1.5 tracking-wider uppercase font-medium">
              {store.segment || 'Sem segmento'}
            </span>
          </div>
        </div>

        {/* Thumbnails */}
        {hasGallery && (
          <div className="flex gap-3 mt-3">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className={`w-20 h-16 overflow-hidden border-2 transition-colors ${
                  i === galleryIndex ? 'border-amber-500' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Content */}
      <section className="section-shell max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-3">
                {store.name}
              </h1>
              <div className="gold-divider mb-6" />
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                {store.description || 'Descrição indisponível no momento.'}
              </p>
              <p className="text-stone-500 leading-relaxed">
                {store.longDescription || 'Informações completas em atualização.'}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-stone-50 p-8 border border-stone-100">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-6">Informações</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">Localização</p>
                    <p className="text-stone-700 font-medium">
                      {store.floor || 'Localização indisponível'}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">Telefone</p>
                    {hasPhone ? (
                      <a href={`tel:${store.phone}`} className="text-stone-700 font-medium hover:text-amber-700 transition-colors">
                        {store.phone}
                      </a>
                    ) : (
                      <p className="text-stone-500 font-medium">Não informado</p>
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram size={18} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">Instagram</p>
                    {hasInstagram ? (
                      <a
                        href={`https://instagram.com/${instagramHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-700 font-medium hover:text-amber-700 transition-colors"
                      >
                        {store.instagram}
                      </a>
                    ) : (
                      <p className="text-stone-500 font-medium">Não informado</p>
                    )}
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-stone-200">
                {hasPhone ? (
                  <a
                    href={`tel:${store.phone}`}
                    className="block w-full bg-stone-900 text-white text-center py-3.5 text-xs tracking-widest uppercase font-medium hover:bg-amber-700 transition-colors duration-300"
                  >
                    Entrar em Contato
                  </a>
                ) : (
                  <span className="block w-full bg-stone-200 text-stone-500 text-center py-3.5 text-xs tracking-widest uppercase font-medium cursor-not-allowed">
                    Contato indisponível
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Stores */}
      {related.length > 0 && (
        <section className="section-shell py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-stone-900 mb-10">
              Lojas do Mesmo Segmento
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((s, i) => (
                <StoreCard key={s.id} store={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}

