# syntax=docker/dockerfile:1
#
# Build de produção de apps/api. NÃO usado em desenvolvimento local (ver
# docker-compose.yml, que só sobe Postgres/Redis). apps/web e apps/admin
# NÃO possuem Dockerfile — são hospedados na Vercel, não em containers
# (ver docs/00_ARQUITETURA.md ADR #10).

FROM node:20-alpine AS base
RUN npm install -g pnpm turbo

# 1. Poda o monorepo para conter apenas o necessário para apps/api
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune @musas/api --docker

# 2. Instala dependências e builda apenas o que foi podado
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @musas/database run generate
RUN pnpm turbo run build --filter=@musas/api...

# 3. Imagem final, somente com o necessário para rodar
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=builder --chown=nestjs:nodejs /app .
USER nestjs
EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
