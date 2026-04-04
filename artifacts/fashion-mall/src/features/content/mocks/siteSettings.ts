import type { SiteSettings } from '@/types';

export const siteSettings: SiteSettings = {
  name: 'Fashion Bras',
  tagline: 'O destino da moda que você merece.',
  address: 'Rua das Artes, 1200 — Centro Fashion, São Paulo, SP',
  phone: '(11) 3000-0000',
  email: 'contato@fashionbras.com.br',
  hours: 'Segunda a Sábado: 10h às 22h | Domingo: 12h às 20h',
  instagram: '@fashionbras',
  facebook: 'fashionbras',
  navLinks: [
    { label: 'Início', href: '/' },
    { label: 'Lojas', href: '/lojas' },
    { label: 'Blog', href: '/blog' },
    { label: 'Locação', href: '/locacao' },
    { label: 'Sobre', href: '/sobre' },
  ],
};
