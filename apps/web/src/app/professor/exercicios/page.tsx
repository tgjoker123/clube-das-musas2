"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Exercicio {
  id: string;
  nome: string;
  grupoMuscular: string;
  videoUrl: string | null;
  instrucoes: string | null;
}

function ExercicioCard({
  exercicio,
  onUpdated,
  className,
}: {
  exercicio: Exercicio;
  onUpdated: () => void;
  className?: string;
}) {
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(exercicio.nome);
  const [grupoMuscular, setGrupoMuscular] = useState(exercicio.grupoMuscular);
  const [videoUrl, setVideoUrl] = useState(exercicio.videoUrl ?? "");
  const [instrucoes, setInstrucoes] = useState(exercicio.instrucoes ?? "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await api.patch(`/exercises/${exercicio.id}`, { nome, grupoMuscular, videoUrl, instrucoes });
      setEditando(false);
      onUpdated();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  }

  if (!editando) {
    return (
      <li className={`app-card ${className ?? ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-neutral-900">{exercicio.nome}</p>
            <p className="text-sm text-neutral-500">{exercicio.grupoMuscular}</p>
          </div>
          <button
            onClick={() => setEditando(true)}
            className="app-link-gold shrink-0 text-xs font-medium"
          >
            Editar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`app-card ${className ?? ""}`}>
      <form onSubmit={salvar} className="space-y-2">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="app-input"
          required
        />
        <input
          type="text"
          value={grupoMuscular}
          onChange={(e) => setGrupoMuscular(e.target.value)}
          className="app-input"
          required
        />
        <input
          type="url"
          placeholder="URL do vídeo demonstrativo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="app-input"
        />
        <textarea
          placeholder="Instruções"
          value={instrucoes}
          onChange={(e) => setInstrucoes(e.target.value)}
          className="app-input"
        />
        {erro && <p className="text-xs text-red-600">{erro}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={salvando}
            className="gold-button rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="text-xs text-neutral-500 hover:text-neutral-700"
          >
            Cancelar
          </button>
        </div>
      </form>
    </li>
  );
}

export default function ExerciciosPage() {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [instrucoes, setInstrucoes] = useState("");

  function carregar() {
    api
      .get<Exercicio[]>("/exercises")
      .then(setExercicios)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/exercises", { nome, grupoMuscular, videoUrl, instrucoes });
      setNome("");
      setGrupoMuscular("");
      setVideoUrl("");
      setInstrucoes("");
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar exercício");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-brand text-3xl font-semibold text-neutral-900">
        Biblioteca de exercícios
      </h1>

      <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-md space-y-3">
        <input
          type="text"
          placeholder="Nome do exercício"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="app-input"
        />
        <input
          type="text"
          placeholder="Grupo muscular"
          required
          value={grupoMuscular}
          onChange={(e) => setGrupoMuscular(e.target.value)}
          className="app-input"
        />
        <input
          type="url"
          placeholder="URL do vídeo demonstrativo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="app-input"
        />
        <textarea
          placeholder="Instruções"
          value={instrucoes}
          onChange={(e) => setInstrucoes(e.target.value)}
          className="app-input"
        />
        <button type="submit" className="gold-button rounded-full px-5 py-2 text-sm font-medium">
          Adicionar
        </button>
      </form>

      {erro && <p className="text-red-600">{erro}</p>}

      <ul className="grid gap-3 sm:grid-cols-2">
        {exercicios.map((ex, i) => (
          <ExercicioCard
            key={ex.id}
            exercicio={ex}
            onUpdated={carregar}
            className={`animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}
          />
        ))}
      </ul>
    </div>
  );
}
