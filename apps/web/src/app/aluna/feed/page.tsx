"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Comentario {
  id: string;
  texto: string;
  createdAt: string;
  aluna: { id: string; nome: string };
}

interface Post {
  id: string;
  data: string;
  descricao: string | null;
  fotoUrl: string | null;
  cargaUsada: string | null;
  repsUsadas: number | null;
  exercicio: { nome: string; grupoMuscular: string };
  aluna: { id: string; nome: string };
  totalCurtidas: number;
  curtidoPorMim: boolean;
  comentarios: Comentario[];
}

function tempoRelativo(dataIso: string): string {
  const diffMs = Date.now() - new Date(dataIso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `há ${horas}h`;
  const dias = Math.floor(horas / 24);
  return `há ${dias}d`;
}

function PostCard({ post, onChange }: { post: Post; onChange: () => void }) {
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  async function curtir() {
    await api.post(`/checkins/${post.id}/curtir`);
    onChange();
  }

  async function enviarComentario(e: React.FormEvent) {
    e.preventDefault();
    if (!comentario.trim()) return;
    setEnviando(true);
    try {
      await api.post(`/checkins/${post.id}/comentarios`, { texto: comentario });
      setComentario("");
      setMostrarComentarios(true);
      onChange();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <li className="app-card animate-fade-in-up space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-neutral-900">{post.aluna.nome}</p>
          <p className="text-xs text-neutral-400">{tempoRelativo(post.data)}</p>
        </div>
        <span className="rounded-full bg-[color:var(--color-gold)]/10 px-3 py-1 text-xs font-medium text-[color:var(--color-gold-dark)]">
          {post.exercicio.nome}
        </span>
      </div>

      {post.fotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.fotoUrl} alt={post.exercicio.nome} className="max-h-80 w-full rounded-xl object-cover" />
      )}

      {(post.cargaUsada || post.repsUsadas) && (
        <p className="text-sm text-neutral-500">
          {post.cargaUsada ? `${post.cargaUsada}kg` : ""}
          {post.cargaUsada && post.repsUsadas ? " × " : ""}
          {post.repsUsadas ? `${post.repsUsadas} reps` : ""}
        </p>
      )}

      {post.descricao && <p className="text-sm text-neutral-700">{post.descricao}</p>}

      <div className="flex items-center gap-4 border-t border-neutral-100 pt-3 text-sm">
        <button
          onClick={curtir}
          className={`flex items-center gap-1.5 font-medium transition-colors ${
            post.curtidoPorMim ? "text-[color:var(--color-gold-dark)]" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          {post.curtidoPorMim ? "🔥" : "🤍"} {post.totalCurtidas > 0 ? post.totalCurtidas : ""}
        </button>
        <button
          onClick={() => setMostrarComentarios((v) => !v)}
          className="font-medium text-neutral-500 hover:text-neutral-700"
        >
          💬 {post.comentarios.length > 0 ? post.comentarios.length : "Comentar"}
        </button>
      </div>

      {mostrarComentarios && (
        <div className="space-y-2 border-t border-neutral-100 pt-3">
          {post.comentarios.map((c) => (
            <p key={c.id} className="text-sm text-neutral-700">
              <span className="font-medium text-neutral-900">{c.aluna.nome}:</span> {c.texto}
            </p>
          ))}
          <form onSubmit={enviarComentario} className="flex gap-2">
            <input
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escreva um comentário..."
              className="app-input flex-1 text-sm"
            />
            <button
              type="submit"
              disabled={enviando}
              className="gold-button rounded-full px-4 py-2 text-xs font-medium disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </li>
  );
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  function carregar() {
    api.get<Post[]>("/checkins/feed").then(setPosts);
  }

  useEffect(carregar, []);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-semibold text-neutral-900">Feed</h1>
        <p className="text-sm text-neutral-500">Veja os treinos das suas colegas e torça por elas.</p>
      </div>

      {posts === null && <p className="text-neutral-500">Carregando...</p>}
      {posts?.length === 0 && (
        <p className="text-neutral-500">Nenhum treino registrado pelo grupo ainda.</p>
      )}

      <ul className="space-y-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} onChange={carregar} />
        ))}
      </ul>
    </div>
  );
}
