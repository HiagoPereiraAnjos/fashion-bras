import {
  aboutDifferentialsTable,
  aboutHistoryItemsTable,
  aboutMetaTable,
  aboutTeamMembersTable,
  aboutValuesTable,
  adminUsersTable,
  blogPostsTable,
  db,
  homeHeroSlidesTable,
  homeSettingsTable,
  homeStatsItemsTable,
  leasingBenefitsTable,
  leasingDifferentialsTable,
  leasingSpaceTypesTable,
  leasingTestimonialsTable,
  partnersTable,
  siteNavLinksTable,
  siteSettingsTable,
  storeImagesTable,
  storesTable,
} from "@workspace/db";
import { asc, eq, inArray, notInArray, sql } from "drizzle-orm";
import type { SiteContentState } from "@workspace/api-zod";
import { getContentBaseline, getDefaultSection } from "../../content/baseline";
import { CONTENT_SECTIONS, type ContentSection } from "../../content/sections";
import { HttpError } from "../../lib/httpError";

const SINGLETON_ID = "singleton";
const ENABLE_BASELINE_FALLBACK = process.env.CONTENT_BASELINE_FALLBACK === "true";

type DbExecutor = typeof db | any;

function ensureSectionValue<K extends ContentSection>(
  section: K,
  value: SiteContentState[K] | null,
): SiteContentState[K] {
  if (value !== null) return value;

  if (ENABLE_BASELINE_FALLBACK) {
    console.warn(
      `[content] Section "${section}" missing in DB, using baseline fallback because CONTENT_BASELINE_FALLBACK=true.`,
    );
    return getDefaultSection(section);
  }

  throw new HttpError(
    503,
    "Content Not Initialized",
    `Section "${section}" has no persisted records in Postgres. Run the baseline seed before serving content.`,
  );
}

function resolvePublicStorageBaseUrl(): string | null {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "");
  if (!supabaseUrl) return null;

  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "site-media";
  return `${supabaseUrl}/storage/v1/object/public/${bucket}`;
}

function normalizeMediaReference(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^data:/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const normalizedPath = trimmed.replace(/^\/+/, "");
  const publicBaseUrl = resolvePublicStorageBaseUrl();
  if (!publicBaseUrl) return normalizedPath;

  return `${publicBaseUrl}/${normalizedPath}`;
}

async function readStoresFromDb(executor: DbExecutor): Promise<SiteContentState["stores"] | null> {
  const rows = await executor
    .select()
    .from(storesTable)
    .orderBy(asc(storesTable.position));
  if (rows.length === 0) return [];

  const imageRows = await executor
    .select()
    .from(storeImagesTable)
    .orderBy(asc(storeImagesTable.storeId), asc(storeImagesTable.position));

  const imagesByStore = new Map<string, string[]>();
  for (const imageRow of imageRows) {
    const images = imagesByStore.get(imageRow.storeId) ?? [];
    images.push(imageRow.url);
    imagesByStore.set(imageRow.storeId, images);
  }

  return rows.map((row: typeof storesTable.$inferSelect) => ({
    id: row.id,
    name: row.name,
    segment: row.segment,
    segmentSlug: row.segmentSlug,
    floor: row.floor,
    description: row.description,
    longDescription: row.longDescription,
    phone: row.phone,
    instagram: row.instagram,
    featured: row.featured,
    images: imagesByStore.get(row.id) ?? [],
  }));
}

async function readBlogPostsFromDb(
  executor: DbExecutor,
): Promise<SiteContentState["blogPosts"] | null> {
  const rows = await executor
    .select()
    .from(blogPostsTable)
    .orderBy(asc(blogPostsTable.position));
  if (rows.length === 0) return [];

  return rows.map((row: typeof blogPostsTable.$inferSelect) => ({
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.date,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage,
    author: row.author,
    readTime: row.readTime,
    featured: row.featured,
  }));
}

async function readPartnersFromDb(executor: DbExecutor): Promise<SiteContentState["partners"] | null> {
  const rows = await executor
    .select()
    .from(partnersTable)
    .orderBy(asc(partnersTable.position));
  if (rows.length === 0) return [];

  return rows.map((row: typeof partnersTable.$inferSelect) => ({
    id: row.id,
    name: row.name,
    logo: row.logo ?? undefined,
  }));
}

