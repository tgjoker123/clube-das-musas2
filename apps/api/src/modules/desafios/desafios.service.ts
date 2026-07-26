import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { CreateDesafioDto } from "./dto/create-desafio.dto";

@Injectable()
export class DesafiosService {
  constructor(private readonly prisma: PrismaService) {}

  create(professorId: string, dto: CreateDesafioDto) {
    return this.prisma.desafio.create({
      data: {
        professorId,
        titulo: dto.titulo,
        dataInicio: new Date(dto.dataInicio),
        dataFim: new Date(dto.dataFim),
      },
    });
  }

  list(professorId: string) {
    return this.prisma.desafio.findMany({
      where: { professorId },
      orderBy: { dataInicio: "desc" },
    });
  }

  private async montarRanking(desafio: { id: string; professorId: string; dataInicio: Date; dataFim: Date }) {
    const alunas = await this.prisma.aluna.findMany({
      where: { professorId: desafio.professorId, status: "ativa" },
      select: { id: true, nome: true },
    });

    const contagens = await this.prisma.checkIn.groupBy({
      by: ["alunaId"],
      where: {
        status: "concluido",
        data: { gte: desafio.dataInicio, lte: desafio.dataFim },
        aluna: { professorId: desafio.professorId, status: "ativa" },
      },
      _count: { _all: true },
    });

    const pontosPorAluna = new Map(contagens.map((c) => [c.alunaId, c._count._all]));

    return alunas
      .map((a) => ({ alunaId: a.id, nome: a.nome, pontos: pontosPorAluna.get(a.id) ?? 0 }))
      .sort((a, b) => b.pontos - a.pontos);
  }

  async getRanking(professorId: string, desafioId: string) {
    const desafio = await this.prisma.desafio.findUnique({ where: { id: desafioId } });
    if (!desafio) throw new NotFoundException("Desafio não encontrado");
    if (desafio.professorId !== professorId) {
      throw new ForbiddenException("Desafio não pertence a este professor");
    }
    const ranking = await this.montarRanking(desafio);
    return { desafio, ranking };
  }

  async getAtualParaAluna(alunaId: string) {
    const aluna = await this.prisma.aluna.findUniqueOrThrow({ where: { id: alunaId } });
    const hoje = new Date();

    const desafio = await this.prisma.desafio.findFirst({
      where: { professorId: aluna.professorId, dataInicio: { lte: hoje }, dataFim: { gte: hoje } },
      orderBy: { dataInicio: "desc" },
    });

    if (!desafio) return null;

    const ranking = await this.montarRanking(desafio);
    const suaPosicao = ranking.findIndex((r) => r.alunaId === alunaId) + 1;
    return { desafio, ranking, suaPosicao: suaPosicao || null };
  }
}
