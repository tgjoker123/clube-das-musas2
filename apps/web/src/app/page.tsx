import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const PILARES = [
  {
    titulo: "Metodologia Feminina",
    descricao:
      "Protocolos focados em definição, postura e hipertrofia nas regiões de maior interesse (glúteos, pernas e abdômen).",
  },
  {
    titulo: "Comunidade Exclusiva",
    descricao:
      "Conecte-se com mulheres alinhadas ao mesmo objetivo. Troca de experiências, motivação e suporte constante.",
  },
  {
    titulo: "Experiência Presencial",
    descricao: "Acesso garantido a encontros VIPs e ao consagrado evento MUSAS Day.",
  },
];

function LogoLockup() {
  return (
    <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
      <BrandMark size={34} />
      <span className="leading-none">
        <span className="font-brand block text-[0.55rem] tracking-[0.32em] text-white/65 sm:text-[0.6rem]">
          CLUBE DAS
        </span>
        <span className="font-brand gold-heading mt-0.5 block text-base tracking-[0.14em] sm:text-lg">
          MUSAS
        </span>
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="landing-surface min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b border-[color:var(--color-gold)]/15 bg-[#0a0908]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <LogoLockup />
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/login"
              className="text-xs tracking-wide text-white/60 transition-colors hover:text-[color:var(--color-gold-light)] sm:text-sm"
            >
              Entrar
            </Link>
            <Link
              href="/quero-fazer-parte"
              className="landing-cta rounded-full px-4 py-2 text-[0.65rem] font-semibold tracking-[0.12em] whitespace-nowrap sm:px-6 sm:py-2.5 sm:text-xs"
            >
              QUERO SER MUSA
            </Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center px-5 py-20 sm:px-6 sm:py-28">
        <div className="animate-fade-in-up mx-auto max-w-3xl text-center">
          <h1 className="font-brand text-3xl leading-[1.15] font-semibold tracking-wide text-white uppercase sm:text-5xl lg:text-6xl">
            Sua transformação no
          </h1>
          <p className="gold-heading mt-2 text-3xl leading-[1.15] font-bold tracking-tight uppercase sm:mt-3 sm:text-5xl lg:text-6xl">
            Clube das Musas
          </p>
          <p className="animate-fade-in-up stagger-1 mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:mt-8 sm:text-base">
            Especialista em treinamento feminino. Conquiste sua melhor versão através do método
            exclusivo desenvolvido por Ruan Mello.
          </p>
          <div className="animate-fade-in-up stagger-2 mt-9 sm:mt-11">
            <Link
              href="/quero-fazer-parte"
              className="landing-cta inline-block rounded-full px-8 py-3.5 text-xs font-semibold tracking-[0.14em] sm:px-10 sm:py-4 sm:text-sm"
            >
              QUERO FAZER PARTE DO CLUBE
            </Link>
          </div>
        </div>
      </section>

      <div className="landing-divider mx-auto max-w-6xl" />

      <section className="px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold tracking-wide uppercase sm:text-4xl">
            <span className="font-brand text-white">O ecossistema </span>
            <span className="gold-heading font-brand">das Musas</span>
          </h2>

          <ul className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-3">
            {PILARES.map((pilar, i) => (
              <li
                key={pilar.titulo}
                className={`landing-card animate-fade-in-up stagger-${i + 1} p-6 sm:p-7`}
              >
                <h3 className="font-brand text-lg tracking-wide text-[color:var(--color-gold-light)] sm:text-xl">
                  {pilar.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{pilar.descricao}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold sm:text-4xl">
            <span className="font-brand block text-white">Seu treinador:</span>
            <span className="gold-heading mt-1 block font-bold tracking-tight">Ruan Mello</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/60 sm:text-base">
            Personal Trainer focado em extrair a melhor estética e performance do corpo feminino.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            Mais do que planilhas de treino, o Clube das Musas entrega acompanhamento estratégico,
            mentalidade e um ambiente desenhado para acelerar seus resultados.
          </p>
        </div>
      </section>

      <div className="landing-divider" />

      <section className="px-5 py-20 text-center sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-4xl">
            <span className="font-brand text-white">Pronta para ser a </span>
            <span className="gold-heading font-bold tracking-tight">Próxima Musa?</span>
          </h2>
          <p className="mt-5 text-sm text-white/55 sm:text-base">
            As vagas para o acompanhamento individualizado são limitadas.
          </p>
          <div className="mt-9 sm:mt-11">
            <Link
              href="/quero-fazer-parte"
              className="landing-cta inline-block rounded-full px-8 py-3.5 text-xs font-semibold tracking-[0.14em] sm:px-10 sm:py-4 sm:text-sm"
            >
              GARANTIR MINHA VAGA AGORA
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[color:var(--color-gold)]/15 px-5 py-8 text-center text-xs text-white/45 sm:px-6">
        <p>© Clube das Musas - Ruan Mello | Todos os direitos reservados.</p>
        <p className="mt-1.5">
          Instagram:{" "}
          <a
            href="https://instagram.com/_ruanmello"
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--color-gold-light)] hover:underline"
          >
            @_ruanmello
          </a>
        </p>
        <p className="mt-4">
          <Link href="/login" className="text-white/40 transition-colors hover:text-white/70">
            Já é aluna? Entrar na plataforma
          </Link>
        </p>
      </footer>
    </main>
  );
}
