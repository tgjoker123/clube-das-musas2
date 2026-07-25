"use client";

import { useEffect, useMemo, useState } from "react";

const CONFETTI_COLORS = ["#c9a227", "#e8cd75", "#8a6d1a", "#f5f1e6", "#ffffff"];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  color: string;
  size: number;
}

function useConfetti(count: number): ConfettiPiece[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1.8 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 160,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
        size: 6 + Math.random() * 6,
      })),
    [count],
  );
}

export function Celebration({
  message,
  streak,
  onDone,
}: {
  message: string;
  streak: number;
  onDone: () => void;
}) {
  const confetti = useConfetti(36);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSaindo(true), 2200);
    const doneTimer = setTimeout(onDone, 2600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${saindo ? "celebration-overlay" : ""}`}
    >
      {confetti.map((c) => (
        <span
          key={c.id}
          className="confetti-piece rounded-sm"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size * 0.4,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            ["--drift" as string]: `${c.drift}px`,
          }}
        />
      ))}
      <div className="celebration-card brand-card mx-6 max-w-xs rounded-2xl px-8 py-7 text-center">
        <p className="font-brand text-2xl text-[color:var(--color-gold-light)]">{message}</p>
        {streak > 1 && (
          <p className="mt-3 text-sm text-white/70">
            🔥 {streak} dias seguidos treinando!
          </p>
        )}
      </div>
    </div>
  );
}
