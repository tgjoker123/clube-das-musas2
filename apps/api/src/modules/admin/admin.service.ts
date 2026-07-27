import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PrismaService } from "../../core/database/prisma.service";
import { SUPABASE_ADMIN_CLIENT } from "../../core/supabase/supabase.module";
import { buildWhatsAppLink } from "../../core/utils/whatsapp";
import type { CreateProfessorDto } from "./dto/create-professor.dto";
import type { UpdateProfessorAdminDto } from "./dto/update-professor-admin.dto";
import type { CreateParceiroDto } from "./dto/create-parceiro.dto";
import type { UpdateParceiroDto } from "./dto/update-parceiro.dto";
import type { CreateItemDto } from "./dto/create-item.dto";
import type { UpdateItemDto } from "./dto/update-item.dto";
import type { CreatePlanoDto } from "./dto/create-plano.dto";
import type { UpdatePlanoDto } from "./dto/update-plano.dto";
import type { UpdateConfiguracaoDto } from "./dto/update-configuracao.dto";

const CONFIG_ID = "default";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SUPABASE_ADMIN_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  listProfessors() {
    return this.prisma.professor.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        status: true,
        isAdmin: true,
        authUserId: true,
        percentualComissao: true,
        valorMensalidade: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getProfessorDetail(id: string) {
    const professor = await this.prisma.professor.findUnique({
      where: { id },
      include: {
        alunas: { select: { id: true, nome: true, status: true } },
        fichas: { select: { id: true, nomeTemplate: true } },
      },
    });
    if (!professor) throw new NotFoundException("Professor não encontrado");
    return professor;
  }

  async createProfessor(dto: CreateProfessorDto, webUrl: string) {
    const existente = await this.prisma.professor.findUnique({ where: { email: dto.email } });
    if (existente) {
      throw new BadRequestException("Já existe um professor com este e-mail");
    }

    const professor = await this.prisma.professor.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        telefone: dto.telefone,
        percentualComissao: dto.percentualComissao,
      },
    });

    const { error } = await this.supabase.auth.admin.inviteUserByEmail(dto.email, {
      redirectTo: `${webUrl}/ativar-conta?tipo=professor&professorId=${professor.id}`,
    });
    if (error) {
      throw new BadRequestException(`Professor criado, mas falha ao enviar convite: ${error.message}`);
    }

    return professor;
  }

  async getWhatsappInviteLink(id: string, webUrl: string) {
    const professor = await this.prisma.professor.findUnique({ where: { id } });
    if (!professor) throw new NotFoundException("Professor não encontrado");
    if (professor.authUserId) {
      throw new BadRequestException("Professor já ativou o acesso");
    }
    if (!professor.telefone) {
      throw new BadRequestException(
        "Cadastre o telefone do professor para enviar convite por WhatsApp",
      );
    }

    const { data, error } = await this.supabase.auth.admin.generateLink({
      type: "invite",
      email: professor.email,
      options: { redirectTo: `${webUrl}/ativar-conta?tipo=professor&professorId=${professor.id}` },
    });
    if (error || !data) {
      throw new BadRequestException(`Falha ao gerar link de convite: ${error?.message}`);
    }

    const mensagem = `Oi, ${professor.nome}! Você foi cadastrado(a) no Clube das Musas. Segue seu link para ativar sua conta: ${data.properties.action_link}`;
    return { link: buildWhatsAppLink(professor.telefone, mensagem) };
  }

  async updateProfessor(id: string, dto: UpdateProfessorAdminDto) {
    const professor = await this.prisma.professor.findUnique({ where: { id } });
    if (!professor) throw new NotFoundException("Professor não encontrado");
    return this.prisma.professor.update({
      where: { id },
      data: {
        ...(dto.isAdmin !== undefined ? { isAdmin: dto.isAdmin } : {}),
        ...(dto.percentualComissao !== undefined
          ? { percentualComissao: dto.percentualComissao }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.telefone !== undefined ? { telefone: dto.telefone } : {}),
      },
    });
  }

  async setAdmin(id: string, isAdmin: boolean) {
    return this.updateProfessor(id, { isAdmin });
  }

  // Parceiros

  listParceiros() {
    return this.prisma.parceiro.findMany({
      include: { itens: true },
      orderBy: { createdAt: "desc" },
    });
  }

  createParceiro(dto: CreateParceiroDto) {
    return this.prisma.parceiro.create({ data: dto });
  }

  async updateParceiro(id: string, dto: UpdateParceiroDto) {
    const parceiro = await this.prisma.parceiro.findUnique({ where: { id } });
    if (!parceiro) throw new NotFoundException("Parceiro não encontrado");
    return this.prisma.parceiro.update({ where: { id }, data: dto });
  }

  async removeParceiro(id: string) {
    const parceiro = await this.prisma.parceiro.findUnique({ where: { id } });
    if (!parceiro) throw new NotFoundException("Parceiro não encontrado");
    await this.prisma.parceiro.delete({ where: { id } });
    return { ok: true };
  }

  // Marketplace (itens)

  listItens() {
    return this.prisma.itemMarketplace.findMany({
      include: { parceiro: { select: { id: true, nome: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  createItem(dto: CreateItemDto) {
    return this.prisma.itemMarketplace.create({ data: dto });
  }

  async updateItem(id: string, dto: UpdateItemDto) {
    const item = await this.prisma.itemMarketplace.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Item não encontrado");
    return this.prisma.itemMarketplace.update({ where: { id }, data: dto });
  }

  async removeItem(id: string) {
    const item = await this.prisma.itemMarketplace.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Item não encontrado");
    await this.prisma.itemMarketplace.delete({ where: { id } });
    return { ok: true };
  }

  // Planos de assinatura

  listPlanos() {
    return this.prisma.planoAssinatura.findMany({ orderBy: { createdAt: "desc" } });
  }

  createPlano(dto: CreatePlanoDto) {
    return this.prisma.planoAssinatura.create({ data: dto });
  }

  async updatePlano(id: string, dto: UpdatePlanoDto) {
    const plano = await this.prisma.planoAssinatura.findUnique({ where: { id } });
    if (!plano) throw new NotFoundException("Plano não encontrado");
    return this.prisma.planoAssinatura.update({ where: { id }, data: dto });
  }

  async removePlano(id: string) {
    const plano = await this.prisma.planoAssinatura.findUnique({ where: { id } });
    if (!plano) throw new NotFoundException("Plano não encontrado");
    await this.prisma.planoAssinatura.delete({ where: { id } });
    return { ok: true };
  }

  // Configuração da plataforma

  async getConfiguracao() {
    const config = await this.prisma.configuracaoPlataforma.findUnique({
      where: { id: CONFIG_ID },
    });
    return (
      config ??
      this.prisma.configuracaoPlataforma.create({
        data: { id: CONFIG_ID, percentualMarketplace: 0, percentualPlataforma: 0 },
      })
    );
  }

  async updateConfiguracao(dto: UpdateConfiguracaoDto) {
    await this.getConfiguracao();
    return this.prisma.configuracaoPlataforma.update({
      where: { id: CONFIG_ID },
      data: {
        ...(dto.percentualMarketplace !== undefined
          ? { percentualMarketplace: dto.percentualMarketplace }
          : {}),
        ...(dto.percentualPlataforma !== undefined
          ? { percentualPlataforma: dto.percentualPlataforma }
          : {}),
      },
    });
  }

  // Faturamento agregado

  async getFaturamentoGeral() {
    const professores = await this.prisma.professor.findMany({
      include: { alunas: { where: { status: "ativa" }, select: { id: true } } },
    });

    const porProfessor = professores.map((p) => {
      const alunasAtivas = p.alunas.length;
      const valorMensalidade = p.valorMensalidade ? Number(p.valorMensalidade) : 0;
      const faturamento = valorMensalidade * alunasAtivas;
      const percentualComissao = p.percentualComissao ? Number(p.percentualComissao) : 0;
      const comissaoPlataforma = faturamento * (percentualComissao / 100);
      return {
        professorId: p.id,
        nome: p.nome,
        alunasAtivas,
        faturamento,
        percentualComissao,
        comissaoPlataforma,
      };
    });

    const config = await this.getConfiguracao();

    return {
      porProfessor,
      faturamentoTotalEstimado: porProfessor.reduce((acc, p) => acc + p.faturamento, 0),
      comissaoPlataformaTotal: porProfessor.reduce((acc, p) => acc + p.comissaoPlataforma, 0),
      configuracao: config,
    };
  }
}
