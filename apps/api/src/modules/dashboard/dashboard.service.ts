import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";

function diasAteProximoAniversario(dataNascimento: Date, hoje: Date): number {
  const proximo = new Date(hoje.getFullYear(), dataNascimento.getMonth(), dataNascimento.getDate());
  if (proximo < hoje) {
    proximo.setFullYear(hoje.getFullYear() + 1);
  }
  const umDiaEmMs = 1000 * 60 * 60 * 24;
  return Math.round((proximo.getTime() - hoje.getTime()) / umDiaEmMs);
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getIndicadores(professorId: string) {
    const [alunas, professor] = await Promise.all([
      this.prisma.aluna.findMany({
        where: { professorId },
        include: { checkIns: { orderBy: { data: "desc" }, take: 1 } },
      }),
      this.prisma.professor.findUnique({ where: { id: professorId } }),
    ]);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const ativas = alunas.filter((a) => a.status === "ativa");

    const aniversariantes = ativas
      .map((a) => ({ aluna: a, dias: diasAteProximoAniversario(a.dataNascimento, hoje) }))
      .filter(({ dias }) => dias <= 30)
      .sort((a, b) => a.dias - b.dias);

    const aniversariantesDoMes = ativas
      .filter((a) => a.dataNascimento.getMonth() === hoje.getMonth())
      .sort((a, b) => a.dataNascimento.getDate() - b.dataNascimento.getDate());

    const aniversariantesPorMes = Array.from({ length: 12 }, (_, mes) =>
      ativas.filter((a) => a.dataNascimento.getMonth() === mes).length,
    );

    const seteDiasEmMs = 7 * 24 * 60 * 60 * 1000;
    const semTreinoHa7Dias = ativas.filter((a) => {
      const ultimoCheckIn = a.checkIns[0];
      if (!ultimoCheckIn) return true;
      return hoje.getTime() - ultimoCheckIn.data.getTime() > seteDiasEmMs;
    });

    const valorMensalidade = professor?.valorMensalidade
      ? Number(professor.valorMensalidade)
      : null;

    return {
      totalAlunasAtivas: ativas.length,
      valorMensalidade,
      faturamentoEstimado: valorMensalidade !== null ? valorMensalidade * ativas.length : null,
      totalAlunasPorStatus: {
        ativa: alunas.filter((a) => a.status === "ativa").length,
        suspensa: alunas.filter((a) => a.status === "suspensa").length,
        inadimplente: alunas.filter((a) => a.status === "inadimplente").length,
      },
      aniversariantes: {
        em7Dias: aniversariantes.filter((a) => a.dias <= 7).map((a) => a.aluna),
        em15Dias: aniversariantes.filter((a) => a.dias <= 15).map((a) => a.aluna),
        em30Dias: aniversariantes.map((a) => a.aluna),
        doMes: aniversariantesDoMes,
        porMes: aniversariantesPorMes,
      },
      semTreinoHa7Dias,
    };
  }
}
