import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../core/auth/supabase-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { Roles } from "../../core/auth/roles.decorator";
import { CurrentUser } from "../../core/auth/current-user.decorator";
import type { CurrentUser as CurrentUserType } from "../../core/auth/current-user";
import { ExercisesService } from "./exercises.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { UpdateExerciseDto } from "./dto/update-exercise.dto";

@Controller("exercises")
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles("professor")
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateExerciseDto) {
    return this.exercisesService.create(user.professorId!, dto);
  }

  @Get()
  list(@CurrentUser() user: CurrentUserType) {
    return this.exercisesService.list(user.professorId!);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: CurrentUserType,
    @Param("id") id: string,
    @Body() dto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(user.professorId!, id, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: CurrentUserType, @Param("id") id: string) {
    return this.exercisesService.remove(user.professorId!, id);
  }
}
