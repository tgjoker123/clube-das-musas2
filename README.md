# Clube das Musas

Plataforma SaaS multi-tenant para professores de educação física acompanharem suas alunas com gestão profissional, gamificação e marketplace.

## Documentação

Toda a documentação de produto e arquitetura vive em [`docs/`](docs/), e é a fonte de verdade para qualquer decisão de implementação:

- [`PROMPT_MESTRE.md`](docs/PROMPT_MESTRE.md) — diretrizes gerais do projeto
- [`00_ARQUITETURA.md`](docs/00_ARQUITETURA.md) — arquitetura técnica completa
- [`01_ESTRUTURA_DO_PROJETO.md`](docs/01_ESTRUTURA_DO_PROJETO.md) — estrutura de pastas do monorepo
- [`02_MODELO_DE_NEGOCIO.md`](docs/02_MODELO_DE_NEGOCIO.md) — modelo de negócio
- [`03_REGRAS_DE_NEGOCIO.md`](docs/03_REGRAS_DE_NEGOCIO.md) — regras de negócio
- [`04_MODELO_DE_DADOS.md`](docs/04_MODELO_DE_DADOS.md) — modelo de dados e RLS
- [`05_ARQUITETURA_DE_EVENTOS.md`](docs/05_ARQUITETURA_DE_EVENTOS.md) — arquitetura orientada a eventos
- [`06_MVP.md`](docs/06_MVP.md) — escopo oficial do MVP
- [`07_DESIGN_SYSTEM.md`](docs/07_DESIGN_SYSTEM.md) — identidade visual e design system
- [`08_BANCO_DE_DADOS.md`](docs/08_BANCO_DE_DADOS.md), [`09_API.md`](docs/09_API.md), [`10_AUTENTICACAO_E_SEGURANCA.md`](docs/10_AUTENTICACAO_E_SEGURANCA.md) — diretrizes complementares
- [`11_MAPA_DE_TELAS_E_FLUXOS.md`](docs/11_MAPA_DE_TELAS_E_FLUXOS.md) — telas e fluxos de navegação
- [`12_ARQUITETURA_DE_EXPERIENCIA.md`](docs/12_ARQUITETURA_DE_EXPERIENCIA.md) — arquitetura de experiência emocional

## Estrutura do monorepo

```
apps/
  web/      → Next.js — Professor, Aluna e Parceiro (route groups por perfil)
  admin/    → Next.js — Admin SaaS
  api/      → NestJS — API de negócio (core/, modules/, platform/, webhooks/, workers/)
packages/
  ui/             → Design system compartilhado (tokens, temas Luxo/Elegance, componentes base)
  types/          → Tipos, enums, DTOs e schemas Zod compartilhados
  utils/          → Funções puras compartilhadas
  config/         → Configurações compartilhadas (ESLint, TSConfig, Prettier)
  database/       → Schema Prisma, migrations, client
  api-contracts/  → Cliente HTTP tipado gerado a partir do Swagger da apps/api
```

Detalhamento completo em [`docs/01_ESTRUTURA_DO_PROJETO.md`](docs/01_ESTRUTURA_DO_PROJETO.md).

## Requisitos

- Node.js `>= 20` (ver [`.nvmrc`](.nvmrc))
- pnpm `11.16.0` (gerenciado via `packageManager` no `package.json` — instale com `corepack enable` ou `npm install -g pnpm`)
- Docker (para Postgres/Redis locais — opcional se você já tem um projeto Supabase configurado)

## Como rodar localmente

1. **Instalar dependências** (também gera o Prisma Client e instala os git hooks automaticamente):

   ```bash
   pnpm install
   ```

2. **Subir a infraestrutura local** (Postgres + Redis — ver [`docker-compose.yml`](docker-compose.yml)):

   ```bash
   docker compose up -d
   ```

3. **Configurar variáveis de ambiente** — copie cada `.env.example` para `.env` e preencha:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   cp apps/admin/.env.example apps/admin/.env.local
   cp packages/database/.env.example packages/database/.env
   ```

   As chaves `SUPABASE_*`/`NEXT_PUBLIC_SUPABASE_*` vêm do seu projeto Supabase (Auth, Storage e Postgres gerenciado em produção — ver [`docs/00_ARQUITETURA.md`](docs/00_ARQUITETURA.md) §6-7). Para desenvolvimento sem um projeto Supabase configurado, `DATABASE_URL` pode apontar para o Postgres do `docker compose` acima.

4. **Rodar os apps**:
   ```bash
   pnpm --filter @musas/api dev      # http://localhost:3001/api/v1/docs (Swagger)
   pnpm --filter @musas/web dev      # http://localhost:3000
   pnpm --filter @musas/admin dev    # http://localhost:3000 (porta separada se rodado em paralelo)
   ```

### Comandos do monorepo (via Turborepo)

```bash
pnpm dev         # todos os apps em paralelo
pnpm build       # build de todos os apps/packages
pnpm lint        # lint de todos os apps/packages
pnpm typecheck   # typecheck de todos os apps/packages
pnpm format      # formata o repositório inteiro (Prettier)
```

> **Nota (Windows):** o binário nativo do Turborepo (`@turbo/windows-64`) pode falhar em algumas máquinas Windows com o erro `STATUS_DLL_NOT_FOUND`, geralmente por falta do Microsoft Visual C++ Redistributable. Se isso acontecer, instale o [VC++ Redistributable mais recente](https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist) ou rode os comandos por pacote diretamente (`pnpm --filter <pacote> run <script>`), que não dependem do binário do Turborepo.

## Git hooks

Configurados via Husky ([`.husky/`](.husky/)), instalados automaticamente por `pnpm install`:

- `pre-commit` — formata os arquivos staged com Prettier (`lint-staged`).
- `commit-msg` — valida a mensagem de commit no padrão [Conventional Commits](https://www.conventionalcommits.org/) (`commitlint`).

## Estado atual

O projeto concluiu a **Fase 0 — Fundação Técnica**: monorepo, ferramentas (TypeScript, ESLint, Prettier, git hooks), design tokens e componentes base do design system, esqueleto de rotas/módulos dos três apps, infraestrutura Docker local e conexão inicial com Supabase.

Nenhuma funcionalidade de negócio foi implementada ainda (sem telas finais, regras de negócio, sistema de treino, gamificação ou pagamentos) — ver [`docs/06_MVP.md`](docs/06_MVP.md) para o escopo planejado a partir daqui.
