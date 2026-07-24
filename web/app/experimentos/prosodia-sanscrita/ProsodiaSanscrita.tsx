"use client";

import { useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import { PARES, metroDe, ESCALERA_METROS } from "@/lib/prosodia";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#c99a52";

/** Glifo de un hexagrama (6 líneas) o de la figura con centinela (7). */
function Glifo({ bits, color = "#e9e3d3", centinela = false }: { bits: string; color?: string; centinela?: boolean }) {
  const n = bits.length;
  const w = 30;
  const bar = 3;
  const gap = 3;
  const rows = [];
  for (let k = n; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = (n - k) * (gap + bar);
    const col = centinela && k === n ? ACCENT : color;
    if (yang) rows.push(<rect key={k} x={0} y={y} width={w} height={bar} rx={0.6} fill={col} />);
    else {
      const seg = w * 0.4;
      rows.push(
        <rect key={`${k}a`} x={0} y={y} width={seg} height={bar} rx={0.6} fill={col} />,
        <rect key={`${k}b`} x={w - seg} y={y} width={seg} height={bar} rx={0.6} fill={col} />,
      );
    }
  }
  return (
    <svg viewBox={`0 0 ${w} ${n * bar + (n - 1) * gap}`} width={w} height={n * bar + (n - 1) * gap} aria-hidden="true">
      {rows}
    </svg>
  );
}

export default function ProsodiaSanscrita() {
  const [sel, setSel] = useState(42); // Ji Ji: metro 1,2,2,2
  const metro = metroDe(sel);
  const maxEsc = Math.max(...ESCALERA_METROS, 21);

  return (
    <div>
      <ExperimentHeader
        kicker="⏑ · 易 · prosodia sánscrita"
        titulo="Los poetas que contaron primero"
        subtitulo="Fibonacci en la prosodia sánscrita, siglos antes"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Mucho antes de Fibonacci, los prosodistas de la India (Virahanka, Gopala,
            Hemachandra) contaban los <b>metros</b>: secuencias de sílabas <b>cortas</b>{" "}
            (laghu, duración 1) y <b>largas</b> (guru, duración 2). ¿Cuántos metros hay de
            duración n? El último puede ser una corta sobre un metro de n-1, o una larga
            sobre uno de n-2: <b>C(n) = C(n-1) + C(n-2)</b>. Salen 1, 2, 3, 5, 8, 13, 21: los
            números de Fibonacci, escritos aquí siglos antes (
            <a href="https://doi.org/10.1016/0315-0860(85)90021-7" className="underline decoration-dotted underline-offset-2" style={{ color: ACCENT }}>Singh, 1985</a>
            ).
          </p>
        </Prose>
      </div>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>La escalera de metros por duración</SectionLabel>
      </div>
      <Panel className="mb-6">
        <div className="flex items-end justify-center gap-3" style={{ height: 110 }}>
          {ESCALERA_METROS.concat([21]).map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="font-mono text-[11px] text-sand-300">{v}</span>
              <div className="w-full rounded-sm" style={{ height: `${(v / maxEsc) * 80 + 4}px`, background: ACCENT }} />
              <span className="font-mono text-[9px] text-sand-600">n={i + 1}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* La biyección */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>El puente: figura sin dos yin ↔ metro de duración 7</SectionLabel>
      </div>
      <Panel className="mb-4" accent={ACCENT}>
        <p className="mb-3 text-sm leading-relaxed text-sand-300">
          Toma una figura de 6 líneas <b>sin dos yin seguidos</b> (los{" "}
          <Link href="/experimentos/fibonacci-hexagrama" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>21 de Fibonacci</Link>
          ), añade un <b style={{ color: ACCENT }}>yang centinela</b> arriba y lee de abajo a
          arriba: cada <b>yin</b> con el yang inmediatamente superior es una sílaba{" "}
          <b>larga</b> (2); cada yang no emparejado, una <b>corta</b> (1). El metro dura
          siempre 7, y hay exactamente 21: los mismos que contaba la India.
        </p>
        <div className="mb-4 flex flex-wrap gap-1">
          {PARES.map((p) => (
            <button key={p.v} onClick={() => setSel(p.v)} className="rounded p-1 transition-colors" style={{ background: sel === p.v ? "rgba(201,154,82,0.18)" : "transparent", border: `1px solid ${sel === p.v ? ACCENT : "transparent"}` }} title={`${hex(p.v).kw}. ${hex(p.v).py}`}>
              <Glifo bits={hex(p.v).bits} color={sel === p.v ? ACCENT : "#8a8272"} />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 rounded-lg border border-ink-700 bg-ink-850/40 p-4">
          <div className="flex flex-col items-center gap-1">
            <Glifo bits={hex(sel).bits + "1"} centinela />
            <span className="mt-1 font-mono text-[10px] text-sand-500">{hex(sel).py} + centinela</span>
          </div>
          <span className="text-2xl text-sand-600">→</span>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-1">
              {metro.map((s, i) => (
                <div key={i} className="flex flex-col items-center justify-end">
                  <div className="rounded-sm" style={{ width: s === 2 ? 44 : 20, height: 22, background: s === 2 ? ACCENT : "#6B6353" }} />
                  <span className="mt-1 font-mono text-[9px] text-sand-500">{s === 2 ? "larga" : "corta"}</span>
                </div>
              ))}
            </div>
            <span className="font-mono text-[11px] text-sand-400">metro {metro.join(" · ")} · duración {metro.reduce((a, b) => a + b, 0)}</span>
          </div>
        </div>
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={21} etiqueta="figuras sin dos yin = metros de 7" accent={ACCENT} />
        <Stat valor="F(8)" etiqueta="21 es un número de Fibonacci" />
        <Stat valor="biyección" etiqueta="verificada en la suite" accent={ACCENT} />
        <Stat valor="s. VII–XII" etiqueta="antes de Fibonacci (s. XIII)" />
      </div>

      <Panel>
        <Prose>
          <p>
            Dos civilizaciones contaron <b>lo mismo</b> con símbolos distintos: yin y yang
            aquí, corta y larga allá. El{" "}
            <Link href="/experimentos/matriz-transferencia" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              método de la matriz de transferencia
            </Link>{" "}
            es el mismo en ambos casos, y el{" "}
            <Link href="/experimentos/fibonacci-hexagrama" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              conteo de figuras sin dos yin
            </Link>{" "}
            es la versión binaria del problema. La India lo escribió primero; el laboratorio
            solo exhibe el puente.
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
