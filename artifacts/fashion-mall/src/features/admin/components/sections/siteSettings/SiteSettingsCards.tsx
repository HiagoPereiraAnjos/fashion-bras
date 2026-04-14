import {
  Field,
  Input,
  SectionCard,
  Textarea,
} from '@/features/admin/components/shared/AdminFormControls';
import type { SiteSettings, SiteSettingsTextField } from '@/types';
import type { SiteSettingsFormErrors } from '@/features/admin/components/sections/siteSettings/siteSettingsForm';

const CONTACT_FIELDS: ReadonlyArray<{ key: SiteSettingsTextField; label: string }> = [
  { key: 'address', label: 'Endereco' },
  { key: 'phone', label: 'Telefone' },
  { key: 'email', label: 'E-mail' },
  { key: 'hours', label: 'Horario de Funcionamento' },
];

const SOCIAL_FIELDS: ReadonlyArray<{ key: SiteSettingsTextField; label: string }> = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
];

interface SharedCardProps {
  form: SiteSettings;
  errors: SiteSettingsFormErrors;
  update: (key: SiteSettingsTextField, value: string) => void;
}

interface IdentitySettingsCardProps extends SharedCardProps {
  onReset: () => void;
  isResetting?: boolean;
}

export function IdentitySettingsCard({
  form,
  errors,
  update,
  onReset,
  isResetting = false,
}: IdentitySettingsCardProps) {
  return (
    <SectionCard title="Identidade do Site" onReset={onReset} isResetting={isResetting}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nome do Shopping">
          <Input
            value={form.name}
            onChange={(value) => update('name', value)}
            placeholder="Fashion Bras"
            dataTestId="site-settings-name-input"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </Field>
        <Field label="Slogan">
          <Input
            value={form.tagline}
            onChange={(value) => update('tagline', value)}
            placeholder="O destino da moda..."
            dataTestId="site-settings-tagline-input"
          />
          {errors.tagline && <p className="mt-1 text-xs text-red-600">{errors.tagline}</p>}
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Descricao Institucional (rodape)">
          <Textarea
            value={form.institutionalDescription}
            onChange={(value) => update('institutionalDescription', value)}
            rows={3}
          />
          {errors.institutionalDescription && (
            <p className="mt-1 text-xs text-red-600">{errors.institutionalDescription}</p>
          )}
        </Field>
      </div>
    </SectionCard>
  );
}

export function ContactSettingsCard({ form, errors, update }: SharedCardProps) {
  return (
    <SectionCard title="Informacoes de Contato">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTACT_FIELDS.map(({ key, label }) => (
          <Field key={key} label={label}>
            <Input value={form[key]} onChange={(value) => update(key, value)} />
            {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
          </Field>
        ))}
      </div>
    </SectionCard>
  );
}

export function SocialSettingsCard({ form, errors, update }: SharedCardProps) {
  return (
    <SectionCard title="Redes Sociais">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SOCIAL_FIELDS.map(({ key, label }) => (
          <Field key={key} label={label}>
            <Input value={form[key]} onChange={(value) => update(key, value)} />
            {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
          </Field>
        ))}
      </div>
    </SectionCard>
  );
}

interface NavigationSettingsCardProps {
  navLinks: SiteSettings['navLinks'];
  navLinksError?: string;
  onUpdateNavLink: (index: number, key: 'label' | 'href', value: string) => void;
}

export function NavigationSettingsCard({
  navLinks,
  navLinksError,
  onUpdateNavLink,
}: NavigationSettingsCardProps) {
  return (
    <SectionCard title="Navegacao">
      <div className="space-y-3">
        {navLinks.map((link, index) => (
          <div key={index} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              value={link.label}
              onChange={(value) => onUpdateNavLink(index, 'label', value)}
              placeholder="Label"
              className="w-full sm:flex-1"
            />
            <Input
              value={link.href}
              onChange={(value) => onUpdateNavLink(index, 'href', value)}
              placeholder="/caminho"
              className="w-full sm:flex-1"
            />
          </div>
        ))}
      </div>
      {navLinksError && <p className="mt-2 text-xs text-red-600">{navLinksError}</p>}
    </SectionCard>
  );
}

export function FooterSettingsCard({ form, errors, update }: SharedCardProps) {
  return (
    <SectionCard title="Rodape">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Link de locacao (texto)">
          <Input
            value={form.footerLeasingLabel}
            onChange={(value) => update('footerLeasingLabel', value)}
          />
          {errors.footerLeasingLabel && (
            <p className="mt-1 text-xs text-red-600">{errors.footerLeasingLabel}</p>
          )}
        </Field>
        <Field label="Link de locacao (rota)">
          <Input
            value={form.footerLeasingHref}
            onChange={(value) => update('footerLeasingHref', value)}
            placeholder="/locacao"
          />
          {errors.footerLeasingHref && (
            <p className="mt-1 text-xs text-red-600">{errors.footerLeasingHref}</p>
          )}
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Nota legal do rodape">
          <Textarea
            value={form.footerLegalNote}
            onChange={(value) => update('footerLegalNote', value)}
            rows={2}
          />
          {errors.footerLegalNote && (
            <p className="mt-1 text-xs text-red-600">{errors.footerLegalNote}</p>
          )}
        </Field>
      </div>
    </SectionCard>
  );
}
