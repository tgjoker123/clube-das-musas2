"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Aluna {
  id: string;
  nome: string;
  email: string;
  status: "ativa" | "suspensa" | "inadimplente";
  dataNascimento: string;
  authUserId: string | null;
}

export default function AlunasPage() {
  const [alunas, setAlunas] = useState<Aluna[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
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
      await api.post("/students", { nome, email, dataNascimento });
      setNome("");
      setEmail("");
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
      <div className="flex items-center justify-between">
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Alunas</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="gold-button rounded-full px-5 py-2 text-sm font-medium"
        >
          {mostrarForm ? "Cancelar" : "Nova aluna"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleCreate} className="app-card animate-fade-in-up max-w-md space-y-3">
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
            type="date"
            required
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="app-input"
          />
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

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="border-b">
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
                    className="text-neutral-900 hover:text-[color:var(--color-gold-dark)] hover:underline"
                  >
                    {a.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-600">{a.email}</td>
                <td className="px-4 py-3 text-neutral-600">{a.status}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {a.authUserId ? "Ativo" : "Pendente"}
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
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  Nenhuma aluna encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
