import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import ContentEmptyState from '@/components/feedback/ContentEmptyState';
import MainLayout from '@/layouts/MainLayout';
import { useSiteContent } from '@/services/content';
import { getSeoMetadata } from '@/seo/pages';
import { usePageSeo } from '@/seo/usePageSeo';

export default function AboutPage() {
  const { aboutData } = useSiteContent();

  usePageSeo(getSeoMetadata('about'));

  return (
    <MainLayout>
      {/* Header */}
      <section className="relative pt-40 pb-24 bg-stone-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="section-shell relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="page-hero-kicker">
              Nossa História
            </p>
            <h1 className="page-hero-title">
              Sobre o Fashion Bras
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed">
              Um destino de moda construído com paixão, propósito e um compromisso
              inabalável com a excelência.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History */}
      <section className="section-shell py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-kicker">
              Nossa História
            </p>
            <h2 className="font-serif text-4xl font-bold text-stone-900 mb-8">
              De um Sonho a uma Referência Nacional
            </h2>
            {aboutData.history.length > 0 ? (
              <div className="space-y-5">
                {aboutData.history.map((paragraph, i) => (
                  <p key={i} className="text-stone-500 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <ContentEmptyState compact message="História institucional em atualização." />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80"
              alt="Fashion Bras"
              className="w-full aspect-square object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-stone-900 text-white p-8 z-10">
              <p className="font-serif text-4xl font-bold text-amber-400">2010</p>
              <p className="text-xs tracking-widest uppercase text-stone-400 mt-1">
                Ano de Fundação
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-shell py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: 'Nossa Missão', text: aboutData.mission, color: 'amber' },
            { label: 'Nossa Visão', text: aboutData.vision, color: 'stone' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-10 ${i === 0 ? 'bg-stone-900 text-white' : 'surface-card'}`}
            >
              <p className={`text-xs tracking-[0.25em] uppercase font-medium mb-4 ${i === 0 ? 'text-amber-400' : 'text-amber-600'}`}>
                {item.label}
              </p>
              <div className={`gold-divider mb-6 ${i === 0 ? 'bg-amber-500' : ''}`} />
              <p className={`text-lg leading-relaxed font-serif italic ${i === 0 ? 'text-stone-200' : 'text-stone-700'}`}>
                "{item.text || 'Conteúdo em atualização.'}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section-shell py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-kicker">
              O que nos define
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">
              Nossos Valores
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {aboutData.values.length > 0 ? (
              aboutData.values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="surface-border-hover text-center p-6"
                >
                  <div className="w-px h-8 bg-amber-500 mx-auto mb-5" />
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="md:col-span-2 lg:col-span-3 xl:col-span-5">
                <ContentEmptyState compact message="Valores institucionais indisponíveis no momento." />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="section-shell py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-kicker">
              Por que somos únicos
            </p>
            <h2 className="font-serif text-4xl font-bold text-stone-900 mb-8">
              Nossos Diferenciais
            </h2>
            {aboutData.differentials.length > 0 ? (
              <ul className="space-y-4">
                {aboutData.differentials.map((diff, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 text-stone-700"
                  >
                    <Check size={16} className="text-amber-600 shrink-0" />
                    {diff}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <ContentEmptyState compact message="Diferenciais em atualização." />
            )}
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"
              alt="Fashion Bras Experience"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-shell py-24 bg-stone-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs tracking-[0.25em] uppercase font-medium mb-4">
              Nossa Equipe
            </p>
            <h2 className="font-serif text-4xl font-bold text-white">
              As Pessoas por Trás da Magia
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutData.team.length > 0 ? (
              aboutData.team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-stone-800 border-2 border-amber-600/40 mx-auto mb-5 flex items-center justify-center">
                    <span className="font-serif text-2xl font-bold text-amber-400">
                      {(member.name || 'M').charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-1">{member.name || 'Membro da equipe'}</h3>
                  <p className="text-amber-500 text-xs tracking-widest uppercase mb-4">{member.role || 'Cargo em atualização'}</p>
                  <p className="text-stone-400 text-sm leading-relaxed">{member.description || 'Descrição em atualização.'}</p>
                </motion.div>
              ))
            ) : (
              <div className="md:col-span-3">
                <ContentEmptyState compact message="Equipe institucional em atualização." />
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}


