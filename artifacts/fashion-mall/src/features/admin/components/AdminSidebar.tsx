import { ADMIN_TABS, type AdminTabId } from '@/features/admin/constants/tabs';

type AdminSidebarProps = {
  activeTab: AdminTabId;
  onTabChange: (tab: AdminTabId) => void;
};

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="w-48 shrink-0">
      <nav className="space-y-1 sticky top-20">
        {ADMIN_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                isActive
                  ? 'bg-white text-amber-700 font-medium border-l-2 border-amber-600 shadow-sm'
                  : 'text-stone-600 hover:bg-white hover:text-stone-900'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-amber-600' : 'text-stone-400'} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
