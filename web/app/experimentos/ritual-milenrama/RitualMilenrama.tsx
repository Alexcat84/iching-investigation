"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DIECISEISAVOS, ES_MUTANTE, NOMBRE_ESTADO, type Estado } from "@/lib/oraculo";
import {
  coResto,
  DERIVADA,
  generarLinea,
  operar,
  quitadas,
  RAMAS,
  coincideConOraculo,
  type Operacion,
} from "@/lib/milenrama";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#c8873a";
const ESTADOS: Estado[] = [9, 8, 7, 6];
const coincide = coincideConOraculo();

/** Fila de varillas dibujadas como palitos. */
function Varillas({ n, tono = "#cfc7b2" }: { n: number; tono?: string }) {
  return (
    <span
      className="inline-flex max-w-full flex-wrap gap-[3px] align-middle"
      aria-label={`${n} varillas`}
    >
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="inline-block h-4 w-[3px] rounded-sm"
          style={{ background: tono }}
        />
      ))}
    </span>
  );
}

export default function RitualMilenrama() {
  // === Recorrido interactivo ===
  const [ops, setOps] = useState<Operacion[]>([]);
  const [pendiente, setPendiente] = useState<Operacion | null>(null);
  const [tally, setTally] = useState<Record<Estado, number>>({ 6: 0, 7: 0, 8: 0, 9: 0 });

  const pile = ops.length ? ops[ops.length - 1].pileFinal : 49;
  const terminado = ops.length === 3;
  const valor = terminado ? ((pile / 4) as Estado) : null;

  const dividir = () => setPendiente(operar(pile));
  const contar = () => {
    if (!pendiente) return;
    setOps((o) => [...o, pendiente]);
    setPendiente(null);
  };
  const otraLinea = () => {
    if (valor != null) setTally((t) => ({ ...t, [valor]: t[valor] + 1 }));
    setOps([]);
    setPendiente(null);
  };
  const reiniciar = () => {
    setOps([]);
    setPendiente(null);
    setTally({ 6: 0, 7: 0, 8: 0, 9: 0 });
  };

  const totalTally = ESTADOS.reduce((s, e) => s + tally[e], 0);

  // === Simulación masiva ===
  const [sim, setSim] = useState<{ n: number; cnt: Record<Estado, number> } | null>(null);
  const simular = (n: number) => {
    const cnt: Record<Estado, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let i = 0; i < n; i++) {
      let p = 49;
      for (let o = 0; o < 3; o++) p -= quitadas(p, 1 + Math.floor(Math.random() * 4));
      cnt[(p / 4) as Estado]++;
    }
    setSim({ n, cnt });
  };

  return (
    <div>
      <ExperimentHeader
        kicker="蓍 · cincuenta varillas"
        titulo="El ritual de las 49 varillas"
        subtitulo="De dónde salen 1, 3, 5 y 7 dieciseisavos"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El experimento de <b>monedas contra milenrama</b> usa como dato que la
            milenrama reparte sus líneas con probabilidades 3/16, 7/16, 5/16 y 1/16.
            Aquí no las asumimos: las <b>derivamos</b> del procedimiento antiguo. De 50
            varillas se aparta una (queda fuera todo el rito) y las 49 restantes pasan
            por <b>tres operaciones</b>: dividir el manojo en dos, tomar una varilla del
            montón derecho, y contar cada montón de 4 en 4 apartando los restos. Lo que
            queda al final, dividido entre 4, da el valor de la línea: 6, 7, 8 o 9.
          </p>
        </Prose>
      </div>

      {/* Recorrido interactivo */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>El rito, paso a paso</SectionLabel>
        <Panel className="mt-2" accent={ACCENT}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {!terminado && !pendiente && (
              <button
                onClick={dividir}
                className="rounded-full px-4 py-1.5 text-sm"
                style={{ background: ACCENT, color: "#0b0a08" }}
              >
                Dividir el manojo (operación {ops.length + 1} de 3)
              </button>
            )}
            {pendiente && (
              <button
                onClick={contar}
                className="rounded-full px-4 py-1.5 text-sm"
                style={{ background: ACCENT, color: "#0b0a08" }}
              >
                Contar de 4 en 4 y apartar
              </button>
            )}
            {terminado && (
              <button
                onClick={otraLinea}
                className="rounded-full px-4 py-1.5 text-sm"
                style={{ background: ACCENT, color: "#0b0a08" }}
              >
                Registrar y echar otra línea
              </button>
            )}
            {(ops.length > 0 || pendiente || totalTally > 0) && (
              <button
                onClick={reiniciar}
                className="rounded-full border border-ink-700 px-3 py-1.5 text-sm text-sand-400"
              >
                Reiniciar
              </button>
            )}
          </div>

          {/* Estado del manojo */}
          {!pendiente && !terminado && (
            <div className="text-sm text-sand-300">
              <span className="font-mono text-[11px] text-sand-500">manojo · </span>
              <Varillas n={pile} />
              <span className="ml-2 font-mono text-xs" style={{ color: ACCENT }}>
                {pile}
              </span>
              {ops.length === 0 && (
                <p className="mt-2 text-xs text-sand-500">
                  Empiezan 50; una se aparta antes del rito y no vuelve: quedan 49.
                </p>
              )}
            </div>
          )}
          {pendiente && (
            <div className="space-y-2 text-sm text-sand-300">
              <div>
                <span className="font-mono text-[11px] text-sand-500">izquierdo · </span>
                <Varillas n={pendiente.izquierda} />
                <span className="ml-2 font-mono text-xs text-sand-400">
                  {pendiente.izquierda} → resto {pendiente.rL}
                </span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-sand-500">derecho · </span>
                <Varillas n={pendiente.derecha - 1} />
                <span className="ml-1 inline-block h-4 w-[3px] rounded-sm align-middle" style={{ background: ACCENT }} />
                <span className="ml-2 font-mono text-xs text-sand-400">
                  {pendiente.derecha} (una se toma aparte) → resto {pendiente.rR}
                </span>
              </div>
              <p className="font-mono text-xs" style={{ color: ACCENT }}>
                se apartan 1 + {pendiente.rL} + {pendiente.rR} = {pendiente.apartadas} ·
                quedan {pendiente.pileFinal}
              </p>
            </div>
          )}
          {terminado && valor != null && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm text-sand-300">
                <Varillas n={pile} tono={ACCENT} />
              </div>
              <div className="font-mono text-sm text-sand-200">
                {pile} / 4 = <span style={{ color: ACCENT }}>{valor}</span> ·{" "}
                {NOMBRE_ESTADO[valor]}
                {ES_MUTANTE[valor] && <span style={{ color: ACCENT }}> ● mutante</span>}
              </div>
            </div>
          )}

          {/* Historial de operaciones de la línea en curso */}
          {ops.length > 0 && !terminado && (
            <p className="mt-3 font-mono text-[11px] text-sand-500">
              apartadas hasta ahora: {ops.map((o) => o.apartadas).join(" + ")}
            </p>
          )}

          {/* Conteo de líneas generadas contra la teoría */}
          {totalTally > 0 && (
            <div className="mt-4 border-t border-ink-700 pt-3">
              <div className="mb-2 font-mono text-[11px] text-sand-500">
                {totalTally} {totalTally === 1 ? "línea generada" : "líneas generadas"} ·
                frecuencia observada (teórica)
              </div>
              <div className="flex flex-wrap gap-3 font-mono text-xs">
                {ESTADOS.map((e) => (
                  <span key={e} className="text-sand-300">
                    {e}: {tally[e]}{" "}
                    <span className="text-sand-500">
                      ({DERIVADA[e]}/16)
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Supuesto del modelo */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>El supuesto del modelo (nota honesta)</SectionLabel>
        <Panel className="mt-2">
          <Prose>
            <p>
              La derivación exacta depende de un supuesto: en cada división, el resto
              del montón izquierdo al contar de 4 en 4 (1, 2, 3 o 4) se toma como{" "}
              <b>equiprobable</b>. Es el modelo idealizado clásico del rito. Con manos
              reales, que parten el manojo cerca de la mitad, la distribución de restos
              es aproximadamente uniforme pero no exacta: con otros supuestos de
              partición salen otros números. Todo lo que sigue vale bajo ese supuesto,
              que también usa el recorrido interactivo de arriba.
            </p>
          </Prose>
        </Panel>
      </div>

      {/* Derivación exacta: árbol */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>La derivación exacta: el árbol de las 8 ramas</SectionLabel>
        <Panel className="mt-2">
          <ArbolRamas />
          <p className="mt-3 text-sm text-sand-400">
            La primera operación aparta 5 varillas con probabilidad 3/4, o 9 con 1/4.
            Las otras dos apartan 4 u 8 con probabilidad 1/2 cada una. Las 8 ramas
            resultantes, agrupadas por su valor final, dan exactamente 3/16 (yang
            viejo), 7/16 (yin joven), 5/16 (yang joven) y 1/16 (yin viejo).
          </p>
        </Panel>
      </div>

      {/* Cierre del bucle + simulación */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat valor={RAMAS.length} etiqueta="ramas del árbol" accent={ACCENT} />
        <Stat
          valor={coincide ? "idéntica" : "distinta"}
          etiqueta="derivación vs. tabla del oráculo"
          accent={ACCENT}
        />
        <Stat valor="4³ = 64" etiqueta="casos enumerados (restos uniformes)" />
      </div>

      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Cierre del bucle y convergencia</SectionLabel>
        <Panel className="mt-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-sand-400">
              Comparación por estado: derivada aquí, usada por el experimento de
              probabilidades, y simulada.
            </p>
            <button
              onClick={() => simular(100000)}
              className="rounded-full border px-3 py-1.5 font-mono text-xs"
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              Simular 100.000 líneas
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-700 font-mono text-[11px] uppercase tracking-wider text-sand-500">
                  <th className="px-2 py-1.5 font-normal">Estado</th>
                  <th className="px-2 py-1.5 text-right font-normal">Derivada</th>
                  <th className="px-2 py-1.5 text-right font-normal">Tabla del oráculo</th>
                  <th className="px-2 py-1.5 text-right font-normal">Simulada</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                {ESTADOS.map((e) => (
                  <tr key={e} className="border-b border-ink-800 last:border-0">
                    <td className="px-2 py-1.5 text-sand-300">
                      {e} · {NOMBRE_ESTADO[e]}
                      {ES_MUTANTE[e] && <span style={{ color: ACCENT }}> ●</span>}
                    </td>
                    <td className="px-2 py-1.5 text-right text-sand-200">
                      {DERIVADA[e]}/16
                    </td>
                    <td className="px-2 py-1.5 text-right text-sand-200">
                      {DIECISEISAVOS.milenrama[e]}/16{" "}
                      <span
                        className="rounded px-1 text-[10px]"
                        style={{ background: "rgba(95,174,127,0.14)", color: "#7fc79b" }}
                      >
                        {DERIVADA[e] === DIECISEISAVOS.milenrama[e] ? "=" : "≠"}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-right text-sand-400">
                      {sim ? `${((sim.cnt[e] / sim.n) * 100).toFixed(2)} %` : "…"}
                      <span className="text-sand-600">
                        {" "}
                        (teoría {((DERIVADA[e] / 16) * 100).toFixed(2)} %)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-sand-400">
            La tabla que el experimento{" "}
            <Link
              href="/experimentos/probabilidades"
              className="underline decoration-dotted underline-offset-4"
              style={{ color: ACCENT }}
            >
              monedas contra milenrama
            </Link>{" "}
            usa como dato coincide, estado por estado, con la derivación de este rito.
          </p>
        </Panel>
      </div>
    </div>
  );
}

/** Árbol estático de las 8 ramas con fracciones exactas. */
function ArbolRamas() {
  const W = 680;
  const H = 300;
  const slots = RAMAS.length; // 8 hojas
  const xLeaf = (i: number) => 40 + (i * (W - 80)) / (slots - 1);
  // nodos intermedios centrados sobre sus hijos
  const x2 = (i: number) => (xLeaf(i * 2) + xLeaf(i * 2 + 1)) / 2; // 4 nodos
  const x1 = (i: number) => (x2(i * 2) + x2(i * 2 + 1)) / 2; // 2 nodos
  const x0 = (x1(0) + x1(1)) / 2;
  const Y = [24, 100, 176, 252];

  const frac1 = (q: number) => (q === 5 ? "3/4" : "1/4");

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[560px]"
        role="img"
        aria-label="Árbol de derivación del ritual: 8 ramas con fracciones exactas que agrupadas dan 3, 7, 5 y 1 dieciseisavos"
      >
        {/* aristas */}
        {RAMAS.map((r, i) => {
          const i2 = Math.floor(i / 2);
          const i1 = Math.floor(i / 4);
          return (
            <g key={i} stroke="#3a362e" strokeWidth={1}>
              <line x1={x0} y1={Y[0] + 8} x2={x1(i1)} y2={Y[1] - 10} />
              <line x1={x1(i1)} y1={Y[1] + 8} x2={x2(i2)} y2={Y[2] - 10} />
              <line x1={x2(i2)} y1={Y[2] + 8} x2={xLeaf(i)} y2={Y[3] - 12} />
            </g>
          );
        })}
        {/* raíz */}
        <text x={x0} y={Y[0]} textAnchor="middle" className="fill-sand-200" style={{ fontSize: 13, fontFamily: "monospace" }}>
          49
        </text>
        {/* nivel 1: quita 5 o 9 */}
        {[0, 1].map((i) => {
          const q = RAMAS[i * 4].ops[0];
          return (
            <g key={i}>
              <text x={x1(i)} y={Y[1]} textAnchor="middle" className="fill-sand-200" style={{ fontSize: 12, fontFamily: "monospace" }}>
                −{q} → {49 - q}
              </text>
              <text x={x1(i)} y={Y[1] + 14} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace", fill: "#c8873a" }}>
                {frac1(q)}
              </text>
            </g>
          );
        })}
        {/* nivel 2 */}
        {[0, 1, 2, 3].map((i) => {
          const r = RAMAS[i * 2];
          const tras1 = 49 - r.ops[0];
          const q = r.ops[1];
          return (
            <g key={i}>
              <text x={x2(i)} y={Y[2]} textAnchor="middle" className="fill-sand-200" style={{ fontSize: 12, fontFamily: "monospace" }}>
                −{q} → {tras1 - q}
              </text>
              <text x={x2(i)} y={Y[2] + 14} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace", fill: "#c8873a" }}>
                1/2
              </text>
            </g>
          );
        })}
        {/* hojas */}
        {RAMAS.map((r, i) => (
          <g key={`h${i}`}>
            <text x={xLeaf(i)} y={Y[3]} textAnchor="middle" className="fill-sand-100" style={{ fontSize: 12, fontFamily: "monospace" }}>
              {r.restantes} → {r.valor}
            </text>
            <text x={xLeaf(i)} y={Y[3] + 15} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace", fill: "#c8873a" }}>
              {r.num64 / 4}/16
            </text>
            <text x={xLeaf(i)} y={Y[3] + 29} textAnchor="middle" className="fill-sand-500" style={{ fontSize: 9, fontFamily: "monospace" }}>
              {NOMBRE_ESTADO[r.valor]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
