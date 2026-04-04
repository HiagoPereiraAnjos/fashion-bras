import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import StoreCard from '@/components/cards/StoreCard';
import BlogCard from '@/components/cards/BlogCard';
import { useSiteContent } from '@/services/content';
import { usePageSeo } from '@/seo/usePageSeo';
import type { HomeHeroSlide } from '@/types';

const heroSlides: HomeHeroSlide[] = [
  {
    title: 'Moda que Inspira,',
    subtitle: 'Estilo que Persiste',
    cta: 'Descubra as Lojas',
    href: '/lojas',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
  },
  {
    title: 'Marcas Selecionadas,',
    subtitle: 'ExperiÃªncias Ãšnicas',
    cta: 'Explore o Shopping',
    href: '/sobre',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
  },
  {
    title: 'O Destino da Moda',
    subtitle: 'que VocÃª Merece',
    cta: 'ConheÃ§a o Blog',
    href: '/blog',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
  },
];

function HomeSectionEmptyState({ message }: { message: string }) {
  return (
    <div className="surface-card p-10 text-center">
      <p className="text-sm text-stone-500">{message}</p>
    </div>
  );
}

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">
      {/* Background images */}
      {heroSlides.map((slide, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/75 via-stone-950/40 to-stone-950/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 to-transparent" />
        </motion.div>
      ))}

      {/* Decorative vertical line */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 h-32 w-px bg-white/20 hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-14 lg:px-24 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="section-label text-amber-300/90 mb-8 before:bg-amber-300/60 after:bg-amber-300/60"
            >
              Fashion Bras â€” O Shopping de Moda
            </motion.p>

            {/* Display heading â€” Cormorant Garamond */}
            <h1 className="font-display font-light text-white leading-[0.95] mb-2" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', letterSpacing: '-0.01em' }}>
              {heroSlides[current].title}
            </h1>
            <h1 className="font-display italic font-light leading-[0.95] mb-12" style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', letterSpacing: '-0.01em', color: 'hsl(40, 65%, 72%)' }}>
              {heroSlides[current].subtitle}
            </h1>

            <Link href={heroSlides[current].href}>
              <motion.span
                whileHover={{ letterSpacing: '0.22em' }}
                className="btn-primary cursor-pointer inline-flex items-center"
              >
                {heroSlides[current].cta}
                <ArrowRight size={15} />
              </motion.span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-10 left-8 sm:left-14 lg:left-24 z-10 flex items-center gap-4">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-500 ${
              i === current
                ? 'w-10 h-px bg-amber-400'
                : 'w-4 h-px bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
        <span className="text-white/40 text-[10px] tracking-widest ml-2">
          {String(current + 1).padStart(2,'0')} / {String(heroSlides.length).padStart(2,'0')}
        </span>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute bottom-10 right-10 z-10 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/40" />
        <ChevronDown size={16} className="text-white/40" />
      </motion.div>
    </section>
  );
}

