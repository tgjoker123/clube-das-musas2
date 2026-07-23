"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, FieldError, Input, Label } from "@musas/ui";
import { AuthShell } from "@/components/auth-shell";
import { createClient } from "@/lib/supabase/client";

/**
 * Acessada a partir do link enviado por e-mail (ver /recuperar-senha) — o
 * Supabase já autentica a sessão de recuperação automaticamente ao abrir
 * este link, então aqui só coletamos a nova senha.
 */
export default function NovaSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Não foi possível atualizar sua senha. Solicite um novo link.");
      return;
    }

    router.push("/login");
  }

  return (
    <AuthShell title="Criar nova senha" subtitle="Escolha uma senha forte para sua conta.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error ? <FieldError>{error}</FieldError> : null}

        <Button type="submit" loading={loading} className="mt-2">
          Salvar nova senha
        </Button>
      </form>
    </AuthShell>
  );
}
