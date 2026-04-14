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
import { resolveUserFacingError } from '@/services/errors/userFacingError';

type SaveNotice = { tone: 'info' | 'success' | 'error'; message: string } | null;
type LeasingResetKey = 'benefits' | 'spaces' | 'testimonials' | 'differentials' | null;

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
  const [resettingSection, setResettingSection] = useState<LeasingResetKey>(null);
  const { saved, isSaving, trigger } = useSaveState();
  const isBusy = isSaving || resettingSection !== null;

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
    if (resettingSection) return;

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
      const { message } = resolveUserFacingError(error, {
        unexpectedMessage: 'Nao foi possivel salvar o conteudo de locacao.',
        validationMessage: 'Alguns campos de locacao precisam de ajuste antes do salvamento.',
      });
      setNotice({
        tone: 'error',
        message,
      });
    }
  };

  const resetBenefits = () => {
    if (isBusy) return;

    void (async () => {
      setResettingSection('benefits');
      setNotice({ tone: 'info', message: 'Restaurando beneficios...' });
      try {
        const defaults = await resetSection('leasingBenefits');
        setForm((current) => ({ ...current, benefits: [...defaults] }));
        setNotice({ tone: 'success', message: 'Beneficios restaurados para o padrao.' });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel restaurar os beneficios padrao.',
          validationMessage: 'Nao foi possivel restaurar os beneficios no momento.',
        });
        setNotice({
          tone: 'error',
          message,
        });
      } finally {
        setResettingSection(null);
      }
    })();
  };

  const resetSpaces = () => {
    if (isBusy) return;

    void (async () => {
      setResettingSection('spaces');
      setNotice({ tone: 'info', message: 'Restaurando tipos de espaco...' });
      try {
        const defaults = await resetSection('spaceTypes');
        setForm((current) => ({ ...current, spaces: [...defaults] }));
        setNotice({ tone: 'success', message: 'Tipos de espaco restaurados para o padrao.' });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel restaurar os tipos de espaco padrao.',
          validationMessage: 'Nao foi possivel restaurar os tipos de espaco no momento.',
        });
        setNotice({
          tone: 'error',
          message,
        });
      } finally {
        setResettingSection(null);
      }
    })();
  };

  const resetTestimonials = () => {
    if (isBusy) return;

    void (async () => {
      setResettingSection('testimonials');
      setNotice({ tone: 'info', message: 'Restaurando depoimentos...' });
      try {
        const defaults = await resetSection('testimonials');
        setForm((current) => ({ ...current, testimonials: [...defaults] }));
        setNotice({ tone: 'success', message: 'Depoimentos restaurados para o padrao.' });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel restaurar os depoimentos padrao.',
          validationMessage: 'Nao foi possivel restaurar os depoimentos no momento.',
        });
        setNotice({
          tone: 'error',
          message,
        });
      } finally {
        setResettingSection(null);
      }
    })();
  };

  const resetDifferentials = () => {
    if (isBusy) return;

    void (async () => {
      setResettingSection('differentials');
      setNotice({ tone: 'info', message: 'Restaurando diferenciais...' });
      try {
        const defaults = await resetSection('leasingDifferentials');
        setForm((current) => ({ ...current, differentials: [...defaults] }));
        setNotice({ tone: 'success', message: 'Diferenciais restaurados para o padrao.' });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel restaurar os diferenciais padrao.',
          validationMessage: 'Nao foi possivel restaurar os diferenciais no momento.',
        });
        setNotice({
          tone: 'error',
          message,
        });
      } finally {
        setResettingSection(null);
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
        isResetting={resettingSection === 'benefits'}
        isBusy={isBusy}
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
        isResetting={resettingSection === 'spaces'}
        isBusy={isBusy}
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
        isResetting={resettingSection === 'testimonials'}
        isBusy={isBusy}
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
        isResetting={resettingSection === 'differentials'}
        isBusy={isBusy}
      />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton
        onClick={saveAll}
        saved={saved}
        isSaving={isSaving}
        disabled={resettingSection !== null}
      />
    </div>
  );
}
