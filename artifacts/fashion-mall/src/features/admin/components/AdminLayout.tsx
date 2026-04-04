import { AdminHeader } from '@/features/admin/components/layout/AdminHeader';
import { AdminNavigation } from '@/features/admin/components/layout/AdminNavigation';
import { AdminPageIntro } from '@/features/admin/components/layout/AdminPageIntro';
import type { AdminLayoutProps } from '@/features/admin/types/admin';

export function AdminLayout({
  activeTab,
  onTabChange,
  hasCustomData,
  onRequestResetAll,
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-50">
      <AdminHeader hasCustomData={hasCustomData} onRequestResetAll={onRequestResetAll} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPageIntro />

        <div className="flex gap-8">
          <AdminNavigation activeTab={activeTab} onTabChange={onTabChange} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
