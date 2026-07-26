"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Marca {
  carga: string;
  reps: number;
  data: string;
}

interface RecordeExercicio {
  exercicio: { id: string; nome: string; grupoMuscular: string };
  atual: Marca;
  historico: Marca[];
}

function EvolucaoBarra({ historico }: { historico: Marca[] }) {
  const max = Math.max(...historico.map((h) => Number(h.carga)), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height: 56 }}>
      {historico.map((h, i) => (
        <div
          key={i}
          title={`${h.carga}kg × ${h.reps} — ${new Date(h.data).toLocaleDateString("pt-BR")}`}
          className="w-3 rounded-t bg-[color:var(--color-gold)]/70 transition-all"
          style={{ height: `${(Number(h.carga) / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function RecordesPage() {
  const [recordes, setRecordes] = useState<RecordeExercicio[] | null>(null);

  useEffect(() => {
    api.get<RecordeExercicio[]>("/recordes/me").then(setRecordes);
  }, []);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Meus recordes</h1>
        <p className="text-sm text-neutral-500">
          Sua evolução de carga em cada exercício, registrada nos check-ins.
        </p>
      </div>

      {recordes === null && <p className="text-neutral-500">Carregando...</p>}
      {recordes?.length === 0 && (
        <p className="text-neutral-500">
          Registre a carga usada ao concluir um exercício para começar a acompanhar seus recordes.
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {recordes?.map((r) => (
          <li key={r.exercicio.id} className="app-card space-y-3">
            <div>
              <p className="font-medium text-neutral-900">{r.exercicio.nome}</p>
              <p className="text-xs text-neutral-400">{r.exercicio.grupoMuscular}</p>
            </div>
            <p className="text-2xl font-brand text-[color:var(--color-gold-dark)]">
              {r.atual.carga}kg <span className="text-sm text-neutral-500">× {r.atual.reps}</span>
            </p>
            {r.historico.length > 1 && <EvolucaoBarra historico={r.historico} />}
            <p className="text-xs text-neutral-400">
              Recorde em {new Date(r.atual.data).toLocaleDateString("pt-BR")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
