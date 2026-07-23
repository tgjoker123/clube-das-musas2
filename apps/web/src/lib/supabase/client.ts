import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso no navegador (Client Components) — login,
 * sessão e upload direto para Storage via URL assinada. Nunca usado para
 * ler/escrever tabelas de negócio diretamente (ver docs/00_ARQUITETURA.md
 * §2 — toda regra de negócio passa pela apps/api).
 */
export function createClient() {
  return createBrowserClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
  );
}
