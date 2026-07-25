FROM node:22-slim AS base
WORKDIR /app
RUN npm install -g pnpm@11.16.0

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/database/package.json packages/database/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter @musas/database run generate
RUN pnpm --filter @musas/api run build

FROM node:22-slim AS runner
WORKDIR /app
COPY --from=build /app ./
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
