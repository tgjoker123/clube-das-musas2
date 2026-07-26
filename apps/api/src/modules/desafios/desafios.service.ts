import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { CreateDesafioDto } from "./dto/create-desafio.dto";

type DesafioBase = { id: string; professorId: string; dataInicio: Date; dataFim: Date; metrica: string };

const UNIDADE_POR_METRICA: Record<string, string> = {
  treinos: "treinos",
  streak: "dias treinados",
  avaliacao: "nota média",
};

@Injectable()
export class DesafiosService {
  constructor(private readonly prisma: PrismaService) {}

  create(professorId: string, dto: CreateDesafioDto) {
    return this.prisma.desafio.create({
      data: {
        professorId,
        titulo: dto.titulo,
        metrica: dto.metrica ?? "treinos",
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

  private async montarRankingPorTreinos(desafio: DesafioBase, alunas: { id: string; nome: string }[]) {
    const contagens = await this.prisma.checkIn.groupBy({
      by: ["alunaId"],
      where: {
        status: "concluido",
        data: { gte: desafio.dataInicio, lte: desafio.dataFim },
        aluna: { professorId: desafio.professorId, status: "ativa" },
      },
      _count: { _all: true },
    });
    const mapa = new Map(contagens.map((c) => [c.alunaId, c._count._all]));
    return alunas.map((a) => ({ alunaId: a.id, nome: a.nome, pontos: mapa.get(a.id) ?? 0 }));
  }

  private async montarRankingPorDiasTreinados(desafio: DesafioBase, alunas: { id: string; nome: string }[]) {
    const checkIns = await this.prisma.checkIn.findMany({
      where: {
        status: "concluido",
        data: { gte: desafio.dataInicio, lte: desafio.dataFim },
        aluna: { professorId: desafio.professorId, status: "ativa" },
      },
      select: { alunaId: true, data: true },
    });

    const diasPorAluna = new Map<string, Set<string>>();
    for (const c of checkIns) {
      const dia = c.data.toDateString();
      const set = diasPorAluna.get(c.alunaId) ?? new Set<string>();
      set.add(dia);
      diasPorAluna.set(c.alunaId, set);
    }

    return alunas.map((a) => ({ alunaId: a.id, nome: a.nome, pontos: diasPorAluna.get(a.id)?.size ?? 0 }));
  }

  private async montarRankingPorAvaliacao(desafio: DesafioBase, alunas: { id: string; nome: string }[]) {
    const medias = await this.prisma.avaliacaoTreino.groupBy({
      by: ["alunaId"],
      where: {
        data: { gte: desafio.dataInicio, lte: desafio.dataFim },
        aluna: { professorId: desafio.professorId, status: "ativa" },
      },
      _avg: { nota: true },
    });
    const mapa = new Map(medias.map((m) => [m.alunaId, Math.round((m._avg.nota ?? 0) * 10) / 10]));
    return alunas.map((a) => ({ alunaId: a.id, nome: a.nome, pontos: mapa.get(a.id) ?? 0 }));
  }

  private async montarRanking(desafio: DesafioBase) {
    const alunas = await this.prisma.aluna.findMany({
      where: { professorId: desafio.professorId, status: "ativa" },
      select: { id: true, nome: true },
    });

    let ranking: { alunaId: string; nome: string; pontos: number }[];
    if (desafio.metrica === "streak") {
      ranking = await this.montarRankingPorDiasTreinados(desafio, alunas);
    } else if (desafio.metrica === "avaliacao") {
      ranking = await this.montarRankingPorAvaliacao(desafio, alunas);
    } else {
      ranking = await this.montarRankingPorTreinos(desafio, alunas);
    }

    return ranking.sort((a, b) => b.pontos - a.pontos);
  }

  async getRanking(professorId: string, desafioId: string) {
    const desafio = await this.prisma.desafio.findUnique({ where: { id: desafioId } });
    if (!desafio) throw new NotFoundException("Desafio não encontrado");
    if (desafio.professorId !== professorId) {
      throw new ForbiddenException("Desafio não pertence a este professor");
    }
    const ranking = await this.montarRanking(desafio);
    return { desafio, ranking, unidade: UNIDADE_POR_METRICA[desafio.metrica] ?? "pontos" };
  }

  async getAtivosParaAluna(alunaId: string) {
    const aluna = await this.prisma.aluna.findUniqueOrThrow({ where: { id: alunaId } });
    const hoje = new Date();

    const desafios = await this.prisma.desafio.findMany({
      where: { professorId: aluna.professorId, dataInicio: { lte: hoje }, dataFim: { gte: hoje } },
      orderBy: { dataInicio: "desc" },
    });

    return Promise.all(
      desafios.map(async (desafio) => {
        const ranking = await this.montarRanking(desafio);
        const suaPosicao = ranking.findIndex((r) => r.alunaId === alunaId) + 1;
        return {
          desafio,
          ranking,
          suaPosicao: suaPosicao || null,
          unidade: UNIDADE_POR_METRICA[desafio.metrica] ?? "pontos",
        };
      }),
    );
  }
}
