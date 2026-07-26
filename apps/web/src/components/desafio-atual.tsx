"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface RankingItem {
  alunaId: string;
  nome: string;
  pontos: number;
}

interface DesafioAtualResponse {
  desafio: { id: string; titulo: string; dataFim: string };
  ranking: RankingItem[];
  suaPosicao: number | null;
}

export function DesafioAtual() {
  const [dados, setDados] = useState<DesafioAtualResponse | null | undefined>(undefined);

  useEffect(() => {
    api
      .get<DesafioAtualResponse | null>("/desafios/atual")
      .then(setDados)
      .catch(() => setDados(null));
  }, []);

  if (!dados) return null;

  const top5 = dados.ranking.slice(0, 5);

  return (
    <div className="app-card animate-fade-in-up space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="app-h2">🏆 {dados.desafio.titulo}</h2>
        {dados.suaPosicao && (
          <span className="rounded-full bg-[color:var(--color-gold)]/10 px-3 py-1 text-xs font-medium text-[color:var(--color-gold-dark)]">
            Você: {dados.suaPosicao}º lugar
          </span>
        )}
      </div>
      <ol className="space-y-1.5 text-sm">
        {top5.map((r, i) => (
          <li key={r.alunaId} className="flex items-center justify-between">
            <span className="text-neutral-700">
              {i + 1}º {r.nome}
            </span>
            <span className="font-medium text-neutral-500">{r.pontos} treinos</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-neutral-400">
        Até {new Date(dados.desafio.dataFim).toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}
