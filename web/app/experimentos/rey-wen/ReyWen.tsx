"use client";

import { useState } from "react";
import { hex } from "@/lib/iching";
import {
  FUXI_EN_ORDEN_KW,
  PARES,
  PARES_DUI,
  PARES_FAN,
  YANG_EN_ORDEN_KW,
  type Par,
} from "@/lib/reywen";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#cf9b5b";
const YANG_COL = "#cf9b5b";

export default function ReyWen() {
  const [sel, setSel] = useState<Par | null>(PARES[0]);

  return (
    <div>
      <ExperimentHeader
        kicker="序 · orden tradicional"
        titulo="La secuencia del Rey Wen"
        subtitulo="La regla de pares, y la búsqueda de una fórmula que no existe"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            La secuencia Fu Xi <b>es</b> contar en binario de 0 a 63. La del Rey Wen (el
            orden en que aparecen los hexagramas en el libro) no sigue ninguna fórmula
            numérica conocida. Lo que <b>sí</b> tiene es una regla de <b>pares</b>: los 64
            se agrupan de dos en dos, y el segundo de cada par es el <b>volteo</b> (fan
            反) del primero. Solo en los 4 pares cuyo hexagrama es un palíndromo (donde
            voltear no cambia nada) se usa el <b>opuesto</b> (dui 对).
          </p>
        </Prose>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat valor="32" etiqueta="pares" accent={ACCENT} />
        <Stat valor={PARES_FAN} etiqueta="pares por volteo (反)" />
        <Stat valor={PARES_DUI} etiqueta="pares por opuesto (对)" accent={ACCENT} />
      </div>

      {/* Rejilla de pares */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Los 32 pares</SectionLabel>
        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {PARES.map((p) => {
            const isSel = sel?.n === p.n;
            const isDui = p.op === "dui";
            return (
              <button
                key={p.n}
                onClick={() => setSel(p)}
                className="flex items-center justify-center gap-2 rounded-lg border px-2 py-2 transition-colors"
                style={{
                  borderColor: isSel ? ACCENT : isDui ? "#cf9b5b55" : "#2A2620",
                  background: isSel
                    ? "rgba(207,155,91,0.10)"
                    : isDui
                      ? "rgba(207,155,91,0.05)"
                      : "transparent",
                }}
              >
                <Glyph bits={hex(p.aV).bits} size={18} className="text-sand-300" />
                <span className="font-mono text-[9px]" style={{ color: isDui ? ACCENT : "#6b6558" }}>
                  {p.op === "dui" ? "对" : "反"}
                </span>
                <Glyph bits={hex(p.bV).bits} size={18} className="text-sand-300" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalle del par */}
      {sel && (
        <Panel accent={ACCENT} className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <PairHex kw={sel.aKw} v={sel.aV} />
            <div className="text-center">
              <div className="text-2xl" style={{ color: ACCENT }}>
                {sel.op === "dui" ? "对" : "反"}
              </div>
              <div className="mt-1 font-mono text-[10px] text-sand-500">
                {sel.op === "dui" ? "opuesto (dui)" : "volteo (fan)"}
              </div>
            </div>
            <PairHex kw={sel.bKw} v={sel.bV} />
          </div>
          <p className="mt-4 text-center text-sm text-sand-400">
            {sel.op === "dui" ? (
              <>
                El hexagrama {sel.aKw} es un <b className="text-sand-200">palíndromo</b>:
                voltearlo lo deja igual, así que el par se forma con su opuesto línea a
                línea.
              </>
            ) : (
              <>
                El hexagrama {sel.bKw} es el hexagrama {sel.aKw} puesto{" "}
                <b className="text-sand-200">boca abajo</b>.
              </>
            )}
          </p>
        </Panel>
      )}

      {/* ¿Hay una fórmula? */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>¿Hay una fórmula? El valor binario a lo largo de la secuencia</SectionLabel>
        <Panel className="mt-2">
          <div className="mb-2 font-mono text-[10px] text-sand-500">
            Fu Xi: el valor sube limpio de 0 a 63 (es contar)
          </div>
          <ValueStrip values={Array.from({ length: 64 }, (_, i) => i)} color="#5b8fd9" />
          <div className="mb-2 mt-4 font-mono text-[10px] text-sand-500">
            Rey Wen: el mismo valor, ahora sin patrón aparente
          </div>
          <ValueStrip values={FUXI_EN_ORDEN_KW} color={ACCENT} />
          <p className="mt-3 text-sm text-sand-400">
            Cada barra es el valor binario (0–63) del hexagrama en esa posición. En Fu Xi
            es una rampa perfecta; en el Rey Wen, ruido. Cuánto de ruido, exactamente, lo
            mide el experimento <b className="text-sand-200">Rey Wen como permutación</b>.
          </p>
        </Panel>
      </div>

      {/* Onda de yang */}
      <div>
        <SectionLabel accent={ACCENT}>La regularidad que sí hay: líneas yang por posición</SectionLabel>
        <Panel className="mt-2">
          <YangWave />
          <p className="mt-3 text-sm text-sand-400">
            El volteo <b className="text-sand-200">conserva</b> el número de líneas yang, y
            el opuesto lo <b className="text-sand-200">complementa</b> (yang ↔ 6−yang). Por
            eso dentro de cada par las dos barras son iguales (volteo) o suman 6 (opuesto):
            la secuencia salta, pero nunca de forma del todo libre.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function PairHex({ kw, v }: { kw: number; v: number }) {
  const h = hex(v);
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <Glyph bits={h.bits} size={48} className="text-sand-100" />
      </div>
      <div className="mt-2 text-base leading-tight text-sand-100">
        {kw}. {h.py}
      </div>
      <div className="text-xs text-sand-400">{h.es}</div>
      <div className="mt-0.5 font-mono text-[10px] text-sand-600">
        {h.bits}₂ = {v}
      </div>
    </div>
  );
}

function ValueStrip({ values, color }: { values: number[]; color: string }) {
  const W = 640;
  const H = 60;
  const bw = W / 64;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" role="img" aria-label="valores binarios">
      {values.map((v, i) => (
        <rect
          key={i}
          x={i * bw}
          y={H - (v / 63) * H}
          width={bw - 0.6}
          height={(v / 63) * H}
          fill={color}
          opacity={0.85}
        />
      ))}
    </svg>
  );
}

function YangWave() {
  const W = 640;
  const H = 90;
  const bw = W / 64;
  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} className="w-full" role="img" aria-label="líneas yang por posición del Rey Wen">
      {YANG_EN_ORDEN_KW.map((y, i) => {
        const isPairStart = i % 2 === 0;
        return (
          <rect
            key={i}
            x={i * bw + 0.4}
            y={H - (y / 6) * H}
            width={bw - 0.8}
            height={Math.max((y / 6) * H, 1)}
            rx={1}
            fill={YANG_COL}
            opacity={isPairStart ? 0.9 : 0.5}
          />
        );
      })}
      {/* marcas cada 8 hexagramas */}
      {[0, 16, 32, 48, 64].map((k) => (
        <text
          key={k}
          x={Math.min(k, 63) * bw}
          y={H + 12}
          className="fill-sand-600"
          style={{ fontSize: 9, fontFamily: "monospace" }}
        >
          {k === 0 ? 1 : k}
        </text>
      ))}
    </svg>
  );
}
