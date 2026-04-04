import { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { AdminSectionsPanel } from '@/features/admin/components/AdminSectionsPanel';
import { ResetAllModal } from '@/features/admin/components/ResetAllModal';
import type { AdminTabId } from '@/features/admin/constants/tabs';
import { getSeoMetadata } from '@/seo/pages';
import { usePageSeo } from '@/seo/usePageSeo';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTabId>('settings');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { resetAll, hasCustomData } = useAdminData();

  usePageSeo(getSeoMetadata('admin'));

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      hasCustomData={hasCustomData}
      onRequestResetAll={() => setShowResetConfirm(true)}
    >
      <AdminSectionsPanel activeTab={activeTab} />
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

