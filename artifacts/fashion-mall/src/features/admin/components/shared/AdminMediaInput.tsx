import { useRef, useState, type ChangeEvent } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { useAdminAuth } from '@/context/auth/AdminAuthProvider';
import { InlineNotice, Input } from '@/features/admin/components/shared/AdminFormControls';
import { uploadAdminMedia } from '@/services/media/adminMediaApi';

interface AdminMediaInputProps {
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  placeholder?: string;
  showPreview?: boolean;
  previewClassName?: string;
}

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/avif';

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

    setUploadNotice(null);
    setIsUploading(true);

    try {
      const token = await getAccessToken();
      const uploaded = await uploadAdminMedia({
        file: selectedFile,
        folder,
        token,
      });

      onChange(uploaded.url);
      setUploadNotice({
        tone: 'success',
        message: 'Imagem enviada com sucesso.',
      });
    } catch (error) {
      setUploadNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Nao foi possivel enviar a imagem.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value} onChange={onChange} placeholder={placeholder} className="flex-1" />
        <button
          type="button"
          onClick={openPicker}
          disabled={!canUpload || isUploading}
          title={canUpload ? 'Enviar imagem' : 'Upload indisponivel neste modo'}
          className={`inline-flex items-center gap-1.5 px-3 text-xs font-medium uppercase tracking-wider border transition-colors ${
            canUpload && !isUploading
              ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
              : 'border-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
          {isUploading ? 'Enviando...' : 'Upload'}
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
