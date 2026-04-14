import { useEffect, useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import {
  InlineNotice,
  SaveButton,
  useSaveState,
} from '@/features/admin/components/shared/AdminFormControls';
import {
  HeroSettingsCard,
  InstitutionalSettingsCard,
  SecondaryBlocksSettingsCard,
  StatsAndFeaturedSettingsCard,
} from '@/features/admin/components/sections/home/HomeSectionCards';
import {
  normalizeHomeContent,
  type HomeSectionErrors,
  validateHomeContent,
} from '@/features/admin/components/sections/home/homeSectionForm';
import type { HomePageContent } from '@/types';
import { resolveUserFacingError } from '@/services/errors/userFacingError';

type SaveNotice = { tone: 'info' | 'success' | 'error'; message: string } | null;

export default function HomeSection() {
  const { homeContent, resetSection, setHomeContent } = useAdminData();
  const [form, setForm] = useState<HomePageContent>(() => ({ ...homeContent }));
  const [notice, setNotice] = useState<SaveNotice>(null);
  const [errors, setErrors] = useState<HomeSectionErrors>({});
  const [isResetting, setIsResetting] = useState(false);
  const { saved, isSaving, trigger } = useSaveState();

  useEffect(() => {
    setForm({ ...homeContent });
    setNotice(null);
    setErrors({});
  }, [homeContent]);

  const heroErrorMessage = Object.entries(errors).find(([key]) => key.startsWith('hero'))?.[1];
  const institutionalErrorMessage = Object.entries(errors).find(([key]) =>
    key.startsWith('institutional'),
  )?.[1];
  const statsErrorMessage =
    Object.entries(errors).find(([key]) => key.startsWith('stats'))?.[1] ?? errors.featuredCta;
  const secondaryBlocksErrorMessage =
    errors.blogCta ?? errors.leasingCta ?? errors.leasingImage;

  const handleSave = async () => {
    if (isResetting) return;

    const normalized = normalizeHomeContent(form);
    const nextErrors = validateHomeContent(normalized);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNotice({ tone: 'error', message: 'Existem campos invalidos na Home. Revise antes de salvar.' });
      return;
    }

    setNotice({ tone: 'info', message: 'Salvando conteudo da Home...' });
    try {
      await trigger(async () => setHomeContent(normalized));
      setNotice({ tone: 'success', message: 'Conteudo da Home salvo com sucesso.' });
    } catch (error) {
      const { message } = resolveUserFacingError(error, {
        unexpectedMessage: 'Nao foi possivel salvar o conteudo da Home.',
        validationMessage: 'Alguns campos da Home precisam de ajuste antes do salvamento.',
      });
      setNotice({
        tone: 'error',
        message,
      });
    }
  };

  const handleReset = () => {
    if (isSaving || isResetting) return;

    void (async () => {
      setIsResetting(true);
      setNotice({ tone: 'info', message: 'Restaurando conteudo da Home...' });
      try {
        const defaults = await resetSection('homeContent');
        setForm(defaults);
        setNotice({ tone: 'success', message: 'Conteudo padrao da Home restaurado com sucesso.' });
        setErrors({});
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel restaurar os padroes.',
          validationMessage: 'Nao foi possivel restaurar os padroes da Home no momento.',
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
      <HeroSettingsCard
        form={form}
        setForm={setForm}
        errorMessage={heroErrorMessage}
        onReset={handleReset}
        isResetting={isResetting}
      />

      <InstitutionalSettingsCard
        form={form}
        setForm={setForm}
        errorMessage={institutionalErrorMessage}
      />

      <StatsAndFeaturedSettingsCard
        form={form}
        setForm={setForm}
        errorMessage={statsErrorMessage}
      />

      <SecondaryBlocksSettingsCard
        form={form}
        setForm={setForm}
        errorMessage={secondaryBlocksErrorMessage}
      />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={handleSave} saved={saved} isSaving={isSaving} disabled={isResetting} />
    </div>
  );
}
