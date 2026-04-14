import type { Dispatch, SetStateAction } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  EmptyAdminState,
  Field,
  Input,
  SectionCard,
  Textarea,
} from '@/features/admin/components/shared/AdminFormControls';
import type { AboutTeamMember, AboutValue } from '@/types';

interface MissionVisionCardProps {
  mission: string;
  vision: string;
  setMission: (value: string) => void;
  setVision: (value: string) => void;
  onReset: () => void;
  isResetting?: boolean;
  isBusy?: boolean;
}

export function MissionVisionCard({
  mission,
  vision,
  setMission,
  setVision,
  onReset,
  isResetting = false,
  isBusy = false,
}: MissionVisionCardProps) {
  return (
    <SectionCard title="Missão e Visão" onReset={onReset} isResetting={isResetting}>
      <div className="space-y-4">
        <Field label="Missão">
          <Textarea value={mission} onChange={setMission} rows={2} disabled={isBusy} />
        </Field>
        <Field label="Visão">
          <Textarea value={vision} onChange={setVision} rows={2} disabled={isBusy} />
        </Field>
      </div>
    </SectionCard>
  );
}

interface HistoryCardProps {
  history: string[];
  isBusy?: boolean;
  setHistory: Dispatch<SetStateAction<string[]>>;
}

