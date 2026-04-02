import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useAdminData } from '@/context/AdminDataContext';

export default function AboutPage() {
  const { aboutData } = useAdminData();
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase font-medium mb-4">
              Nossa História
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-600 text-xs tracking-[0.25em] uppercase font-medium mb-4">
              Nossa História
            </p>
            <h2 className="font-serif text-4xl font-bold text-stone-900 mb-8">
              De um Sonho a uma Referência Nacional
            </h2>
            <div className="space-y-5">
              {aboutData.history.map((paragraph, i) => (
                <p key={i} className="text-stone-500 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
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
              className={`p-10 ${i === 0 ? 'bg-stone-900 text-white' : 'bg-white border border-stone-100'}`}
            >
              <p className={`text-xs tracking-[0.25em] uppercase font-medium mb-4 ${i === 0 ? 'text-amber-400' : 'text-amber-600'}`}>
                {item.label}
              </p>
              <div className={`gold-divider mb-6 ${i === 0 ? 'bg-amber-500' : ''}`} />
              <p className={`text-lg leading-relaxed font-serif italic ${i === 0 ? 'text-stone-200' : 'text-stone-700'}`}>
                "{item.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-600 text-xs tracking-[0.25em] uppercase font-medium mb-4">
              O que nos define
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900">
              Nossos Valores
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {aboutData.values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="text-center p-6 border border-stone-100 hover:border-amber-200 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-px h-8 bg-amber-500 mx-auto mb-5" />
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-amber-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-amber-600 text-xs tracking-[0.25em] uppercase font-medium mb-4">
              Por que somos únicos
            </p>
            <h2 className="font-serif text-4xl font-bold text-stone-900 mb-8">
              Nossos Diferenciais
            </h2>
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-950">
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
            {aboutData.team.map((member, i) => (
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
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-amber-500 text-xs tracking-widest uppercase mb-4">{member.role}</p>
                <p className="text-stone-400 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
