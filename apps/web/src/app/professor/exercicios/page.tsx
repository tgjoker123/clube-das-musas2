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
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [nome, setNome] = useState(exercicio.nome);
  const [grupoMuscular, setGrupoMuscular] = useState(exercicio.grupoMuscular);
  const [videoUrl, setVideoUrl] = useState(exercicio.videoUrl ?? "");
  const [instrucoes, setInstrucoes] = useState(exercicio.instrucoes ?? "");
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
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

  async function excluir() {
    setExcluindo(true);
    setErro(null);
    try {
      await api.delete(`/exercises/${exercicio.id}`);
      onUpdated();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir");
      setConfirmandoExclusao(false);
    } finally {
      setExcluindo(false);
    }
  }

  if (!editando) {
    return (
      <li className={`app-card ${className ?? ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-gold)]/30 bg-[color:var(--color-gold)]/10">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-gold-dark)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6.5 6.5 17.5 17.5M4 4l3 3M20 20l-3-3M8.5 4 4 8.5M15.5 20 20 15.5M2 6l4-4M18 22l4-4" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-neutral-900">{exercicio.nome}</p>
              <span className="mt-1 inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                {exercicio.grupoMuscular}
              </span>
              {exercicio.videoUrl && (
                <a
                  href={exercicio.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 mt-1 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--color-gold-dark)] hover:underline"
                >
                  ▶ Vídeo
                </a>
              )}
              {exercicio.instrucoes && (
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                  {exercicio.instrucoes}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-1 text-xs font-medium">
            <button onClick={() => setEditando(true)} className="app-link-gold -m-2 p-2">
              Editar
            </button>
            {confirmandoExclusao ? (
              <>
                <button
                  onClick={excluir}
                  disabled={excluindo}
                  className="-m-2 p-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {excluindo ? "Excluindo..." : "Confirmar"}
                </button>
                <button
                  onClick={() => setConfirmandoExclusao(false)}
                  className="-m-2 p-2 text-neutral-400 hover:text-neutral-600"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmandoExclusao(true)}
                className="-m-2 p-2 text-neutral-400 hover:text-red-600"
              >
                Excluir
              </button>
            )}
          </div>
        </div>
        {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}
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

      <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-lg space-y-4">
        <h2 className="app-h2">Novo exercício</h2>
        <div className="grid gap-3 sm:grid-cols-2">
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
        </div>
        <input
          type="url"
          placeholder="URL do vídeo demonstrativo (opcional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="app-input"
        />
        <textarea
          placeholder="Instruções (opcional)"
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