function InstitutionalSection() {
  const { aboutContent, branding } = useSiteContent();
  const historyParagraphs = aboutContent.history
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const mission = aboutContent.mission.trim();
  const vision = aboutContent.vision.trim();

  const leadParagraph =
    historyParagraphs[0] ||
    mission ||
    'Inaugurado em 2010, o Fashion Bras é o principal destino de moda de São Paulo. Com mais de 80 lojas cuidadosamente selecionadas, reunimos as melhores marcas nacionais e internacionais em um ambiente sofisticado e acolhedor.';

  const secondaryParagraph =
    historyParagraphs[1] ||
    vision ||
    'Aqui, cada detalhe foi pensado para proporcionar a melhor experiência de compra: desde a arquitetura de alto padrão até o atendimento personalizado de cada lojista.';

  return (
    <section className="section-shell-wide py-28">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="section-label mb-7">
            <span>Bem-vindo ao {branding.fullName}</span>
          </div>
          <h2 className="font-display font-light text-stone-900 leading-tight mb-7" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', letterSpacing: '-0.01em' }}>
            Um Shopping <em className="italic">Pensado</em><br />
            para Quem Ama Moda
          </h2>
          <div className="gold-divider mb-9" />
          <p className="text-stone-500 leading-[1.9] mb-5 font-light">
            {leadParagraph}
          </p>
          <p className="text-stone-500 leading-[1.9] mb-10 font-light">
            {secondaryParagraph}
          </p>
          <Link href="/sobre">
            <span className="btn-ghost-gold group cursor-pointer">
              Conheça nossa história
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-5">
            <div className="aspect-[3/4] overflow-hidden img-zoom">
              <img src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] mt-14 overflow-hidden img-zoom">
              <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Floating stat card */}
          <div className="absolute -bottom-8 -left-8 bg-stone-950 text-white px-8 py-7 z-10 shadow-2xl">
            <p className="font-display text-4xl font-light text-amber-400 italic">80+</p>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mt-1.5">Lojas Selecionadas</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: '80+', label: 'Lojas curadas' },
    { value: '50k', label: 'Visitantes / mÃªs' },
    { value: '14', label: 'Anos de histÃ³ria' },
    { value: '3', label: 'Pisos de moda' },
  ];
  return (
    <section className="bg-stone-950 py-20 px-6 relative overflow-hidden">
      {/* Subtle background line */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <p className="font-display text-[20rem] font-bold text-white whitespace-nowrap select-none leading-none">MODA</p>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center py-12 px-6 bg-stone-950"
            >
              <p className="font-display text-5xl md:text-6xl font-light text-amber-400 italic mb-3">{s.value}</p>
              <div className="w-8 h-px bg-amber-600/40 mx-auto mb-3" />
              <p className="text-stone-500 text-[10px] tracking-[0.3em] uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedStoresSection() {
  const { featuredStores } = useSiteContent();
  return (
    <section className="section-shell-wide py-28" style={{ background: 'hsl(38, 22%, 97%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="section-label mb-6"><span>Lojas em Destaque</span></div>
            <h2 className="font-display font-light text-stone-900 leading-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '-0.01em' }}>
              Marcas que <em className="italic">Inspiram</em>
            </h2>
          </div>
          <Link href="/lojas">
            <span className="btn-ghost-gold mt-6 md:mt-0 cursor-pointer">
              Ver todas as lojas <ArrowRight size={13} />
            </span>
          </Link>
        </div>
        {featuredStores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStores.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}
          </div>
        ) : (
          <HomeSectionEmptyState message="Nenhuma loja em destaque cadastrada no momento." />
        )}
      </div>
    </section>
  );
}

function PartnersSection() {
  const { partners } = useSiteContent();
  return (
    <section className="py-20 px-6 border-y border-stone-200/60 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <p className="text-center section-label justify-center mb-12">
          <span>Marcas &amp; Parceiros</span>
        </p>
        {partners.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-5">
            {partners.map((partner, i) => (
              <motion.span
                key={partner.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                className="font-display text-xl md:text-2xl font-light text-stone-300 hover:text-stone-700 transition-colors duration-400 cursor-default tracking-widest italic"
              >
                {partner.name}
              </motion.span>
            ))}
          </div>
        ) : (
          <HomeSectionEmptyState message="Lista de parceiros indisponÃ­vel no momento." />
        )}
      </div>
    </section>
  );
}

function BlogPreviewSection() {
  const { blogPreviewPosts } = useSiteContent();
  const posts = blogPreviewPosts;
  return (
    <section className="section-shell-wide py-28 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="section-label mb-6"><span>Blog &amp; Novidades</span></div>
            <h2 className="font-display font-light text-stone-900 leading-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '-0.01em' }}>
              TendÃªncias &amp; <em className="italic">InspiraÃ§Ã£o</em>
            </h2>
          </div>
          <Link href="/blog">
            <span className="btn-ghost-gold mt-6 md:mt-0 cursor-pointer">
              Ver todos os artigos <ArrowRight size={13} />
            </span>
          </Link>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : (
          <HomeSectionEmptyState message="Novos artigos serÃ£o publicados em breve." />
        )}
      </div>
    </section>
  );
}

function LeasingCTASection() {
  return (
    <section className="relative py-36 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ filter: 'brightness(0.35)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-stone-950/60 to-stone-950/80" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="section-label justify-center mb-8 text-amber-300/80 before:bg-amber-300/40 after:bg-amber-300/40">
            <span>FaÃ§a Parte do Fashion Bras</span>
          </div>
          <h2 className="font-display font-light text-white mb-7 leading-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '-0.01em' }}>
            Sua Marca Merece<br />
            <em className="italic" style={{ color: 'hsl(40, 65%, 72%)' }}>um EndereÃ§o de Destaque</em>
          </h2>
          <p className="text-stone-300/80 text-lg leading-relaxed mb-12 max-w-xl mx-auto font-light">
            Junte-se a mais de 80 marcas que escolheram o Fashion Bras como seu lar.
          </p>
          <Link href="/locacao">
            <motion.span
              whileHover={{ letterSpacing: '0.24em' }}
              className="btn-primary cursor-pointer inline-flex"
              style={{ background: 'hsl(40, 52%, 46%)' }}
            >
              Solicitar LocaÃ§Ã£o
              <ArrowRight size={15} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  usePageSeo({
    title: 'Shopping de Moda Premium em SÃ£o Paulo',
    description:
      'Descubra o Fashion Bras: lojas de moda selecionadas, tendÃªncias do blog, parceiros exclusivos e experiÃªncias premium em SÃ£o Paulo.',
    canonicalPath: '/',
  });

  return (
    <MainLayout>
      <HeroSection />
      <InstitutionalSection />
      <StatsSection />
      <FeaturedStoresSection />
      <PartnersSection />
      <BlogPreviewSection />
      <LeasingCTASection />
    </MainLayout>
  );
}

