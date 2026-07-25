import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { AdminGuard } from "../../core/auth/admin.guard";
import { AdminService } from "./admin.service";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Controller("admin")
@UseGuards(SupabaseAuthGuard, RolesGuard, AdminGuard)
@Roles("professor")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("professors")
  listProfessors() {
    return this.adminService.listProfessors();
  }

  @Patch("professors/:id")
  setAdmin(@Param("id") id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.setAdmin(id, dto.isAdmin);
  }
}
