import type { Dispatch, SetStateAction } from 'react';
import { Field, Input, SectionCard, Textarea } from '@/features/admin/components/shared/AdminFormControls';
import { AdminMediaInput } from '@/features/admin/components/shared/AdminMediaInput';
import type { HomePageContent } from '@/types';

interface HomeSectionCardProps {
  form: HomePageContent;
  setForm: Dispatch<SetStateAction<HomePageContent>>;
}

interface HeroSettingsCardProps extends HomeSectionCardProps {
  onReset: () => void;
  errorMessage?: string;
}

export function HeroSettingsCard({ form, setForm, onReset, errorMessage }: HeroSettingsCardProps) {
  return (
    <SectionCard title="Hero / Banner Principal" onReset={onReset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Texto de apoio">
          <Input
            value={form.hero.eyebrow}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                hero: { ...current.hero, eyebrow: value },
              }))
            }
          />
        </Field>
      </div>
      <div className="space-y-4 mt-4">
        {form.hero.slides.map((slide, index) => (
          <div key={slide.id ?? index} className="border border-stone-100 p-4 space-y-3">
            <p className="text-xs font-medium text-stone-600 uppercase tracking-wider">
              Slide {index + 1}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={slide.title}
                onChange={(value) =>
                  setForm((current) => {
                    const slides = [...current.hero.slides];
                    slides[index] = { ...slides[index], title: value };
                    return { ...current, hero: { ...current.hero, slides } };
                  })
                }
                placeholder="Titulo"
              />
              <Input
                value={slide.subtitle}
                onChange={(value) =>
                  setForm((current) => {
                    const slides = [...current.hero.slides];
                    slides[index] = { ...slides[index], subtitle: value };
                    return { ...current, hero: { ...current.hero, slides } };
                  })
                }
                placeholder="Subtitulo"
              />
              <Input
                value={slide.cta}
                onChange={(value) =>
                  setForm((current) => {
                    const slides = [...current.hero.slides];
                    slides[index] = { ...slides[index], cta: value };
                    return { ...current, hero: { ...current.hero, slides } };
                  })
                }
                placeholder="Texto do CTA"
              />
              <Input
                value={slide.href}
                onChange={(value) =>
                  setForm((current) => {
                    const slides = [...current.hero.slides];
                    slides[index] = { ...slides[index], href: value };
                    return { ...current, hero: { ...current.hero, slides } };
                  })
                }
                placeholder="/rota"
              />
            </div>
            <AdminMediaInput
              value={slide.image}
              onChange={(value) =>
                setForm((current) => {
                  const slides = [...current.hero.slides];
                  slides[index] = { ...slides[index], image: value };
                  return { ...current, hero: { ...current.hero, slides } };
                })
              }
              folder={`home/hero/slide-${index + 1}`}
              placeholder="URL da imagem"
              showPreview
              previewClassName="w-full h-24 object-cover border border-stone-100"
            />
          </div>
        ))}
      </div>
      {errorMessage && <p className="mt-2 text-xs text-red-600">{errorMessage}</p>}
    </SectionCard>
  );
}

interface InstitutionalSettingsCardProps extends HomeSectionCardProps {
  errorMessage?: string;
}

