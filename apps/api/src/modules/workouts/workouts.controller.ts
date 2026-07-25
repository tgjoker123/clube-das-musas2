import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { WorkoutsService } from "./workouts.service";
import { CreateFichaDto } from "./dto/create-ficha.dto";
import { AddItemDto } from "./dto/add-item.dto";
import { AssociateAlunaDto } from "./dto/associate-aluna.dto";

@Controller("workouts")
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @Roles("professor")
  create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateFichaDto) {
    return this.workoutsService.create(user.professorId!, dto);
  }

  @Get()
  @Roles("professor")
  list(@CurrentUser() user: CurrentUserType) {
    return this.workoutsService.list(user.professorId!);
  }

  @Get("aluna/me")
  @Roles("aluna")
  getMinhasFichas(@CurrentUser() user: CurrentUserType) {
    return this.workoutsService.getFichasDaAluna(user.alunaId!);
  }

  @Get(":id")
  @Roles("professor")
  getById(@CurrentUser() user: CurrentUserType, @Param("id") id: string) {
    return this.workoutsService.getById(user.professorId!, id);
  }

  @Post(":id/itens")
  @Roles("professor")
  addItem(
    @CurrentUser() user: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: AddItemDto,
  ) {
    return this.workoutsService.addItem(user.professorId!, id, dto);
  }

  @Delete(":id/itens/:itemId")
  @Roles("professor")
  removeItem(
    @CurrentUser() user: CurrentUserType,
    @Param("id") id: string,
    @Param("itemId") itemId: string,
  ) {
    return this.workoutsService.removeItem(user.professorId!, id, itemId);
  }

  @Post(":id/associar")
  @Roles("professor")
  associateAluna(
    @CurrentUser() user: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: AssociateAlunaDto,
  ) {
    return this.workoutsService.associateAluna(user.professorId!, id, dto);
  }
}
