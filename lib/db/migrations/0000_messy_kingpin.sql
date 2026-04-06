CREATE TABLE "about_differentials" (
	"position" integer PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "about_history_items" (
	"position" integer PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "about_meta" (
	"id" text PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"mission" text NOT NULL,
	"vision" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "about_team_members" (
	"position" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "about_values" (
	"position" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"slug" text PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"date" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" text NOT NULL,
	"author" text NOT NULL,
	"read_time" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "home_hero_slides" (
	"home_settings_id" text DEFAULT 'singleton' NOT NULL,
	"position" integer NOT NULL,
	"slide_id" text,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"cta" text NOT NULL,
	"href" text NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "home_hero_slides_home_settings_id_position_pk" PRIMARY KEY("home_settings_id","position")
);
--> statement-breakpoint
CREATE TABLE "home_settings" (
	"id" text PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"hero_eyebrow" text NOT NULL,
	"institutional_eyebrow" text NOT NULL,
	"institutional_title" text NOT NULL,
	"institutional_title_highlight" text NOT NULL,
	"institutional_lead_paragraph" text NOT NULL,
	"institutional_secondary_paragraph" text NOT NULL,
	"institutional_cta_label" text NOT NULL,
	"institutional_cta_href" text NOT NULL,
	"institutional_image_primary" text NOT NULL,
	"institutional_image_secondary" text NOT NULL,
	"institutional_floating_stat_value" text NOT NULL,
	"institutional_floating_stat_label" text NOT NULL,
	"stats_background_word" text NOT NULL,
	"featured_stores_eyebrow" text NOT NULL,
	"featured_stores_title" text NOT NULL,
	"featured_stores_title_highlight" text NOT NULL,
	"featured_stores_cta_label" text NOT NULL,
	"featured_stores_cta_href" text NOT NULL,
	"featured_stores_empty_message" text NOT NULL,
	"partners_eyebrow" text NOT NULL,
	"partners_empty_message" text NOT NULL,
	"blog_preview_eyebrow" text NOT NULL,
	"blog_preview_title" text NOT NULL,
	"blog_preview_title_highlight" text NOT NULL,
	"blog_preview_cta_label" text NOT NULL,
	"blog_preview_cta_href" text NOT NULL,
	"blog_preview_empty_message" text NOT NULL,
	"leasing_cta_eyebrow" text NOT NULL,
	"leasing_cta_title" text NOT NULL,
	"leasing_cta_title_highlight" text NOT NULL,
	"leasing_cta_description" text NOT NULL,
	"leasing_cta_label" text NOT NULL,
	"leasing_cta_href" text NOT NULL,
	"leasing_cta_background_image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "home_stats_items" (
	"home_settings_id" text DEFAULT 'singleton' NOT NULL,
	"position" integer NOT NULL,
	"value" text NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "home_stats_items_home_settings_id_position_pk" PRIMARY KEY("home_settings_id","position")
);
--> statement-breakpoint
CREATE TABLE "leasing_benefits" (
	"position" integer PRIMARY KEY NOT NULL,
	"icon" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leasing_differentials" (
	"position" integer PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leasing_space_types" (
	"position" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"size" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leasing_testimonials" (
	"position" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"store" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" text PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_nav_links" (
	"site_settings_id" text DEFAULT 'singleton' NOT NULL,
	"position" integer NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_nav_links_site_settings_id_position_pk" PRIMARY KEY("site_settings_id","position")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"institutional_description" text NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"hours" text NOT NULL,
	"instagram" text NOT NULL,
	"facebook" text NOT NULL,
	"footer_leasing_label" text NOT NULL,
	"footer_leasing_href" text NOT NULL,
	"footer_legal_note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_images" (
	"store_id" text NOT NULL,
	"position" integer NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "store_images_store_id_position_pk" PRIMARY KEY("store_id","position")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" text PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"segment" text NOT NULL,
	"segment_slug" text NOT NULL,
	"floor" text NOT NULL,
	"description" text NOT NULL,
	"long_description" text NOT NULL,
	"phone" text NOT NULL,
	"instagram" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "home_hero_slides" ADD CONSTRAINT "home_hero_slides_home_settings_id_home_settings_id_fk" FOREIGN KEY ("home_settings_id") REFERENCES "public"."home_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "home_stats_items" ADD CONSTRAINT "home_stats_items_home_settings_id_home_settings_id_fk" FOREIGN KEY ("home_settings_id") REFERENCES "public"."home_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_nav_links" ADD CONSTRAINT "site_nav_links_site_settings_id_site_settings_id_fk" FOREIGN KEY ("site_settings_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_images" ADD CONSTRAINT "store_images_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;