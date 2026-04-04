import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import type { Store, StoreFormData } from '@/types';
import { AdminCollectionHeader } from '@/features/admin/components/shared/AdminCollectionHeader';
import { AdminCreateButton } from '@/features/admin/components/shared/AdminCreateButton';
import { EmptyAdminState } from '@/features/admin/components/shared/AdminFormControls';
import { StoreEditorModal } from '@/features/admin/components/sections/stores/StoreEditorModal';
import {
  buildNewStoreDraft,
  toStoreEntity,
} from '@/features/admin/components/sections/stores/storeForm';

export default function StoresSection() {
  const { stores, setStores, resetSection, storeSegments } = useAdminData();
  const [editing, setEditing] = useState<Store | null>(null);
  const [saved, setSaved] = useState(false);

  const saveStore = (updated: StoreFormData) => {
    const normalizedStore = toStoreEntity(updated);
    setStores(stores.map((store) => (store.id === normalizedStore.id ? normalizedStore : store)));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteStore = (id: string) => {
    if (confirm('Remover esta loja?')) {
      setStores(stores.filter((store) => store.id !== id));
    }
  };

  const addStore = () => {
    const newStore = buildNewStoreDraft();
    setStores([...stores, newStore]);
    setEditing(newStore);
  };

  return (
    <div className="space-y-4">
      <AdminCollectionHeader
        countLabel={`${stores.length} lojas cadastradas`}
        saved={saved}
        onReset={() => resetSection('stores')}
        onCreate={addStore}
        createLabel="Nova Loja"
      />

      <div className="space-y-2">
        {stores.length === 0 ? (
          <EmptyAdminState
            title="Nenhuma loja cadastrada"
            description="Adicione sua primeira loja para exibir conteúdo na página de lojas."
            action={<AdminCreateButton onClick={addStore} label="Nova Loja" />}
          />
        ) : (
          stores.map((store) => (
            <div
              key={store.id}
              className="flex items-center gap-4 bg-white border border-stone-100 p-4 hover:border-stone-200 transition-colors"
            >
              <img
                src={
                  store.images[0] ||
                  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80'
                }
                alt={store.name}
                className="w-14 h-14 object-cover shrink-0 bg-stone-100"
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
                  {store.segment || 'Segmento não definido'} ·{' '}
                  {store.floor || 'Localização não definida'}
                </p>
                <p className="text-xs text-stone-500 mt-1 truncate">
                  {store.description || 'Sem descrição.'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditing(store)}
                  className="p-2 text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => deleteStore(store.id)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
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
