import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { ResolvedContext } from "./auth.service";

/** Injeta o perfil completo resolvido por `RolesGuard`. */
export const CurrentContext = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ResolvedContext => {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.context) {
      throw new Error(
        "CurrentContext usado em uma rota sem RolesGuard — adicione @UseGuards(SupabaseAuthGuard, RolesGuard).",
      );
    }
    return request.context;
  },
);
