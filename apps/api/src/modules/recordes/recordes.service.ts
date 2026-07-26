import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";

@Injectable()
export class RecordesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForAluna(alunaId: string) {
    const recordes = await this.prisma.recordePessoal.findMany({
      where: { alunaId },
      include: { exercicio: { select: { id: true, nome: true, grupoMuscular: true } } },
      orderBy: { data: "asc" },
    });

    const porExercicio = new Map<
      string,
      { exercicio: { id: string; nome: string; grupoMuscular: string }; historico: typeof recordes }
    >();

    for (const r of recordes) {
      const atual = porExercicio.get(r.exercicioId);
      if (atual) {
        atual.historico.push(r);
      } else {
        porExercicio.set(r.exercicioId, { exercicio: r.exercicio, historico: [r] });
      }
    }

    return Array.from(porExercicio.values())
      .map(({ exercicio, historico }) => {
        const melhor = historico[historico.length - 1]!;
        return {
          exercicio,
          atual: { carga: melhor.carga, reps: melhor.reps, data: melhor.data },
          historico: historico.map((h) => ({ carga: h.carga, reps: h.reps, data: h.data })),
        };
      })
      .sort((a, b) => a.exercicio.nome.localeCompare(b.exercicio.nome));
  }
}
