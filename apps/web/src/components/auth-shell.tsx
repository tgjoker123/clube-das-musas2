import Link from "next/link";
import type { ReactNode } from "react";

/** Layout compartilhado das telas públicas de autenticação (Login, Cadastro, Recuperação). */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="bg-bg-base text-fg-primary flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16">
      <Link href="/" className="font-display text-h3 tracking-wide">
        Clube das Musas
      </Link>

      <div className="border-border bg-bg-elevated w-full max-w-sm rounded-md border p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-h2">{title}</h1>
          {subtitle ? <p className="text-small text-fg-secondary mt-2">{subtitle}</p> : null}
        </div>
        {children}
      </div>

      {footer ? <div className="text-small text-fg-secondary">{footer}</div> : null}
    </main>
  );
}
