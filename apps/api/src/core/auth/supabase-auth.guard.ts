import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ADMIN_CLIENT } from "../supabase/supabase.module";
import { PrismaService } from "../database/prisma.service";
import type { CurrentUser } from "./current-user";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT) private readonly supabase: SupabaseClient,
    private readonly prisma: PrismaService,
  ) {}

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

    const authUserId = data.user.id;
    const email = data.user.email ?? "";

    const professor = await this.prisma.professor.findUnique({
      where: { authUserId },
    });
    if (professor) {
      const user: CurrentUser = {
        authUserId,
        email,
        role: "professor",
        professorId: professor.id,
      };
      request.user = user;
      return true;
    }

    const aluna = await this.prisma.aluna.findUnique({ where: { authUserId } });
    if (aluna) {
      const user: CurrentUser = {
        authUserId,
        email,
        role: "aluna",
        alunaId: aluna.id,
      };
      request.user = user;
      return true;
    }

    throw new UnauthorizedException("Usuário autenticado não possui perfil vinculado");
  }
}
