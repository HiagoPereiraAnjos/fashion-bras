export type SeoPageType = 'website' | 'article';

export interface PageSeoMetadata {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  type?: SeoPageType;
  noIndex?: boolean;
}

export const seoConfig = {
  siteName: 'Fashion Bras',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://fashionbras.com.br',
  locale: 'pt_BR',
  defaultTitle: 'Shopping de Moda Premium em São Paulo',
  defaultDescription:
    'Fashion Bras: shopping de moda premium com lojas selecionadas, tendências, conteúdo editorial e oportunidades de locação em São Paulo.',
  defaultImage:
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
  twitterCard: 'summary_large_image',
};

export function buildPageTitle(title?: string) {
  if (!title) return `${seoConfig.siteName} | ${seoConfig.defaultTitle}`;
  return `${title} | ${seoConfig.siteName}`;
}
