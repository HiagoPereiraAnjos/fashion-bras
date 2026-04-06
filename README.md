# Fashion Bras - Monorepo (Frontend + API)

Base tecnica do projeto de shopping de moda com frontend premium (React/Vite) e API Node.js/Express preparada para Supabase.

## 1. Visao geral
Este repositorio esta organizado em monorepo com `pnpm workspace` e separa:
- **Frontend SPA** (site publico + painel admin)
- **Backend API** (Express + Drizzle)
- **Libs compartilhadas** (schema, contrato OpenAPI, client e validacao)

Objetivo da organizacao atual:
- execucao local reproduzivel
- deploy previsivel na Vercel
- preparacao para persistencia real em Supabase

## 2. Estrutura de pastas (estado atual)
```text
.
|-- api/                         # entrypoint serverless da Vercel (proxy para artifacts/api-server)
|-- artifacts/
|   |-- fashion-mall/            # app frontend (React + Vite)
|   |-- api-server/              # app backend (Express)
|   `-- mockup-sandbox/          # sandbox visual/local
|-- lib/
|   |-- db/                      # Drizzle schema + conexao Postgres
|   |-- api-spec/                # OpenAPI source + codegen
|   |-- api-zod/                 # tipos/validators gerados
|   `-- api-client-react/        # client React gerado
|-- scripts/                     # scripts utilitarios (seed, etc.)
|-- pnpm-workspace.yaml
|-- package.json                 # scripts orquestradores do monorepo
`-- vercel.json
```

## 3. Estrutura recomendada para proxima fase (sem breaking change agora)
```text
.
|-- apps/
|   |-- frontend/                # mover de artifacts/fashion-mall
|   `-- api/                     # mover de artifacts/api-server
|-- libs/
|   |-- db/
|   |-- api-spec/
|   |-- api-zod/
|   `-- api-client-react/
|-- scripts/
`-- infra/
```

## 4. Requisitos
- Node.js 22+
- pnpm 10+

## 5. Instalacao
Na raiz do repositorio:
```bash
pnpm install
```

## 6. Variaveis de ambiente
Crie os arquivos a partir dos exemplos:
- `artifacts/fashion-mall/.env.example` -> `artifacts/fashion-mall/.env`
- `artifacts/api-server/.env.example` -> `artifacts/api-server/.env`

### Regras importantes
- **Nunca** versionar `.env` real
- `SUPABASE_SERVICE_ROLE_KEY` e segredo de backend e **nao** deve ir para frontend

## 7. Rodar localmente
Use dois terminais.

### Terminal 1 - API
```bash
pnpm run dev:api
```

### Terminal 2 - Frontend
```bash
pnpm run dev:frontend
```

Atalhos uteis na raiz:
- `pnpm run dev` -> frontend
- `pnpm run build` -> typecheck + build de todos os pacotes com script `build`
- `pnpm run typecheck` -> typecheck dos apps/libs

## 8. Banco e seed (Supabase/Postgres)
Com `DATABASE_URL` configurada:

```bash
pnpm --filter @workspace/db push
pnpm run seed:content-baseline
```

## 9. Deploy na Vercel
O repositorio ja possui `vercel.json` para deploy combinado:
- builda API e frontend
- publica frontend estatico
- encaminha `/api/*` para funcao serverless (`api/index.js`)

Pre-requisitos na Vercel:
- variaveis de ambiente do frontend e backend configuradas
- build command padrao do repo respeitado (`pnpm install --frozen-lockfile`)

## 10. Diagnostico rapido de setup
Se algo falhar:
1. confirme Node/pnpm (`node -v`, `pnpm -v`)
2. rode `pnpm install` na raiz
3. valide se ambos `.env` existem e estao completos
4. valide conexao DB (`DATABASE_URL`) e CORS (`CORS_ALLOWED_ORIGINS`)
5. rode `pnpm run typecheck`

## 11. Limpeza aplicada nesta fase
- `.gitignore` reforcado para artefatos locais, logs e cache
- remocao de artefatos locais indevidos do versionamento (`.replit-artifact/*`)
- remocao de `dev-run.log` versionado
- exemplos de ambiente adicionados para frontend/backend
- script de desenvolvimento da API tornado compativel com Windows/Linux (sem `export`)
