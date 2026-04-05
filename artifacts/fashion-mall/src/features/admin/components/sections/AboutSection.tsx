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

type SaveNotice = { tone: 'success' | 'error'; message: string } | null;

export default function AboutSection() {
  const { aboutData, setAboutData, resetSection } = useAdminData();
  const [form, setForm] = useState<AboutSectionFormData>(() =>
    createAboutSectionFormData(aboutData),
  );
  const [notice, setNotice] = useState<SaveNotice>(null);
  const { saved, isSaving, trigger } = useSaveState();

  useEffect(() => {
    setForm(createAboutSectionFormData(aboutData));
    setNotice(null);
  }, [aboutData]);

  const saveAbout = async () => {
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
      setNotice({
        tone: 'error',
        message:
          error instanceof Error ? error.message : 'Nao foi possivel salvar o conteudo de Sobre.',
      });
    }
  };

  const handleReset = () => {
    void (async () => {
      try {
        const defaults = await resetSection('aboutData');
        setForm(createAboutSectionFormData(defaults));
        setNotice(null);
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Nao foi possivel restaurar o conteudo padrao de Sobre.',
        });
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
      />

      <HistoryCard
        history={form.history}
        setHistory={(updater) =>
          setForm((current) => ({
            ...current,
            history: typeof updater === 'function' ? updater(current.history) : updater,
          }))
        }
      />

      <ValuesCard
        values={form.values}
        setValues={(updater) =>
          setForm((current) => ({
            ...current,
            values: typeof updater === 'function' ? updater(current.values) : updater,
          }))
        }
      />

      <DifferentialsCard
        differentials={form.differentials}
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
        setTeam={(updater) =>
          setForm((current) => ({
            ...current,
            team: typeof updater === 'function' ? updater(current.team) : updater,
          }))
        }
      />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={saveAbout} saved={saved} isSaving={isSaving} />
    </div>
  );
}
