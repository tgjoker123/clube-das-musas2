import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import type { UserRole } from "@musas/database";
import { AuthService, type ResolvedContext } from "./auth.service";
import { ROLES_KEY } from "./roles.decorator";

declare module "express" {
  interface Request {
    context?: ResolvedContext;
  }
}

/**
 * Executa DEPOIS de `SupabaseAuthGuard`. Resolve o perfil completo
 * (`request.context`) e, se a rota tiver `@Roles(...)`, valida que o papel
 * do usuário está na lista permitida — nunca confiando apenas no que o
 * frontend esconde/mostra (docs/03_REGRAS_DE_NEGOCIO.md §1).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.authUser) {
      throw new UnauthorizedException("Rota protegida sem SupabaseAuthGuard aplicado antes.");
    }

    const resolved = await this.authService.resolveContext(request.authUser);
    if (!resolved) {
      throw new ForbiddenException("Cadastro ainda não concluído.");
    }
    request.context = resolved;

    const requiredRoles = this.reflector.get<UserRole[] | undefined>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!requiredRoles.includes(resolved.role)) {
      throw new ForbiddenException("Você não tem permissão para acessar este recurso.");
    }

    return true;
  }
}
