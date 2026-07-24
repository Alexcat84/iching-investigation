"use client";

import { useState } from "react";
import Link from "next/link";
import { PROPIEDADES, influencias, totalDirecta, totalWalsh } from "@/lib/influencias";
import { LINE_MEANING } from "@/lib/iching";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#b57bb0";

export default function InfluenciasLineas() {
  const [pi, setPi] = useState(0);
  const P = PROPIEDADES[pi];
  const inf = influencias(P);
  const total = totalDirecta(P);
  const walsh = totalWalsh(P);
  const maxInf = Math.max(...inf, 1);

  return (
    <div>
      <ExperimentHeader
        kicker="∂ · 易 · funciones booleanas"
        titulo="Las influencias de las líneas"
        subtitulo="Cuánto pesa cada línea en una propiedad"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Toda propiedad de un hexagrama (cumplir una regla, caer en una familia) es una{" "}
            <b>función booleana de 6 variables</b>. La <b>influencia</b> de la línea k es la
            probabilidad de que, al voltear esa línea, cambie el veredicto: qué tan decisiva
            es. Elige una propiedad del propio sitio y mira el reparto.
          </p>
        </Prose>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {PROPIEDADES.map((p, i) => (
          <button key={p.id} onClick={() => setPi(i)} className="rounded-full border px-3 py-1.5 text-xs transition-colors" style={pi === i ? { background: ACCENT, color: "#0b0a08", borderColor: "transparent" } : { borderColor: "#3A362E", color: "#8a8271" }}>
            {p.nombre}
          </button>
        ))}
      </div>

      <Panel className="mb-6" accent={ACCENT}>
        <svg viewBox="0 0 400 200" className="mx-auto w-full max-w-[460px]" role="img" aria-label={`Influencia de cada una de las 6 líneas para la propiedad ${P.nombre}.`}>
          {inf.map((v, i) => {
            const bw = 44;
            const x = 24 + i * 62;
            const h = (v / maxInf) * 150 + 2;
            return (
              <g key={i}>
                <rect x={x} y={168 - h} width={bw} height={h} rx={2} fill={ACCENT} opacity={0.55 + 0.45 * (v / maxInf)} />
                <text x={x + bw / 2} y={168 - h - 5} textAnchor="middle" fontSize={12} fill="#cfc6b0" fontFamily="ui-monospace, monospace">
                  {v}/64
                </text>
                <text x={x + bw / 2} y={184} textAnchor="middle" fontSize={10} fill="#7a715e" fontFamily="ui-monospace, monospace">
                  línea {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-1 text-center font-mono text-[10px] text-sand-500">
          influencia = fracción de los 64 hexagramas donde voltear esa línea cambia el veredicto
        </p>
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={inf.join(" ")} etiqueta="influencias por línea (/64)" accent={ACCENT} />
        <Stat valor={total.toFixed(4)} etiqueta="influencia total (directa)" />
        <Stat valor={walsh.toFixed(4)} etiqueta="vía espectro de Walsh" accent={ACCENT} />
        <Stat valor={Math.abs(total - walsh) < 1e-9 ? "✓ coinciden" : "≠"} etiqueta="el teorema que une con el exp. 23" />
      </div>

      <Panel>
        <Prose>
          <p>
            La <b>influencia total</b> (la suma de las seis) coincide exactamente con la{" "}
            <b>suma espectral ponderada de Walsh</b> (cada coeficiente al cuadrado, pesado por
            su número de líneas): el teorema del análisis de funciones booleanas que enlaza
            este experimento con{" "}
            <Link href="/experimentos/espectro-walsh" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Fourier sobre el cubo
            </Link>
            . Para la paridad de yang, voltear cualquier línea siempre cambia la paridad, así
            que las seis influyen 1: una función máximamente sensible.
          </p>
          <p className="text-sm text-sand-400">
            Curiosidad, no teorema: para la regla sin dos yin, las líneas que más pesan son la{" "}
            <b>2</b> ({LINE_MEANING[2].titulo.toLowerCase()}) y la <b>5</b> ({LINE_MEANING[5].titulo.toLowerCase()}),
            justo las dos que la tradición señala como centrales. Es una resonancia sugerente;
            la matemática solo dice que son las líneas interiores, con dos vecinos cada una.
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
