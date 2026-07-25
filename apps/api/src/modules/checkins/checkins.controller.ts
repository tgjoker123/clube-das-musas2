import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { CheckinsService } from "./checkins.service";
import { CompleteCheckInDto } from "./dto/complete-checkin.dto";

@Controller("checkins")
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post()
  @Roles("aluna")
  complete(@CurrentUser() user: CurrentUserType, @Body() dto: CompleteCheckInDto) {
    return this.checkinsService.complete(user.alunaId!, dto);
  }

  @Get("me")
  @Roles("aluna")
  listMine(@CurrentUser() user: CurrentUserType) {
    return this.checkinsService.listForAluna(user.alunaId!);
  }

  @Get("aluna/:alunaId")
  @Roles("professor")
  listForAluna(@CurrentUser() user: CurrentUserType, @Param("alunaId") alunaId: string) {
    return this.checkinsService.listForAlunaAsProfessor(user.professorId!, alunaId);
  }
}
