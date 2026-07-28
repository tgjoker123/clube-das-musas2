"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/empty-state";

const STATUS_ESTILO: Record<Aluna["status"], string> = {
  ativa: "bg-emerald-100 text-emerald-700",
  suspensa: "bg-amber-100 text-amber-700",
  inadimplente: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: Aluna["status"] }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_ESTILO[status]}`}>
      {status}
    </span>
  );
}

interface Aluna {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  status: "ativa" | "suspensa" | "inadimplente";
  dataNascimento: string;
  authUserId: string | null;
  fotoUrl: string | null;
}

function AvatarAluna({ nome, fotoUrl }: { nome: string; fotoUrl: string | null }) {
  if (fotoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fotoUrl} alt={nome} className="h-8 w-8 rounded-full object-cover" />;
  }
  const iniciais = nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-gold)]/15 text-xs font-medium text-[color:var(--color-gold-dark)]">
      {iniciais}
    </span>
  );
}

export default function AlunasPage() {
  const [alunas, setAlunas] = useState<Aluna[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);

  function carregar() {
    api
      .get<Aluna[]>("/students")
      .then(setAlunas)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  const alunasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return alunas;
    return alunas.filter((a) => a.nome.toLowerCase().includes(termo));
  }, [alunas, busca]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await api.post("/students", {
        nome,
        email,
        cpf: cpf || undefined,
        telefone: telefone || undefined,
        dataNascimento,
      });
      setNome("");
      setEmail("");
      setCpf("");
      setTelefone("");
      setDataNascimento("");
      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar aluna");
    } finally {
      setSalvando(false);
    }
  }

  async function handleInvite(id: string) {
    try {
      await api.post(`/students/${id}/invite`);
      alert("Convite enviado.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao enviar convite");
    }
  }

  async function handleInviteWhatsapp(id: string) {
    try {
      const { link } = await api.get<{ link: string }>(`/students/${id}/whatsapp-invite-link`);
      window.open(link, "_blank");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao gerar link de WhatsApp");
    }
  }

  async function handleDelete(id: string) {
    setExcluindoId(id);
    setErro(null);
    try {
      await api.delete(`/students/${id}`);
      setConfirmandoId(null);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir aluna");
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <h1 className="page-title">Alunas</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="gold-button rounded-full px-5 py-2 text-sm font-medium"
        >
          {mostrarForm ? "Cancelar" : "Nova aluna"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-lg space-y-4">
          <h2 className="app-h2">Nova aluna</h2>
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
              placeholder="CPF (opcional)"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
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
              type="date"
              required
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="app-input"
            />
          </div>
          <button
            type="submit"
            disabled={salvando}
            className="gold-button rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Cadastrar"}
          </button>
        </form>
      )}

      <input
        type="search"
        placeholder="Buscar aluna pelo nome..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="app-input max-w-sm"
      />

      {erro && <p className="text-red-600">{erro}</p>}

      <div className="app-table-wrap">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="app-table-head">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Acesso</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {alunasFiltradas.map((a) => (
              <tr key={a.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/professor/alunas/${a.id}`}
                    className="flex items-center gap-2.5 text-neutral-900 hover:text-[color:var(--color-gold-dark)] hover:underline"
                  >
                    <AvatarAluna nome={a.nome} fotoUrl={a.fotoUrl} />
                    {a.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-600">{a.email}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      a.authUserId
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {a.authUserId ? "Ativo" : "Pendente"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 text-xs font-medium">
                    {!a.authUserId && (
                      <button
                        onClick={() => handleInvite(a.id)}
                        className="app-link-gold p-1.5"
                      >
                        Enviar convite
                      </button>
                    )}
                    {!a.authUserId && a.telefone && (
                      <button
                        onClick={() => handleInviteWhatsapp(a.id)}
                        className="app-link-gold p-1.5"
                      >
                        WhatsApp
                      </button>
                    )}
                    {confirmandoId === a.id ? (
                      <>
                        <span className="text-neutral-500">Apaga tudo dela. Confirmar?</span>
                        <button
                          onClick={() => handleDelete(a.id)}
                          disabled={excluindoId === a.id}
                          className="p-1.5 text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {excluindoId === a.id ? "Excluindo..." : "Sim, excluir"}
                        </button>
                        <button
                          onClick={() => setConfirmandoId(null)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmandoId(a.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {alunasFiltradas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6">
                  <EmptyState message="Nenhuma aluna encontrada." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
