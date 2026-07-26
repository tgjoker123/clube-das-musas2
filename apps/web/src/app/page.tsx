import Image from "next/image";
import Link from "next/link";

const RECURSOS = [
  {
    titulo: "Ficha de treino digital",
    descricao: "Exercícios com vídeo demonstrativo, séries, repetições e carga, sempre à mão.",
    icone: (
      <path d="M6.5 6.5 17.5 17.5M4 4l3 3M20 20l-3-3M8.5 4 4 8.5M15.5 20 20 15.5M2 6l4-4M18 22l4-4" />
    ),
  },
  {
    titulo: "Check-in com foto",
    descricao:
      "Cada exercício só é concluído com uma foto de comprovação — acompanhamento real, não só marcado.",
    icone: (
      <>
        <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <circle cx="12" cy="13" r="3.2" />
      </>
    ),
  },
  {
    titulo: "Evolução acompanhada",
    descricao: "Anamnese, exames e evolução física centralizados no perfil de cada aluna.",
    icone: <path d="M4 19V9m6.5 10V5m6.5 14v-7" />,
  },
];

export default function HomePage() {
  return (
    <main className="brand-surface relative flex min-h-screen flex-col items-center overflow-hidden px-5 py-16 sm:px-6 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(201,162,39,0.5) 0, transparent 0), radial-gradient(1px 1px at 70% 60%, rgba(201,162,39,0.4) 0, transparent 0), radial-gradient(1px 1px at 40% 80%, rgba(201,162,39,0.35) 0, transparent 0), radial-gradient(1px 1px at 85% 20%, rgba(201,162,39,0.4) 0, transparent 0)",
          backgroundSize: "600px 600px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <Image
          src="/brand/logo-preto-dourado.png"
          alt="Clube das Musas"
          width={120}
          height={120}
          priority
          className="animate-float-glow h-24 w-24 rounded-full sm:h-28 sm:w-28"
        />
        <p className="animate-fade-in-up mt-6 font-brand text-xs tracking-[0.4em] text-[color:var(--color-gold-light)] uppercase">
          Clube das
        </p>
        <h1 className="animate-fade-in-up stagger-1 font-brand shimmer-text text-5xl font-semibold sm:text-8xl">
          Musas
        </h1>
        <p className="animate-fade-in-up stagger-2 mt-5 max-w-lg text-sm text-white/60 sm:mt-6 sm:text-base">
          A plataforma de treino e acompanhamento para personal trainers elevarem a
          experiência de suas alunas — com gamificação, evolução real e um toque de
          exclusividade.
        </p>

        <div className="animate-fade-in-up stagger-3 mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href="/login"
            className="gold-button rounded-full px-8 py-3 text-center text-sm font-medium tracking-wide"
          >
            Entrar
          </Link>
          <Link
            href="/quero-fazer-parte"
            className="gold-outline-button rounded-full px-8 py-3 text-center text-sm font-medium tracking-wide"
          >
            Quero fazer parte
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-16 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-[color:var(--color-gold)]/40 to-transparent sm:mt-24" />

      <div className="relative z-10 mt-10 grid w-full max-w-4xl gap-4 sm:mt-16 sm:grid-cols-3">
        {RECURSOS.map((recurso, i) => (
          <div
            key={recurso.titulo}
            className={`brand-card group animate-fade-in-up rounded-2xl p-6 text-left transition-transform duration-300 hover:-translate-y-1 stagger-${i + 2}`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-gold)]/30 bg-[color:var(--color-gold)]/10 transition-colors group-hover:bg-[color:var(--color-gold)]/20">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-gold-light)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {recurso.icone}
              </svg>
            </span>
            <p className="font-brand mt-4 text-lg text-[color:var(--color-gold-light)]">
              {recurso.titulo}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{recurso.descricao}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
