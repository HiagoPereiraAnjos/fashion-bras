import { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { AdminSectionsPanel } from '@/features/admin/components/AdminSectionsPanel';
import { ResetAllModal } from '@/features/admin/components/ResetAllModal';
import { InlineNotice } from '@/features/admin/components/shared/AdminFormControls';
import type { AdminTabId } from '@/features/admin/constants/tabs';
import { getSeoMetadata } from '@/seo/pages';
import { usePageSeo } from '@/seo/usePageSeo';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTabId>('settings');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResettingAll, setIsResettingAll] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const { resetAll, hasCustomData } = useAdminData();

  usePageSeo(getSeoMetadata('admin'));

  const handleConfirmResetAll = async () => {
    setIsResettingAll(true);
    setResetError(null);
    try {
      await resetAll();
      setShowResetConfirm(false);
    } catch (error) {
      setResetError(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel resetar todo o conteudo neste momento.',
      );
    } finally {
      setIsResettingAll(false);
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      hasCustomData={hasCustomData}
      onRequestResetAll={() => setShowResetConfirm(true)}
    >
      {resetError && <InlineNotice tone="error" message={resetError} />}
      <AdminSectionsPanel activeTab={activeTab} />
      <ResetAllModal
        open={showResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={handleConfirmResetAll}
        isProcessing={isResettingAll}
      />
    </AdminLayout>
  );
}
