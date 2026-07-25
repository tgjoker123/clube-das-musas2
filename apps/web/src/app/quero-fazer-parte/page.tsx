"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { BrandMark } from "@/components/brand-mark";

export default function QueroFazerPartePage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await api.post("/leads", { nome, email, telefone, mensagem: mensagem || undefined });
      setEnviado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao enviar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="brand-surface flex min-h-screen items-center justify-center p-6">
      <div className="animate-fade-in-up brand-card w-full max-w-sm rounded-2xl p-8">
        <div className="flex justify-center">
          <BrandMark size={56} />
        </div>
        <h1 className="font-brand mt-5 text-center text-2xl font-semibold text-white">
          Quero fazer parte
        </h1>
        <p className="mt-2 text-center text-sm text-white/50">
          Deixe seus dados que entramos em contato pra te dar as boas-vindas.
        </p>

        {enviado ? (
          <div className="mt-8 space-y-4 text-center">
            <p className="text-sm text-white/70">
              Recebemos seus dados! Em breve alguém da equipe entra em contato com você.
            </p>
            <Link
              href="/"
              className="inline-block text-sm text-[color:var(--color-gold-light)] hover:underline"
            >
              Voltar para o início
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Seu nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="brand-input w-full rounded-lg px-4 py-3 text-sm"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="brand-input w-full rounded-lg px-4 py-3 text-sm"
            />
            <input
              type="tel"
              placeholder="Seu WhatsApp"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="brand-input w-full rounded-lg px-4 py-3 text-sm"
            />
            <textarea
              placeholder="Quer contar mais alguma coisa? (opcional)"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="brand-input w-full rounded-lg px-4 py-3 text-sm"
            />
            {erro && <p className="text-sm text-red-400">{erro}</p>}
            <button
              type="submit"
              disabled={carregando}
              className="gold-button w-full rounded-lg py-3 text-sm font-medium tracking-wide disabled:opacity-50"
            >
              {carregando ? "Enviando..." : "Quero fazer parte"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
