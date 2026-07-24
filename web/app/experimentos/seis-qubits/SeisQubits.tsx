"use client";

import { useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import { SUPERPOSICION_KUN, medir, AMPLITUD_UNIFORME, PROB_UNIFORME } from "@/lib/qubits";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#8a7fd6";
type Fase = "base" | "superpuesto" | "medido";

const BASE_KUN = Array.from({ length: 64 }, (_, v) => (v === 0 ? 1 : 0));

export default function SeisQubits() {
  const [fase, setFase] = useState<Fase>("base");
  const [medido, setMedido] = useState<number | null>(null);

  const amplitudes =
    fase === "superpuesto"
      ? SUPERPOSICION_KUN
      : fase === "medido" && medido !== null
        ? Array.from({ length: 64 }, (_, v) => (v === medido ? 1 : 0))
        : BASE_KUN;

  const aplicar = () => {
    setFase("superpuesto");
    setMedido(null);
  };
  const medirEstado = () => {
    const v = medir();
    setMedido(v);
    setFase("medido");
  };
  const reiniciar = () => {
    setFase("base");
    setMedido(null);
  };

  return (
    <div>
      <ExperimentHeader
        kicker="ψ · 易 · puerta de Hadamard"
        titulo="Seis qubits"
        subtitulo="El hexagrama como estado de la base computacional"
        accent={ACCENT}
      />

      <div className="mb-6 rounded-xl border p-4" style={{ borderColor: `${ACCENT}66`, background: "rgba(138,127,214,0.06)" }}>
        <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: ACCENT }}>
          <span className="text-cinnabar-bright">⚠</span> Descargo
        </div>
        <p className="text-sm leading-relaxed text-sand-300">
          Esto es una <b>identidad matemática</b> entre transformadas y estados: la base
          computacional de 6 qubits son los 64 hexagramas, y la transformada de Walsh del
          sitio es la puerta de Hadamard H⊗6. <b>No se afirma nada cuántico sobre el
          oráculo</b>; el «quantum I Ching» comercial está en el{" "}
          <Link href="/fundamentos" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
            registro de aplicabilidad
          </Link>{" "}
          como rechazado.
        </p>
      </div>

      <div className="mb-6">
        <Prose>
          <p>
            Un hexagrama es un estado de la <b>base computacional</b> de 6 qubits:{" "}
            <code>|Kun⟩ = |000000⟩</code>, <code>|Qian⟩ = |111111⟩</code>. La{" "}
            <Link href="/experimentos/espectro-walsh" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              transformada de Walsh
            </Link>{" "}
            del sitio es <b>literalmente</b> la puerta de Hadamard aplicada a las 6 líneas
            (H⊗6, ya verificada matricialmente en el experimento 23). Aplicarla a{" "}
            <code>|Kun⟩</code> produce la <b>superposición uniforme</b> de los 64
            hexagramas, cada uno con amplitud <b>1/8</b>: el estado que contiene el libro
            entero. Al medir, colapsa a un hexagrama uniforme.
          </p>
        </Prose>
      </div>

      {/* Interactivo */}
      <Panel className="mb-6" accent={ACCENT}>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
          <button onClick={aplicar} disabled={fase !== "base"} className="rounded-full px-4 py-2 text-sm disabled:opacity-40" style={{ background: ACCENT, color: "#0b0a08" }}>
            H⊗6 · aplicar Hadamard a |Kun⟩
          </button>
          <button onClick={medirEstado} disabled={fase !== "superpuesto"} className="rounded-full border px-4 py-2 text-sm disabled:opacity-30" style={{ borderColor: ACCENT, color: ACCENT }}>
            medir
          </button>
          {fase !== "base" && (
            <button onClick={reiniciar} className="rounded-full border border-ink-700 px-3 py-2 text-xs text-sand-400">
              reiniciar
            </button>
          )}
        </div>

        <svg viewBox="0 0 400 150" className="w-full" role="img" aria-label="Amplitudes de los 64 hexagramas: un solo pico en Kun, la superposición uniforme, o el colapso tras medir.">
          <line x1={8} y1={128} x2={392} y2={128} stroke="#2A2620" strokeWidth={0.8} />
          {amplitudes.map((a, v) => {
            const bw = 384 / 64;
            const x = 8 + v * bw;
            const h = a * 112;
            const destacado = (fase === "medido" && v === medido) || (fase === "base" && v === 0);
            return (
              <rect key={v} x={x + 0.4} y={128 - h} width={bw - 0.8} height={h} rx={0.5}
                fill={destacado ? "#f5efdf" : ACCENT} opacity={fase === "superpuesto" ? 0.85 : destacado ? 1 : 0.5} />
            );
          })}
          {/* linea de amplitud 1/8 en superposicion */}
          {fase === "superpuesto" && (
            <line x1={8} y1={128 - AMPLITUD_UNIFORME * 112} x2={392} y2={128 - AMPLITUD_UNIFORME * 112} stroke="#f5efdf" strokeWidth={0.7} strokeDasharray="3 2" opacity={0.7} />
          )}
        </svg>
        <p className="mt-1 text-center font-mono text-[11px]" style={{ color: ACCENT }}>
          {fase === "base" && "estado |Kun⟩ = |000000⟩ · una sola amplitud"}
          {fase === "superpuesto" && "superposición uniforme · las 64 amplitudes valen 1/8"}
          {fase === "medido" && medido !== null && `medido → ${hex(medido).glyph} ${hex(medido).kw}. ${hex(medido).py} (probabilidad 1/64)`}
        </p>
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor="1/8" etiqueta="amplitud de cada hexagrama" accent={ACCENT} />
        <Stat valor="1/64" etiqueta="probabilidad al medir" accent={ACCENT} />
        <Stat valor="H⊗6" etiqueta="= la transformada de Walsh" />
        <Stat valor="unitaria" etiqueta="preserva normas (H·Hᵀ = I)" />
      </div>

      <Panel>
        <Prose>
          <p>
            La cuenta es exacta: (1/√2)⁶ = 1/8, así que las 64 amplitudes de{" "}
            <code>H⊗6|Kun⟩</code> valen 1/8 y las probabilidades{" "}
            <b>{PROB_UNIFORME.toFixed(6).replace(/0+$/, "")} = 1/64</b>. La transformación es{" "}
            <b>unitaria</b> (preserva la norma total en 1), que es justo lo que distingue una
            evolución cuántica de una transformada cualquiera. Todo lo demás sobre qubits e I
            Ching que no sea esta identidad formal es metáfora, y aquí no se afirma.
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
