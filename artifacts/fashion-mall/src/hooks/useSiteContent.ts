import { useMemo } from 'react';
import { useAdminData } from '@/context/content/ContentProvider';
import { buildSiteContentSnapshot } from '@/services/content/siteContent';

export function useSiteContent() {
  const {
    stores,
    blogPosts,
    partners,
    siteSettings,
    leasingBenefits,
    spaceTypes,
    testimonials,
    leasingDifferentials,
    aboutData,
  } = useAdminData();

  return useMemo(
    () =>
      // UI reads a derived snapshot, independent from storage implementation details.
      buildSiteContentSnapshot({
        stores,
        blogPosts,
        partners,
        siteSettings,
        leasingBenefits,
        spaceTypes,
        testimonials,
        leasingDifferentials,
        aboutData,
      }),
    [
      stores,
      blogPosts,
      partners,
      siteSettings,
      leasingBenefits,
      spaceTypes,
      testimonials,
      leasingDifferentials,
      aboutData,
    ],
  );
}
