"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import { METODOS } from "@/lib/oraculo";
import {
  correlacionYang,
  estacionaria,
  lambda2,
  paso,
  yangEsperado,
} from "@/lib/transicion";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";
import { NotaAlMargen } from "@/components/NotaAlMargen";

const ACCENT = "#6a9fd0";

function pos(v: number, cx: number, cy: number, r: number): [number, number] {
  const a = -Math.PI / 2 + (v * 2 * Math.PI) / 64;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function AnilloEstacionario({
  metodo,
  color,
}: {
  metodo: "monedas" | "milenrama";
  color: string;
}) {
  const pi = useMemo(() => estacionaria(metodo), [metodo]);
  const maxP = Math.max(...pi);
  const S = 300;
  const C = S / 2;
  const R = 122;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-[300px]" role="img" aria-label={`distribución estacionaria (${metodo})`}>
      <circle cx={C} cy={C} r={R + 14} fill="none" stroke="#2A2620" />
      {Array.from({ length: 64 }, (_, v) => {
        const [x, y] = pos(v, C, C, R);
        const r = 2 + (pi[v] / maxP) * 9;
        return (
          <circle
            key={v}
            cx={x}
            cy={y}
            r={r}
            fill={color}
            opacity={0.35 + 0.65 * (pi[v] / maxP)}
          >
            <title>{`${hex(v).kw}. ${hex(v).py}: ${(pi[v] * 100).toFixed(2)}%`}</title>
          </circle>
        );
      })}
      <text x={C} y={C - 4} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace" }} fill="#8a8271">
        Qian
      </text>
      <text x={C} y={C + 10} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace" }} fill="#8a8271">
        arriba
      </text>
    </svg>
  );
}

export default function MarkovConsultas() {
  const [sim, setSim] = useState<Record<string, number> | null>(null);

  const datos = METODOS.map((m) => {
    const pi = estacionaria(m.id);
    return {
      ...m,
      pi,
      corr: correlacionYang(pi),
      Ey: yangEsperado(pi),
      lam: lambda2(m.id),
      kun: pi[0],
      qian: pi[63],
    };
  });

  const simular = () => {
    const out: Record<string, number> = {};
    for (const m of METODOS) {
      let v = 63; // arranca en Qian (todo yang) para ver la deriva
      let sumaYang = 0;
      const pasos = 200000;
      const quema = 20;
      for (let t = 0; t < pasos + quema; t++) {
        v = paso(v, m.id);
        if (t >= quema) sumaYang += popcount(v);
      }
      out[m.id] = sumaYang / pasos;
    }
    setSim(out);
  };

  return (
    <div>
      <ExperimentHeader
        kicker="π · cadena de Markov sobre Q6"
        titulo="La cadena de Markov de las consultas"
        subtitulo="¿Hacia dónde deriva una serie de lecturas?"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Si encadenamos consultas (tomando el hexagrama <b>futuro</b> de una como el{" "}
            <b>presente</b> de la siguiente) tenemos una cadena de Markov sobre los 64
            estados. Cada línea muta según su método (derivado de{" "}
            <Link href="/experimentos/probabilidades" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              monedas contra milenrama
            </Link>
            ). La pregunta: ¿la asimetría de la milenrama <b>sesga</b> hacia dónde viaja
            la serie? La distribución <b>estacionaria</b> (a dónde tiende a largo plazo) lo
            responde, y el <b>teorema de Perron-Frobenius</b> garantiza que es única: como
            la matriz de transición es positiva, tiene un autovalor 1 simple y dominante (el
            segundo módulo es exactamente 0,5, la misma velocidad de mezcla en ambos
            métodos).
          </p>
        </Prose>
      </div>

      {/* Los dos anillos */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {datos.map((m) => (
          <Panel key={m.id} className="flex flex-col items-center">
            <div className="mb-2 flex items-center gap-2 self-start">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
              <SectionLabel>{m.nombre}</SectionLabel>
            </div>
            <AnilloEstacionario metodo={m.id} color={m.color} />
            <p className="mt-2 text-center font-mono text-[10px] text-sand-500">
              {m.id === "monedas"
                ? "todos los tamaños iguales: estacionaria uniforme (1/64)"
                : "Kun (yin) domina; Qian (yang) casi desaparece: sesgo al yin"}
            </p>
          </Panel>
        ))}
      </div>

      {/* Comparativa */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>La estacionaria: uniforme contra sesgada</SectionLabel>
        <div className="mt-2 overflow-x-auto rounded-xl border border-ink-700">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-850/60 font-mono text-[11px] uppercase tracking-wider text-sand-500">
                <th className="px-3 py-2 font-normal">Método</th>
                <th className="px-3 py-2 text-right font-normal">π(Kun)</th>
                <th className="px-3 py-2 text-right font-normal">π(Qian)</th>
                <th className="px-3 py-2 text-right font-normal">Kun / Qian</th>
                <th className="px-3 py-2 text-right font-normal">yang esperado</th>
                <th className="px-3 py-2 text-right font-normal">corr(π, yang)</th>
                <th className="px-3 py-2 text-right font-normal">λ₂</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[13px] text-sand-300">
              {datos.map((m) => (
                <tr key={m.id} className="border-b border-ink-800 last:border-0">
                  <td className="px-3 py-2" style={{ color: m.color }}>{m.nombre}</td>
                  <td className="px-3 py-2 text-right">{(m.kun * 100).toFixed(2)}%</td>
                  <td className="px-3 py-2 text-right">{(m.qian * 100).toFixed(3)}%</td>
                  <td className="px-3 py-2 text-right">{Math.round(m.kun / m.qian)}</td>
                  <td className="px-3 py-2 text-right">{m.Ey.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right" style={{ color: ACCENT }}>{m.corr.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">{m.lam.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sand-300">
          Con monedas la estacionaria es <b>uniforme</b> (1/64 cada hexagrama, correlación
          0). Con milenrama <b style={{ color: ACCENT }}>no</b>: se sesga hacia el yin, con
          correlación −0,73 entre probabilidad y número de líneas yang. Kun es <b>729</b>{" "}
          veces más probable que Qian<NotaAlMargen slug="markov-consultas" indice={0} />, y el
          número de yang esperado cae de 3 a 1,5. La
          causa es que el yang viejo (3/16) muta más que el yin viejo (1/16): el yang
          decae hacia el yin. Curiosamente ambos métodos mezclan a la <b>misma</b>{" "}
          velocidad (λ₂ = 0,5, relajación 2 pasos): igual de rápido, pero a destinos
          distintos.
        </p>
      </div>

      {/* Simulador */}
      <div>
        <SectionLabel accent={ACCENT}>Simulador: la deriva desde Qian</SectionLabel>
        <Panel className="mt-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-sand-400">
              Arranca en Qian (6 yang) y encadena 200.000 consultas: ¿en cuántas líneas
              yang se estabiliza el promedio?
            </p>
            <button
              onClick={simular}
              className="rounded-full border px-3 py-1.5 font-mono text-xs"
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              Simular
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {datos.map((m) => (
              <Stat
                key={m.id}
                valor={sim ? sim[m.id].toFixed(2) : "–"}
                etiqueta={`${m.nombre}: yang medio (teoría ${m.Ey.toFixed(1)})`}
                accent={m.color}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function popcount(v: number): number {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (v >> k) & 1;
  return n;
}
