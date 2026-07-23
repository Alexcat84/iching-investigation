"use client";

import { useState } from "react";
import { hex, HEX_BY_KW } from "@/lib/iching";
import {
  ANTIPALINDROMOS,
  CONTEO_TAMANOS,
  ESPECTRO,
  NUCLEAR,
  OPERACIONES,
  ORBITAS,
  PALINDROMOS,
  PARES_ESPECIALES,
  orbita,
  palindromosSonParesEspeciales,
} from "@/lib/simetrias";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#9c6bc9";
const palTie = palindromosSonParesEspeciales();

export default function Simetrias() {
  const [sel, setSel] = useState(29); // Kan, un palíndromo

  const orb = orbita(sel);

  return (
    <div>
      <ExperimentHeader
        kicker="对 · 反 · álgebra del hipercubo"
        titulo="Las simetrías del hipercubo"
        subtitulo="Órbitas del grupo de Klein, palíndromos y el mapa nuclear"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Dos operaciones milenarias son involuciones: el <b>volteo</b> (fan 反,
            invertir el orden de las líneas) y el <b>opuesto</b> (dui 对, complementar
            cada línea). Conmutan, de modo que junto con la identidad forman el{" "}
            <b>grupo de Klein</b> V₄. Ese grupo parte los 64 hexagramas en{" "}
            <b>{ORBITAS.length} órbitas</b>: familias de hexagramas equivalentes bajo
            simetría.
          </p>
        </Prose>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={ORBITAS.length} etiqueta="órbitas (Burnside)" accent={ACCENT} />
        <Stat valor={CONTEO_TAMANOS[4] ?? 0} etiqueta="órbitas de 4" />
        <Stat valor={CONTEO_TAMANOS[2] ?? 0} etiqueta="órbitas de 2" />
        <Stat valor={PALINDROMOS.length} etiqueta="palíndromos (fan = v)" accent={ACCENT} />
      </div>

      {/* Explorador de órbita */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>La órbita de un hexagrama</SectionLabel>
        <Panel className="mt-2">
          <div className="mb-4 grid grid-cols-4 gap-3 sm:grid-cols-4">
            {OPERACIONES.map((op) => {
              const r = op.aplicar(sel);
              const h = hex(r);
              const esFijo = r === sel;
              return (
                <button
                  key={op.id}
                  onClick={() => setSel(r)}
                  className="flex flex-col items-center rounded-lg border p-3 transition-colors"
                  style={{
                    borderColor: esFijo ? ACCENT : "#2A2620",
                    background: esFijo ? "rgba(156,107,201,0.08)" : "transparent",
                  }}
                >
                  <div className="mb-1 font-mono text-[10px] text-sand-500">
                    {op.chino !== "–" && <span style={{ color: ACCENT }}>{op.chino} </span>}
                    {op.nombre}
                  </div>
                  <Glyph bits={h.bits} size={38} className="text-sand-100" />
                  <div className="mt-1.5 text-center font-mono text-[10px] text-sand-400">
                    {h.kw}. {h.py}
                  </div>
                  {esFijo && op.id !== "id" && (
                    <div className="mt-1 font-mono text-[9px]" style={{ color: ACCENT }}>
                      punto fijo
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-center font-mono text-[11px] text-sand-500">
            Órbita de {hex(sel).py}: {orb.length}{" "}
            {orb.length === 1 ? "hexagrama" : "hexagramas"} ·{" "}
            {orb.map((v) => hex(v).kw).join(" · ")}.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1">
            {Array.from({ length: 64 }, (_, v) => v).map((v) => (
              <button
                key={v}
                onClick={() => setSel(v)}
                className="h-2 w-2 rounded-full transition-transform hover:scale-150"
                style={{
                  background: orb.includes(v)
                    ? ACCENT
                    : v === sel
                      ? "#f5efdf"
                      : "#3a362e",
                }}
                aria-label={hex(v).py}
                title={`${hex(v).kw}. ${hex(v).py}`}
              />
            ))}
          </div>
        </Panel>
      </div>

      {/* Palíndromos = pares especiales del Rey Wen */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>
          Los 8 palíndromos son los pares especiales del Rey Wen
        </SectionLabel>
        <Panel className="mt-2" accent={palTie ? ACCENT : undefined}>
          <Prose>
            <p>
              Un hexagrama es <b>palíndromo</b> cuando el volteo lo deja igual
              (línea 1 = línea 6, 2 = 5, 3 = 4). Hay exactamente 8. Y resulta que son,
              uno a uno, los hexagramas de los <b>4 pares del Rey Wen</b> que (al no
              poder distinguirse por volteo) se emparejan por opuesto (dui) en vez de
              por fan.{" "}
              {palTie ? (
                <span style={{ color: ACCENT }}>Verificado: coinciden los 8.</span>
              ) : (
                <span className="text-cinnabar-bright">No coinciden.</span>
              )}
            </p>
          </Prose>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PARES_ESPECIALES.map(([a, b]) => {
              const ha = HEX_BY_KW[a];
              const hb = HEX_BY_KW[b];
              return (
                <div
                  key={a}
                  className="flex items-center justify-center gap-3 rounded-lg border border-ink-700 bg-ink-850/40 py-3"
                >
                  {[ha, hb].map((h) => (
                    <div key={h.kw} className="text-center">
                      <Glyph bits={h.bits} size={30} className="text-sand-200" />
                      <div className="mt-1 font-mono text-[9px] text-sand-500">{h.kw}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Dinámica nuclear */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>El mapa nuclear, iterado</SectionLabel>
        <Panel className="mt-2">
          <Prose>
            <p>
              El hexagrama nuclear (hu gua) toma las líneas interiores para formar uno
              nuevo. A diferencia de fan y dui, <b>no es reversible</b>: aplicado una y
              otra vez, todo hexagrama termina cayendo en uno de{" "}
              <b>{NUCLEAR.ciclos.length} atractores</b>: dos puntos fijos y un ciclo de 2
              ({NUCLEAR.ciclos.reduce((s, c) => s + c.length, 0)} hexagramas atractores),
              en a lo sumo {NUCLEAR.maxPasos} pasos.
            </p>
          </Prose>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {NUCLEAR.ciclos
              .map((cyc, i) => ({ cyc, i, cuenca: NUCLEAR.cuencas[i] }))
              .sort((a, b) => b.cuenca - a.cuenca)
              .map(({ cyc, i, cuenca }) => (
                <div
                  key={i}
                  className="rounded-lg border border-ink-700 bg-ink-850/40 p-3"
                >
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-sand-500">
                    {cyc.length === 1 ? "punto fijo" : `ciclo de ${cyc.length}`} · cuenca{" "}
                    <span style={{ color: ACCENT }}>{cuenca}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {cyc.map((v) => {
                      const h = hex(v);
                      return (
                        <div key={v} className="text-center">
                          <Glyph bits={h.bits} size={34} className="text-sand-100" />
                          <div className="mt-1 font-mono text-[9px] text-sand-400">
                            {h.kw}. {h.py}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </Panel>
      </div>

      {/* Espectro Q6 */}
      <div>
        <SectionLabel accent={ACCENT}>El espectro del hipercubo Q6</SectionLabel>
        <Panel className="mt-2">
          <Prose>
            <p>
              Como grafo, el hipercubo tiene 7 autovalores: <code>6 − 2k</code> con
              multiplicidad <code>C(6,k)</code>. Son sus modos armónicos, de la
              vibración global (+6) a la más alterna (−6), y sus multiplicidades suman
              los 64 hexagramas.
            </p>
          </Prose>
          <div className="mt-4 flex items-end justify-between gap-1.5" style={{ height: 130 }}>
            {ESPECTRO.map((e) => {
              const maxMult = 20;
              const h = (e.mult / maxMult) * 100;
              return (
                <div key={e.valor} className="flex flex-1 flex-col items-center">
                  <span className="mb-1 font-mono text-[10px] text-sand-400">{e.mult}</span>
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: ACCENT,
                      opacity: 0.35 + 0.65 * (e.mult / maxMult),
                    }}
                  />
                  <span className="mt-1.5 font-mono text-[10px] text-sand-500">
                    {e.valor > 0 ? `+${e.valor}` : e.valor}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center font-mono text-[10px] text-sand-600">
            autovalor (arriba: multiplicidad) · Σ multiplicidades ={" "}
            {ESPECTRO.reduce((s, e) => s + e.mult, 0)}
          </p>
        </Panel>
      </div>

      {/* Nota antipalíndromos */}
      <p className="mt-6 text-center font-mono text-[11px] text-sand-600">
        (Hay también {ANTIPALINDROMOS.length} antipalíndromos, donde fan = dui: los otros
        puntos fijos, esta vez del volteo-más-opuesto.)
      </p>
    </div>
  );
}
