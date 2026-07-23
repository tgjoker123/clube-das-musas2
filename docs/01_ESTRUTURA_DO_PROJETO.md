# ESTRUTURA DO PROJETO — CLUBE DAS MUSAS

## 0. Papel deste documento

Este documento detalha a estrutura completa de pastas do monorepo, em conformidade com a arquitetura definida em [00_ARQUITETURA.md](00_ARQUITETURA.md).

Esta é uma estrutura de **referência** para a Fase 0 (Fundação Técnica) do [plano de desenvolvimento](PROMPT_MESTRE.md). Pastas de módulos futuros (ex.: Marketplace, IA) já aparecem aqui para que o time entenda o destino final, mesmo que sejam criadas apenas na fase correspondente do plano.

Nenhum arquivo de código é criado neste documento — apenas a estrutura de diretórios e o propósito de cada um.

---

## 1. Visão Geral do Monorepo

```
clube-das-musas/
├── apps/
│   ├── web/          → Next.js — Professor, Aluna e Parceiro
│   ├── admin/         → Next.js — Admin SaaS (isolado)
│   └── api/            → NestJS — API de negócio (único acesso ao banco)
├── packages/
│   ├── ui/             → Design system compartilhado
│   ├── types/          → Tipos e schemas Zod compartilhados
│   ├── utils/           → Funções puras compartilhadas
│   ├── config/           → Configurações compartilhadas (ESLint, TSConfig, Tailwind)
│   ├── database/         → Schema Prisma, migrations, client
│   └── api-contracts/     → Cliente HTTP tipado gerado a partir do Swagger
├── docs/                    → Documentação do projeto
├── .github/
│   └── workflows/           → Pipelines de CI/CD
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

**Motivo técnico:** a separação `apps/` vs `packages/` é a convenção padrão de monorepos com Turborepo — `apps/` contém tudo que é implantável (deployable) de forma independente, `packages/` contém código compartilhado que nenhuma dessas aplicações expõe sozinho.

---

## 2. `apps/web` — Professor, Aluna e Parceiro

```
apps/web/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── login/
│   │   │   ├── cadastro/
│   │   │   ├── recuperar-senha/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── professor/            → segmento de rota real (não route group — ver nota abaixo)
│   │   │   ├── dashboard/
│   │   │   ├── alunas/
│   │   │   │   └── [studentId]/
│   │   │   │       ├── evolucao/
│   │   │   │       ├── anamnese/
│   │   │   │       ├── pagamentos/
│   │   │   │       └── ficha/
│   │   │   ├── exercicios/
│   │   │   ├── fichas-de-treino/
│   │   │   ├── campanhas/
│   │   │   ├── feed/
│   │   │   ├── relatorios/
│   │   │   ├── configuracoes/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── aluna/                → segmento de rota real
│   │   │   ├── inicio/
│   │   │   ├── treino/
│   │   │   ├── checkin/
│   │   │   ├── evolucao/
│   │   │   ├── gamificacao/
│   │   │   ├── feed/
│   │   │   ├── marketplace/
│   │   │   │   ├── [productId]/
│   │   │   │   └── carrinho/
│   │   │   ├── pagamentos/
│   │   │   ├── perfil/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── parceiro/             → segmento de rota real
│   │   │   ├── dashboard/
│   │   │   ├── produtos/
│   │   │   ├── pedidos/
│   │   │   ├── avaliacoes/
│   │   │   ├── repasses/
│   │   │   └── layout.tsx
│   │   │
│   │   └── layout.tsx        → layout raiz (tema Luxo/Elegance, providers globais)
│   │
│   ├── modules/                → lógica de UI por domínio (mirror das pastas de rota)
│   │   ├── professor/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/         → chamadas via packages/api-contracts
│   │   ├── aluna/
│   │   ├── parceiro/
│   │   ├── gamificacao/
│   │   ├── marketplace/
│   │   └── auth/
│   │
│   ├── components/               → componentes de UI genéricos da aplicação (não do design system)
│   ├── hooks/                    → hooks globais (useTheme, useSession)
│   ├── stores/                   → stores Zustand (estado de UI local)
│   ├── lib/                      → clientes (Supabase Auth/Storage, TanStack Query)
│   └── proxy.ts                  → validação de sessão e perfil por prefixo de rota (antigo middleware.ts)
│
├── public/
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

**Motivo técnico:** a pasta `modules/` espelha as pastas de rota por perfil em `app/`, mas separa lógica (hooks, chamadas de API, componentes específicos de domínio) da camada de roteamento do Next.js. Isso evita que arquivos de rota (`page.tsx`) cresçam demais e mantém a lógica de cada domínio testável isoladamente da estrutura de pastas do App Router.