async function readSiteSettingsFromDb(
  executor: DbExecutor,
): Promise<SiteContentState["siteSettings"] | null> {
  const rows = await executor
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.id, SINGLETON_ID))
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  const navRows = await executor
    .select()
    .from(siteNavLinksTable)
    .where(eq(siteNavLinksTable.siteSettingsId, SINGLETON_ID))
    .orderBy(asc(siteNavLinksTable.position));

  return {
    name: row.name,
    tagline: row.tagline,
    institutionalDescription: row.institutionalDescription,
    address: row.address,
    phone: row.phone,
    email: row.email,
    hours: row.hours,
    instagram: row.instagram,
    facebook: row.facebook,
    footerLeasingLabel: row.footerLeasingLabel,
    footerLeasingHref: row.footerLeasingHref,
    footerLegalNote: row.footerLegalNote,
    navLinks: navRows.map((link: typeof siteNavLinksTable.$inferSelect) => ({
      label: link.label,
      href: link.href,
    })),
  };
}

async function readHomeContentFromDb(
  executor: DbExecutor,
): Promise<SiteContentState["homeContent"] | null> {
  const rows = await executor
    .select()
    .from(homeSettingsTable)
    .where(eq(homeSettingsTable.id, SINGLETON_ID))
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  const heroSlidesRows = await executor
    .select()
    .from(homeHeroSlidesTable)
    .where(eq(homeHeroSlidesTable.homeSettingsId, SINGLETON_ID))
    .orderBy(asc(homeHeroSlidesTable.position));

  const statsRows = await executor
    .select()
    .from(homeStatsItemsTable)
    .where(eq(homeStatsItemsTable.homeSettingsId, SINGLETON_ID))
    .orderBy(asc(homeStatsItemsTable.position));

  return {
    hero: {
      eyebrow: row.heroEyebrow,
      slides: heroSlidesRows.map((slide: typeof homeHeroSlidesTable.$inferSelect) => ({
        id: slide.slideId ?? undefined,
        title: slide.title,
        subtitle: slide.subtitle,
        cta: slide.cta,
        href: slide.href,
        image: slide.image,
      })),
    },
    institutional: {
      eyebrow: row.institutionalEyebrow,
      title: row.institutionalTitle,
      titleHighlight: row.institutionalTitleHighlight,
      leadParagraph: row.institutionalLeadParagraph,
      secondaryParagraph: row.institutionalSecondaryParagraph,
      ctaLabel: row.institutionalCtaLabel,
      ctaHref: row.institutionalCtaHref,
      imagePrimary: row.institutionalImagePrimary,
      imageSecondary: row.institutionalImageSecondary,
      floatingStatValue: row.institutionalFloatingStatValue,
      floatingStatLabel: row.institutionalFloatingStatLabel,
    },
    stats: {
      backgroundWord: row.statsBackgroundWord,
      items: statsRows.map((item: typeof homeStatsItemsTable.$inferSelect) => ({
        value: item.value,
        label: item.label,
      })),
    },
    featuredStores: {
      eyebrow: row.featuredStoresEyebrow,
      title: row.featuredStoresTitle,
      titleHighlight: row.featuredStoresTitleHighlight,
      ctaLabel: row.featuredStoresCtaLabel,
      ctaHref: row.featuredStoresCtaHref,
      emptyMessage: row.featuredStoresEmptyMessage,
    },
    partners: {
      eyebrow: row.partnersEyebrow,
      emptyMessage: row.partnersEmptyMessage,
    },
    blogPreview: {
      eyebrow: row.blogPreviewEyebrow,
      title: row.blogPreviewTitle,
      titleHighlight: row.blogPreviewTitleHighlight,
      ctaLabel: row.blogPreviewCtaLabel,
      ctaHref: row.blogPreviewCtaHref,
      emptyMessage: row.blogPreviewEmptyMessage,
    },
    leasingCta: {
      eyebrow: row.leasingCtaEyebrow,
      title: row.leasingCtaTitle,
      titleHighlight: row.leasingCtaTitleHighlight,
      description: row.leasingCtaDescription,
      ctaLabel: row.leasingCtaLabel,
      ctaHref: row.leasingCtaHref,
      backgroundImage: row.leasingCtaBackgroundImage,
    },
  };
}

async function readLeasingBenefitsFromDb(
  executor: DbExecutor,
): Promise<SiteContentState["leasingBenefits"] | null> {
  const rows = await executor
    .select()
    .from(leasingBenefitsTable)
    .orderBy(asc(leasingBenefitsTable.position));
  if (rows.length === 0) return [];

  return rows.map((row: typeof leasingBenefitsTable.$inferSelect) => ({
    icon: row.icon,
    title: row.title,
    description: row.description,
  }));
}

