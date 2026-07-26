"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/brand-mark";

const LINKS = [
  { href: "/aluna/treino", label: "Treino" },
  { href: "/aluna/historico", label: "Meu histórico" },
  { href: "/aluna/perfil", label: "Meu perfil" },
];

export default function AlunaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="brand-surface sticky top-0 z-10 border-b border-white/5">
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
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 text-xs sm:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-3 py-1.5 transition-colors ${
                pathname === link.href
                  ? "bg-[color:var(--color-gold)]/15 text-[color:var(--color-gold-light)]"
                  : "text-white/55"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-3xl animate-fade-in p-4 sm:p-6">{children}</div>
    </div>
  );
}
