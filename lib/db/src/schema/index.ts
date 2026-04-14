import {
  boolean,
  integer,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const singletonId = "singleton";
const authSchema = pgSchema("auth");

const authUsersTable = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const storesTable = pgTable("stores", {
  id: text("id").primaryKey(),
  position: integer("position").notNull(),
  name: text("name").notNull(),
  segment: text("segment").notNull(),
  segmentSlug: text("segment_slug").notNull(),
  floor: text("floor").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  phone: text("phone").notNull(),
  instagram: text("instagram").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const storeImagesTable = pgTable(
  "store_images",
  {
    storeId: text("store_id")
      .notNull()
      .references(() => storesTable.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.storeId, table.position] }),
  }),
);

export const blogPostsTable = pgTable("blog_posts", {
  slug: text("slug").primaryKey(),
  position: integer("position").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  author: text("author").notNull(),
  readTime: text("read_time").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const partnersTable = pgTable("partners", {
  id: text("id").primaryKey(),
  position: integer("position").notNull(),
  name: text("name").notNull(),
  logo: text("logo"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettingsTable = pgTable("site_settings", {
  id: text("id").primaryKey().notNull().default(singletonId),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  institutionalDescription: text("institutional_description").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  hours: text("hours").notNull(),
  instagram: text("instagram").notNull(),
  facebook: text("facebook").notNull(),
  footerLeasingLabel: text("footer_leasing_label").notNull(),
  footerLeasingHref: text("footer_leasing_href").notNull(),
  footerLegalNote: text("footer_legal_note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteNavLinksTable = pgTable(
  "site_nav_links",
  {
    siteSettingsId: text("site_settings_id")
      .notNull()
      .default(singletonId)
      .references(() => siteSettingsTable.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    label: text("label").notNull(),
    href: text("href").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.siteSettingsId, table.position] }),
  }),
);

export const homeSettingsTable = pgTable("home_settings", {
  id: text("id").primaryKey().notNull().default(singletonId),
  heroEyebrow: text("hero_eyebrow").notNull(),
  institutionalEyebrow: text("institutional_eyebrow").notNull(),
  institutionalTitle: text("institutional_title").notNull(),
  institutionalTitleHighlight: text("institutional_title_highlight").notNull(),
  institutionalLeadParagraph: text("institutional_lead_paragraph").notNull(),
  institutionalSecondaryParagraph: text("institutional_secondary_paragraph").notNull(),
  institutionalCtaLabel: text("institutional_cta_label").notNull(),
  institutionalCtaHref: text("institutional_cta_href").notNull(),
  institutionalImagePrimary: text("institutional_image_primary").notNull(),
  institutionalImageSecondary: text("institutional_image_secondary").notNull(),
  institutionalFloatingStatValue: text("institutional_floating_stat_value").notNull(),
  institutionalFloatingStatLabel: text("institutional_floating_stat_label").notNull(),
  statsBackgroundWord: text("stats_background_word").notNull(),
  featuredStoresEyebrow: text("featured_stores_eyebrow").notNull(),
  featuredStoresTitle: text("featured_stores_title").notNull(),
  featuredStoresTitleHighlight: text("featured_stores_title_highlight").notNull(),
  featuredStoresCtaLabel: text("featured_stores_cta_label").notNull(),
  featuredStoresCtaHref: text("featured_stores_cta_href").notNull(),
  featuredStoresEmptyMessage: text("featured_stores_empty_message").notNull(),
  partnersEyebrow: text("partners_eyebrow").notNull(),
  partnersEmptyMessage: text("partners_empty_message").notNull(),
  blogPreviewEyebrow: text("blog_preview_eyebrow").notNull(),
  blogPreviewTitle: text("blog_preview_title").notNull(),
  blogPreviewTitleHighlight: text("blog_preview_title_highlight").notNull(),
  blogPreviewCtaLabel: text("blog_preview_cta_label").notNull(),
  blogPreviewCtaHref: text("blog_preview_cta_href").notNull(),
  blogPreviewEmptyMessage: text("blog_preview_empty_message").notNull(),
  leasingCtaEyebrow: text("leasing_cta_eyebrow").notNull(),
  leasingCtaTitle: text("leasing_cta_title").notNull(),
  leasingCtaTitleHighlight: text("leasing_cta_title_highlight").notNull(),
  leasingCtaDescription: text("leasing_cta_description").notNull(),
  leasingCtaLabel: text("leasing_cta_label").notNull(),
  leasingCtaHref: text("leasing_cta_href").notNull(),
  leasingCtaBackgroundImage: text("leasing_cta_background_image").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const homeHeroSlidesTable = pgTable(
  "home_hero_slides",
  {
    homeSettingsId: text("home_settings_id")
      .notNull()
      .default(singletonId)
      .references(() => homeSettingsTable.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    slideId: text("slide_id"),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull(),
    cta: text("cta").notNull(),
    href: text("href").notNull(),
    image: text("image").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.homeSettingsId, table.position] }),
  }),
);

export const homeStatsItemsTable = pgTable(
  "home_stats_items",
  {
    homeSettingsId: text("home_settings_id")
      .notNull()
      .default(singletonId)
      .references(() => homeSettingsTable.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    value: text("value").notNull(),
    label: text("label").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.homeSettingsId, table.position] }),
  }),
);

export const leasingBenefitsTable = pgTable("leasing_benefits", {
  position: integer("position").primaryKey(),
  icon: text("icon").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leasingSpaceTypesTable = pgTable("leasing_space_types", {
  position: integer("position").primaryKey(),
  name: text("name").notNull(),
  size: text("size").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leasingTestimonialsTable = pgTable("leasing_testimonials", {
  position: integer("position").primaryKey(),
  name: text("name").notNull(),
  store: text("store").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leasingDifferentialsTable = pgTable("leasing_differentials", {
  position: integer("position").primaryKey(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aboutMetaTable = pgTable("about_meta", {
  id: text("id").primaryKey().notNull().default(singletonId),
  mission: text("mission").notNull(),
  vision: text("vision").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aboutHistoryItemsTable = pgTable("about_history_items", {
  position: integer("position").primaryKey(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aboutValuesTable = pgTable("about_values", {
  position: integer("position").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aboutDifferentialsTable = pgTable("about_differentials", {
  position: integer("position").primaryKey(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aboutTeamMembersTable = pgTable("about_team_members", {
  position: integer("position").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminUsersTable = pgTable("admin_users", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => authUsersTable.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactRequestsTable = pgTable("contact_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull(),
  spaceType: text("space_type").notNull(),
  segment: text("segment").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("novo"),
  internalNotes: text("internal_notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StoreRow = typeof storesTable.$inferSelect;
export type BlogPostRow = typeof blogPostsTable.$inferSelect;
export type PartnerRow = typeof partnersTable.$inferSelect;
export type SiteSettingsRow = typeof siteSettingsTable.$inferSelect;
export type HomeSettingsRow = typeof homeSettingsTable.$inferSelect;
export type AdminUserRow = typeof adminUsersTable.$inferSelect;
export type ContactRequestRow = typeof contactRequestsTable.$inferSelect;
