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
import { isRequired, normalizeText } from '@/utils/validation';

type SaveNotice = { tone: 'success' | 'error'; message: string } | null;

export default function LeasingTab() {
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
  const [localDiffs, setLocalDiffs] = useState([...leasingDifferentials]);
  const [localSpaces, setLocalSpaces] = useState([...spaceTypes]);
  const [localTestimonials, setLocalTestimonials] = useState([...testimonials]);
  const [localBenefits, setLocalBenefits] = useState([...leasingBenefits]);
  const [notice, setNotice] = useState<SaveNotice>(null);
  const { saved, trigger } = useSaveState();

  const saveAll = () => {
    const normalizedBenefits = localBenefits.map((benefit) => ({
      icon: normalizeText(benefit.icon),
      title: normalizeText(benefit.title),
      description: normalizeText(benefit.description),
    }));
    const normalizedSpaces = localSpaces.map((space) => ({
      name: normalizeText(space.name),
      size: normalizeText(space.size),
      description: normalizeText(space.description),
    }));
    const normalizedTestimonials = localTestimonials.map((testimonial) => ({
      name: normalizeText(testimonial.name),
      store: normalizeText(testimonial.store),
      text: normalizeText(testimonial.text),
    }));
    const normalizedDiffs = localDiffs.map((item) => normalizeText(item));

    const hasIncompleteBenefit = normalizedBenefits.some(
      (benefit) =>
        [benefit.icon, benefit.title, benefit.description].some(isRequired) &&
        ![benefit.icon, benefit.title, benefit.description].every(isRequired),
    );
    const hasIncompleteSpace = normalizedSpaces.some(
      (space) =>
        [space.name, space.size, space.description].some(isRequired) &&
        ![space.name, space.size, space.description].every(isRequired),
    );
    const hasIncompleteTestimonial = normalizedTestimonials.some(
      (testimonial) =>
        [testimonial.name, testimonial.store, testimonial.text].some(isRequired) &&
        ![testimonial.name, testimonial.store, testimonial.text].every(isRequired),
    );

    const validBenefits = normalizedBenefits.filter(
      (benefit) =>
        [benefit.icon, benefit.title, benefit.description].every(isRequired),
    );
    const validSpaces = normalizedSpaces.filter(
      (space) => [space.name, space.size, space.description].every(isRequired),
    );
    const validTestimonials = normalizedTestimonials.filter(
      (testimonial) =>
        [testimonial.name, testimonial.store, testimonial.text].every(isRequired),
    );
    const validDiffs = normalizedDiffs.filter(isRequired);

    const errors: string[] = [];

    if (hasIncompleteBenefit) {
      errors.push('Complete ou remova benefícios incompletos.');
    }
    if (hasIncompleteSpace) {
      errors.push('Complete ou remova tipos de espaço incompletos.');
    }
    if (hasIncompleteTestimonial) {
      errors.push('Complete ou remova depoimentos incompletos.');
    }
    if (validBenefits.length === 0) {
      errors.push('Adicione pelo menos um benefício válido.');
    }
    if (validSpaces.length === 0) {
      errors.push('Adicione pelo menos um tipo de espaço válido.');
    }
    if (validTestimonials.length === 0) {
      errors.push('Adicione pelo menos um depoimento válido.');
    }
    if (validDiffs.length === 0) {
      errors.push('Adicione pelo menos um diferencial válido.');
    }

    if (errors.length > 0) {
      setNotice({ tone: 'error', message: errors[0] });
      return;
    }

    const removedCount =
      normalizedBenefits.length - validBenefits.length +
      normalizedSpaces.length - validSpaces.length +
      normalizedTestimonials.length - validTestimonials.length +
      normalizedDiffs.length - validDiffs.length;

    trigger(() => {
      setLeasingBenefits(validBenefits);
      setSpaceTypes(validSpaces);
      setTestimonials(validTestimonials);
      setLeasingDifferentials(validDiffs);

      setLocalBenefits(validBenefits);
      setLocalSpaces(validSpaces);
      setLocalTestimonials(validTestimonials);
      setLocalDiffs(validDiffs);
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
      <SectionCard
        title="Benefícios (ícones: MapPin, Users, Shield, Zap, TrendingUp, Star)"
        onReset={() => {
          const defaults = resetSection('leasingBenefits');
          setLocalBenefits([...defaults]);
          setNotice(null);
        }}
      >
        {localBenefits.length === 0 ? (
          <EmptyAdminState
            title="Nenhum benefício cadastrado"
            description="Inclua benefícios para fortalecer a seção institucional de locação."
            action={(
              <button
                onClick={() =>
                  setLocalBenefits((current) => [
                    ...current,
                    { icon: 'Star', title: '', description: '' },
                  ])
                }
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                Adicionar benefício
              </button>
            )}
          />
        ) : (
          <div className="space-y-4">
            {localBenefits.map((benefit, index) => (
              <div key={index} className="border border-stone-100 p-4 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ícone">
                    <Input
                      value={benefit.icon}
                      onChange={(value) =>
                        setLocalBenefits((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, icon: value } : item,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Título">
                    <Input
                      value={benefit.title}
                      onChange={(value) =>
                        setLocalBenefits((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, title: value } : item,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Descrição">
                  <Textarea
                    value={benefit.description}
                    onChange={(value) =>
                      setLocalBenefits((current) =>
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
                    setLocalBenefits((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
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
                setLocalBenefits((current) => [
                  ...current,
                  { icon: 'Star', title: '', description: '' },
                ])
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar benefício
            </button>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Tipos de Espaço"
        onReset={() => {
          const defaults = resetSection('spaceTypes');
          setLocalSpaces([...defaults]);
          setNotice(null);
        }}
      >
        {localSpaces.length === 0 ? (
          <EmptyAdminState
            title="Nenhum tipo de espaço cadastrado"
            description="Adicione opções para que o formulário de locação tenha itens selecionáveis."
            action={(
              <button
                onClick={() =>
                  setLocalSpaces((current) => [...current, { name: '', size: '', description: '' }])
                }
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                Adicionar espaço
              </button>
            )}
          />
        ) : (
          <div className="space-y-4">
            {localSpaces.map((space, index) => (
              <div key={index} className="border border-stone-100 p-4 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nome">
                    <Input
                      value={space.name}
                      onChange={(value) =>
                        setLocalSpaces((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, name: value } : item,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Tamanho">
                    <Input
                      value={space.size}
                      onChange={(value) =>
                        setLocalSpaces((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, size: value } : item,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Descrição">
                  <Textarea
                    value={space.description}
                    onChange={(value) =>
                      setLocalSpaces((current) =>
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
                    setLocalSpaces((current) => current.filter((_, itemIndex) => itemIndex !== index))
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
                setLocalSpaces((current) => [...current, { name: '', size: '', description: '' }])
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar espaço
            </button>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Depoimentos de Lojistas"
        onReset={() => {
          const defaults = resetSection('testimonials');
          setLocalTestimonials([...defaults]);
          setNotice(null);
        }}
      >
        {localTestimonials.length === 0 ? (
          <EmptyAdminState
            title="Sem depoimentos cadastrados"
            description="Inclua depoimentos para dar mais confiança à seção comercial."
            action={(
              <button
                onClick={() =>
                  setLocalTestimonials((current) => [
                    ...current,
                    { name: '', store: '', text: '' },
                  ])
                }
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                Adicionar depoimento
              </button>
            )}
          />
        ) : (
          <div className="space-y-4">
            {localTestimonials.map((testimonial, index) => (
              <div key={index} className="border border-stone-100 p-4 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nome">
                    <Input
                      value={testimonial.name}
                      onChange={(value) =>
                        setLocalTestimonials((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, name: value } : item,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Loja">
                    <Input
                      value={testimonial.store}
                      onChange={(value) =>
                        setLocalTestimonials((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, store: value } : item,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Depoimento">
                  <Textarea
                    value={testimonial.text}
                    onChange={(value) =>
                      setLocalTestimonials((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, text: value } : item,
                        ),
                      )
                    }
                    rows={3}
                  />
                </Field>
                <button
                  onClick={() =>
                    setLocalTestimonials((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
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
                setLocalTestimonials((current) => [
                  ...current,
                  { name: '', store: '', text: '' },
                ])
              }
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar depoimento
            </button>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Diferenciais (lista)"
        onReset={() => {
          const defaults = resetSection('leasingDifferentials');
          setLocalDiffs([...defaults]);
          setNotice(null);
        }}
      >
        {localDiffs.length === 0 ? (
          <EmptyAdminState
            title="Sem diferenciais cadastrados"
            description="Adicione os principais argumentos comerciais para locação."
            action={(
              <button
                onClick={() => setLocalDiffs((current) => [...current, ''])}
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                Adicionar diferencial
              </button>
            )}
          />
        ) : (
          <>
            <div className="space-y-2 mb-3">
              {localDiffs.map((differential, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={differential}
                    onChange={(value) =>
                      setLocalDiffs((current) =>
                        current.map((item, itemIndex) => (itemIndex === index ? value : item)),
                      )
                    }
                  />
                  <button
                    onClick={() =>
                      setLocalDiffs((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                    className="text-red-400 hover:text-red-600 px-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setLocalDiffs((current) => [...current, ''])}
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar diferencial
            </button>
          </>
        )}
      </SectionCard>

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={saveAll} saved={saved} />
    </div>
  );
}
