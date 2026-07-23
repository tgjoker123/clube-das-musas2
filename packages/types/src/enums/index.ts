/**
 * Enums compartilhados entre apps/api e os frontends — espelham os enums
 * do Prisma (packages/database/prisma/schema.prisma), mas como tipos
 * simples (sem depender do client gerado, que é exclusivo do backend).
 */
export type UserRole = "admin" | "professor" | "student" | "partner";
export type ThemeName = "luxo" | "elegance";
