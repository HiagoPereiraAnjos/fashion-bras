# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### `artifacts/fashion-mall` — Fashion Bras Shopping Website

A full frontend website for a premium fashion shopping center (Fashion Bras), built with React + TypeScript + Vite + Tailwind CSS.

**Pages:**
- `/` — Home: Hero slider, institutional section, stats, featured stores, partners, blog preview, leasing CTA
- `/lojas` — Stores listing with search + category filters (12 mock stores)
- `/lojas/:id` — Store detail with image gallery, contact info, related stores
- `/blog` — Blog listing with featured article and category filters (8 mock posts)
- `/blog/:slug` — Individual blog post with content and related posts
- `/locacao` — Leasing page: benefits, space types, differentials, testimonials, contact form
- `/sobre` — About page: history, mission, vision, values, team

**Design:**
- Palette: white/black/champagne gold (#C9A84C) — luxury accessible
- Typography: Playfair Display (headings) + Inter (body)
- Animations: Framer Motion (scroll reveals, stagger, hero slider)
- Responsive: mobile-first

**Data Architecture (CMS-ready):**
- `src/data/siteSettings.ts` — site config
- `src/data/storesData.ts` — 12 stores mock data
- `src/data/blogPostsData.ts` — 8 blog posts mock data
- `src/data/partnersData.ts` — 12 partner brands
- `src/data/leasingData.ts` — leasing benefits, space types, testimonials
- `src/data/aboutData.ts` — about page content
- `src/types/index.ts` — TypeScript interfaces

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── fashion-mall/       # Fashion Bras frontend (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck`.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/fashion-mall` (`@workspace/fashion-mall`)

React + Vite frontend for the Fashion Bras shopping mall website.

- Entry: `src/main.tsx` → `src/App.tsx` (router setup)
- Layout: `src/layouts/MainLayout.tsx` wraps all pages
- Components: `src/components/` (layout, cards, filters, forms)
- Pages: `src/pages/`
- Data: `src/data/` (mock CMS data, ready for API integration)
- Types: `src/types/index.ts`
- `pnpm --filter @workspace/fashion-mall run dev` — run the dev server

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/`.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /healthz`
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec and Orval config.

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package.