**Nota de implementação — segmentos reais em vez de route groups:** `professor/`, `aluna/` e `parceiro/` são pastas de rota reais (URLs `/professor/...`, `/aluna/...`, `/parceiro/...`), não _route groups_ `(entre parênteses)`. Duas razões: (1) route groups são invisíveis na URL, então duas telas de perfis diferentes com o mesmo nome de segmento (ex.: `feed` do professor e `feed` da aluna) colidiriam no mesmo caminho — um erro real de build do Next.js; (2) o `proxy.ts` (antigo `middleware.ts`) que valida perfil/sessão por área precisa de um prefixo de URL distinguível (`/professor/*`, `/aluna/*`) para funcionar — isso é impossível com route groups, já que eles não aparecem na URL. `(public)` permanece como route group porque suas páginas (`/`, `/login`, `/cadastro`) devem ficar na raiz do domínio, sem prefixo, e não colidem com as áreas autenticadas.

---

## 3. `apps/admin` — Admin SaaS

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/            → login com MFA obrigatório
│   │   ├── dashboard/
│   │   ├── professores/
│   │   │   └── [professorId]/
│   │   ├── planos/
│   │   ├── licencas/
│   │   ├── parceiros-pendentes/  → aprovação de parceiros
│   │   ├── pagamentos/
│   │   ├── logs/                 → visualização de audit_logs
│   │   └── layout.tsx
│   ├── modules/
│   ├── components/
│   ├── lib/
│   └── proxy.ts                    → exige perfil "admin" + MFA validado
├── next.config.ts
└── package.json
```

**Motivo técnico:** aplicação separada e enxuta, sem os módulos de Professor/Aluna/Parceiro — reduz superfície de ataque e permite políticas de deploy mais restritas (ex.: domínio interno, allowlist de IP), conforme justificado em [00_ARQUITETURA.md](00_ARQUITETURA.md#32-divisão-em-apps).

---

## 4. `apps/api` — Backend (NestJS)

```
apps/api/
├── src/
│   ├── main.ts                    → bootstrap, Swagger, pipes globais
│   │
│   ├── core/
│   │   ├── auth/                  → AuthModule (validação de JWT do Supabase)
│   │   ├── rbac/                  → RbacModule (roles, permissions, decorators, guards)
│   │   ├── audit/                 → AuditModule (interceptor de auditoria automática)
│   │   └── common/                → Guards, Interceptors, Filters, Pipes genéricos
│   │
│   ├── modules/
│   │   ├── admin/
│   │   ├── professors/
│   │   ├── students/
│   │   ├── student-health/         → anamnese, exames, evolução física (módulo isolado)
│   │   ├── exercises/
│   │   ├── workouts/
│   │   ├── checkins/
│   │   ├── gamification/
│   │   │   ├── campaigns/
│   │   │   ├── points/
│   │   │   ├── achievements/
│   │   │   ├── rewards/
│   │   │   └── rankings/
│   │   ├── feed/
│   │   ├── marketplace/
│   │   │   ├── partners/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── reviews/
│   │   ├── payments/
│   │   │   ├── subscriptions/     → cobrança SaaS (professor → plataforma)
│   │   │   └── marketplace-payments/ → Mercado Pago + split (aluna → parceiro/professor)
│   │   ├── notifications/
│   │   ├── ai-assistant/
│   │   ├── reports/
│   │   └── settings/
│   │
│   ├── platform/
│   │   ├── storage/                → StorageModule (wrapper Supabase Storage, URLs assinadas)
│   │   ├── queue/                  → QueueModule (configuração BullMQ)
│   │   ├── cache/                  → CacheModule (configuração Redis)
│   │   └── integrations/
│   │       ├── mercado-pago/
│   │       ├── anthropic/
│   │       └── email/
│   │
│   └── webhooks/
│       └── mercado-pago.controller.ts  → endpoint dedicado de recebimento de webhook
│
├── workers/                        → processo separado dos consumers do BullMQ
│   ├── ranking.worker.ts
│   ├── notifications.worker.ts
│   ├── ai-summary.worker.ts
│   └── reports.worker.ts
│
├── test/                           → testes de integração e testes de políticas RLS
├── nest-cli.json
└── package.json
```

Cada pasta dentro de `modules/*` segue o mesmo padrão interno:

```
modules/<nome-do-modulo>/
├── <nome>.controller.ts
├── <nome>.service.ts
├── <nome>.repository.ts
├── <nome>.module.ts
├── dto/
├── entities/            → tipos de domínio (não confundir com model do Prisma)
└── guards/               → guards específicos do módulo, se houver
```

**Motivo técnico:** a pasta `workers/` é fisicamente separada de `src/modules/` porque roda como um **processo distinto** em produção (ver seção 14 de [00_ARQUITETURA.md](00_ARQUITETURA.md)) — separar já na estrutura de pastas evita a tentação de acoplar lógica de worker a um Controller HTTP. O módulo `student-health` fica ao lado de `students`, não dentro dele, reforçando o limite de segurança/compliance descrito na arquitetura.

---

## 5. `packages/database` — Fonte única do schema

```
packages/database/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── client.ts          → instância singleton do Prisma Client
│   └── rls/                → definição das políticas RLS (SQL versionado)
└── package.json
```

**Motivo técnico:** manter as políticas RLS como SQL versionado dentro do mesmo pacote do schema (não apenas configuradas manualmente no painel do Supabase) garante que o isolamento de tenant seja auditável via Git e aplicado de forma idêntica em todos os ambientes (dev/staging/produção).

---

## 6. `packages/ui` — Design System

```
packages/ui/
├── src/
│   ├── components/         → componentes base (Button, Card, Modal, Table, Form...)
│   ├── themes/
│   │   ├── luxo.ts
│   │   └── elegance.ts
│   ├── tokens/              → cores, tipografia, espaçamento
│   └── icons/
└── package.json
```

**Motivo técnico:** componentes vivem aqui apenas se forem genéricos e reutilizáveis entre `apps/web` e `apps/admin`. Componentes específicos de um domínio de negócio (ex.: `CampanhaCard`) pertencem a `apps/web/src/modules/*`, não a este pacote — evita que o design system vire um repositório de componentes de negócio.

---

## 7. `packages/types`, `packages/utils`, `packages/config`, `packages/api-contracts`

```
packages/types/
└── src/
    ├── enums/              → StudentStatus, OrderStatus, CampaignStatus...
    ├── dtos/                → tipos compartilhados de entrada/saída
    └── schemas/              → validações Zod compartilhadas (frontend + backend)

packages/utils/
└── src/
    ├── formatters/           → datas, moeda, telefone
    ├── gamification/          → cálculos de pontuação/streak reutilizados
    └── validators/

packages/config/
├── eslint/
├── typescript/
└── tailwind/

packages/api-contracts/
└── src/
    └── generated/            → cliente HTTP tipado, gerado a partir do Swagger da apps/api
```

**Motivo técnico:** `packages/api-contracts/src/generated` nunca é editado manualmente — é regenerado a cada mudança de contrato na API (etapa do pipeline de CI), garantindo que o frontend nunca fique dessincronizado do backend sem que o build quebre.

---

## 8. `docs/` — Documentação

```
docs/
├── 00_ARQUITETURA.md
├── 01_ESTRUTURA_DO_PROJETO.md
├── 08_BANCO_DE_DADOS.md
├── 09_API.md
├── 10_AUTENTICACAO_E_SEGURANCA.md
└── PROMPT_MESTRE.md
```

**Motivo técnico:** a numeração deixa espaço proposital para documentos intermediários (ex.: `02_DESIGN_SYSTEM.md`, `03_GAMIFICACAO.md`) que poderão ser criados conforme cada fase do plano de desenvolvimento avança, sem forçar renumeração dos arquivos existentes.

---

## 9. Convenções de Nomenclatura

| Item                  | Convenção                                 | Exemplo                                     |
| --------------------- | ----------------------------------------- | ------------------------------------------- |
| Pastas e arquivos     | `kebab-case`                              | `student-health`, `campaign-registrations`  |
| Componentes React     | `PascalCase`                              | `StudentCard.tsx`                           |
| Módulos NestJS        | `kebab-case` + sufixo do tipo             | `students.module.ts`, `students.service.ts` |
| Tabelas do banco      | `snake_case`, inglês, plural              | `student_achievements`                      |
| Rotas da API          | `kebab-case`, inglês, plural, versionadas | `/api/v1/student-workouts`                  |
| Variáveis de ambiente | `SCREAMING_SNAKE_CASE`                    | `SUPABASE_SERVICE_ROLE_KEY`                 |

**Motivo técnico:** nomes de tabelas e rotas em inglês seguem a exigência explícita de [08_BANCO_DE_DADOS.md](08_BANCO_DE_DADOS.md) ("Todos os nomes devem estar em inglês"), enquanto a UI e a documentação permanecem em português — a convenção evita mistura de idiomas dentro do mesmo tipo de artefato.

### 9.1 Extensões em imports relativos (convenção obrigatória)

Todo `import`/`export` relativo dentro de `packages/*` deve incluir a extensão real do arquivo (`.ts`/`.tsx`), ex.: `from "./utils/cn.ts"`, nunca `from "./utils/cn"`.

**Motivo técnico:** nossos packages compartilhados não têm etapa de build — são consumidos como TypeScript puro tanto pelo Next.js (via bundler) quanto pelo apps/api (via execução nativa do Node, que suporta `.ts` diretamente mas exige resolução de módulo estritamente compatível com ESM, sem "adivinhar" extensões como um bundler faz). Sem a extensão explícita, o apps/api falha em runtime com `ERR_MODULE_NOT_FOUND`. Por isso `allowImportingTsExtensions` está habilitado em `packages/config/typescript/base.json` e nos tsconfigs de `apps/web`/`apps/admin`/`apps/api`. O gerador do Prisma Client também é configurado (`importFileExtension = "ts"` em `packages/database/prisma/schema.prisma`) para seguir essa mesma convenção em seu próprio código gerado.

---

Esta estrutura é a base para a **Fase 0 — Fundação Técnica** do plano de desenvolvimento. Nenhuma pasta aqui deve ser criada com código de aplicação antes da aprovação explícita para início da implementação.
