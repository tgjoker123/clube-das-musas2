/**
 * Placeholder temporário de tela — usado apenas para materializar o
 * esqueleto de rotas definido em docs/11_MAPA_DE_TELAS_E_FLUXOS.md
 * durante a Fase 0. Cada tela real substitui este componente quando a
 * funcionalidade correspondente for implementada (ver docs/06_MVP.md).
 */
export function PlaceholderScreen({ title, area }: { title: string; area: string }) {
  return (
    <main className="bg-bg-base text-fg-primary flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <span className="text-small text-fg-secondary font-sans uppercase tracking-wide">{area}</span>
      <h1 className="font-display text-h1">{title}</h1>
      <p className="text-body text-fg-secondary">
        Esta tela ainda não foi implementada — ver docs/06_MVP.md.
      </p>
    </main>
  );
}
