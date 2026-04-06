# Fashion Bras Frontend - Technical README

## 1) Visao geral do projeto
Este pacote (`artifacts/fashion-mall`) contem o frontend SPA do Fashion Bras:
- site publico (home, lojas, blog, locacao, sobre)
- painel administrativo frontend-only (`/admin`)

Estado atual:
- modo local (default): persistencia em `localStorage`
- modo remoto (feature flag): leitura/escrita via API backend
- fallback de conteudo via mocks em `src/data/content`
- fonte unica de leitura da UI via `useSiteContent()`

Meta de arquitetura:
- manter simplicidade agora
- permitir troca de persistencia (local -> Supabase) sem reescrever UI

## 2) Stack usada
- React 19 + TypeScript
- Vite 7
- Wouter (roteamento SPA)
- Tailwind CSS 4
- Framer Motion
- Lucide React
- `@supabase/supabase-js` (auth admin em modo remoto)

Plugins/build:
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- `@tailwindcss/typography`
- plugins Replit (`runtime-error-modal`, `cartographer`, `dev-banner`)

## 3) Estrutura de pastas
```text
src/
  components/
    cards/
    feedback/
    filters/
    forms/
    layout/
  context/
    AdminDataContext.tsx
    content/ContentProvider.tsx
  data/content/
  features/admin/
    components/
      layout/
      sections/
      shared/
    constants/
    types/
  hooks/
  layouts/
  pages/
  seo/
  services/content/
    adapters/storage/
    mappers/
    repositories/
    defaults.ts
    selectors.ts
    siteContent.ts
    index.ts
  types/domain/
  utils/
```

Resumo rapido:
- `pages` e `components`: apresentacao
- `features/admin`: edicao de conteudo
- `context/content`: estado global e escrita
- `services/content`: snapshot, seletores e repositorio
- `types/domain`: contratos centrais

## 4) Como rodar o frontend
Pre-requisitos:
- Node.js 22+
- pnpm 10+

No workspace raiz (`fashion-bras`):
```bash
pnpm install
```

### PowerShell (Windows)
```powershell
$env:PORT='4173'
$env:BASE_PATH='/'
$env:VITE_CONTENT_BACKEND_MODE='local' # ou 'remote'
pnpm.cmd --filter @workspace/fashion-mall dev
```

### CMD (Windows)
```bat
set PORT=4173
set BASE_PATH=/
set VITE_CONTENT_BACKEND_MODE=local
pnpm --filter @workspace/fashion-mall dev
```

Variaveis adicionais no modo remoto:
```bash
VITE_CONTENT_BACKEND_MODE=remote
VITE_API_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Compatibilidade:
- o frontend tambem aceita `NEXT_PUBLIC_SUPABASE_URL`
- e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Build:
```powershell
$env:PORT='4173'
$env:BASE_PATH='/'
pnpm.cmd --filter @workspace/fashion-mall build
```

Typecheck:
```powershell
$env:PORT='4173'
$env:BASE_PATH='/'
pnpm.cmd --filter @workspace/fashion-mall typecheck
```

Observacoes:
- `PORT` e `BASE_PATH` sao opcionais (`4173` e `/` por padrao)
- em PowerShell, use `pnpm.cmd` se houver bloqueio de policy

## 5) Como funciona a camada de dados atual
Fluxo atual:
1. Defaults saem de `src/data/content/*`
2. `ContentProvider` carrega cada secao:
   - `repository.loadSection(section)` ou
   - fallback `getDefaultSection(section)`
3. Admin salva via setters do contexto (`setStores`, `setHomeContent`, etc.)
4. Setter atualiza estado e persiste no repositorio
5. UI publica le snapshot derivado por `useSiteContent()` + `buildSiteContentSnapshot()`

Arquivos-chave:
- contrato: `src/services/content/repositories/ContentRepository.ts`
- fabrica: `src/services/content/repositories/createContentRepository.ts`
- local atual: `src/services/content/repositories/LocalContentRepository.ts`
- remoto atual: `src/services/content/repositories/RemoteContentRepository.ts`
- snapshot para UI: `src/services/content/siteContent.ts`

## 6) Como o admin funciona hoje
Rota:
- `/admin`

Secoes atuais:
- Site Settings
- Home
- Stores
- Blog
- Partners
- Leasing
- About

Comportamento:
- cada secao tem formulario proprio com validacao frontend
- salvar escreve no contexto + repositorio selecionado por flag
- reset por secao e reset global usam a mesma camada de dados
- modo local: acesso direto em `/admin`
- modo remoto: `/admin` exige login Supabase e validacao em `GET /api/admin/me`

## 7) Limitacoes atuais
- persistencia local por navegador/dispositivo
- sem sincronizacao multiusuario
- sem controle de acesso real
- sem upload de midia real
- sem versionamento/historico de alteracoes
- sem observabilidade de erros de persistencia em ambiente real

## 8) Preparacao para futura integracao com Supabase
Ja preparado:
- contrato unico de repositorio (`ContentRepository`)
- selecao central de origem em `createContentRepository()`
- placeholder explicito: `SupabaseContentRepository` (hoje faz fallback local)
- provider de auth admin: `src/context/auth/AdminAuthProvider.tsx`
- guard do painel admin: `src/components/auth/AdminRouteGuard.tsx`
- UI desacoplada da origem por `useSiteContent()` e snapshot derivado
- tipos de dominio centralizados em `src/types/domain/*`

Troca futura prevista:
- manter UI/contexto
- implementar leitura/escrita remota no repositorio Supabase
- manter mapping de dados na camada `services/content` (nao nas paginas)

## 9) Proximos passos recomendados
1. Implementar repositorio remoto com interface identica ao local
2. Introduzir camada async de bootstrap (loading/error global de conteudo)
3. Adicionar auth para rota `/admin` quando backend existir
4. Implementar upload de imagem e troca de URLs manuais por assets gerenciados
5. Adicionar testes de contrato do repositorio (local e remoto)
6. Padronizar encoding dos textos para eliminar caracteres corrompidos

## 10) Deploy frontend na Vercel
Projeto recomendado:
- `fashion-mall` (frontend separado da API)

Variaveis obrigatorias em `preview` e `production`:
- `VITE_CONTENT_BACKEND_MODE=remote`
- `VITE_API_BASE_URL=https://fashion-bras-api.vercel.app`
- `VITE_SUPABASE_URL=<url publica do projeto Supabase>`
- `VITE_SUPABASE_ANON_KEY=<anon key publica do Supabase>`
- `VITE_SITE_URL=<url publica do frontend>`

Variaveis opcionais:
- `BASE_PATH=/`
- `PORT=4173`

Passo a passo (CLI):
```powershell
pnpm.cmd dlx vercel pull --yes --environment production --cwd artifacts/fashion-mall --scope <seu-time>
pnpm.cmd dlx vercel build --prod --yes --cwd artifacts/fashion-mall --scope <seu-time>
pnpm.cmd dlx vercel deploy --prebuilt --prod --yes --cwd artifacts/fashion-mall --scope <seu-time>
```

Notas de roteamento SPA:
- `vercel.json` em `artifacts/fashion-mall` inclui fallback para `index.html`.
- isso evita `404` ao dar refresh em rotas como `/admin`, `/blog/:slug`, `/lojas/:id`.

---

## Notas de manutencao desta rodada
- removidos wrappers e arquivos mortos do admin (`AdminSidebar`, `AdminTabPanel`, `components/tabs/*`)
- removida dependencia nao utilizada `tw-animate-css`
- simplificado barrel de conteudo para exportar tipos direto de `@/types`
