"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Recado {
  id: string;
  titulo: string;
  mensagem: string;
  createdAt: string;
}

export function Mural() {
  const [recados, setRecados] = useState<Recado[]>([]);

  useEffect(() => {
    api
      .get<Recado[]>("/recados/me")
      .then(setRecados)
      .catch(() => setRecados([]));
  }, []);

  if (recados.length === 0) return null;

  return (
    <div className="app-card animate-fade-in-up space-y-3">
      <h2 className="app-h2">📣 Recados da professora</h2>
      <ul className="space-y-3">
        {recados.slice(0, 5).map((r) => (
          <li key={r.id} className="border-l-2 border-[color:var(--color-gold)]/50 pl-3">
            <p className="font-medium text-neutral-900">{r.titulo}</p>
            <p className="text-sm text-neutral-600">{r.mensagem}</p>
            <p className="text-xs text-neutral-400">
              {new Date(r.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