export function InstitutionalSettingsCard({
  form,
  setForm,
  errorMessage,
}: InstitutionalSettingsCardProps) {
  return (
    <SectionCard title="Secao Institucional">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Eyebrow">
          <Input
            value={form.institutional.eyebrow}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, eyebrow: value },
              }))
            }
            placeholder="Ex.: Bem-vindo ao"
          />
        </Field>
        <Field label="Titulo">
          <Input
            value={form.institutional.title}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, title: value },
              }))
            }
          />
        </Field>
        <Field label="Titulo em destaque">
          <Input
            value={form.institutional.titleHighlight}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, titleHighlight: value },
              }))
            }
          />
        </Field>
        <Field label="CTA (texto)">
          <Input
            value={form.institutional.ctaLabel}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, ctaLabel: value },
              }))
            }
          />
        </Field>
        <Field label="CTA (rota)">
          <Input
            value={form.institutional.ctaHref}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, ctaHref: value },
              }))
            }
            placeholder="/sobre"
          />
        </Field>
        <Field label="Imagem principal">
          <AdminMediaInput
            value={form.institutional.imagePrimary}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, imagePrimary: value },
              }))
            }
            folder="home/institutional"
            showPreview
            previewClassName="w-full h-24 object-cover border border-stone-100"
          />
        </Field>
        <Field label="Imagem secundaria">
          <AdminMediaInput
            value={form.institutional.imageSecondary}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, imageSecondary: value },
              }))
            }
            folder="home/institutional"
            showPreview
            previewClassName="w-full h-24 object-cover border border-stone-100"
          />
        </Field>
        <Field label="Estatistica flutuante">
          <Input
            value={form.institutional.floatingStatValue}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, floatingStatValue: value },
              }))
            }
            placeholder="80+"
          />
        </Field>
        <Field label="Legenda da estatistica">
          <Input
            value={form.institutional.floatingStatLabel}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, floatingStatLabel: value },
              }))
            }
          />
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <Field label="Paragrafo principal">
          <Textarea
            value={form.institutional.leadParagraph}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, leadParagraph: value },
              }))
            }
            rows={4}
          />
        </Field>
        <Field label="Paragrafo secundario">
          <Textarea
            value={form.institutional.secondaryParagraph}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                institutional: { ...current.institutional, secondaryParagraph: value },
              }))
            }
            rows={4}
          />
        </Field>
      </div>
      {errorMessage && <p className="mt-2 text-xs text-red-600">{errorMessage}</p>}
    </SectionCard>
  );
}

interface StatsAndFeaturedSettingsCardProps extends HomeSectionCardProps {
  errorMessage?: string;
}

export function StatsAndFeaturedSettingsCard({
  form,
  setForm,
  errorMessage,
}: StatsAndFeaturedSettingsCardProps) {
  return (
    <SectionCard title="Estatisticas e Destaques">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Palavra de fundo">
          <Input
            value={form.stats.backgroundWord}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                stats: { ...current.stats, backgroundWord: value },
              }))
            }
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {form.stats.items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="border border-stone-100 p-3 space-y-2">
            <p className="text-xs font-medium text-stone-600 uppercase tracking-wider">
              Item {index + 1}
            </p>
            <Input
              value={item.value}
              onChange={(value) =>
                setForm((current) => {
                  const items = [...current.stats.items];
                  items[index] = { ...items[index], value };
                  return { ...current, stats: { ...current.stats, items } };
                })
              }
              placeholder="Valor"
            />
            <Input
              value={item.label}
              onChange={(value) =>
                setForm((current) => {
                  const items = [...current.stats.items];
                  items[index] = { ...items[index], label: value };
                  return { ...current, stats: { ...current.stats, items } };
                })
              }
              placeholder="Legenda"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Eyebrow - Lojas em destaque">
          <Input
            value={form.featuredStores.eyebrow}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                featuredStores: { ...current.featuredStores, eyebrow: value },
              }))
            }
          />
        </Field>
        <Field label="Titulo - Lojas">
          <Input
            value={form.featuredStores.title}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                featuredStores: { ...current.featuredStores, title: value },
              }))
            }
          />
        </Field>
        <Field label="Destaque - Lojas">
          <Input
            value={form.featuredStores.titleHighlight}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                featuredStores: { ...current.featuredStores, titleHighlight: value },
              }))
            }
          />
        </Field>
        <Field label="CTA de lojas">
          <Input
            value={form.featuredStores.ctaLabel}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                featuredStores: { ...current.featuredStores, ctaLabel: value },
              }))
            }
          />
        </Field>
        <Field label="Rota CTA de lojas">
          <Input
            value={form.featuredStores.ctaHref}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                featuredStores: { ...current.featuredStores, ctaHref: value },
              }))
            }
          />
        </Field>
        <Field label="Mensagem vazia - lojas">
          <Input
            value={form.featuredStores.emptyMessage}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                featuredStores: { ...current.featuredStores, emptyMessage: value },
              }))
            }
          />
        </Field>
      </div>
      {errorMessage && <p className="mt-2 text-xs text-red-600">{errorMessage}</p>}
    </SectionCard>
  );
}

