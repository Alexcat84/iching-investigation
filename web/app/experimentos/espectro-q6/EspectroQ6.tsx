"use client";

import Link from "next/link";
import { ESPECTRO } from "@/lib/espectro-q6";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#7f8fd0";

export default function EspectroQ6() {
  const maxMult = Math.max(...ESPECTRO.map((n) => n.mult));
  return (
    <div>
      <ExperimentHeader
        kicker="λ · 易 · teoría espectral de grafos"
        titulo="El espectro del hipercubo"
        subtitulo="Los autovalores de Q6 son los niveles de yang"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El hipercubo Q6 es el grafo de los 64 hexagramas con una arista por cada
            mutación de una línea. Sus <b>autovalores</b> (de la matriz de adyacencia) son
            un teorema clásico: <b>6 - 2k</b> con multiplicidad <b>C(6,k)</b>, porque los
            autovectores son los caracteres χ<sub>w</sub>(v) = (-1)<sup>⟨w,v⟩</sup>, con
            autovalor 6 - 2·(líneas de w). Y las multiplicidades no son casualidad: son los{" "}
            <Link href="/experimentos/reticulo-b6" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              niveles de yang del retículo B6
            </Link>
            , C(6,k) hexagramas con k líneas yang.
          </p>
        </Prose>
      </div>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Los siete niveles de energía del cubo</SectionLabel>
      </div>
      <Panel className="mb-6" accent={ACCENT}>
        <svg viewBox="0 0 400 260" className="mx-auto w-full max-w-[460px]" role="img" aria-label="Los siete autovalores del hipercubo Q6, de +6 a -6, cada uno con su multiplicidad C(6,k) dibujada como puntos.">
          <line x1={70} y1={20} x2={70} y2={244} stroke="#2A2620" />
          {ESPECTRO.map((n, i) => {
            const y = 30 + i * 32;
            return (
              <g key={i}>
                <text x={62} y={y + 4} textAnchor="end" fontSize={12} fill={n.autovalor === 0 ? ACCENT : "#cfc6b0"} fontFamily="ui-monospace, monospace">
                  {n.autovalor > 0 ? `+${n.autovalor}` : n.autovalor}
                </text>
                <line x1={70} y1={y} x2={84} y2={y} stroke="#3A352C" />
                {Array.from({ length: n.mult }, (_, m) => (
                  <circle key={m} cx={94 + m * 14} cy={y} r={4} fill={n.autovalor === 0 ? ACCENT : "#8A8272"} />
                ))}
                <text x={94 + n.mult * 14 + 8} y={y + 4} fontSize={10} fill="#6b6353" fontFamily="ui-monospace, monospace">
                  ×{n.mult}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-1 text-center font-mono text-[10px] text-sand-500">
          autovalor 6 - 2k · multiplicidad C(6,k) = número de hexagramas con k líneas yang
        </p>
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={6} etiqueta="autovalor máximo (Qian aislado)" accent={ACCENT} />
        <Stat valor={ESPECTRO.reduce((a, n) => a + n.mult, 0)} etiqueta="suma de multiplicidades" />
        <Stat valor={maxMult} etiqueta="mayor multiplicidad (nivel medio)" accent={ACCENT} />
        <Stat valor="/6" etiqueta="del espectro sale el paseo" />
      </div>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Y de aquí sale la velocidad del paseo aleatorio</SectionLabel>
      </div>
      <Panel>
        <Prose>
          <p>
            El{" "}
            <Link href="/experimentos/paseo-aleatorio" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              paseo aleatorio simple
            </Link>{" "}
            sobre Q6 tiene por matriz de transición la adyacencia dividida por 6, así que su
            espectro es este mismo dividido por 6: {ESPECTRO.map((n) => (n.autovalor / 6).toFixed(2).replace(/\.00$/, "")).join(", ")}. El segundo
            autovalor, 4/6 ≈ 0,67, fija su velocidad de mezcla. El teorema espectral convierte
            una pregunta dinámica en una cuenta de líneas yang.
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
