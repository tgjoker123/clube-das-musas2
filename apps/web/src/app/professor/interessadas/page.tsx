"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EmptyState, IconBadge, Icon, ICONS } from "@/components/empty-state";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string | null;
  createdAt: string;
}

function LeadCard({
  lead,
  onChanged,
  className,
}: {
  lead: Lead;
  onChanged: () => void;
  className?: string;
}) {
  const [cadastrando, setCadastrando] = useState(false);
  const [dataNascimento, setDataNascimento] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleRemove() {
    setRemovendo(true);
    setErro(null);
    try {
      await api.delete(`/leads/${lead.id}`);
      onChanged();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao remover");
      setRemovendo(false);
    }
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await api.post("/students", {
        nome: lead.nome,
        email: lead.email,
        dataNascimento,
      });
      await api.delete(`/leads/${lead.id}`);
      onChanged();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar aluna");
      setSalvando(false);
    }
  }

  return (
    <li className={`app-card ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <IconBadge>
            <Icon path={ICONS.pessoa} />
          </IconBadge>
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
        </div>
        {!cadastrando && (
          <button
            onClick={handleRemove}
            disabled={removendo}
            className="-m-2 shrink-0 p-2 text-xs text-neutral-400 hover:text-red-600 disabled:opacity-50"
          >
            {removendo ? "Removendo..." : "Remover"}
          </button>
        )}
      </div>

      {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}

      {cadastrando ? (
        <form onSubmit={handleCadastrar} className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="date"
            required
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="app-input w-auto"
          />
          <button
            type="submit"
            disabled={salvando}
            className="gold-button rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            {salvando ? "Cadastrando..." : "Confirmar cadastro"}
          </button>
          <button
            type="button"
            onClick={() => setCadastrando(false)}
            className="-m-2 p-2 text-xs text-neutral-500 hover:text-neutral-700"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <button
          onClick={() => setCadastrando(true)}
          className="app-link-gold -m-2 mt-3 p-2 text-xs font-medium"
        >
          Cadastrar como aluna
        </button>
      )}
    </li>
  );
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
        <EmptyState message="Nenhuma interessada ainda." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {leads.map((lead, i) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onChanged={carregar}
              className={`animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
