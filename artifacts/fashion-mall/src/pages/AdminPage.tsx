import { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { AdminTabPanel } from '@/features/admin/components/AdminTabPanel';
import { ResetAllModal } from '@/features/admin/components/ResetAllModal';
import type { AdminTabId } from '@/features/admin/constants/tabs';
import { usePageSeo } from '@/seo/usePageSeo';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTabId>('settings');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { resetAll, hasCustomData } = useAdminData();

  usePageSeo({
    title: 'Painel Administrativo',
    description: 'Área administrativa de gestão de conteúdo do Fashion Bras.',
    canonicalPath: '/admin',
    noIndex: true,
  });

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      hasCustomData={hasCustomData}
      onRequestResetAll={() => setShowResetConfirm(true)}
    >
      <AdminTabPanel activeTab={activeTab} />
      <ResetAllModal
        open={showResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetAll();
          setShowResetConfirm(false);
        }}
      />
    </AdminLayout>
  );
}
