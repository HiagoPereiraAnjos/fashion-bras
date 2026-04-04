import { useEffect, useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { InlineNotice, SaveButton, useSaveState } from '@/features/admin/components/shared/AdminFormControls';
import {
  HeroSettingsCard,
  InstitutionalSettingsCard,
  SecondaryBlocksSettingsCard,
  StatsAndFeaturedSettingsCard,
} from '@/features/admin/components/sections/home/HomeSectionCards';
import { normalizeHomeContent, type HomeSectionErrors, validateHomeContent } from '@/features/admin/components/sections/home/homeSectionForm';
import type { HomePageContent } from '@/types';

export default function HomeSection() {
  const { homeContent, resetSection, setHomeContent } = useAdminData();
  const [form, setForm] = useState<HomePageContent>(() => ({ ...homeContent }));
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errors, setErrors] = useState<HomeSectionErrors>({});
  const { saved, trigger } = useSaveState();

  useEffect(() => {
    setForm({ ...homeContent });
    setSaveError(null);
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

  const handleSave = () => {
    const normalized = normalizeHomeContent(form);
    const nextErrors = validateHomeContent(normalized);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaveError('Existem campos invalidos na Home. Revise antes de salvar.');
      return;
    }

    setSaveError(null);
    trigger(() => setHomeContent(normalized));
  };

  return (
    <div className="space-y-6">
      <HeroSettingsCard
        form={form}
        setForm={setForm}
        errorMessage={heroErrorMessage}
        onReset={() => {
          const defaults = resetSection('homeContent');
          setForm(defaults);
          setSaveError(null);
          setErrors({});
        }}
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

      {saveError && <InlineNotice tone="error" message={saveError} />}
      <SaveButton onClick={handleSave} saved={saved} />
    </div>
  );
}
