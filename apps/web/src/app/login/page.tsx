"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { BrandMark } from "@/components/brand-mark";

interface WhoAmI {
  role: "professor" | "aluna";
}

export default function LoginPage() {
  const router = useRouter();
  const [area, setArea] = useState<"aluna" | "professor">("aluna");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;

      const me = await api.get<WhoAmI>("/auth/me");

      if (me.role !== area) {
        await supabase.auth.signOut();
        setErro(
          me.role === "professor"
            ? "Essa conta é de professor. Selecione \"Área do Professor\" para entrar."
            : "Essa conta é de aluna. Selecione \"Área da Aluna\" para entrar.",
        );
        return;
      }

      router.push(me.role === "professor" ? "/professor/dashboard" : "/aluna/treino");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao entrar");
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
        <p className="mt-3 font-brand text-center text-xs tracking-[0.35em] text-[color:var(--color-gold-light)] uppercase">
          Clube das Musas
        </p>
        <h1 className="font-brand mt-2 text-center text-2xl font-semibold text-white">
          Bem-vinda de volta
        </h1>

        <div className="mt-6 flex rounded-full border border-white/10 bg-white/5 p-1 text-sm">
          <button
            type="button"
            onClick={() => setArea("aluna")}
            className={`flex-1 rounded-full py-2 font-medium transition-colors ${
              area === "aluna"
                ? "gold-button"
                : "text-white/50 hover:text-white"
            }`}
          >
            Área da Aluna
          </button>
          <button
            type="button"
            onClick={() => setArea("professor")}
            className={`flex-1 rounded-full py-2 font-medium transition-colors ${
              area === "professor"
                ? "gold-button"
                : "text-white/50 hover:text-white"
            }`}
          >
            Área do Professor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="brand-input w-full rounded-lg px-4 py-3 text-sm"
          />
          <input
            type="password"
            placeholder="Senha"
            required
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
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-xs text-white/40">
          <p>
            <Link href="/esqueci-senha" className="hover:text-[color:var(--color-gold-light)]">
              Esqueci minha senha
            </Link>
          </p>
          {area === "aluna" && (
            <p>
              Ainda não é aluna?{" "}
              <Link
                href="/quero-fazer-parte"
                className="text-[color:var(--color-gold-light)] hover:underline"
              >
                Quero fazer parte
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
