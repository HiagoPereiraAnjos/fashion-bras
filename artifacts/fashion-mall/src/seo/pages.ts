import type { PageSeoMetadata } from '@/seo/config';

export const seoPagePresets = {
  home: {
    title: 'Shopping de Moda Premium em Sao Paulo',
    description:
      'Descubra lojas de moda selecionadas, experiencias premium e conteudo editorial no Fashion Bras.',
    canonicalPath: '/',
  },
  stores: {
    title: 'Lojas de Moda',
    description:
      'Explore marcas premium de moda, acessorios, esportes e lifestyle no Fashion Bras em Sao Paulo.',
    canonicalPath: '/lojas',
  },
  storeDetailFallback: {
    title: 'Loja nao encontrada',
    description: 'A loja solicitada nao foi encontrada no catalogo atual do Fashion Bras.',
    canonicalPath: '/lojas',
    noIndex: true,
  },
  blog: {
    title: 'Blog de Moda e Tendencias',
    description:
      'Acompanhe tendencias, dicas de estilo, eventos e novidades no blog oficial do Fashion Bras.',
    canonicalPath: '/blog',
  },
  blogPostFallback: {
    title: 'Artigo nao encontrado',
    description: 'O artigo solicitado nao foi encontrado no blog do Fashion Bras.',
    canonicalPath: '/blog',
    noIndex: true,
  },
  leasing: {
    title: 'Locacao de Lojas e Espacos',
    description:
      'Conheca oportunidades de locacao no Fashion Bras com beneficios para lojistas e proposta comercial.',
    canonicalPath: '/locacao',
  },
  about: {
    title: 'Sobre o Fashion Bras',
    description:
      'Conheca a historia, missao, visao e valores do Fashion Bras, referencia em experiencia premium de moda.',
    canonicalPath: '/sobre',
  },
  admin: {
    title: 'Painel Administrativo',
    description: 'Area administrativa de gestao de conteudo do Fashion Bras.',
    canonicalPath: '/admin',
    noIndex: true,
  },
  adminLogin: {
    title: 'Login Administrativo',
    description: 'Acesso ao painel de administracao do Fashion Bras.',
    canonicalPath: '/admin/login',
    noIndex: true,
  },
  notFound: {
    title: 'Pagina nao encontrada',
    description: 'A pagina solicitada nao foi encontrada no Fashion Bras.',
    noIndex: true,
  },
} as const;

export type SeoPageId = keyof typeof seoPagePresets;

export function getSeoMetadata(
  page: SeoPageId,
  overrides: PageSeoMetadata = {},
): PageSeoMetadata {
  return {
    ...seoPagePresets[page],
    ...overrides,
  };
}
