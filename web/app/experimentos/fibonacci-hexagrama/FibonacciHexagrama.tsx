"use client";

import { useState } from "react";
import Link from "next/link";
import { hex, HEX_BY_VALUE } from "@/lib/iching";
import {
  supervivientes,
  ESCALERA,
  DESGLOSE_K,
  fib,
  lucas,
  type Regla,
} from "@/lib/fibonacci";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#5ab89a";

/** Glifo pequeño de un hexagrama (6 líneas, la 1 abajo). */
function Glifo({ bits, color }: { bits: string; color: string }) {
  const w = 26;
  const bar = 2.4;
  const gap = 2.2;
  const rows = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = (6 - k) * (gap + bar);
    if (yang) {
      rows.push(<rect key={k} x={0} y={y} width={w} height={bar} rx={0.4} fill={color} />);
    } else {
      const seg = w * 0.4;
      rows.push(
        <rect key={`${k}a`} x={0} y={y} width={seg} height={bar} rx={0.4} fill={color} />,
        <rect key={`${k}b`} x={w - seg} y={y} width={seg} height={bar} rx={0.4} fill={color} />,
      );
    }
  }
  const H = 6 * bar + 5 * gap;
  return (
    <svg viewBox={`0 0 ${w} ${H}`} width={w} height={H} aria-hidden="true">
      {rows}
    </svg>
  );
}

const REGLAS: { id: Regla; nombre: string }[] = [
  { id: "yin", nombre: "sin dos yin" },
  { id: "yang", nombre: "sin dos yang" },
  { id: "ambas", nombre: "ambas" },
];

