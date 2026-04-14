import { AdminHeader } from '@/features/admin/components/layout/AdminHeader';
import { AdminNavigation } from '@/features/admin/components/layout/AdminNavigation';
import { AdminPageIntro } from '@/features/admin/components/layout/AdminPageIntro';
import type { AdminLayoutProps } from '@/features/admin/types/admin';

export function AdminLayout({
  activeTab,
  onTabChange,
  hasCustomData,
  onRequestResetAll,
  onLogout,
  isLoggingOut,
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-50">
      <AdminHeader
        hasCustomData={hasCustomData}
        onRequestResetAll={onRequestResetAll}
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-8 sm:py-8 sm:pb-10">
        <AdminPageIntro />

        <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:gap-8">
          <AdminNavigation activeTab={activeTab} onTabChange={onTabChange} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
