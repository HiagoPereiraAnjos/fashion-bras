import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAdminData } from '@/context/AdminDataContext';
import { useAdminAuth } from '@/context/auth/AdminAuthProvider';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { AdminSectionsPanel } from '@/features/admin/components/AdminSectionsPanel';
import { ResetAllModal } from '@/features/admin/components/ResetAllModal';
import { InlineNotice } from '@/features/admin/components/shared/AdminFormControls';
import type { AdminTabId } from '@/features/admin/constants/tabs';
import { getSeoMetadata } from '@/seo/pages';
import { usePageSeo } from '@/seo/usePageSeo';

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTabId>('settings');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResettingAll, setIsResettingAll] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const { resetAll, hasCustomData } = useAdminData();
  const { isRemoteMode, session, signOut } = useAdminAuth();

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

  const handleLogout = async () => {
    if (!isRemoteMode || !session) return;

    setIsLoggingOut(true);
    try {
      await signOut();
    } finally {
      setIsLoggingOut(false);
      setLocation('/admin/login');
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      hasCustomData={hasCustomData}
      onRequestResetAll={() => setShowResetConfirm(true)}
      onLogout={isRemoteMode && session ? handleLogout : undefined}
      isLoggingOut={isLoggingOut}
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
