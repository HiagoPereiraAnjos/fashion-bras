import { useRef, useState, type ChangeEvent } from 'react';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { useAdminAuth } from '@/context/auth/AdminAuthProvider';
import { InlineNotice, Input } from '@/features/admin/components/shared/AdminFormControls';
import {
  ADMIN_MEDIA_ALLOWED_TYPES,
  ADMIN_MEDIA_MAX_SIZE_BYTES,
  deleteAdminMedia,
  resolveStorageObjectPath,
  uploadAdminMedia,
} from '@/services/media/adminMediaApi';
import { ApiRequestError } from '@/services/api/request';

interface AdminMediaInputProps {
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  placeholder?: string;
  showPreview?: boolean;
  previewClassName?: string;
}

const ACCEPTED_IMAGE_TYPES = ADMIN_MEDIA_ALLOWED_TYPES.join(',');

function getMediaErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 401) {
      return 'Sessao expirada. Faca login novamente para gerenciar imagens.';
    }
    if (error.status === 413) {
      return 'Arquivo excede 8MB.';
    }
    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export function AdminMediaInput({
  value,
  onChange,
  folder = 'general',
  placeholder = 'https://...',
  showPreview = false,
  previewClassName = 'w-full h-32 object-cover border border-stone-100',
}: AdminMediaInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { isRemoteMode, isConfigured, getAccessToken } = useAdminAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(
    null,
  );

  const canUpload = isRemoteMode && isConfigured;

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = '';
    if (!selectedFile) return;
    if (!ADMIN_MEDIA_ALLOWED_TYPES.includes(selectedFile.type as (typeof ADMIN_MEDIA_ALLOWED_TYPES)[number])) {
      setUploadNotice({
        tone: 'error',
        message: 'Formato invalido. Envie JPG, PNG, WEBP ou AVIF.',
      });
      return;
    }
    if (selectedFile.size > ADMIN_MEDIA_MAX_SIZE_BYTES) {
      setUploadNotice({
        tone: 'error',
        message: 'Arquivo excede 8MB.',
      });
      return;
    }

    setUploadNotice(null);
    setIsUploading(true);

    try {
      const token = await getAccessToken();
      const previousPath = resolveStorageObjectPath(value);
      const uploaded = await uploadAdminMedia({
        file: selectedFile,
        folder,
        token,
        replacePath: previousPath,
      });

      onChange(uploaded.url);
      setUploadNotice({
        tone: 'success',
        message: 'Imagem enviada com sucesso.',
      });
    } catch (error) {
      setUploadNotice({
        tone: 'error',
        message: getMediaErrorMessage(error, 'Nao foi possivel enviar a imagem.'),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!value.trim()) return;

    setUploadNotice(null);
    setIsDeleting(true);

    try {
      if (canUpload) {
        const token = await getAccessToken();
        const storagePath = resolveStorageObjectPath(value);
        if (storagePath) {
          await deleteAdminMedia({
            path: storagePath,
            token,
          });
        }
      }

      onChange('');
      setUploadNotice({
        tone: 'success',
        message: 'Imagem removida com sucesso.',
      });
    } catch (error) {
      setUploadNotice({
        tone: 'error',
        message: getMediaErrorMessage(error, 'Nao foi possivel remover a imagem.'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value} onChange={onChange} placeholder={placeholder} className="flex-1" />
        <button
          type="button"
          onClick={openPicker}
          disabled={!canUpload || isUploading || isDeleting}
          title={canUpload ? 'Enviar imagem' : 'Upload indisponivel neste modo'}
          className={`inline-flex items-center gap-1.5 px-3 text-xs font-medium uppercase tracking-wider border transition-colors ${
            canUpload && !isUploading && !isDeleting
              ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
              : 'border-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
          {isUploading ? 'Enviando...' : 'Upload'}
        </button>
        <button
          type="button"
          onClick={handleRemoveImage}
          disabled={!value.trim() || isUploading || isDeleting}
          title="Remover imagem"
          className={`inline-flex items-center gap-1.5 px-3 text-xs font-medium uppercase tracking-wider border transition-colors ${
            value.trim() && !isUploading && !isDeleting
              ? 'border-red-200 text-red-600 hover:bg-red-50'
              : 'border-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          {isDeleting ? 'Removendo...' : 'Remover'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        onChange={handleFileSelection}
        className="hidden"
      />

      {showPreview && value && <img src={value} alt="" className={previewClassName} />}
      {uploadNotice && <InlineNotice tone={uploadNotice.tone} message={uploadNotice.message} />}
    </div>
  );
}
