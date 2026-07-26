import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { CreateRecadoDto } from "./dto/create-recado.dto";

@Injectable()
export class RecadosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(professorId: string, dto: CreateRecadoDto) {
    if (dto.alunaId) {
      const aluna = await this.prisma.aluna.findUnique({ where: { id: dto.alunaId } });
      if (!aluna || aluna.professorId !== professorId) {
        throw new ForbiddenException("Aluna não pertence a este professor");
      }
    }

    return this.prisma.recado.create({
      data: {
        professorId,
        alunaId: dto.alunaId,
        titulo: dto.titulo,
        mensagem: dto.mensagem,
      },
    });
  }

  listForProfessor(professorId: string) {
    return this.prisma.recado.findMany({
      where: { professorId },
      include: { aluna: { select: { id: true, nome: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async listForAluna(alunaId: string) {
    const aluna = await this.prisma.aluna.findUniqueOrThrow({ where: { id: alunaId } });
    return this.prisma.recado.findMany({
      where: {
        professorId: aluna.professorId,
        OR: [{ alunaId: null }, { alunaId }],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}
