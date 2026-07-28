"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EmptyState, IconBadge, Icon, ICONS } from "@/components/empty-state";

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
      <div className="page-header">
        <h1 className="page-title">Meu histórico</h1>
        <p className="page-subtitle">Cada treino concluído fica registrado aqui.</p>
      </div>

      {checkIns.length === 0 ? (
        <EmptyState message="Nenhum treino concluído ainda. Bora começar hoje?" />
      ) : (
        <ul className="space-y-2">
          {checkIns.map((c, i) => (
            <li
              key={c.id}
              className={`animate-fade-in-up stagger-${Math.min(i + 1, 4)} flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm`}
            >
              <div className="flex items-center gap-3">
                <IconBadge>
                  <Icon path={ICONS.treino} />
                </IconBadge>
                <div>
                  <p className="font-medium text-neutral-900">{c.exercicio.nome}</p>
                  <span className="mt-0.5 inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                    {c.exercicio.grupoMuscular}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
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
