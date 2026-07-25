import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { CompleteCheckInDto } from "./dto/complete-checkin.dto";

@Injectable()
export class CheckinsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Regra de negócio (spec §10): check-in só pode virar "concluido" com
   * foto_url preenchida — validado aqui no backend, não só no front.
   */
  async complete(alunaId: string, dto: CompleteCheckInDto) {
    if (!dto.fotoUrl || dto.fotoUrl.trim().length === 0) {
      throw new BadRequestException("Foto é obrigatória para concluir o exercício");
    }

    return this.prisma.checkIn.create({
      data: {
        alunaId,
        exercicioId: dto.exercicioId,
        fotoUrl: dto.fotoUrl,
        status: "concluido",
      },
    });
  }

  listForAluna(alunaId: string) {
    return this.prisma.checkIn.findMany({
      where: { alunaId },
      include: { exercicio: true },
      orderBy: { data: "desc" },
    });
  }

  async listForAlunaAsProfessor(professorId: string, alunaId: string) {
    const aluna = await this.prisma.aluna.findUnique({ where: { id: alunaId } });
    if (!aluna || aluna.professorId !== professorId) {
      throw new ForbiddenException("Aluna não pertence a este professor");
    }
    return this.listForAluna(alunaId);
  }
}
