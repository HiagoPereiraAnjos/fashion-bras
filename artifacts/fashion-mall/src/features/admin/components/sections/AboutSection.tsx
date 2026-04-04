import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import {
  EmptyAdminState,
  Field,
  Input,
  InlineNotice,
  SaveButton,
  SectionCard,
  Textarea,
  useSaveState,
} from '@/features/admin/components/shared/AdminFormControls';
import { hasMinLength, isRequired, normalizeText } from '@/utils/validation';

type SaveNotice = { tone: 'success' | 'error'; message: string } | null;

export default function AboutSection() {
  const { aboutData, setAboutData, resetSection } = useAdminData();
  const [local, setLocal] = useState({
    ...aboutData,
    history: [...aboutData.history],
    values: [...aboutData.values],
    differentials: [...aboutData.differentials],
    team: [...aboutData.team],
  });
  const [notice, setNotice] = useState<SaveNotice>(null);
  const { saved, trigger } = useSaveState();

  const saveAbout = () => {
    const normalizedMission = normalizeText(local.mission);
    const normalizedVision = normalizeText(local.vision);
    const normalizedHistory = local.history.map((item) => normalizeText(item));
    const normalizedDifferentials = local.differentials.map((item) => normalizeText(item));
    const normalizedValues = local.values.map((item) => ({
      title: normalizeText(item.title),
      description: normalizeText(item.description),
    }));
    const normalizedTeam = local.team.map((item) => ({
      name: normalizeText(item.name),
      role: normalizeText(item.role),
      description: normalizeText(item.description),
    }));

    const hasIncompleteValue = normalizedValues.some(
      (value) =>
        [value.title, value.description].some(isRequired) &&
        ![value.title, value.description].every(isRequired),
    );
    const hasIncompleteTeam = normalizedTeam.some(
      (member) =>
        [member.name, member.role, member.description].some(isRequired) &&
        ![member.name, member.role, member.description].every(isRequired),
    );

    const validHistory = normalizedHistory.filter(isRequired);
    const validDifferentials = normalizedDifferentials.filter(isRequired);
    const validValues = normalizedValues.filter((value) =>
      [value.title, value.description].every(isRequired),
    );
    const validTeam = normalizedTeam.filter((member) =>
      [member.name, member.role, member.description].every(isRequired),
    );

    const errors: string[] = [];

    if (!isRequired(normalizedMission) || !hasMinLength(normalizedMission, 20)) {
      errors.push('Missão deve ter pelo menos 20 caracteres.');
    }
    if (!isRequired(normalizedVision) || !hasMinLength(normalizedVision, 20)) {
      errors.push('Visão deve ter pelo menos 20 caracteres.');
    }
    if (hasIncompleteValue) {
      errors.push('Complete ou remova valores incompletos.');
    }
    if (hasIncompleteTeam) {
      errors.push('Complete ou remova membros de equipe incompletos.');
    }
    if (validHistory.length === 0) {
      errors.push('Adicione ao menos um parágrafo de história.');
    }
    if (validValues.length === 0) {
      errors.push('Adicione ao menos um valor institucional.');
    }
    if (validDifferentials.length === 0) {
      errors.push('Adicione ao menos um diferencial.');
    }
    if (validTeam.length === 0) {
      errors.push('Adicione ao menos um membro da equipe.');
    }

    if (errors.length > 0) {
      setNotice({ tone: 'error', message: errors[0] });
      return;
    }

    const removedCount =
      normalizedHistory.length - validHistory.length +
      normalizedValues.length - validValues.length +
      normalizedDifferentials.length - validDifferentials.length +
      normalizedTeam.length - validTeam.length;

    const nextAboutData = {
      mission: normalizedMission,
      vision: normalizedVision,
      history: validHistory,
      values: validValues,
      differentials: validDifferentials,
      team: validTeam,
    };

    trigger(() => {
      setAboutData(nextAboutData);
      setLocal(nextAboutData);
    });

    setNotice({
      tone: 'success',
      message:
        removedCount > 0
          ? `${removedCount} item(ns) vazio(s) foram removidos no salvamento.`
          : 'Conteúdo de Sobre atualizado com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Missão e Visão"
        onReset={() => {
          const defaults = resetSection('aboutData');
          setLocal({
            ...defaults,
            history: [...defaults.history],
            values: [...defaults.values],
            differentials: [...defaults.differentials],
            team: [...defaults.team],
          });
          setNotice(null);
        }}
      >
        <div className="space-y-4">
          <Field label="Missão">
            <Textarea
              value={local.mission}
              onChange={(value) => setLocal((current) => ({ ...current, mission: value }))}
              rows={2}
            />
          </Field>
          <Field label="Visão">
            <Textarea
              value={local.vision}
              onChange={(value) => setLocal((current) => ({ ...current, vision: value }))}
              rows={2}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="História (parágrafos)">
        {local.history.length === 0 ? (
          <EmptyAdminState
            title="Sem história cadastrada"
            description="Adicione parágrafos para preencher a seção institucional."
            action={(
              <button
                onClick={() =>
                  setLocal((current) => ({ ...current, history: [...current.history, ''] }))
                }
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                Adicionar parágrafo
              </button>
            )}
          />
        ) : (
          <div className="space-y-3">
            {local.history.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={paragraph}
                  onChange={(value) =>
                    setLocal((current) => ({
                      ...current,
                      history: current.history.map((item, itemIndex) =>
                        itemIndex === index ? value : item,
                      ),
                    }))
                  }
                  rows={3}
                />
                <button
                  onClick={() =>
                    setLocal((current) => ({
                      ...current,
                      history: current.history.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                  className="text-red-400 hover:text-red-600 px-2 self-start mt-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setLocal((current) => ({ ...current, history: [...current.history, ''] }))
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar parágrafo
            </button>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Valores">
        {local.values.length === 0 ? (
          <EmptyAdminState
            title="Sem valores cadastrados"
            description="Inclua os valores institucionais para reforçar o posicionamento da marca."
            action={(
              <button
                onClick={() =>
                  setLocal((current) => ({
                    ...current,
                    values: [...current.values, { title: '', description: '' }],
                  }))
                }
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                Adicionar valor
              </button>
            )}
          />
        ) : (
          <div className="space-y-3">
            {local.values.map((value, index) => (
              <div key={index} className="border border-stone-100 p-3 space-y-2">
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Título">
                    <Input
                      value={value.title}
                      onChange={(nextValue) =>
                        setLocal((current) => ({
                          ...current,
                          values: current.values.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, title: nextValue } : item,
                          ),
                        }))
                      }
                    />
                  </Field>
                  <div className="col-span-2">
                    <Field label="Descrição">
                      <Input
                        value={value.description}
                        onChange={(nextValue) =>
                          setLocal((current) => ({
                            ...current,
                            values: current.values.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, description: nextValue } : item,
                            ),
                          }))
                        }
                      />
                    </Field>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setLocal((current) => ({
                      ...current,
                      values: current.values.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                  className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={11} />
                  Remover
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setLocal((current) => ({
                  ...current,
                  values: [...current.values, { title: '', description: '' }],
                }))
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar valor
            </button>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Diferenciais">
        {local.differentials.length === 0 ? (
          <EmptyAdminState
            title="Sem diferenciais cadastrados"
            description="Adicione argumentos de valor para a página Sobre."
            action={(
              <button
                onClick={() =>
                  setLocal((current) => ({
                    ...current,
                    differentials: [...current.differentials, ''],
                  }))
                }
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                Adicionar
              </button>
            )}
          />
        ) : (
          <>
            <div className="space-y-2 mb-3">
              {local.differentials.map((differential, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={differential}
                    onChange={(value) =>
                      setLocal((current) => ({
                        ...current,
                        differentials: current.differentials.map((item, itemIndex) =>
                          itemIndex === index ? value : item,
                        ),
                      }))
                    }
                  />
                  <button
                    onClick={() =>
                      setLocal((current) => ({
                        ...current,
                        differentials: current.differentials.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                    className="text-red-400 hover:text-red-600 px-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setLocal((current) => ({
                  ...current,
                  differentials: [...current.differentials, ''],
                }))
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar
            </button>
          </>
        )}
      </SectionCard>

      <SectionCard title="Equipe">
        {local.team.length === 0 ? (
          <EmptyAdminState
            title="Sem equipe cadastrada"
            description="Adicione membros para preencher a seção de equipe da página Sobre."
            action={(
              <button
                onClick={() =>
                  setLocal((current) => ({
                    ...current,
                    team: [...current.team, { name: '', role: '', description: '' }],
                  }))
                }
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                Adicionar membro
              </button>
            )}
          />
        ) : (
          <div className="space-y-4">
            {local.team.map((member, index) => (
              <div key={index} className="border border-stone-100 p-4 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nome">
                    <Input
                      value={member.name}
                      onChange={(value) =>
                        setLocal((current) => ({
                          ...current,
                          team: current.team.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, name: value } : item,
                          ),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Cargo">
                    <Input
                      value={member.role}
                      onChange={(value) =>
                        setLocal((current) => ({
                          ...current,
                          team: current.team.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, role: value } : item,
                          ),
                        }))
                      }
                    />
                  </Field>
                </div>
                <Field label="Descrição">
                  <Textarea
                    value={member.description}
                    onChange={(value) =>
                      setLocal((current) => ({
                        ...current,
                        team: current.team.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, description: value } : item,
                        ),
                      }))
                    }
                    rows={2}
                  />
                </Field>
                <button
                  onClick={() =>
                    setLocal((current) => ({
                      ...current,
                      team: current.team.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                  className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={11} />
                  Remover
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setLocal((current) => ({
                  ...current,
                  team: [...current.team, { name: '', role: '', description: '' }],
                }))
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar membro
            </button>
          </div>
        )}
      </SectionCard>

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={saveAbout} saved={saved} />
    </div>
  );
}
