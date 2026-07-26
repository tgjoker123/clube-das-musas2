"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const OPCOES = [
  { nota: 1, emoji: "😩", label: "Difícil" },
  { nota: 2, emoji: "😐", label: "Ok" },
  { nota: 3, emoji: "💪", label: "Bom" },
  { nota: 4, emoji: "🔥", label: "Ótimo" },
];

export function AvaliacaoTreino() {
  const [notaEnviada, setNotaEnviada] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function avaliar(nota: number) {
    setEnviando(true);
    setErro(null);
    try {
      await api.post("/avaliacoes-treino", { nota });
      setNotaEnviada(nota);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar avaliação");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="app-card space-y-3">
      <h2 className="app-h2">Como foi o treino de hoje?</h2>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
      <div className="flex justify-between gap-2">
        {OPCOES.map((op) => (
          <button
            key={op.nota}
            onClick={() => avaliar(op.nota)}
            disabled={enviando}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-3 text-2xl transition-all disabled:opacity-50 ${
              notaEnviada === op.nota
                ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)]/10"
                : "border-neutral-200 hover:border-[color:var(--color-gold)]/40"
            }`}
          >
            <span>{op.emoji}</span>
            <span className="text-xs font-medium text-neutral-500">{op.label}</span>
          </button>
        ))}
      </div>
      {notaEnviada !== null && (
        <p className="text-center text-xs text-emerald-600">Avaliação registrada, obrigada!</p>
      )}
    </div>
  );
}
