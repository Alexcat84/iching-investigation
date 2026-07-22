"use client";

import { useState } from "react";
import Link from "next/link";
import { ES_MUTANTE, ES_YANG, NOMBRE_ESTADO } from "@/lib/oraculo";
import {
  ESTADOS,
  fichasIgualMilenrama,
  METODOS_SORTEO,
  simular,
  type Simulacion,
} from "@/lib/sorteo";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#d98f6b";
const fichasOk = fichasIgualMilenrama();

export default function ComparadorSorteo() {
  const [sim, setSim] = useState<Record<string, Simulacion> | null>(null);

  const correr = () => {
    const out: Record<string, Simulacion> = {};
    for (const m of METODOS_SORTEO) out[m.id] = simular(m.dieciseisavos, 50000);
    setSim(out);
  };

  return (
    <div>
      <ExperimentHeader
        kicker="⚄ · tres formas de echar una línea"
        titulo="Comparador de métodos de sorteo"
        subtitulo="Monedas, milenrama y 16 fichas, lado a lado"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Hay varias formas de generar una línea, y <b>no todas dan lo mismo</b>. Las
            tres monedas reparten los cuatro resultados de forma simétrica; la milenrama
            (49 varillas), no. Y las <b>16 fichas</b> —una simplificación moderna— se
            construyen para reproducir exactamente la milenrama. Aquí están las tres
            distribuciones y un simulador que converge a ellas en vivo. Lo importante para
            quien consulta de verdad: monedas y milenrama <b>no son intercambiables</b>.
          </p>
        </Prose>
      </div>

      {/* Las tres distribuciones */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {METODOS_SORTEO.map((m) => (
          <Panel key={m.id}>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
              <SectionLabel>{m.nombre}</SectionLabel>
            </div>
            <div className="space-y-1.5">
              {ESTADOS.map((e) => {
                const num = m.dieciseisavos[e];
                return (
                  <div key={e} className="flex items-center gap-2">
                    <span className="w-20 shrink-0 font-mono text-[10px] text-sand-400">
                      {e} · {NOMBRE_ESTADO[e]}
                    </span>
                    <div className="relative h-3.5 flex-1 overflow-hidden rounded-sm bg-ink-800">
                      <div
                        className="h-full rounded-sm"
                        style={{ width: `${(num / 16) * 100}%`, background: m.color, opacity: ES_MUTANTE[e] ? 1 : 0.5 }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right font-mono text-[10px] text-sand-400">{num}/16</span>
                  </div>
                );
              })}
            </div>
            {m.cita && <p className="mt-2 font-mono text-[9px] leading-snug text-sand-600">{m.cita}</p>}
          </Panel>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat
          valor={fichasOk ? "idénticas" : "distintas"}
          etiqueta="16 fichas vs milenrama"
          accent={ACCENT}
        />
        <Stat valor="1/4" etiqueta="P(muta) en los tres métodos" />
        <Stat valor="≠" etiqueta="monedas vs milenrama" accent={ACCENT} />
      </div>

      {/* Simulador */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel accent={ACCENT}>Simulador: 50.000 líneas por método</SectionLabel>
          <button
            onClick={correr}
            className="rounded-full border px-3 py-1.5 font-mono text-xs"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            Tirar
          </button>
        </div>
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-700 font-mono text-[11px] uppercase tracking-wider text-sand-500">
                  <th className="px-2 py-1.5 font-normal">Método</th>
                  {ESTADOS.map((e) => (
                    <th key={e} className="px-2 py-1.5 text-right font-normal">
                      {e} {ES_YANG[e] ? "yang" : "yin"}
                      {ES_MUTANTE[e] ? "▪" : ""}
                    </th>
                  ))}
                  <th className="px-2 py-1.5 text-right font-normal">χ² (3 gl)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[12px] text-sand-300">
                {METODOS_SORTEO.map((m) => {
                  const s = sim?.[m.id];
                  return (
                    <tr key={m.id} className="border-b border-ink-800 last:border-0">
                      <td className="px-2 py-1.5" style={{ color: m.color }}>{m.nombre}</td>
                      {ESTADOS.map((e) => (
                        <td key={e} className="px-2 py-1.5 text-right">
                          {s ? `${((s.counts[e] / s.n) * 100).toFixed(1)}%` : "—"}
                          <span className="text-sand-600"> ({((m.dieciseisavos[e] / 16) * 100).toFixed(1)})</span>
                        </td>
                      ))}
                      <td className="px-2 py-1.5 text-right" style={{ color: s && s.chi2 < 16.27 ? "#7fc79b" : "#e24b3b" }}>
                        {s ? s.chi2.toFixed(2) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 font-mono text-[10px] text-sand-500">
            porcentaje simulado (teoría entre paréntesis) · χ² bajo 16,27 = compatible con
            la teoría a p &gt; 0,001 (3 grados de libertad)
          </p>
        </Panel>
      </div>

      <div>
        <Panel accent={ACCENT}>
          <Prose>
            <p>
              La conclusión práctica: si consultas con monedas creyendo que equivale a la
              milenrama, te equivocas. Las dos comparten P(yang) = ½ y P(muta) = ¼, pero
              reparten de forma distinta la <b>dirección</b> del cambio (ver{" "}
              <Link href="/experimentos/probabilidades" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
                monedas contra milenrama
              </Link>{" "}
              y la{" "}
              <Link href="/experimentos/markov-consultas" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
                cadena de Markov
              </Link>
              ). Las 16 fichas, en cambio, <b style={{ color: ACCENT }}>sí</b> son un
              sustituto exacto de la milenrama: misma distribución, verificada.
            </p>
          </Prose>
        </Panel>
      </div>
    </div>
  );
}
