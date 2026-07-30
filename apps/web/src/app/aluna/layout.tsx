"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/brand-mark";
import { useRoleGuard } from "@/components/use-role-guard";
import { BottomNav } from "@/components/bottom-nav";

const LINKS = [
  { href: "/aluna/treino", label: "Treino" },
  { href: "/aluna/feed", label: "Feed" },
  { href: "/aluna/recordes", label: "Recordes" },
  { href: "/aluna/historico", label: "Meu histórico" },
  { href: "/aluna/perfil", label: "Meu perfil" },
];

export default function AlunaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { estado } = useRoleGuard("aluna");

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (estado === "verificando") {
    return <div className="app-shell" />;
  }

  return (
    <div className="app-shell">
      <header className="brand-surface app-topbar sticky top-0 z-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <span className="flex items-center gap-2">
            <BrandMark size={26} />
            <span className="font-brand shimmer-text text-base tracking-wide sm:text-lg">
              Clube das Musas
            </span>
          </span>
          <nav className="hidden gap-6 text-sm sm:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  pathname === link.href
                    ? "text-[color:var(--color-gold-light)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="gold-outline-button rounded-full px-3.5 py-1.5 text-xs sm:px-4"
          >
            Sair
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-3xl animate-fade-in p-4 pb-24 sm:p-6 sm:pb-6">{children}</div>
      <BottomNav itens={LINKS} ativo={pathname} />
    </div>
  );
}
