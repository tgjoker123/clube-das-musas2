import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com privilégios de service role — usado pelo backend
 * para: (1) validar tokens/gerenciar usuários via Supabase Auth Admin API
 * (futuro core/auth/AuthModule) e (2) gerar URLs assinadas de upload/
 * download no Storage (futuro platform/storage/StorageModule).
 *
 * Nunca exportar/expor este client para o frontend — a service role key
 * ignora Row Level Security.
 *
 * Registrado via DI em ./supabase.module.ts (token SUPABASE_ADMIN_CLIENT).
 */
export function createSupabaseAdminClient(
  supabaseUrl: string,
  serviceRoleKey: string,
): ReturnType<typeof createClient> {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
