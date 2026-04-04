import type { UrlString } from '@/types/domain/base';

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  institutionalDescription: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  instagram: UrlString | string;
  facebook: UrlString | string;
  footerLeasingLabel: string;
  footerLeasingHref: string;
  footerLegalNote: string;
  navLinks: NavLink[];
}

export const SITE_SETTINGS_TEXT_FIELDS = [
  'name',
  'tagline',
  'institutionalDescription',
  'address',
  'phone',
  'email',
  'hours',
  'instagram',
  'facebook',
  'footerLeasingLabel',
  'footerLeasingHref',
  'footerLegalNote',
] as const;

export type SiteSettingsTextField = (typeof SITE_SETTINGS_TEXT_FIELDS)[number];
