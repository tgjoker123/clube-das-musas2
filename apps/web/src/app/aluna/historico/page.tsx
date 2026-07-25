"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface CheckIn {
  id: string;
  data: string;
  status: "pendente" | "concluido";
  exercicio: { nome: string; grupoMuscular: string };
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default function HistoricoPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<CheckIn[]>("/checkins/me")
      .then(setCheckIns)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }, []);

  if (erro) return <p className="text-red-600">{erro}</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-brand text-3xl font-semibold text-neutral-900">Meu histórico</h1>

      {checkIns.length === 0 ? (
        <p className="text-neutral-500">Nenhum treino concluído ainda.</p>
      ) : (
        <ul className="space-y-2">
          {checkIns.map((c, i) => (
            <li
              key={c.id}
              className={`animate-fade-in-up stagger-${Math.min(i + 1, 4)} flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm`}
            >
              <div>
                <p className="font-medium text-neutral-900">{c.exercicio.nome}</p>
                <p className="text-sm text-neutral-500">{c.exercicio.grupoMuscular}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500 capitalize">{formatarData(c.data)}</p>
                <span className="text-xs font-medium text-emerald-600">Concluído ✓</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
