-- ============================================================================
-- Fase 1 — Identidade e Autenticação
-- Cria users, professors, students, partners, audit_logs e aplica as
-- políticas de RLS correspondentes NA MESMA migration (ver
-- docs/04_MODELO_DE_DADOS.md §7 — "nunca RLS depois").
-- ============================================================================

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'professor', 'student', 'partner');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'suspended');

-- CreateEnum
CREATE TYPE "theme_name" AS ENUM ('luxo', 'elegance');

-- CreateEnum
CREATE TYPE "professor_status" AS ENUM ('active', 'suspended');

-- CreateEnum
CREATE TYPE "student_status" AS ENUM ('active', 'inactive', 'suspended', 'delinquent');

-- CreateEnum
CREATE TYPE "partner_status" AS ENUM ('pending', 'active', 'inactive');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" "user_role" NOT NULL,
    "status" "user_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professors" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "business_name" TEXT NOT NULL,
    "phone" TEXT,
    "theme_preference" "theme_name" NOT NULL DEFAULT 'luxo',
    "status" "professor_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "professor_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "birth_date" DATE,
    "joined_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "objective" TEXT,
    "status" "student_status" NOT NULL DEFAULT 'active',
    "invite_token" TEXT,
    "invite_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "category" TEXT,
    "region" TEXT,
    "status" "partner_status" NOT NULL DEFAULT 'pending',
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "resource_type" TEXT,
    "resource_id" UUID,
    "ip_address" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_user_id_key" ON "users"("auth_user_id");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "professors_user_id_key" ON "professors"("user_id");
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");
CREATE UNIQUE INDEX "students_invite_token_key" ON "students"("invite_token");
CREATE INDEX "students_professor_id_status_idx" ON "students"("professor_id", "status");
CREATE UNIQUE INDEX "partners_user_id_key" ON "partners"("user_id");
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");
CREATE INDEX "audit_logs_resource_type_resource_id_idx" ON "audit_logs"("resource_type", "resource_id");

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "students" ADD CONSTRAINT "students_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================================
-- Row Level Security
--
-- Identidade é resolvida via variáveis de sessão Postgres, definidas pelo
-- NestJS a cada requisição dentro da mesma transação (SET LOCAL), conforme
-- docs/00_ARQUITETURA.md §6.2:
--
--   app.current_auth_user_id  → sub do JWT do Supabase Auth (SEMPRE
--                                disponível assim que o JWT é validado,
--                                mesmo antes de existir uma linha em
--                                `users` — necessário para o cadastro).
--   app.current_user_id       → users.id interno, resolvido após lookup
--                                por auth_user_id (nulo durante o cadastro).
--   app.current_role          → users.role resolvido.
--   app.current_professor_id  → professors.id do professor autenticado, OU
--                                do professor dono da aluna autenticada.
--
-- As funções abaixo isolam esse acesso (nunca ler current_setting direto
-- nas políticas, para manter um único ponto de mudança).
-- ============================================================================

CREATE OR REPLACE FUNCTION app_current_auth_user_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.current_auth_user_id', true), '')::UUID
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_current_user_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::UUID
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_current_role() RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('app.current_role', true), '')
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_current_professor_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.current_professor_id', true), '')::UUID
$$ LANGUAGE sql STABLE;

-- ---------------------------------------------------------------------------
-- users — Padrão C (estritamente próprio)
-- ---------------------------------------------------------------------------
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- A cláusula auth_user_id permite que um usuário recém-autenticado encontre
-- a PRÓPRIA linha (bootstrap: resolver current_user_id a partir do JWT,
-- antes de current_user_id existir como variável de sessão).
CREATE POLICY users_select ON "users" FOR SELECT
  USING (
    id = app_current_user_id()
    OR auth_user_id = app_current_auth_user_id()
    OR app_current_role() = 'admin'
  );

CREATE POLICY users_update ON "users" FOR UPDATE
  USING (id = app_current_user_id() OR app_current_role() = 'admin');

