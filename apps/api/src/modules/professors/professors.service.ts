import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import type { AuthUser } from "../../core/auth/supabase-token.guard";
import type { RegisterProfessorDto } from "./dto/register-professor.dto";

@Injectable()
export class ProfessorsService {
  constructor(private readonly prisma: PrismaService) {}

  async registerProfile(authUser: AuthUser, dto: RegisterProfessorDto) {
    const existing = await this.prisma.professor.findUnique({
      where: { authUserId: authUser.authUserId },
    });
    if (existing) {
      throw new ConflictException("Perfil de professor já existe para este usuário");
    }

    return this.prisma.professor.create({
      data: {
        authUserId: authUser.authUserId,
        email: authUser.email,
        nome: dto.nome,
      },
    });
  }

  async getProfile(professorId: string) {
    return this.prisma.professor.findUniqueOrThrow({ where: { id: professorId } });
  }
}
