"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { BrandMark } from "@/components/brand-mark";

interface WhoAmI {
  role: "professor" | "aluna";
}

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) throw error;

      const me = await api.get<WhoAmI>("/auth/me");
      router.push(me.role === "professor" ? "/professor/dashboard" : "/aluna/treino");
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Não foi possível redefinir a senha. Peça um novo link.",
      );
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
          Definir nova senha
        </h1>

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
            {carregando ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
