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
}

export function MissionVisionCard({
  mission,
  vision,
  setMission,
  setVision,
  onReset,
}: MissionVisionCardProps) {
  return (
    <SectionCard title="Missão e Visão" onReset={onReset}>
      <div className="space-y-4">
        <Field label="Missão">
          <Textarea value={mission} onChange={setMission} rows={2} />
        </Field>
        <Field label="Visão">
          <Textarea value={vision} onChange={setVision} rows={2} />
        </Field>
      </div>
    </SectionCard>
  );
}

interface HistoryCardProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
}

export function HistoryCard({ history, setHistory }: HistoryCardProps) {
  return (
    <SectionCard title="História (parágrafos)">
      {history.length === 0 ? (
        <EmptyAdminState
          title="Sem história cadastrada"
          description="Adicione parágrafos para preencher a seção institucional."
          action={(
            <button
              onClick={() => setHistory((current) => [...current, ''])}
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar parágrafo
            </button>
          )}
        />
      ) : (
        <div className="space-y-3">
          {history.map((paragraph, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={paragraph}
                onChange={(value) =>
                  setHistory((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? value : item)),
                  )
                }
                rows={3}
              />
              <button
                onClick={() =>
                  setHistory((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
                className="text-red-400 hover:text-red-600 px-2 self-start mt-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setHistory((current) => [...current, ''])}
            className="text-xs text-amber-700 hover:underline flex items-center gap-1"
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
  setValues: Dispatch<SetStateAction<AboutValue[]>>;
}

export function ValuesCard({ values, setValues }: ValuesCardProps) {
  return (
    <SectionCard title="Valores">
      {values.length === 0 ? (
        <EmptyAdminState
          title="Sem valores cadastrados"
          description="Inclua os valores institucionais para reforçar o posicionamento da marca."
          action={(
            <button
              onClick={() =>
                setValues((current) => [...current, { title: '', description: '' }])
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
          {values.map((value, index) => (
            <div key={index} className="border border-stone-100 p-3 space-y-2">
              <div className="grid grid-cols-3 gap-3">
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
                  />
                </Field>
                <div className="col-span-2">
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
                    />
                  </Field>
                </div>
              </div>
              <button
                onClick={() =>
                  setValues((current) => current.filter((_, itemIndex) => itemIndex !== index))
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
              setValues((current) => [...current, { title: '', description: '' }])
            }
            className="text-xs text-amber-700 hover:underline flex items-center gap-1"
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
  setDifferentials: Dispatch<SetStateAction<string[]>>;
}

export function DifferentialsCard({
  differentials,
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
              onClick={() => setDifferentials((current) => [...current, ''])}
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
            {differentials.map((differential, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={differential}
                  onChange={(value) =>
                    setDifferentials((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
                    )
                  }
                />
                <button
                  onClick={() =>
                    setDifferentials((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  className="text-red-400 hover:text-red-600 px-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setDifferentials((current) => [...current, ''])}
            className="text-xs text-amber-700 hover:underline flex items-center gap-1"
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
  setTeam: Dispatch<SetStateAction<AboutTeamMember[]>>;
}

export function TeamCard({ team, setTeam }: TeamCardProps) {
  return (
    <SectionCard title="Equipe">
      {team.length === 0 ? (
        <EmptyAdminState
          title="Sem equipe cadastrada"
          description="Adicione membros para preencher a seção de equipe da página Sobre."
          action={(
            <button
              onClick={() =>
                setTeam((current) => [...current, { name: '', role: '', description: '' }])
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
          {team.map((member, index) => (
            <div key={index} className="border border-stone-100 p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3">
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
                />
              </Field>
              <button
                onClick={() =>
                  setTeam((current) => current.filter((_, itemIndex) => itemIndex !== index))
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
              setTeam((current) => [...current, { name: '', role: '', description: '' }])
            }
            className="text-xs text-amber-700 hover:underline flex items-center gap-1"
          >
            <Plus size={12} />
            Adicionar membro
          </button>
        </div>
      )}
    </SectionCard>
  );
}
