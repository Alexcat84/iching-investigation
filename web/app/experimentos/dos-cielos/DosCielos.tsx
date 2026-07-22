"use client";

import { useState } from "react";
import { TRI, TRIGRAM_INFO } from "@/lib/iching";
import {
  ANTERIOR,
  EJES,
  ESTRUCTURA_TAU,
  INVERSIONES_MAX_8,
  POSTERIOR,
  TAU,
  ejesComplementarios,
  nombreTrigrama,
} from "@/lib/bagua";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#58b09c";
const CX = 190;
const CY = 190;
const R = 138;

function posXY(p: number): [number, number] {
  const ang = -Math.PI / 2 + (p * 2 * Math.PI) / 8;
  return [CX + R * Math.cos(ang), CY + R * Math.sin(ang)];
}

/** Glifo de trigrama (3 líneas, la inferior abajo). */
function TrigramGlyph({ v, w = 26, color = "#e9e3d3" }: { v: number; w?: number; color?: string }) {
  const bits = TRI[nombreTrigrama(v)];
  const bar = w * 0.14;
  const gap = w * 0.12;
  const rows = [];
  for (let k = 3; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = (3 - k) * (gap + bar);
    if (yang) {
      rows.push(<rect key={k} x={0} y={y} width={w} height={bar} rx={0.6} fill={color} />);
    } else {
      const seg = w * 0.42;
      rows.push(
        <rect key={`${k}a`} x={0} y={y} width={seg} height={bar} rx={0.6} fill={color} />,
        <rect key={`${k}b`} x={w - seg} y={y} width={seg} height={bar} rx={0.6} fill={color} />,
      );
    }
  }
  const H = 3 * bar + 2 * gap;
  return (
    <svg viewBox={`0 0 ${w} ${H}`} width={w} height={H} aria-hidden="true">
      {rows}
    </svg>
  );
}

