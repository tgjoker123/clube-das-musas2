import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ADMIN_CLIENT } from "../supabase/supabase.module";

export interface AuthUser {
  authUserId: string;
  email: string;
}

/**
 * Valida só o JWT do Supabase, sem exigir que já exista um Professor/Aluna
 * vinculado — usado nos endpoints de conclusão de cadastro (bootstrap),
 * onde esse vínculo ainda não existe.
 */
@Injectable()
export class SupabaseTokenGuard implements CanActivate {
  constructor(@Inject(SUPABASE_ADMIN_CLIENT) private readonly supabase: SupabaseClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

    if (!token) {
      throw new UnauthorizedException("Token ausente");
    }

    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException("Token inválido");
    }

    const authUser: AuthUser = { authUserId: data.user.id, email: data.user.email ?? "" };
    request.authUser = authUser;
    return true;
  }
}
