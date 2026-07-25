import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { CreateExerciseDto } from "./dto/create-exercise.dto";
import type { UpdateExerciseDto } from "./dto/update-exercise.dto";

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  create(professorId: string, dto: CreateExerciseDto) {
    return this.prisma.exercicio.create({ data: { professorId, ...dto } });
  }

  list(professorId: string) {
    return this.prisma.exercicio.findMany({
      where: { professorId },
      orderBy: { nome: "asc" },
    });
  }

  async update(professorId: string, id: string, dto: UpdateExerciseDto) {
    const exercicio = await this.prisma.exercicio.findUnique({ where: { id } });
    if (!exercicio) throw new NotFoundException("Exercício não encontrado");
    if (exercicio.professorId !== professorId) {
      throw new ForbiddenException("Exercício não pertence a este professor");
    }
    return this.prisma.exercicio.update({ where: { id }, data: dto });
  }
}