async function readSpaceTypesFromDb(
  executor: DbExecutor,
): Promise<SiteContentState["spaceTypes"] | null> {
  const rows = await executor
    .select()
    .from(leasingSpaceTypesTable)
    .orderBy(asc(leasingSpaceTypesTable.position));
  if (rows.length === 0) return [];

  return rows.map((row: typeof leasingSpaceTypesTable.$inferSelect) => ({
    name: row.name,
    size: row.size,
    description: row.description,
  }));
}

async function readTestimonialsFromDb(
  executor: DbExecutor,
): Promise<SiteContentState["testimonials"] | null> {
  const rows = await executor
    .select()
    .from(leasingTestimonialsTable)
    .orderBy(asc(leasingTestimonialsTable.position));
  if (rows.length === 0) return [];

  return rows.map((row: typeof leasingTestimonialsTable.$inferSelect) => ({
    name: row.name,
    store: row.store,
    text: row.text,
  }));
}

async function readLeasingDifferentialsFromDb(
  executor: DbExecutor,
): Promise<SiteContentState["leasingDifferentials"] | null> {
  const rows = await executor
    .select()
    .from(leasingDifferentialsTable)
    .orderBy(asc(leasingDifferentialsTable.position));
  if (rows.length === 0) return [];

  return rows.map((row: typeof leasingDifferentialsTable.$inferSelect) => row.value);
}

async function readAboutDataFromDb(executor: DbExecutor): Promise<SiteContentState["aboutData"] | null> {
  const metaRows = await executor
    .select()
    .from(aboutMetaTable)
    .where(eq(aboutMetaTable.id, SINGLETON_ID))
    .limit(1);
  const meta = metaRows[0];
  if (!meta) return null;

  const historyRows = await executor
    .select()
    .from(aboutHistoryItemsTable)
    .orderBy(asc(aboutHistoryItemsTable.position));
  const valueRows = await executor
    .select()
    .from(aboutValuesTable)
    .orderBy(asc(aboutValuesTable.position));
  const differentialRows = await executor
    .select()
    .from(aboutDifferentialsTable)
    .orderBy(asc(aboutDifferentialsTable.position));
  const teamRows = await executor
    .select()
    .from(aboutTeamMembersTable)
    .orderBy(asc(aboutTeamMembersTable.position));

  return {
    history: historyRows.map((row: typeof aboutHistoryItemsTable.$inferSelect) => row.value),
    mission: meta.mission,
    vision: meta.vision,
    values: valueRows.map((row: typeof aboutValuesTable.$inferSelect) => ({
      title: row.title,
      description: row.description,
    })),
    differentials: differentialRows.map(
      (row: typeof aboutDifferentialsTable.$inferSelect) => row.value,
    ),
    team: teamRows.map((row: typeof aboutTeamMembersTable.$inferSelect) => ({
      name: row.name,
      role: row.role,
      description: row.description,
    })),
  };
}

async function writeStores(executor: DbExecutor, stores: SiteContentState["stores"]) {
  if (stores.length === 0) {
    await executor.delete(storeImagesTable);
    await executor.delete(storesTable);
    return;
  }

  const now = new Date();
  const incomingStoreIds = stores.map((store: SiteContentState["stores"][number]) => store.id);

  await executor
    .insert(storesTable)
    .values(
      stores.map((store: SiteContentState["stores"][number], index: number) => ({
        id: store.id,
        position: index,
        name: store.name,
        segment: store.segment,
        segmentSlug: store.segmentSlug,
        floor: store.floor,
        description: store.description,
        longDescription: store.longDescription,
        phone: store.phone,
        instagram: store.instagram,
        featured: Boolean(store.featured),
      })),
    )
    .onConflictDoUpdate({
      target: storesTable.id,
      set: {
        position: sql`excluded.position`,
        name: sql`excluded.name`,
        segment: sql`excluded.segment`,
        segmentSlug: sql`excluded.segment_slug`,
        floor: sql`excluded.floor`,
        description: sql`excluded.description`,
        longDescription: sql`excluded.long_description`,
        phone: sql`excluded.phone`,
        instagram: sql`excluded.instagram`,
        featured: sql`excluded.featured`,
        updatedAt: now,
      },
    });

  await executor.delete(storesTable).where(notInArray(storesTable.id, incomingStoreIds));
  await executor.delete(storeImagesTable).where(inArray(storeImagesTable.storeId, incomingStoreIds));

  const imageValues = stores.flatMap((store: SiteContentState["stores"][number]) =>
    store.images.map((image: string, index: number) => ({
      storeId: store.id,
      position: index,
      url: normalizeMediaReference(image),
    })),
  );

  if (imageValues.length > 0) {
    await executor.insert(storeImagesTable).values(imageValues);
  }
}

