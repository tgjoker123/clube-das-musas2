import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { AdminGuard } from "../../core/auth/admin.guard";
import { AdminService } from "./admin.service";
import { CreateProfessorDto } from "./dto/create-professor.dto";
import { UpdateProfessorAdminDto } from "./dto/update-professor-admin.dto";
import { CreateParceiroDto } from "./dto/create-parceiro.dto";
import { UpdateParceiroDto } from "./dto/update-parceiro.dto";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { CreatePlanoDto } from "./dto/create-plano.dto";
import { UpdatePlanoDto } from "./dto/update-plano.dto";
import { UpdateConfiguracaoDto } from "./dto/update-configuracao.dto";

const WEB_URL = process.env["WEB_URL"] ?? "http://localhost:3000";

@Controller("admin")
@UseGuards(SupabaseAuthGuard, RolesGuard, AdminGuard)
@Roles("professor")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("professors")
  listProfessors() {
    return this.adminService.listProfessors();
  }

  @Get("professors/:id")
  getProfessorDetail(@Param("id") id: string) {
    return this.adminService.getProfessorDetail(id);
  }

  @Post("professors")
  createProfessor(@Body() dto: CreateProfessorDto) {
    return this.adminService.createProfessor(dto, WEB_URL);
  }

  @Patch("professors/:id")
  updateProfessor(@Param("id") id: string, @Body() dto: UpdateProfessorAdminDto) {
    return this.adminService.updateProfessor(id, dto);
  }

  @Get("professors/:id/whatsapp-invite-link")
  getProfessorWhatsappInviteLink(@Param("id") id: string) {
    return this.adminService.getWhatsappInviteLink(id, WEB_URL);
  }

  @Get("parceiros")
  listParceiros() {
    return this.adminService.listParceiros();
  }

  @Post("parceiros")
  createParceiro(@Body() dto: CreateParceiroDto) {
    return this.adminService.createParceiro(dto);
  }

  @Patch("parceiros/:id")
  updateParceiro(@Param("id") id: string, @Body() dto: UpdateParceiroDto) {
    return this.adminService.updateParceiro(id, dto);
  }

  @Delete("parceiros/:id")
  removeParceiro(@Param("id") id: string) {
    return this.adminService.removeParceiro(id);
  }

  @Get("marketplace/itens")
  listItens() {
    return this.adminService.listItens();
  }

  @Post("marketplace/itens")
  createItem(@Body() dto: CreateItemDto) {
    return this.adminService.createItem(dto);
  }

  @Patch("marketplace/itens/:id")
  updateItem(@Param("id") id: string, @Body() dto: UpdateItemDto) {
    return this.adminService.updateItem(id, dto);
  }

  @Delete("marketplace/itens/:id")
  removeItem(@Param("id") id: string) {
    return this.adminService.removeItem(id);
  }

  @Get("planos")
  listPlanos() {
    return this.adminService.listPlanos();
  }

  @Post("planos")
  createPlano(@Body() dto: CreatePlanoDto) {
    return this.adminService.createPlano(dto);
  }

  @Patch("planos/:id")
  updatePlano(@Param("id") id: string, @Body() dto: UpdatePlanoDto) {
    return this.adminService.updatePlano(id, dto);
  }

  @Delete("planos/:id")
  removePlano(@Param("id") id: string) {
    return this.adminService.removePlano(id);
  }

  @Get("configuracao")
  getConfiguracao() {
    return this.adminService.getConfiguracao();
  }

  @Patch("configuracao")
  updateConfiguracao(@Body() dto: UpdateConfiguracaoDto) {
    return this.adminService.updateConfiguracao(dto);
  }

  @Get("faturamento")
  getFaturamentoGeral() {
    return this.adminService.getFaturamentoGeral();
  }
}
