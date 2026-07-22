"use client";

import { useMemo, useState } from "react";
import {
  ari,
  cruce,
  getParticion,
  MASCARAS_PALACIO,
  mascarasSonSubgrupo,
  PARTICIONES,
} from "@/lib/particiones";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#7f8fd0";
const masksSub = mascarasSonSubgrupo();

export default function ComparadorParticiones() {
  const [idA, setIdA] = useState("palacios");
  const [idB, setIdB] = useState("cosets");

  const A = getParticion(idA);
  const B = getParticion(idB);
  const valorAri = useMemo(() => ari(A, B), [A, B]);
  const M = useMemo(() => cruce(A, B), [A, B]);
  const maxCell = Math.max(...M.flat());

  const veredicto =
    Math.abs(valorAri - 1) < 1e-9
      ? "idénticas"
      : valorAri > 0.3
        ? "muy parecidas"
        : valorAri > 0.05
          ? "algo relacionadas"
          : valorAri > -0.05
            ? "independientes"
            : "más distintas que el azar";

  return (
    <div>
      <ExperimentHeader
        kicker="≈ · índice de Rand ajustado"
        titulo="Comparador de particiones"
        subtitulo="¿Cuánto se parecen dos formas de agrupar los 64?"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El sitio parte los 64 hexagramas de varias maneras: los palacios de Jing
            Fang, las cuencas del mapa nuclear, los cosets del subgrupo de puros, y las
            filas y columnas de trigramas. ¿Cuánto se parecen dos cualesquiera? El{" "}
            <b>índice de Rand ajustado</b> (ARI) lo mide: 1 si son idénticas, 0 si son
            independientes, negativo si se separan más que el azar.
          </p>
        </Prose>
      </div>

      {/* Selectores */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="pa" className="font-mono text-[11px] text-sand-500">A</label>
          <select id="pa" value={idA} onChange={(e) => setIdA(e.target.value)} className="rounded-md border border-ink-600 bg-ink-850 px-2 py-1.5 font-mono text-xs text-sand-200">
            {PARTICIONES.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.k})</option>
            ))}
          </select>
        </div>
        <span className="text-sand-600">vs</span>
        <div className="flex items-center gap-2">
          <label htmlFor="pb" className="font-mono text-[11px] text-sand-500">B</label>
          <select id="pb" value={idB} onChange={(e) => setIdB(e.target.value)} className="rounded-md border border-ink-600 bg-ink-850 px-2 py-1.5 font-mono text-xs text-sand-200">
            {PARTICIONES.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.k})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat valor={valorAri.toFixed(3)} etiqueta="índice de Rand ajustado" accent={ACCENT} />
        <Stat valor={veredicto} etiqueta="veredicto" />
        <Stat valor={`${A.k} × ${B.k}`} etiqueta="grupos comparados" />
      </div>

      {/* Matriz de cruce */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Matriz de cruce</SectionLabel>
        <Panel className="mt-2">
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-0.5 text-center font-mono text-[11px]">
              <thead>
                <tr>
                  <th className="p-1 text-sand-600">A \ B</th>
                  {Array.from({ length: B.k }, (_, j) => (
                    <th key={j} className="p-1 font-normal text-sand-500">{j}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {M.map((fila, i) => (
                  <tr key={i}>
                    <th className="p-1 font-normal text-sand-500">{i}</th>
                    {fila.map((c, j) => (
                      <td
                        key={j}
                        className="h-7 w-7 rounded"
                        style={{
                          background: c === 0 ? "#151310" : `rgba(127,143,208,${0.12 + 0.6 * (c / maxCell)})`,
                          color: c === 0 ? "#4a453b" : "#e9e3d3",
                        }}
                      >
                        {c || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 font-mono text-[10px] text-sand-500">
            fila = grupo de {A.nombre}, columna = grupo de {B.nombre}; celda = hexagramas
            en común. Una diagonal limpia significaría particiones iguales.
          </p>
        </Panel>
      </div>

      {/* Hallazgo: palacios != cosets */}
      <div>
        <SectionLabel accent={ACCENT}>El hallazgo: los palacios no son los cosets</SectionLabel>
        <Panel className="mt-2" accent={ACCENT}>
          <Prose>
            <p>
              Los palacios y los cosets son ambos particiones en 8 grupos de 8, pero{" "}
              <b>no son la misma</b>: su ARI es <b style={{ color: ACCENT }}>−0,125</b>
              {" "}(se separan más que el azar). La razón es algebraica: cada palacio es
              el hexagrama puro más un conjunto fijo de <b>8 máscaras de generación</b>,{" "}
              <code>{`{${MASCARAS_PALACIO.join(", ")}}`}</code>, y ese conjunto{" "}
              <b>{masksSub ? "sí" : "no"}</b> es cerrado bajo XOR. Al no ser un subgrupo,
              los palacios no pueden ser cosets de nada. Dos construcciones que parecen
              gemelas (8 × 8) resultan, medidas, casi opuestas.
            </p>
          </Prose>
        </Panel>
      </div>
    </div>
  );
}