async function writeBlogPosts(
  executor: DbExecutor,
  blogPosts: SiteContentState["blogPosts"],
) {
  if (blogPosts.length === 0) {
    await executor.delete(blogPostsTable);
    return;
  }

  const now = new Date();
  const incomingSlugs = blogPosts.map((post: SiteContentState["blogPosts"][number]) => post.slug);

  await executor
    .insert(blogPostsTable)
    .values(
      blogPosts.map((post: SiteContentState["blogPosts"][number], index: number) => ({
        slug: post.slug,
        position: index,
        title: post.title,
        category: post.category,
        date: post.date,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: normalizeMediaReference(post.coverImage),
        author: post.author,
        readTime: post.readTime,
        featured: Boolean(post.featured),
      })),
    )
    .onConflictDoUpdate({
      target: blogPostsTable.slug,
      set: {
        position: sql`excluded.position`,
        title: sql`excluded.title`,
        category: sql`excluded.category`,
        date: sql`excluded.date`,
        excerpt: sql`excluded.excerpt`,
        content: sql`excluded.content`,
        coverImage: sql`excluded.cover_image`,
        author: sql`excluded.author`,
        readTime: sql`excluded.read_time`,
        featured: sql`excluded.featured`,
        updatedAt: now,
      },
    });

  await executor.delete(blogPostsTable).where(notInArray(blogPostsTable.slug, incomingSlugs));
}

async function writePartners(executor: DbExecutor, partners: SiteContentState["partners"]) {
  if (partners.length === 0) {
    await executor.delete(partnersTable);
    return;
  }

  const now = new Date();
  const incomingPartnerIds = partners.map(
    (partner: SiteContentState["partners"][number]) => partner.id,
  );

  await executor
    .insert(partnersTable)
    .values(
      partners.map((partner: SiteContentState["partners"][number], index: number) => ({
        id: partner.id,
        position: index,
        name: partner.name,
        logo: partner.logo ? normalizeMediaReference(partner.logo) : null,
      })),
    )
    .onConflictDoUpdate({
      target: partnersTable.id,
      set: {
        position: sql`excluded.position`,
        name: sql`excluded.name`,
        logo: sql`excluded.logo`,
        updatedAt: now,
      },
    });

  await executor.delete(partnersTable).where(notInArray(partnersTable.id, incomingPartnerIds));
}

async function writeSiteSettings(
  executor: DbExecutor,
  siteSettings: SiteContentState["siteSettings"],
) {
  const now = new Date();

  await executor
    .insert(siteSettingsTable)
    .values({
      id: SINGLETON_ID,
      name: siteSettings.name,
      tagline: siteSettings.tagline,
      institutionalDescription: siteSettings.institutionalDescription,
      address: siteSettings.address,
      phone: siteSettings.phone,
      email: siteSettings.email,
      hours: siteSettings.hours,
      instagram: siteSettings.instagram,
      facebook: siteSettings.facebook,
      footerLeasingLabel: siteSettings.footerLeasingLabel,
      footerLeasingHref: siteSettings.footerLeasingHref,
      footerLegalNote: siteSettings.footerLegalNote,
    })
    .onConflictDoUpdate({
      target: siteSettingsTable.id,
      set: {
        name: sql`excluded.name`,
        tagline: sql`excluded.tagline`,
        institutionalDescription: sql`excluded.institutional_description`,
        address: sql`excluded.address`,
        phone: sql`excluded.phone`,
        email: sql`excluded.email`,
        hours: sql`excluded.hours`,
        instagram: sql`excluded.instagram`,
        facebook: sql`excluded.facebook`,
        footerLeasingLabel: sql`excluded.footer_leasing_label`,
        footerLeasingHref: sql`excluded.footer_leasing_href`,
        footerLegalNote: sql`excluded.footer_legal_note`,
        updatedAt: now,
      },
    });

  await executor
    .delete(siteNavLinksTable)
    .where(eq(siteNavLinksTable.siteSettingsId, SINGLETON_ID));

  if (siteSettings.navLinks.length > 0) {
    await executor.insert(siteNavLinksTable).values(
      siteSettings.navLinks.map(
        (link: SiteContentState["siteSettings"]["navLinks"][number], index: number) => ({
        siteSettingsId: SINGLETON_ID,
        position: index,
        label: link.label,
        href: link.href,
      }),
      ),
    );
  }
}

