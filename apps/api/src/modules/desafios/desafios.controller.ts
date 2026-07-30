import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { DesafiosService } from "./desafios.service";
import { CreateDesafioDto } from "./dto/create-desafio.dto";

@Controller("desafios")
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @Roles("professor")
  create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateDesafioDto) {
    return this.desafiosService.create(user.professorId!, dto);
  }

  @Get()
  @Roles("professor")
  list(@CurrentUser() user: CurrentUserType) {
    return this.desafiosService.list(user.professorId!);
  }

  @Get("ativos")
  @Roles("aluna")
  getAtivos(@CurrentUser() user: CurrentUserType) {
    return this.desafiosService.getAtivosParaAluna(user.alunaId!);
  }

  @Get(":id/ranking")
  @Roles("professor")
  getRanking(@CurrentUser() user: CurrentUserType, @Param("id") id: string) {
    return this.desafiosService.getRanking(user.professorId!, id);
  }

  @Delete(":id")
  @Roles("professor")
  remove(@CurrentUser() user: CurrentUserType, @Param("id") id: string) {
    return this.desafiosService.remove(user.professorId!, id);
  }
}
