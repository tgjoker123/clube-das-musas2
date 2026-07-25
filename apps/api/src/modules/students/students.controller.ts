import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { SupabaseTokenGuard } from "../../core/auth/supabase-token.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { SupabaseUser } from "../../core/auth/auth-user.decorator";
import type { AuthUser } from "../../core/auth/supabase-token.guard";
import { StudentsService } from "./students.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { CreateAnamneseDto } from "./dto/create-anamnese.dto";
import { CreateExameDto } from "./dto/create-exame.dto";
import { CreateEvolucaoDto } from "./dto/create-evolucao.dto";

const WEB_URL = process.env["WEB_URL"] ?? "http://localhost:3000";

@Controller("students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(user.professorId!, dto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  list(@CurrentUser() user: CurrentUserType, @Query("status") status?: string) {
    return this.studentsService.list(user.professorId!, status);
  }

  @Get("me")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("aluna")
  getOwnProfile(@CurrentUser() user: CurrentUserType) {
    return this.studentsService.getOwnProfile(user.alunaId!);
  }

  @Get(":id")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  getById(@CurrentUser() user: CurrentUserType, @Param("id") id: string) {
    return this.studentsService.getById(user.professorId!, id);
  }

  @Patch(":id")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  update(
    @CurrentUser() user: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(user.professorId!, id, dto);
  }

  @Post(":id/anamnese")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  addAnamnese(
    @CurrentUser() user: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: CreateAnamneseDto,
  ) {
    return this.studentsService.addAnamnese(user.professorId!, id, dto);
  }

  @Post(":id/exames")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  addExame(
    @CurrentUser() user: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: CreateExameDto,
  ) {
    return this.studentsService.addExame(user.professorId!, id, dto);
  }

  @Post(":id/evolucao")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  addEvolucao(
    @CurrentUser() user: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: CreateEvolucaoDto,
  ) {
    return this.studentsService.addEvolucao(user.professorId!, id, dto);
  }

  @Post(":id/invite")
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles("professor")
  invite(@CurrentUser() user: CurrentUserType, @Param("id") id: string) {
    return this.studentsService.invite(user.professorId!, id, WEB_URL);
  }

  @Post(":id/activate")
  @UseGuards(SupabaseTokenGuard)
  activate(@Param("id") id: string, @SupabaseUser() authUser: AuthUser) {
    return this.studentsService.activate(id, authUser);
  }
}
