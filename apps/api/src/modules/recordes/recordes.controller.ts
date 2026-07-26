import { Controller, Get, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { RecordesService } from "./recordes.service";

@Controller("recordes")
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class RecordesController {
  constructor(private readonly recordesService: RecordesService) {}

  @Get("me")
  @Roles("aluna")
  listMine(@CurrentUser() user: CurrentUserType) {
    return this.recordesService.listForAluna(user.alunaId!);
  }
}
