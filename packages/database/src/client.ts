import { PrismaClient } from "./generated/prisma/index.js";

export * from "./generated/prisma/index.js";

export function createPrismaClient(): PrismaClient {
  return new PrismaClient();
}
