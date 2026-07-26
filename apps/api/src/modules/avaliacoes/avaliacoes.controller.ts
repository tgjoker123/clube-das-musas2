import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { AvaliacoesService } from "./avaliacoes.service";
import { CreateAvaliacaoDto } from "./dto/create-avaliacao.dto";

@Controller("avaliacoes-treino")
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @Post()
  @Roles("aluna")
  create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateAvaliacaoDto) {
    return this.avaliacoesService.createOrUpdateHoje(user.alunaId!, dto);
  }

  @Get("me")
  @Roles("aluna")
  listMine(@CurrentUser() user: CurrentUserType) {
    return this.avaliacoesService.listForAluna(user.alunaId!);
  }

  @Get("aluna/:alunaId")
  @Roles("professor")
  listForAluna(@CurrentUser() user: CurrentUserType, @Param("alunaId") alunaId: string) {
    return this.avaliacoesService.listForAlunaAsProfessor(user.professorId!, alunaId);
  }
}
