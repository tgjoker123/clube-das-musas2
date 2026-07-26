"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

interface Anamnese {
  id: string;
  respostasJson: { texto?: string };
  data: string;
}

interface Exame {
  id: string;
  arquivoUrl: string;
  dataExame: string;
}

interface Evolucao {
  id: string;
  fotoUrl: string | null;
  peso: string | null;
  medidasJson: Record<string, unknown> | null;
  data: string;
}

interface PerfilAluna {
  nome: string;
  email: string;
  dataNascimento: string;
  status: "ativa" | "suspensa" | "inadimplente";
  anamneses: Anamnese[];
  exames: Exame[];
  evolucoes: Evolucao[];
}

export default function PerfilAlunaPage() {
  const [perfil, setPerfil] = useState<PerfilAluna | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState<string | null>(null);
  const [senhaAlterada, setSenhaAlterada] = useState(false);

  useEffect(() => {
    api
      .get<PerfilAluna>("/students/me")
      .then(setPerfil)
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }, []);

  async function trocarSenha(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha(null);
    setSenhaAlterada(false);
    if (novaSenha !== confirmarSenha) {
      setErroSenha("As senhas não coincidem.");
      return;
    }
    setSalvandoSenha(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) throw error;
      setNovaSenha("");
      setConfirmarSenha("");
      setSenhaAlterada(true);
    } catch (err) {
      setErroSenha(err instanceof Error ? err.message : "Erro ao trocar senha");
    } finally {
      setSalvandoSenha(false);
    }
  }

  if (erro) return <p className="text-red-600">{erro}</p>;
  if (!perfil) return <p>Carregando...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">{perfil.nome}</h1>
        <p className="text-sm text-neutral-500">{perfil.email}</p>
      </div>

      <section className="app-card animate-fade-in-up space-y-3">
        <h2 className="app-h2">Trocar senha</h2>
        <form onSubmit={trocarSenha} className="flex flex-wrap items-end gap-2">
          <label className="text-sm text-neutral-600">
            Nova senha
            <input
              type="password"
              required
              minLength={6}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="app-input mt-1"
            />
          </label>
          <label className="text-sm text-neutral-600">
            Confirmar senha
            <input
              type="password"
              required
              minLength={6}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="app-input mt-1"
            />
          </label>
          <button
            type="submit"
            disabled={salvandoSenha}
            className="gold-button rounded-full px-4 py-2 text-xs font-medium disabled:opacity-50"
          >
            {salvandoSenha ? "Salvando..." : "Trocar senha"}
          </button>
        </form>
        {erroSenha && <p className="text-xs text-red-600">{erroSenha}</p>}
        {senhaAlterada && <p className="text-xs text-emerald-600">Senha alterada com sucesso.</p>}
      </section>

      <section className="app-card animate-fade-in-up stagger-1 space-y-2">
        <h2 className="app-h2">Evolução física</h2>
        {perfil.evolucoes.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhum registro ainda.</p>
        ) : (
          <ul className="space-y-1 text-sm text-neutral-700">
            {perfil.evolucoes.map((ev) => (
              <li key={ev.id}>
                {new Date(ev.data).toLocaleDateString("pt-BR")}
                {ev.peso ? ` — ${ev.peso} kg` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="app-card animate-fade-in-up stagger-2 space-y-2">
        <h2 className="app-h2">Exames de sangue</h2>
        {perfil.exames.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhum exame registrado ainda.</p>
        ) : (
          <ul className="space-y-1 text-sm text-neutral-700">
            {perfil.exames.map((ex) => (
              <li key={ex.id}>{new Date(ex.dataExame).toLocaleDateString("pt-BR")}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="app-card animate-fade-in-up stagger-3 space-y-2">
        <h2 className="app-h2">Anamnese</h2>
        {perfil.anamneses.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhuma anamnese registrada ainda.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {perfil.anamneses.map((a) => (
              <li key={a.id} className="rounded-lg bg-neutral-50 p-3">
                <p className="text-xs text-neutral-500">
                  {new Date(a.data).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-neutral-700">{a.respostasJson.texto}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
