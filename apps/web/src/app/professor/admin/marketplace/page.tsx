"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BackLink } from "@/components/back-link";

interface Parceiro {
  id: string;
  nome: string;
}

interface Item {
  id: string;
  nome: string;
  descricao: string | null;
  preco: string;
  status: string;
  parceiro: Parceiro;
}

function formatarReais(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function MarketplaceAdminPage() {
  const [itens, setItens] = useState<Item[]>([]);
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [parceiroId, setParceiroId] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    api
      .get<Item[]>("/admin/marketplace/itens")
      .then(setItens)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(() => {
    carregar();
    api.get<Parceiro[]>("/admin/parceiros").then(setParceiros);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!parceiroId) return;
    setSalvando(true);
    setErro(null);
    try {
      await api.post("/admin/marketplace/itens", {
        parceiroId,
        nome,
        descricao: descricao || undefined,
        preco: Number(preco),
      });
      setNome("");
      setDescricao("");
      setPreco("");
      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar item");
    } finally {
      setSalvando(false);
    }
  }

  async function toggleStatus(item: Item) {
    try {
      await api.patch(`/admin/marketplace/itens/${item.id}`, {
        status: item.status === "ativo" ? "inativo" : "ativo",
      });
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function excluir(id: string) {
    if (!window.confirm("Excluir este item do marketplace?")) return;
    try {
      await api.delete(`/admin/marketplace/itens/${id}`);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-6">
      <BackLink href="/professor/admin" label="Voltar para ajustes" />
      <div className="flex items-center justify-between">
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Marketplace</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="gold-button rounded-full px-5 py-2 text-sm font-medium"
        >
          {mostrarForm ? "Cancelar" : "Novo item"}
        </button>
      </div>

      {parceiros.length === 0 && (
        <p className="text-sm text-neutral-500">
          Cadastre um parceiro antes de adicionar itens ao marketplace.
        </p>
      )}

      {mostrarForm && (
        <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-md space-y-3">
          <select
            value={parceiroId}
            onChange={(e) => setParceiroId(e.target.value)}
            required
            className="app-input"
          >
            <option value="">Selecione o parceiro</option>
            {parceiros.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nome do item/serviço"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="app-input"
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="app-input"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Preço (R$)"
            required
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="app-input"
          />
          <button
            type="submit"
            disabled={salvando}
            className="gold-button rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Cadastrar item"}
          </button>
        </form>
      )}

      {erro && <p className="text-red-600">{erro}</p>}

      {itens.length === 0 ? (
        <p className="text-neutral-500">Nenhum item cadastrado no marketplace.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {itens.map((item) => (
            <li key={item.id} className="app-card space-y-1">
              <div className="flex items-start justify-between">
                <p className="font-medium text-neutral-900">{item.nome}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.status === "ativo"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400">{item.parceiro.nome}</p>
              {item.descricao && <p className="text-sm text-neutral-600">{item.descricao}</p>}
              <p className="font-brand text-lg text-[color:var(--color-gold-dark)]">
                {formatarReais(Number(item.preco))}
              </p>
              <div className="flex gap-3 pt-1 text-xs font-medium">
                <button onClick={() => toggleStatus(item)} className="app-link-gold">
                  {item.status === "ativo" ? "Desativar" : "Ativar"}
                </button>
                <button
                  onClick={() => excluir(item.id)}
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
