"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Papel = "professor" | "aluna";

interface QuemSou {
  role: Papel;
  isAdmin?: boolean;
}

const DESTINO_POR_PAPEL: Record<Papel, string> = {
  professor: "/professor/dashboard",
  aluna: "/aluna/treino",
};

/**
 * Garante que só quem tem o papel esperado permaneça na área.
 * O bloqueio na tela de login não basta: quem já estava autenticado
 * como professor conseguia abrir /aluna/* e recebia "Forbidden resource"
 * cru vindo da API. Aqui a pessoa é mandada para a própria área.
 */
export function useRoleGuard(papelEsperado: Papel) {
  const router = useRouter();
  const [estado, setEstado] = useState<"verificando" | "liberado">("verificando");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelado = false;

    api
      .get<QuemSou>("/auth/me")
      .then((eu) => {
        if (cancelado) return;
        if (eu.role !== papelEsperado) {
          router.replace(DESTINO_POR_PAPEL[eu.role]);
          return;
        }
        setIsAdmin(!!eu.isAdmin);
        setEstado("liberado");
      })
      .catch(() => {
        if (!cancelado) router.replace("/login");
      });

    return () => {
      cancelado = true;
    };
  }, [papelEsperado, router]);

  return { estado, isAdmin };
}
