import { getDefaultSection } from '@/services/content/defaults';
import type {
  AboutContent,
  BlogPost,
  ContentSection,
  ContentState,
  HomePageContent,
  NavLink,
  Partner,
  SiteSettings,
  SpaceType,
  Store,
  Testimonial,
  LeasingBenefit,
} from '@/types';

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  return value as UnknownRecord;
}

function toStringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => toStringValue(item))
    .filter((item) => item.length > 0);
}

function normalizeNavLinks(value: unknown, fallback: NavLink[]): NavLink[] {
  if (!Array.isArray(value)) return fallback;

  const links: NavLink[] = [];
  for (const item of value) {
    const record = asRecord(item);
    if (!record) continue;

    const label = toStringValue(record.label);
    const href = toStringValue(record.href);
    if (!label || !href.startsWith('/')) continue;
    links.push({ label, href });
  }

  return links.length > 0 ? links : fallback;
}

function normalizeStores(value: unknown): Store[] {
  const fallback = getDefaultSection('stores');
  if (!Array.isArray(value)) return fallback;

  const stores: Store[] = [];

  for (const [index, item] of value.entries()) {
    const record = asRecord(item);
    if (!record) continue;

    const fallbackStore = fallback[index] ?? fallback[0];
    const images = toStringArray(record.images);
    const featuredValue =
      typeof record.featured === 'boolean' ? record.featured : fallbackStore?.featured;

    const store: Store = {
      id: toStringValue(record.id, `${fallbackStore?.id ?? 'store'}-${index + 1}`),
      name: toStringValue(record.name, fallbackStore?.name ?? `Loja ${index + 1}`),
      segment: toStringValue(record.segment, fallbackStore?.segment ?? 'Segmento'),
      segmentSlug: toStringValue(record.segmentSlug, fallbackStore?.segmentSlug ?? 'segmento'),
      floor: toStringValue(record.floor, fallbackStore?.floor ?? ''),
      description: toStringValue(record.description, fallbackStore?.description ?? ''),
      longDescription: toStringValue(record.longDescription, fallbackStore?.longDescription ?? ''),
      phone: toStringValue(record.phone, fallbackStore?.phone ?? ''),
      instagram: toStringValue(record.instagram, fallbackStore?.instagram ?? ''),
      images: images.length > 0 ? images : (fallbackStore?.images ?? []).slice(0, 1),
    };

    if (typeof featuredValue === 'boolean') {
      store.featured = featuredValue;
    }

    if (!store.id || !store.name) continue;
    stores.push(store);
  }

  return stores.length > 0 ? stores : fallback;
}

function normalizeBlogPosts(value: unknown): BlogPost[] {
  const fallback = getDefaultSection('blogPosts');
  if (!Array.isArray(value)) return fallback;

  const posts: BlogPost[] = [];

  for (const [index, item] of value.entries()) {
    const record = asRecord(item);
    if (!record) continue;

    const fallbackPost = fallback[index] ?? fallback[0];
    const featuredValue =
      typeof record.featured === 'boolean' ? record.featured : fallbackPost?.featured;

    const post: BlogPost = {
      slug: toStringValue(record.slug, `${fallbackPost?.slug ?? 'post'}-${index + 1}`),
      title: toStringValue(record.title, fallbackPost?.title ?? `Post ${index + 1}`),
      category: toStringValue(record.category, fallbackPost?.category ?? 'Categoria'),
      date: toStringValue(record.date, fallbackPost?.date ?? ''),
      excerpt: toStringValue(record.excerpt, fallbackPost?.excerpt ?? ''),
      content: toStringValue(record.content, fallbackPost?.content ?? ''),
      coverImage: toStringValue(record.coverImage, fallbackPost?.coverImage ?? ''),
      author: toStringValue(record.author, fallbackPost?.author ?? ''),
      readTime: toStringValue(record.readTime, fallbackPost?.readTime ?? ''),
    };

    if (typeof featuredValue === 'boolean') {
      post.featured = featuredValue;
    }

    if (!post.slug || !post.title) continue;
    posts.push(post);
  }

  return posts.length > 0 ? posts : fallback;
}

