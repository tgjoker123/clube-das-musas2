import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { AuthUser } from "../../core/auth/supabase-token.guard";
import type { UpdateProfessorDto } from "./dto/update-professor.dto";

@Injectable()
export class ProfessorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(professorId: string) {
    return this.prisma.professor.findUniqueOrThrow({ where: { id: professorId } });
  }

  async updateProfile(professorId: string, dto: UpdateProfessorDto) {
    return this.prisma.professor.update({
      where: { id: professorId },
      data: {
        ...(dto.valorMensalidade !== undefined
          ? { valorMensalidade: dto.valorMensalidade }
          : {}),
      },
    });
  }

  async activate(professorId: string, authUser: AuthUser) {
    const professor = await this.prisma.professor.findUnique({ where: { id: professorId } });
    if (!professor) throw new NotFoundException("Professor não encontrado");
    if (professor.authUserId) {
      throw new BadRequestException("Conta já ativada");
    }
    if (professor.email.toLowerCase() !== authUser.email.toLowerCase()) {
      throw new ForbiddenException("E-mail do convite não corresponde ao usuário autenticado");
    }

    return this.prisma.professor.update({
      where: { id: professorId },
      data: { authUserId: authUser.authUserId },
    });
  }
}
