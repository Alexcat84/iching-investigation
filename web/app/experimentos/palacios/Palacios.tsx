"use client";

import { useState } from "react";
import Link from "next/link";
import {
  hex,
  LINE_COLOR,
  TRIGRAM_INFO,
  type TrigramName,
} from "@/lib/iching";
import {
  PALACIOS,
  POSICIONES,
  PERFIL_SALTOS,
  verificarParticion,
} from "@/lib/palacios";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#e5c558";
const particion = verificarParticion();

export default function Palacios() {
  const [sel, setSel] = useState<{ p: number; c: number } | null>({ p: 0, c: 0 });

  const celda = sel ? PALACIOS[sel.p].celdas[sel.c] : null;
  const h = celda ? hex(celda.v) : null;
  const puro = sel ? hex(PALACIOS[sel.p].puro) : null;
  const pos = sel ? POSICIONES[sel.c] : null;

  return (
    <div>
      <ExperimentHeader
        kicker="宮 · siglo II a.C."
        titulo="Los ocho palacios de Jing Fang"
        subtitulo="Caminos sobre el hipercubo, descritos 22 siglos antes de la teoría de grafos"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Jing Fang (78–37 a.C.) ordenó los 64 hexagramas en <b>ocho palacios</b>.
            Cada palacio nace de un hexagrama <b>puro</b> (un trigrama repetido arriba y
            abajo) y engendra siete descendientes cambiando líneas en un orden fijo: primero
            la 1, luego la 2, la 3, la 4 y la 5, cada paso una sola línea. Después el
            <b> alma errante</b> (游魂) revierte la línea 4, y el <b>alma que retorna</b> (歸魂)
            recupera el trigrama inferior de origen.
          </p>
          <p>
            Traducido a bits, es un recorrido dirigido por el hipercubo Q6. Y sucede algo
            notable: los <code>8 × 8 = 64</code> hexagramas salen todos distintos. Los
            palacios <b>particionan</b> el conjunto entero, sin planearlo con teoría de
            conjuntos.
          </p>
          <p>
            Hay además un puente con otro sistema Han: los{" "}
            <Link href="/experimentos/calendario-soberanos" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              12 hexagramas soberanos del calendario
            </Link>{" "}
            son exactamente las <b>primeras seis generaciones del palacio de Qian</b> y las{" "}
            <b>seis del de Kun</b> (6 y 6; cero en los otros seis palacios), un teorema que la
            suite asierta.
          </p>
        </Prose>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor="8 × 8" etiqueta="palacios × posiciones" accent={ACCENT} />
        <Stat
          valor={`${particion.distintos}/64`}
          etiqueta={particion.ok ? "distintos, partición ✓" : "¡colisión!"}
          accent={ACCENT}
        />
        <Stat valor="1·1·1·1·1·1·3" etiqueta="perfil de saltos (Hamming)" />
        <Stat valor="游魂 · 歸魂" etiqueta="alma errante · que retorna" />
      </div>

      {/* Matriz de palacios */}
      <div className="mb-2 overflow-x-auto pb-2">
        <table className="w-full border-separate border-spacing-1 text-center">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-ink-900" />
              {POSICIONES.map((p) => (
                <th
                  key={p.idx}
                  className="px-1 pb-1 align-bottom font-mono text-[9px] font-normal uppercase leading-tight tracking-wider text-sand-500"
                  style={{ minWidth: 60 }}
                >
                  <div className="text-sand-400">{p.chino}</div>
                  <div>{p.etiqueta}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PALACIOS.map((palacio, pi) => {
              const info = TRIGRAM_INFO[palacio.cabeza];
              return (
                <tr key={palacio.cabeza}>
                  <th
                    className="sticky left-0 z-10 bg-ink-900 pr-2 text-right align-middle"
                    scope="row"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-lg" style={{ color: ACCENT }}>
                        {info.imagen}
                      </span>
                      <span className="font-mono text-[10px] leading-tight text-sand-400">
                        {palacio.cabeza}
                        <br />
                        <span className="text-sand-600">{info.es}</span>
                      </span>
                    </div>
                  </th>
                  {palacio.celdas.map((c, ci) => {
                    const isSel = sel?.p === pi && sel?.c === ci;
                    const isSoul = ci >= 6;
                    const ch = hex(c.v);
                    return (
                      <td key={ci} className="p-0">
                        <button
                          onClick={() => setSel({ p: pi, c: ci })}
                          className="group flex w-full flex-col items-center gap-1 rounded-md border px-1 py-1.5 transition-all"
                          style={{
                            borderColor: isSel ? ACCENT : "#2A2620",
                            background: isSel
                              ? "rgba(229,197,88,0.10)"
                              : isSoul
                                ? "rgba(255,255,255,0.02)"
                                : "transparent",
                          }}
                        >
                          <Glyph
                            bits={ch.bits}
                            size={22}
                            highlight={ci === 7 ? 5 : null}
                            className="text-sand-200 group-hover:text-sand-100"
                          />
                          <span className="font-mono text-[9px] text-sand-500">
                            {ch.kw}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mb-8 text-center font-mono text-[11px] text-sand-500">
        Cada fila es un palacio; cada columna, una etapa de la generación. La última
        columna (alma que retorna) cambia solo la línea 5 respecto al hexagrama puro,
        de ahí el salto de{" "}
        <span style={{ color: ACCENT }}>3 líneas</span> en el perfil{" "}
        {PERFIL_SALTOS.join("·")}.
      </p>

      {/* Detalle de la celda seleccionada */}
      {sel && h && puro && pos && celda && (
        <Panel accent={ACCENT}>
          <div className="flex flex-wrap items-start gap-5">
            <div className="flex items-end gap-3">
              <div className="text-center">
                <Glyph bits={puro.bits} size={44} className="text-sand-400" />
                <div className="mt-1 font-mono text-[10px] text-sand-500">
                  puro · {puro.py}
                </div>
              </div>
              <span className="pb-4 text-2xl text-sand-600">→</span>
              <div className="text-center">
                <Glyph
                  bits={h.bits}
                  size={44}
                  moving={celda.cambiosDesdePuro}
                  className="text-sand-100"
                />
                <div className="mt-1 font-mono text-[10px]" style={{ color: ACCENT }}>
                  {pos.chino} · {pos.etiqueta}
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-lg leading-tight text-sand-100">
                {h.glyph} {h.kw}. {h.py} · {h.es}
              </div>
              <div className="mt-1 font-mono text-sm text-sand-400">
                {h.bits}₂ = {h.v}
              </div>
              <p className="mt-2 text-sm text-sand-400">{pos.desc}.</p>
              <div className="mt-3">
                <SectionLabel accent={ACCENT}>
                  Líneas cambiadas desde el hexagrama puro
                </SectionLabel>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {celda.cambiosDesdePuro.length === 0 ? (
                    <span className="font-mono text-xs text-sand-500">
                      ninguna, es el hexagrama puro
                    </span>
                  ) : (
                    celda.cambiosDesdePuro.map((k) => (
                      <span
                        key={k}
                        className="rounded-md border px-2 py-0.5 font-mono text-xs"
                        style={{ borderColor: LINE_COLOR[k] + "88", color: LINE_COLOR[k] }}
                      >
                        L{k}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
