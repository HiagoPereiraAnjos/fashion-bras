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
import { resolveUserFacingError } from '@/services/errors/userFacingError';
import { isRequired, normalizeText } from '@/utils/validation';

type SaveNotice = { tone: 'info' | 'success' | 'error'; message: string } | null;

export default function PartnersSection() {
  const { partners, setPartners, resetSection } = useAdminData();
  const { saved, isSaving, trigger } = useSaveState();
  const [local, setLocal] = useState([...partners]);
  const [notice, setNotice] = useState<SaveNotice>(null);
  const [isResetting, setIsResetting] = useState(false);
  const hasPendingAction = isSaving || isResetting;

  useEffect(() => {
    setLocal([...partners]);
    setNotice(null);
  }, [partners]);

  const update = (index: number, name: string) =>
    setLocal((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, name } : item)),
    );

  const remove = (index: number) => {
    if (hasPendingAction) return;
    setLocal((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const add = () => {
    if (hasPendingAction) return;
    setLocal((current) => [...current, { id: String(Date.now()), name: 'Nova Marca' }]);
  };

  const handleSave = async () => {
    if (isResetting) return;

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
      const { message } = resolveUserFacingError(error, {
        unexpectedMessage: 'Nao foi possivel salvar os parceiros neste momento.',
        validationMessage: 'Alguns parceiros precisam de ajuste antes do salvamento.',
      });
      setNotice({
        tone: 'error',
        message,
      });
    }
  };

  const handleReset = () => {
    if (hasPendingAction) return;

    void (async () => {
      setIsResetting(true);
      setNotice({ tone: 'info', message: 'Restaurando parceiros...' });
      try {
        const defaults = await resetSection('partners');
        setLocal([...defaults]);
        setNotice({ tone: 'success', message: 'Parceiros restaurados para o padrao.' });
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel restaurar os parceiros padrao.',
          validationMessage: 'Nao foi possivel restaurar os parceiros no momento.',
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
      <SectionCard title="Marcas e Parceiros" onReset={handleReset} isResetting={isResetting}>
        {local.length === 0 ? (
          <EmptyAdminState
            title="Sem parceiros cadastrados"
            description="Inclua marcas parceiras para preencher a vitrine institucional da home."
            action={
              <button
                onClick={add}
                disabled={hasPendingAction}
                className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
              >
                <Plus size={12} />
                Adicionar parceiro
              </button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {local.map((partner, index) => (
                <div key={partner.id} className="border border-stone-100 p-3 space-y-2">
                  <Input
                    value={partner.name}
                    onChange={(value) => update(index, value)}
                    placeholder="Nome da marca"
                    disabled={hasPendingAction}
                  />
                  <button
                    onClick={() => remove(index)}
                    aria-label={`Remover parceiro ${partner.name || 'sem nome'}`}
                    disabled={hasPendingAction}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-10 px-3 text-xs text-red-500 border border-red-100 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={add}
              disabled={hasPendingAction}
              className="min-h-10 w-full sm:w-auto px-2 sm:px-0 text-xs text-amber-700 hover:underline inline-flex items-center justify-center sm:justify-start gap-1"
            >
              <Plus size={12} />
              Adicionar parceiro
            </button>
          </>
        )}
      </SectionCard>
      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}
      <SaveButton onClick={handleSave} saved={saved} isSaving={isSaving} disabled={isResetting} />
    </div>
  );
}
