import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import StoreCard from '@/components/cards/StoreCard';
import BlogCard from '@/components/cards/BlogCard';
import { useAdminData } from '@/context/AdminDataContext';

const heroImages = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
];

const heroSlides = [
  {
    title: 'Moda que Inspira,',
    subtitle: 'Estilo que Persiste',
    cta: 'Descubra as Lojas',
    href: '/lojas',
  },
  {
    title: 'Marcas Selecionadas,',
    subtitle: 'Experiências Únicas',
    cta: 'Explore o Shopping',
    href: '/sobre',
  },
  {
    title: 'O Destino da Moda',
    subtitle: 'que Você Merece',
    cta: 'Conheça o Blog',
    href: '/blog',
  },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {heroImages.map((img, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.04)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </motion.div>
      ))}

      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="text-amber-400 text-xs tracking-[0.35em] uppercase font-medium mb-6">
            Fashion Bras — O Shopping de Moda
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-3">
            {slide.title}
          </h1>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-amber-300 leading-[1.05] mb-10">
            {slide.subtitle}
          </h1>
          <Link href={slide.href}>
            <motion.span
              whileHover={{ x: 6 }}
              className="inline-flex items-center gap-3 bg-white text-stone-900 px-8 py-4 text-xs tracking-widest uppercase font-medium cursor-pointer hover:bg-amber-400 transition-colors duration-300"
            >
              {slide.cta}
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-px transition-all duration-300 ${
              i === current ? 'w-10 bg-amber-400' : 'w-5 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Scroll down */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 right-10 z-10 flex flex-col items-center gap-2"
      >
        <ChevronDown size={20} className="text-white/60" />
      </motion.div>
    </section>
  );
}

function InstitutionalSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-amber-600 text-xs tracking-[0.25em] uppercase font-medium mb-5">
            Bem-vindo ao Fashion Bras
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-6">
            Um Shopping Pensado para Quem Ama Moda
          </h2>
          <div className="gold-divider mb-8" />
          <p className="text-stone-500 leading-relaxed mb-4">
            Inaugurado em 2010, o Fashion Bras é o principal destino de moda de São Paulo.
            Com mais de 80 lojas cuidadosamente selecionadas, reunimos as melhores marcas
            nacionais e internacionais em um ambiente sofisticado e acolhedor.
          </p>
          <p className="text-stone-500 leading-relaxed mb-8">
            Aqui, cada detalhe foi pensado para proporcionar a melhor experiência de compra:
            desde a arquitetura de alto padrão até o atendimento personalizado de cada lojista.
          </p>
          <Link href="/sobre">
            <span className="inline-flex items-center gap-2 text-stone-900 text-xs tracking-widest uppercase font-medium cursor-pointer group">
              Conheça nossa história
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80"
                alt="Fashion"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] mt-10 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80"
                alt="Style"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-stone-900 text-white p-6 z-10">
            <p className="font-serif text-3xl font-bold text-amber-400">80+</p>
            <p className="text-xs tracking-widest uppercase text-stone-400 mt-1">Lojas Selecionadas</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: '80+', label: 'Lojas' },
    { value: '50k', label: 'Visitantes/mês' },
    { value: '14', label: 'Anos de história' },
    { value: '3', label: 'Pisos de moda' },
  ];
  return (
    <section className="bg-stone-900 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <p className="font-serif text-4xl md:text-5xl font-bold text-amber-400 mb-2">{s.value}</p>
            <p className="text-stone-400 text-xs tracking-widest uppercase">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FeaturedStoresSection() {
  const { stores } = useAdminData();
  const featured = stores.filter((s) => s.featured);
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <p className="text-amber-600 text-xs tracking-[0.25em] uppercase font-medium mb-4">
              Lojas em Destaque
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">
              Marcas que Inspiram
            </h2>
          </div>
          <Link href="/lojas">
            <span className="inline-flex items-center gap-2 text-stone-600 text-xs tracking-widest uppercase font-medium cursor-pointer hover:text-amber-700 transition-colors mt-6 md:mt-0 group">
              Ver todas as lojas
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((store, i) => (
            <StoreCard key={store.id} store={store} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const { partners } = useAdminData();
  return (
    <section className="py-16 px-4 border-y border-stone-100">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs tracking-[0.3em] uppercase text-stone-400 mb-10">
          Marcas & Parceiros
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {partners.map((partner, i) => (
            <motion.span
              key={partner.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="font-serif text-lg md:text-xl font-bold text-stone-300 hover:text-stone-600 transition-colors cursor-default tracking-wider"
            >
              {partner.name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreviewSection() {
  const { blogPosts } = useAdminData();
  const posts = blogPosts.slice(0, 3);
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <p className="text-amber-600 text-xs tracking-[0.25em] uppercase font-medium mb-4">
              Blog & Novidades
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">
              Tendências & Inspiração
            </h2>
          </div>
          <Link href="/blog">
            <span className="inline-flex items-center gap-2 text-stone-600 text-xs tracking-widest uppercase font-medium cursor-pointer hover:text-amber-700 transition-colors mt-6 md:mt-0 group">
              Ver todos os artigos
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LeasingCTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-stone-950/80" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-amber-400 text-xs tracking-[0.35em] uppercase mb-6">
            Faça Parte do Fashion Bras
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Sua Marca Merece um Endereço de Destaque
          </h2>
          <p className="text-stone-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Junte-se a mais de 80 marcas que escolheram o Fashion Bras como seu lar.
            Descubra como a locação de um espaço no nosso shopping pode transformar o seu negócio.
          </p>
          <Link href="/locacao">
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-3 bg-amber-600 text-white px-10 py-4 text-xs tracking-widest uppercase font-medium cursor-pointer hover:bg-amber-500 transition-colors duration-300"
            >
              Solicitar Locação
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
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