function normalizePartners(value: unknown): Partner[] {
  const fallback = getDefaultSection('partners');
  if (!Array.isArray(value)) return fallback;

  const partners: Partner[] = [];

  for (const [index, item] of value.entries()) {
    const record = asRecord(item);
    if (!record) continue;

    const fallbackPartner = fallback[index] ?? fallback[0];
    const name = toStringValue(record.name, fallbackPartner?.name ?? '');
    if (!name) continue;

    const partner: Partner = {
      id: toStringValue(record.id, `${fallbackPartner?.id ?? 'partner'}-${index + 1}`),
      name,
    };

    const logo = toOptionalString(record.logo) ?? fallbackPartner?.logo;
    if (logo) partner.logo = logo;

    partners.push(partner);
  }

  return partners.length > 0 ? partners : fallback;
}

function normalizeSiteSettings(value: unknown): SiteSettings {
  const fallback = getDefaultSection('siteSettings');
  const record = asRecord(value);
  if (!record) return fallback;

  return {
    ...fallback,
    name: toStringValue(record.name, fallback.name),
    tagline: toStringValue(record.tagline, fallback.tagline),
    institutionalDescription: toStringValue(
      record.institutionalDescription,
      fallback.institutionalDescription,
    ),
    address: toStringValue(record.address, fallback.address),
    phone: toStringValue(record.phone, fallback.phone),
    email: toStringValue(record.email, fallback.email),
    hours: toStringValue(record.hours, fallback.hours),
    instagram: toStringValue(record.instagram, fallback.instagram),
    facebook: toStringValue(record.facebook, fallback.facebook),
    footerLeasingLabel: toStringValue(record.footerLeasingLabel, fallback.footerLeasingLabel),
    footerLeasingHref: toStringValue(record.footerLeasingHref, fallback.footerLeasingHref),
    footerLegalNote: toStringValue(record.footerLegalNote, fallback.footerLegalNote),
    navLinks: normalizeNavLinks(record.navLinks, fallback.navLinks),
  };
}

const HOME_INSTITUTIONAL_FIELDS = [
  'eyebrow',
  'title',
  'titleHighlight',
  'leadParagraph',
  'secondaryParagraph',
  'ctaLabel',
  'ctaHref',
  'imagePrimary',
  'imageSecondary',
  'floatingStatValue',
  'floatingStatLabel',
] as const;

const HOME_SECTION_HIGHLIGHT_FIELDS = [
  'eyebrow',
  'title',
  'titleHighlight',
  'ctaLabel',
  'ctaHref',
  'emptyMessage',
] as const;

const HOME_PARTNERS_FIELDS = ['eyebrow', 'emptyMessage'] as const;

const HOME_LEASING_CTA_FIELDS = [
  'eyebrow',
  'title',
  'titleHighlight',
  'description',
  'ctaLabel',
  'ctaHref',
  'backgroundImage',
] as const;

