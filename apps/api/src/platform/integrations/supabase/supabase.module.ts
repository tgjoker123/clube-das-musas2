import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createSupabaseAdminClient } from "./supabase.provider";

export const SUPABASE_ADMIN_CLIENT = "SUPABASE_ADMIN_CLIENT";

@Global()
@Module({
  providers: [
    {
      provide: SUPABASE_ADMIN_CLIENT,
      useFactory: (config: ConfigService) =>
        createSupabaseAdminClient(
          config.getOrThrow<string>("SUPABASE_URL"),
          config.getOrThrow<string>("SUPABASE_SERVICE_ROLE_KEY"),
        ),
      inject: [ConfigService],
    },
  ],
  exports: [SUPABASE_ADMIN_CLIENT],
})
export class SupabaseModule {}