async function writeHomeContent(
  executor: DbExecutor,
  homeContent: SiteContentState["homeContent"],
) {
  const now = new Date();

  await executor
    .insert(homeSettingsTable)
    .values({
      id: SINGLETON_ID,
      heroEyebrow: homeContent.hero.eyebrow,
      institutionalEyebrow: homeContent.institutional.eyebrow,
      institutionalTitle: homeContent.institutional.title,
      institutionalTitleHighlight: homeContent.institutional.titleHighlight,
      institutionalLeadParagraph: homeContent.institutional.leadParagraph,
      institutionalSecondaryParagraph: homeContent.institutional.secondaryParagraph,
      institutionalCtaLabel: homeContent.institutional.ctaLabel,
      institutionalCtaHref: homeContent.institutional.ctaHref,
      institutionalImagePrimary: normalizeMediaReference(
        homeContent.institutional.imagePrimary,
      ),
      institutionalImageSecondary: normalizeMediaReference(
        homeContent.institutional.imageSecondary,
      ),
      institutionalFloatingStatValue: homeContent.institutional.floatingStatValue,
      institutionalFloatingStatLabel: homeContent.institutional.floatingStatLabel,
      statsBackgroundWord: homeContent.stats.backgroundWord,
      featuredStoresEyebrow: homeContent.featuredStores.eyebrow,
      featuredStoresTitle: homeContent.featuredStores.title,
      featuredStoresTitleHighlight: homeContent.featuredStores.titleHighlight,
      featuredStoresCtaLabel: homeContent.featuredStores.ctaLabel,
      featuredStoresCtaHref: homeContent.featuredStores.ctaHref,
      featuredStoresEmptyMessage: homeContent.featuredStores.emptyMessage,
      partnersEyebrow: homeContent.partners.eyebrow,
      partnersEmptyMessage: homeContent.partners.emptyMessage,
      blogPreviewEyebrow: homeContent.blogPreview.eyebrow,
      blogPreviewTitle: homeContent.blogPreview.title,
      blogPreviewTitleHighlight: homeContent.blogPreview.titleHighlight,
      blogPreviewCtaLabel: homeContent.blogPreview.ctaLabel,
      blogPreviewCtaHref: homeContent.blogPreview.ctaHref,
      blogPreviewEmptyMessage: homeContent.blogPreview.emptyMessage,
      leasingCtaEyebrow: homeContent.leasingCta.eyebrow,
      leasingCtaTitle: homeContent.leasingCta.title,
      leasingCtaTitleHighlight: homeContent.leasingCta.titleHighlight,
      leasingCtaDescription: homeContent.leasingCta.description,
      leasingCtaLabel: homeContent.leasingCta.ctaLabel,
      leasingCtaHref: homeContent.leasingCta.ctaHref,
      leasingCtaBackgroundImage: normalizeMediaReference(
        homeContent.leasingCta.backgroundImage,
      ),
    })
    .onConflictDoUpdate({
      target: homeSettingsTable.id,
      set: {
        heroEyebrow: sql`excluded.hero_eyebrow`,
        institutionalEyebrow: sql`excluded.institutional_eyebrow`,
        institutionalTitle: sql`excluded.institutional_title`,
        institutionalTitleHighlight: sql`excluded.institutional_title_highlight`,
        institutionalLeadParagraph: sql`excluded.institutional_lead_paragraph`,
        institutionalSecondaryParagraph: sql`excluded.institutional_secondary_paragraph`,
        institutionalCtaLabel: sql`excluded.institutional_cta_label`,
        institutionalCtaHref: sql`excluded.institutional_cta_href`,
        institutionalImagePrimary: sql`excluded.institutional_image_primary`,
        institutionalImageSecondary: sql`excluded.institutional_image_secondary`,
        institutionalFloatingStatValue: sql`excluded.institutional_floating_stat_value`,
        institutionalFloatingStatLabel: sql`excluded.institutional_floating_stat_label`,
        statsBackgroundWord: sql`excluded.stats_background_word`,
        featuredStoresEyebrow: sql`excluded.featured_stores_eyebrow`,
        featuredStoresTitle: sql`excluded.featured_stores_title`,
        featuredStoresTitleHighlight: sql`excluded.featured_stores_title_highlight`,
        featuredStoresCtaLabel: sql`excluded.featured_stores_cta_label`,
        featuredStoresCtaHref: sql`excluded.featured_stores_cta_href`,
        featuredStoresEmptyMessage: sql`excluded.featured_stores_empty_message`,
        partnersEyebrow: sql`excluded.partners_eyebrow`,
        partnersEmptyMessage: sql`excluded.partners_empty_message`,
        blogPreviewEyebrow: sql`excluded.blog_preview_eyebrow`,
        blogPreviewTitle: sql`excluded.blog_preview_title`,
        blogPreviewTitleHighlight: sql`excluded.blog_preview_title_highlight`,
        blogPreviewCtaLabel: sql`excluded.blog_preview_cta_label`,
        blogPreviewCtaHref: sql`excluded.blog_preview_cta_href`,
        blogPreviewEmptyMessage: sql`excluded.blog_preview_empty_message`,
        leasingCtaEyebrow: sql`excluded.leasing_cta_eyebrow`,
        leasingCtaTitle: sql`excluded.leasing_cta_title`,
        leasingCtaTitleHighlight: sql`excluded.leasing_cta_title_highlight`,
        leasingCtaDescription: sql`excluded.leasing_cta_description`,
        leasingCtaLabel: sql`excluded.leasing_cta_label`,
        leasingCtaHref: sql`excluded.leasing_cta_href`,
        leasingCtaBackgroundImage: sql`excluded.leasing_cta_background_image`,
        updatedAt: now,
      },
    });

  await executor
    .delete(homeHeroSlidesTable)
    .where(eq(homeHeroSlidesTable.homeSettingsId, SINGLETON_ID));
  await executor
    .delete(homeStatsItemsTable)
    .where(eq(homeStatsItemsTable.homeSettingsId, SINGLETON_ID));

  if (homeContent.hero.slides.length > 0) {
    await executor.insert(homeHeroSlidesTable).values(
      homeContent.hero.slides.map(
        (slide: SiteContentState["homeContent"]["hero"]["slides"][number], index: number) => ({
        homeSettingsId: SINGLETON_ID,
        position: index,
        slideId: slide.id ?? null,
        title: slide.title,
        subtitle: slide.subtitle,
        cta: slide.cta,
        href: slide.href,
        image: normalizeMediaReference(slide.image),
      }),
      ),
    );
  }

  if (homeContent.stats.items.length > 0) {
    await executor.insert(homeStatsItemsTable).values(
      homeContent.stats.items.map(
        (item: SiteContentState["homeContent"]["stats"]["items"][number], index: number) => ({
        homeSettingsId: SINGLETON_ID,
        position: index,
        value: item.value,
        label: item.label,
      }),
      ),
    );
  }
}

