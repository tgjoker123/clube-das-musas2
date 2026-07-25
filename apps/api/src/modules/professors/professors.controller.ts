import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { SupabaseTokenGuard } from "../../core/auth/supabase-token.guard";
import { SupabaseUser } from "../../core/auth/auth-user.decorator";
import type { AuthUser } from "../../core/auth/supabase-token.guard";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { RolesGuard } from "../../core/auth/roles.guard";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { ProfessorsService } from "./professors.service";
import { RegisterProfessorDto } from "./dto/register-professor.dto";
import { UpdateProfessorDto } from "./dto/update-professor.dto";

@Controller("professors")
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Post()
  @UseGuards(SupabaseTokenGuard)
  registerProfile(@SupabaseUser() authUser: AuthUser, @Body() dto: RegisterProfessorDto) {
    return this.professorsService.registerProfile(authUser, dto);
  }

  @Get("me")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  getProfile(@CurrentUser() user: CurrentUserType) {
    return this.professorsService.getProfile(user.professorId!);
  }

  @Patch("me")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  updateProfile(@CurrentUser() user: CurrentUserType, @Body() dto: UpdateProfessorDto) {
    return this.professorsService.updateProfile(user.professorId!, dto);
  }
}
