import { BookOpen, Building2, Home, Info, Settings, Store, Users } from 'lucide-react';

export const ADMIN_TABS = [
  { id: 'settings', label: 'Configuracoes', icon: Settings },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'stores', label: 'Lojas', icon: Store },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'partners', label: 'Parceiros', icon: Users },
  { id: 'leasing', label: 'Locacao', icon: Building2 },
  { id: 'about', label: 'Sobre', icon: Info },
] as const;

export type AdminTabId = (typeof ADMIN_TABS)[number]['id'];
