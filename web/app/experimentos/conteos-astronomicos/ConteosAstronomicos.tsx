"use client";

import { CITADOS, COMPUTADOS, DISTANCIA } from "@/lib/conteos";
import { ExperimentHeader, Panel, Prose, SectionLabel } from "@/components/ui";

const ACCENT = "#8a9bb0";

export default function ConteosAstronomicos() {
  const maxD = Math.max(...DISTANCIA);
  return (
    <div>
      <ExperimentHeader
        kicker="∞ · los números grandes de Q6"
        titulo="Conteos astronómicos del cubo"
        subtitulo="Cifras del hipercubo de los hexagramas, cada una con su fuente"
        accent={ACCENT}
      />

      <div className="mb-8">
        <Prose>
          <p>
            El hipercubo de los 64 hexagramas esconde números enormes. Aquí están los que
            se pueden calcular con una fórmula cerrada (y se verifican) y los que solo se
            citan porque su cómputo excede lo razonable. La regla del laboratorio se
            respeta al pie: <b>ninguna cifra sin fuente</b>.
          </p>
        </Prose>
      </div>

      {/* Computados */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Computados y verificados</SectionLabel>
        <div className="mt-2 overflow-x-auto rounded-xl border border-ink-700">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-850/60 font-mono text-[11px] uppercase tracking-wider text-sand-500">
                <th className="px-3 py-2 font-normal">Cantidad</th>
                <th className="px-3 py-2 text-right font-normal">Valor</th>
                <th className="px-3 py-2 text-right font-normal">Fórmula</th>
              </tr>
            </thead>
            <tbody className="text-sand-300">
              {COMPUTADOS.map((c) => (
                <tr key={c.etiqueta} className="border-b border-ink-800 last:border-0">
                  <td className="px-3 py-2">
                    {c.etiqueta}
                    <div className="font-mono text-[10px] text-sand-600">{c.fuente}</div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono" style={{ color: ACCENT }}>{c.valor}</td>
                  <td className="px-3 py-2 text-right font-mono text-[12px] text-sand-400">{c.formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distancia de Hamming */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Hexagramas a cada distancia (coeficientes binomiales de 6)</SectionLabel>
        <Panel className="mt-2">
          <div className="flex items-end justify-between gap-2" style={{ height: 130 }}>
            {DISTANCIA.map((d, k) => (
              <div key={k} className="flex flex-1 flex-col items-center">
                <span className="mb-1 font-mono text-[11px] text-sand-300">{d}</span>
                <div className="w-full rounded-t-sm" style={{ height: `${(d / maxD) * 100}%`, background: ACCENT, opacity: 0.4 + 0.6 * (d / maxD) }} />
                <span className="mt-1.5 font-mono text-[10px] text-sand-500">d={k}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[11px] text-sand-500">
            desde cualquier hexagrama hay C(6,k) a distancia k: 1, 6, 15, 20, 15, 6, 1
            (suman 64). El único a distancia 6 es su opuesto (dui).
          </p>
        </Panel>
      </div>

      {/* Citados */}
      <div>
        <SectionLabel accent={ACCENT}>Citados (demasiado grandes para reproducir)</SectionLabel>
        <div className="mt-2 space-y-3">
          {CITADOS.map((c) => (
            <Panel key={c.etiqueta}>
              <div className="text-base text-sand-100">{c.etiqueta}</div>
              <p className="mt-1 text-sm text-sand-400">{c.descripcion}</p>
              <p className="mt-2 font-mono text-[11px]" style={{ color: ACCENT }}>
                fuente: {c.fuente}
              </p>
            </Panel>
          ))}
        </div>
        <p className="mt-4 text-sm text-sand-500">
          Su número crece de forma super-exponencial con la dimensión del cubo: los
          valores exactos para cada dimensión están tabulados en la fuente citada. Q6 vive
          tantos órdenes de magnitud arriba que se cita en vez de imprimirse; el
          laboratorio no publica una cifra sin su fuente.
        </p>
      </div>
    </div>
  );
}
