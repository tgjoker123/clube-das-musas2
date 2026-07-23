import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";

/**
 * Instância singleton do Prisma Client. Reutilizada entre módulos do
 * apps/api para evitar exaustão do pool de conexões — nunca instanciar
 * PrismaClient diretamente fora deste arquivo (ver
 * docs/00_ARQUITETURA.md §6.3).
 *
 * A partir do Prisma 7, a connection string não fica mais no schema —
 * é fornecida em tempo de execução via driver adapter (ver
 * prisma/schema.prisma para o motivo).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL não definida — ver packages/database/.env.example");
  }

  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "./generated/prisma/client.ts";
