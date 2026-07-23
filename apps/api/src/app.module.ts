import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./core/database/database.module";
import { AuditModule } from "./core/audit/audit.module";
import { AuthModule } from "./core/auth/auth.module";
import { SupabaseModule } from "./platform/integrations/supabase/supabase.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    // Proteção contra força bruta/flood (docs/10_AUTENTICACAO_E_SEGURANCA.md
    // §"Proteção contra ataques") — limite padrão global; rotas sensíveis de
    // auth aplicam um limite mais estrito via @Throttle().
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    SupabaseModule,
    DatabaseModule,
    AuditModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
