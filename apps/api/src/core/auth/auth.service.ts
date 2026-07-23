import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { ResolvedContext, InvitePreview } from "@musas/types";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import type { AuthUser } from "./supabase-auth.guard";
import type { RegisterProfessorDto } from "./dto/register-professor.dto";
import type { RegisterPartnerDto } from "./dto/register-partner.dto";

export type { ResolvedContext, InvitePreview };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Resolve o perfil completo a partir da identidade bruta do Supabase Auth.
   * Retorna `null` se ainda não existe `users` (cadastro incompleto) — quem
   * chama decide o que fazer (normalmente redirecionar para o onboarding).
   */
  async resolveContext(authUser: AuthUser): Promise<ResolvedContext | null> {
    return this.prisma.withRlsContext({ authUserId: authUser.id }, async (tx) => {
      const user = await tx.user.findUnique({ where: { authUserId: authUser.id } });
      if (!user) {
        return null;
      }

      let professorId: string | undefined;
      if (user.role === "professor") {
        const professor = await tx.professor.findUnique({ where: { userId: user.id } });
        professorId = professor?.id;
      } else if (user.role === "student") {
        const student = await tx.student.findUnique({ where: { userId: user.id } });
        professorId = student?.professorId;
      }

      return {
        userId: user.id,
        authUserId: user.authUserId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        professorId,
      };
    });
  }

  async registerProfessor(authUser: AuthUser, dto: RegisterProfessorDto): Promise<ResolvedContext> {
    const fullName = this.resolveFullName(authUser, dto.fullName);

    return this.prisma.withRlsContext({ authUserId: authUser.id }, async (tx) => {
      const existing = await tx.user.findUnique({ where: { authUserId: authUser.id } });
      if (existing) {
        throw new ConflictException("Este usuário já possui um cadastro.");
      }

      const user = await tx.user.create({
        data: {
          authUserId: authUser.id,
          email: authUser.email,
          fullName,
          role: "professor",
        },
      });

      // A partir daqui o próprio usuário recém-criado já é o "current_user_id"
      // — necessário para a política de RLS de INSERT em `professors`.
      await tx.$executeRaw`SELECT set_config('app.current_user_id', ${user.id}, true)`;
      await tx.$executeRaw`SELECT set_config('app.current_role', 'professor', true)`;

      const professor = await tx.professor.create({
        data: {
          userId: user.id,
          businessName: dto.businessName,
          phone: dto.phone,
          themePreference: dto.themePreference ?? "luxo",
        },
      });

      await this.audit.log(tx, {
        userId: user.id,
        action: "user.register",
        resourceType: "professor",
        resourceId: professor.id,
      });

      return {
        userId: user.id,
        authUserId: user.authUserId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        professorId: professor.id,
      };
    });
  }

  async registerPartner(authUser: AuthUser, dto: RegisterPartnerDto): Promise<ResolvedContext> {
    const fullName = this.resolveFullName(authUser, dto.fullName);

    return this.prisma.withRlsContext({ authUserId: authUser.id }, async (tx) => {
      const existing = await tx.user.findUnique({ where: { authUserId: authUser.id } });
      if (existing) {
        throw new ConflictException("Este usuário já possui um cadastro.");
      }

      const user = await tx.user.create({
        data: {
          authUserId: authUser.id,
          email: authUser.email,
          fullName,
          role: "partner",
        },
      });

      await tx.$executeRaw`SELECT set_config('app.current_user_id', ${user.id}, true)`;
      await tx.$executeRaw`SELECT set_config('app.current_role', 'partner', true)`;

      const partner = await tx.partner.create({
        data: {
          userId: user.id,
          name: dto.businessName,
          category: dto.category,
          status: "pending",
        },
      });

      await this.audit.log(tx, {
        userId: user.id,
        action: "user.register",
        resourceType: "partner",
        resourceId: partner.id,
      });

      return {
        userId: user.id,
        authUserId: user.authUserId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
      };
    });
  }

  /** Endpoint público (sem guard) — validado apenas pela posse do token. */
  async getInvite(token: string): Promise<InvitePreview> {
    return this.prisma.withRlsContext({}, async (tx) => {
      const student = await tx.student.findFirst({
        where: { inviteToken: token, inviteExpiresAt: { gt: new Date() }, userId: null },
        include: { professor: true },
      });

      if (!student || !student.email) {
        throw new NotFoundException("Convite inválido ou expirado.");
      }

      return {
        studentFirstName: student.fullName.split(" ")[0] ?? student.fullName,
        professorBusinessName: student.professor.businessName,
        email: student.email,
      };
    });
  }

  async activateStudent(authUser: AuthUser, token: string): Promise<ResolvedContext> {
    return this.prisma.withRlsContext({ authUserId: authUser.id }, async (tx) => {
      const existing = await tx.user.findUnique({ where: { authUserId: authUser.id } });
      if (existing) {
        throw new ConflictException("Este usuário já possui um cadastro.");
      }

      const student = await tx.student.findFirst({
        where: { inviteToken: token, inviteExpiresAt: { gt: new Date() }, userId: null },
      });
      if (!student) {
        throw new NotFoundException("Convite inválido ou expirado.");
      }

      const user = await tx.user.create({
        data: {
          authUserId: authUser.id,
          email: authUser.email,
          fullName: student.fullName,
          role: "student",
        },
      });

      await tx.$executeRaw`SELECT set_config('app.current_user_id', ${user.id}, true)`;
      await tx.$executeRaw`SELECT set_config('app.current_role', 'student', true)`;
      await tx.$executeRaw`SELECT set_config('app.current_professor_id', ${student.professorId}, true)`;

      await tx.student.update({
        where: { id: student.id },
        data: { userId: user.id, inviteToken: null, inviteExpiresAt: null, email: authUser.email },
      });

      await this.audit.log(tx, {
        userId: user.id,
        action: "user.activate",
        resourceType: "student",
        resourceId: student.id,
      });

      return {
        userId: user.id,
        authUserId: user.authUserId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        professorId: student.professorId,
      };
    });
  }

  /** O nome preferencialmente vem do cadastro no Supabase Auth (signUp); o DTO é só um fallback. */
  private resolveFullName(authUser: AuthUser, fallback?: string): string {
    const fullName = authUser.fullName ?? fallback;
    if (!fullName) {
      throw new BadRequestException("Nome completo é obrigatório.");
    }
    return fullName;
  }

  async logout(context: ResolvedContext): Promise<void> {
    await this.prisma.withRlsContext(
      { authUserId: context.authUserId, userId: context.userId, role: context.role },
      async (tx) => {
        await this.audit.log(tx, { userId: context.userId, action: "user.logout" });
      },
    );
  }
}
