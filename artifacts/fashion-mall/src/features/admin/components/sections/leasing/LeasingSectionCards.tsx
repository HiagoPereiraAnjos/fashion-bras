import type { Dispatch, SetStateAction } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  EmptyAdminState,
  Field,
  Input,
  SectionCard,
  Textarea,
} from '@/features/admin/components/shared/AdminFormControls';
import type { LeasingBenefit, SpaceType, Testimonial } from '@/types';

interface ResettableCardProps {
  onReset: () => void;
}

interface LeasingBenefitsCardProps extends ResettableCardProps {
  benefits: LeasingBenefit[];
  setBenefits: Dispatch<SetStateAction<LeasingBenefit[]>>;
}

export function LeasingBenefitsCard({
  benefits,
  setBenefits,
  onReset,
}: LeasingBenefitsCardProps) {
  return (
    <SectionCard
      title="Benefícios (ícones: MapPin, Users, Shield, Zap, TrendingUp, Star)"
      onReset={onReset}
    >
      {benefits.length === 0 ? (
        <EmptyAdminState
          title="Nenhum benefício cadastrado"
          description="Inclua benefícios para fortalecer a seção institucional de locação."
          action={(
            <button
              onClick={() =>
                setBenefits((current) => [
                  ...current,
                  { icon: 'Star', title: '', description: '' },
                ])
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar benefício
            </button>
          )}
        />
      ) : (
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="border border-stone-100 p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Ícone">
                  <Input
                    value={benefit.icon}
                    onChange={(value) =>
                      setBenefits((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, icon: value } : item,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Título">
                  <Input
                    value={benefit.title}
                    onChange={(value) =>
                      setBenefits((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, title: value } : item,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
              <Field label="Descrição">
                <Textarea
                  value={benefit.description}
                  onChange={(value) =>
                    setBenefits((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, description: value } : item,
                      ),
                    )
                  }
                  rows={2}
                />
              </Field>
              <button
                onClick={() =>
                  setBenefits((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 size={11} />
                Remover
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setBenefits((current) => [
                ...current,
                { icon: 'Star', title: '', description: '' },
              ])
            }
            className="text-xs text-amber-700 hover:underline flex items-center gap-1"
          >
            <Plus size={12} />
            Adicionar benefício
          </button>
        </div>
      )}
    </SectionCard>
  );
}

interface SpaceTypesCardProps extends ResettableCardProps {
  spaces: SpaceType[];
  setSpaces: Dispatch<SetStateAction<SpaceType[]>>;
}

export function SpaceTypesCard({ spaces, setSpaces, onReset }: SpaceTypesCardProps) {
  return (
    <SectionCard title="Tipos de Espaço" onReset={onReset}>
      {spaces.length === 0 ? (
        <EmptyAdminState
          title="Nenhum tipo de espaço cadastrado"
          description="Adicione opções para que o formulário de locação tenha itens selecionáveis."
          action={(
            <button
              onClick={() =>
                setSpaces((current) => [...current, { name: '', size: '', description: '' }])
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar espaço
            </button>
          )}
        />
      ) : (
        <div className="space-y-4">
          {spaces.map((space, index) => (
            <div key={index} className="border border-stone-100 p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Nome">
                  <Input
                    value={space.name}
                    onChange={(value) =>
                      setSpaces((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: value } : item,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Tamanho">
                  <Input
                    value={space.size}
                    onChange={(value) =>
                      setSpaces((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, size: value } : item,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
              <Field label="Descrição">
                <Textarea
                  value={space.description}
                  onChange={(value) =>
                    setSpaces((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, description: value } : item,
                      ),
                    )
                  }
                  rows={2}
                />
              </Field>
              <button
                onClick={() =>
                  setSpaces((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
                className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 size={11} />
                Remover
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setSpaces((current) => [...current, { name: '', size: '', description: '' }])
            }
            className="text-xs text-amber-700 hover:underline flex items-center gap-1"
          >
            <Plus size={12} />
            Adicionar espaço
          </button>
        </div>
      )}
    </SectionCard>
  );
}

interface TestimonialsCardProps extends ResettableCardProps {
  testimonials: Testimonial[];
  setTestimonials: Dispatch<SetStateAction<Testimonial[]>>;
}

export function TestimonialsCard({
  testimonials,
  setTestimonials,
  onReset,
}: TestimonialsCardProps) {
  return (
    <SectionCard title="Depoimentos de Lojistas" onReset={onReset}>
      {testimonials.length === 0 ? (
        <EmptyAdminState
          title="Sem depoimentos cadastrados"
          description="Inclua depoimentos para dar mais confiança à seção comercial."
          action={(
            <button
              onClick={() =>
                setTestimonials((current) => [...current, { name: '', store: '', text: '' }])
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar depoimento
            </button>
          )}
        />
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border border-stone-100 p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Nome">
                  <Input
                    value={testimonial.name}
                    onChange={(value) =>
                      setTestimonials((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: value } : item,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Loja">
                  <Input
                    value={testimonial.store}
                    onChange={(value) =>
                      setTestimonials((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, store: value } : item,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
              <Field label="Depoimento">
                <Textarea
                  value={testimonial.text}
                  onChange={(value) =>
                    setTestimonials((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, text: value } : item,
                      ),
                    )
                  }
                  rows={3}
                />
              </Field>
              <button
                onClick={() =>
                  setTestimonials((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 size={11} />
                Remover
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setTestimonials((current) => [...current, { name: '', store: '', text: '' }])
            }
            className="text-xs text-amber-700 hover:underline flex items-center gap-1"
          >
            <Plus size={12} />
            Adicionar depoimento
          </button>
        </div>
      )}
    </SectionCard>
  );
}

interface LeasingDifferentialsCardProps extends ResettableCardProps {
  differentials: string[];
  setDifferentials: Dispatch<SetStateAction<string[]>>;
}

export function LeasingDifferentialsCard({
  differentials,
  setDifferentials,
  onReset,
}: LeasingDifferentialsCardProps) {
  return (
    <SectionCard title="Diferenciais (lista)" onReset={onReset}>
      {differentials.length === 0 ? (
        <EmptyAdminState
          title="Sem diferenciais cadastrados"
          description="Adicione os principais argumentos comerciais para locação."
          action={(
            <button
              onClick={() => setDifferentials((current) => [...current, ''])}
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar diferencial
            </button>
          )}
        />
      ) : (
        <>
          <div className="space-y-2 mb-3">
            {differentials.map((differential, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={differential}
                  onChange={(value) =>
                    setDifferentials((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
                    )
                  }
                />
                <button
                  onClick={() =>
                    setDifferentials((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  className="text-red-400 hover:text-red-600 px-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setDifferentials((current) => [...current, ''])}
            className="text-xs text-amber-700 hover:underline flex items-center gap-1"
          >
            <Plus size={12} />
            Adicionar diferencial
          </button>
        </>
      )}
    </SectionCard>
  );
}
