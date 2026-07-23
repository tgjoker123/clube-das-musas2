"use client";

import { useState, type FormEvent } from "react";
import { Button, FieldError, Input, Label } from "@musas/ui";
import { createClient } from "@/lib/supabase/client";

export function SignupForm({ role }: { role: "professor" | "parceiro" }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const destination = role === "professor" ? "/onboarding/professor" : "/onboarding/parceiro";

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}${destination}`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.message.includes("already registered")
          ? "Este e-mail já possui uma conta."
          : "Não foi possível criar sua conta agora. Tente novamente.",
      );
      return;
    }

    if (data.session) {
      window.location.href = destination;
      return;
    }

    setEmailSent(true);
  }

  if (emailSent) {
    return (
      <p className="text-body text-fg-secondary text-center">
        Enviamos um link de confirmação para <strong className="text-fg-primary">{email}</strong>.
        Abra-o para continuar seu cadastro.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error ? <FieldError>{error}</FieldError> : null}

      <Button type="submit" loading={loading} className="mt-2">
        Criar conta
      </Button>
    </form>
  );
}
