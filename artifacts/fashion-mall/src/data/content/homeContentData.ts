import type { HomePageContent } from '@/types';

// Local fallback used when no persisted CMS/admin data exists for Home.
export const homeContentData: HomePageContent = {
  hero: {
    eyebrow: 'Fashion Bras - O Shopping de Moda',
    slides: [
      {
        id: 'home-hero-1',
        title: 'Moda que Inspira,',
        subtitle: 'Estilo que Persiste',
        cta: 'Descubra as Lojas',
        href: '/lojas',
        image:
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
      },
      {
        id: 'home-hero-2',
        title: 'Marcas Selecionadas,',
        subtitle: 'Experiencias Unicas',
        cta: 'Explore o Shopping',
        href: '/sobre',
        image:
          'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
      },
      {
        id: 'home-hero-3',
        title: 'O Destino da Moda',
        subtitle: 'que Voce Merece',
        cta: 'Conheca o Blog',
        href: '/blog',
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
      },
    ],
  },
  institutional: {
    eyebrow: 'Bem-vindo ao',
    title: 'Um Shopping Pensado',
    titleHighlight: 'para Quem Ama Moda',
    leadParagraph:
      'Inaugurado em 2010, o Fashion Bras e o principal destino de moda de Sao Paulo. Com mais de 80 lojas cuidadosamente selecionadas, reunimos as melhores marcas nacionais e internacionais em um ambiente sofisticado e acolhedor.',
    secondaryParagraph:
      'Aqui, cada detalhe foi pensado para proporcionar a melhor experiencia de compra: desde a arquitetura de alto padrao ate o atendimento personalizado de cada lojista.',
    ctaLabel: 'Conheca nossa historia',
    ctaHref: '/sobre',
    imagePrimary:
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
    imageSecondary:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
    floatingStatValue: '80+',
    floatingStatLabel: 'Lojas Selecionadas',
  },
  stats: {
    backgroundWord: 'MODA',
    items: [
      { value: '80+', label: 'Lojas curadas' },
      { value: '50k', label: 'Visitantes / mes' },
      { value: '14', label: 'Anos de historia' },
      { value: '3', label: 'Pisos de moda' },
    ],
  },
  featuredStores: {
    eyebrow: 'Lojas em Destaque',
    title: 'Marcas que',
    titleHighlight: 'Inspiram',
    ctaLabel: 'Ver todas as lojas',
    ctaHref: '/lojas',
    emptyMessage: 'Nenhuma loja em destaque cadastrada no momento.',
  },
  partners: {
    eyebrow: 'Marcas & Parceiros',
    emptyMessage: 'Lista de parceiros indisponivel no momento.',
  },
  blogPreview: {
    eyebrow: 'Blog & Novidades',
    title: 'Tendencias &',
    titleHighlight: 'Inspiracao',
    ctaLabel: 'Ver todos os artigos',
    ctaHref: '/blog',
    emptyMessage: 'Novos artigos serao publicados em breve.',
  },
  leasingCta: {
    eyebrow: 'Faca Parte do Fashion Bras',
    title: 'Sua Marca Merece',
    titleHighlight: 'um Endereco de Destaque',
    description:
      'Junte-se a mais de 80 marcas que escolheram o Fashion Bras como seu lar.',
    ctaLabel: 'Solicitar Locacao',
    ctaHref: '/locacao',
    backgroundImage:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80',
  },
};
