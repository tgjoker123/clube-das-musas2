"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface RankingItem {
  alunaId: string;
  nome: string;
  pontos: number;
}

interface DesafioAtivo {
  desafio: { id: string; titulo: string; dataFim: string; metrica: string };
  ranking: RankingItem[];
  suaPosicao: number | null;
  unidade: string;
}

export function DesafiosAtivos() {
  const [desafios, setDesafios] = useState<DesafioAtivo[] | null>(null);

  useEffect(() => {
    api
      .get<DesafioAtivo[]>("/desafios/ativos")
      .then(setDesafios)
      .catch(() => setDesafios([]));
  }, []);

  if (!desafios || desafios.length === 0) return null;

  return (
    <div className="space-y-4">
      {desafios.map(({ desafio, ranking, suaPosicao, unidade }) => {
        const top5 = ranking.slice(0, 5);
        return (
          <div key={desafio.id} className="app-card animate-fade-in-up space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="app-h2">🏆 {desafio.titulo}</h2>
              {suaPosicao && (
                <span className="rounded-full bg-[color:var(--color-gold)]/10 px-3 py-1 text-xs font-medium text-[color:var(--color-gold-dark)]">
                  Você: {suaPosicao}º lugar
                </span>
              )}
            </div>
            <ol className="space-y-1.5 text-sm">
              {top5.map((r, i) => (
                <li key={r.alunaId} className="flex items-center justify-between">
                  <span className="text-neutral-700">
                    {i + 1}º {r.nome}
                  </span>
                  <span className="font-medium text-neutral-500">
                    {r.pontos} {unidade}
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-neutral-400">
              Até {new Date(desafio.dataFim).toLocaleDateString("pt-BR")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
