import MainLayout from '@/layouts/MainLayout';
import { useSiteContent } from '@/services/content';
import { getSeoMetadata } from '@/seo/pages';
import { usePageSeo } from '@/seo/usePageSeo';
import {
  BlogPreviewSection,
  FeaturedStoresSection,
  HeroSection,
  InstitutionalSection,
  LeasingCTASection,
  PartnersSection,
  StatsSection,
} from '@/features/home/components/HomeSections';

export default function HomePage() {
  const { aboutContent, blogPreviewPosts, branding, featuredStores, homeContent, partners } =
    useSiteContent();

  usePageSeo(
    getSeoMetadata('home', {
      title: `Shopping de Moda Premium em Sao Paulo`,
      image: homeContent.hero.slides[0]?.image,
      imageAlt: `Home do ${branding.fullName}`,
    }),
  );

  return (
    <MainLayout>
      <HeroSection hero={homeContent.hero} />
      <InstitutionalSection
        aboutHistory={aboutContent.history}
        mission={aboutContent.mission}
        vision={aboutContent.vision}
        brandingName={branding.fullName}
        institutional={homeContent.institutional}
      />
      <StatsSection stats={homeContent.stats} />
      <FeaturedStoresSection section={homeContent.featuredStores} featuredStores={featuredStores} />
      <PartnersSection section={homeContent.partners} partners={partners} />
      <BlogPreviewSection section={homeContent.blogPreview} blogPreviewPosts={blogPreviewPosts} />
      <LeasingCTASection section={homeContent.leasingCta} />
    </MainLayout>
  );
}
