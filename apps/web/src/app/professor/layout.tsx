"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/brand-mark";
import { useRoleGuard } from "@/components/use-role-guard";

const BASE_LINKS = [
  { href: "/professor/dashboard", label: "Dashboard" },
  { href: "/professor/alunas", label: "Alunas" },
  { href: "/professor/exercicios", label: "Exercícios" },
  { href: "/professor/fichas-de-treino", label: "Fichas de treino" },
  { href: "/professor/desafios", label: "Desafios" },
  { href: "/professor/recados", label: "Recados" },
  { href: "/professor/interessadas", label: "Interessadas" },
];

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { estado, isAdmin } = useRoleGuard("professor");

  const links = isAdmin
    ? [...BASE_LINKS, { href: "/professor/admin", label: "Ajustes" }]
    : BASE_LINKS;

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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <span className="flex items-center gap-2">
            <BrandMark size={26} />
            <span className="font-brand shimmer-text text-base tracking-wide sm:text-lg">
              Clube das Musas
            </span>
          </span>
          <nav className="hidden gap-6 text-sm sm:flex">
            {links.map((link) => (
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
      <div className="mx-auto max-w-6xl animate-fade-in p-4 pb-24 sm:p-6 sm:pb-6">{children}</div>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex gap-1.5 overflow-x-auto border-t border-neutral-200 bg-white px-2 py-2.5 text-[13px] shadow-[0_-6px_16px_rgba(0,0,0,0.12)] sm:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3.5 py-2 font-medium transition-colors ${
              pathname === link.href
                ? "bg-[color:var(--color-gold)] text-black shadow-sm"
                : "text-neutral-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
