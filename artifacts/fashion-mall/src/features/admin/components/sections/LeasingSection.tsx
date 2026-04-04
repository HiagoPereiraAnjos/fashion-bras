import { useEffect, useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import {
  InlineNotice,
  SaveButton,
  useSaveState,
} from '@/features/admin/components/shared/AdminFormControls';
import {
  LeasingBenefitsCard,
  LeasingDifferentialsCard,
  SpaceTypesCard,
  TestimonialsCard,
} from '@/features/admin/components/sections/leasing/LeasingSectionCards';
import {
  buildLeasingSectionSaveResult,
  createLeasingSectionFormData,
  type LeasingSectionFormData,
} from '@/features/admin/components/sections/leasing/leasingSectionForm';

type SaveNotice = { tone: 'success' | 'error'; message: string } | null;

function buildInitialForm(params: {
  benefits: LeasingSectionFormData['benefits'];
  spaces: LeasingSectionFormData['spaces'];
  testimonials: LeasingSectionFormData['testimonials'];
  differentials: LeasingSectionFormData['differentials'];
}): LeasingSectionFormData {
  return createLeasingSectionFormData({
    benefits: params.benefits,
    spaces: params.spaces,
    testimonials: params.testimonials,
    differentials: params.differentials,
  });
}

export default function LeasingSection() {
  const {
    leasingBenefits,
    setLeasingBenefits,
    spaceTypes,
    setSpaceTypes,
    testimonials,
    setTestimonials,
    leasingDifferentials,
    setLeasingDifferentials,
    resetSection,
  } = useAdminData();
  const [form, setForm] = useState<LeasingSectionFormData>(() =>
    buildInitialForm({
      benefits: leasingBenefits,
      spaces: spaceTypes,
      testimonials,
      differentials: leasingDifferentials,
    }),
  );
  const [notice, setNotice] = useState<SaveNotice>(null);
  const { saved, trigger } = useSaveState();

  useEffect(() => {
    setForm(
      buildInitialForm({
        benefits: leasingBenefits,
        spaces: spaceTypes,
        testimonials,
        differentials: leasingDifferentials,
      }),
    );
    setNotice(null);
  }, [leasingBenefits, spaceTypes, testimonials, leasingDifferentials]);

  const saveAll = () => {
    const result = buildLeasingSectionSaveResult(form);
    if (result.error || !result.payload) {
      setNotice({ tone: 'error', message: result.error ?? 'Falha ao salvar conteúdo de locação.' });
      return;
    }

    const { benefits, spaces, testimonials: nextTestimonials, differentials, removedCount } =
      result.payload;

    trigger(() => {
      setLeasingBenefits(benefits);
      setSpaceTypes(spaces);
      setTestimonials(nextTestimonials);
      setLeasingDifferentials(differentials);

      setForm(
        buildInitialForm({
          benefits,
          spaces,
          testimonials: nextTestimonials,
          differentials,
        }),
      );
    });

    setNotice({
      tone: 'success',
      message:
        removedCount > 0
          ? `${removedCount} item(ns) vazio(s) foram removidos no salvamento.`
          : 'Conteúdo de locação atualizado com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <LeasingBenefitsCard
        benefits={form.benefits}
        setBenefits={(updater) =>
          setForm((current) => ({
            ...current,
            benefits: typeof updater === 'function' ? updater(current.benefits) : updater,
          }))
        }
        onReset={() => {
          const defaults = resetSection('leasingBenefits');
          setForm((current) => ({ ...current, benefits: [...defaults] }));
          setNotice(null);
        }}
      />

      <SpaceTypesCard
        spaces={form.spaces}
        setSpaces={(updater) =>
          setForm((current) => ({
            ...current,
            spaces: typeof updater === 'function' ? updater(current.spaces) : updater,
          }))
        }
        onReset={() => {
          const defaults = resetSection('spaceTypes');
          setForm((current) => ({ ...current, spaces: [...defaults] }));
          setNotice(null);
        }}
      />

      <TestimonialsCard
        testimonials={form.testimonials}
        setTestimonials={(updater) =>
          setForm((current) => ({
            ...current,
            testimonials:
              typeof updater === 'function' ? updater(current.testimonials) : updater,
          }))
        }
        onReset={() => {
          const defaults = resetSection('testimonials');
          setForm((current) => ({ ...current, testimonials: [...defaults] }));
          setNotice(null);
        }}
      />

      <LeasingDifferentialsCard
        differentials={form.differentials}
        setDifferentials={(updater) =>
          setForm((current) => ({
            ...current,
            differentials:
              typeof updater === 'function' ? updater(current.differentials) : updater,
          }))
        }
        onReset={() => {
          const defaults = resetSection('leasingDifferentials');
          setForm((current) => ({ ...current, differentials: [...defaults] }));
          setNotice(null);
        }}
      />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={saveAll} saved={saved} />
    </div>
  );
}
