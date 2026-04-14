import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Phone } from 'lucide-react';
import { useAdminAuth } from '@/context/auth/AdminAuthProvider';
import { AdminEditorModal } from '@/features/admin/components/shared/AdminEditorModal';
import {
  EmptyAdminState,
  Field,
  InlineNotice,
  Input,
  SectionCard,
  Select,
  Textarea,
} from '@/features/admin/components/shared/AdminFormControls';
import {
  fetchAdminContactRequestById,
  fetchAdminContactRequests,
  patchAdminContactRequest,
} from '@/services/admin/contactRequestsApi';
import { resolveUserFacingError } from '@/services/errors/userFacingError';
import type { ContactRequestDetail, ContactRequestListItem, ContactRequestStatus } from '@/types';

type FilterStatus = ContactRequestStatus | 'todos';
type Notice = { tone: 'success' | 'error'; message: string } | null;

const STATUS_OPTIONS: ReadonlyArray<{ value: ContactRequestStatus; label: string }> = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_contato', label: 'Em contato' },
  { value: 'atendido', label: 'Atendido' },
  { value: 'arquivado', label: 'Arquivado' },
];

const STATUS_LABELS: Record<ContactRequestStatus, string> = {
  novo: 'Novo',
  em_contato: 'Em contato',
  atendido: 'Atendido',
  arquivado: 'Arquivado',
};

const STATUS_BADGE_CLASSNAME: Record<ContactRequestStatus, string> = {
  novo: 'bg-amber-50 text-amber-700 border-amber-200',
  em_contato: 'bg-blue-50 text-blue-700 border-blue-200',
  atendido: 'bg-green-50 text-green-700 border-green-200',
  arquivado: 'bg-stone-100 text-stone-600 border-stone-200',
};

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

function formatDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return dateTimeFormatter.format(parsed);
}

