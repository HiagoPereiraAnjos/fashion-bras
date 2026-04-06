# Backend Deploy Guide (Vercel)

This guide covers the Express backend only (`artifacts/api-server`) as a separate Vercel project.

## 1) Deploy structure
- Serverless entrypoint: `artifacts/api-server/api/index.js`
- Catch-all API route: `artifacts/api-server/api/[...path].js`
- Express app: `artifacts/api-server/src/app.ts`
- Serverless export: `artifacts/api-server/src/serverless.ts`
- Build command: `pnpm --filter @workspace/api-server build`
- Vercel config: `artifacts/api-server/vercel.json`

## 2) Vercel backend project
1. Create a new Vercel project for backend.
2. Connect the same repository.
3. Set `Root Directory` to `artifacts/api-server`.
4. Framework preset: `Other`.
5. Confirm Vercel is using the `vercel.json` in this folder.

## 3) Environment variable matrix (multi-stage)

Legend:
- Required: API cannot boot correctly or core features break without it.
- Optional: code has default, but explicit values are recommended for real environments.

| Variable | Development | Preview | Production | Required | Shared or exclusive | Expected value |
|---|---|---|---|---|---|---|
| `DATABASE_URL` | Yes | Yes | Yes | Yes | **Exclusive per environment** (strongly recommended) | Postgres/Supabase pooler URL |
| `SUPABASE_URL` | Yes | Yes | Yes | Yes | Can be shared only with same environment DB | `https://<project-ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Yes | Yes | Yes | **Exclusive per environment** | Supabase service role key |
| `SUPABASE_STORAGE_BUCKET` | Yes | Yes | Yes | Yes (best practice) | Can be exclusive (`site-media-dev`, `site-media-preview`, `site-media`) | Storage bucket name |
| `CORS_ALLOWED_ORIGINS` | Yes | Yes | Yes | Yes | **Exclusive per environment** | Comma-separated allowlist of trusted origins |
| `CORS_ALLOWED_VERCEL_PROJECTS` | No | Optional | Optional | No | Usually shared | Comma-separated Vercel project slugs |
| `CORS_ALLOWED_VERCEL_TEAM_SLUG` | No | Optional | Optional | No | Usually shared | Vercel team slug |
| `DB_SSL_MODE` | Optional | Optional | Optional | No | Shared | `disable` (local DB) or `require` (Supabase) |
| `DB_POOL_MAX` | Optional | Optional | Optional | No | Can vary per env | `10` local, `3-5` serverless |
| `DB_APPLICATION_NAME` | Optional | Optional | Optional | No | Prefer exclusive | e.g. `fashion-bras-api-preview` |
| `LOG_LEVEL` | Optional | Optional | Optional | No | Can vary per env | `debug`, `info`, `warn`, `error` |
| `NODE_ENV` | Optional | Optional | Optional | No | Platform-defined | `development` local, `production` on Vercel |
| `CONTENT_BASELINE_FALLBACK` | Optional | Optional | Optional | No | **Exclusive per environment** | Keep `false` in preview/prod |
| `PORT` | Yes (local runtime) | No | No | Yes for local `src/index.ts` | Local only | `3000` |

### Important note
- `CORS_ALLOWED_ORIGIN_REGEX` is deprecated in this codebase and is **not consumed** by current backend logic.
- Use `CORS_ALLOWED_ORIGINS` plus optional `CORS_ALLOWED_VERCEL_PROJECTS` and `CORS_ALLOWED_VERCEL_TEAM_SLUG`.

## 4) Recommended baseline by environment

### Development (local)
- `PORT=3000`
- `NODE_ENV=development`
- `LOG_LEVEL=info`
- `DATABASE_URL=<local-postgres-or-supabase-dev>`
- `DB_SSL_MODE=disable` (local Postgres) or `require` (Supabase)
- `DB_POOL_MAX=10`
- `DB_APPLICATION_NAME=fashion-bras-api-local`
- `CORS_ALLOWED_ORIGINS=http://localhost:4173`
- `SUPABASE_URL=<supabase-dev-url>`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-dev>`
- `SUPABASE_STORAGE_BUCKET=site-media-dev`
- `CONTENT_BASELINE_FALLBACK=false`

### Preview (Vercel)
- `NODE_ENV=production`
- `LOG_LEVEL=info`
- `DATABASE_URL=<supabase-preview-pooler>`
- `DB_SSL_MODE=require`
- `DB_POOL_MAX=3`
- `DB_APPLICATION_NAME=fashion-bras-api-preview`
- `CORS_ALLOWED_ORIGINS=https://staging.fashionbras.com.br,https://<official-preview-frontend>.vercel.app`
- `CORS_ALLOWED_VERCEL_PROJECTS=fashion-mall`
- `CORS_ALLOWED_VERCEL_TEAM_SLUG=<your-team-slug>`
- `SUPABASE_URL=<supabase-preview-url>`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-preview>`
- `SUPABASE_STORAGE_BUCKET=site-media-preview`
- `CONTENT_BASELINE_FALLBACK=false`

### Production (Vercel)
- `NODE_ENV=production`
- `LOG_LEVEL=info`
- `DATABASE_URL=<supabase-prod-pooler>`
- `DB_SSL_MODE=require`
- `DB_POOL_MAX=3`
- `DB_APPLICATION_NAME=fashion-bras-api-prod`
- `CORS_ALLOWED_ORIGINS=https://fashionbras.com.br,https://www.fashionbras.com.br`
- `CORS_ALLOWED_VERCEL_PROJECTS=` (optional; keep empty if production API should not allow preview frontend)
- `SUPABASE_URL=<supabase-prod-url>`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-prod>`
- `SUPABASE_STORAGE_BUCKET=site-media`
- `CONTENT_BASELINE_FALLBACK=false`

## 5) Region
- Defined in `vercel.json` as `gru1` (Sao Paulo), close to Supabase SA region.

## 6) Expected routes
- `GET /api/healthz`
- `GET /api/content/snapshot`
- `GET /api/content/sections/:section`
- `GET /api/admin/me` (Bearer)
- `PUT /api/admin/content/sections/:section` (Bearer)
- `POST /api/admin/media/upload` (Bearer)
- `DELETE /api/admin/media/object` (Bearer)

## 7) Post-deploy checks
1. Validate `GET /api/healthz`.
2. Validate `GET /api/content/snapshot`.
3. Validate admin auth (`/api/admin/me`) with a valid token.
4. Validate upload and delete in Supabase Storage.
5. Validate CORS from frontend production and preview/staging.

## 8) Vercel setup checklist
1. Backend is a separate project with `Root Directory = artifacts/api-server`.
2. Configure envs in all scopes: `Development`, `Preview`, `Production`.
3. Confirm each `DATABASE_URL` points to the correct DB for that environment.
4. Confirm `SUPABASE_SERVICE_ROLE_KEY` is never present in frontend projects.
5. Confirm `CORS_ALLOWED_ORIGINS` has no wildcard and no lookalike domains.
6. Keep `CONTENT_BASELINE_FALLBACK=false` in preview/production.
7. Redeploy backend after any env change.
8. Re-run health + admin + upload smoke checks.
