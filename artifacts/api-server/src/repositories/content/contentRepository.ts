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
import { asc, eq } from "drizzle-orm";
import type { SiteContentState } from "@workspace/api-zod";
import { getContentBaseline, getDefaultSection } from "../../content/baseline";
import { CONTENT_SECTIONS, type ContentSection } from "../../content/sections";

const SINGLETON_ID = "singleton";

type DbExecutor = typeof db | any;

async function readSectionWithFallback<T>(
  section: ContentSection,
  read: () => Promise<T | null>,
  fallback: T,
): Promise<T> {
  try {
    const value = await read();
    return value ?? fallback;
  } catch (error) {
    // Future supabase/db outages should not break public snapshot reads.
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[content] Section "${section}" fallback to baseline: ${reason}`);
    return fallback;
  }
}

async function readStoresFromDb(executor: DbExecutor): Promise<SiteContentState["stores"] | null> {
  const rows = await executor
    .select()
    .from(storesTable)
    .orderBy(asc(storesTable.position));
  if (rows.length === 0) return null;

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
  if (rows.length === 0) return null;

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
  if (rows.length === 0) return null;

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
  if (rows.length === 0) return null;

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
  if (rows.length === 0) return null;

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
  if (rows.length === 0) return null;

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
  if (rows.length === 0) return null;

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
  await executor.delete(storeImagesTable);
  await executor.delete(storesTable);

  if (stores.length === 0) return;

  await executor.insert(storesTable).values(
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
  );

  const imageValues = stores.flatMap((store: SiteContentState["stores"][number]) =>
    store.images.map((image: string, index: number) => ({
      storeId: store.id,
      position: index,
      url: image,
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
  await executor.delete(blogPostsTable);
  if (blogPosts.length === 0) return;

  await executor.insert(blogPostsTable).values(
    blogPosts.map((post: SiteContentState["blogPosts"][number], index: number) => ({
      slug: post.slug,
      position: index,
      title: post.title,
      category: post.category,
      date: post.date,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      author: post.author,
      readTime: post.readTime,
      featured: Boolean(post.featured),
    })),
  );
}

async function writePartners(executor: DbExecutor, partners: SiteContentState["partners"]) {
  await executor.delete(partnersTable);
  if (partners.length === 0) return;

  await executor.insert(partnersTable).values(
    partners.map((partner: SiteContentState["partners"][number], index: number) => ({
      id: partner.id,
      position: index,
      name: partner.name,
      logo: partner.logo ?? null,
    })),
  );
}

async function writeSiteSettings(
  executor: DbExecutor,
  siteSettings: SiteContentState["siteSettings"],
) {
  await executor
    .delete(siteNavLinksTable)
    .where(eq(siteNavLinksTable.siteSettingsId, SINGLETON_ID));
  await executor.delete(siteSettingsTable).where(eq(siteSettingsTable.id, SINGLETON_ID));

  await executor.insert(siteSettingsTable).values({
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
  });

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
  await executor
    .delete(homeHeroSlidesTable)
    .where(eq(homeHeroSlidesTable.homeSettingsId, SINGLETON_ID));
  await executor
    .delete(homeStatsItemsTable)
    .where(eq(homeStatsItemsTable.homeSettingsId, SINGLETON_ID));
  await executor.delete(homeSettingsTable).where(eq(homeSettingsTable.id, SINGLETON_ID));

  await executor.insert(homeSettingsTable).values({
    id: SINGLETON_ID,
    heroEyebrow: homeContent.hero.eyebrow,
    institutionalEyebrow: homeContent.institutional.eyebrow,
    institutionalTitle: homeContent.institutional.title,
    institutionalTitleHighlight: homeContent.institutional.titleHighlight,
    institutionalLeadParagraph: homeContent.institutional.leadParagraph,
    institutionalSecondaryParagraph: homeContent.institutional.secondaryParagraph,
    institutionalCtaLabel: homeContent.institutional.ctaLabel,
    institutionalCtaHref: homeContent.institutional.ctaHref,
    institutionalImagePrimary: homeContent.institutional.imagePrimary,
    institutionalImageSecondary: homeContent.institutional.imageSecondary,
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
    leasingCtaBackgroundImage: homeContent.leasingCta.backgroundImage,
  });

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
        image: slide.image,
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
  await executor.delete(leasingBenefitsTable);
  if (leasingBenefits.length === 0) return;

  await executor.insert(leasingBenefitsTable).values(
    leasingBenefits.map(
      (benefit: SiteContentState["leasingBenefits"][number], index: number) => ({
      position: index,
      icon: benefit.icon,
      title: benefit.title,
      description: benefit.description,
      }),
    ),
  );
}

async function writeSpaceTypes(executor: DbExecutor, spaceTypes: SiteContentState["spaceTypes"]) {
  await executor.delete(leasingSpaceTypesTable);
  if (spaceTypes.length === 0) return;

  await executor.insert(leasingSpaceTypesTable).values(
    spaceTypes.map((spaceType: SiteContentState["spaceTypes"][number], index: number) => ({
      position: index,
      name: spaceType.name,
      size: spaceType.size,
      description: spaceType.description,
    })),
  );
}

async function writeTestimonials(
  executor: DbExecutor,
  testimonials: SiteContentState["testimonials"],
) {
  await executor.delete(leasingTestimonialsTable);
  if (testimonials.length === 0) return;

  await executor.insert(leasingTestimonialsTable).values(
    testimonials.map(
      (testimonial: SiteContentState["testimonials"][number], index: number) => ({
      position: index,
      name: testimonial.name,
      store: testimonial.store,
      text: testimonial.text,
      }),
    ),
  );
}

async function writeLeasingDifferentials(
  executor: DbExecutor,
  differentials: SiteContentState["leasingDifferentials"],
) {
  await executor.delete(leasingDifferentialsTable);
  if (differentials.length === 0) return;

  await executor.insert(leasingDifferentialsTable).values(
    differentials.map((value: string, index: number) => ({
      position: index,
      value,
    })),
  );
}

async function writeAboutData(executor: DbExecutor, aboutData: SiteContentState["aboutData"]) {
  await executor.delete(aboutHistoryItemsTable);
  await executor.delete(aboutValuesTable);
  await executor.delete(aboutDifferentialsTable);
  await executor.delete(aboutTeamMembersTable);
  await executor.delete(aboutMetaTable).where(eq(aboutMetaTable.id, SINGLETON_ID));

  await executor.insert(aboutMetaTable).values({
    id: SINGLETON_ID,
    mission: aboutData.mission,
    vision: aboutData.vision,
  });

  if (aboutData.history.length > 0) {
    await executor.insert(aboutHistoryItemsTable).values(
      aboutData.history.map((value: string, index: number) => ({ position: index, value })),
    );
  }

  if (aboutData.values.length > 0) {
    await executor.insert(aboutValuesTable).values(
      aboutData.values.map(
        (value: SiteContentState["aboutData"]["values"][number], index: number) => ({
        position: index,
        title: value.title,
        description: value.description,
      }),
      ),
    );
  }

  if (aboutData.differentials.length > 0) {
    await executor.insert(aboutDifferentialsTable).values(
      aboutData.differentials.map((value: string, index: number) => ({
        position: index,
        value,
      })),
    );
  }

  if (aboutData.team.length > 0) {
    await executor.insert(aboutTeamMembersTable).values(
      aboutData.team.map(
        (member: SiteContentState["aboutData"]["team"][number], index: number) => ({
        position: index,
        name: member.name,
        role: member.role,
        description: member.description,
      }),
      ),
    );
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
  const baseline = getContentBaseline();

  const stores = await readSectionWithFallback("stores", () => readStoresFromDb(db), baseline.stores);
  const blogPosts = await readSectionWithFallback(
    "blogPosts",
    () => readBlogPostsFromDb(db),
    baseline.blogPosts,
  );
  const partners = await readSectionWithFallback(
    "partners",
    () => readPartnersFromDb(db),
    baseline.partners,
  );
  const siteSettings = await readSectionWithFallback(
    "siteSettings",
    () => readSiteSettingsFromDb(db),
    baseline.siteSettings,
  );
  const homeContent = await readSectionWithFallback(
    "homeContent",
    () => readHomeContentFromDb(db),
    baseline.homeContent,
  );
  const leasingBenefits = await readSectionWithFallback(
    "leasingBenefits",
    () => readLeasingBenefitsFromDb(db),
    baseline.leasingBenefits,
  );
  const spaceTypes = await readSectionWithFallback(
    "spaceTypes",
    () => readSpaceTypesFromDb(db),
    baseline.spaceTypes,
  );
  const testimonials = await readSectionWithFallback(
    "testimonials",
    () => readTestimonialsFromDb(db),
    baseline.testimonials,
  );
  const leasingDifferentials = await readSectionWithFallback(
    "leasingDifferentials",
    () => readLeasingDifferentialsFromDb(db),
    baseline.leasingDifferentials,
  );
  const aboutData = await readSectionWithFallback(
    "aboutData",
    () => readAboutDataFromDb(db),
    baseline.aboutData,
  );

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
