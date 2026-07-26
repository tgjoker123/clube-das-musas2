"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Modal } from "@/components/modal";

interface Aluna {
  id: string;
  nome: string;
  dataNascimento: string;
}

interface Indicadores {
  totalAlunasAtivas: number;
  totalAlunasPorStatus: { ativa: number; suspensa: number; inadimplente: number };
  aniversariantes: {
    em7Dias: Aluna[];
    em15Dias: Aluna[];
    em30Dias: Aluna[];
    doMes: Aluna[];
    porMes: number[];
  };
  semTreinoHa7Dias: Aluna[];
  valorMensalidade: number | null;
  faturamentoEstimado: number | null;
}

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatarReais(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Detalhe = "alunas" | "aniversariantes" | "ausencia" | "faturamento" | null;

export default function ProfessorDashboardPage() {
  const [dados, setDados] = useState<Indicadores | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<Detalhe>(null);
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
    { chave: "alunas" as const, label: "Alunas ativas", valor: String(dados.totalAlunasAtivas) },
    {
      chave: "aniversariantes" as const,
      label: "Aniversariantes do mês",
      valor: String(dados.aniversariantes.doMes.length),
    },
    {
      chave: "ausencia" as const,
      label: "+7 dias sem treino",
      valor: String(dados.semTreinoHa7Dias.length),
    },
    {
      chave: "faturamento" as const,
      label: "Faturamento estimado",
      valor:
        dados.faturamentoEstimado !== null ? formatarReais(dados.faturamentoEstimado) : "—",
    },
  ];

  const mesAtual = new Date().getMonth();
  const maxPorMes = Math.max(...dados.aniversariantes.porMes, 1);

  return (
    <div className="space-y-8 sm:space-y-10">
      <h1 className="font-brand text-2xl font-semibold text-neutral-900 sm:text-3xl">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((card, i) => (
          <button
            key={card.label}
            onClick={() => setDetalhe(card.chave)}
            className={`animate-fade-in-up stagger-${i + 1} rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md sm:p-6`}
          >
            <p className="text-xs text-neutral-500 sm:text-sm">{card.label}</p>
            <p className="mt-1 font-brand text-xl font-semibold text-[color:var(--color-gold-dark)] sm:text-3xl">
              {card.valor}
            </p>
          </button>
        ))}
      </div>

      {detalhe === "alunas" && (
        <Modal title="Alunas ativas" onClose={() => setDetalhe(null)}>
          {dados.totalAlunasAtivas === 0 ? (
            <p className="text-sm text-neutral-500">Nenhuma aluna ativa no momento.</p>
          ) : (
            <p className="text-sm text-neutral-600">
              {dados.totalAlunasAtivas} aluna(s) ativa(s), {dados.totalAlunasPorStatus.suspensa}{" "}
              suspensa(s) e {dados.totalAlunasPorStatus.inadimplente} inadimplente(s).
            </p>
          )}
        </Modal>
      )}

      {detalhe === "aniversariantes" && (
        <Modal title="Aniversariantes por mês" onClose={() => setDetalhe(null)}>
          <div className="space-y-1">
            {NOMES_MESES.map((nome, i) => (
              <div key={nome} className="flex items-center gap-3">
                <span
                  className={`w-20 text-xs ${i === mesAtual ? "font-semibold text-[color:var(--color-gold-dark)]" : "text-neutral-500"}`}
                >
                  {nome}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-[color:var(--color-gold)]"
                    style={{ width: `${(dados.aniversariantes.porMes[i]! / maxPorMes) * 100}%` }}
                  />
                </div>
                <span className="w-5 text-right text-xs text-neutral-500">
                  {dados.aniversariantes.porMes[i]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-neutral-100 pt-3">
            <p className="mb-2 text-sm font-medium text-neutral-900">
              Aniversariantes de {NOMES_MESES[mesAtual]}
            </p>
            {dados.aniversariantes.doMes.length === 0 ? (
              <p className="text-sm text-neutral-500">Nenhuma aniversariante este mês.</p>
            ) : (
              <ul className="space-y-1 text-sm text-neutral-700">
                {dados.aniversariantes.doMes.map((a) => (
                  <li key={a.id}>
                    {a.nome} — dia {new Date(a.dataNascimento).getDate()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Modal>
      )}

      {detalhe === "ausencia" && (
        <Modal title="Ausência de treino (+7 dias)" onClose={() => setDetalhe(null)}>
          {dados.semTreinoHa7Dias.length === 0 ? (
            <p className="text-sm text-neutral-500">Todas as alunas ativas treinaram recentemente.</p>
          ) : (
            <ul className="space-y-1 text-sm text-neutral-700">
              {dados.semTreinoHa7Dias.map((a) => (
                <li key={a.id}>{a.nome}</li>
              ))}
            </ul>
          )}
        </Modal>
      )}

      {detalhe === "faturamento" && (
        <Modal title="Faturamento estimado" onClose={() => setDetalhe(null)}>
          <p className="text-sm text-neutral-600">
            {dados.valorMensalidade
              ? `${formatarReais(dados.valorMensalidade)} por aluna ativa/mês × ${dados.totalAlunasAtivas} aluna(s) ativa(s) = ${formatarReais(dados.faturamentoEstimado ?? 0)}`
              : "Defina o valor da mensalidade para estimar o faturamento."}
          </p>
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
            <button
              onClick={() => setEditandoMensalidade(true)}
              className="app-link-gold mt-3 text-xs font-medium"
            >
              {dados.valorMensalidade ? "Editar valor" : "Definir valor da mensalidade"}
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}
