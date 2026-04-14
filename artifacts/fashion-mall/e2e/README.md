# E2E Admin - Playwright

## Escopo coberto
- login admin real (Supabase Auth)
- carregamento do painel autenticado
- edição + salvamento de seção
- persistência após refresh
- reset de seção (opcional/destrutivo)
- reset all (cancel + opcional/destrutivo)
- upload/replace/delete de imagem (opcional)
- logout

## Pré-requisitos
1. `pnpm install`
2. `pnpm --filter @workspace/fashion-mall e2e:install`
3. Variáveis E2E configuradas (veja `.env.e2e.example`)

## Execução
### 1) Ambiente já rodando (preview/staging/local manual)
```bash
pnpm --filter @workspace/fashion-mall e2e
```

### 2) Subindo stack local automaticamente
```bash
E2E_START_LOCAL_STACK=true pnpm --filter @workspace/fashion-mall e2e
```

No Windows PowerShell:
```powershell
$env:E2E_START_LOCAL_STACK='true'
pnpm.cmd --filter @workspace/fashion-mall e2e
```

## Flags importantes
- `E2E_ALLOW_DESTRUCTIVE_SECTION_RESET=true`: habilita teste de reset de seção.
- `E2E_ALLOW_DESTRUCTIVE_RESET_ALL=true`: habilita reset all (destrutivo).
- `E2E_ENABLE_MEDIA_TESTS=true`: habilita upload/replace/delete.

## Observações
- Os cenários destrutivos ficam desativados por padrão para evitar impacto em produção.
- Para homologação externa, execute preferencialmente em ambiente de staging/preview.

