# Fashion Bras Frontend - Technical README

## 1) Visao geral
Este pacote (`artifacts/fashion-mall`) contem o frontend SPA do Fashion Bras (site institucional + painel admin frontend-only).

Estado atual:
- Sem backend e sem API remota.
- Persistencia local via `localStorage`.
- Mocks como base padrao (fallback).
- UI publica e admin consumindo a mesma camada de dados (`useSiteContent`).

Objetivo arquitetural:
- Manter o projeto simples hoje.
- Permitir troca de persistencia (local -> Supabase) sem reescrever paginas e componentes.

## 2) Stack utilizada
Core:
- React 19
- TypeScript
- Vite 7
- Wouter (roteamento)
- Tailwind CSS 4
- Framer Motion
- Lucide React

Build/dev plugins:
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- plugins Replit de desenvolvimento (`runtime-error-modal`, `cartographer`, `dev-banner`)

## 3) Estrutura de pastas
```text
artifacts/fashion-mall/
  src/
    App.tsx
    main.tsx
    index.css
    components/
      cards/
      filters/
      forms/
      layout/
    context/
      AdminDataContext.tsx              # alias de compatibilidade
    features/
      admin/
        components/
          tabs/
          shared/
        constants/
      content/
        adapters/storage/
        context/
        hooks/
        mappers/
        mocks/
        providers/
        repositories/
        services/
        types/
    layouts/
    pages/
    seo/
    types/domain/
    utils/
  vite.config.ts
  tsconfig.json
```

Resumo por camada:
- `features/content/repositories`: contrato e implementacao de acesso a dados.
- `features/content/providers`: estado global (contexto admin/site).
- `features/content/services`: seletores e snapshot de conteudo para UI.
- `features/admin`: UI do painel administrativo, modular por aba.
- `pages` e `components`: camada de apresentacao.

## 4) Como rodar o frontend
Pre requisitos:
- Node.js 22+
- pnpm 10+

Do workspace raiz (`fashion-bras`):
```bash
pnpm install
```

### CMD (Windows)
```bat
set PORT=4173
set BASE_PATH=/
pnpm --filter @workspace/fashion-mall dev
```

### PowerShell (Windows)
```powershell
$env:PORT='4173'
$env:BASE_PATH='/'
pnpm.cmd --filter @workspace/fashion-mall dev
```

Observacao:
- `vite.config.ts` exige `PORT` e `BASE_PATH`.
- Em PowerShell, se houver bloqueio de script para `pnpm`, use `pnpm.cmd`.

Build local:
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

## 5) Como funciona a camada de dados atual
Fluxo atual:
1. Defaults vem de `features/content/mocks/*`.
2. `ContentProvider` inicializa cada secao com:
   - valor salvo no repositorio (`loadSection`) ou
   - fallback padrao (`getDefaultSection`).
3. Admin salva via `set*` no contexto.
4. `set*` persiste no repositorio (`saveSection`) e atualiza estado em memoria.
5. Paginas usam `useSiteContent`, que monta um snapshot derivado em `buildSiteContentSnapshot`.

Pontos chave:
- Contrato unico: `ContentRepository`.
- Implementacao atual: `createLocalContentRepository`.
- Namespace de persistencia local: `fashionbras_admin_data`.
- Chave por secao: `fashionbras_admin_data_<section>`.

## 6) Como o admin funciona hoje
Rota:
- `/admin` -> `AdminPage`.

Comportamento:
- `AdminPage` orquestra abas + reset global.
- Cada aba (`SiteSettings`, `Stores`, `Blog`, `Partners`, `Leasing`, `About`) gerencia estado local de formulario.
- Ao salvar:
  - valida e normaliza dados no frontend,
  - atualiza contexto,
  - persiste em `localStorage`.
- Reset por secao e reset total restauram defaults dos mocks.

Importante:
- Sem autenticacao real.
- Sem envio remoto.
- Frontend-only por design nesta fase.

## 7) Limitacoes atuais
- Persistencia local por navegador/dispositivo.
- Sem sincronizacao multiusuario.
- Sem historico de alteracoes/versionamento.
- Sem controle de acesso (auth/RBAC).
- Sem upload de midia real.
- Sem validacao de regras de negocio no servidor.

## 8) Preparacao para futura integracao com Supabase
O projeto ja esta preparado nos seguintes pontos:
- Abstracao por contrato (`ContentRepository`).
- Inversao no provider: repositorio pode ser injetado.
- Adaptadores e mapeadores dedicados (`adapters`, `mappers`).
- Tipos de dominio centralizados (`src/types/domain/*`).
- Snapshot de conteudo para UI desacoplado da origem de dados.

Troca prevista (sem quebrar UI):
- Hoje: `createLocalContentRepository()`.
- Futuro: `createSupabaseContentRepository()` implementando o mesmo contrato.

## 9) Proximos passos recomendados
1. Criar `SupabaseContentRepository` com a mesma interface de repositorio.
2. Definir mapeamento DTO <-> dominio no `contentStorageMapper` (ou mapper dedicado de API).
3. Introduzir camada async para carregamento inicial (loading/error global de conteudo).
4. Adicionar autenticacao para rota `/admin` (quando backend estiver pronto).
5. Implementar upload de imagens e substituir URLs manuais.
6. Adicionar testes de contrato para repositorio (local e remoto).
7. Adicionar observabilidade basica (erros de persistencia e telemetria de admin).

---

## Decisoes de manutencao recentes
- Removido kit de UI legado nao utilizado para reduzir ruido e dependencia.
- Removidas dependencias nao usadas e wrappers globais sem uso (`react-query`, `toaster`, `tooltip`).
- Mantida arquitetura modular de admin e camada unica de conteudo para evolucao incremental.
