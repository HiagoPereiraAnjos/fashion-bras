import { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { SiteSettingsTextField } from '@/types';
import {
  Field,
  Input,
  InlineNotice,
  SaveButton,
  SectionCard,
  useSaveState,
} from '@/features/admin/components/shared/AdminFormControls';
import {
  hasMinLength,
  isRequired,
  isValidEmail,
  isValidHttpUrl,
  isValidPath,
  isValidPhone,
  normalizeText,
} from '@/utils/validation';

const CONTACT_FIELDS: ReadonlyArray<{
  key: SiteSettingsTextField;
  label: string;
}> = [
  { key: 'address', label: 'Endereço' },
  { key: 'phone', label: 'Telefone' },
  { key: 'email', label: 'E-mail' },
  { key: 'hours', label: 'Horário de Funcionamento' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
];

export default function SiteSettingsTab() {
  const { siteSettings, setSiteSettings, resetSection } = useAdminData();
  const [form, setForm] = useState({ ...siteSettings });
  const [errors, setErrors] = useState<Partial<Record<SiteSettingsTextField | 'navLinks', string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const { saved, trigger } = useSaveState();

  const update = (key: SiteSettingsTextField, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateNavLink = (index: number, key: 'label' | 'href', value: string) => {
    const navLinks = [...form.navLinks];
    navLinks[index] = { ...navLinks[index], [key]: value };
    setForm((current) => ({ ...current, navLinks }));
  };

  const isSocialValueValid = (value: string) => {
    const normalized = normalizeText(value);
    if (!normalized) return true;
    if (isValidHttpUrl(normalized)) return true;
    return /^@?[a-zA-Z0-9._]{2,30}$/.test(normalized);
  };

  const sanitizeForm = () => {
    return {
      ...form,
      name: normalizeText(form.name),
      tagline: normalizeText(form.tagline),
      address: normalizeText(form.address),
      phone: normalizeText(form.phone),
      email: normalizeText(form.email),
      hours: normalizeText(form.hours),
      instagram: normalizeText(form.instagram),
      facebook: normalizeText(form.facebook),
      navLinks: form.navLinks.map((link) => ({
        label: normalizeText(link.label),
        href: normalizeText(link.href),
      })),
    };
  };

  const validateForm = () => {
    const normalized = sanitizeForm();
    const nextErrors: Partial<Record<SiteSettingsTextField | 'navLinks', string>> = {};

    if (!isRequired(normalized.name) || !hasMinLength(normalized.name, 3)) {
      nextErrors.name = 'Informe um nome válido para o shopping.';
    }

    if (!isRequired(normalized.tagline) || !hasMinLength(normalized.tagline, 8)) {
      nextErrors.tagline = 'Slogan muito curto. Use pelo menos 8 caracteres.';
    }

    if (!isRequired(normalized.address)) {
      nextErrors.address = 'Endereço é obrigatório.';
    }

    if (!isRequired(normalized.phone) || !isValidPhone(normalized.phone)) {
      nextErrors.phone = 'Telefone inválido. Use DDD e número.';
    }

    if (!isRequired(normalized.email) || !isValidEmail(normalized.email)) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (!isRequired(normalized.hours)) {
      nextErrors.hours = 'Horário de funcionamento é obrigatório.';
    }

    if (!isSocialValueValid(normalized.instagram)) {
      nextErrors.instagram = 'Use @usuario ou URL válida para o Instagram.';
    }

    if (!isSocialValueValid(normalized.facebook)) {
      nextErrors.facebook = 'Use @usuario ou URL válida para o Facebook.';
    }

    const hasPartialNavLink = normalized.navLinks.some(
      (link) => (isRequired(link.label) && !isRequired(link.href)) || (!isRequired(link.label) && isRequired(link.href)),
    );
    if (hasPartialNavLink) {
      nextErrors.navLinks = 'Preencha label e caminho juntos em cada item de navegação.';
    }

    const invalidPath = normalized.navLinks.some((link) => isRequired(link.href) && !isValidPath(link.href));
    if (!nextErrors.navLinks && invalidPath) {
      nextErrors.navLinks = 'Os caminhos devem começar com "/" (ex: /blog).';
    }

    const validNavLinks = normalized.navLinks.filter((link) => isRequired(link.label) && isRequired(link.href));
    if (!nextErrors.navLinks && validNavLinks.length === 0) {
      nextErrors.navLinks = 'Adicione pelo menos um link de navegação válido.';
    }

    return { nextErrors, normalized, validNavLinks };
  };

  const handleSave = () => {
    const { nextErrors, normalized, validNavLinks } = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaveError('Existem campos inválidos. Revise antes de salvar.');
      return;
    }

    setSaveError(null);
    trigger(() =>
      setSiteSettings({
        ...normalized,
        navLinks: validNavLinks,
      }),
    );
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Identidade do Site"
        onReset={() => {
          const defaults = resetSection('siteSettings');
          setForm({ ...defaults });
          setErrors({});
          setSaveError(null);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome do Shopping">
            <Input value={form.name} onChange={(value) => update('name', value)} placeholder="Fashion Bras" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </Field>
          <Field label="Slogan">
            <Input
              value={form.tagline}
              onChange={(value) => update('tagline', value)}
              placeholder="O destino da moda..."
            />
            {errors.tagline && <p className="mt-1 text-xs text-red-600">{errors.tagline}</p>}
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Informações de Contato">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTACT_FIELDS.map(({ key, label }) => (
            <Field key={key} label={label}>
              <Input value={form[key]} onChange={(value) => update(key, value)} />
              {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
            </Field>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Navegação">
        <div className="space-y-3">
          {form.navLinks.map((link, index) => (
            <div key={index} className="flex gap-3 items-center">
              <Input
                value={link.label}
                onChange={(value) => updateNavLink(index, 'label', value)}
                placeholder="Label"
                className="flex-1"
              />
              <Input
                value={link.href}
                onChange={(value) => updateNavLink(index, 'href', value)}
                placeholder="/caminho"
                className="flex-1"
              />
            </div>
          ))}
        </div>
        {errors.navLinks && <p className="mt-2 text-xs text-red-600">{errors.navLinks}</p>}
      </SectionCard>

      {saveError && <InlineNotice tone="error" message={saveError} />}
      <SaveButton onClick={handleSave} saved={saved} />
    </div>
  );
}
