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
  isResetting?: boolean;
  isBusy?: boolean;
}

interface LeasingBenefitsCardProps extends ResettableCardProps {
  benefits: LeasingBenefit[];
  setBenefits: Dispatch<SetStateAction<LeasingBenefit[]>>;
}

export function LeasingBenefitsCard({
  benefits,
  setBenefits,
  onReset,
  isResetting = false,
  isBusy = false,
}: LeasingBenefitsCardProps) {
  return (
    <SectionCard
      title="Benefícios (ícones: MapPin, Users, Shield, Zap, TrendingUp, Star)"
      onReset={onReset}
      isResetting={isResetting}
    >
      {benefits.length === 0 ? (
        <EmptyAdminState
          title="Nenhum benefício cadastrado"
          description="Inclua benefícios para fortalecer a seção institucional de locação."
          action={(
            <button
              type="button"
              onClick={() =>
                setBenefits((current) => [
                  ...current,
                  { icon: 'Star', title: '', description: '' },
                ])
              }
              disabled={isBusy}
              className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
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
                    disabled={isBusy}
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
                    disabled={isBusy}
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
                  disabled={isBusy}
                />
              </Field>
              <button
                type="button"
                onClick={() =>
                  setBenefits((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                disabled={isBusy}
                className="w-full sm:w-auto h-10 sm:h-auto px-3 sm:px-0 text-xs text-red-400 hover:text-red-600 inline-flex items-center justify-center sm:justify-start gap-1 border border-red-100 hover:bg-red-50 sm:border-none sm:bg-transparent"
              >
                <Trash2 size={11} />
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setBenefits((current) => [
                ...current,
                { icon: 'Star', title: '', description: '' },
              ])
            }
            disabled={isBusy}
            className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
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

export function SpaceTypesCard({
  spaces,
  setSpaces,
  onReset,
  isResetting = false,
  isBusy = false,
}: SpaceTypesCardProps) {
  return (
    <SectionCard title="Tipos de Espaço" onReset={onReset} isResetting={isResetting}>
      {spaces.length === 0 ? (
        <EmptyAdminState
          title="Nenhum tipo de espaço cadastrado"
          description="Adicione opções para que o formulário de locação tenha itens selecionáveis."
          action={(
            <button
              type="button"
              onClick={() =>
                setSpaces((current) => [...current, { name: '', size: '', description: '' }])
              }
              disabled={isBusy}
              className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
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
                    disabled={isBusy}
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
                    disabled={isBusy}
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
                  disabled={isBusy}
                />
              </Field>
              <button
                type="button"
                onClick={() =>
                  setSpaces((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
                disabled={isBusy}
                className="w-full sm:w-auto h-10 sm:h-auto px-3 sm:px-0 text-xs text-red-400 hover:text-red-600 inline-flex items-center justify-center sm:justify-start gap-1 border border-red-100 hover:bg-red-50 sm:border-none sm:bg-transparent"
              >
                <Trash2 size={11} />
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setSpaces((current) => [...current, { name: '', size: '', description: '' }])
            }
            disabled={isBusy}
            className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
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
  isResetting = false,
  isBusy = false,
}: TestimonialsCardProps) {
  return (
    <SectionCard title="Depoimentos de Lojistas" onReset={onReset} isResetting={isResetting}>
      {testimonials.length === 0 ? (
        <EmptyAdminState
          title="Sem depoimentos cadastrados"
          description="Inclua depoimentos para dar mais confiança à seção comercial."
          action={(
            <button
              type="button"
              onClick={() =>
                setTestimonials((current) => [...current, { name: '', store: '', text: '' }])
              }
              disabled={isBusy}
              className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
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
                    disabled={isBusy}
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
                    disabled={isBusy}
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
                  disabled={isBusy}
                />
              </Field>
              <button
                type="button"
                onClick={() =>
                  setTestimonials((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                disabled={isBusy}
                className="w-full sm:w-auto h-10 sm:h-auto px-3 sm:px-0 text-xs text-red-400 hover:text-red-600 inline-flex items-center justify-center sm:justify-start gap-1 border border-red-100 hover:bg-red-50 sm:border-none sm:bg-transparent"
              >
                <Trash2 size={11} />
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setTestimonials((current) => [...current, { name: '', store: '', text: '' }])
            }
            disabled={isBusy}
            className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
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
  isResetting = false,
  isBusy = false,
}: LeasingDifferentialsCardProps) {
  return (
    <SectionCard title="Diferenciais (lista)" onReset={onReset} isResetting={isResetting}>
      {differentials.length === 0 ? (
        <EmptyAdminState
          title="Sem diferenciais cadastrados"
          description="Adicione os principais argumentos comerciais para locação."
          action={(
            <button
              type="button"
              onClick={() => setDifferentials((current) => [...current, ''])}
              disabled={isBusy}
              className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
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
              <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <Input
                    value={differential}
                    onChange={(value) =>
                      setDifferentials((current) =>
                        current.map((item, itemIndex) => (itemIndex === index ? value : item)),
                      )
                    }
                    disabled={isBusy}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDifferentials((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  aria-label={`Remover diferencial ${index + 1}`}
                  disabled={isBusy}
                  className="w-full sm:w-auto h-10 sm:h-auto text-red-400 hover:text-red-600 px-2 border border-red-100 hover:bg-red-50 sm:border-none sm:bg-transparent inline-flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDifferentials((current) => [...current, ''])}
            disabled={isBusy}
            className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
          >
            <Plus size={12} />
            Adicionar diferencial
          </button>
        </>
      )}
    </SectionCard>
  );
}
