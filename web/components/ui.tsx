import Link from "next/link";
import type { ReactNode } from "react";
import { PistaDeUso } from "./PistaDeUso";

/** Encabezado estándar de cada página de experimento. */
export function ExperimentHeader({
  kicker,
  titulo,
  subtitulo,
  accent = "#b5442d",
}: {
  kicker: string;
  titulo: string;
  subtitulo?: string;
  accent?: string;
}) {
  return (
    <header className="mb-8 animate-fade-up">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-sand-500 transition-colors hover:text-sand-300"
      >
        ← todos los experimentos
      </Link>
      <div
        className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]"
        style={{ color: accent }}
      >
        {kicker}
      </div>
      <h1 className="text-3xl font-normal leading-tight text-sand-100 sm:text-4xl">
        {titulo}
      </h1>
      {subtitulo && (
        <p className="mt-2 font-mono text-sm text-sand-400">{subtitulo}</p>
      )}
      <PistaDeUso />
    </header>
  );
}

/** Panel/tarjeta con el borde y fondo del sistema. */
export function Panel({
  children,
  className = "",
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-ink-700 bg-ink-850/50 p-4 sm:p-5 ${className}`}
      style={accent ? { borderColor: accent + "55" } : undefined}
    >
      {children}
    </div>
  );
}

/** Título de sección pequeño en mayúsculas espaciadas. */
export function SectionLabel({
  children,
  accent,
}: {
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="font-mono text-[11px] uppercase tracking-[0.22em] text-sand-500"
      style={accent ? { color: accent } : undefined}
    >
      {children}
    </div>
  );
}

/** Nota / bloque de prosa explicativa. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-sand-300 [&_b]:font-semibold [&_b]:text-sand-200 [&_code]:rounded [&_code]:bg-ink-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-sand-200">
      {children}
    </div>
  );
}

/** Ficha de estadística: valor grande + etiqueta. */
export function Stat({
  valor,
  etiqueta,
  accent,
}: {
  valor: ReactNode;
  etiqueta: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-850/40 px-4 py-3">
      <div
        className="font-mono text-2xl leading-none text-sand-100"
        style={accent ? { color: accent } : undefined}
      >
        {valor}
      </div>
      <div className="mt-1.5 text-xs text-sand-500">{etiqueta}</div>
    </div>
  );
}
