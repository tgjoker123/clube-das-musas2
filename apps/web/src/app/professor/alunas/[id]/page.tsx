"use client";

import { use, useEffect, useState } from "react";
import { api, uploadFile } from "@/lib/api";
import { BackLink } from "@/components/back-link";

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

interface AlunaDetalhe {
  id: string;
  nome: string;
  email: string;
  dataNascimento: string;
  status: "ativa" | "suspensa" | "inadimplente";
  observacoes: string | null;
  anamneses: Anamnese[];
  exames: Exame[];
  evolucoes: Evolucao[];
}

export default function AlunaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [aluna, setAluna] = useState<AlunaDetalhe | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [status, setStatus] = useState<AlunaDetalhe["status"]>("ativa");
  const [observacoes, setObservacoes] = useState("");

  const [anamneseTexto, setAnamneseTexto] = useState("");
  const [exameArquivo, setExameArquivo] = useState<File | null>(null);
  const [exameData, setExameData] = useState("");
  const [evolucaoPeso, setEvolucaoPeso] = useState("");
  const [evolucaoFoto, setEvolucaoFoto] = useState<File | null>(null);

  function carregar() {
    api
      .get<AlunaDetalhe>(`/students/${id}`)
      .then((data) => {
        setAluna(data);
        setNome(data.nome);
        setDataNascimento(data.dataNascimento.slice(0, 10));
        setStatus(data.status);
        setObservacoes(data.observacoes ?? "");
      })
      .catch((err) => setErro(err instanceof Error ? err.message : "Erro ao carregar"));
  }

  useEffect(carregar, [id]);

  async function salvarDadosBasicos() {
    try {
      await api.patch(`/students/${id}`, { nome, dataNascimento, status, observacoes });
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar");
    }
  }

  async function salvarAnamnese(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post(`/students/${id}/anamnese`, { respostas: { texto: anamneseTexto } });
      setAnamneseTexto("");
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar anamnese");
    }
  }

  async function salvarExame(e: React.FormEvent) {
    e.preventDefault();
    if (!exameArquivo || !exameData) return;
    try {
      const arquivoUrl = await uploadFile("exames", exameArquivo);
      await api.post(`/students/${id}/exames`, { arquivoUrl, dataExame: exameData });
      setExameArquivo(null);
      setExameData("");
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar exame");
    }
  }

  async function salvarEvolucao(e: React.FormEvent) {
    e.preventDefault();
    try {
      const fotoUrl = evolucaoFoto ? await uploadFile("evolucao-fotos", evolucaoFoto) : undefined;
      await api.post(`/students/${id}/evolucao`, {
        peso: evolucaoPeso ? Number(evolucaoPeso) : undefined,
        fotoUrl,
      });
      setEvolucaoPeso("");
      setEvolucaoFoto(null);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao registrar evolução");
    }
  }

  if (erro) return <p className="text-red-600">{erro}</p>;
  if (!aluna) return <p>Carregando...</p>;

  return (
    <div className="max-w-2xl space-y-8">
      <BackLink href="/professor/alunas" label="Voltar para alunas" />
      <div>
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">{aluna.nome}</h1>
        <p className="text-sm text-neutral-500">{aluna.email}</p>
      </div>

      <section className="app-card animate-fade-in-up stagger-1 space-y-3">
        <h2 className="app-h2">Dados do cadastro</h2>
        <label className="block text-sm text-neutral-600">
          Nome
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="app-input mt-1"
          />
        </label>
        <label className="block text-sm text-neutral-600">
          Data de nascimento
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="app-input mt-1"
          />
        </label>
        <label className="block text-sm text-neutral-600">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AlunaDetalhe["status"])}
            className="app-input mt-1"
          >
            <option value="ativa">Ativa</option>
            <option value="suspensa">Suspensa</option>
            <option value="inadimplente">Inadimplente</option>
          </select>
        </label>
        <label className="block text-sm text-neutral-600">
          Observações
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="app-input mt-1"
          />
        </label>
        <button onClick={salvarDadosBasicos} className="gold-button rounded-full px-5 py-2 text-sm font-medium">
          Salvar
        </button>
      </section>

      <section className="app-card animate-fade-in-up stagger-2 space-y-3">
        <h2 className="app-h2">Anamnese</h2>
        <ul className="space-y-2 text-sm">
          {aluna.anamneses.map((a) => (
            <li key={a.id} className="rounded-lg bg-neutral-50 p-3">
              <p className="text-xs text-neutral-500">
                {new Date(a.data).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-neutral-700">{a.respostasJson.texto}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={salvarAnamnese} className="space-y-2">
          <textarea
            placeholder="Respostas da anamnese (saúde, objetivos, restrições...)"
            value={anamneseTexto}
            onChange={(e) => setAnamneseTexto(e.target.value)}
            className="app-input"
          />
          <button type="submit" className="app-link-gold text-sm font-medium">
            Adicionar anamnese
          </button>
        </form>
      </section>

      <section className="app-card animate-fade-in-up stagger-3 space-y-3">
        <h2 className="app-h2">Exames de sangue</h2>
        <ul className="space-y-1 text-sm text-neutral-700">
          {aluna.exames.map((ex) => (
            <li key={ex.id}>
              {new Date(ex.dataExame).toLocaleDateString("pt-BR")} — {ex.arquivoUrl}
            </li>
          ))}
        </ul>
        <form onSubmit={salvarExame} className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setExameArquivo(e.target.files?.[0] ?? null)}
            className="max-w-full text-sm"
          />
          <input
            type="date"
            value={exameData}
            onChange={(e) => setExameData(e.target.value)}
            className="app-input w-auto"
          />
          <button type="submit" className="app-link-gold text-sm font-medium">
            Enviar exame
          </button>
        </form>
      </section>

      <section className="app-card animate-fade-in-up stagger-4 space-y-3">
        <h2 className="app-h2">Evolução física</h2>
        <ul className="space-y-1 text-sm text-neutral-700">
          {aluna.evolucoes.map((ev) => (
            <li key={ev.id}>
              {new Date(ev.data).toLocaleDateString("pt-BR")}
              {ev.peso ? ` — ${ev.peso} kg` : ""}
              {ev.fotoUrl ? ` — foto: ${ev.fotoUrl}` : ""}
            </li>
          ))}
        </ul>
        <form onSubmit={salvarEvolucao} className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="Peso (kg)"
            value={evolucaoPeso}
            onChange={(e) => setEvolucaoPeso(e.target.value)}
            className="app-input w-32"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEvolucaoFoto(e.target.files?.[0] ?? null)}
            className="max-w-full text-sm"
          />
          <button type="submit" className="app-link-gold text-sm font-medium">
            Registrar
          </button>
        </form>
      </section>
    </div>
  );
}
