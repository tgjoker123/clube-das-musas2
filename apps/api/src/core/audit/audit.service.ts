import { Injectable } from "@nestjs/common";
import type { Prisma } from "@musas/database";

export interface AuditEntry {
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Registro de auditoria (docs/04_MODELO_DE_DADOS.md §4.1, Padrão G).
 * Sempre chamado dentro da mesma transação/contexto RLS da operação que
 * está sendo auditada — nunca depois, em uma transação separada, para que
 * a auditoria nunca fique "perdida" se algo falhar no meio do caminho.
 */
@Injectable()
export class AuditService {
  async log(tx: Prisma.TransactionClient, entry: AuditEntry): Promise<void> {
    await tx.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        ipAddress: entry.ipAddress,
        metadata: entry.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }
}