export function HistoryCard({ history, isBusy = false, setHistory }: HistoryCardProps) {
  return (
    <SectionCard title="História (parágrafos)">
      {history.length === 0 ? (
        <EmptyAdminState
          title="Sem história cadastrada"
          description="Adicione parágrafos para preencher a seção institucional."
          action={(
            <button
              type="button"
              onClick={() => setHistory((current) => [...current, ''])}
              disabled={isBusy}
              className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
            >
              <Plus size={12} />
              Adicionar parágrafo
            </button>
          )}
        />
      ) : (
        <div className="space-y-3">
          {history.map((paragraph, index) => (
            <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="flex-1">
                <Textarea
                  value={paragraph}
                  onChange={(value) =>
                    setHistory((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
                    )
                  }
                  rows={3}
                  disabled={isBusy}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setHistory((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
                aria-label={`Remover paragrafo ${index + 1}`}
                disabled={isBusy}
                className="w-full sm:w-auto h-10 sm:h-auto text-red-400 hover:text-red-600 px-2 border border-red-100 hover:bg-red-50 sm:border-none sm:bg-transparent inline-flex items-center justify-center"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setHistory((current) => [...current, ''])}
            disabled={isBusy}
            className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
          >
            <Plus size={12} />
            Adicionar parágrafo
          </button>
        </div>
      )}
    </SectionCard>
  );
}

interface ValuesCardProps {
  values: AboutValue[];
  isBusy?: boolean;
  setValues: Dispatch<SetStateAction<AboutValue[]>>;
}

export function ValuesCard({ values, isBusy = false, setValues }: ValuesCardProps) {
  return (
    <SectionCard title="Valores">
      {values.length === 0 ? (
        <EmptyAdminState
          title="Sem valores cadastrados"
          description="Inclua os valores institucionais para reforçar o posicionamento da marca."
          action={(
            <button
              type="button"
              onClick={() =>
                setValues((current) => [...current, { title: '', description: '' }])
              }
              disabled={isBusy}
              className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
            >
              <Plus size={12} />
              Adicionar valor
            </button>
          )}
        />
      ) : (
        <div className="space-y-3">
          {values.map((value, index) => (
            <div key={index} className="border border-stone-100 p-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Título">
                  <Input
                    value={value.title}
                    onChange={(nextValue) =>
                      setValues((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, title: nextValue } : item,
                        ),
                      )
                    }
                    disabled={isBusy}
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Descrição">
                    <Input
                      value={value.description}
                      onChange={(nextValue) =>
                        setValues((current) =>
                          current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, description: nextValue } : item,
                        ),
                      )
                    }
                    disabled={isBusy}
                    />
                  </Field>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setValues((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
                disabled={isBusy}
                className="w-full sm:w-auto h-10 sm:h-auto px-3 sm:px-0 text-xs text-red-400 hover:text-red-600 inline-flex items-center justify-center sm:justify-start gap-1 border border-red-100 hover:bg-red-50 sm:border-none sm:bg-transparent"
              >
                <Trash2 size={11} />
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setValues((current) => [...current, { title: '', description: '' }])
            }
            disabled={isBusy}
            className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
          >
            <Plus size={12} />
            Adicionar valor
          </button>
        </div>
      )}
    </SectionCard>
  );
}

interface DifferentialsCardProps {
  differentials: string[];
  isBusy?: boolean;
  setDifferentials: Dispatch<SetStateAction<string[]>>;
}

export function DifferentialsCard({
  differentials,
  isBusy = false,
  setDifferentials,
}: DifferentialsCardProps) {
  return (
    <SectionCard title="Diferenciais">
      {differentials.length === 0 ? (
        <EmptyAdminState
          title="Sem diferenciais cadastrados"
          description="Adicione argumentos de valor para a página Sobre."
          action={(
            <button
              type="button"
              onClick={() => setDifferentials((current) => [...current, ''])}
              disabled={isBusy}
              className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
            >
              <Plus size={12} />
              Adicionar
            </button>
          )}
        />
      ) : (
        <>
          <div className="space-y-2 mb-3">
            {differentials.map((differential, index) => (
              <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <Input
                    value={differential}
                    onChange={(value) =>
                      setDifferentials((current) =>
                        current.map((item, itemIndex) => (itemIndex === index ? value : item)),
                      )
                    }
                    disabled={isBusy}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDifferentials((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  aria-label={`Remover diferencial ${index + 1}`}
                  disabled={isBusy}
                  className="w-full sm:w-auto h-10 sm:h-auto text-red-400 hover:text-red-600 px-2 border border-red-100 hover:bg-red-50 sm:border-none sm:bg-transparent inline-flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDifferentials((current) => [...current, ''])}
            disabled={isBusy}
            className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
          >
            <Plus size={12} />
            Adicionar
          </button>
        </>
      )}
    </SectionCard>
  );
}

interface TeamCardProps {
  team: AboutTeamMember[];
  isBusy?: boolean;
  setTeam: Dispatch<SetStateAction<AboutTeamMember[]>>;
}

export function TeamCard({ team, isBusy = false, setTeam }: TeamCardProps) {
  return (
    <SectionCard title="Equipe">
      {team.length === 0 ? (
        <EmptyAdminState
          title="Sem equipe cadastrada"
          description="Adicione membros para preencher a seção de equipe da página Sobre."
          action={(
            <button
              type="button"
              onClick={() =>
                setTeam((current) => [...current, { name: '', role: '', description: '' }])
              }
              disabled={isBusy}
              className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
            >
              <Plus size={12} />
              Adicionar membro
            </button>
          )}
        />
      ) : (
        <div className="space-y-4">
          {team.map((member, index) => (
            <div key={index} className="border border-stone-100 p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Nome">
                  <Input
                    value={member.name}
                    onChange={(value) =>
                      setTeam((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: value } : item,
                        ),
                      )
                    }
                    disabled={isBusy}
                  />
                </Field>
                <Field label="Cargo">
                  <Input
                    value={member.role}
                    onChange={(value) =>
                      setTeam((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, role: value } : item,
                        ),
                      )
                    }
                    disabled={isBusy}
                  />
                </Field>
              </div>
              <Field label="Descrição">
                <Textarea
                  value={member.description}
                  onChange={(value) =>
                    setTeam((current) =>
                      current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, description: value } : item,
                        ),
                      )
                    }
                  rows={2}
                  disabled={isBusy}
                />
              </Field>
              <button
                type="button"
                onClick={() =>
                  setTeam((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
                disabled={isBusy}
                className="w-full sm:w-auto h-10 sm:h-auto px-3 sm:px-0 text-xs text-red-400 hover:text-red-600 inline-flex items-center justify-center sm:justify-start gap-1 border border-red-100 hover:bg-red-50 sm:border-none sm:bg-transparent"
              >
                <Trash2 size={11} />
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setTeam((current) => [...current, { name: '', role: '', description: '' }])
            }
            disabled={isBusy}
            className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
          >
            <Plus size={12} />
            Adicionar membro
          </button>
        </div>
      )}
    </SectionCard>
  );
}
