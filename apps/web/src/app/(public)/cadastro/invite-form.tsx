"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button, FieldError, Input, Label } from "@musas/ui";
import type { InvitePreview } from "@musas/types";
import { apiFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

export function InviteForm({ token }: { token: string }) {
  const [invite, setInvite] = useState<InvitePreview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    apiFetch<InvitePreview>(`/auth/invites/${token}`)
      .then(setInvite)
      .catch(() =>
        setLoadError("Este convite é inválido ou já expirou. Peça um novo ao seu professor."),
      );
  }, [token]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!invite) return;
    setError(null);

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const destination = `/onboarding/aluna?token=${encodeURIComponent(token)}`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: invite.email,
      password,
      options: { emailRedirectTo: `${window.location.origin}${destination}` },
    });

    setLoading(false);

    if (signUpError) {
      setError("Não foi possível ativar sua conta agora. Tente novamente.");
      return;
    }

    if (data.session) {
      window.location.href = destination;
      return;
    }

    setEmailSent(true);
  }

  if (loadError) {
    return <FieldError>{loadError}</FieldError>;
  }

  if (!invite) {
    return <p className="text-small text-fg-secondary text-center">Carregando convite...</p>;
  }

  if (emailSent) {
    return (
      <p className="text-body text-fg-secondary text-center">
        Enviamos um link de confirmação para{" "}
        <strong className="text-fg-primary">{invite.email}</strong>. Abra-o para ativar sua conta.
      </p>
    );
  }

  return (
    <>
      <p className="text-body text-fg-secondary mb-4 text-center">
        Bem-vinda, <strong className="text-fg-primary">{invite.studentFirstName}</strong>!{" "}
        {invite.professorBusinessName} está te esperando no Clube.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" value={invite.email} disabled />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Crie sua senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <FieldError>{error}</FieldError> : null}

        <Button type="submit" loading={loading} className="mt-2">
          Ativar minha conta
        </Button>
      </form>
    </>
  );
}
