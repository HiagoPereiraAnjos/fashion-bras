# Preview Access Strategy (Vercel)

## Objetivo
Permitir QA externo e stakeholders validarem o frontend sem abrir toda a superficie de preview e sem enfraquecer seguranca operacional.

## Comparativo de opcoes

### 1) Manter protecao Vercel (login de conta) e usar acessos internos
- Pros:
  - Mais seguro para previews.
  - Zero mudanca arquitetural.
- Contras:
  - Bloqueia QA externo sem conta Vercel.
  - Gera gargalo no time interno.

### 2) Liberar preview publicamente com controles compensatorios
- Pros:
  - QA externo imediato.
  - Menor esforco inicial.
- Contras:
  - Todas as URLs de preview ficam acessiveis.
  - Aumenta risco de exposicao de fluxo incompleto.

### 3) Criar ambiente staging separado (recomendado)
- Pros:
  - URL estavel para QA externo.
  - Mantem previews internos protegidos.
  - Isola risco operacional.
- Contras:
  - Requer um segundo projeto na Vercel.
  - Exige governanca simples de env/CORS.

### 4) Usar dominio especifico de homologacao
- Pros:
  - Facil compartilhamento (`staging.<dominio>`).
  - Melhor previsibilidade para testes.
- Contras:
  - So funciona bem se atrelado a ambiente staging dedicado.

### 5) Proteger apenas admin e deixar site publico
- Pros:
  - Coerente com produto (site publico).
  - Simples para validacao de conteudo.
- Contras:
  - Nao substitui estrategia de isolamento de preview.
  - Exige hardening de auth/admin e CORS.

## Recomendacao para este projeto
Adotar **opcao 3 + 4 + 5**:
- `frontend-prod` (publico) para producao.
- `frontend-staging` (publico controlado) para QA externo com dominio estavel.
- `frontend-preview` (interno) com Vercel Authentication para PR/dev.
- Admin sempre protegido por Supabase Auth + verificacao de `admin_users` no backend.

Essa combinacao resolve o bloqueio de QA externo sem abrir todos os previews internos.

## Arquitetura operacional (curto prazo)
- Frontend prod: dominio oficial.
- Frontend staging: `staging.fashionbras.com.br` (ou equivalente).
- Frontend preview interno: URLs de PR protegidas por Vercel Authentication.
- Backend unico (API): mesma API para prod/staging/preview, com CORS estrito por ambiente.

## Passos exatos de implementacao

1. Criar projeto Vercel dedicado para staging
- Nome sugerido: `fashion-mall-staging`.
- Root directory: `artifacts/fashion-mall`.
- Build: padrao Vite ja suportado pelo `vercel.json` local.

2. Conectar branch de homologacao
- Criar branch `staging`.
- Configurar projeto `fashion-mall-staging` para deploy automatico da branch `staging`.

3. Configurar dominio de homologacao
- Adicionar `staging.fashionbras.com.br` no projeto `fashion-mall-staging`.
- Validar TLS ativo.

4. Definir protecao de acesso por projeto
- `fashion-mall-preview` (interno): manter Vercel Authentication em preview.
- `fashion-mall-staging` (externo): desativar Vercel Authentication para permitir QA externo.
- `fashion-mall-prod`: publico.

5. Configurar envs do frontend por projeto
- Todos: `VITE_CONTENT_BACKEND_MODE=remote`
- Staging: `VITE_SITE_URL=https://staging.fashionbras.com.br`
- Prod: `VITE_SITE_URL=https://<dominio-producao>`
- Ambos: `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

6. Ajustar CORS da API para incluir staging
- Em backend, incluir dominio staging em `CORS_ALLOWED_ORIGINS`.
- Manter allowlist estrita.
- Exemplo:
  - `https://fashionbras.com.br`
  - `https://www.fashionbras.com.br`
  - `https://staging.fashionbras.com.br`
  - `http://localhost:4173`

7. Validar protecao do admin
- Confirmar que `/admin` exige login Supabase.
- Confirmar `GET /api/admin/me` e mutacoes protegidas retornando `401/403` sem token/permissao.

8. Operacao diaria
- PR/dev: valida no projeto preview interno.
- Homologacao externa: merge em `staging`.
- Producao: promote/merge para branch de producao.

## Checklist de validacao (preview/staging)
- Preview interno bloqueado sem conta Vercel.
- Staging acessivel por QA externo via dominio estavel.
- Site publico carrega sem erros de CORS.
- `/admin` sempre exige autenticacao.
- Usuario sem `admin_users` recebe `403` nas mutacoes.
- Upload de imagem no admin funciona em staging.
- Conteudo salvo no admin reflete no site staging apos refresh.
- Console sem erros criticos (CSP/CORS/auth).
- SEO de staging com `noindex` em configuracao do projeto (header ou plataforma).

## Riscos e mitigacoes
- Risco: confundir staging e producao.
  - Mitigacao: dominio dedicado e convencao de branch (`staging`).
- Risco: CORS abrir demais ao incluir staging.
  - Mitigacao: allowlist explicita sem curingas.
- Risco: QA testar em preview interno por engano.
  - Mitigacao: comunicar URL oficial de homologacao.
