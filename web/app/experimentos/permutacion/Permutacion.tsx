"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import { INVERSIONES_MAX } from "@/lib/permutacion";
import { COSTO_MINIMO, ORDENES, type OrdenHistorico } from "@/lib/ordenes";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#b57bb0";

export default function Permutacion() {
  const [ordenId, setOrdenId] = useState("reywen");
  const [selCiclo, setSelCiclo] = useState<number | null>(null);

  const orden: OrdenHistorico = ORDENES.find((o) => o.id === ordenId) ?? ORDENES[0];
  const { perm, estr } = orden;

  // índice de ciclo por posición, para resaltar en la matriz
  const cicloDe = useMemo(() => {
    const m = new Array(64).fill(-1);
    estr.ciclos.forEach((c, i) => c.forEach((k) => (m[k] = i)));
    return m;
  }, [estr]);

  const N = 64;
  const S = 384;
  const cell = S / N;
  const pct = (estr.inversiones / INVERSIONES_MAX) * 100;
  const todoFijo = estr.puntosFijos.length === 64;

  const ciclosOrdenados = useMemo(
    () =>
      estr.ciclos
        .map((c, i) => ({ c, i }))
        .sort((a, b) => b.c.length - a.c.length),
    [estr],
  );

  const elegirOrden = (id: string) => {
    setOrdenId(id);
    setSelCiclo(null);
  };

  return (
    <div>
      <ExperimentHeader
        kicker="σ · Fu Xi → Rey Wen"
        titulo="Rey Wen como permutación"
        subtitulo="Cuánto desordena el libro la geometría binaria, y la carrera contra los otros órdenes"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Si el orden Fu Xi es la <b>identidad</b> (la posición <i>k</i> guarda el valor{" "}
            <i>k</i>), cualquier secuencia histórica de los 64 hexagramas es una{" "}
            <b>permutación</b> σ de los 64 números. Toda permutación se descompone en{" "}
            <b>ciclos</b>: grupos que rotan entre sí. Su estructura es la medida exacta
            del desorden. Aquí corren cuatro: el Rey Wen, el manuscrito de seda de
            Mawangdui, los ocho palacios de Jing Fang y el propio Fu Xi como línea base.
          </p>
        </Prose>
      </div>

      {/* Selector de orden */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {ORDENES.map((o) => (
          <button
            key={o.id}
            onClick={() => elegirOrden(o.id)}
            className="rounded-full border px-3 py-1.5 text-xs tracking-wide transition-colors"
            style={
              ordenId === o.id
                ? { background: ACCENT, color: "#0b0a08", borderColor: "transparent" }
                : { borderColor: "#3A362E", color: "#8a8271" }
            }
          >
            {o.nombre}
          </button>
        ))}
        <span className="font-mono text-[11px] text-sand-500">
          {orden.epoca} · {orden.nota}
        </span>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat valor={estr.numCiclos} etiqueta="ciclos" accent={ACCENT} />
        <Stat valor={estr.maxLongitud} etiqueta="ciclo más largo" accent={ACCENT} />
        <Stat valor={estr.puntosFijos.length} etiqueta="puntos fijos" />
        <Stat valor={estr.orden} etiqueta="orden (σⁿ = id)" />
        <Stat valor={estr.paridad} etiqueta="paridad" />
        <Stat
          valor={`${Math.round(pct)} %`}
          etiqueta={`inversiones (${estr.inversiones})`}
          accent={ACCENT}
        />
      </div>

      {/* Matriz de permutación + ciclos */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div>
          <SectionLabel accent={ACCENT}>La permutación, punto a punto</SectionLabel>
          <Panel className="mt-2">
            <svg viewBox={`-6 -6 ${S + 12} ${S + 12}`} className="w-full" role="img" aria-label={`Matriz de la permutación del orden ${orden.nombre}: posición contra valor Fu Xi`}>
              <rect x={0} y={0} width={S} height={S} fill="none" stroke="#2A2620" />
              <line x1={0} y1={S} x2={S} y2={0} stroke="#2A2620" strokeDasharray="2 3" />
              {perm.map((v, i) => {
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
                posición en la secuencia →
              </text>
              <text x={-4} y={0} style={{ fontSize: 9, fontFamily: "monospace" }} fill="#6b6558" textAnchor="end" dominantBaseline="hanging" transform={`rotate(-90 -4 0)`}>
                ← valor Fu Xi
              </text>
            </svg>
            <p className="mt-2 font-mono text-[10px] text-sand-500">
              La línea punteada es Fu Xi (la identidad). La dispersión alrededor es el
              desorden del orden elegido; los puntos sobre la línea son los fijos.
            </p>
          </Panel>
        </div>

        <div>
          <SectionLabel accent={ACCENT}>Descomposición en ciclos</SectionLabel>
          <Panel className="mt-2">
            {todoFijo ? (
              <p className="py-6 text-center text-sm text-sand-400">
                Fu Xi es la identidad: 64 puntos fijos, ningún ciclo que recorrer. El
                desorden de los demás órdenes se mide contra esto.
              </p>
            ) : (
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
                        {c.map((k) => hex(perm[k]).kw).join(" → ")}
                        {!esFijo && " →"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <p className="mt-2 font-mono text-[10px] text-sand-500">
              Cada fila es un ciclo (números del Rey Wen de los hexagramas); el ciclo
              elegido se resalta en la matriz.
            </p>
          </Panel>
        </div>
      </div>

      {/* La carrera: tabla comparativa */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>La carrera de los órdenes</SectionLabel>
        <div className="mt-2 overflow-x-auto rounded-xl border border-ink-700">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-850/60 font-mono text-[11px] uppercase tracking-wider text-sand-500">
                <th className="px-3 py-2 font-normal">Orden</th>
                <th className="px-3 py-2 text-right font-normal">Ciclos</th>
                <th className="px-3 py-2 text-right font-normal">Más largo</th>
                <th className="px-3 py-2 text-right font-normal">Fijos</th>
                <th className="px-3 py-2 text-right font-normal">Orden σⁿ</th>
                <th className="px-3 py-2 text-right font-normal">Paridad</th>
                <th className="px-3 py-2 text-right font-normal">Inversiones</th>
                <th className="px-3 py-2 text-right font-normal">Costo en líneas</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[13px]">
              {ORDENES.map((o) => {
                const activo = o.id === ordenId;
                return (
                  <tr
                    key={o.id}
                    onClick={() => elegirOrden(o.id)}
                    className="cursor-pointer border-b border-ink-800 transition-colors last:border-0 hover:bg-ink-800/40"
                    style={activo ? { background: "rgba(181,123,176,0.08)" } : undefined}
                  >
                    <td className="px-3 py-2">
                      <span className="text-sand-200" style={activo ? { color: ACCENT } : undefined}>
                        {o.nombre}
                      </span>{" "}
                      <span className="text-[11px] text-sand-600">{o.epoca}</span>
                    </td>
                    <td className="px-3 py-2 text-right text-sand-300">{o.estr.numCiclos}</td>
                    <td className="px-3 py-2 text-right text-sand-300">{o.estr.maxLongitud}</td>
                    <td className="px-3 py-2 text-right text-sand-300">{o.estr.puntosFijos.length}</td>
                    <td className="px-3 py-2 text-right text-sand-300">{o.estr.orden}</td>
                    <td className="px-3 py-2 text-right text-sand-300">{o.estr.paridad}</td>
                    <td className="px-3 py-2 text-right text-sand-300">
                      {o.estr.inversiones}{" "}
                      <span className="text-sand-600">
                        ({Math.round((o.estr.inversiones / INVERSIONES_MAX) * 100)} %)
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-sand-300">
                      {o.costo}{" "}
                      <span className="text-sand-600">({(o.costo / 63).toFixed(2)}×)</span>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t border-ink-700 text-sand-500">
                <td className="px-3 py-2">
                  Gray <span className="text-[11px] text-sand-600">mínimo posible</span>
                </td>
                <td className="px-3 py-2 text-right" colSpan={5}>
                  <span className="text-sand-600">un recorrido de una línea por paso</span>
                </td>
                <td className="px-3 py-2 text-right">–</td>
                <td className="px-3 py-2 text-right" style={{ color: ACCENT }}>
                  {COSTO_MINIMO} (1.00×)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sand-300">
          Mawangdui agrupa en 8 bloques por trigrama superior; Jing Fang recorre sus
          ocho palacios (la misma partición del experimento de los palacios). Y ocurre
          algo notable: con el orden histórico auténtico, los dos{" "}
          <b className="text-sand-200">empatan exactamente en 1008 inversiones</b> (50 por
          ciento), el mismo desorden que el Rey Wen (1013) muestra frente a Fu Xi. Tres
          arquitecturas muy distintas que, medidas contra el conteo binario, quedan casi
          a la misma distancia.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-sand-300">
          Y ese 1008 no es una coincidencia: es <b className="text-sand-200">exactamente la
          esperanza</b> del número de inversiones entre dos órdenes al azar, n(n−1)/4, con
          desviación 86,3. Los tres órdenes históricos caen justo ahí, así que respecto del
          binario están <b>a la distancia del azar</b>: no correlacionados con él. El{" "}
          <Link href="/experimentos/hermandad-ordenes" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
            árbol genealógico de los órdenes
          </Link>{" "}
          mide entonces la otra pregunta, cuánto se parecen <b>entre sí</b>: y ahí Rey Wen y
          Mawangdui resultan hermanos (759 inversiones), con Jing Fang de solitario.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-sand-300">
          Pero el <b className="text-sand-200">costo en líneas</b> (la distancia de
          Hamming total, cuántas líneas cambian al pasar de un hexagrama al siguiente) los
          separa de nuevo: aunque Jing Fang y Mawangdui empatan en inversiones, Jing Fang
          salta mucho menos (<b style={{ color: ACCENT }}>93</b> líneas frente a 141),
          porque cada palacio es casi un recorrido de una línea por paso. El Rey Wen es el
          que más salta (211) y el mínimo posible es 63, el de un recorrido Gray. Dos
          métricas, dos retratos distintos del mismo orden.
        </p>
        <p className="mt-2 text-xs text-sand-500">
          Nota: el orden de palacios usado es el bagong tradicional de Jing Fang (乾震坎艮坤巽離兌:
          padre, tres hijos por edad, madre, tres hijas por edad).
        </p>
      </div>

      {/* Puntos fijos del orden elegido */}
      {estr.puntosFijos.length > 0 && (
        <div>
          <SectionLabel accent={ACCENT}>
            Puntos fijos: donde {orden.nombre} y Fu Xi coinciden
          </SectionLabel>
          <Panel className="mt-2">
            {todoFijo ? (
              <p className="text-sm text-sand-400">
                Los 64: Fu Xi comparado consigo mismo.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {estr.puntosFijos.map((k) => {
                  const h = hex(perm[k]);
                  return (
                    <div
                      key={k}
                      className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
                      style={{ borderColor: ACCENT + "66" }}
                    >
                      <span className="font-mono text-[11px] text-sand-300">
                        pos {k} = valor {perm[k]}
                      </span>
                      <span className="text-sand-200">
                        {h.glyph} {h.py}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      )}
      {estr.puntosFijos.length === 0 && (
        <p className="text-center text-sm text-sand-500">
          {orden.nombre} no tiene ningún punto fijo: en ninguna posición coincide con el
          conteo binario.
        </p>
      )}
    </div>
  );
}
