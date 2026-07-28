"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BackLink } from "@/components/back-link";
import { EmptyState } from "@/components/empty-state";

interface FaturamentoProfessor {
  professorId: string;
  nome: string;
  alunasAtivas: number;
  faturamento: number;
  percentualComissao: number;
  comissaoPlataforma: number;
}

interface Configuracao {
  percentualMarketplace: string;
  percentualPlataforma: string;
}

interface FaturamentoGeral {
  porProfessor: FaturamentoProfessor[];
  faturamentoTotalEstimado: number;
  comissaoPlataformaTotal: number;
  configuracao: Configuracao;
}

function formatarReais(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function FaturamentoAdminPage() {
  const [dados, setDados] = useState<FaturamentoGeral | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [percentualMarketplace, setPercentualMarketplace] = useState("");
  const [percentualPlataforma, setPercentualPlataforma] = useState("");
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    api
      .get<FaturamentoGeral>("/admin/faturamento")
      .then((data) => {
        setDados(data);
        setPercentualMarketplace(data.configuracao.percentualMarketplace);
        setPercentualPlataforma(data.configuracao.percentualPlataforma);
      })
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function salvarConfiguracao(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.patch("/admin/configuracao", {
        percentualMarketplace: Number(percentualMarketplace),
        percentualPlataforma: Number(percentualPlataforma),
      });
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar configuração");
    } finally {
      setSalvando(false);
    }
  }

  if (erro) return <p className="text-red-600">{erro}</p>;
  if (!dados) return <p>Carregando...</p>;

  return (
    <div className="space-y-6">
      <BackLink href="/professor/admin" label="Voltar para ajustes" />
      <div className="page-header">
        <h1 className="page-title">Faturamento</h1>
        <p className="page-subtitle">Faturamento da plataforma e comissões por professor.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="app-card">
          <p className="text-xs text-neutral-500 sm:text-sm">Faturamento total estimado</p>
          <p className="mt-1 font-brand text-xl font-semibold text-[color:var(--color-gold-dark)] sm:text-2xl">
            {formatarReais(dados.faturamentoTotalEstimado)}
          </p>
        </div>
        <div className="app-card">
          <p className="text-xs text-neutral-500 sm:text-sm">Comissão da plataforma (estimada)</p>
          <p className="mt-1 font-brand text-xl font-semibold text-[color:var(--color-gold-dark)] sm:text-2xl">
            {formatarReais(dados.comissaoPlataformaTotal)}
          </p>
        </div>
      </div>

      <section className="app-card space-y-3">
        <h2 className="app-h2">Percentuais da plataforma</h2>
        <form onSubmit={salvarConfiguracao} className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-neutral-500">
            % negociação marketplace
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={percentualMarketplace}
              onChange={(e) => setPercentualMarketplace(e.target.value)}
              className="app-input mt-1 w-32"
            />
          </label>
          <label className="text-xs text-neutral-500">
            % ganho da plataforma
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={percentualPlataforma}
              onChange={(e) => setPercentualPlataforma(e.target.value)}
              className="app-input mt-1 w-32"
            />
          </label>
          <button
            type="submit"
            disabled={salvando}
            className="gold-button rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="app-h2">Por professor</h2>
        {dados.porProfessor.length === 0 ? (
          <EmptyState message="Nenhum professor cadastrado." />
        ) : (
          <div className="app-table-wrap">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="app-table-head">
                  <th className="px-4 py-3">Professor</th>
                  <th className="px-4 py-3">Alunas ativas</th>
                  <th className="px-4 py-3">Faturamento</th>
                  <th className="px-4 py-3">% comissão</th>
                  <th className="px-4 py-3">Comissão plataforma</th>
                </tr>
              </thead>
              <tbody>
                {dados.porProfessor.map((p) => (
                  <tr key={p.professorId} className="border-b last:border-b-0">
                    <td className="px-4 py-3 text-neutral-900">{p.nome}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.alunasAtivas}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatarReais(p.faturamento)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{p.percentualComissao}%</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatarReais(p.comissaoPlataforma)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
