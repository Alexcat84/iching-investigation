"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DIECISEISAVOS,
  ES_MUTANTE,
  METODOS,
  NOMBRE_ESTADO,
  simular,
  teoria,
  type Agregados,
  type Estado,
  type Metodo,
} from "@/lib/oraculo";
import { ExperimentHeader, Panel, Prose, SectionLabel } from "@/components/ui";

const ACCENT = "#cf7a2e";
const COLOR: Record<Metodo, string> = { monedas: "#5b8fd9", milenrama: "#cf7a2e" };
const ESTADOS: Estado[] = [9, 8, 7, 6];

export default function Probabilidades() {
  const [agg, setAgg] = useState<Record<Metodo, Agregados> | null>(null);
  const [n, setN] = useState(20000);
  const [corriendo, setCorriendo] = useState(false);

  const correr = (cuenta: number) => {
    setCorriendo(true);
    // El cómputo es rápido; lo diferimos un frame para no bloquear el clic.
    requestAnimationFrame(() => {
      setAgg({
        monedas: simular("monedas", cuenta),
        milenrama: simular("milenrama", cuenta),
      });
      setN(cuenta);
      setCorriendo(false);
    });
  };

  useEffect(() => {
    correr(20000);
  }, []);

  const tMon = teoria("monedas");
  const tMil = teoria("milenrama");

  return (
    <div>
      <ExperimentHeader
        kicker="䷚ · probabilidad del oráculo"
        titulo="Monedas contra milenrama"
        subtitulo="Dos métodos, la misma balanza yin-yang… y un futuro distinto"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Para consultar el oráculo hay que generar seis líneas, cada una en uno de
            cuatro estados: <b>yang joven</b> o <b>yin joven</b> (estáticas) y{" "}
            <b>yang viejo</b> o <b>yin viejo</b> (mutantes). Las tres monedas dan una
            distribución simétrica; el método antiguo de las 49 varillas de milenrama,
            no. La pregunta: ¿en qué se nota?
          </p>
        </Prose>
      </div>

      {/* Distribuciones de los cuatro estados */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {METODOS.map((m) => (
          <Panel key={m.id}>
            <div className="mb-3 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: m.color }}
              />
              <SectionLabel>{m.nombre}</SectionLabel>
            </div>
            <div className="space-y-2">
              {ESTADOS.map((e) => {
                const num = DIECISEISAVOS[m.id][e];
                const pct = (num / 16) * 100;
                return (
                  <div key={e} className="flex items-center gap-2">
                    <span className="w-24 shrink-0 font-mono text-[11px] text-sand-400">
                      {e} · {NOMBRE_ESTADO[e]}
                    </span>
                    <div className="relative h-4 flex-1 overflow-hidden rounded-sm bg-ink-800">
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${pct}%`,
                          background: m.color,
                          opacity: ES_MUTANTE[e] ? 1 : 0.5,
                        }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right font-mono text-[11px] text-sand-400">
                      {num}/16
                    </span>
                    {ES_MUTANTE[e] && (
                      <span
                        className="font-mono text-[9px]"
                        style={{ color: m.color }}
                        title="línea mutante"
                      >
                        ●
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 font-mono text-[10px] text-sand-600">
              ● = estado mutante · barra tenue = línea estática
            </p>
          </Panel>
        ))}
      </div>

      {/* Coincidencias y diferencias teóricas */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Lo que coincide y lo que no (exacto)</SectionLabel>
        <div className="mt-2 overflow-hidden rounded-xl border border-ink-700">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-850/60 font-mono text-[11px] uppercase tracking-wider text-sand-500">
                <th className="px-3 py-2 font-normal">Magnitud</th>
                <th className="px-3 py-2 text-right font-normal" style={{ color: COLOR.monedas }}>
                  Monedas
                </th>
                <th className="px-3 py-2 text-right font-normal" style={{ color: COLOR.milenrama }}>
                  Milenrama
                </th>
                <th className="px-3 py-2 text-right font-normal">Veredicto</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[13px]">
              <FilaComp
                label="P(línea presente = yang)"
                a={tMon.pYang}
                b={tMil.pYang}
                fmt={frac}
              />
              <FilaComp
                label="P(línea muta)"
                a={tMon.pMuta}
                b={tMil.pMuta}
                fmt={frac}
              />
              <FilaComp
                label="líneas yang esperadas (presente)"
                a={tMon.yangPresenteEsperado}
                b={tMil.yangPresenteEsperado}
                fmt={(x) => x.toFixed(2)}
              />
              <FilaComp
                label="entre las mutantes, cuota yang viejo"
                a={tMon.cuotaYangViejo}
                b={tMil.cuotaYangViejo}
                fmt={(x) => `${Math.round(x * 100)} %`}
              />
              <FilaComp
                label="líneas yang esperadas (futuro)"
                a={tMon.yangFuturoEsperado}
                b={tMil.yangFuturoEsperado}
                fmt={(x) => x.toFixed(2)}
                resaltar
              />
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sand-300">
          El hexagrama <b className="text-sand-200">presente</b> sale idéntico en ambos
          métodos: cada línea es yang con probabilidad ½, así que los 64 hexagramas son
          equiprobables. Y la <b className="text-sand-200">tasa de cambio</b> también
          coincide: ¼ por línea. La milenrama solo rompe la simetría en la{" "}
          <b style={{ color: ACCENT }}>dirección</b> del cambio: una línea mutante es
          tres veces más propensa a ser yang-que-cae-a-yin. Consecuencia medible: el
          hexagrama <b style={{ color: ACCENT }}>futuro</b> se inclina hacia el yin
          (2,25 líneas yang frente a 3,00).
        </p>
      </div>

      {/* Simulación */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <SectionLabel accent={ACCENT}>Simulación en vivo</SectionLabel>
        <div className="flex items-center gap-2">
          {[5000, 20000, 100000].map((c) => (
            <button
              key={c}
              onClick={() => correr(c)}
              disabled={corriendo}
              className="rounded-full border px-3 py-1.5 font-mono text-xs transition-colors disabled:opacity-50"
              style={{
                borderColor: n === c ? ACCENT : "#3A362E",
                color: n === c ? ACCENT : "#8a8271",
              }}
            >
              {c.toLocaleString("es")} lecturas
            </button>
          ))}
        </div>
      </div>

      {agg && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel>
            <SectionLabel>Líneas mutantes por lectura</SectionLabel>
            <p className="mb-3 mt-1 text-xs text-sand-500">
              Las dos distribuciones se solapan casi perfectamente: la cantidad de
              cambio es la misma.
            </p>
            <HistCambios agg={agg} />
          </Panel>

          <Panel>
            <SectionLabel>Dirección del cambio (líneas mutantes)</SectionLabel>
            <p className="mb-3 mt-1 text-xs text-sand-500">
              Aquí divergen: la milenrama favorece el yang viejo (yang → yin) 3 a 1.
            </p>
            <SplitCambios agg={agg} />
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-700 pt-3">
              {METODOS.map((m) => {
                const a = agg[m.id];
                const yFut = a.sumaYangFuturo / (a.n * 6);
                return (
                  <div key={m.id}>
                    <div className="font-mono text-[10px]" style={{ color: m.color }}>
                      {m.nombre}
                    </div>
                    <div className="mt-0.5 font-mono text-lg text-sand-100">
                      {(yFut * 6).toFixed(2)}
                    </div>
                    <div className="font-mono text-[10px] text-sand-600">
                      líneas yang en el futuro
                    </div>
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

function frac(x: number): string {
  if (Math.abs(x - 0.5) < 1e-9) return "1/2";
  if (Math.abs(x - 0.25) < 1e-9) return "1/4";
  return x.toFixed(3);
}

function FilaComp({
  label,
  a,
  b,
  fmt,
  resaltar,
}: {
  label: string;
  a: number;
  b: number;
  fmt: (x: number) => string;
  resaltar?: boolean;
}) {
  const igual = Math.abs(a - b) < 1e-9;
  return (
    <tr className="border-b border-ink-800 last:border-0">
      <td className="px-3 py-2 text-sand-300" style={{ fontFamily: "var(--font-serif)" }}>
        {label}
      </td>
      <td className="px-3 py-2 text-right text-sand-200">{fmt(a)}</td>
      <td className="px-3 py-2 text-right text-sand-200">{fmt(b)}</td>
      <td className="px-3 py-2 text-right">
        <span
          className="rounded px-1.5 py-0.5 text-[11px]"
          style={{
            background: igual ? "rgba(95,174,127,0.14)" : "rgba(207,122,46,0.16)",
            color: igual ? "#7fc79b" : ACCENT,
          }}
        >
          {igual ? "idéntico" : resaltar ? "◆ distinto" : "distinto"}
        </span>
      </td>
    </tr>
  );
}

/** Histograma agrupado del nº de líneas mutantes por lectura (0..6). */
function HistCambios({ agg }: { agg: Record<Metodo, Agregados> }) {
  const maxProp = useMemo(() => {
    let mx = 0;
    for (const m of METODOS)
      for (const c of agg[m.id].histCambios) mx = Math.max(mx, c / agg[m.id].n);
    return mx;
  }, [agg]);

  const H = 150;
  const barsPerGroup = 2;
  return (
    <div>
      <svg viewBox={`0 0 320 ${H + 26}`} className="w-full" role="img" aria-label="histograma de líneas mutantes">
        {[0, 1, 2, 3, 4, 5, 6].map((c, gi) => {
          const groupW = 320 / 7;
          const bw = (groupW - 8) / barsPerGroup;
          return (
            <g key={c} transform={`translate(${gi * groupW + 4},0)`}>
              {METODOS.map((m, mi) => {
                const prop = agg[m.id].histCambios[c] / agg[m.id].n;
                const h = maxProp > 0 ? (prop / maxProp) * H : 0;
                return (
                  <rect
                    key={m.id}
                    x={mi * bw}
                    y={H - h}
                    width={bw - 2}
                    height={Math.max(h, 0.5)}
                    rx={2}
                    fill={m.color}
                  />
                );
              })}
              <text
                x={groupW / 2 - 4}
                y={H + 16}
                textAnchor="middle"
                className="fill-sand-500"
                style={{ fontSize: 10, fontFamily: "monospace" }}
              >
                {c}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-sand-500">
        <span>nº de líneas mutantes</span>
        <Leyenda />
      </div>
    </div>
  );
}

/** Barras yang-viejo vs yin-viejo por método. */
function SplitCambios({ agg }: { agg: Record<Metodo, Agregados> }) {
  return (
    <div className="space-y-3">
      {METODOS.map((m) => {
        const a = agg[m.id];
        const total = a.yangViejo + a.yinViejo;
        const pYV = total > 0 ? a.yangViejo / total : 0;
        return (
          <div key={m.id}>
            <div className="mb-1 flex items-center justify-between font-mono text-[11px]">
              <span style={{ color: m.color }}>{m.nombre}</span>
              <span className="text-sand-500">
                {Math.round(pYV * 100)} % yang viejo
              </span>
            </div>
            <div className="flex h-5 overflow-hidden rounded-sm">
              <div
                className="flex items-center justify-start pl-2"
                style={{ width: `${pYV * 100}%`, background: m.color }}
              >
                {pYV > 0.15 && (
                  <span className="font-mono text-[9px] text-ink-950">yang viejo</span>
                )}
              </div>
              <div
                className="ml-0.5 flex items-center justify-end pr-2"
                style={{ width: `${(1 - pYV) * 100}%`, background: m.color, opacity: 0.4 }}
              >
                {1 - pYV > 0.15 && (
                  <span className="font-mono text-[9px] text-ink-950">yin viejo</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Leyenda() {
  return (
    <span className="flex items-center gap-3">
      {METODOS.map((m) => (
        <span key={m.id} className="flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: m.color }}
          />
          {m.id}
        </span>
      ))}
    </span>
  );
}
