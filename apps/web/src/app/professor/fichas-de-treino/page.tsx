"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { EmptyState, IconBadge, Icon, ICONS } from "@/components/empty-state";

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
      <div className="page-header">
        <h1 className="page-title">Fichas de treino</h1>
        <p className="page-subtitle">Templates de treino que você associa às alunas.</p>
      </div>

      <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-lg space-y-4">
        <h2 className="app-h2">Novo template</h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Nome do template (ex: Treino A - Superiores)"
            required
            value={nomeTemplate}
            onChange={(e) => setNomeTemplate(e.target.value)}
            className="app-input flex-1"
          />
          <button
            type="submit"
            className="gold-button shrink-0 rounded-full px-5 py-2 text-sm font-medium"
          >
            Criar
          </button>
        </div>
      </form>

      {erro && <p className="text-red-600">{erro}</p>}

      {fichas.length === 0 ? (
        <EmptyState message="Nenhuma ficha de treino criada ainda." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {fichas.map((f, i) => (
            <li
              key={f.id}
              className={`app-card animate-fade-in-up stagger-${Math.min(i + 1, 4)} transition-shadow hover:shadow-md`}
            >
              <Link href={`/professor/fichas-de-treino/${f.id}`} className="flex items-center gap-3">
                <IconBadge>
                  <Icon path={ICONS.checklist} />
                </IconBadge>
                <div>
                  <p className="font-medium text-neutral-900 hover:text-[color:var(--color-gold-dark)]">
                    {f.nomeTemplate}
                  </p>
                  <p className="text-sm text-neutral-500">{f.itens.length} exercício(s)</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