interface SecondaryBlocksSettingsCardProps extends HomeSectionCardProps {
  errorMessage?: string;
}

export function SecondaryBlocksSettingsCard({
  form,
  setForm,
  errorMessage,
}: SecondaryBlocksSettingsCardProps) {
  return (
    <SectionCard title="Parceiros, Blog e CTA de Locacao">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Eyebrow - parceiros">
          <Input
            value={form.partners.eyebrow}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                partners: { ...current.partners, eyebrow: value },
              }))
            }
          />
        </Field>
        <Field label="Mensagem vazia - parceiros">
          <Input
            value={form.partners.emptyMessage}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                partners: { ...current.partners, emptyMessage: value },
              }))
            }
          />
        </Field>
        <Field label="Eyebrow - blog">
          <Input
            value={form.blogPreview.eyebrow}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                blogPreview: { ...current.blogPreview, eyebrow: value },
              }))
            }
          />
        </Field>
        <Field label="Titulo - blog">
          <Input
            value={form.blogPreview.title}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                blogPreview: { ...current.blogPreview, title: value },
              }))
            }
          />
        </Field>
        <Field label="Destaque - blog">
          <Input
            value={form.blogPreview.titleHighlight}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                blogPreview: { ...current.blogPreview, titleHighlight: value },
              }))
            }
          />
        </Field>
        <Field label="CTA - blog">
          <Input
            value={form.blogPreview.ctaLabel}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                blogPreview: { ...current.blogPreview, ctaLabel: value },
              }))
            }
          />
        </Field>
        <Field label="Rota CTA - blog">
          <Input
            value={form.blogPreview.ctaHref}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                blogPreview: { ...current.blogPreview, ctaHref: value },
              }))
            }
          />
        </Field>
        <Field label="Mensagem vazia - blog">
          <Input
            value={form.blogPreview.emptyMessage}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                blogPreview: { ...current.blogPreview, emptyMessage: value },
              }))
            }
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Field label="Eyebrow - locacao">
          <Input
            value={form.leasingCta.eyebrow}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                leasingCta: { ...current.leasingCta, eyebrow: value },
              }))
            }
          />
        </Field>
        <Field label="Titulo - locacao">
          <Input
            value={form.leasingCta.title}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                leasingCta: { ...current.leasingCta, title: value },
              }))
            }
          />
        </Field>
        <Field label="Destaque - locacao">
          <Input
            value={form.leasingCta.titleHighlight}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                leasingCta: { ...current.leasingCta, titleHighlight: value },
              }))
            }
          />
        </Field>
        <Field label="CTA - locacao">
          <Input
            value={form.leasingCta.ctaLabel}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                leasingCta: { ...current.leasingCta, ctaLabel: value },
              }))
            }
          />
        </Field>
        <Field label="Rota CTA - locacao">
          <Input
            value={form.leasingCta.ctaHref}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                leasingCta: { ...current.leasingCta, ctaHref: value },
              }))
            }
          />
        </Field>
        <Field label="Imagem de fundo - locacao">
          <AdminMediaInput
            value={form.leasingCta.backgroundImage}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                leasingCta: { ...current.leasingCta, backgroundImage: value },
              }))
            }
            folder="home/leasing"
            showPreview
            previewClassName="w-full h-24 object-cover border border-stone-100"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Descricao - locacao">
          <Textarea
            value={form.leasingCta.description}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                leasingCta: { ...current.leasingCta, description: value },
              }))
            }
            rows={3}
          />
        </Field>
      </div>

      {errorMessage && <p className="mt-2 text-xs text-red-600">{errorMessage}</p>}
    </SectionCard>
  );
}
