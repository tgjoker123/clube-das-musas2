"use client";

import { useEffect, useState } from "react";
import { api, uploadFile } from "@/lib/api";
import { Celebration } from "@/components/celebration";

interface Exercicio {
  id: string;
  nome: string;
  grupoMuscular: string;
  videoUrl: string | null;
  instrucoes: string | null;
}

interface Item {
  id: string;
  series: number;
  reps: string;
  carga: string | null;
  exercicio: Exercicio;
}

interface Ficha {
  id: string;
  nomeTemplate: string;
  itens: Item[];
}

interface CheckIn {
  id: string;
  exercicioId: string;
  data: string;
  status: "pendente" | "concluido";
}

const MENSAGENS_MOTIVACIONAIS = [
  "Mandou bem! 💪",
  "Você está arrasando!",
  "Mais um treino no bolso!",
  "Sua dedicação é inspiradora ✨",
  "Isso aí, guerreira!",
  "Um passo mais perto do seu objetivo!",
  "Você é incrível!",
  "Continue assim, estrela!",
];

function isHoje(dataIso: string): boolean {
  const data = new Date(dataIso);
  const hoje = new Date();
  return (
    data.getFullYear() === hoje.getFullYear() &&
    data.getMonth() === hoje.getMonth() &&
    data.getDate() === hoje.getDate()
  );
}

function calcularStreak(checkIns: CheckIn[]): number {
  const diasComTreino = new Set(
    checkIns
      .filter((c) => c.status === "concluido")
      .map((c) => new Date(c.data).toDateString()),
  );

  let streak = 0;
  const cursor = new Date();
  if (!diasComTreino.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (diasComTreino.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function TreinoPage() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [celebracao, setCelebracao] = useState<{ message: string; streak: number } | null>(null);

  function carregar() {
    api.get<Ficha[]>("/workouts/aluna/me").then(setFichas);
    api.get<CheckIn[]>("/checkins/me").then(setCheckIns);
  }

  useEffect(carregar, []);

  const concluidosHoje = new Set(
    checkIns
      .filter((c) => c.status === "concluido" && isHoje(c.data))
      .map((c) => c.exercicioId),
  );

  const streakAtual = calcularStreak(checkIns);

  async function handleConcluir(exercicioId: string, file: File) {
    setEnviando(exercicioId);
    setErro(null);
    try {
      const fotoUrl = await uploadFile("checkin-photos", file);
      await api.post("/checkins", { exercicioId, fotoUrl });
      const checkInsAtualizados = await api.get<CheckIn[]>("/checkins/me");
      setCheckIns(checkInsAtualizados);
      const mensagem =
        MENSAGENS_MOTIVACIONAIS[Math.floor(Math.random() * MENSAGENS_MOTIVACIONAIS.length)]!;
      setCelebracao({ message: mensagem, streak: calcularStreak(checkInsAtualizados) });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao concluir exercício");
    } finally {
      setEnviando(null);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {celebracao && (
        <Celebration
          message={celebracao.message}
          streak={celebracao.streak}
          onDone={() => setCelebracao(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">
          Minha ficha de treino
        </h1>
        {streakAtual > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-gold)]/40 bg-[color:var(--color-gold)]/10 px-3 py-1 text-sm font-medium text-[color:var(--color-gold-dark)]">
            🔥 {streakAtual} {streakAtual === 1 ? "dia" : "dias"}
          </span>
        )}
      </div>

      {erro && <p className="text-red-600">{erro}</p>}

      {fichas.length === 0 && (
        <p className="text-neutral-500">Nenhuma ficha associada ainda. Fale com seu professor.</p>
      )}

      {fichas.map((ficha, fi) => (
        <section
          key={ficha.id}
          className={`animate-fade-in-up stagger-${fi + 1} space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm`}
        >
          <h2 className="font-brand text-lg text-neutral-900">{ficha.nomeTemplate}</h2>
          <ul className="space-y-4">
            {ficha.itens.map((item) => {
              const concluido = concluidosHoje.has(item.exercicio.id);
              return (
                <li
                  key={item.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    concluido
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-neutral-200 bg-neutral-50"
                  }`}
                >
                  <p className="font-medium text-neutral-900">{item.exercicio.nome}</p>
                  <p className="text-sm text-neutral-500">
                    {item.exercicio.grupoMuscular} — {item.series}x{item.reps}
                    {item.carga ? ` (${item.carga})` : ""}
                  </p>
                  {item.exercicio.videoUrl && (
                    <a
                      href={item.exercicio.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[color:var(--color-gold-dark)] hover:underline"
                    >
                      Ver vídeo demonstrativo
                    </a>
                  )}
                  {item.exercicio.instrucoes && (
                    <p className="mt-1 text-sm text-neutral-600">{item.exercicio.instrucoes}</p>
                  )}

                  <div className="mt-3">
                    {concluido ? (
                      <span className="text-sm font-medium text-emerald-600">
                        Concluído hoje ✓
                      </span>
                    ) : (
                      <label className="gold-button inline-block cursor-pointer rounded-full px-4 py-2 text-sm font-medium disabled:opacity-50">
                        {enviando === item.exercicio.id ? "Enviando..." : "Concluir exercício (anexar foto)"}
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          disabled={enviando === item.exercicio.id}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleConcluir(item.exercicio.id, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
