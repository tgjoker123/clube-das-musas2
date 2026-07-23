import { Badge, Button, Card, CardDescription, CardTitle } from "@musas/ui";

/**
 * Placeholder temporário de tela — usado apenas para materializar o
 * esqueleto de rotas definido em docs/11_MAPA_DE_TELAS_E_FLUXOS.md
 * durante a Fase 0. Cada tela real substitui este componente quando a
 * funcionalidade correspondente for implementada (ver docs/06_MVP.md).
 *
 * Também serve como verificação de integração: confirma que os
 * componentes e tokens de @musas/ui resolvem corretamente quando
 * consumidos por este app.
 */
export function PlaceholderScreen({ title, area }: { title: string; area: string }) {
  return (
    <main className="bg-bg-base text-fg-primary flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Badge variant="info">{area}</Badge>
      <h1 className="font-display text-h1">{title}</h1>
      <Card className="max-w-sm">
        <CardTitle>Fase 0 — Fundação Técnica</CardTitle>
        <CardDescription>
          Esta tela ainda não foi implementada — ver docs/06_MVP.md.
        </CardDescription>
      </Card>
      <Button variant="secondary" disabled>
        Ação indisponível nesta fase
      </Button>
    </main>
  );
}
