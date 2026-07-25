"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/brand-mark";

const LINKS = [
  { href: "/professor/dashboard", label: "Dashboard" },
  { href: "/professor/alunas", label: "Alunas" },
  { href: "/professor/exercicios", label: "Exercícios" },
  { href: "/professor/fichas-de-treino", label: "Fichas de treino" },
];

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2">
            <BrandMark size={28} />
            <span className="font-brand shimmer-text text-lg tracking-wide">
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
            className="gold-outline-button rounded-full px-4 py-1.5 text-xs"
          >
            Sair
          </button>
        </div>
        <nav className="flex gap-4 overflow-x-auto px-6 pb-3 text-xs sm:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-[color:var(--color-gold-light)]"
                  : "text-white/60"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-6xl animate-fade-in p-6">{children}</div>
    </div>
  );
}
