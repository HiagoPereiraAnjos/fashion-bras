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
import { resolveUserFacingError } from '@/services/errors/userFacingError';

type SaveNotice = { tone: 'info' | 'success' | 'error'; message: string } | null;

export default function SiteSettingsSection() {
  const { siteSettings, setSiteSettings, resetSection } = useAdminData();
  const [form, setForm] = useState<SiteSettings>(() => createSiteSettingsFormData(siteSettings));
  const [errors, setErrors] = useState<SiteSettingsFormErrors>({});
  const [notice, setNotice] = useState<SaveNotice>(null);
  const [isResetting, setIsResetting] = useState(false);
  const { saved, isSaving, trigger } = useSaveState();

  useEffect(() => {
    setForm(createSiteSettingsFormData(siteSettings));
    setErrors({});
    setNotice(null);
  }, [siteSettings]);

  const update = (key: SiteSettingsTextField, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateNavLink = (index: number, key: 'label' | 'href', value: string) => {
    const navLinks = [...form.navLinks];
    navLinks[index] = { ...navLinks[index], [key]: value };
    setForm((current) => ({ ...current, navLinks }));
  };

  const handleSave = async () => {
    if (isResetting) return;

    const { errors: nextErrors, normalized, validNavLinks } = validateSiteSettingsForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNotice({ tone: 'error', message: 'Existem campos invalidos. Revise antes de salvar.' });
      return;
    }

    setNotice({ tone: 'info', message: 'Salvando configuracoes do site...' });
    try {
      await trigger(async () =>
        setSiteSettings({
          ...normalized,
          navLinks: validNavLinks,
        }),
      );
      setNotice({ tone: 'success', message: 'Configuracoes do site salvas com sucesso.' });
    } catch (error) {
      const { message } = resolveUserFacingError(error, {
        unexpectedMessage: 'Nao foi possivel salvar as configuracoes do site.',
        validationMessage: 'Algumas configuracoes do site precisam de ajuste antes do salvamento.',
      });
      setNotice({
        tone: 'error',
        message,
      });
    }
  };

  const handleResetSection = () => {
    if (isSaving || isResetting) return;

    void (async () => {
      setIsResetting(true);
      setNotice({ tone: 'info', message: 'Restaurando configuracoes do site...' });
      try {
        const defaults = await resetSection('siteSettings');
        setForm(createSiteSettingsFormData(defaults));
        setErrors({});
        setNotice({ tone: 'success', message: 'Configuracoes padrao restauradas com sucesso.' });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel restaurar as configuracoes padrao.',
          validationMessage: 'Nao foi possivel restaurar as configuracoes no momento.',
        });
        setNotice({
          tone: 'error',
          message,
        });
      } finally {
        setIsResetting(false);
      }
    })();
  };

  return (
    <div className="space-y-6">
      <IdentitySettingsCard
        form={form}
        errors={errors}
        update={update}
        onReset={handleResetSection}
        isResetting={isResetting}
      />

      <ContactSettingsCard form={form} errors={errors} update={update} />

      <SocialSettingsCard form={form} errors={errors} update={update} />

      <NavigationSettingsCard
        navLinks={form.navLinks}
        navLinksError={errors.navLinks}
        onUpdateNavLink={updateNavLink}
      />

      <FooterSettingsCard form={form} errors={errors} update={update} />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={handleSave} saved={saved} isSaving={isSaving} disabled={isResetting} />
    </div>
  );
}
