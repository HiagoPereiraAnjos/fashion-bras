import type {
  AboutContent,
  BlogCategory,
  BlogPost,
  HomeData,
  LeasingContent,
  Store,
  StoreCategory,
} from '@/types';
import { getDefaultSection } from '@/features/content/services/defaults';
import { buildBlogCategories, buildStoreSegments } from '@/features/content/services/selectors';
import type { ContentSection, ContentState } from '@/features/content/types/content';

function resolveSection<K extends ContentSection>(
  source: Partial<ContentState>,
  section: K,
): ContentState[K] {
  const value = source[section];
  if (value === undefined || value === null) {
    return getDefaultSection(section);
  }

  return value as ContentState[K];
}

function getFeaturedStores(stores: Store[]): Store[] {
  const featured = stores.filter((store) => store.featured);
  return featured.length > 0 ? featured : stores.slice(0, 3);
}

function splitBlogPosts(posts: BlogPost[]): {
  featuredBlogPost: BlogPost | null;
  blogFeedPosts: BlogPost[];
} {
  if (posts.length === 0) {
    return { featuredBlogPost: null, blogFeedPosts: [] };
  }

  const featuredBlogPost = posts.find((post) => post.featured) ?? posts[0];
  const blogFeedPosts = posts.filter((post) => post.slug !== featuredBlogPost.slug);

  return { featuredBlogPost, blogFeedPosts };
}

export interface SiteContentSnapshot extends ContentState {
  storeSegments: StoreCategory[];
  blogCategories: BlogCategory[];
  featuredStores: Store[];
  featuredBlogPost: BlogPost | null;
  blogFeedPosts: BlogPost[];
  blogPreviewPosts: BlogPost[];
  homeData: HomeData;
  leasingContent: LeasingContent;
  aboutContent: AboutContent;
}

export function buildSiteContentSnapshot(
  source: Partial<ContentState>,
): SiteContentSnapshot {
  // Central place for future DTO->domain mapping when remote source is introduced.
  const stores = resolveSection(source, 'stores');
  const blogPosts = resolveSection(source, 'blogPosts');
  const partners = resolveSection(source, 'partners');
  const siteSettings = resolveSection(source, 'siteSettings');
  const leasingBenefits = resolveSection(source, 'leasingBenefits');
  const spaceTypes = resolveSection(source, 'spaceTypes');
  const testimonials = resolveSection(source, 'testimonials');
  const leasingDifferentials = resolveSection(source, 'leasingDifferentials');
  const aboutData = resolveSection(source, 'aboutData');

  const storeSegments = buildStoreSegments(stores);
  const blogCategories = buildBlogCategories(blogPosts);
  const featuredStores = getFeaturedStores(stores);
  const { featuredBlogPost, blogFeedPosts } = splitBlogPosts(blogPosts);
  const blogPreviewPosts = blogPosts.slice(0, 3);

  const homeData: HomeData = {
    featuredStores,
    featuredBlogPost,
    blogPreviewPosts,
    partners,
  };

  const leasingContent: LeasingContent = {
    benefits: leasingBenefits,
    spaceTypes,
    testimonials,
    differentials: leasingDifferentials,
  };

  return {
    stores,
    blogPosts,
    partners,
    siteSettings,
    leasingBenefits,
    spaceTypes,
    testimonials,
    leasingDifferentials,
    aboutData,
    storeSegments,
    blogCategories,
    featuredStores,
    featuredBlogPost,
    blogFeedPosts,
    blogPreviewPosts,
    homeData,
    leasingContent,
    aboutContent: aboutData,
  };
}
