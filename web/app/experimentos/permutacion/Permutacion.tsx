"use client";

import { useMemo, useState } from "react";
import { hex } from "@/lib/iching";
import { ESTRUCTURA, INVERSIONES_MAX, PERM } from "@/lib/permutacion";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#b57bb0";

export default function Permutacion() {
  const [selCiclo, setSelCiclo] = useState<number | null>(null);

  // índice de ciclo por posición del Rey Wen
  const cicloDe = useMemo(() => {
    const m = new Array(64).fill(-1);
    ESTRUCTURA.ciclos.forEach((c, i) => c.forEach((k) => (m[k] = i)));
    return m;
  }, []);

  const N = 64;
  const S = 384;
  const cell = S / N;
  const pct = (ESTRUCTURA.inversiones / INVERSIONES_MAX) * 100;

  const ciclosOrdenados = useMemo(
    () =>
      ESTRUCTURA.ciclos
        .map((c, i) => ({ c, i }))
        .sort((a, b) => b.c.length - a.c.length),
    [],
  );

  return (
    <div>
      <ExperimentHeader
        kicker="σ · Fu Xi → Rey Wen"
        titulo="Rey Wen como permutación"
        subtitulo="Cuánto desordena el libro la geometría binaria"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Si el orden Fu Xi es la <b>identidad</b> (la posición <i>k</i> guarda el valor{" "}
            <i>k</i>), el orden del Rey Wen es una <b>permutación</b> σ de los 64 números.
            Toda permutación se descompone en <b>ciclos</b>: grupos que rotan entre sí. Su
            estructura —cuántos ciclos, de qué largo, cuántos puntos fijos— es la medida
            exacta del desorden.
          </p>
        </Prose>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat valor={ESTRUCTURA.numCiclos} etiqueta="ciclos" accent={ACCENT} />
        <Stat valor={ESTRUCTURA.maxLongitud} etiqueta="ciclo más largo" accent={ACCENT} />
        <Stat valor={ESTRUCTURA.puntosFijos.length} etiqueta="puntos fijos" />
        <Stat valor={ESTRUCTURA.orden} etiqueta="orden (σⁿ = id)" />
        <Stat valor={ESTRUCTURA.paridad} etiqueta="paridad" />
        <Stat valor={`${Math.round(pct)} %`} etiqueta={`inversiones (${ESTRUCTURA.inversiones})`} accent={ACCENT} />
      </div>

      {/* Matriz de permutación */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div>
          <SectionLabel accent={ACCENT}>La permutación, punto a punto</SectionLabel>
          <Panel className="mt-2">
            <svg viewBox={`-6 -6 ${S + 12} ${S + 12}`} className="w-full" role="img" aria-label="matriz de permutación">
              <rect x={0} y={0} width={S} height={S} fill="none" stroke="#2A2620" />
              {/* anti-diagonal = identidad (Fu Xi) */}
              <line x1={0} y1={S} x2={S} y2={0} stroke="#2A2620" strokeDasharray="2 3" />
              {PERM.map((v, i) => {
                const x = i * cell + cell / 2;
                const y = (63 - v) * cell + cell / 2;
                const enSel = selCiclo != null && cicloDe[i] === selCiclo;
                const esFijo = v === i;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={enSel ? 3.2 : esFijo ? 2.6 : 1.8}
                    fill={enSel ? "#f5efdf" : esFijo ? ACCENT : "#8a8271"}
                    opacity={selCiclo != null && !enSel ? 0.28 : 0.9}
                  />
                );
              })}
              <text x={0} y={S + 4} style={{ fontSize: 9, fontFamily: "monospace" }} fill="#6b6558" dominantBaseline="hanging">
                posición Rey Wen →
              </text>
              <text x={-4} y={0} style={{ fontSize: 9, fontFamily: "monospace" }} fill="#6b6558" textAnchor="end" dominantBaseline="hanging" transform={`rotate(-90 -4 0)`}>
                ← valor Fu Xi
              </text>
            </svg>
            <p className="mt-2 font-mono text-[10px] text-sand-500">
              La línea punteada es Fu Xi (la identidad). La dispersión alrededor es el
              desorden del Rey Wen; los puntos sobre la línea son los fijos.
            </p>
          </Panel>
        </div>

        {/* Ciclos */}
        <div>
          <SectionLabel accent={ACCENT}>Descomposición en ciclos</SectionLabel>
          <Panel className="mt-2">
            <div className="max-h-[360px] space-y-1.5 overflow-y-auto pr-1">
              {ciclosOrdenados.map(({ c, i }) => {
                const isSel = selCiclo === i;
                const esFijo = c.length === 1;
                return (
                  <button
                    key={i}
                    onClick={() => setSelCiclo(isSel ? null : i)}
                    className="flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left transition-colors"
                    style={{
                      borderColor: isSel ? ACCENT : "#2A2620",
                      background: isSel ? "rgba(181,123,176,0.10)" : "transparent",
                    }}
                  >
                    <span
                      className="w-8 shrink-0 font-mono text-[11px]"
                      style={{ color: esFijo ? "#6b6558" : ACCENT }}
                    >
                      {esFijo ? "fijo" : `×${c.length}`}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-sand-300">
                      {c.map((k) => hex(PERM[k]).kw).join(" → ")}
                      {!esFijo && " →"}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 font-mono text-[10px] text-sand-500">
              Cada fila es un ciclo (números del Rey Wen). Toca uno para resaltarlo en la
              matriz.
            </p>
          </Panel>
        </div>
      </div>

      {/* Puntos fijos */}
      {ESTRUCTURA.puntosFijos.length > 0 && (
        <div>
          <SectionLabel accent={ACCENT}>Puntos fijos — donde los dos órdenes coinciden</SectionLabel>
          <Panel className="mt-2">
            <p className="mb-3 text-sm text-sand-400">
              Los hexagramas cuya posición en el Rey Wen coincide con su valor Fu Xi: el
              único lugar donde el libro y el binario están de acuerdo.
            </p>
            <div className="flex flex-wrap gap-2">
              {ESTRUCTURA.puntosFijos.map((k) => {
                const h = hex(PERM[k]);
                return (
                  <div
                    key={k}
                    className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
                    style={{ borderColor: ACCENT + "66" }}
                  >
                    <span className="font-mono text-[11px] text-sand-300">
                      pos {k} = valor {PERM[k]}
                    </span>
                    <span className="text-sand-200">
                      {h.glyph} {h.py}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
