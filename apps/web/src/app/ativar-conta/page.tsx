"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { BrandMark } from "@/components/brand-mark";

function AtivarContaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo") === "professor" ? "professor" : "aluna";
  const id = searchParams.get(tipo === "professor" ? "professorId" : "alunaId");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!id) {
      setErro("Link de ativação inválido: usuário não identificado.");
      return;
    }
    setCarregando(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password: senha });
      if (updateError) throw updateError;

      if (tipo === "professor") {
        await api.post(`/professors/${id}/activate`);
        router.push("/professor/dashboard");
      } else {
        await api.post(`/students/${id}/activate`);
        router.push("/aluna/treino");
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao ativar conta");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="animate-fade-in-up brand-card w-full max-w-sm rounded-2xl p-8">
      <div className="flex justify-center">
        <BrandMark size={56} />
      </div>
      <p className="mt-3 font-brand text-center text-xs tracking-[0.35em] text-[color:var(--color-gold-light)] uppercase">
        Clube das Musas
      </p>
      <h1 className="font-brand mt-2 text-center text-2xl font-semibold text-white">
        Ativar minha conta
      </h1>
      <p className="mt-2 text-center text-sm text-white/50">
        {tipo === "professor"
          ? "Defina uma senha para acessar seu painel de professor."
          : "Defina uma senha para acessar seus treinos."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="password"
          placeholder="Nova senha"
          required
          minLength={6}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="brand-input w-full rounded-lg px-4 py-3 text-sm"
        />
        {erro && <p className="text-sm text-red-400">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="gold-button w-full rounded-lg py-3 text-sm font-medium tracking-wide disabled:opacity-50"
        >
          {carregando ? "Ativando..." : "Ativar conta"}
        </button>
      </form>
    </div>
  );
}

export default function AtivarContaPage() {
  return (
    <main className="brand-surface flex min-h-screen items-center justify-center p-6">
      <Suspense fallback={null}>
        <AtivarContaForm />
      </Suspense>
    </main>
  );
}
