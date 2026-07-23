import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { SupabaseAuthGuard } from "./supabase-auth.guard";
import { RolesGuard } from "./roles.guard";
import { CurrentAuthUser } from "./auth-user.decorator";
import { CurrentContext } from "./current-context.decorator";
import { AuthService, type ResolvedContext } from "./auth.service";
import type { AuthUser } from "./supabase-auth.guard";
import { RegisterProfessorDto } from "./dto/register-professor.dto";
import { RegisterPartnerDto } from "./dto/register-partner.dto";
import { ActivateStudentDto } from "./dto/activate-student.dto";

/**
 * Login, logout e recuperação de senha NÃO têm endpoint aqui — são feitos
 * diretamente pelo frontend via Supabase Auth (docs/00_ARQUITETURA.md §2 e
 * docs/10_AUTENTICACAO_E_SEGURANCA.md: "sempre utilizar os mecanismos
 * oficiais do Supabase"). Este controller cuida apenas da criação/leitura
 * do PERFIL DE NEGÓCIO associado a uma identidade já autenticada.
 */
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/professor")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  registerProfessor(
    @CurrentAuthUser() authUser: AuthUser,
    @Body() dto: RegisterProfessorDto,
  ): Promise<ResolvedContext> {
    return this.authService.registerProfessor(authUser, dto);
  }

  @Post("register/partner")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  registerPartner(
    @CurrentAuthUser() authUser: AuthUser,
    @Body() dto: RegisterPartnerDto,
  ): Promise<ResolvedContext> {
    return this.authService.registerPartner(authUser, dto);
  }

  // Superfície sensível: o token é a única credencial. Limite estrito
  // dificulta tentativas de força bruta contra o espaço de tokens.
  @Get("invites/:token")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  getInvite(@Param("token") token: string) {
    return this.authService.getInvite(token);
  }

  @Post("activate")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  activate(
    @CurrentAuthUser() authUser: AuthUser,
    @Body() dto: ActivateStudentDto,
  ): Promise<ResolvedContext> {
    return this.authService.activateStudent(authUser, dto.token);
  }

  @Get("me")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  me(@CurrentContext() context: ResolvedContext): ResolvedContext {
    return context;
  }

  @Post("logout")
  @HttpCode(204)
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async logout(@CurrentContext() context: ResolvedContext): Promise<void> {
    await this.authService.logout(context);
  }
}
