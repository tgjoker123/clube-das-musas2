"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BackLink } from "@/components/back-link";

interface Parceiro {
  id: string;
  nome: string;
  categoria: string | null;
  contato: string | null;
  comissaoPercentual: string | null;
  status: string;
  itens: { id: string }[];
}

export default function ParceirosAdminPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contato, setContato] = useState("");
  const [comissao, setComissao] = useState("");
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    api
      .get<Parceiro[]>("/admin/parceiros")
      .then(setParceiros)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await api.post("/admin/parceiros", {
        nome,
        categoria: categoria || undefined,
        contato: contato || undefined,
        comissaoPercentual: comissao ? Number(comissao) : undefined,
      });
      setNome("");
      setCategoria("");
      setContato("");
      setComissao("");
      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar parceiro");
    } finally {
      setSalvando(false);
    }
  }

  async function toggleStatus(p: Parceiro) {
    try {
      await api.patch(`/admin/parceiros/${p.id}`, {
        status: p.status === "ativo" ? "inativo" : "ativo",
      });
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function excluir(id: string) {
    if (!window.confirm("Excluir este parceiro e seus itens do marketplace?")) return;
    try {
      await api.delete(`/admin/parceiros/${id}`);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-6">
      <BackLink href="/professor/admin" label="Voltar para ajustes" />
      <div className="flex items-center justify-between">
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Parceiros</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="gold-button rounded-full px-5 py-2 text-sm font-medium"
        >
          {mostrarForm ? "Cancelar" : "Novo parceiro"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-md space-y-3">
          <input
            type="text"
            placeholder="Nome do parceiro"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="app-input"
          />
          <input
            type="text"
            placeholder="Categoria (ex: nutrição, suplementos)"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="app-input"
          />
          <input
            type="text"
            placeholder="Contato (e-mail ou telefone)"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            className="app-input"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="% de comissão do parceiro"
            value={comissao}
            onChange={(e) => setComissao(e.target.value)}
            className="app-input"
          />
          <button
            type="submit"
            disabled={salvando}
            className="gold-button rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Cadastrar parceiro"}
          </button>
        </form>
      )}

      {erro && <p className="text-red-600">{erro}</p>}

      {parceiros.length === 0 ? (
        <p className="text-neutral-500">Nenhum parceiro cadastrado.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {parceiros.map((p) => (
            <li key={p.id} className="app-card space-y-1">
              <div className="flex items-start justify-between">
                <p className="font-medium text-neutral-900">{p.nome}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.status === "ativo"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              {p.categoria && <p className="text-sm text-neutral-500">{p.categoria}</p>}
              {p.contato && <p className="text-sm text-neutral-500">{p.contato}</p>}
              <p className="text-xs text-neutral-400">
                {p.comissaoPercentual ? `${p.comissaoPercentual}% de comissão` : "Sem comissão definida"}{" "}
                · {p.itens.length} item(ns) no marketplace
              </p>
              <div className="flex gap-3 pt-1 text-xs font-medium">
                <button onClick={() => toggleStatus(p)} className="app-link-gold">
                  {p.status === "ativo" ? "Desativar" : "Ativar"}
                </button>
                <button onClick={() => excluir(p.id)} className="text-red-600 hover:text-red-700">
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
