import { BookOpen, Building2, Info, Settings, Store, Users } from 'lucide-react';

export const ADMIN_TABS = [
  { id: 'settings', label: 'Configurações', icon: Settings },
  { id: 'stores', label: 'Lojas', icon: Store },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'partners', label: 'Parceiros', icon: Users },
  { id: 'leasing', label: 'Locação', icon: Building2 },
  { id: 'about', label: 'Sobre', icon: Info },
] as const;

export type AdminTabId = (typeof ADMIN_TABS)[number]['id'];
