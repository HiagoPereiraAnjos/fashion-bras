import type { AdminTabId } from '@/features/admin/constants/tabs';
import type { ReactNode } from 'react';

export type AdminTabChangeHandler = (tab: AdminTabId) => void;

export type AdminNavigationProps = {
  activeTab: AdminTabId;
  onTabChange: AdminTabChangeHandler;
};

export type AdminHeaderProps = {
  hasCustomData: boolean;
  onRequestResetAll: () => void;
};

export type AdminLayoutProps = AdminNavigationProps &
  AdminHeaderProps & {
    children: ReactNode;
  };
