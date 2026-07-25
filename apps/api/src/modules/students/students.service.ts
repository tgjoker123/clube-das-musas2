import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PrismaService } from "../../core/database/prisma.service";
import { SUPABASE_ADMIN_CLIENT } from "../../core/supabase/supabase.module";
import type { AuthUser } from "../../core/auth/supabase-token.guard";
import type { CreateStudentDto } from "./dto/create-student.dto";
import type { UpdateStudentDto } from "./dto/update-student.dto";
import type { CreateAnamneseDto } from "./dto/create-anamnese.dto";
import type { CreateExameDto } from "./dto/create-exame.dto";
import type { CreateEvolucaoDto } from "./dto/create-evolucao.dto";

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SUPABASE_ADMIN_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  private async findOwnedOrThrow(professorId: string, alunaId: string) {
    const aluna = await this.prisma.aluna.findUnique({ where: { id: alunaId } });
    if (!aluna) throw new NotFoundException("Aluna não encontrada");
    if (aluna.professorId !== professorId) {
      throw new ForbiddenException("Aluna não pertence a este professor");
    }
    return aluna;
  }

  create(professorId: string, dto: CreateStudentDto) {
    return this.prisma.aluna.create({
      data: {
        professorId,
        nome: dto.nome,
        email: dto.email,
        dataNascimento: new Date(dto.dataNascimento),
        observacoes: dto.observacoes,
      },
    });
  }

  list(professorId: string, status?: string) {
    return this.prisma.aluna.findMany({
      where: { professorId, ...(status ? { status: status as never } : {}) },
      orderBy: { nome: "asc" },
    });
  }

  async getById(professorId: string, alunaId: string) {
    await this.findOwnedOrThrow(professorId, alunaId);
    return this.prisma.aluna.findUnique({
      where: { id: alunaId },
      include: { anamneses: true, exames: true, evolucoes: true },
    });
  }

  getOwnProfile(alunaId: string) {
    return this.prisma.aluna.findUnique({
      where: { id: alunaId },
      include: {
        anamneses: { orderBy: { data: "desc" } },
        exames: { orderBy: { dataExame: "desc" } },
        evolucoes: { orderBy: { data: "desc" } },
      },
    });
  }

  async update(professorId: string, alunaId: string, dto: UpdateStudentDto) {
    await this.findOwnedOrThrow(professorId, alunaId);
    return this.prisma.aluna.update({
      where: { id: alunaId },
      data: {
        ...(dto.nome !== undefined ? { nome: dto.nome } : {}),
        ...(dto.dataNascimento !== undefined
          ? { dataNascimento: new Date(dto.dataNascimento) }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.observacoes !== undefined ? { observacoes: dto.observacoes } : {}),
      },
    });
  }

  async remove(professorId: string, alunaId: string) {
    const aluna = await this.findOwnedOrThrow(professorId, alunaId);
    await this.prisma.aluna.delete({ where: { id: alunaId } });

    if (aluna.authUserId) {
      await this.supabase.auth.admin.deleteUser(aluna.authUserId).catch(() => undefined);
    }

    return { ok: true };
  }

  async addAnamnese(professorId: string, alunaId: string, dto: CreateAnamneseDto) {
    await this.findOwnedOrThrow(professorId, alunaId);
    return this.prisma.anamnese.create({
      data: { alunaId, respostasJson: dto.respostas as never },
    });
  }

  async addExame(professorId: string, alunaId: string, dto: CreateExameDto) {
    await this.findOwnedOrThrow(professorId, alunaId);
    return this.prisma.exameSangue.create({
      data: { alunaId, arquivoUrl: dto.arquivoUrl, dataExame: new Date(dto.dataExame) },
    });
  }

  async addEvolucao(professorId: string, alunaId: string, dto: CreateEvolucaoDto) {
    await this.findOwnedOrThrow(professorId, alunaId);
    return this.prisma.evolucaoFisica.create({
      data: {
        alunaId,
        fotoUrl: dto.fotoUrl,
        peso: dto.peso,
        medidasJson: dto.medidas as never,
      },
    });
  }

  async invite(professorId: string, alunaId: string, webUrl: string) {
    const aluna = await this.findOwnedOrThrow(professorId, alunaId);
    if (aluna.authUserId) {
      throw new BadRequestException("Aluna já ativou o acesso");
    }

    const { error } = await this.supabase.auth.admin.inviteUserByEmail(aluna.email, {
      redirectTo: `${webUrl}/ativar-conta?alunaId=${aluna.id}`,
    });
    if (error) {
      throw new BadRequestException(`Falha ao enviar convite: ${error.message}`);
    }

    return { ok: true };
  }

  async activate(alunaId: string, authUser: AuthUser) {
    const aluna = await this.prisma.aluna.findUnique({ where: { id: alunaId } });
    if (!aluna) throw new NotFoundException("Aluna não encontrada");
    if (aluna.authUserId) {
      throw new BadRequestException("Conta já ativada");
    }
    if (aluna.email.toLowerCase() !== authUser.email.toLowerCase()) {
      throw new ForbiddenException("E-mail do convite não corresponde ao usuário autenticado");
    }

    return this.prisma.aluna.update({
      where: { id: alunaId },
      data: { authUserId: authUser.authUserId },
    });
  }
}
