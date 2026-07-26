"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Desafio {
  id: string;
  titulo: string;
  dataInicio: string;
  dataFim: string;
}

interface RankingItem {
  alunaId: string;
  nome: string;
  pontos: number;
}

function DesafioCard({ desafio }: { desafio: Desafio }) {
  const [aberto, setAberto] = useState(false);
  const [ranking, setRanking] = useState<RankingItem[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function toggle() {
    if (!aberto && !ranking) {
      try {
        const res = await api.get<{ ranking: RankingItem[] }>(`/desafios/${desafio.id}/ranking`);
        setRanking(res.ranking);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao carregar ranking");
      }
    }
    setAberto((v) => !v);
  }

  const emAndamento =
    new Date(desafio.dataInicio) <= new Date() && new Date() <= new Date(desafio.dataFim);

  return (
    <li className="app-card">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-medium text-neutral-900">{desafio.titulo}</p>
          <p className="text-sm text-neutral-500">
            {new Date(desafio.dataInicio).toLocaleDateString("pt-BR")} —{" "}
            {new Date(desafio.dataFim).toLocaleDateString("pt-BR")}
            {emAndamento && (
              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Em andamento
              </span>
            )}
          </p>
        </div>
        <button onClick={toggle} className="app-link-gold shrink-0 text-xs font-medium">
          {aberto ? "Ocultar ranking" : "Ver ranking"}
        </button>
      </div>

      {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}

      {aberto && ranking && (
        <ol className="mt-3 space-y-1 border-t border-neutral-100 pt-3 text-sm">
          {ranking.length === 0 ? (
            <p className="text-neutral-500">Nenhuma aluna ativa ainda.</p>
          ) : (
            ranking.map((r, i) => (
              <li key={r.alunaId} className="flex items-center justify-between">
                <span className="text-neutral-700">
                  {i + 1}º {r.nome}
                </span>
                <span className="font-medium text-neutral-500">{r.pontos} treinos</span>
              </li>
            ))
          )}
        </ol>
      )}
    </li>
  );
}

export default function DesafiosPage() {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    api
      .get<Desafio[]>("/desafios")
      .then(setDesafios)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await api.post("/desafios", { titulo, dataInicio, dataFim });
      setTitulo("");
      setDataInicio("");
      setDataFim("");
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar desafio");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Desafios</h1>
        <p className="text-sm text-neutral-500">
          Crie um desafio e acompanhe o ranking de quem mais treinou no período.
        </p>
      </div>

      <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-md space-y-3">
        <input
          type="text"
          placeholder="Título (ex: Desafio de Agosto)"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="app-input"
        />
        <div className="flex gap-2">
          <label className="flex-1 text-xs text-neutral-500">
            Início
            <input
              type="date"
              required
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="app-input mt-1"
            />
          </label>
          <label className="flex-1 text-xs text-neutral-500">
            Fim
            <input
              type="date"
              required
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="app-input mt-1"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={salvando}
          className="gold-button rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50"
        >
          {salvando ? "Criando..." : "Criar desafio"}
        </button>
      </form>

      {erro && <p className="text-red-600">{erro}</p>}

      {desafios.length === 0 ? (
        <p className="text-neutral-500">Nenhum desafio criado ainda.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {desafios.map((d) => (
            <DesafioCard key={d.id} desafio={d} />
          ))}
        </ul>
      )}
    </div>
  );
}