function normalizeHomeContent(value: unknown): HomePageContent {
  const fallback = getDefaultSection('homeContent');
  const record = asRecord(value);
  if (!record) return fallback;

  const heroRecord = asRecord(record.hero);
  const heroSlides: HomePageContent['hero']['slides'] = [];
  const heroSource = heroRecord?.slides;
  if (Array.isArray(heroSource)) {
    for (const [index, slide] of heroSource.entries()) {
      const slideRecord = asRecord(slide);
      if (!slideRecord) continue;

      const fallbackSlide = fallback.hero.slides[index] ?? fallback.hero.slides[0];
      if (!fallbackSlide) continue;

      const normalizedSlide: HomePageContent['hero']['slides'][number] = {
        title: toStringValue(slideRecord.title, fallbackSlide.title),
        subtitle: toStringValue(slideRecord.subtitle, fallbackSlide.subtitle),
        cta: toStringValue(slideRecord.cta, fallbackSlide.cta),
        href: toStringValue(slideRecord.href, fallbackSlide.href),
        image: toStringValue(slideRecord.image, fallbackSlide.image),
      };

      const slideId = toStringValue(slideRecord.id, fallbackSlide.id ?? `home-slide-${index + 1}`);
      if (slideId) normalizedSlide.id = slideId;
      heroSlides.push(normalizedSlide);
    }
  }

  const institutionalRecord = asRecord(record.institutional);
  const institutional: HomePageContent['institutional'] = { ...fallback.institutional };
  for (const field of HOME_INSTITUTIONAL_FIELDS) {
    institutional[field] = toStringValue(
      institutionalRecord?.[field],
      fallback.institutional[field],
    );
  }

  const featuredRecord = asRecord(record.featuredStores);
  const featuredStores: HomePageContent['featuredStores'] = { ...fallback.featuredStores };
  for (const field of HOME_SECTION_HIGHLIGHT_FIELDS) {
    featuredStores[field] = toStringValue(featuredRecord?.[field], fallback.featuredStores[field]);
  }

  const partnersRecord = asRecord(record.partners);
  const partners: HomePageContent['partners'] = { ...fallback.partners };
  for (const field of HOME_PARTNERS_FIELDS) {
    partners[field] = toStringValue(partnersRecord?.[field], fallback.partners[field]);
  }

  const blogPreviewRecord = asRecord(record.blogPreview);
  const blogPreview: HomePageContent['blogPreview'] = { ...fallback.blogPreview };
  for (const field of HOME_SECTION_HIGHLIGHT_FIELDS) {
    blogPreview[field] = toStringValue(blogPreviewRecord?.[field], fallback.blogPreview[field]);
  }

  const leasingCtaRecord = asRecord(record.leasingCta);
  const leasingCta: HomePageContent['leasingCta'] = { ...fallback.leasingCta };
  for (const field of HOME_LEASING_CTA_FIELDS) {
    leasingCta[field] = toStringValue(leasingCtaRecord?.[field], fallback.leasingCta[field]);
  }

  const statsRecord = asRecord(record.stats);
  const statsItems: HomePageContent['stats']['items'] = [];
  const statsSource = statsRecord?.items;
  if (Array.isArray(statsSource)) {
    for (const [index, item] of statsSource.entries()) {
      const itemRecord = asRecord(item);
      if (!itemRecord) continue;

      const fallbackItem = fallback.stats.items[index] ?? fallback.stats.items[0];
      if (!fallbackItem) continue;

      statsItems.push({
        value: toStringValue(itemRecord.value, fallbackItem.value),
        label: toStringValue(itemRecord.label, fallbackItem.label),
      });
    }
  }

  return {
    hero: {
      eyebrow: toStringValue(heroRecord?.eyebrow, fallback.hero.eyebrow),
      slides: heroSlides.length > 0 ? heroSlides : fallback.hero.slides,
    },
    institutional,
    stats: {
      backgroundWord: toStringValue(statsRecord?.backgroundWord, fallback.stats.backgroundWord),
      items: statsItems.length > 0 ? statsItems : fallback.stats.items,
    },
    featuredStores,
    partners,
    blogPreview,
    leasingCta,
  };
}

function normalizeLeasingBenefits(value: unknown): LeasingBenefit[] {
  const fallback = getDefaultSection('leasingBenefits');
  if (!Array.isArray(value)) return fallback;

  const benefits: LeasingBenefit[] = [];
  for (const [index, item] of value.entries()) {
    const record = asRecord(item);
    if (!record) continue;

    const fallbackBenefit = fallback[index] ?? fallback[0];
    const benefit: LeasingBenefit = {
      icon: toStringValue(record.icon, fallbackBenefit?.icon ?? 'Star'),
      title: toStringValue(record.title, fallbackBenefit?.title ?? `Beneficio ${index + 1}`),
      description: toStringValue(record.description, fallbackBenefit?.description ?? ''),
    };

    if (!benefit.title) continue;
    benefits.push(benefit);
  }

  return benefits.length > 0 ? benefits : fallback;
}

function normalizeSpaceTypes(value: unknown): SpaceType[] {
  const fallback = getDefaultSection('spaceTypes');
  if (!Array.isArray(value)) return fallback;

  const spaces: SpaceType[] = [];
  for (const [index, item] of value.entries()) {
    const record = asRecord(item);
    if (!record) continue;

    const fallbackSpace = fallback[index] ?? fallback[0];
    const space: SpaceType = {
      name: toStringValue(record.name, fallbackSpace?.name ?? `Espaco ${index + 1}`),
      size: toStringValue(record.size, fallbackSpace?.size ?? ''),
      description: toStringValue(record.description, fallbackSpace?.description ?? ''),
    };

    if (!space.name) continue;
    spaces.push(space);
  }

  return spaces.length > 0 ? spaces : fallback;
}