async function writeLeasingBenefits(
  executor: DbExecutor,
  leasingBenefits: SiteContentState["leasingBenefits"],
) {
  if (leasingBenefits.length === 0) {
    await executor.delete(leasingBenefitsTable);
    return;
  }

  const now = new Date();
  const positions = leasingBenefits.map((_benefit, index) => index);

  await executor
    .insert(leasingBenefitsTable)
    .values(
      leasingBenefits.map(
        (benefit: SiteContentState["leasingBenefits"][number], index: number) => ({
          position: index,
          icon: benefit.icon,
          title: benefit.title,
          description: benefit.description,
        }),
      ),
    )
    .onConflictDoUpdate({
      target: leasingBenefitsTable.position,
      set: {
        icon: sql`excluded.icon`,
        title: sql`excluded.title`,
        description: sql`excluded.description`,
        updatedAt: now,
      },
    });

  await executor
    .delete(leasingBenefitsTable)
    .where(notInArray(leasingBenefitsTable.position, positions));
}

async function writeSpaceTypes(executor: DbExecutor, spaceTypes: SiteContentState["spaceTypes"]) {
  if (spaceTypes.length === 0) {
    await executor.delete(leasingSpaceTypesTable);
    return;
  }

  const now = new Date();
  const positions = spaceTypes.map((_spaceType, index) => index);

  await executor
    .insert(leasingSpaceTypesTable)
    .values(
      spaceTypes.map((spaceType: SiteContentState["spaceTypes"][number], index: number) => ({
        position: index,
        name: spaceType.name,
        size: spaceType.size,
        description: spaceType.description,
      })),
    )
    .onConflictDoUpdate({
      target: leasingSpaceTypesTable.position,
      set: {
        name: sql`excluded.name`,
        size: sql`excluded.size`,
        description: sql`excluded.description`,
        updatedAt: now,
      },
    });

  await executor
    .delete(leasingSpaceTypesTable)
    .where(notInArray(leasingSpaceTypesTable.position, positions));
}

