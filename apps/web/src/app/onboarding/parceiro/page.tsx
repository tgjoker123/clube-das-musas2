"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, FieldError, Input, Label } from "@musas/ui";
import type { RegisterPartnerInput } from "@musas/types";
import { AuthShell } from "@/components/auth-shell";
import { apiFetch, ApiError } from "@/lib/api";

export default function OnboardingParceiroPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: RegisterPartnerInput = { businessName, category: category || undefined };
      await apiFetch("/auth/register/partner", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      router.push("/parceiro");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        router.push("/parceiro");
        return;
      }
      setError("Não foi possível concluir seu cadastro. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Sua marca no Clube"
      subtitle="Após o envio, sua marca passa por aprovação do time do Clube das Musas."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="businessName">Nome da marca/empresa</Label>
          <Input
            id="businessName"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Categoria (opcional)</Label>
          <Input
            id="category"
            placeholder="Ex.: Suplementos, Moda fitness, Estética"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {error ? <FieldError>{error}</FieldError> : null}

        <Button type="submit" loading={loading} className="mt-2">
          Enviar cadastro
        </Button>
      </form>
    </AuthShell>
  );
}