export default function FibonacciHexagrama() {
  const [regla, setRegla] = useState<Regla>("yin");
  const [circular, setCircular] = useState(false);

  const vivos = supervivientes(regla, circular);
  const vivosSet = new Set(vivos);
  const n = vivos.length;

  // Etiqueta del conteo en vivo.
  let etiqueta: string;
  if (regla === "ambas") etiqueta = "Ji Ji y Wei Ji (alternancia perfecta)";
  else if (circular) etiqueta = `= L(6), el número de Lucas`;
  else etiqueta = `= F(8), un número de Fibonacci`;
  const jiWei = regla === "ambas" && !circular;

  return (
    <div>
      <ExperimentHeader
        kicker="斐 · conjuntos independientes de Q6"
        titulo="Fibonacci en el hexagrama"
        subtitulo="Contar sin dos yin seguidos dibuja la sucesión"
        accent={ACCENT}
      />

      {/* Descargos, arriba */}
      <div
        className="mb-6 rounded-xl border p-4"
        style={{ borderColor: ACCENT + "66", background: "rgba(90,184,154,0.06)" }}
      >
        <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: ACCENT }}>
          <span className="text-cinnabar-bright">⚠</span> Dos descargos honestos
        </div>
        <p className="text-sm leading-relaxed text-sand-300">
          <b>Es un teorema de conteo, no un código oculto.</b> La numerología que circula
          sobre Fibonacci y el I Ching (offsets elegidos a mano, la razón áurea escondida en
          el orden del Rey Wen) queda fuera por indemostrable: aquí solo hay conjuntos que se
          cuentan y resultan ser un número de Fibonacci.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-sand-300">
          <b>Hasta donde sabemos</b>, esta formulación verificada sobre los hexagramas (los
          supervivientes como conjuntos independientes del camino P6 y del ciclo C6) no está
          publicada en otro sitio. Lo decimos con esa humildad exacta: no hemos encontrado la
          fuente, no que no exista.
        </p>
      </div>

      <div className="mb-6">
        <Prose>
          <p>
            Lee cada hexagrama como 6 bits de abajo hacia arriba. ¿Cuántos no tienen{" "}
            <b>dos líneas yin seguidas</b>? Marcar las posiciones yin sin que se toquen es
            elegir un <b>conjunto independiente</b> del camino de 6 vértices, y esos
            conjuntos se cuentan con Fibonacci. Cambia la regla y mira sobrevivir a unos y
            caer a otros mientras la cuenta se queda clavada en un número de la sucesión.
          </p>
        </Prose>
      </div>

      {/* Conmutadores */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {REGLAS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRegla(r.id)}
            className="rounded-full border px-3 py-1.5 text-xs tracking-wide transition-colors"
            style={
              regla === r.id
                ? { background: ACCENT, color: "#0b0a08", borderColor: "transparent" }
                : { borderColor: "#3A362E", color: "#8a8271" }
            }
          >
            {r.nombre}
          </button>
        ))}
        <span className="mx-1 h-5 w-px" style={{ background: "#3A362E" }} />
        <button
          onClick={() => setCircular((c) => !c)}
          aria-pressed={circular}
          className="rounded-full border px-3 py-1.5 text-xs tracking-wide transition-colors"
          style={
            circular
              ? { borderColor: ACCENT, color: ACCENT }
              : { borderColor: "#3A362E", color: "#8a8271" }
          }
        >
          versión circular (línea 6 junto a la 1)
        </button>
      </div>

      {/* Conteo en vivo + rejilla */}
      <Panel className="mb-6" accent={ACCENT}>
        <div className="mb-3 flex items-baseline justify-center gap-3">
          <span className="font-mono text-4xl leading-none" style={{ color: ACCENT }}>
            {n}
          </span>
          <span className="text-sm text-sand-400">{etiqueta}</span>
        </div>
        <div className="mx-auto grid max-w-[420px] grid-cols-8 gap-1.5">
          {Array.from({ length: 64 }, (_, v) => {
            const vivo = vivosSet.has(v);
            const marcado = jiWei && vivo;
            return (
              <div
                key={v}
                title={`${hex(v).kw}. ${hex(v).py}`}
                className="flex items-center justify-center rounded p-0.5 transition-colors duration-300 motion-reduce:transition-none"
                style={{
                  border: marcado ? `1px solid ${ACCENT}` : "1px solid transparent",
                  background: marcado ? "rgba(90,184,154,0.12)" : "transparent",
                }}
              >
                <Glifo bits={hex(v).bits} color={vivo ? ACCENT : "#33302a"} />
              </div>
            );
          })}
        </div>

        {jiWei && (
          <p className="mt-4 text-center text-sm leading-relaxed text-sand-400">
            Los dos únicos que alternan a la perfección son{" "}
            {vivos
              .slice()
              .sort((a, b) => HEX_BY_VALUE[a].kw - HEX_BY_VALUE[b].kw)
              .map((v, i) => (
                <span key={v}>
                  {i > 0 ? " y " : ""}
                  <b style={{ color: ACCENT }}>
                    {hex(v).glyph} {hex(v).py}
                  </b>
                </span>
              ))}
            : su{" "}
            <Link href="/experimentos/bosque-nuclear" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              ciclo atractor nuclear
            </Link>{" "}
            y la{" "}
            <Link href="/experimentos/rey-wen" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              pareja que cierra el Rey Wen
            </Link>{" "}
            (63 y 64).
          </p>
        )}
      </Panel>

      {/* La escalera de Fibonacci */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>La escalera: por qué sale Fibonacci</SectionLabel>
      </div>
      <Panel className="mb-6">
        <svg viewBox="0 0 400 190" className="mx-auto w-full max-w-[440px]" role="img" aria-label="figuras válidas por número de líneas: 2, 3, 5, 8, 13, 21, la sucesión de Fibonacci.">
          {ESCALERA.map((v, i) => {
            const max = Math.max(...ESCALERA);
            const bh = (v / max) * 150 + 4;
            const x = 24 + i * 62;
            const bw = 44;
            return (
              <g key={i}>
                <rect x={x} y={168 - bh} width={bw} height={bh} rx={2} fill={i === 5 ? ACCENT : "#4a4436"} />
                <text x={x + bw / 2} y={168 - bh - 5} textAnchor="middle" fontSize={13} fontFamily="ui-monospace, monospace" fill={i === 5 ? ACCENT : "#cfc6b0"}>
                  {v}
                </text>
                <text x={x + bw / 2} y={184} textAnchor="middle" fontSize={10} fontFamily="ui-monospace, monospace" fill="#7a715e">
                  {i + 1} {i === 0 ? "línea" : "líneas"}
                </text>
              </g>
            );
          })}
        </svg>
        <Prose>
          <p className="mt-2">
            Toda figura válida de <b>n</b> líneas termina de una de dos formas: en{" "}
            <b>yang</b> (y delante lleva una figura válida de n menos 1), o en <b>yin</b>{" "}
            precedido de yang (y delante, una válida de n menos 2). Por eso cada peldaño es
            la suma de los dos anteriores: <b>F(n+2) = F(n+1) + F(n)</b>. Con 3 líneas son 5
            de los 8 trigramas; con 6, los 21 = F(8). El desglose de esos 21 por número de
            líneas yin es <b>{DESGLOSE_K.join(", ")}</b> = C(7-k, k), la misma identidad de
            Fibonacci que asoma en las diagonales del{" "}
            <Link href="/experimentos/grupo-sierpinski" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              triángulo de Pascal
            </Link>
            .
          </p>
        </Prose>
      </Panel>

      {/* Cierre */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={fib(8)} etiqueta="sin dos yin = F(8)" accent={ACCENT} />
        <Stat valor={lucas(6)} etiqueta="circular = L(6)" accent={ACCENT} />
        <Stat valor={2} etiqueta="alternancia (Ji Ji, Wei Ji)" />
        <Stat valor={ESCALERA.join(" ")} etiqueta="la escalera 1..6" />
      </div>
    </div>
  );
}
