import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/**
 * `@Global` porque toda Service de todo módulo de negócio precisa do
 * PrismaService — declará-lo em cada módulo individualmente seria
 * repetitivo sem benefício de isolamento real (ele não tem estado
 * específico de módulo).
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
