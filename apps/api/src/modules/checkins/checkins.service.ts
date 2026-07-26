import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { CompleteCheckInDto } from "./dto/complete-checkin.dto";
import type { CreateComentarioDto } from "./dto/create-comentario.dto";

@Injectable()
export class CheckinsService {
  constructor(private readonly prisma: PrismaService) {}

  async complete(alunaId: string, dto: CompleteCheckInDto) {
    let novoRecorde = false;

    if (dto.cargaUsada != null) {
      const melhorAtual = await this.prisma.recordePessoal.findFirst({
        where: { alunaId, exercicioId: dto.exercicioId },
        orderBy: [{ carga: "desc" }, { reps: "desc" }],
      });

      const reps = dto.repsUsadas ?? 0;
      novoRecorde =
        !melhorAtual ||
        dto.cargaUsada > Number(melhorAtual.carga) ||
        (dto.cargaUsada === Number(melhorAtual.carga) && reps > melhorAtual.reps);

      if (novoRecorde) {
        await this.prisma.recordePessoal.create({
          data: { alunaId, exercicioId: dto.exercicioId, carga: dto.cargaUsada, reps },
        });
      }
    }

    const checkIn = await this.prisma.checkIn.create({
      data: {
        alunaId,
        exercicioId: dto.exercicioId,
        fotoUrl: dto.fotoUrl,
        descricao: dto.descricao,
        cargaUsada: dto.cargaUsada,
        repsUsadas: dto.repsUsadas,
        status: "concluido",
      },
    });

    return { checkIn, novoRecorde };
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

  async getFeed(alunaId: string) {
    const aluna = await this.prisma.aluna.findUniqueOrThrow({ where: { id: alunaId } });

    const checkIns = await this.prisma.checkIn.findMany({
      where: { status: "concluido", aluna: { professorId: aluna.professorId, status: "ativa" } },
      include: {
        exercicio: true,
        aluna: { select: { id: true, nome: true } },
        curtidas: true,
        comentarios: {
          orderBy: { createdAt: "asc" },
          include: { aluna: { select: { id: true, nome: true } } },
        },
      },
      orderBy: { data: "desc" },
      take: 30,
    });

    return checkIns.map((c) => ({
      id: c.id,
      data: c.data,
      descricao: c.descricao,
      fotoUrl: c.fotoUrl,
      cargaUsada: c.cargaUsada,
      repsUsadas: c.repsUsadas,
      exercicio: { nome: c.exercicio.nome, grupoMuscular: c.exercicio.grupoMuscular },
      aluna: c.aluna,
      totalCurtidas: c.curtidas.length,
      curtidoPorMim: c.curtidas.some((l) => l.alunaId === alunaId),
      comentarios: c.comentarios.map((cm) => ({
        id: cm.id,
        texto: cm.texto,
        createdAt: cm.createdAt,
        aluna: cm.aluna,
      })),
    }));
  }

  private async garantirAcessoAoCheckIn(alunaId: string, checkInId: string) {
    const aluna = await this.prisma.aluna.findUniqueOrThrow({ where: { id: alunaId } });
    const checkIn = await this.prisma.checkIn.findUnique({
      where: { id: checkInId },
      include: { aluna: { select: { professorId: true } } },
    });
    if (!checkIn) throw new NotFoundException("Check-in não encontrado");
    if (checkIn.aluna.professorId !== aluna.professorId) {
      throw new ForbiddenException("Check-in não pertence ao seu grupo");
    }
    return checkIn;
  }

  async toggleCurtida(alunaId: string, checkInId: string) {
    await this.garantirAcessoAoCheckIn(alunaId, checkInId);

    const existente = await this.prisma.checkInCurtida.findUnique({
      where: { checkInId_alunaId: { checkInId, alunaId } },
    });

    if (existente) {
      await this.prisma.checkInCurtida.delete({ where: { id: existente.id } });
      return { curtido: false };
    }

    await this.prisma.checkInCurtida.create({ data: { checkInId, alunaId } });
    return { curtido: true };
  }

  async comentar(alunaId: string, checkInId: string, dto: CreateComentarioDto) {
    await this.garantirAcessoAoCheckIn(alunaId, checkInId);
    return this.prisma.checkInComentario.create({
      data: { checkInId, alunaId, texto: dto.texto },
      include: { aluna: { select: { id: true, nome: true } } },
    });
  }
}
