"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/empty-state";

interface Aluna {
  id: string;
  nome: string;
}

interface Recado {
  id: string;
  titulo: string;
  mensagem: string;
  createdAt: string;
  aluna: { id: string; nome: string } | null;
}

export default function RecadosPage() {
  const [recados, setRecados] = useState<Recado[]>([]);
  const [alunas, setAlunas] = useState<Aluna[]>([]);
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [alunaId, setAlunaId] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  function carregar() {
    api.get<Recado[]>("/recados").then(setRecados);
  }

  useEffect(() => {
    carregar();
    api.get<Aluna[]>("/students").then(setAlunas);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await api.post("/recados", { titulo, mensagem, alunaId: alunaId || undefined });
      setTitulo("");
      setMensagem("");
      setAlunaId("");
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar recado");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDelete(id: string) {
    setExcluindoId(id);
    setErro(null);
    try {
      await api.delete(`/recados/${id}`);
      setConfirmandoId(null);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir recado");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Mural de recados</h1>
        <p className="text-sm text-neutral-500">
          Envie um recado para todas as alunas ou só para uma em específico.
        </p>
      </div>

      <form onSubmit={handleCreate} className="app-card animate-fade-in-up space-y-3">
        <input
          type="text"
          placeholder="Título"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="app-input"
        />
        <textarea
          placeholder="Mensagem"
          required
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className="app-input min-h-24"
        />
        <label className="block text-xs text-neutral-500">
          Destinatária
          <select
            value={alunaId}
            onChange={(e) => setAlunaId(e.target.value)}
            className="app-input mt-1"
          >
            <option value="">Todas as alunas</option>
            {alunas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={salvando}
          className="gold-button rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50"
        >
          {salvando ? "Enviando..." : "Enviar recado"}
        </button>
      </form>

      {erro && <p className="text-red-600">{erro}</p>}

      {recados.length === 0 ? (
        <EmptyState message="Nenhum recado enviado ainda." />
      ) : (
        <ul className="space-y-3">
          {recados.map((r) => (
            <li key={r.id} className="app-card">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-neutral-900">{r.titulo}</p>
                <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                  {r.aluna ? r.aluna.nome : "Todas as alunas"}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-600">{r.mensagem}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-neutral-400">
                  {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium">
                  {confirmandoId === r.id ? (
                    <>
                      <span className="text-neutral-500">Excluir este recado?</span>
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={excluindoId === r.id}
                        className="-m-1.5 p-1.5 text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {excluindoId === r.id ? "Excluindo..." : "Sim"}
                      </button>
                      <button
                        onClick={() => setConfirmandoId(null)}
                        className="-m-1.5 p-1.5 text-neutral-400 hover:text-neutral-600"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmandoId(r.id)}
                      className="-m-1.5 p-1.5 text-neutral-400 hover:text-red-600"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
