"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Ficha {
  id: string;
  nomeTemplate: string;
  itens: unknown[];
}

export default function FichasDeTreinoPage() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [nomeTemplate, setNomeTemplate] = useState("");

  function carregar() {
    api
      .get<Ficha[]>("/workouts")
      .then(setFichas)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/workouts", { nomeTemplate });
      setNomeTemplate("");
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar ficha");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-brand text-3xl font-semibold text-neutral-900">Fichas de treino</h1>

      <form onSubmit={handleCreate} className="flex max-w-md gap-2">
        <input
          type="text"
          placeholder="Nome do template (ex: Treino A - Superiores)"
          required
          value={nomeTemplate}
          onChange={(e) => setNomeTemplate(e.target.value)}
          className="app-input"
        />
        <button
          type="submit"
          className="gold-button shrink-0 rounded-full px-5 py-2 text-sm font-medium"
        >
          Criar
        </button>
      </form>

      {erro && <p className="text-red-600">{erro}</p>}

      <ul className="grid gap-3 sm:grid-cols-2">
        {fichas.map((f, i) => (
          <li key={f.id} className={`app-card animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}>
            <Link
              href={`/professor/fichas-de-treino/${f.id}`}
              className="font-medium text-neutral-900 hover:text-[color:var(--color-gold-dark)]"
            >
              {f.nomeTemplate}
            </Link>
            <p className="mt-1 text-sm text-neutral-500">{f.itens.length} exercício(s)</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
