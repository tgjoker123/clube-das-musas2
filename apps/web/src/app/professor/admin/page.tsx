"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface ProfessorRow {
  id: string;
  nome: string;
  email: string;
  status: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [professores, setProfessores] = useState<ProfessorRow[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  function carregar() {
    api
      .get<ProfessorRow[]>("/admin/professors")
      .then(setProfessores)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function toggleAdmin(id: string, isAdmin: boolean) {
    try {
      await api.patch(`/admin/professors/${id}`, { isAdmin: !isAdmin });
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Administradores</h1>
        <p className="text-sm text-neutral-500">
          Contas de professor(a) com acesso a esta área de administração.
        </p>
      </div>

      {erro && <p className="text-red-600">{erro}</p>}

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {professores.map((p) => (
              <tr key={p.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 text-neutral-900">{p.nome}</td>
                <td className="px-4 py-3 text-neutral-600">{p.email}</td>
                <td className="px-4 py-3 text-neutral-600">{p.isAdmin ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAdmin(p.id, p.isAdmin)}
                    className="app-link-gold text-xs font-medium"
                  >
                    {p.isAdmin ? "Remover admin" : "Tornar admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
