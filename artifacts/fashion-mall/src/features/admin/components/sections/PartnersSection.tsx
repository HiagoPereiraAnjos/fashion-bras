import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import {
  EmptyAdminState,
  Input,
  InlineNotice,
  SaveButton,
  SectionCard,
  useSaveState,
} from '@/features/admin/components/shared/AdminFormControls';
import { isRequired, normalizeText } from '@/utils/validation';

type SaveNotice = { tone: 'success' | 'error'; message: string } | null;

export default function PartnersSection() {
  const { partners, setPartners, resetSection } = useAdminData();
  const { saved, isSaving, trigger } = useSaveState();
  const [local, setLocal] = useState([...partners]);
  const [notice, setNotice] = useState<SaveNotice>(null);

  useEffect(() => {
    setLocal([...partners]);
    setNotice(null);
  }, [partners]);

  const update = (index: number, name: string) =>
    setLocal((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, name } : item)),
    );

  const remove = (index: number) =>
    setLocal((current) => current.filter((_, itemIndex) => itemIndex !== index));

  const add = () =>
    setLocal((current) => [...current, { id: String(Date.now()), name: 'Nova Marca' }]);

  const handleSave = async () => {
    const normalized = local
      .map((partner) => ({
        id: partner.id || String(Date.now() + Math.random()),
        name: normalizeText(partner.name),
      }))
      .filter((partner) => isRequired(partner.name));

    if (normalized.length === 0) {
      setNotice({
        tone: 'error',
        message: 'Adicione ao menos um parceiro com nome valido antes de salvar.',
      });
      return;
    }

    const removedCount = local.length - normalized.length;

    try {
      await trigger(async () => {
        await setPartners(normalized);
        setLocal(normalized);
      });

      setNotice({
        tone: 'success',
        message:
          removedCount > 0
            ? `${removedCount} item(ns) vazio(s) foram removidos no salvamento.`
            : 'Parceiros atualizados com sucesso.',
      });
    } catch (error) {
      setNotice({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Nao foi possivel salvar os parceiros neste momento.',
      });
    }
  };

  const handleReset = () => {
    void (async () => {
      try {
        const defaults = await resetSection('partners');
        setLocal([...defaults]);
        setNotice(null);
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Nao foi possivel restaurar os parceiros padrao.',
        });
      }
    })();
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Marcas e Parceiros" onReset={handleReset}>
        {local.length === 0 ? (
          <EmptyAdminState
            title="Sem parceiros cadastrados"
            description="Inclua marcas parceiras para preencher a vitrine institucional da home."
            action={
              <button
                onClick={add}
                className="text-xs text-amber-700 hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                Adicionar parceiro
              </button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {local.map((partner, index) => (
                <div key={partner.id} className="flex gap-2">
                  <Input
                    value={partner.name}
                    onChange={(value) => update(index, value)}
                    placeholder="Nome da marca"
                  />
                  <button
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-600 px-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={add}
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              Adicionar parceiro
            </button>
          </>
        )}
      </SectionCard>
      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={handleSave} saved={saved} isSaving={isSaving} />
    </div>
  );
}
