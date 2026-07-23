"use client";

import { useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import {
  probsBoltzmann,
  energia,
  Zabierta,
  Zperiodica,
  entropia,
  autovalorDominante,
  MATRIZ_DURA,
} from "@/lib/ising";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#e2704b";
const CX = 150;
const CY = 150;
const R = 118;

function anillo(v: number, r = R): [number, number] {
  const a = -Math.PI / 2 + (v * 2 * Math.PI) / 64;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

export default function IsingHexagrama() {
  const [T, setT] = useState(1.43);
  const [signoJ, setSignoJ] = useState<1 | -1>(1);
  const [anilloModo, setAnilloModo] = useState(false);
  const [sel, setSel] = useState<number | null>(null);

  const beta = 1 / T;
  const J = signoJ;
  const p = probsBoltzmann(beta, J, anilloModo);
  const maxP = Math.max(...p);
  const Zab = Zabierta(beta, J);
  const Zan = Zperiodica(beta, J);
  const H = entropia(beta, J, anilloModo);

  // Curva de entropia frente a T.
  const curva = Array.from({ length: 60 }, (_, i) => {
    const t = 0.25 + (i / 59) * 3.75;
    return { t, h: entropia(1 / t, J, anilloModo) };
  });
  const curvaPts = curva.map((d, i) => `${24 + (i / 59) * 352},${96 - (d.h / 6) * 82}`).join(" ");

  return (
    <div>
      <ExperimentHeader
        kicker="⇅ · 易 · modelo de Ising (1925)"
        titulo="El hexagrama como cadena de espines"
        subtitulo="El modelo de Ising sobre las seis líneas"
        accent={ACCENT}
      />

      <div className="mb-6 rounded-xl border p-4" style={{ borderColor: `${ACCENT}66`, background: "rgba(226,112,75,0.06)" }}>
        <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: ACCENT }}>
          <span className="text-cinnabar-bright">⚠</span> Descargo
        </div>
        <p className="text-sm leading-relaxed text-sand-300">
          La conexión con el I Ching es identidad matemática de estructura (los mismos 64
          estados, la misma <Link href="/experimentos/matriz-transferencia" className="underline decoration-dotted underline-offset-2" style={{ color: ACCENT }}>matriz de transferencia</Link> que el
          experimento 29), no una afirmación física sobre el oráculo. Ising (1925), sobre el
          planteamiento de Lenz de 1920, demostró que en 1D <b>no hay transición de fase</b>:
          esta cadena de 6 se ordena gradualmente al enfriar, nunca de golpe.
        </p>
      </div>

      <div className="mb-6">
        <Prose>
          <p>
            Lee cada hexagrama como una <b>cadena de 6 espines</b>: yang = +1, yin = -1. La
            energía es E = -J por la suma de productos de líneas vecinas, y la probabilidad
            de cada hexagrama es la de <b>Boltzmann</b>, proporcional a e<sup>-βE</sup>. La{" "}
            <b>matriz de transferencia</b> T = [[e<sup>βJ</sup>, e<sup>-βJ</sup>], [e<sup>-βJ</sup>, e<sup>βJ</sup>]] da la
            función de partición: la cadena abierta es 1ᵀT⁵1 y el anillo Tr(T⁶).
          </p>
        </Prose>
      </div>

      {/* Controles */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 rounded-lg border border-ink-700 bg-ink-850/40 px-3 py-2">
          <span className="font-mono text-[11px] text-sand-400">temperatura T = {T.toFixed(2)} (β = {beta.toFixed(2)})</span>
          <input type="range" min={0.25} max={4} step={0.01} value={T} onChange={(e) => setT(parseFloat(e.target.value))} style={{ accentColor: ACCENT }} />
        </label>
        <div className="flex gap-2">
          {([1, -1] as const).map((s) => (
            <button key={s} onClick={() => setSignoJ(s)} className="flex-1 rounded-lg border px-2 py-2 text-xs transition-colors" style={signoJ === s ? { background: ACCENT, color: "#0b0a08", borderColor: "transparent" } : { borderColor: "#3A362E", color: "#8a8271" }}>
              J {s > 0 ? "> 0 (alinea)" : "< 0 (alterna)"}
            </button>
          ))}
        </div>
        <button onClick={() => setAnilloModo((a) => !a)} aria-pressed={anilloModo} className="rounded-lg border px-2 py-2 text-xs transition-colors" style={anilloModo ? { borderColor: ACCENT, color: ACCENT } : { borderColor: "#3A362E", color: "#8a8271" }}>
          {anilloModo ? "anillo (línea 6 junto a la 1)" : "cadena abierta"}
        </button>
      </div>

      <Panel className="mb-6" accent={ACCENT}>
        <svg viewBox="0 0 300 300" className="mx-auto w-full max-w-[340px]" role="img" aria-label="Los 64 hexagramas en anillo, cada uno con un punto cuyo tamaño es su probabilidad de Boltzmann a la temperatura actual.">
          {Array.from({ length: 64 }, (_, v) => {
            const [x, y] = anillo(v);
            const r = 1 + (p[v] / maxP) * 9;
            const esSel = v === sel;
            return (
              <circle key={v} cx={x} cy={y} r={r} fill={esSel ? "#f5efdf" : ACCENT} opacity={0.35 + 0.65 * (p[v] / maxP)} style={{ cursor: "pointer" }} onClick={() => setSel(v)} />
            );
          })}
        </svg>
        {sel !== null && (
          <p className="mt-2 text-center text-sm text-sand-300">
            {hex(sel).glyph} {hex(sel).kw}. {hex(sel).py} · energía E = {energia(sel, J, anilloModo)} · probabilidad {(p[sel] * 100).toFixed(2)}%
          </p>
        )}
        <p className="mt-1 text-center font-mono text-[10px] text-sand-500">
          tamaño del punto = probabilidad de Boltzmann · toca un hexagrama para su energía
        </p>
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={Zab.toFixed(3)} etiqueta="Z abierta = 1ᵀT⁵1" accent={ACCENT} />
        <Stat valor={Zan.toFixed(3)} etiqueta="Z anillo = Tr(T⁶)" accent={ACCENT} />
        <Stat valor={`${H.toFixed(2)} bits`} etiqueta="entropía a esta T" />
        <Stat valor={autovalorDominante(MATRIZ_DURA).toFixed(3)} etiqueta="restricción dura → φ" />
      </div>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>La entropía baja al enfriar (sin salto: no hay transición en 1D)</SectionLabel>
      </div>
      <Panel>
        <svg viewBox="0 0 400 120" className="mx-auto w-full max-w-[440px]" role="img" aria-label="Curva de entropía frente a la temperatura: sube suave hacia el máximo de 6 bits, sin ningún salto brusco.">
          <line x1={24} y1={96} x2={376} y2={96} stroke="#2A2620" />
          <line x1={24} y1={14} x2={24} y2={96} stroke="#2A2620" />
          <text x={28} y={20} fontSize={9} fill="#6b6353" fontFamily="ui-monospace, monospace">6 bits</text>
          <polyline points={curvaPts} fill="none" stroke={ACCENT} strokeWidth={1.6} />
          {(() => {
            const i = Math.round(((T - 0.25) / 3.75) * 59);
            const px = 24 + (i / 59) * 352;
            return <line x1={px} y1={14} x2={px} y2={96} stroke="#f5efdf" strokeWidth={1} strokeDasharray="3 3" />;
          })()}
          <text x={200} y={114} textAnchor="middle" fontSize={9} fill="#8a8271" fontFamily="ui-monospace, monospace">temperatura T (frío a la izquierda)</text>
        </svg>
      </Panel>
    </div>
  );
}