function normalizeTestimonials(value: unknown): Testimonial[] {
  const fallback = getDefaultSection('testimonials');
  if (!Array.isArray(value)) return fallback;

  const testimonials: Testimonial[] = [];
  for (const [index, item] of value.entries()) {
    const record = asRecord(item);
    if (!record) continue;

    const fallbackTestimonial = fallback[index] ?? fallback[0];
    const testimonial: Testimonial = {
      name: toStringValue(record.name, fallbackTestimonial?.name ?? `Cliente ${index + 1}`),
      store: toStringValue(record.store, fallbackTestimonial?.store ?? ''),
      text: toStringValue(record.text, fallbackTestimonial?.text ?? ''),
    };

    if (!testimonial.name) continue;
    testimonials.push(testimonial);
  }

  return testimonials.length > 0 ? testimonials : fallback;
}

function normalizeLeasingDifferentials(value: unknown): string[] {
  const fallback = getDefaultSection('leasingDifferentials');
  const differentials = toStringArray(value);
  return differentials.length > 0 ? differentials : fallback;
}

function normalizeAboutData(value: unknown): AboutContent {
  const fallback = getDefaultSection('aboutData');
  const record = asRecord(value);
  if (!record) return fallback;

  const history = toStringArray(record.history);
  const differentials = toStringArray(record.differentials);

  const values: AboutContent['values'] = [];
  const valuesSource = record.values;
  if (Array.isArray(valuesSource)) {
    for (const [index, item] of valuesSource.entries()) {
      const valueRecord = asRecord(item);
      if (!valueRecord) continue;

      const fallbackValue = fallback.values[index] ?? fallback.values[0];
      const title = toStringValue(valueRecord.title, fallbackValue?.title ?? '');
      const description = toStringValue(valueRecord.description, fallbackValue?.description ?? '');
      if (!title || !description) continue;
      values.push({ title, description });
    }
  }

  const team: AboutContent['team'] = [];
  const teamSource = record.team;
  if (Array.isArray(teamSource)) {
    for (const [index, item] of teamSource.entries()) {
      const memberRecord = asRecord(item);
      if (!memberRecord) continue;

      const fallbackMember = fallback.team[index] ?? fallback.team[0];
      const name = toStringValue(memberRecord.name, fallbackMember?.name ?? '');
      const role = toStringValue(memberRecord.role, fallbackMember?.role ?? '');
      const description = toStringValue(
        memberRecord.description,
        fallbackMember?.description ?? '',
      );
      if (!name || !role || !description) continue;
      team.push({ name, role, description });
    }
  }

  return {
    history: history.length > 0 ? history : fallback.history,
    mission: toStringValue(record.mission, fallback.mission),
    vision: toStringValue(record.vision, fallback.vision),
    values: values.length > 0 ? values : fallback.values,
    differentials: differentials.length > 0 ? differentials : fallback.differentials,
    team: team.length > 0 ? team : fallback.team,
  };
}

export function createSectionStorageKey(namespace: string, section: ContentSection): string {
  return `${namespace}_${section}`;
}

// Keep payload mapping explicit in one place; Supabase adapters can evolve this shape.
export function mapDomainToStoredValue<T>(value: T): T {
  return value;
}

export function mapStoredToDomainSectionValue<K extends ContentSection>(
  section: K,
  value: unknown,
): ContentState[K] {
  switch (section) {
    case 'stores':
      return normalizeStores(value) as ContentState[K];
    case 'blogPosts':
      return normalizeBlogPosts(value) as ContentState[K];
    case 'partners':
      return normalizePartners(value) as ContentState[K];
    case 'siteSettings':
      return normalizeSiteSettings(value) as ContentState[K];
    case 'homeContent':
      return normalizeHomeContent(value) as ContentState[K];
    case 'leasingBenefits':
      return normalizeLeasingBenefits(value) as ContentState[K];
    case 'spaceTypes':
      return normalizeSpaceTypes(value) as ContentState[K];
    case 'testimonials':
      return normalizeTestimonials(value) as ContentState[K];
    case 'leasingDifferentials':
      return normalizeLeasingDifferentials(value) as ContentState[K];
    case 'aboutData':
      return normalizeAboutData(value) as ContentState[K];
  }
}
