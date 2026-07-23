import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Cliente Supabase para uso em Server Components/Route Handlers — lê a
 * sessão a partir dos cookies da requisição. Mesmas restrições do
 * client.ts: apenas Auth/Storage, nunca tabelas de negócio diretamente.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Chamado a partir de um Server Component sem permissão de
            // escrita de cookies — seguro ignorar quando há middleware
            // renovando a sessão.
          }
        },
      },
    },
  );
}
