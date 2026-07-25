import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthUser } from "./supabase-token.guard";

export const SupabaseUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.authUser;
  },
);
