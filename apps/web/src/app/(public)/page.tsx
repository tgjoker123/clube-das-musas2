import Link from "next/link";
import { Button, Card, CardDescription, CardTitle, ThemeToggle } from "@musas/ui";

const pillars = [
  {
    title: "Gestão profissional",
    description:
      "Alunas, fichas e evolução em um só lugar — menos tempo em planilhas, mais tempo com quem importa.",
  },
  {
    title: "Gamificação com propósito",
    description:
      "Pontos, níveis e conquistas que celebram constância e esforço — nunca aparência ou comparação vazia.",
  },
  {
    title: "Uma experiência de clube",
    description:
      "Suas alunas não usam mais um aplicativo — elas fazem parte de algo. Elegância em cada detalhe.",
  },
];

const profiles = [
  {
    label: "Professora",
    description: "Gerencie sua carteira de alunas com uma ferramenta à altura do seu trabalho.",
    href: "/cadastro?perfil=professor",
  },
  {
    label: "Aluna",
    description: "Acesso mediante convite do seu professor — peça o link de ativação a ele(a).",
    href: "/cadastro",
  },
  {
    label: "Parceiro",
    description: "Leve produtos e serviços a um público qualificado e engajado.",
    href: "/cadastro?perfil=parceiro",
  },
];

export default function LandingPage() {
  return (
    <main className="bg-bg-base text-fg-primary min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-h3 tracking-wide">Clube das Musas</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-28">
        <span className="text-small text-accent-gold font-sans uppercase tracking-[0.2em]">
          Bem-vinda ao clube
        </span>
        <h1 className="font-display text-display leading-tight">
          Uma plataforma premium para o seu trabalho e a jornada das suas alunas
        </h1>
        <p className="text-body text-fg-secondary max-w-2xl">
          Gestão profissional, gamificação e uma experiência exclusiva — para professores que querem
          ir além da planilha e alunas que merecem mais do que um aplicativo genérico.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/cadastro?perfil=professor">
            <Button variant="primary">Sou professora ou professor</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Já sou do clube</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <Card key={pillar.title}>
            <CardTitle>{pillar.title}</CardTitle>
            <CardDescription>{pillar.description}</CardDescription>
          </Card>
        ))}
      </section>

      <section className="border-border bg-bg-elevated border-t">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-h1 mb-2">Qual é o seu lugar no clube?</h2>
          <p className="text-body text-fg-secondary mb-10 max-w-xl">
            Cada perfil tem uma experiência pensada especialmente para ele.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {profiles.map((profile) => (
              <Card key={profile.label} className="flex flex-col justify-between gap-6">
                <div>
                  <CardTitle>{profile.label}</CardTitle>
                  <CardDescription className="mt-2">{profile.description}</CardDescription>
                </div>
                <Link href={profile.href}>
                  <Button variant="secondary" className="w-full">
                    Continuar
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-small text-fg-secondary mx-auto max-w-6xl px-6 py-10 text-center">
        Clube das Musas — plataforma premium de acompanhamento e gamificação.
      </footer>
    </main>
  );
}
