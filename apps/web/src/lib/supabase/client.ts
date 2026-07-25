import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

/**
 * Reaproveita uma única instância no navegador — instâncias novas a cada
 * chamada nunca chegam a manter o timer de auto-refresh do token vivo,
 * o que fazia a sessão expirar depois de 1h em vez de renovar sozinha.
 */
export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
      process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    );
  }
  return client;
}
