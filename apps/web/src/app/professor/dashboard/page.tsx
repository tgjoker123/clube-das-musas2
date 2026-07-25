"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Aluna {
  id: string;
  nome: string;
}

interface Indicadores {
  totalAlunasAtivas: number;
  totalAlunasPorStatus: { ativa: number; suspensa: number; inadimplente: number };
  aniversariantes: { em7Dias: Aluna[]; em15Dias: Aluna[]; em30Dias: Aluna[] };
  semTreinoHa7Dias: Aluna[];
}

export default function ProfessorDashboardPage() {
  const [dados, setDados] = useState<Indicadores | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Indicadores>("/dashboard")
      .then(setDados)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }, []);

  if (erro) return <p className="text-red-600">{erro}</p>;
  if (!dados) return <p>Carregando...</p>;

  const cards = [
    { label: "Alunas ativas", valor: dados.totalAlunasAtivas },
    { label: "Aniversariantes (30 dias)", valor: dados.aniversariantes.em30Dias.length },
    { label: "+7 dias sem treino", valor: dados.semTreinoHa7Dias.length },
  ];

  return (
    <div className="space-y-10">
      <h1 className="font-brand text-3xl font-semibold text-neutral-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`animate-fade-in-up stagger-${i + 1} rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md`}
          >
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="mt-1 font-brand text-4xl font-semibold text-[color:var(--color-gold-dark)]">
              {card.valor}
            </p>
          </div>
        ))}
      </div>

      <section className="animate-fade-in-up stagger-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-brand text-lg text-neutral-900">Alertas de aniversário</h2>
        {dados.aniversariantes.em30Dias.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhum aniversário nos próximos 30 dias.</p>
        ) : (
          <ul className="space-y-1 text-sm text-neutral-700">
            {dados.aniversariantes.em30Dias.map((a) => (
              <li key={a.id}>
                {a.nome}
                {dados.aniversariantes.em7Dias.some((x) => x.id === a.id) && " — em até 7 dias"}
                {!dados.aniversariantes.em7Dias.some((x) => x.id === a.id) &&
                  dados.aniversariantes.em15Dias.some((x) => x.id === a.id) &&
                  " — em até 15 dias"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="animate-fade-in-up stagger-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-brand text-lg text-neutral-900">Ausência de treino (+7 dias)</h2>
        {dados.semTreinoHa7Dias.length === 0 ? (
          <p className="text-sm text-neutral-500">Todas as alunas ativas treinaram recentemente.</p>
        ) : (
          <ul className="space-y-1 text-sm text-neutral-700">
            {dados.semTreinoHa7Dias.map((a) => (
              <li key={a.id}>{a.nome}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