async function writeTestimonials(
  executor: DbExecutor,
  testimonials: SiteContentState["testimonials"],
) {
  if (testimonials.length === 0) {
    await executor.delete(leasingTestimonialsTable);
    return;
  }

  const now = new Date();
  const positions = testimonials.map((_testimonial, index) => index);

  await executor
    .insert(leasingTestimonialsTable)
    .values(
      testimonials.map(
        (testimonial: SiteContentState["testimonials"][number], index: number) => ({
          position: index,
          name: testimonial.name,
          store: testimonial.store,
          text: testimonial.text,
        }),
      ),
    )
    .onConflictDoUpdate({
      target: leasingTestimonialsTable.position,
      set: {
        name: sql`excluded.name`,
        store: sql`excluded.store`,
        text: sql`excluded.text`,
        updatedAt: now,
      },
    });

  await executor
    .delete(leasingTestimonialsTable)
    .where(notInArray(leasingTestimonialsTable.position, positions));
}

async function writeLeasingDifferentials(
  executor: DbExecutor,
  differentials: SiteContentState["leasingDifferentials"],
) {
  if (differentials.length === 0) {
    await executor.delete(leasingDifferentialsTable);
    return;
  }

  const now = new Date();
  const positions = differentials.map((_value, index) => index);

  await executor
    .insert(leasingDifferentialsTable)
    .values(
      differentials.map((value: string, index: number) => ({
        position: index,
        value,
      })),
    )
    .onConflictDoUpdate({
      target: leasingDifferentialsTable.position,
      set: {
        value: sql`excluded.value`,
        updatedAt: now,
      },
    });

  await executor
    .delete(leasingDifferentialsTable)
    .where(notInArray(leasingDifferentialsTable.position, positions));
}

async function writeAboutData(executor: DbExecutor, aboutData: SiteContentState["aboutData"]) {
  const now = new Date();

  await executor
    .insert(aboutMetaTable)
    .values({
      id: SINGLETON_ID,
      mission: aboutData.mission,
      vision: aboutData.vision,
    })
    .onConflictDoUpdate({
      target: aboutMetaTable.id,
      set: {
        mission: sql`excluded.mission`,
        vision: sql`excluded.vision`,
        updatedAt: now,
      },
    });

  if (aboutData.history.length === 0) {
    await executor.delete(aboutHistoryItemsTable);
  } else {
    const historyPositions = aboutData.history.map((_value, index) => index);
    await executor
      .insert(aboutHistoryItemsTable)
      .values(
        aboutData.history.map((value: string, index: number) => ({
          position: index,
          value,
        })),
      )
      .onConflictDoUpdate({
        target: aboutHistoryItemsTable.position,
        set: {
          value: sql`excluded.value`,
          updatedAt: now,
        },
      });
    await executor
      .delete(aboutHistoryItemsTable)
      .where(notInArray(aboutHistoryItemsTable.position, historyPositions));
  }

  if (aboutData.values.length === 0) {
    await executor.delete(aboutValuesTable);
  } else {
    const valuesPositions = aboutData.values.map((_value, index) => index);
    await executor
      .insert(aboutValuesTable)
      .values(
        aboutData.values.map(
          (value: SiteContentState["aboutData"]["values"][number], index: number) => ({
            position: index,
            title: value.title,
            description: value.description,
          }),
        ),
      )
      .onConflictDoUpdate({
        target: aboutValuesTable.position,
        set: {
          title: sql`excluded.title`,
          description: sql`excluded.description`,
          updatedAt: now,
        },
      });
    await executor
      .delete(aboutValuesTable)
      .where(notInArray(aboutValuesTable.position, valuesPositions));
  }

  if (aboutData.differentials.length === 0) {
    await executor.delete(aboutDifferentialsTable);
  } else {
    const differentialPositions = aboutData.differentials.map((_value, index) => index);
    await executor
      .insert(aboutDifferentialsTable)
      .values(
        aboutData.differentials.map((value: string, index: number) => ({
          position: index,
          value,
        })),
      )
      .onConflictDoUpdate({
        target: aboutDifferentialsTable.position,
        set: {
          value: sql`excluded.value`,
          updatedAt: now,
        },
      });
    await executor
      .delete(aboutDifferentialsTable)
      .where(notInArray(aboutDifferentialsTable.position, differentialPositions));
  }

  if (aboutData.team.length === 0) {
    await executor.delete(aboutTeamMembersTable);
  } else {
    const teamPositions = aboutData.team.map((_member, index) => index);
    await executor
      .insert(aboutTeamMembersTable)
      .values(
        aboutData.team.map(
          (member: SiteContentState["aboutData"]["team"][number], index: number) => ({
            position: index,
            name: member.name,
            role: member.role,
            description: member.description,
          }),
        ),
      )
      .onConflictDoUpdate({
        target: aboutTeamMembersTable.position,
        set: {
          name: sql`excluded.name`,
          role: sql`excluded.role`,
          description: sql`excluded.description`,
          updatedAt: now,
        },
      });
    await executor
      .delete(aboutTeamMembersTable)
      .where(notInArray(aboutTeamMembersTable.position, teamPositions));
  }
}

