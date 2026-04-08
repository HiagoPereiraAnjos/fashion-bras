import { ADMIN_TABS } from '@/features/admin/constants/tabs';
import type { AdminNavigationProps } from '@/features/admin/types/admin';

export function AdminNavigation({ activeTab, onTabChange }: AdminNavigationProps) {
  return (
    <aside className="w-full lg:w-48 lg:shrink-0">
      <nav
        className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-20 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0"
        aria-label="Navegacao do painel administrativo"
      >
        {ADMIN_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`shrink-0 inline-flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors whitespace-nowrap border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 lg:w-full lg:whitespace-normal lg:text-left lg:border-b-0 lg:border-l-2 ${
                isActive
                  ? 'bg-white text-amber-700 font-medium border-amber-600 shadow-sm'
                  : 'border-transparent text-stone-600 hover:bg-white hover:text-stone-900'
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
