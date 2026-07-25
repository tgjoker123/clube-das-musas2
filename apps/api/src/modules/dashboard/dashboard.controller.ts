import { Controller, Get, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles("professor")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getIndicadores(@CurrentUser() user: CurrentUserType) {
    return this.dashboardService.getIndicadores(user.professorId!);
  }
}
