"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Desafio {
  id: string;
  titulo: string;
  metrica: string;
  dataInicio: string;
  dataFim: string;
}

interface RankingItem {
  alunaId: string;
  nome: string;
  pontos: number;
}

const METRICAS = [
  { valor: "treinos", label: "Treinos concluídos" },
  { valor: "streak", label: "Dias distintos treinados" },
  { valor: "avaliacao", label: "Nota média da avaliação" },
];

function labelMetrica(valor: string): string {
  return METRICAS.find((m) => m.valor === valor)?.label ?? valor;
}

function DesafioCard({ desafio, onRemovido }: { desafio: Desafio; onRemovido: () => void }) {
  const [aberto, setAberto] = useState(false);
  const [ranking, setRanking] = useState<RankingItem[] | null>(null);
  const [unidade, setUnidade] = useState("pontos");
  const [erro, setErro] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function excluir() {
    setExcluindo(true);
    setErro(null);
    try {
      await api.delete(`/desafios/${desafio.id}`);
      onRemovido();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir desafio");
      setExcluindo(false);
      setConfirmando(false);
    }
  }

  async function toggle() {
    if (!aberto && !ranking) {
      try {
        const res = await api.get<{ ranking: RankingItem[]; unidade: string }>(
          `/desafios/${desafio.id}/ranking`,
        );
        setRanking(res.ranking);
        setUnidade(res.unidade);
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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium break-words text-neutral-900">{desafio.titulo}</p>
          <p className="text-xs text-neutral-400">{labelMetrica(desafio.metrica)}</p>
        </div>
        {emAndamento && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            Em andamento
          </span>
        )}
      </div>

      <p className="mt-1.5 text-sm text-neutral-500">
        {new Date(desafio.dataInicio).toLocaleDateString("pt-BR")} —{" "}
        {new Date(desafio.dataFim).toLocaleDateString("pt-BR")}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium">
        <button onClick={toggle} className="app-link-gold">
          {aberto ? "Ocultar ranking" : "Ver ranking"}
        </button>
        {confirmando ? (
          <>
            <span className="text-neutral-500">Excluir este desafio?</span>
            <button
              onClick={excluir}
              disabled={excluindo}
              className="text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {excluindo ? "Excluindo..." : "Sim"}
            </button>
            <button
              onClick={() => setConfirmando(false)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className="text-neutral-400 hover:text-red-600"
          >
            Excluir
          </button>
        )}
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
                <span className="font-medium text-neutral-500">
                  {r.pontos} {unidade}
                </span>
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
  const [metrica, setMetrica] = useState("treinos");
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
      await api.post("/desafios", { titulo, metrica, dataInicio, dataFim });
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
      <div className="page-header">
        <h1 className="page-title">Desafios</h1>
        <p className="page-subtitle">
          Crie quantos desafios quiser, com métricas diferentes, e acompanhe o ranking de cada um.
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
        <label className="block text-xs text-neutral-500">
          Métrica de ranking
          <select
            value={metrica}
            onChange={(e) => setMetrica(e.target.value)}
            className="app-input mt-1"
          >
            {METRICAS.map((m) => (
              <option key={m.valor} value={m.valor}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="min-w-0 text-xs text-neutral-500">
            Início
            <input
              type="date"
              required
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="app-input mt-1"
            />
          </label>
          <label className="min-w-0 text-xs text-neutral-500">
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
            <DesafioCard key={d.id} desafio={d} onRemovido={carregar} />
          ))}
        </ul>
      )}
    </div>
  );
}
