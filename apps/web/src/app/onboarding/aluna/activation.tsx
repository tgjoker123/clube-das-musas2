"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, FieldError } from "@musas/ui";
import type { ActivateStudentInput, ResolvedContext } from "@musas/types";
import { AuthShell } from "@/components/auth-shell";
import { apiFetch, ApiError } from "@/lib/api";

type Status = "loading" | "ready" | "error";

export function AlunaActivation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [context, setContext] = useState<ResolvedContext | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const payload: ActivateStudentInput = { token };
    apiFetch<ResolvedContext>("/auth/activate", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((result) => {
        setContext(result);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 409) {
          setStatus("ready");
          return;
        }
        setStatus("error");
      });
  }, [token]);

  if (status === "loading") {
    return (
      <AuthShell title="Preparando tudo para você">
        <p className="text-small text-fg-secondary text-center">Só um instante...</p>
      </AuthShell>
    );
  }

  if (status === "error") {
    return (
      <AuthShell title="Convite inválido">
        <FieldError>
          Não conseguimos ativar sua conta com este link. Peça um novo convite ao seu professor.
        </FieldError>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={`Bem-vinda ao Clube, ${context?.fullName.split(" ")[0] ?? ""}!`}>
      <p className="text-body text-fg-secondary mb-6 text-center">
        Sua conta foi ativada. Sua jornada começa agora.
      </p>
      <Button className="w-full" onClick={() => router.push("/aluna/inicio")}>
        Começar
      </Button>
    </AuthShell>
  );
}
