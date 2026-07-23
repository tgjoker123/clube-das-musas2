"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, FieldError, Input, Label } from "@musas/ui";
import type { RegisterProfessorInput, ThemeName } from "@musas/types";
import { AuthShell } from "@/components/auth-shell";
import { apiFetch, ApiError } from "@/lib/api";

export default function OnboardingProfessorPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [themePreference, setThemePreference] = useState<ThemeName>("luxo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: RegisterProfessorInput = {
        businessName,
        phone: phone || undefined,
        themePreference,
      };
      await apiFetch("/auth/register/professor", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      router.push("/professor/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        router.push("/professor/dashboard");
        return;
      }
      setError("Não foi possível concluir seu cadastro. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Sua marca no Clube" subtitle="Poucos dados para preparar o seu espaço.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="businessName">Nome do seu negócio</Label>
          <Input
            id="businessName"
            placeholder="Ex.: Estúdio Ana Fit"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Tema preferido</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={themePreference === "luxo" ? "primary" : "secondary"}
              onClick={() => setThemePreference("luxo")}
              className="flex-1"
            >
              Luxo
            </Button>
            <Button
              type="button"
              variant={themePreference === "elegance" ? "primary" : "secondary"}
              onClick={() => setThemePreference("elegance")}
              className="flex-1"
            >
              Elegance
            </Button>
          </div>
        </div>

        {error ? <FieldError>{error}</FieldError> : null}

        <Button type="submit" loading={loading} className="mt-2">
          Entrar no meu painel
        </Button>
      </form>
    </AuthShell>
  );
}
