import type { SiteSettings } from '@/types';

export const siteSettings: SiteSettings = {
  name: 'Fashion Bras',
  tagline: 'O destino da moda que voce merece.',
  institutionalDescription:
    'Shopping de moda premium em Sao Paulo, com curadoria de marcas, atendimento qualificado e experiencias sofisticadas.',
  address: 'Rua das Artes, 1200 - Centro Fashion, Sao Paulo, SP',
  phone: '(11) 3000-0000',
  email: 'contato@fashionbras.com.br',
  hours: 'Segunda a Sabado: 10h as 22h | Domingo: 12h as 20h',
  instagram: '@fashionbras',
  facebook: 'fashionbras',
  footerLeasingLabel: 'Saiba mais sobre locacao',
  footerLeasingHref: '/locacao',
  footerLegalNote: 'Conteudo e experiencia digital desenvolvidos para a moda brasileira.',
  navLinks: [
    { label: 'Inicio', href: '/' },
    { label: 'Lojas', href: '/lojas' },
    { label: 'Blog', href: '/blog' },
    { label: 'Locacao', href: '/locacao' },
    { label: 'Sobre', href: '/sobre' },
  ],
};
