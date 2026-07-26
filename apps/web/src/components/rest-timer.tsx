"use client";

import { useEffect, useRef, useState } from "react";

const PRESETS = [30, 60, 90, 120];

function tocarBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // ambiente sem suporte a Web Audio — ignora silenciosamente
  }
}

export function RestTimer() {
  const [duracao, setDuracao] = useState(60);
  const [restante, setRestante] = useState<number | null>(null);
  const [pausado, setPausado] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (restante === null || pausado) return;
    if (restante <= 0) {
      tocarBeep();
      setRestante(null);
      return;
    }
    intervalRef.current = setTimeout(() => setRestante((r) => (r ?? 1) - 1), 1000);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [restante, pausado]);

  function iniciar(segundos: number) {
    setDuracao(segundos);
    setRestante(segundos);
    setPausado(false);
  }

  const emAndamento = restante !== null;
  const progresso = emAndamento ? ((duracao - restante) / duracao) * 100 : 0;

  return (
    <div className="app-card space-y-3">
      <h2 className="app-h2">Cronômetro de descanso</h2>

      {emAndamento ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-neutral-100">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--color-gold) ${progresso}%, transparent ${progresso}%)`,
                mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))",
              }}
            />
            <span className="font-brand text-3xl font-semibold text-neutral-900">
              {restante}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPausado((p) => !p)}
              className="gold-outline-button rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium text-neutral-700"
            >
              {pausado ? "Retomar" : "Pausar"}
            </button>
            <button
              onClick={() => setRestante(null)}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-neutral-500 hover:text-red-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => iniciar(s)}
              className="gold-button rounded-full px-4 py-2 text-sm font-medium"
            >
              {s}s
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
