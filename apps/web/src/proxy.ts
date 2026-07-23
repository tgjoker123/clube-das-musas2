import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Áreas que exigem sessão válida. A validação de PERFIL (professor só em
 * /professor, aluna só em /aluna...) depende de dados que só a apps/api
 * resolve (RolesGuard) — aqui garantimos apenas que existe uma sessão,
 * conforme docs/00_ARQUITETURA.md §4.2.
 */
const PROTECTED_PREFIXES = ["/professor", "/aluna", "/parceiro", "/onboarding"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  let user = null;
  try {
    const supabase = createServerClient(
      process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
      process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: CookieToSet[]) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value);
            }
            response = NextResponse.next({ request });
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      },
    );

    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch (error) {
    // Supabase mal configurado/indisponível nunca pode derrubar o site
    // inteiro (páginas públicas continuam servindo) — mas áreas protegidas
    // falham fechado (redirecionam para o login) por segurança.
    console.error("[proxy] Falha ao validar sessão do Supabase:", error);
    if (isProtected) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
