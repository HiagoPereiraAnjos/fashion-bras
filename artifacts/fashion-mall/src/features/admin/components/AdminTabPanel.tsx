import { AnimatePresence, motion } from 'framer-motion';
import type { AdminTabId } from '@/features/admin/constants/tabs';
import AboutTab from '@/features/admin/components/tabs/AboutTab';
import BlogTab from '@/features/admin/components/tabs/BlogTab';
import LeasingTab from '@/features/admin/components/tabs/LeasingTab';
import PartnersTab from '@/features/admin/components/tabs/PartnersTab';
import SiteSettingsTab from '@/features/admin/components/tabs/SiteSettingsTab';
import StoresTab from '@/features/admin/components/tabs/StoresTab';

export function AdminTabPanel({ activeTab }: { activeTab: AdminTabId }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'settings' && <SiteSettingsTab />}
        {activeTab === 'stores' && <StoresTab />}
        {activeTab === 'blog' && <BlogTab />}
        {activeTab === 'partners' && <PartnersTab />}
        {activeTab === 'leasing' && <LeasingTab />}
        {activeTab === 'about' && <AboutTab />}
      </motion.div>
    </AnimatePresence>
  );
}
