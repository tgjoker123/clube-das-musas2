import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { CreateAvaliacaoDto } from "./dto/create-avaliacao.dto";

function inicioDoDia(data: Date): Date {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fimDoDia(data: Date): Date {
  const d = new Date(data);
  d.setHours(23, 59, 59, 999);
  return d;
}

@Injectable()
export class AvaliacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateHoje(alunaId: string, dto: CreateAvaliacaoDto) {
    const hoje = new Date();
    const existente = await this.prisma.avaliacaoTreino.findFirst({
      where: { alunaId, data: { gte: inicioDoDia(hoje), lte: fimDoDia(hoje) } },
    });

    if (existente) {
      return this.prisma.avaliacaoTreino.update({
        where: { id: existente.id },
        data: { nota: dto.nota },
      });
    }

    return this.prisma.avaliacaoTreino.create({
      data: { alunaId, nota: dto.nota },
    });
  }

  listForAluna(alunaId: string) {
    return this.prisma.avaliacaoTreino.findMany({
      where: { alunaId },
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
