import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { RecadosService } from "./recados.service";
import { CreateRecadoDto } from "./dto/create-recado.dto";

@Controller("recados")
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Post()
  @Roles("professor")
  create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateRecadoDto) {
    return this.recadosService.create(user.professorId!, dto);
  }

  @Get()
  @Roles("professor")
  list(@CurrentUser() user: CurrentUserType) {
    return this.recadosService.listForProfessor(user.professorId!);
  }

  @Get("me")
  @Roles("aluna")
  listMine(@CurrentUser() user: CurrentUserType) {
    return this.recadosService.listForAluna(user.alunaId!);
  }

  @Delete(":id")
  @Roles("professor")
  remove(@CurrentUser() user: CurrentUserType, @Param("id") id: string) {
    return this.recadosService.remove(user.professorId!, id);
  }
}
