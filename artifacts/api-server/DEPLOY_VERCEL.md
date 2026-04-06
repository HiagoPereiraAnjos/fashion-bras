# Backend Deploy Guide (Vercel)

Este guia cobre apenas o backend Express (`artifacts/api-server`) em projeto separado na Vercel.

## 1) Estrutura usada no deploy
- Entrypoint serverless: `artifacts/api-server/api/index.js`
- Catch-all de API: `artifacts/api-server/api/[...path].js`
- App Express: `artifacts/api-server/src/app.ts`
- Export serverless: `artifacts/api-server/src/serverless.ts`
- Build backend: `pnpm --filter @workspace/api-server build`
- Config Vercel: `artifacts/api-server/vercel.json`

## 2) Projeto Vercel (backend)
1. Crie um projeto novo na Vercel para o backend.
2. Conecte o mesmo repositório.
3. Configure **Root Directory** como `artifacts/api-server`.
4. Framework preset: **Other**.
5. Confirme que a Vercel está usando o `vercel.json` desta pasta.

## 3) Variáveis de ambiente obrigatórias
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `CORS_ALLOWED_ORIGINS`

## 4) Variáveis recomendadas
- `NODE_ENV=production`
- `LOG_LEVEL=info`
- `DB_SSL_MODE=require`
- `DB_POOL_MAX=3`
- `DB_APPLICATION_NAME=fashion-bras-api-vercel`
- `CORS_ALLOWED_ORIGIN_REGEX` (somente se usar preview domains)
- `CONTENT_BASELINE_FALLBACK=false`

## 5) Região
- Definida em `vercel.json` como `gru1` (São Paulo), próxima ao Supabase em SA.

## 6) Rotas esperadas
- `GET /api/healthz`
- `GET /api/content/snapshot`
- `GET /api/content/sections/:section`
- `GET /api/admin/me` (Bearer)
- `PUT /api/admin/content/sections/:section` (Bearer)
- `POST /api/admin/media/upload` (Bearer)
- `DELETE /api/admin/media/object` (Bearer)

## 7) Pós-deploy
1. Validar `GET /api/healthz`.
2. Validar `GET /api/content/snapshot`.
3. Validar auth admin (`/api/admin/me`) com token válido.
4. Validar upload de imagem e remoção de objeto no Storage.
5. Validar CORS via frontend production/preview.
