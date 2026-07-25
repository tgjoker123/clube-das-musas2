"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Aluna {
  id: string;
  nome: string;
}

interface Indicadores {
  totalAlunasAtivas: number;
  totalAlunasPorStatus: { ativa: number; suspensa: number; inadimplente: number };
  aniversariantes: { em7Dias: Aluna[]; em15Dias: Aluna[]; em30Dias: Aluna[] };
  semTreinoHa7Dias: Aluna[];
  valorMensalidade: number | null;
  faturamentoEstimado: number | null;
}

function formatarReais(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProfessorDashboardPage() {
  const [dados, setDados] = useState<Indicadores | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [editandoMensalidade, setEditandoMensalidade] = useState(false);
  const [valorInput, setValorInput] = useState("");
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    api
      .get<Indicadores>("/dashboard")
      .then((data) => {
        setDados(data);
        setValorInput(data.valorMensalidade?.toString() ?? "");
      })
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function salvarMensalidade(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.patch("/professors/me", { valorMensalidade: Number(valorInput) });
      setEditandoMensalidade(false);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar mensalidade");
    } finally {
      setSalvando(false);
    }
  }

  if (erro) return <p className="text-red-600">{erro}</p>;
  if (!dados) return <p>Carregando...</p>;

  const cards = [
    { label: "Alunas ativas", valor: String(dados.totalAlunasAtivas) },
    { label: "Aniversariantes (30 dias)", valor: String(dados.aniversariantes.em30Dias.length) },
    { label: "+7 dias sem treino", valor: String(dados.semTreinoHa7Dias.length) },
    {
      label: "Faturamento estimado",
      valor:
        dados.faturamentoEstimado !== null ? formatarReais(dados.faturamentoEstimado) : "—",
    },
  ];

  return (
    <div className="space-y-10">
      <h1 className="font-brand text-3xl font-semibold text-neutral-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`animate-fade-in-up stagger-${i + 1} rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md`}
          >
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="mt-1 font-brand text-3xl font-semibold text-[color:var(--color-gold-dark)]">
              {card.valor}
            </p>
          </div>
        ))}
      </div>

      <section className="animate-fade-in-up stagger-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-brand text-lg text-neutral-900">Valor da mensalidade</h2>
          {!editandoMensalidade && (
            <button
              onClick={() => setEditandoMensalidade(true)}
              className="app-link-gold text-xs font-medium"
            >
              {dados.valorMensalidade ? "Editar" : "Definir valor"}
            </button>
          )}
        </div>
        {editandoMensalidade ? (
          <form onSubmit={salvarMensalidade} className="mt-3 flex flex-wrap items-center gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Valor por aluna (R$)"
              value={valorInput}
              onChange={(e) => setValorInput(e.target.value)}
              className="app-input w-40"
              required
            />
            <button
              type="submit"
              disabled={salvando}
              className="gold-button rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => setEditandoMensalidade(false)}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <p className="mt-2 text-sm text-neutral-600">
            {dados.valorMensalidade
              ? `${formatarReais(dados.valorMensalidade)} por aluna ativa/mês`
              : "Ainda não definido. O faturamento estimado usa esse valor × alunas ativas."}
          </p>
        )}
      </section>

      <section className="animate-fade-in-up stagger-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-brand text-lg text-neutral-900">Alertas de aniversário</h2>
        {dados.aniversariantes.em30Dias.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhum aniversário nos próximos 30 dias.</p>
        ) : (
          <ul className="space-y-1 text-sm text-neutral-700">
            {dados.aniversariantes.em30Dias.map((a) => (
              <li key={a.id}>
                {a.nome}
                {dados.aniversariantes.em7Dias.some((x) => x.id === a.id) && " — em até 7 dias"}
                {!dados.aniversariantes.em7Dias.some((x) => x.id === a.id) &&
                  dados.aniversariantes.em15Dias.some((x) => x.id === a.id) &&
                  " — em até 15 dias"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="animate-fade-in-up stagger-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-brand text-lg text-neutral-900">Ausência de treino (+7 dias)</h2>
        {dados.semTreinoHa7Dias.length === 0 ? (
          <p className="text-sm text-neutral-500">Todas as alunas ativas treinaram recentemente.</p>
        ) : (
          <ul className="space-y-1 text-sm text-neutral-700">
            {dados.semTreinoHa7Dias.map((a) => (
              <li key={a.id}>{a.nome}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
