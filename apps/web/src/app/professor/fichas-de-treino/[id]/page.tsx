"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BackLink } from "@/components/back-link";
import { EmptyState, IconBadge, Icon, ICONS } from "@/components/empty-state";

interface Exercicio {
  id: string;
  nome: string;
}

interface Item {
  id: string;
  series: number;
  reps: string;
  carga: string | null;
  exercicio: Exercicio;
}

interface Aluna {
  id: string;
  nome: string;
}

interface FichaDetalhe {
  id: string;
  nomeTemplate: string;
  itens: Item[];
  alunas: { aluna: Aluna }[];
}

export default function FichaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ficha, setFicha] = useState<FichaDetalhe | null>(null);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [alunas, setAlunas] = useState<Aluna[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const [exercicioId, setExercicioId] = useState("");
  const [series, setSeries] = useState("3");
  const [reps, setReps] = useState("10-12");
  const [carga, setCarga] = useState("");
  const [alunaId, setAlunaId] = useState("");

  function carregar() {
    api.get<FichaDetalhe>(`/workouts/${id}`).then(setFicha).catch((err) =>
      setErro(err instanceof Error ? err.message : "Erro ao carregar"),
    );
  }

  useEffect(() => {
    carregar();
    api.get<Exercicio[]>("/exercises").then(setExercicios);
    api.get<Aluna[]>("/students").then(setAlunas);
  }, [id]);

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!exercicioId) return;
    try {
      await api.post(`/workouts/${id}/itens`, {
        exercicioId,
        series: Number(series),
        reps,
        carga: carga || undefined,
      });
      setCarga("");
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao adicionar exercício");
    }
  }

  async function handleRemoveItem(itemId: string) {
    try {
      await api.delete(`/workouts/${id}/itens/${itemId}`);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao remover exercício");
    }
  }

  async function handleAssociar(e: React.FormEvent) {
    e.preventDefault();
    if (!alunaId) return;
    try {
      await api.post(`/workouts/${id}/associar`, { alunaId });
      setAlunaId("");
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao associar aluna");
    }
  }

  if (erro) return <p className="text-red-600">{erro}</p>;
  if (!ficha) return <p>Carregando...</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <BackLink href="/professor/fichas-de-treino" label="Voltar para fichas de treino" />
      <div className="page-header"><h1 className="page-title">{ficha.nomeTemplate}</h1></div>

      <section className="app-card animate-fade-in-up stagger-1 space-y-3">
        <h2 className="app-h2">Exercícios da ficha</h2>
        {ficha.itens.length === 0 ? (
          <EmptyState message="Nenhum exercício adicionado ainda." />
        ) : (
          <ul className="space-y-2">
            {ficha.itens.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-neutral-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <IconBadge size={8}>
                    <Icon size={15} path={ICONS.treino} />
                  </IconBadge>
                  <div className="text-sm">
                    <p className="text-neutral-900">{item.exercicio.nome}</p>
                    <span className="mt-0.5 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-neutral-600">
                      {item.series}x{item.reps}
                      {item.carga ? ` (${item.carga})` : ""}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="-m-2 shrink-0 p-2 text-xs text-neutral-400 hover:text-red-600"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleAddItem} className="flex flex-wrap items-center gap-2">
          <select
            value={exercicioId}
            onChange={(e) => setExercicioId(e.target.value)}
            className="app-input w-auto"
          >
            <option value="">Selecione um exercício</option>
            {exercicios.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.nome}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            className="app-input w-20"
          />
          <input
            type="text"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="app-input w-24"
          />
          <input
            type="text"
            placeholder="Carga"
            value={carga}
            onChange={(e) => setCarga(e.target.value)}
            className="app-input w-24"
          />
          <button type="submit" className="app-link-gold text-sm font-medium">
            Adicionar
          </button>
        </form>
      </section>

      <section className="app-card animate-fade-in-up stagger-2 space-y-3">
        <h2 className="app-h2">Alunas associadas</h2>
        {ficha.alunas.length === 0 ? (
          <EmptyState message="Nenhuma aluna associada ainda." />
        ) : (
          <ul className="space-y-2">
            {ficha.alunas.map(({ aluna }) => (
              <li key={aluna.id} className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
                <IconBadge size={8}>
                  <Icon size={15} path={ICONS.pessoa} />
                </IconBadge>
                <p className="text-sm text-neutral-900">{aluna.nome}</p>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleAssociar} className="flex flex-wrap items-center gap-2">
          <select
            value={alunaId}
            onChange={(e) => setAlunaId(e.target.value)}
            className="app-input w-auto"
          >
            <option value="">Selecione uma aluna</option>
            {alunas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
          <button type="submit" className="app-link-gold text-sm font-medium">
            Associar
          </button>
        </form>
      </section>
    </div>
  );
}
