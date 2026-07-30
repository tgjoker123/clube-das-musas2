"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface ItemMenu {
  href: string;
  label: string;
}

/**
 * Menu inferior do celular. Quando os itens não cabem na largura da tela,
 * mostra uma seta piscando na borda para deixar claro que dá para arrastar
 * de lado — sem isso o menu parecia estático e itens ficavam escondidos.
 */
export function BottomNav({ itens, ativo }: { itens: ItemMenu[]; ativo: string }) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [temMaisAEsquerda, setTemMaisAEsquerda] = useState(false);
  const [temMaisADireita, setTemMaisADireita] = useState(false);

  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;

    function avaliar() {
      if (!trilho) return;
      const sobra = trilho.scrollWidth - trilho.clientWidth;
      setTemMaisAEsquerda(trilho.scrollLeft > 4);
      setTemMaisADireita(sobra > 4 && trilho.scrollLeft < sobra - 4);
    }

    avaliar();
    trilho.addEventListener("scroll", avaliar, { passive: true });
    window.addEventListener("resize", avaliar);
    return () => {
      trilho.removeEventListener("scroll", avaliar);
      window.removeEventListener("resize", avaliar);
    };
  }, [itens.length]);

  // Mantém o item da tela atual sempre visível ao abrir a página, centralizando
  // sem animação — no carregamento a barra já deve aparecer na posição certa.
  useEffect(() => {
    const trilho = trilhoRef.current;
    const item = trilho?.querySelector<HTMLElement>('[data-ativo="sim"]');
    if (!trilho || !item) return;
    const centro = item.offsetLeft - trilho.clientWidth / 2 + item.offsetWidth / 2;
    trilho.scrollTo({ left: Math.max(0, centro), behavior: "instant" });
  }, [ativo]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-200 bg-white shadow-[0_-6px_16px_rgba(0,0,0,0.12)] sm:hidden">
      <div className="relative">
        <div
          ref={trilhoRef}
          className="bottom-nav flex gap-1.5 overflow-x-auto px-3 py-2.5 text-[13px]"
          style={{
            ["--fade-inicio" as string]: temMaisAEsquerda ? "24px" : "0px",
            ["--fade-fim" as string]: temMaisADireita ? "28px" : "0px",
          }}
        >
          {itens.map((item) => {
            const estaAtivo = ativo === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-ativo={estaAtivo ? "sim" : "nao"}
                className={`shrink-0 rounded-full px-3.5 py-2 font-medium transition-colors ${
                  estaAtivo
                    ? "bg-[color:var(--color-gold)] text-black shadow-sm"
                    : "text-neutral-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {temMaisAEsquerda && (
          <span className="bottom-nav-seta left-0" aria-hidden="true">
            ‹
          </span>
        )}
        {temMaisADireita && (
          <span className="bottom-nav-seta right-0" aria-hidden="true">
            ›
          </span>
        )}
      </div>
    </div>
  );
}
