import type { SiteSettings, SiteSettingsTextField } from '@/types';
import {
  hasMinLength,
  isRequired,
  isValidEmail,
  isValidHttpUrl,
  isValidPath,
  isValidPhone,
  normalizeText,
} from '@/utils/validation';

export type SiteSettingsFormErrors = Partial<Record<SiteSettingsTextField | 'navLinks', string>>;

export interface SiteSettingsSaveResult {
  errors: SiteSettingsFormErrors;
  normalized: SiteSettings;
  validNavLinks: SiteSettings['navLinks'];
}

export function createSiteSettingsFormData(siteSettings: SiteSettings): SiteSettings {
  return {
    ...siteSettings,
    navLinks: siteSettings.navLinks.map((link) => ({ ...link })),
  };
}

function isSocialValueValid(value: string): boolean {
  const normalized = normalizeText(value);
  if (!normalized) return true;
  if (isValidHttpUrl(normalized)) return true;
  return /^@?[a-zA-Z0-9._]{2,30}$/.test(normalized);
}

export function sanitizeSiteSettingsForm(form: SiteSettings): SiteSettings {
  return {
    ...form,
    name: normalizeText(form.name),
    tagline: normalizeText(form.tagline),
    institutionalDescription: normalizeText(form.institutionalDescription),
    address: normalizeText(form.address),
    phone: normalizeText(form.phone),
    email: normalizeText(form.email),
    hours: normalizeText(form.hours),
    instagram: normalizeText(form.instagram),
    facebook: normalizeText(form.facebook),
    footerLeasingLabel: normalizeText(form.footerLeasingLabel),
    footerLeasingHref: normalizeText(form.footerLeasingHref),
    footerLegalNote: normalizeText(form.footerLegalNote),
    navLinks: form.navLinks.map((link) => ({
      label: normalizeText(link.label),
      href: normalizeText(link.href),
    })),
  };
}

export function validateSiteSettingsForm(form: SiteSettings): SiteSettingsSaveResult {
  const normalized = sanitizeSiteSettingsForm(form);
  const errors: SiteSettingsFormErrors = {};

  if (!isRequired(normalized.name) || !hasMinLength(normalized.name, 3)) {
    errors.name = 'Informe um nome valido para o shopping.';
  }

  if (!isRequired(normalized.tagline) || !hasMinLength(normalized.tagline, 8)) {
    errors.tagline = 'Slogan muito curto. Use pelo menos 8 caracteres.';
  }

  if (
    !isRequired(normalized.institutionalDescription) ||
    !hasMinLength(normalized.institutionalDescription, 24)
  ) {
    errors.institutionalDescription =
      'Descricao institucional muito curta. Use pelo menos 24 caracteres.';
  }

  if (!isRequired(normalized.address)) {
    errors.address = 'Endereco e obrigatorio.';
  }

  if (!isRequired(normalized.phone) || !isValidPhone(normalized.phone)) {
    errors.phone = 'Telefone invalido. Use DDD e numero.';
  }

  if (!isRequired(normalized.email) || !isValidEmail(normalized.email)) {
    errors.email = 'Informe um e-mail valido.';
  }

  if (!isRequired(normalized.hours)) {
    errors.hours = 'Horario de funcionamento e obrigatorio.';
  }

  if (!isSocialValueValid(normalized.instagram)) {
    errors.instagram = 'Use @usuario ou URL valida para o Instagram.';
  }

  if (!isSocialValueValid(normalized.facebook)) {
    errors.facebook = 'Use @usuario ou URL valida para o Facebook.';
  }

  if (!isRequired(normalized.footerLeasingLabel) || !hasMinLength(normalized.footerLeasingLabel, 4)) {
    errors.footerLeasingLabel = 'Texto do link de locacao invalido.';
  }

  if (!isRequired(normalized.footerLeasingHref) || !isValidPath(normalized.footerLeasingHref)) {
    errors.footerLeasingHref = 'Link de locacao deve comecar com "/".';
  }

  if (!isRequired(normalized.footerLegalNote) || !hasMinLength(normalized.footerLegalNote, 16)) {
    errors.footerLegalNote = 'Nota legal do rodape muito curta.';
  }

  const hasPartialNavLink = normalized.navLinks.some(
    (link) =>
      (isRequired(link.label) && !isRequired(link.href)) ||
      (!isRequired(link.label) && isRequired(link.href)),
  );
  if (hasPartialNavLink) {
    errors.navLinks = 'Preencha label e caminho juntos em cada item de navegacao.';
  }

  const invalidPath = normalized.navLinks.some(
    (link) => isRequired(link.href) && !isValidPath(link.href),
  );
  if (!errors.navLinks && invalidPath) {
    errors.navLinks = 'Os caminhos devem comecar com "/" (ex: /blog).';
  }

  const validNavLinks = normalized.navLinks.filter(
    (link) => isRequired(link.label) && isRequired(link.href),
  );
  if (!errors.navLinks && validNavLinks.length === 0) {
    errors.navLinks = 'Adicione pelo menos um link de navegacao valido.';
  }

  return {
    errors,
    normalized,
    validNavLinks,
  };
}
