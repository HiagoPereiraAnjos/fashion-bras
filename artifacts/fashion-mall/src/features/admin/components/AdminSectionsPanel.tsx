import { AnimatePresence, motion } from 'framer-motion';
import type { ComponentType } from 'react';
import type { AdminTabId } from '@/features/admin/constants/tabs';
import AboutSection from '@/features/admin/components/sections/AboutSection';
import BlogSection from '@/features/admin/components/sections/BlogSection';
import HomeSection from '@/features/admin/components/sections/HomeSection';
import LeasingSection from '@/features/admin/components/sections/LeasingSection';
import LeadsSection from '@/features/admin/components/sections/LeadsSection';
import PartnersSection from '@/features/admin/components/sections/PartnersSection';
import SiteSettingsSection from '@/features/admin/components/sections/SiteSettingsSection';
import StoresSection from '@/features/admin/components/sections/StoresSection';

const SECTION_BY_TAB: Record<AdminTabId, ComponentType> = {
  settings: SiteSettingsSection,
  home: HomeSection,
  stores: StoresSection,
  blog: BlogSection,
  partners: PartnersSection,
  leasing: LeasingSection,
  leads: LeadsSection,
  about: AboutSection,
};

export function AdminSectionsPanel({ activeTab }: { activeTab: AdminTabId }) {
  const ActiveSection = SECTION_BY_TAB[activeTab];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <ActiveSection />
      </motion.div>
    </AnimatePresence>
  );
}
