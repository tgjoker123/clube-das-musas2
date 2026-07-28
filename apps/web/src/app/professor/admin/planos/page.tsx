"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BackLink } from "@/components/back-link";
import { EmptyState, IconBadge, Icon, ICONS } from "@/components/empty-state";

interface Plano {
  id: string;
  nome: string;
  valor: string;
  periodicidade: string;
  ativo: boolean;
}

const PERIODICIDADES = [
  { valor: "mensal", label: "Mensal" },
  { valor: "trimestral", label: "Trimestral" },
  { valor: "semestral", label: "Semestral" },
  { valor: "anual", label: "Anual" },
];

function formatarReais(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PlanosAdminPage() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [periodicidade, setPeriodicidade] = useState("mensal");
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    api
      .get<Plano[]>("/admin/planos")
      .then(setPlanos)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await api.post("/admin/planos", { nome, valor: Number(valor), periodicidade });
      setNome("");
      setValor("");
      setPeriodicidade("mensal");
      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar plano");
    } finally {
      setSalvando(false);
    }
  }

  async function toggleAtivo(plano: Plano) {
    try {
      await api.patch(`/admin/planos/${plano.id}`, { ativo: !plano.ativo });
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function excluir(id: string) {
    if (!window.confirm("Excluir este plano?")) return;
    try {
      await api.delete(`/admin/planos/${id}`);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-6">
      <BackLink href="/professor/admin" label="Voltar para ajustes" />
      <div className="page-header flex items-center justify-between">
        <h1 className="page-title">
          Preços e assinaturas
        </h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="gold-button rounded-full px-5 py-2 text-sm font-medium"
        >
          {mostrarForm ? "Cancelar" : "Novo plano"}
        </button>
      </div>

      <p className="text-sm text-neutral-500">
        Planos de assinatura que as alunas poderão contratar. A cobrança real ainda não está
        ativa — esta tela só define os planos disponíveis.
      </p>

      {mostrarForm && (
        <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-lg space-y-4">
          <h2 className="app-h2">Novo plano</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Nome do plano"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="app-input"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Valor (R$)"
              required
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="app-input"
            />
          </div>
          <select
            value={periodicidade}
            onChange={(e) => setPeriodicidade(e.target.value)}
            className="app-input"
          >
            {PERIODICIDADES.map((p) => (
              <option key={p.valor} value={p.valor}>
                {p.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={salvando}
            className="gold-button rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Cadastrar plano"}
          </button>
        </form>
      )}

      {erro && <p className="text-red-600">{erro}</p>}

      {planos.length === 0 ? (
        <EmptyState message="Nenhum plano cadastrado." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {planos.map((plano) => (
            <li key={plano.id} className="app-card space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <IconBadge>
                    <Icon path={ICONS.moeda} />
                  </IconBadge>
                  <p className="font-medium text-neutral-900">{plano.nome}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    plano.ativo
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {plano.ativo ? "ativo" : "inativo"}
                </span>
              </div>
              <p className="font-brand text-lg text-[color:var(--color-gold-dark)]">
                {formatarReais(Number(plano.valor))}{" "}
                <span className="text-sm text-neutral-500">/ {plano.periodicidade}</span>
              </p>
              <div className="flex gap-3 pt-1 text-xs font-medium">
                <button onClick={() => toggleAtivo(plano)} className="app-link-gold">
                  {plano.ativo ? "Desativar" : "Ativar"}
                </button>
                <button
                  onClick={() => excluir(plano.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