-- INSERT só é permitido para o próprio usuário recém-autenticado no Supabase
-- Auth (cadastro) — identificado pelo auth_user_id do JWT, já que
-- current_user_id ainda não existe nesse momento.
CREATE POLICY users_insert ON "users" FOR INSERT
  WITH CHECK (auth_user_id = app_current_auth_user_id());

-- ---------------------------------------------------------------------------
-- professors — Padrão A (tenant do professor)
-- ---------------------------------------------------------------------------
ALTER TABLE "professors" ENABLE ROW LEVEL SECURITY;

-- A cláusula user_id permite que o professor encontre a PRÓPRIA linha logo
-- após o login (bootstrap: resolver current_professor_id), antes dessa
-- variável de sessão existir.
CREATE POLICY professors_select ON "professors" FOR SELECT
  USING (
    id = app_current_professor_id()
    OR user_id = app_current_user_id()
    OR app_current_role() = 'admin'
  );

CREATE POLICY professors_update ON "professors" FOR UPDATE
  USING (
    id = app_current_professor_id()
    OR user_id = app_current_user_id()
    OR app_current_role() = 'admin'
  );

-- Um usuário só pode criar SEU PRÓPRIO registro de professor (cadastro).
CREATE POLICY professors_insert ON "professors" FOR INSERT
  WITH CHECK (user_id = app_current_user_id());

-- ---------------------------------------------------------------------------
-- students — Padrão B (aluna via professor)
-- ---------------------------------------------------------------------------
ALTER TABLE "students" ENABLE ROW LEVEL SECURITY;

-- A cláusula de convite pendente permite a leitura/ativação do próprio
-- registro ANTES de existir sessão resolvida (ver docs/03_REGRAS_DE_NEGOCIO.md
-- — a aluna é criada pelo professor e ativa a conta depois via token).
-- O token tem alta entropia e é exigido explicitamente pela aplicação
-- (WHERE invite_token = :token) — a política apenas permite a linha
-- passar, nunca lista convites de outras alunas.
CREATE POLICY students_select ON "students" FOR SELECT
  USING (
    professor_id = app_current_professor_id()
    OR user_id = app_current_user_id()
    OR (user_id IS NULL AND invite_token IS NOT NULL AND invite_expires_at > now())
    OR app_current_role() = 'admin'
  );

CREATE POLICY students_insert ON "students" FOR INSERT
  WITH CHECK (professor_id = app_current_professor_id());

CREATE POLICY students_update ON "students" FOR UPDATE
  USING (
    professor_id = app_current_professor_id()
    OR (user_id IS NULL AND invite_token IS NOT NULL AND invite_expires_at > now())
    OR app_current_role() = 'admin'
  );

-- ---------------------------------------------------------------------------
-- partners — Padrão D (tenant do parceiro)
-- ---------------------------------------------------------------------------
ALTER TABLE "partners" ENABLE ROW LEVEL SECURITY;

CREATE POLICY partners_select ON "partners" FOR SELECT
  USING (user_id = app_current_user_id() OR app_current_role() = 'admin');

CREATE POLICY partners_update ON "partners" FOR UPDATE
  USING (user_id = app_current_user_id() OR app_current_role() = 'admin');

CREATE POLICY partners_insert ON "partners" FOR INSERT
  WITH CHECK (user_id = app_current_user_id());

-- ---------------------------------------------------------------------------
-- audit_logs — Padrão G (auditoria, append-only)
-- ---------------------------------------------------------------------------
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_select ON "audit_logs" FOR SELECT
  USING (user_id = app_current_user_id() OR app_current_role() = 'admin');

-- Escrita de auditoria é sempre feita pela aplicação em nome do usuário
-- autenticado (ou sem usuário, para eventos de sistema) — nunca por perfis
-- não autenticados.
CREATE POLICY audit_logs_insert ON "audit_logs" FOR INSERT
  WITH CHECK (
    app_current_auth_user_id() IS NOT NULL
    AND (user_id = app_current_user_id() OR user_id IS NULL)
  );
