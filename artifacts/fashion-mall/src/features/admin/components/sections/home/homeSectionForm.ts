import type { HomePageContent } from '@/types';
import { isRequired, isValidHttpUrl, isValidPath, normalizeText } from '@/utils/validation';

export type HomeSectionErrors = Partial<Record<string, string>>;

export function normalizeHomeContent(form: HomePageContent): HomePageContent {
  return {
    hero: {
      eyebrow: normalizeText(form.hero.eyebrow),
      slides: form.hero.slides.map((slide) => ({
        ...slide,
        title: normalizeText(slide.title),
        subtitle: normalizeText(slide.subtitle),
        cta: normalizeText(slide.cta),
        href: normalizeText(slide.href),
        image: normalizeText(slide.image),
      })),
    },
    institutional: {
      eyebrow: normalizeText(form.institutional.eyebrow),
      title: normalizeText(form.institutional.title),
      titleHighlight: normalizeText(form.institutional.titleHighlight),
      leadParagraph: normalizeText(form.institutional.leadParagraph),
      secondaryParagraph: normalizeText(form.institutional.secondaryParagraph),
      ctaLabel: normalizeText(form.institutional.ctaLabel),
      ctaHref: normalizeText(form.institutional.ctaHref),
      imagePrimary: normalizeText(form.institutional.imagePrimary),
      imageSecondary: normalizeText(form.institutional.imageSecondary),
      floatingStatValue: normalizeText(form.institutional.floatingStatValue),
      floatingStatLabel: normalizeText(form.institutional.floatingStatLabel),
    },
    stats: {
      backgroundWord: normalizeText(form.stats.backgroundWord),
      items: form.stats.items.map((item) => ({
        value: normalizeText(item.value),
        label: normalizeText(item.label),
      })),
    },
    featuredStores: {
      eyebrow: normalizeText(form.featuredStores.eyebrow),
      title: normalizeText(form.featuredStores.title),
      titleHighlight: normalizeText(form.featuredStores.titleHighlight),
      ctaLabel: normalizeText(form.featuredStores.ctaLabel),
      ctaHref: normalizeText(form.featuredStores.ctaHref),
      emptyMessage: normalizeText(form.featuredStores.emptyMessage),
    },
    partners: {
      eyebrow: normalizeText(form.partners.eyebrow),
      emptyMessage: normalizeText(form.partners.emptyMessage),
    },
    blogPreview: {
      eyebrow: normalizeText(form.blogPreview.eyebrow),
      title: normalizeText(form.blogPreview.title),
      titleHighlight: normalizeText(form.blogPreview.titleHighlight),
      ctaLabel: normalizeText(form.blogPreview.ctaLabel),
      ctaHref: normalizeText(form.blogPreview.ctaHref),
      emptyMessage: normalizeText(form.blogPreview.emptyMessage),
    },
    leasingCta: {
      eyebrow: normalizeText(form.leasingCta.eyebrow),
      title: normalizeText(form.leasingCta.title),
      titleHighlight: normalizeText(form.leasingCta.titleHighlight),
      description: normalizeText(form.leasingCta.description),
      ctaLabel: normalizeText(form.leasingCta.ctaLabel),
      ctaHref: normalizeText(form.leasingCta.ctaHref),
      backgroundImage: normalizeText(form.leasingCta.backgroundImage),
    },
  };
}

export function validateHomeContent(normalized: HomePageContent): HomeSectionErrors {
  const nextErrors: HomeSectionErrors = {};

  if (!isRequired(normalized.hero.eyebrow)) {
    nextErrors.heroEyebrow = 'Informe o texto de apoio do hero.';
  }

  normalized.hero.slides.forEach((slide, index) => {
    if (!isRequired(slide.title) || !isRequired(slide.subtitle) || !isRequired(slide.cta)) {
      nextErrors[`heroSlide_${index}`] = 'Preencha titulo, subtitulo e CTA de todos os slides.';
    }
    if (!isValidPath(slide.href)) {
      nextErrors[`heroSlideHref_${index}`] = 'Os links dos slides devem comecar com "/".';
    }
    if (!isValidHttpUrl(slide.image)) {
      nextErrors[`heroSlideImage_${index}`] = 'Use URL valida para a imagem dos slides.';
    }
  });

  if (!isRequired(normalized.institutional.title) || !isRequired(normalized.institutional.titleHighlight)) {
    nextErrors.institutionalTitle = 'Preencha os titulos da secao institucional.';
  }
  if (!isValidPath(normalized.institutional.ctaHref)) {
    nextErrors.institutionalCta = 'CTA institucional deve apontar para uma rota valida.';
  }
  if (!isValidHttpUrl(normalized.institutional.imagePrimary) || !isValidHttpUrl(normalized.institutional.imageSecondary)) {
    nextErrors.institutionalImages = 'Use URLs validas para as imagens institucionais.';
  }

  if (!isRequired(normalized.stats.backgroundWord)) {
    nextErrors.statsWord = 'Informe a palavra de fundo da secao de estatisticas.';
  }
  if (normalized.stats.items.some((item) => !isRequired(item.value) || !isRequired(item.label))) {
    nextErrors.statsItems = 'Todas as estatisticas precisam de valor e legenda.';
  }

  if (!isValidPath(normalized.featuredStores.ctaHref)) {
    nextErrors.featuredCta = 'CTA de lojas em destaque deve ser uma rota valida.';
  }
  if (!isValidPath(normalized.blogPreview.ctaHref)) {
    nextErrors.blogCta = 'CTA do blog deve ser uma rota valida.';
  }
  if (!isValidPath(normalized.leasingCta.ctaHref)) {
    nextErrors.leasingCta = 'CTA de locacao deve ser uma rota valida.';
  }
  if (!isValidHttpUrl(normalized.leasingCta.backgroundImage)) {
    nextErrors.leasingImage = 'Imagem do bloco de locacao deve usar URL valida.';
  }

  return nextErrors;
}