async function writeSection<K extends ContentSection>(
  executor: DbExecutor,
  section: K,
  value: SiteContentState[K],
) {
  switch (section) {
    case "stores":
      await writeStores(executor, value as SiteContentState["stores"]);
      return;
    case "blogPosts":
      await writeBlogPosts(executor, value as SiteContentState["blogPosts"]);
      return;
    case "partners":
      await writePartners(executor, value as SiteContentState["partners"]);
      return;
    case "siteSettings":
      await writeSiteSettings(executor, value as SiteContentState["siteSettings"]);
      return;
    case "homeContent":
      await writeHomeContent(executor, value as SiteContentState["homeContent"]);
      return;
    case "leasingBenefits":
      await writeLeasingBenefits(executor, value as SiteContentState["leasingBenefits"]);
      return;
    case "spaceTypes":
      await writeSpaceTypes(executor, value as SiteContentState["spaceTypes"]);
      return;
    case "testimonials":
      await writeTestimonials(executor, value as SiteContentState["testimonials"]);
      return;
    case "leasingDifferentials":
      await writeLeasingDifferentials(
        executor,
        value as SiteContentState["leasingDifferentials"],
      );
      return;
    case "aboutData":
      await writeAboutData(executor, value as SiteContentState["aboutData"]);
      return;
  }
}

export async function getContentSnapshot(): Promise<SiteContentState> {
  const stores = ensureSectionValue("stores", await readStoresFromDb(db));
  const blogPosts = ensureSectionValue("blogPosts", await readBlogPostsFromDb(db));
  const partners = ensureSectionValue("partners", await readPartnersFromDb(db));
  const siteSettings = ensureSectionValue("siteSettings", await readSiteSettingsFromDb(db));
  const homeContent = ensureSectionValue("homeContent", await readHomeContentFromDb(db));
  const leasingBenefits = ensureSectionValue(
    "leasingBenefits",
    await readLeasingBenefitsFromDb(db),
  );
  const spaceTypes = ensureSectionValue("spaceTypes", await readSpaceTypesFromDb(db));
  const testimonials = ensureSectionValue("testimonials", await readTestimonialsFromDb(db));
  const leasingDifferentials = ensureSectionValue(
    "leasingDifferentials",
    await readLeasingDifferentialsFromDb(db),
  );
  const aboutData = ensureSectionValue("aboutData", await readAboutDataFromDb(db));

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
  };
}

export async function getContentSection<K extends ContentSection>(
  section: K,
): Promise<SiteContentState[K]> {
  const snapshot = await getContentSnapshot();
  return snapshot[section];
}

export async function replaceContentSection<K extends ContentSection>(
  section: K,
  value: SiteContentState[K],
): Promise<SiteContentState[K]> {
  await db.transaction(async (tx) => {
    await writeSection(tx, section, value);
  });

  return getContentSection(section);
}

export async function replaceContentSnapshot(
  snapshot: SiteContentState,
): Promise<SiteContentState> {
  await db.transaction(async (tx) => {
    for (const section of CONTENT_SECTIONS) {
      await writeSection(tx, section, snapshot[section]);
    }
  });

  return getContentSnapshot();
}

export async function resetContentSection<K extends ContentSection>(
  section: K,
): Promise<SiteContentState[K]> {
  return replaceContentSection(section, getDefaultSection(section));
}

export async function resetAllContent(): Promise<SiteContentState> {
  return replaceContentSnapshot(getContentBaseline());
}

export async function seedBaselineContent(
  options: { force?: boolean } = {},
): Promise<SiteContentState> {
  const { force = false } = options;

  if (!force) {
    const existingSettings = await db
      .select({ id: siteSettingsTable.id })
      .from(siteSettingsTable)
      .limit(1);
    if (existingSettings.length > 0) {
      return getContentSnapshot();
    }
  }

  return replaceContentSnapshot(getContentBaseline());
}

export async function findAdminUserById(userId: string) {
  const rows = await db
    .select({
      userId: adminUsersTable.userId,
      role: adminUsersTable.role,
      isActive: adminUsersTable.isActive,
    })
    .from(adminUsersTable)
    .where(eq(adminUsersTable.userId, userId))
    .limit(1);

  return rows[0] ?? null;
}
