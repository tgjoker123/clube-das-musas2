"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, FieldError, Input, Label } from "@musas/ui";
import type { ResolvedContext } from "@musas/types";
import { AuthShell } from "@/components/auth-shell";
import { createClient } from "@/lib/supabase/client";
import { apiFetch } from "@/lib/api";

const ROLE_REDIRECT: Record<ResolvedContext["role"], string> = {
  professor: "/professor/dashboard",
  student: "/aluna/inicio",
  partner: "/parceiro",
  admin: "/professor/dashboard",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    try {
      const context = await apiFetch<ResolvedContext>("/auth/me");
      router.push(ROLE_REDIRECT[context.role]);
    } catch {
      setError("Não foi possível carregar seu perfil. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Entrar"
      subtitle="Bem-vinda de volta ao Clube."
      footer={
        <>
          Ainda não faz parte?{" "}
          <Link href="/cadastro" className="text-accent-gold hover:underline">
            Cadastre-se
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <FieldError>{error}</FieldError> : null}

        <Button type="submit" loading={loading} className="mt-2">
          Entrar
        </Button>

        <Link
          href="/recuperar-senha"
          className="text-small text-fg-secondary hover:text-accent-gold text-center"
        >
          Esqueci minha senha
        </Link>
      </form>
    </AuthShell>
  );
}
