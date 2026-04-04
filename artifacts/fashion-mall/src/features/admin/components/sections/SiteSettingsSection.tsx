import { useEffect, useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { SiteSettings, SiteSettingsTextField } from '@/types';
import {
  InlineNotice,
  SaveButton,
  useSaveState,
} from '@/features/admin/components/shared/AdminFormControls';
import {
  ContactSettingsCard,
  FooterSettingsCard,
  IdentitySettingsCard,
  NavigationSettingsCard,
  SocialSettingsCard,
} from '@/features/admin/components/sections/siteSettings/SiteSettingsCards';
import {
  createSiteSettingsFormData,
  validateSiteSettingsForm,
  type SiteSettingsFormErrors,
} from '@/features/admin/components/sections/siteSettings/siteSettingsForm';

export default function SiteSettingsSection() {
  const { siteSettings, setSiteSettings, resetSection } = useAdminData();
  const [form, setForm] = useState<SiteSettings>(() => createSiteSettingsFormData(siteSettings));
  const [errors, setErrors] = useState<SiteSettingsFormErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const { saved, trigger } = useSaveState();

  useEffect(() => {
    setForm(createSiteSettingsFormData(siteSettings));
    setErrors({});
    setSaveError(null);
  }, [siteSettings]);

  const update = (key: SiteSettingsTextField, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateNavLink = (index: number, key: 'label' | 'href', value: string) => {
    const navLinks = [...form.navLinks];
    navLinks[index] = { ...navLinks[index], [key]: value };
    setForm((current) => ({ ...current, navLinks }));
  };

  const handleSave = () => {
    const { errors: nextErrors, normalized, validNavLinks } = validateSiteSettingsForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaveError('Existem campos invalidos. Revise antes de salvar.');
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
      <IdentitySettingsCard
        form={form}
        errors={errors}
        update={update}
        onReset={() => {
          const defaults = resetSection('siteSettings');
          setForm(createSiteSettingsFormData(defaults));
          setErrors({});
          setSaveError(null);
        }}
      />

      <ContactSettingsCard form={form} errors={errors} update={update} />

      <SocialSettingsCard form={form} errors={errors} update={update} />

      <NavigationSettingsCard
        navLinks={form.navLinks}
        navLinksError={errors.navLinks}
        onUpdateNavLink={updateNavLink}
      />

      <FooterSettingsCard form={form} errors={errors} update={update} />

      {saveError && <InlineNotice tone="error" message={saveError} />}
      <SaveButton onClick={handleSave} saved={saved} />
    </div>
  );
}
