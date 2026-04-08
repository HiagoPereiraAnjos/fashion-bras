import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import type { Store, StoreFormData } from '@/types';
import { AdminCollectionHeader } from '@/features/admin/components/shared/AdminCollectionHeader';
import { AdminCreateButton } from '@/features/admin/components/shared/AdminCreateButton';
import {
  EmptyAdminState,
  InlineNotice,
} from '@/features/admin/components/shared/AdminFormControls';
import { StoreEditorModal } from '@/features/admin/components/sections/stores/StoreEditorModal';
import {
  buildNewStoreDraft,
  toStoreEntity,
} from '@/features/admin/components/sections/stores/storeForm';

type SaveNotice = { tone: 'success' | 'error'; message: string } | null;

export default function StoresSection() {
  const { stores, setStores, resetSection, storeSegments } = useAdminData();
  const [editing, setEditing] = useState<Store | null>(null);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState<SaveNotice>(null);

  const toggleSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const saveStore = async (updated: StoreFormData) => {
    const normalizedStore = toStoreEntity(updated);
    const nextStores = stores.map((store) =>
      store.id === normalizedStore.id ? normalizedStore : store,
    );

    await setStores(nextStores);
    toggleSaved();
    setNotice({ tone: 'success', message: 'Loja atualizada com sucesso.' });
  };

  const deleteStoreById = (id: string) => {
    void (async () => {
      if (!confirm('Remover esta loja?')) return;

      try {
        await setStores(stores.filter((store) => store.id !== id));
        toggleSaved();
        setNotice({ tone: 'success', message: 'Loja removida com sucesso.' });
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error ? error.message : 'Nao foi possivel remover a loja agora.',
        });
      }
    })();
  };

  const addStore = () => {
    void (async () => {
      const newStore = buildNewStoreDraft();
      try {
        await setStores([...stores, newStore]);
        setEditing(newStore);
        toggleSaved();
        setNotice({ tone: 'success', message: 'Nova loja criada. Complete os dados no editor.' });
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error ? error.message : 'Nao foi possivel criar a nova loja agora.',
        });
      }
    })();
  };

  const resetStores = () => {
    void (async () => {
      try {
        await resetSection('stores');
        setNotice({ tone: 'success', message: 'Lista de lojas restaurada para o padrao.' });
      } catch (error) {
        setNotice({
          tone: 'error',
          message:
            error instanceof Error ? error.message : 'Nao foi possivel restaurar as lojas padrao.',
        });
      }
    })();
  };

  return (
    <div className="space-y-4">
      <AdminCollectionHeader
        countLabel={`${stores.length} lojas cadastradas`}
        saved={saved}
        onReset={resetStores}
        onCreate={addStore}
        createLabel="Nova Loja"
      />

      {notice && <InlineNotice tone={notice.tone} message={notice.message} />}

      <div className="space-y-2">
        {stores.length === 0 ? (
          <EmptyAdminState
            title="Nenhuma loja cadastrada"
            description="Adicione sua primeira loja para exibir conteudo na pagina de lojas."
            action={<AdminCreateButton onClick={addStore} label="Nova Loja" />}
          />
        ) : (
          stores.map((store) => (
            <div
              key={store.id}
              className="bg-white border border-stone-100 p-4 hover:border-stone-200 transition-colors"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <img
                  src={
                    store.images[0] ||
                    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80'
                  }
                  alt={store.name}
                  className="w-full h-40 sm:w-14 sm:h-14 object-cover bg-stone-100 sm:shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-stone-800 text-sm">
                      {store.name || 'Loja sem nome'}
                    </p>
                    {store.featured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5">
                        Destaque
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {store.segment || 'Segmento nao definido'} -{' '}
                    {store.floor || 'Localizacao nao definida'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed md:truncate">
                    {store.description || 'Sem descricao.'}
                  </p>
                </div>
                <div className="flex gap-2 sm:shrink-0 sm:flex-col md:flex-row">
                  <button
                    onClick={() => setEditing(store)}
                    aria-label={`Editar loja ${store.name || 'sem nome'}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:h-9 sm:w-9 sm:px-0 text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    <Edit3 size={15} />
                    <span className="text-xs sm:hidden">Editar</span>
                  </button>
                  <button
                    onClick={() => deleteStoreById(store.id)}
                    aria-label={`Remover loja ${store.name || 'sem nome'}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:h-9 sm:w-9 sm:px-0 text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                    <span className="text-xs sm:hidden">Remover</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <StoreEditorModal
            store={editing}
            storeSegments={storeSegments}
            onSave={saveStore}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
