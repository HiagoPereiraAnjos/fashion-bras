import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import BlogCard from '@/components/cards/BlogCard';
import StoreCard from '@/components/cards/StoreCard';
import ContentEmptyState from '@/components/feedback/ContentEmptyState';
import type { HomePageContent, SiteContentSnapshot } from '@/types';

export function HeroSection({ hero }: { hero: HomePageContent['hero'] }) {
  const slides = hero.slides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => setCurrent((value) => (value + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (current < slides.length) return;
    setCurrent(0);
  }, [current, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[current] ?? slides[0];

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id ?? index}
          initial={false}
          animate={{ opacity: index === current ? 1 : 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/75 via-stone-950/40 to-stone-950/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 to-transparent" />
        </motion.div>
      ))}

      <div className="absolute left-8 top-1/2 -translate-y-1/2 h-32 w-px bg-white/20 hidden lg:block" />

      <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-14 lg:px-24 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="section-label text-amber-300/90 mb-8 before:bg-amber-300/60 after:bg-amber-300/60"
            >
              {hero.eyebrow}
            </motion.p>

            <h1
              className="font-display font-light text-white leading-[0.95] mb-2"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', letterSpacing: '-0.01em' }}
            >
              {currentSlide.title}
            </h1>
            <h1
              className="font-display italic font-light leading-[0.95] mb-12"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                letterSpacing: '-0.01em',
                color: 'hsl(40, 65%, 72%)',
              }}
            >
              {currentSlide.subtitle}
            </h1>

            <Link href={currentSlide.href}>
              <motion.span
                whileHover={{ letterSpacing: '0.22em' }}
                className="btn-primary cursor-pointer inline-flex items-center"
              >
                {currentSlide.cta}
                <ArrowRight size={15} />
              </motion.span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-8 sm:left-14 lg:left-24 z-10 flex items-center gap-4">
        {slides.map((slide, index) => (
          <button
            key={slide.id ?? index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 ${
              index === current ? 'w-10 h-px bg-amber-400' : 'w-4 h-px bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
        <span className="text-white/40 text-[10px] tracking-widest ml-2">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

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

export function InstitutionalSection({
  aboutHistory,
  mission,
  vision,
  brandingName,
  institutional,
}: {
  aboutHistory: string[];
  mission: string;
  vision: string;
  brandingName: string;
  institutional: HomePageContent['institutional'];
}) {
  const historyParagraphs = aboutHistory.map((paragraph) => paragraph.trim()).filter(Boolean);
  const leadParagraph = institutional.leadParagraph || historyParagraphs[0] || mission;
  const secondaryParagraph = institutional.secondaryParagraph || historyParagraphs[1] || vision;
  const eyebrow = institutional.eyebrow.includes('{{brand}}')
    ? institutional.eyebrow.replaceAll('{{brand}}', brandingName)
    : `${institutional.eyebrow} ${brandingName}`;

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
            <span>{eyebrow}</span>
          </div>
          <h2
            className="font-display font-light text-stone-900 leading-tight mb-7"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', letterSpacing: '-0.01em' }}
          >
            {institutional.title}
            <br />
            <em className="italic">{institutional.titleHighlight}</em>
          </h2>
          <div className="gold-divider mb-9" />
          <p className="text-stone-500 leading-[1.9] mb-5 font-light">{leadParagraph}</p>
          <p className="text-stone-500 leading-[1.9] mb-10 font-light">{secondaryParagraph}</p>
          <Link href={institutional.ctaHref}>
            <span className="btn-ghost-gold group cursor-pointer">
              {institutional.ctaLabel}
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
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
              <img src={institutional.imagePrimary} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] mt-14 overflow-hidden img-zoom">
              <img src={institutional.imageSecondary} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute -bottom-8 -left-8 bg-stone-950 text-white px-8 py-7 z-10 shadow-2xl">
            <p className="font-display text-4xl font-light text-amber-400 italic">
              {institutional.floatingStatValue}
            </p>
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mt-1.5">
              {institutional.floatingStatLabel}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function StatsSection({ stats }: { stats: HomePageContent['stats'] }) {
  return (
    <section className="bg-stone-950 py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <p className="font-display text-[20rem] font-bold text-white whitespace-nowrap select-none leading-none">
          {stats.backgroundWord}
        </p>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
          {stats.items.map((stat, index) => (
            <motion.div
              key={`${stat.label}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center py-12 px-6 bg-stone-950"
            >
              <p className="font-display text-5xl md:text-6xl font-light text-amber-400 italic mb-3">
                {stat.value}
              </p>
              <div className="w-8 h-px bg-amber-600/40 mx-auto mb-3" />
              <p className="text-stone-500 text-[10px] tracking-[0.3em] uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedStoresSection({
  section,
  featuredStores,
}: {
  section: HomePageContent['featuredStores'];
  featuredStores: SiteContentSnapshot['featuredStores'];
}) {
  return (
    <section className="section-shell-wide py-28" style={{ background: 'hsl(38, 22%, 97%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="section-label mb-6">
              <span>{section.eyebrow}</span>
            </div>
            <h2
              className="font-display font-light text-stone-900 leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '-0.01em' }}
            >
              {section.title} <em className="italic">{section.titleHighlight}</em>
            </h2>
          </div>
          <Link href={section.ctaHref}>
            <span className="btn-ghost-gold mt-6 md:mt-0 cursor-pointer">
              {section.ctaLabel} <ArrowRight size={13} />
            </span>
          </Link>
        </div>
        {featuredStores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStores.map((store, index) => (
              <StoreCard key={store.id} store={store} index={index} />
            ))}
          </div>
        ) : (
          <ContentEmptyState title="Vitrine em atualizacao" message={section.emptyMessage} compact />
        )}
      </div>
    </section>
  );
}

export function PartnersSection({
  section,
  partners,
}: {
  section: HomePageContent['partners'];
  partners: SiteContentSnapshot['partners'];
}) {
  return (
    <section className="py-20 px-6 border-y border-stone-200/60 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <p className="text-center section-label justify-center mb-12">
          <span>{section.eyebrow}</span>
        </p>
        {partners.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-5">
            {partners.map((partner, index) => (
              <motion.span
                key={partner.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.5 }}
                className="font-display text-xl md:text-2xl font-light text-stone-300 hover:text-stone-700 transition-colors duration-400 cursor-default tracking-widest italic"
              >
                {partner.name}
              </motion.span>
            ))}
          </div>
        ) : (
          <ContentEmptyState title="Parceiros em atualizacao" message={section.emptyMessage} compact />
        )}
      </div>
    </section>
  );
}

export function BlogPreviewSection({
  section,
  blogPreviewPosts,
}: {
  section: HomePageContent['blogPreview'];
  blogPreviewPosts: SiteContentSnapshot['blogPreviewPosts'];
}) {
  return (
    <section className="section-shell-wide py-28 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="section-label mb-6">
              <span>{section.eyebrow}</span>
            </div>
            <h2
              className="font-display font-light text-stone-900 leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '-0.01em' }}
            >
              {section.title} <em className="italic">{section.titleHighlight}</em>
            </h2>
          </div>
          <Link href={section.ctaHref}>
            <span className="btn-ghost-gold mt-6 md:mt-0 cursor-pointer">
              {section.ctaLabel} <ArrowRight size={13} />
            </span>
          </Link>
        </div>
        {blogPreviewPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPreviewPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        ) : (
          <ContentEmptyState
            title="Editorial em atualizacao"
            message={section.emptyMessage}
            compact
          />
        )}
      </div>
    </section>
  );
}

export function LeasingCTASection({ section }: { section: HomePageContent['leasingCta'] }) {
  return (
    <section className="relative py-36 overflow-hidden">
      <img
        src={section.backgroundImage}
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
            <span>{section.eyebrow}</span>
          </div>
          <h2
            className="font-display font-light text-white mb-7 leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '-0.01em' }}
          >
            {section.title}
            <br />
            <em className="italic" style={{ color: 'hsl(40, 65%, 72%)' }}>
              {section.titleHighlight}
            </em>
          </h2>
          <p className="text-stone-300/80 text-lg leading-relaxed mb-12 max-w-xl mx-auto font-light">
            {section.description}
          </p>
          <Link href={section.ctaHref}>
            <motion.span
              whileHover={{ letterSpacing: '0.24em' }}
              className="btn-primary cursor-pointer inline-flex"
              style={{ background: 'hsl(40, 52%, 46%)' }}
            >
              {section.ctaLabel}
              <ArrowRight size={15} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
