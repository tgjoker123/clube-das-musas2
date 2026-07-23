import { Injectable, Logger, type OnModuleDestroy } from "@nestjs/common";
import { prisma, Prisma } from "@musas/database";
import { RLS_SESSION_VARS } from "@musas/database/rls";

export interface RlsContext {
  /** sub do JWT do Supabase Auth — sempre presente em requisições autenticadas. */
  authUserId?: string;
  /** users.id interno — ausente durante o cadastro (a linha ainda não existe). */
  userId?: string;
  /** users.role resolvido. */
  role?: string;
  /** professors.id do professor autenticado, ou dono da aluna autenticada. */
  professorId?: string;
}

/**
 * Ponto único de acesso ao banco a partir do apps/api.
 *
 * Toda leitura/escrita de negócio passa por `withRlsContext`, que abre uma
 * transação e aplica `SET LOCAL` das variáveis de sessão que as políticas
 * de RLS leem (ver docs/00_ARQUITETURA.md §6.2 e
 * packages/database/prisma/migrations/20260723020000_init_identity_and_auth).
 * Isso garante que mesmo um bug de autorização em uma Service não vaze
 * dados entre tenants — o Postgres aplica a regra de forma independente.
 *
 * Nunca importar `prisma` de `@musas/database` diretamente em uma Service
 * de módulo — sempre através deste serviço.
 */
@Injectable()
export class PrismaService implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async withRlsContext<T>(
    context: RlsContext,
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config(${RLS_SESSION_VARS.authUserId}, ${context.authUserId ?? ""}, true)`;
      await tx.$executeRaw`SELECT set_config(${RLS_SESSION_VARS.userId}, ${context.userId ?? ""}, true)`;
      await tx.$executeRaw`SELECT set_config(${RLS_SESSION_VARS.role}, ${context.role ?? ""}, true)`;
      await tx.$executeRaw`SELECT set_config(${RLS_SESSION_VARS.professorId}, ${context.professorId ?? ""}, true)`;

      return fn(tx);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await prisma.$disconnect();
    this.logger.log("Conexão com o banco encerrada.");
  }
}
