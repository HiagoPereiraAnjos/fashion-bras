export type SeoPageType = 'website' | 'article';

export interface PageSeoMetadata {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  imageAlt?: string;
  type?: SeoPageType;
  noIndex?: boolean;
}

export const seoConfig = {
  siteName: 'Fashion Bras',
  siteUrl: (import.meta.env.VITE_SITE_URL || 'https://fashionbras.com.br').replace(/\/$/, ''),
  locale: 'pt_BR',
  defaultTitle: 'Shopping de Moda Premium em Sao Paulo',
  defaultDescription:
    'Fashion Bras: shopping de moda premium com lojas selecionadas, blog e oportunidades de locacao em Sao Paulo.',
  defaultImage:
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
  defaultImageAlt: 'Shopping de moda premium Fashion Bras em Sao Paulo',
  twitterCard: 'summary_large_image',
  twitterSite: '@fashionbras',
};

export function buildPageTitle(title?: string) {
  if (!title) return `${seoConfig.siteName} | ${seoConfig.defaultTitle}`;

  const includesSiteName = title
    .toLocaleLowerCase()
    .includes(seoConfig.siteName.toLocaleLowerCase());

  return includesSiteName ? title : `${title} | ${seoConfig.siteName}`;
}
