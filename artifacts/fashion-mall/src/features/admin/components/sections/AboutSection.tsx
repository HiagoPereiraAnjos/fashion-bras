import { useEffect, useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import {
  InlineNotice,
  SaveButton,
  useSaveState,
} from '@/features/admin/components/shared/AdminFormControls';
import {
  DifferentialsCard,
  HistoryCard,
  MissionVisionCard,
  TeamCard,
  ValuesCard,
} from '@/features/admin/components/sections/about/AboutSectionCards';
import {
  buildAboutSectionSaveResult,
  createAboutSectionFormData,
  type AboutSectionFormData,
} from '@/features/admin/components/sections/about/aboutSectionForm';
import { resolveUserFacingError } from '@/services/errors/userFacingError';

type SaveNotice = { tone: 'info' | 'success' | 'error'; message: string } | null;

export default function AboutSection() {
  const { aboutData, setAboutData, resetSection } = useAdminData();
  const [form, setForm] = useState<AboutSectionFormData>(() =>
    createAboutSectionFormData(aboutData),
  );
  const [notice, setNotice] = useState<SaveNotice>(null);
  const [isResetting, setIsResetting] = useState(false);
  const { saved, isSaving, trigger } = useSaveState();
  const isBusy = isSaving || isResetting;

  useEffect(() => {
    setForm(createAboutSectionFormData(aboutData));
    setNotice(null);
  }, [aboutData]);

  const saveAbout = async () => {
    if (isResetting) return;

    const result = buildAboutSectionSaveResult(form);
    if (result.error || !result.payload) {
      setNotice({ tone: 'error', message: result.error ?? 'Falha ao salvar conteudo de Sobre.' });
      return;
    }

    const { removedCount, ...nextAboutData } = result.payload;

    try {
      await trigger(async () => {
        await setAboutData(nextAboutData);
        setForm(createAboutSectionFormData(nextAboutData));
      });

      setNotice({
        tone: 'success',
        message:
          removedCount > 0
            ? `${removedCount} item(ns) vazio(s) foram removidos no salvamento.`
            : 'Conteudo de Sobre atualizado com sucesso.',
      });
    } catch (error) {
      const { message } = resolveUserFacingError(error, {
        unexpectedMessage: 'Nao foi possivel salvar o conteudo de Sobre.',
        validationMessage: 'Alguns campos de Sobre precisam de ajuste antes do salvamento.',
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
      setNotice({ tone: 'info', message: 'Restaurando conteudo da pagina Sobre...' });
      try {
        const defaults = await resetSection('aboutData');
        setForm(createAboutSectionFormData(defaults));
        setNotice({ tone: 'success', message: 'Conteudo de Sobre restaurado para o padrao.' });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel restaurar o conteudo padrao de Sobre.',
          validationMessage: 'Nao foi possivel restaurar o conteudo de Sobre no momento.',
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
      <MissionVisionCard
        mission={form.mission}
        vision={form.vision}
        setMission={(value) => setForm((current) => ({ ...current, mission: value }))}
        setVision={(value) => setForm((current) => ({ ...current, vision: value }))}
        onReset={handleReset}
        isResetting={isResetting}
        isBusy={isBusy}
      />

      <HistoryCard
        history={form.history}
        isBusy={isBusy}
        setHistory={(updater) =>
          setForm((current) => ({
            ...current,
            history: typeof updater === 'function' ? updater(current.history) : updater,
          }))
        }
      />

      <ValuesCard
        values={form.values}
        isBusy={isBusy}
        setValues={(updater) =>
          setForm((current) => ({
            ...current,
            values: typeof updater === 'function' ? updater(current.values) : updater,
          }))
        }
      />

      <DifferentialsCard
        differentials={form.differentials}
        isBusy={isBusy}
        setDifferentials={(updater) =>
          setForm((current) => ({
            ...current,
            differentials:
              typeof updater === 'function' ? updater(current.differentials) : updater,
          }))
        }
      />

      <TeamCard
        team={form.team}
        isBusy={isBusy}
        setTeam={(updater) =>
          setForm((current) => ({
            ...current,
            team: typeof updater === 'function' ? updater(current.team) : updater,
          }))
        }
      />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={saveAbout} saved={saved} isSaving={isSaving} disabled={isResetting} />
    </div>
  );
}
