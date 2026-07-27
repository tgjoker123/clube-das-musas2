import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { MailService } from "../../core/mail/mail.service";
import type { CreateLeadDto } from "./dto/create-lead.dto";

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({ data: dto });
    await this.notificarProfessores(lead);
    return lead;
  }

  private async notificarProfessores(lead: { nome: string; email: string; telefone: string; mensagem: string | null }) {
    const professores = await this.prisma.professor.findMany({ select: { email: true } });
    const destinatarios = professores.map((p) => p.email);

    const html = `
      <p>Uma nova interessada preencheu o formulário "Quero fazer parte":</p>
      <ul>
        <li><strong>Nome:</strong> ${lead.nome}</li>
        <li><strong>E-mail:</strong> ${lead.email}</li>
        <li><strong>WhatsApp:</strong> ${lead.telefone}</li>
        ${lead.mensagem ? `<li><strong>Mensagem:</strong> ${lead.mensagem}</li>` : ""}
      </ul>
    `;

    await this.mail.send(destinatarios, "Nova interessada no Clube das Musas", html);
  }

  list() {
    return this.prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  }

  async remove(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException("Interessada não encontrada");
    await this.prisma.lead.delete({ where: { id } });
    return { ok: true };
  }
}
