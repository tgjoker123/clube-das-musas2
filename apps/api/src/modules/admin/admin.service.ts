import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  listProfessors() {
    return this.prisma.professor.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        status: true,
        isAdmin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async setAdmin(id: string, isAdmin: boolean) {
    const professor = await this.prisma.professor.findUnique({ where: { id } });
    if (!professor) throw new NotFoundException("Professor não encontrado");
    return this.prisma.professor.update({ where: { id }, data: { isAdmin } });
  }
}
