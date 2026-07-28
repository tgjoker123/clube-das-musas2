export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-6 text-center text-sm text-neutral-400">
      {message}
    </div>
  );
}

export function IconBadge({
  children,
  size = 10,
}: {
  children: React.ReactNode;
  size?: 8 | 10 | 11;
}) {
  const sizeClass = { 8: "h-8 w-8", 10: "h-10 w-10", 11: "h-11 w-11" }[size];
  return (
    <span
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full border border-[color:var(--color-gold)]/30 bg-[color:var(--color-gold)]/10`}
    >
      {children}
    </span>
  );
}

export function Icon({
  path,
  size = 18,
}: {
  path: React.ReactNode;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-gold-dark)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
}

export const ICONS = {
  treino: <path d="M6.5 6.5 17.5 17.5M4 4l3 3M20 20l-3-3M8.5 4 4 8.5M15.5 20 20 15.5M2 6l4-4M18 22l4-4" />,
  checklist: (
    <>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  exame: (
    <>
      <path d="M9 2v6l-5 9a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9V2" />
      <path d="M9 2h6" />
      <path d="M6.5 15h11" />
    </>
  ),
  evolucao: <path d="M4 19V9m6.5 10V5m6.5 14v-7" />,
  nota: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </>
  ),
  pessoa: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </>
  ),
  estrela: (
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z" />
  ),
  loja: (
    <>
      <path d="M4 8l1-4h14l1 4" />
      <path d="M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M8 12a2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </>
  ),
  moeda: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 15.2c.4.7 1.3 1.2 2.5 1.2 1.5 0 2.7-.8 2.7-2 0-1.1-1-1.6-2.7-2-1.7-.4-2.7-.9-2.7-2 0-1.2 1.2-2 2.7-2 1.2 0 2.1.5 2.5 1.2M12 7.5v9" />
    </>
  ),
} as const;
