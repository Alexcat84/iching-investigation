"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { afirmacionesDe, BIBLIOGRAFIA, TIPO_AFIRMACION_INFO } from "@/lib/fundamentos";

const COLOR: Record<string, string> = {
  teorema: "#5fae7f",
  calculo: "#5b8fd9",
  tradicion: "#e5c558",
  reconstruccion: "#cf9b5b",
  analogia: "#9c6bc9",
};

/**
 * Marcador discreto junto a una afirmacion clave del copy. Abre un popover con la
 * afirmacion tipada y su respaldo, leida de web/lib/fundamentos.ts (no duplica texto).
 * Operable con teclado (Enter/Espacio para abrir, Escape para cerrar) y con toque.
 */
export function NotaAlMargen({ slug, indice }: { slug: string; indice: number }) {
  const af = afirmacionesDe(slug)[indice];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const fuera = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [open]);

  if (!af) return null;
  const info = TIPO_AFIRMACION_INFO[af.tipo];
  const color = COLOR[af.tipo];
  const verificable = af.tipo === "teorema" || af.tipo === "calculo";

  return (
    <span ref={ref} className="relative inline-block align-super">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Fundamento de esta afirmación: ${info.nombre}`}
        className="mx-0.5 inline-flex h-[15px] w-[15px] items-center justify-center rounded-full border text-[9px] leading-none outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
        style={{ borderColor: color, color }}
      >
        {info.marca}
      </button>
      {open && (
        <span
          role="dialog"
          aria-label={`Fundamento: ${info.nombre}`}
          className="absolute left-1/2 top-full z-30 mt-2 block w-64 -translate-x-1/2 rounded-lg border border-ink-600 bg-ink-900 p-3 text-left align-baseline shadow-xl"
        >
          <span className="mb-1 flex items-center gap-2">
            <span aria-hidden="true" style={{ color }}>
              {info.marca}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color }}>
              {info.nombre}
            </span>
          </span>
          <span className="block text-[12px] leading-relaxed text-sand-300">{af.texto}</span>
          <span className="mt-1.5 block font-mono text-[10px] text-sand-500">
            {verificable && af.respaldo && (
              <span>
                verificado en la suite · <code>{af.respaldo}</code>
              </span>
            )}
            {af.claves.length > 0 && (
              <span>
                {verificable ? " · " : ""}
                {af.claves.map((k, i) => (
                  <span key={k}>
                    {i > 0 ? "; " : ""}
                    <Link
                      href={`/fundamentos#${k}`}
                      className="underline decoration-dotted underline-offset-2"
                      style={{ color }}
                    >
                      {BIBLIOGRAFIA[k].citaCorta}
                    </Link>
                  </span>
                ))}
              </span>
            )}
          </span>
        </span>
      )}
    </span>
  );
}
