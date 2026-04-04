import type { UrlString } from '@/types/domain/base';

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  instagram: UrlString | string;
  facebook: UrlString | string;
  navLinks: NavLink[];
}

export const SITE_SETTINGS_TEXT_FIELDS = [
  'name',
  'tagline',
  'address',
  'phone',
  'email',
  'hours',
  'instagram',
  'facebook',
] as const;

export type SiteSettingsTextField = (typeof SITE_SETTINGS_TEXT_FIELDS)[number];
