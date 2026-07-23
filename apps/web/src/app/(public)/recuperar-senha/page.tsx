"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button, FieldError, Input, Label } from "@musas/ui";
import { AuthShell } from "@/components/auth-shell";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar-senha/nova-senha`,
    });

    setLoading(false);

    // Nunca revelar se o e-mail existe ou não na base (enumeração de usuários).
    if (resetError) {
      setError("Não foi possível enviar o e-mail agora. Tente novamente em instantes.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell title="Verifique seu e-mail">
        <p className="text-body text-fg-secondary text-center">
          Se <strong className="text-fg-primary">{email}</strong> estiver cadastrado, você receberá
          um link para criar uma nova senha em instantes.
        </p>
        <Link
          href="/login"
          className="text-small text-accent-gold mt-6 block text-center hover:underline"
        >
          Voltar para o login
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviaremos um link para você criar uma nova senha."
      footer={
        <Link href="/login" className="text-accent-gold hover:underline">
          Voltar para o login
        </Link>
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

        {error ? <FieldError>{error}</FieldError> : null}

        <Button type="submit" loading={loading} className="mt-2">
          Enviar link
        </Button>
      </form>
    </AuthShell>
  );
}
