import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { CreateFichaDto } from "./dto/create-ficha.dto";
import type { AddItemDto } from "./dto/add-item.dto";
import type { AssociateAlunaDto } from "./dto/associate-aluna.dto";

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOwnedFichaOrThrow(professorId: string, fichaId: string) {
    const ficha = await this.prisma.fichaTreino.findUnique({ where: { id: fichaId } });
    if (!ficha) throw new NotFoundException("Ficha de treino não encontrada");
    if (ficha.professorId !== professorId) {
      throw new ForbiddenException("Ficha não pertence a este professor");
    }
    return ficha;
  }

  create(professorId: string, dto: CreateFichaDto) {
    return this.prisma.fichaTreino.create({ data: { professorId, ...dto } });
  }

  list(professorId: string) {
    return this.prisma.fichaTreino.findMany({
      where: { professorId },
      include: { itens: { include: { exercicio: true } } },
      orderBy: { nomeTemplate: "asc" },
    });
  }

  async getById(professorId: string, fichaId: string) {
    await this.findOwnedFichaOrThrow(professorId, fichaId);
    return this.prisma.fichaTreino.findUnique({
      where: { id: fichaId },
      include: { itens: { include: { exercicio: true } }, alunas: { include: { aluna: true } } },
    });
  }

  async addItem(professorId: string, fichaId: string, dto: AddItemDto) {
    await this.findOwnedFichaOrThrow(professorId, fichaId);
    return this.prisma.fichaTreinoItem.create({ data: { fichaId, ...dto } });
  }

  async removeItem(professorId: string, fichaId: string, itemId: string) {
    await this.findOwnedFichaOrThrow(professorId, fichaId);
    await this.prisma.fichaTreinoItem.delete({ where: { id: itemId } });
    return { ok: true };
  }

  async associateAluna(professorId: string, fichaId: string, dto: AssociateAlunaDto) {
    await this.findOwnedFichaOrThrow(professorId, fichaId);
    const aluna = await this.prisma.aluna.findUnique({ where: { id: dto.alunaId } });
    if (!aluna || aluna.professorId !== professorId) {
      throw new ForbiddenException("Aluna não pertence a este professor");
    }
    return this.prisma.fichaAluna.create({
      data: { fichaTreinoId: fichaId, alunaId: dto.alunaId },
    });
  }

  async getFichasDaAluna(alunaId: string) {
    const associacoes = await this.prisma.fichaAluna.findMany({
      where: { alunaId },
      include: { fichaTreino: { include: { itens: { include: { exercicio: true } } } } },
      orderBy: { dataAssociacao: "desc" },
    });
    return associacoes.map((a) => a.fichaTreino);
  }
}
