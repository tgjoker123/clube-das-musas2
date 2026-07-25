import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

  private async findOwnedOrThrow(professorId: string, id: string) {
    const exercicio = await this.prisma.exercicio.findUnique({ where: { id } });
    if (!exercicio) throw new NotFoundException("Exercício não encontrado");
    if (exercicio.professorId !== professorId) {
      throw new ForbiddenException("Exercício não pertence a este professor");
    }
    return exercicio;
  }

  async update(professorId: string, id: string, dto: UpdateExerciseDto) {
    await this.findOwnedOrThrow(professorId, id);
    return this.prisma.exercicio.update({ where: { id }, data: dto });
  }

  async remove(professorId: string, id: string) {
    await this.findOwnedOrThrow(professorId, id);

    const checkInsCount = await this.prisma.checkIn.count({ where: { exercicioId: id } });
    if (checkInsCount > 0) {
      throw new BadRequestException(
        "Este exercício já tem check-ins registrados por alunas e não pode ser excluído. Você pode editá-lo ou removê-lo das fichas de treino.",
      );
    }

    await this.prisma.exercicio.delete({ where: { id } });
    return { ok: true };
  }
}
