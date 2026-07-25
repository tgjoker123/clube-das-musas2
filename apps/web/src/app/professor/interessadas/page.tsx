"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string | null;
  createdAt: string;
}

export default function InteressadasPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  function carregar() {
    api
      .get<Lead[]>("/leads")
      .then(setLeads)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, []);

  async function handleRemove(id: string) {
    try {
      await api.delete(`/leads/${id}`);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao remover");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Interessadas</h1>
        <p className="text-sm text-neutral-500">
          Pessoas que preencheram o formulário &quot;Quero fazer parte&quot; no site.
        </p>
      </div>

      {erro && <p className="text-red-600">{erro}</p>}

      {leads.length === 0 ? (
        <p className="text-neutral-500">Nenhuma interessada ainda.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {leads.map((lead, i) => (
            <li
              key={lead.id}
              className={`app-card animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-neutral-900">{lead.nome}</p>
                  <p className="text-sm text-neutral-500">{lead.email}</p>
                  <p className="text-sm text-neutral-500">{lead.telefone}</p>
                  {lead.mensagem && (
                    <p className="mt-2 text-sm text-neutral-600">&ldquo;{lead.mensagem}&rdquo;</p>
                  )}
                  <p className="mt-2 text-xs text-neutral-400">
                    {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(lead.id)}
                  className="shrink-0 text-xs text-neutral-400 hover:text-red-600"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