export default function LeadsSection() {
  const { getAccessToken } = useAdminAuth();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
  const [items, setItems] = useState<ContactRequestListItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<ContactRequestDetail | null>(null);
  const [isLoadingLead, setIsLoadingLead] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [leadStatus, setLeadStatus] = useState<ContactRequestStatus>('novo');
  const [leadNotes, setLeadNotes] = useState('');

  const loadLeads = useCallback(
    async (status: FilterStatus) => {
      setIsLoadingList(true);
      setListError(null);
      try {
        const token = await getAccessToken();
        if (!token) {
          throw new Error('Sessao administrativa expirada.');
        }

        const response = await fetchAdminContactRequests({
          token,
          status: status === 'todos' ? undefined : status,
        });
        setItems(response);
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel carregar as solicitacoes de locacao.',
          authenticationMessage: 'Sua sessao expirou. Faca login novamente.',
          networkMessage: 'Falha de conexao ao carregar as solicitacoes.',
          validationMessage: 'Nao foi possivel carregar as solicitacoes com os filtros atuais.',
        });
        setListError(message);
      } finally {
        setIsLoadingList(false);
      }
    },
    [getAccessToken],
  );

  useEffect(() => {
    void loadLeads(filterStatus);
  }, [filterStatus, loadLeads]);

  const openLead = (id: string) => {
    void (async () => {
      setActiveLeadId(id);
      setActiveLead(null);
      setLeadError(null);
      setIsLoadingLead(true);
      try {
        const token = await getAccessToken();
        if (!token) {
          throw new Error('Sessao administrativa expirada.');
        }

        const detail = await fetchAdminContactRequestById({ token, id });
        setActiveLead(detail);
        setLeadStatus(detail.status);
        setLeadNotes(detail.internalNotes);
      } catch (error) {
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage: 'Nao foi possivel carregar os detalhes da solicitacao.',
          authenticationMessage: 'Sua sessao expirou. Faca login novamente.',
          networkMessage: 'Falha de conexao ao carregar detalhes da solicitacao.',
          validationMessage: 'Nao foi possivel carregar esta solicitacao.',
        });
        setLeadError(message);
      } finally {
        setIsLoadingLead(false);
      }
    })();
  };

  const closeLeadModal = () => {
    if (isSavingLead) return;
    setActiveLeadId(null);
    setActiveLead(null);
    setLeadError(null);
    setIsLoadingLead(false);
  };

  const handleSaveLead = async () => {
    if (!activeLeadId || !activeLead) return;

    setLeadError(null);
    setIsSavingLead(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Sessao administrativa expirada.');
      }

      const updated = await patchAdminContactRequest({
        token,
        id: activeLeadId,
        input: {
          status: leadStatus,
          internalNotes: leadNotes,
        },
      });

      setActiveLead(updated);
      setItems((current) =>
        current.map((item) =>
          item.id === updated.id
            ? {
                ...item,
                status: updated.status,
                updatedAt: updated.updatedAt,
              }
            : item,
        ),
      );
      setNotice({
        tone: 'success',
        message: 'Solicitacao atualizada com sucesso.',
      });
    } catch (error) {
      const { message } = resolveUserFacingError(error, {
        unexpectedMessage: 'Nao foi possivel atualizar esta solicitacao.',
        authenticationMessage: 'Sua sessao expirou. Faca login novamente.',
        networkMessage: 'Falha de conexao ao salvar a solicitacao.',
        validationMessage: 'Os dados informados para a solicitacao sao invalidos.',
      });
      setLeadError(message);
    } finally {
      setIsSavingLead(false);
    }
  };

  const filterOptions = useMemo(
    () => [
      { value: 'todos', label: 'Todos os status' },
      ...STATUS_OPTIONS,
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <SectionCard title="Solicitacoes de locacao">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-stone-500 leading-relaxed">
            Leads recebidos pelo formulario de locacao. Os registros mais recentes aparecem primeiro.
          </p>
          <div className="w-full md:w-60">
            <Field label="Filtrar por status">
              <Select
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as FilterStatus)}
                options={filterOptions}
                disabled={isLoadingList}
              />
            </Field>
          </div>
        </div>

        {notice && <div className="mt-4"><InlineNotice tone={notice.tone} message={notice.message} /></div>}
        {listError && (
          <div className="mt-4 space-y-3">
            <InlineNotice tone="error" message={listError} />
            <button
              type="button"
              onClick={() => void loadLeads(filterStatus)}
              className="h-10 px-4 text-xs uppercase tracking-[0.14em] border border-stone-200 text-stone-600 hover:border-stone-400 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!listError && isLoadingList && (
          <div className="mt-4 border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600 inline-flex items-center gap-2">
            <Loader2 size={16} className="animate-spin text-amber-700" />
            Carregando solicitacoes...
          </div>
        )}

        {!listError && !isLoadingList && items.length === 0 && (
          <div className="mt-4">
            <EmptyAdminState
              title="Nenhuma solicitacao encontrada"
              description={
                filterStatus === 'todos'
                  ? 'Ainda nao existem solicitacoes de locacao enviadas pelo formulario.'
                  : 'Nao existem solicitacoes para o status selecionado.'
              }
            />
          </div>
        )}

        {!listError && !isLoadingList && items.length > 0 && (
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="border border-stone-200 bg-white p-4 sm:p-5 space-y-3 rounded-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900 break-words">{item.name}</p>
                    <p className="text-xs text-stone-500 break-words">{item.company}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] uppercase tracking-[0.12em] border px-2 py-1 ${STATUS_BADGE_CLASSNAME[item.status]}`}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                    <span className="text-xs text-stone-500">
                      {formatDateTime(item.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                  <p className="inline-flex items-center gap-1.5 break-all">
                    <Mail size={12} className="text-stone-400" />
                    {item.email}
                  </p>
                  <p className="inline-flex items-center gap-1.5 break-words">
                    <Phone size={12} className="text-stone-400" />
                    {item.phone}
                  </p>
                  <p className="break-words">
                    <span className="text-stone-500">Espaco:</span> {item.spaceType}
                  </p>
                  <p className="break-words">
                    <span className="text-stone-500">Segmento:</span> {item.segment}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => openLead(item.id)}
                    className="w-full sm:w-auto h-10 px-4 text-xs uppercase tracking-[0.14em] bg-stone-900 text-white hover:bg-amber-700 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    Ver detalhes
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      <AnimatePresence>
        {activeLeadId && (
          <AdminEditorModal
            title={activeLead ? `Lead: ${activeLead.name}` : 'Detalhes da solicitacao'}
            onClose={closeLeadModal}
            onSave={handleSaveLead}
            saveLabel="Salvar atualizacoes"
            isSaving={isSavingLead}
          >
            {isLoadingLead && (
              <div className="border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600 inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-amber-700" />
                Carregando detalhes...
              </div>
            )}

            {!isLoadingLead && leadError && <InlineNotice tone="error" message={leadError} />}

            {!isLoadingLead && !leadError && activeLead && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nome">
                    <Input value={activeLead.name} onChange={() => {}} disabled />
                  </Field>
                  <Field label="Empresa">
                    <Input value={activeLead.company} onChange={() => {}} disabled />
                  </Field>
                  <Field label="Email">
                    <Input value={activeLead.email} onChange={() => {}} disabled />
                  </Field>
                  <Field label="Telefone">
                    <Input value={activeLead.phone} onChange={() => {}} disabled />
                  </Field>
                  <Field label="Tipo de espaco">
                    <Input value={activeLead.spaceType} onChange={() => {}} disabled />
                  </Field>
                  <Field label="Segmento">
                    <Input value={activeLead.segment} onChange={() => {}} disabled />
                  </Field>
                  <Field label="Enviado em">
                    <Input value={formatDateTime(activeLead.createdAt)} onChange={() => {}} disabled />
                  </Field>
                  <Field label="Atualizado em">
                    <Input value={formatDateTime(activeLead.updatedAt)} onChange={() => {}} disabled />
                  </Field>
                </div>

                <Field label="Mensagem">
                  <Textarea value={activeLead.message} onChange={() => {}} rows={6} disabled />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Status">
                    <Select
                      value={leadStatus}
                      onChange={(value) => setLeadStatus(value as ContactRequestStatus)}
                      options={[...STATUS_OPTIONS]}
                      disabled={isSavingLead}
                    />
                  </Field>
                </div>

                <Field label="Observacoes internas">
                  <Textarea
                    value={leadNotes}
                    onChange={setLeadNotes}
                    rows={4}
                    disabled={isSavingLead}
                    placeholder="Registre contexto de contato, retorno e proximos passos."
                  />
                </Field>
              </div>
            )}
          </AdminEditorModal>
        )}
      </AnimatePresence>
    </div>
  );
}
