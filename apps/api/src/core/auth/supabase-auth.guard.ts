import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ADMIN_CLIENT } from "../../platform/integrations/supabase/supabase.module";

export interface AuthUser {
  /** sub do JWT — id do usuário no Supabase Auth (auth.users.id). */
  id: string;
  email: string;
  /** Vem de `options.data.full_name` passado ao `supabase.auth.signUp()`. */
  fullName?: string;
}

declare module "express" {
  interface Request {
    authUser?: AuthUser;
  }
}

/**
 * Valida o JWT do Supabase Auth enviado em `Authorization: Bearer <token>`.
 * Não exige que exista uma linha em `users` — apenas confirma que o token é
 * válido. Rotas que precisam do perfil completo (papel, professor_id...)
 * resolvem isso explicitamente via AuthService (ver core/auth/auth.service.ts),
 * porque durante o cadastro essa linha ainda não existe.
 *
 * Nunca decodificar/confiar no JWT localmente sem essa validação — sempre
 * confirmar contra o Supabase Auth (docs/10_AUTENTICACAO_E_SEGURANCA.md).
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(@Inject(SUPABASE_ADMIN_CLIENT) private readonly supabase: SupabaseClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("Token de autenticação ausente.");
    }

    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException("Token de autenticação inválido ou expirado.");
    }

    if (!data.user.email) {
      throw new UnauthorizedException("Conta sem e-mail associado.");
    }

    const fullName = data.user.user_metadata?.["full_name"] as string | undefined;
    request.authUser = { id: data.user.id, email: data.user.email, fullName };
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return undefined;
    }
    return header.slice("Bearer ".length);
  }
}
