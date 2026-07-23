import { SetMetadata } from "@nestjs/common";
import type { UserRole } from "@musas/database";

export const ROLES_KEY = "roles";

/** Restringe uma rota aos papéis informados — usado com `RolesGuard`. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
