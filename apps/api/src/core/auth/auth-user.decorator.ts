import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { AuthUser } from "./supabase-auth.guard";

/**
 * Injeta a identidade bruta do Supabase Auth (id + email) resolvida por
 * `SupabaseAuthGuard`. Para o perfil completo (papel, professor_id...),
 * use `AuthService.getContext()` — ver core/auth/auth.service.ts.
 */
export const CurrentAuthUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.authUser) {
      throw new Error(
        "CurrentAuthUser usado em uma rota sem SupabaseAuthGuard — adicione @UseGuards(SupabaseAuthGuard).",
      );
    }
    return request.authUser;
  },
);
