import type {
  AboutContent,
  BlogCategory,
  BlogPost,
  HomeData,
  LeasingContent,
  NavLink,
  SiteSettings,
  Store,
  StoreCategory,
} from '@/types';
import { getDefaultSection } from '@/services/content/defaults';
import { buildBlogCategories, buildStoreSegments } from '@/services/content/selectors';
import type { ContentSection, ContentState } from '@/services/content/types/content';

const FALLBACK_NAVIGATION_LINKS: NavLink[] = [
  { label: 'Início', href: '/' },
  { label: 'Lojas', href: '/lojas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Locação', href: '/locacao' },
  { label: 'Sobre', href: '/sobre' },
];

const FALLBACK_CONTACT_INFO = {
  address: 'Endereço em atualização',
  phone: 'Telefone em atualização',
  email: 'contato@fashionbras.com.br',
  hours: 'Horários em atualização',
} as const;

export interface SiteContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export interface SiteBranding {
  fullName: string;
  mainName: string;
  secondaryName: string;
}

export interface SiteSocialProfile {
  rawValue: string;
  href: string;
  displayValue: string;
  isAvailable: boolean;
}

export interface SiteSocialLinks {
  instagram: SiteSocialProfile;
  facebook: SiteSocialProfile;
}

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

function normalizeText(value: string | undefined | null): string {
  return value?.trim() ?? '';
}

function resolveNavigationLinks(navLinks: NavLink[]): NavLink[] {
  const validLinks = navLinks.filter((link) => normalizeText(link.label) && normalizeText(link.href));
  return validLinks.length > 0 ? validLinks : FALLBACK_NAVIGATION_LINKS;
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function resolveSocialProfile(value: string, platform: 'instagram' | 'facebook'): SiteSocialProfile {
  const rawValue = normalizeText(value);
  if (!rawValue) {
    return {
      rawValue: '',
      href: '#',
      displayValue: '',
      isAvailable: false,
    };
  }

  if (isHttpUrl(rawValue)) {
    return {
      rawValue,
      href: rawValue,
      displayValue: rawValue,
      isAvailable: true,
    };
  }

  const normalizedHandle = rawValue.replace(/^@/, '').trim();
  if (!normalizedHandle) {
    return {
      rawValue,
      href: '#',
      displayValue: '',
      isAvailable: false,
    };
  }

  return {
    rawValue,
    href: `https://${platform}.com/${normalizedHandle}`,
    displayValue: `@${normalizedHandle}`,
    isAvailable: true,
  };
}

function resolveBranding(siteSettings: SiteSettings): SiteBranding {
  const fullName = normalizeText(siteSettings.name) || 'Fashion Bras';
  const [mainName, ...secondaryParts] = fullName.split(' ');

  return {
    fullName,
    mainName: mainName || 'Fashion',
    secondaryName: secondaryParts.join(' ') || 'Bras',
  };
}

function resolveContactInfo(siteSettings: SiteSettings): SiteContactInfo {
  return {
    address: normalizeText(siteSettings.address) || FALLBACK_CONTACT_INFO.address,
    phone: normalizeText(siteSettings.phone) || FALLBACK_CONTACT_INFO.phone,
    email: normalizeText(siteSettings.email) || FALLBACK_CONTACT_INFO.email,
    hours: normalizeText(siteSettings.hours) || FALLBACK_CONTACT_INFO.hours,
  };
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
  navigationLinks: NavLink[];
  contactInfo: SiteContactInfo;
  branding: SiteBranding;
  socialLinks: SiteSocialLinks;
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
  const navigationLinks = resolveNavigationLinks(siteSettings.navLinks);
  const contactInfo = resolveContactInfo(siteSettings);
  const branding = resolveBranding(siteSettings);
  const socialLinks: SiteSocialLinks = {
    instagram: resolveSocialProfile(siteSettings.instagram, 'instagram'),
    facebook: resolveSocialProfile(siteSettings.facebook, 'facebook'),
  };

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
    navigationLinks,
    contactInfo,
    branding,
    socialLinks,
  };
}
