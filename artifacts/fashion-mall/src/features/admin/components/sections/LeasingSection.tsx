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
  const { saved, isSaving, trigger } = useSaveState();

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

  const saveAll = async () => {
    const result = buildLeasingSectionSaveResult(form);
    if (result.error || !result.payload) {
      setNotice({ tone: 'error', message: result.error ?? 'Falha ao salvar conteudo de locacao.' });
      return;
    }

    const { benefits, spaces, testimonials: nextTestimonials, differentials, removedCount } =
      result.payload;

    try {
      await trigger(async () => {
        await setLeasingBenefits(benefits);
        await setSpaceTypes(spaces);
        await setTestimonials(nextTestimonials);
        await setLeasingDifferentials(differentials);

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
            : 'Conteudo de locacao atualizado com sucesso.',
      });
    } catch (error) {
      setNotice({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Nao foi possivel salvar o conteudo de locacao.',
      });
    }
  };

  const resetBenefits = () => {
    void (async () => {
      try {
        const defaults = await resetSection('leasingBenefits');
        setForm((current) => ({ ...current, benefits: [...defaults] }));
        setNotice(null);
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Nao foi possivel restaurar os beneficios padrao.',
        });
      }
    })();
  };

  const resetSpaces = () => {
    void (async () => {
      try {
        const defaults = await resetSection('spaceTypes');
        setForm((current) => ({ ...current, spaces: [...defaults] }));
        setNotice(null);
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Nao foi possivel restaurar os tipos de espaco padrao.',
        });
      }
    })();
  };

  const resetTestimonials = () => {
    void (async () => {
      try {
        const defaults = await resetSection('testimonials');
        setForm((current) => ({ ...current, testimonials: [...defaults] }));
        setNotice(null);
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Nao foi possivel restaurar os depoimentos padrao.',
        });
      }
    })();
  };

  const resetDifferentials = () => {
    void (async () => {
      try {
        const defaults = await resetSection('leasingDifferentials');
        setForm((current) => ({ ...current, differentials: [...defaults] }));
        setNotice(null);
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Nao foi possivel restaurar os diferenciais padrao.',
        });
      }
    })();
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
        onReset={resetBenefits}
      />

      <SpaceTypesCard
        spaces={form.spaces}
        setSpaces={(updater) =>
          setForm((current) => ({
            ...current,
            spaces: typeof updater === 'function' ? updater(current.spaces) : updater,
          }))
        }
        onReset={resetSpaces}
      />

      <TestimonialsCard
        testimonials={form.testimonials}
        setTestimonials={(updater) =>
          setForm((current) => ({
            ...current,
            testimonials: typeof updater === 'function' ? updater(current.testimonials) : updater,
          }))
        }
        onReset={resetTestimonials}
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
        onReset={resetDifferentials}
      />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={saveAll} saved={saved} isSaving={isSaving} />
    </div>
  );
}
