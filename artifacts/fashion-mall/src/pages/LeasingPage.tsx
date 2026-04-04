import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Shield, Zap, TrendingUp, Star, Check } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import LeasingForm from '@/components/forms/LeasingForm';
import { useSiteContent } from '@/services/content';
import { usePageSeo } from '@/seo/usePageSeo';

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  MapPin, Users, Shield, Zap, TrendingUp, Star,
};

function SectionEmptyState({ message }: { message: string }) {
  return (
    <div className="surface-card p-8 text-center">
      <p className="text-sm text-stone-500">{message}</p>
    </div>
  );
}

export default function LeasingPage() {
  const { leasingBenefits, spaceTypes, testimonials, leasingDifferentials } = useSiteContent();

  usePageSeo({
    title: 'Locação de Lojas e Espaços',
    description:
      'Conheça oportunidades de locação no Fashion Bras: espaços comerciais, benefícios para lojistas e formulário de proposta.',
    canonicalPath: '/locacao',
  });

  return (
    <MainLayout>
      {/* Header */}
      <section className="relative pt-40 pb-24 bg-stone-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="section-shell relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="page-hero-kicker">
              Faça Parte do Fashion Bras
            </p>
            <h1 className="page-hero-title-tight">
              Locação de Lojas e Espaços Comerciais
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed">
              Tenha sua marca no principal shopping de moda de São Paulo. Aqui, você não aluga
              apenas um espaço — você entra para uma comunidade de marcas que crescem juntas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-shell py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-kicker">
              Por que escolher o Fashion Bras?
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">
              Benefícios que Fazem a Diferença
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leasingBenefits.length > 0 ? (
              leasingBenefits.map((benefit, i) => {
                const Icon = iconMap[benefit.icon] || Star;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="surface-border-hover p-8 group"
                  >
                    <div className="w-12 h-12 bg-amber-50 group-hover:bg-amber-100 transition-colors flex items-center justify-center mb-6">
                      <Icon size={22} className="text-amber-600" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-stone-500 leading-relaxed text-sm">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })
            ) : (
              <div className="md:col-span-2 lg:col-span-3">
                <SectionEmptyState message="Benefícios de locação em atualização." />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Space Types */}
      <section className="section-shell py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-kicker">
              Opções de Espaço
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">
              O Espaço Ideal para sua Marca
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spaceTypes.length > 0 ? (
              spaceTypes.map((space, i) => (
                <motion.div
                  key={space.name}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="surface-card p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-serif text-2xl font-bold text-stone-900">{space.name}</h3>
                    <span className="text-amber-600 text-sm font-medium bg-amber-50 px-3 py-1 shrink-0 ml-4">
                      {space.size}
                    </span>
                  </div>
                  <div className="gold-divider mb-4" />
                  <p className="text-stone-500 leading-relaxed">{space.description}</p>
                </motion.div>
              ))
            ) : (
              <div className="md:col-span-2">
                <SectionEmptyState message="Tipos de espaço indisponíveis no momento." />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="section-shell py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-kicker">
              Nossos Diferenciais
            </p>
            <h2 className="font-serif text-4xl font-bold text-stone-900 mb-8">
              Muito Além de um Espaço Comercial
            </h2>
            {leasingDifferentials.length > 0 ? (
              <ul className="space-y-4">
                {leasingDifferentials.map((diff, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 text-stone-600"
                  >
                    <Check size={16} className="text-amber-600 shrink-0" />
                    {diff}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <SectionEmptyState message="Diferenciais comerciais em atualização." />
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
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80"
              alt="Shopping Fashion Bras"
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6">
              <p className="font-serif text-3xl font-bold">14+</p>
              <p className="text-xs tracking-widest uppercase text-amber-100 mt-1">Anos de Excelência</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-shell py-24 bg-stone-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs tracking-[0.25em] uppercase font-medium mb-4">
              O que dizem nossos lojistas
            </p>
            <h2 className="font-serif text-4xl font-bold text-white">
              Histórias de Sucesso
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.length > 0 ? (
              testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-stone-900 p-8 border border-stone-800"
                >
                  <div className="gold-divider mb-6" />
                  <p className="text-stone-300 leading-relaxed italic mb-8 text-sm">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="text-white font-serif font-bold">{t.name}</p>
                    <p className="text-amber-500 text-xs tracking-wider uppercase mt-1">{t.store}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="md:col-span-3">
                <SectionEmptyState message="Depoimentos indisponíveis no momento." />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-shell py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-kicker">
              Solicite uma Proposta
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Vamos Conversar?
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
              Preencha o formulário abaixo e nossa equipe comercial entrará em contato
              com uma proposta personalizada para a sua marca.
            </p>
          </div>
          <div className="surface-border p-8 md:p-12">
            <LeasingForm />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
