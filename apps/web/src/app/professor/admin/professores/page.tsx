"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BackLink } from "@/components/back-link";
import { EmptyState } from "@/components/empty-state";

interface ProfessorRow {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  status: string;
  isAdmin: boolean;
  authUserId: string | null;
  percentualComissao: string | null;
  createdAt: string;
}

export default function ProfessoresAdminPage() {
  const [professores, setProfessores] = useState<ProfessorRow[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [percentual, setPercentual] = useState("");
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    api
      .get<ProfessorRow[]>("/admin/professors")
      .then(setProfessores)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await api.post("/admin/professors", {
        nome,
        email,
        telefone: telefone || undefined,
        percentualComissao: percentual ? Number(percentual) : undefined,
      });
      setNome("");
      setEmail("");
      setTelefone("");
      setPercentual("");
      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar professor");
    } finally {
      setSalvando(false);
    }
  }

  async function toggleAdmin(id: string, isAdmin: boolean) {
    try {
      await api.patch(`/admin/professors/${id}`, { isAdmin: !isAdmin });
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function editarPercentual(id: string, atual: string | null) {
    const valor = window.prompt("Percentual de comissão (%) por aluna:", atual ?? "0");
    if (valor === null) return;
    try {
      await api.patch(`/admin/professors/${id}`, { percentualComissao: Number(valor) });
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao atualizar comissão");
    }
  }

  async function enviarWhatsapp(id: string) {
    try {
      const { link } = await api.get<{ link: string }>(
        `/admin/professors/${id}/whatsapp-invite-link`,
      );
      window.open(link, "_blank");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao gerar link de WhatsApp");
    }
  }

  return (
    <div className="space-y-6">
      <BackLink href="/professor/admin" label="Voltar para ajustes" />
      <div className="flex items-center justify-between">
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Professores</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="gold-button rounded-full px-5 py-2 text-sm font-medium"
        >
          {mostrarForm ? "Cancelar" : "Novo professor"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-lg space-y-4">
          <h2 className="app-h2">Novo professor</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="app-input"
            />
            <input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="app-input"
            />
            <input
              type="text"
              placeholder="WhatsApp (opcional, com DDD)"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="app-input"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="% de comissão por aluna"
              value={percentual}
              onChange={(e) => setPercentual(e.target.value)}
              className="app-input"
            />
          </div>
          <button
            type="submit"
            disabled={salvando}
            className="gold-button rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Cadastrar e enviar convite por e-mail"}
          </button>
        </form>
      )}

      {erro && <p className="text-red-600">{erro}</p>}

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">% comissão</th>
              <th className="px-4 py-3">Acesso</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {professores.map((p) => (
              <tr key={p.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 text-neutral-900">{p.nome}</td>
                <td className="px-4 py-3 text-neutral-600">{p.email}</td>
                <td className="px-4 py-3 text-neutral-600">
                  <button
                    onClick={() => editarPercentual(p.id, p.percentualComissao)}
                    className="app-link-gold"
                  >
                    {p.percentualComissao ? `${p.percentualComissao}%` : "Definir"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.authUserId
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {p.authUserId ? "Ativo" : "Pendente"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.isAdmin && (
                    <span className="rounded-full bg-[color:var(--color-gold)]/15 px-2.5 py-0.5 text-xs font-medium text-[color:var(--color-gold-dark)]">
                      Admin
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 text-xs font-medium">
                    {!p.authUserId && p.telefone && (
                      <button onClick={() => enviarWhatsapp(p.id)} className="app-link-gold p-1.5">
                        WhatsApp
                      </button>
                    )}
                    <button
                      onClick={() => toggleAdmin(p.id, p.isAdmin)}
                      className="app-link-gold p-1.5"
                    >
                      {p.isAdmin ? "Remover admin" : "Tornar admin"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {professores.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6">
                  <EmptyState message="Nenhum professor cadastrado." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
