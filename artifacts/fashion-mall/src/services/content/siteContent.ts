import type {
  AboutContent,
  BlogCategory,
  BlogPost,
  ContentSection,
  HomeContent,
  HomePageContent,
  LeasingContent,
  NavLink,
  SiteBranding,
  SiteContactInfo,
  SiteContentSnapshot,
  SiteContentState,
  SiteFooterContent,
  SiteSettings,
  SiteSocialLinks,
  SiteSocialProfile,
  Store,
  StoreCategory,
} from '@/types';
import { getDefaultSection } from '@/services/content/defaults';
import { buildBlogCategories, buildStoreSegments } from '@/services/content/selectors';

const FALLBACK_NAVIGATION_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Lojas', href: '/lojas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Locacao', href: '/locacao' },
  { label: 'Sobre', href: '/sobre' },
];

const FALLBACK_CONTACT_INFO = {
  address: 'Endereco em atualizacao',
  phone: 'Telefone em atualizacao',
  email: 'contato@fashionbras.com.br',
  hours: 'Horarios em atualizacao',
} as const;

const FALLBACK_FOOTER_DESCRIPTION = 'Shopping de moda premium com experiencias selecionadas.';
const FALLBACK_FOOTER_LEGAL_NOTE =
  'Conteudo e experiencia digital desenvolvidos para a moda brasileira.';
const FALLBACK_FOOTER_LEASING_LINK: NavLink = {
  label: 'Saiba mais sobre locacao',
  href: '/locacao',
};

function resolveSection<K extends ContentSection>(
  source: Partial<SiteContentState>,
  section: K,
): SiteContentState[K] {
  const value = source[section];
  if (value === undefined || value === null) {
    return getDefaultSection(section);
  }

  return value as SiteContentState[K];
}

function normalizeText(value: string | undefined | null): string {
  return value?.trim() ?? '';
}

function isInternalPath(value: string): boolean {
  return normalizeText(value).startsWith('/');
}

function resolveNavigationLinks(navLinks: NavLink[] | undefined): NavLink[] {
  const validLinks = (navLinks ?? [])
    .map((link) => ({
      label: normalizeText(link.label),
      href: normalizeText(link.href),
    }))
    .filter((link) => link.label && isInternalPath(link.href));

  if (validLinks.length === 0) {
    return FALLBACK_NAVIGATION_LINKS;
  }

  const uniqueByHref = new Map<string, NavLink>();
  for (const link of validLinks) {
    if (!uniqueByHref.has(link.href)) {
      uniqueByHref.set(link.href, link);
    }
  }

  return Array.from(uniqueByHref.values());
}

function resolveSiteSettings(sourceSettings: SiteSettings): SiteSettings {
  const defaults = getDefaultSection('siteSettings');

  return {
    ...defaults,
    ...sourceSettings,
    navLinks: sourceSettings.navLinks ?? defaults.navLinks,
  };
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
      href: '',
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
      href: '',
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

function resolveFooterContent(
  siteSettings: SiteSettings,
  navigationLinks: NavLink[],
): SiteFooterContent {
  const description =
    normalizeText(siteSettings.institutionalDescription) ||
    normalizeText(siteSettings.tagline) ||
    FALLBACK_FOOTER_DESCRIPTION;

  const configuredLeasingHref = normalizeText(siteSettings.footerLeasingHref);
  const configuredLeasingLabel = normalizeText(siteSettings.footerLeasingLabel);
  const leasingByConfig =
    isInternalPath(configuredLeasingHref) && configuredLeasingLabel
      ? { label: configuredLeasingLabel, href: configuredLeasingHref }
      : null;

  const leasingByNavigation =
    navigationLinks.find((link) => link.href === '/locacao') ??
    navigationLinks.find((link) => link.href.includes('locacao')) ??
    null;

  return {
    description,
    links: navigationLinks.slice(0, 6),
    leasingLink: leasingByConfig ?? leasingByNavigation ?? FALLBACK_FOOTER_LEASING_LINK,
    legalNote: normalizeText(siteSettings.footerLegalNote) || FALLBACK_FOOTER_LEGAL_NOTE,
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

function resolveHomeContent(sourceContent: HomePageContent): HomePageContent {
  const defaults = getDefaultSection('homeContent');

  const heroSlides = sourceContent.hero.slides.filter(
    (slide) =>
      normalizeText(slide.title) &&
      normalizeText(slide.subtitle) &&
      normalizeText(slide.cta) &&
      normalizeText(slide.href) &&
      normalizeText(slide.image),
  );

  const statsItems = sourceContent.stats.items.filter(
    (item) => normalizeText(item.value) && normalizeText(item.label),
  );

  return {
    ...defaults,
    ...sourceContent,
    hero: {
      ...defaults.hero,
      ...sourceContent.hero,
      slides: heroSlides.length > 0 ? heroSlides : defaults.hero.slides,
    },
    institutional: {
      ...defaults.institutional,
      ...sourceContent.institutional,
    },
    stats: {
      ...defaults.stats,
      ...sourceContent.stats,
      items: statsItems.length > 0 ? statsItems : defaults.stats.items,
    },
    featuredStores: {
      ...defaults.featuredStores,
      ...sourceContent.featuredStores,
    },
    partners: {
      ...defaults.partners,
      ...sourceContent.partners,
    },
    blogPreview: {
      ...defaults.blogPreview,
      ...sourceContent.blogPreview,
    },
    leasingCta: {
      ...defaults.leasingCta,
      ...sourceContent.leasingCta,
    },
  };
}

export function buildSiteContentSnapshot(
  source: Partial<SiteContentState>,
): SiteContentSnapshot {
  // Central place for future DTO->domain mapping when remote source is introduced.
  const stores = resolveSection(source, 'stores');
  const blogPosts = resolveSection(source, 'blogPosts');
  const partners = resolveSection(source, 'partners');
  const siteSettings = resolveSiteSettings(resolveSection(source, 'siteSettings'));
  const homeContent = resolveHomeContent(resolveSection(source, 'homeContent'));
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
  const footer = resolveFooterContent(siteSettings, navigationLinks);

  const storeSegments = buildStoreSegments(stores);
  const blogCategories = buildBlogCategories(blogPosts);
  const featuredStores = getFeaturedStores(stores);
  const { featuredBlogPost, blogFeedPosts } = splitBlogPosts(blogPosts);
  const blogPreviewPosts = blogPosts.slice(0, 3);

  const homeData: HomeContent = {
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
    homeContent,
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
    footer,
  };
}
