"use client";

import { useState } from "react";
import Link from "next/link";
import {
  afirmacionesDe,
  resumenFundamento,
  BIBLIOGRAFIA,
  TIPO_AFIRMACION_INFO,
  type Afirmacion,
} from "@/lib/fundamentos";

/** Color por tipo de afirmacion (reutiliza la paleta del sitio). */
const COLOR: Record<string, string> = {
  teorema: "#5fae7f",
  calculo: "#5b8fd9",
  tradicion: "#e5c558",
  reconstruccion: "#cf9b5b",
  analogia: "#9c6bc9",
};

function CitasClaves({ af, color }: { af: Afirmacion; color: string }) {
  if (af.claves.length === 0) return null;
  return (
    <>
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
    </>
  );
}

function TarjetaAfirmacion({ af }: { af: Afirmacion }) {
  const info = TIPO_AFIRMACION_INFO[af.tipo];
  const color = COLOR[af.tipo];
  const verificable = af.tipo === "teorema" || af.tipo === "calculo";
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-850/40 p-3">
      <div className="mb-1 flex items-center gap-2">
        <span aria-hidden="true" style={{ color }}>
          {info.marca}
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-wider"
          style={{ color }}
        >
          {info.nombre}
        </span>
      </div>
      <p className="text-[13px] leading-relaxed text-sand-300">{af.texto}</p>
      <div className="mt-1.5 font-mono text-[11px] text-sand-500">
        {verificable && af.respaldo && (
          <span>
            verificado en scripts/experimentos.py · <code>{af.respaldo}</code>
          </span>
        )}
        {af.claves.length > 0 && (
          <span>
            {verificable ? " · fuente: " : "fuente: "}
            <CitasClaves af={af} color={color} />
          </span>
        )}
      </div>
      {af.nota && (
        <p className="mt-1.5 text-[11px] italic leading-relaxed text-sand-500">{af.nota}</p>
      )}
    </div>
  );
}

/** Bloque de fundamento al pie de cada experimento. Lee AFIRMACIONES[slug]. */
export function Fundamento({ slug }: { slug: string }) {
  const afs = afirmacionesDe(slug);
  const [open, setOpen] = useState(false);
  if (afs.length === 0) return null;
  const panelId = `fundamento-${slug}`;
  return (
    <section className="mt-12 border-t border-ink-700/70 pt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 text-left outline-none focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinnabar-bright"
      >
        <span
          aria-hidden="true"
          className="text-sm text-sand-500 transition-transform duration-200 motion-reduce:transition-none"
          style={{ transform: open ? "rotate(90deg)" : "none" }}
        >
          ▸
        </span>
        <span className="font-mono text-[12px] leading-relaxed text-sand-400">
          {resumenFundamento(slug)}
        </span>
      </button>

      <div id={panelId} hidden={!open} className="mt-4 space-y-3">
        {afs.map((af, i) => (
          <TarjetaAfirmacion key={i} af={af} />
        ))}
        <p className="pt-1 font-mono text-[11px] text-sand-500">
          Los tipos de afirmación y la bibliografía completa (APA) están en{" "}
          <Link
            href="/fundamentos"
            className="underline decoration-dotted underline-offset-2 text-sand-400 hover:text-sand-200"
          >
            Fundamentos
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
