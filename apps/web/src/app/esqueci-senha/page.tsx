"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/brand-mark";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      if (error) throw error;
      setEnviado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao enviar e-mail");
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
          Recuperar senha
        </h1>

        {enviado ? (
          <p className="mt-6 text-center text-sm text-white/60">
            Se esse e-mail estiver cadastrado, você vai receber um link para redefinir sua
            senha.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="brand-input w-full rounded-lg px-4 py-3 text-sm"
            />
            {erro && <p className="text-sm text-red-400">{erro}</p>}
            <button
              type="submit"
              disabled={carregando}
              className="gold-button w-full rounded-lg py-3 text-sm font-medium tracking-wide disabled:opacity-50"
            >
              {carregando ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