export default function DosCielos() {
  const [cielo, setCielo] = useState<"anterior" | "posterior">("anterior");
  const disp = cielo === "anterior" ? ANTERIOR : POSTERIOR;
  const ejesOk = ejesComplementarios(disp).map(([a, b]) => `${a},${b}`);

  // Posición de pantalla de cada trigrama (valor 0..7) en la disposición actual,
  // para animar el viaje de cada trigrama entre cielos.
  const posDe = new Array(8).fill(0);
  disp.forEach((v, p) => (posDe[v] = p));

  return (
    <div>
      <ExperimentHeader
        kicker="先天 · 後天 · los ocho trigramas"
        titulo="Los dos cielos"
        subtitulo="El bagua Anterior y el Posterior como permutaciones"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Los 8 trigramas tienen dos disposiciones clásicas en círculo. El{" "}
            <b>Cielo Anterior</b> (先天), atribuido a Fu Xi, es el orden cosmológico: el
            cielo arriba, la tierra abajo. El <b>Cielo Posterior</b> (後天), atribuido al
            Rey Wen, es el orden estacional del mundo en marcha. Pasar de uno a otro es
            una permutación de 8 elementos: la versión en miniatura de todo este
            laboratorio. Como en los mapas chinos, el sur va arriba y el este a la
            izquierda.
          </p>
        </Prose>
      </div>

      {/* Selector */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {(["anterior", "posterior"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCielo(c)}
            className="rounded-full border px-3 py-1.5 text-xs tracking-wide transition-colors"
            style={
              cielo === c
                ? { background: ACCENT, color: "#0b0a08", borderColor: "transparent" }
                : { borderColor: "#3A362E", color: "#8a8271" }
            }
          >
            {c === "anterior" ? "先天 Cielo Anterior (Fu Xi)" : "後天 Cielo Posterior (Rey Wen)"}
          </button>
        ))}
      </div>
      <p className="mb-4 text-center text-xs text-sand-500">
        {cielo === "anterior"
          ? "Cada trigrama mira a su complemento binario exacto: los 4 ejes suman 7."
          : "La simetría se rompe: solo el eje del fuego y el agua (Li y Kan) sigue sumando 7."}
      </p>

      {/* Círculo animado */}
      <Panel className="mb-6">
        <svg
          viewBox="0 0 380 380"
          className="mx-auto w-full max-w-[400px]"
          role="img"
          aria-label={`Bagua del Cielo ${cielo === "anterior" ? "Anterior" : "Posterior"}: 8 trigramas en círculo con sus ejes; en el Anterior los 4 ejes unen complementos binarios, en el Posterior solo el eje Li Kan`}
        >
          <circle cx={CX} cy={CY} r={R + 34} fill="none" stroke="#2A2620" />
          <circle cx={CX} cy={CY} r={R - 34} fill="none" stroke="#1C1915" />

          {/* Ejes */}
          {EJES.map(([a, b]) => {
            const ok = ejesOk.includes(`${a},${b}`);
            const [x1, y1] = posXY(a);
            const [x2, y2] = posXY(b);
            return (
              <g key={`${a}-${b}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={ok ? ACCENT : "#3a362e"}
                  strokeWidth={ok ? 1.6 : 1}
                  strokeDasharray={ok ? undefined : "4 5"}
                  opacity={ok ? 0.75 : 0.6}
                />
                <text
                  x={(x1 + x2) / 2 + 8}
                  y={(y1 + y2) / 2 - 6}
                  style={{ fontSize: 11, fontFamily: "monospace" }}
                  fill={ok ? ACCENT : "#6b6558"}
                >
                  {ok ? "= 7" : "≠ 7"}
                </text>
              </g>
            );
          })}

          {/* Trigramas: un grupo por trigrama, animado hacia su posición actual */}
          {Array.from({ length: 8 }, (_, v) => {
            const [x, y] = posXY(posDe[v]);
            const info = TRIGRAM_INFO[nombreTrigrama(v)];
            return (
              <g
                key={v}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  transition: "transform 900ms cubic-bezier(0.3, 0.7, 0.2, 1)",
                }}
              >
                <circle r={30} fill="#151310" stroke="#2A2620" />
                <g transform="translate(-13, -17)">
                  <TrigramGlyph v={v} w={26} />
                </g>
                <text
                  y={14}
                  textAnchor="middle"
                  className="fill-sand-300"
                  style={{ fontSize: 10, fontFamily: "monospace" }}
                >
                  {nombreTrigrama(v)}
                </text>
                <text
                  y={25}
                  textAnchor="middle"
                  style={{ fontSize: 9, fontFamily: "monospace" }}
                  fill={ACCENT}
                >
                  {TRI[nombreTrigrama(v)]} = {v}
                </text>
                <text
                  y={-38}
                  textAnchor="middle"
                  className="fill-sand-600"
                  style={{ fontSize: 9 }}
                >
                  {info.imagen} {info.es}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-2 text-center font-mono text-[10px] text-sand-500">
          alterna entre cielos para ver a cada trigrama viajar a su nueva posición
        </p>
      </Panel>

      {/* Métricas de la permutación */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={ESTRUCTURA_TAU.numCiclos} etiqueta="ciclos (dos de 4)" accent={ACCENT} />
        <Stat valor={ESTRUCTURA_TAU.puntosFijos.length} etiqueta="puntos fijos" />
        <Stat valor={ESTRUCTURA_TAU.orden} etiqueta="orden (τⁿ = id)" />
        <Stat
          valor={`${ESTRUCTURA_TAU.inversiones}/${INVERSIONES_MAX_8}`}
          etiqueta={`inversiones (${Math.round((ESTRUCTURA_TAU.inversiones / INVERSIONES_MAX_8) * 100)} %)`}
          accent={ACCENT}
        />
      </div>

      <div className="mb-6">
        <SectionLabel accent={ACCENT}>La permutación τ, posición a posición</SectionLabel>
        <Panel className="mt-2">
          <p className="mb-3 text-sm text-sand-400">
            τ manda el trigrama que ocupa una posición en el Anterior al que ocupa esa
            misma posición en el Posterior. Se descompone en dos ciclos de 4: ningún
            trigrama queda quieto, y τ aplicada 4 veces es la identidad.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ESTRUCTURA_TAU.ciclos.map((ciclo, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-ink-700 bg-ink-850/40 px-3 py-3"
              >
                {ciclo.map((v) => (
                  <span key={v} className="flex items-center gap-2">
                    <span className="flex flex-col items-center">
                      <TrigramGlyph v={v} w={20} />
                      <span className="mt-1 font-mono text-[9px] text-sand-500">
                        {nombreTrigrama(v)}
                      </span>
                    </span>
                    <span className="text-sand-600">→</span>
                  </span>
                ))}
                <span className="font-mono text-[10px]" style={{ color: ACCENT }}>
                  ciclo de {ciclo.length}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center font-mono text-[11px] text-sand-500">
            paridad {ESTRUCTURA_TAU.paridad} · {ESTRUCTURA_TAU.inversiones} de{" "}
            {INVERSIONES_MAX_8} inversiones: también aquí, como en el Rey Wen de los 64,
            el desorden ronda la mitad exacta.
          </p>
        </Panel>
      </div>

      {/* Tabla τ */}
      <div>
        <SectionLabel accent={ACCENT}>Dónde se rompe la simetría</SectionLabel>
        <Panel className="mt-2">
          <Prose>
            <p>
              En el Cielo Anterior, los cuatro ejes unen <b>complementos binarios</b>:
              Qian (7) mira a Kun (0), Dui (6) a Gen (1), Li (5) a Kan (2) y Zhen (4) a
              Xun (3). Cada pareja suma 7, que es el NOT bit a bit en 3 líneas. En el
              Cielo Posterior esa propiedad se rompe en tres de los cuatro ejes: solo{" "}
              <b>Li y Kan</b> (el fuego al sur, el agua al norte) siguen enfrentados como
              complementos. Verificado sobre las 8 posiciones: 4 ejes complementarios en
              el Anterior, exactamente 1 en el Posterior.
            </p>
          </Prose>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-center font-mono text-[12px]">
              <thead>
                <tr className="border-b border-ink-700 text-[10px] uppercase tracking-wider text-sand-500">
                  <th className="px-2 py-1.5 font-normal">τ</th>
                  {TAU.map((_, v) => (
                    <th key={v} className="px-2 py-1.5 font-normal text-sand-400">
                      {nombreTrigrama(v)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5 text-sand-500">↓</td>
                  {TAU.map((b, v) => (
                    <td key={v} className="px-2 py-1.5 text-sand-200">
                      {nombreTrigrama(b)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
