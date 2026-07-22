"use client";

import { useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import {
  COSETS,
  cosetDe,
  cosetsParticionan,
  PUROS,
  SIERPINSKI,
  subgrupoCerrado,
  UNOS_SIERPINSKI,
} from "@/lib/grupo";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#9a86c8";
const grupoOk = subgrupoCerrado() && cosetsParticionan();

export default function GrupoSierpinski() {
  const [sel, setSel] = useState<number | null>(null);
  const cosetSel = sel != null ? cosetDe(sel) : null;

  const S = 384;
  const cell = S / 64;
  const unos: [number, number][] = [];
  for (let i = 0; i < 64; i++) for (let j = 0; j < 64; j++) if (SIERPINSKI[i][j]) unos.push([i, j]);

  return (
    <div>
      <ExperimentHeader
        kicker="⊕ · (Z/2)⁶"
        titulo="El grupo (Z/2)⁶ y el Sierpinski"
        subtitulo="XOR, ocho cosets y un fractal que sale de Pascal"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            La mutación de líneas es XOR, y con ella los 64 hexagramas forman el grupo{" "}
            <b>(Z/2)⁶</b>: Kun (todo yin) es el neutro y cada hexagrama es su propio
            inverso (mutarlo dos veces por lo mismo lo devuelve). Dentro viven los{" "}
            <b>8 hexagramas puros</b> (trigrama duplicado), que forman un subgrupo; sus{" "}
            <b>8 cosets</b> parten los 64 en una partición nueva.
          </p>
        </Prose>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor="64" etiqueta="orden del grupo (2⁶)" accent={ACCENT} />
        <Stat valor={PUROS.length} etiqueta="subgrupo de puros (2³)" accent={ACCENT} />
        <Stat valor={grupoOk ? "8 × 8" : "¡fallo!"} etiqueta="cosets que particionan" />
        <Stat valor={UNOS_SIERPINSKI} etiqueta="unos del Sierpinski (3⁶)" accent={ACCENT} />
      </div>

      {/* Cosets */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Los 8 cosets del subgrupo de puros</SectionLabel>
        <Panel className="mt-2">
          <p className="mb-3 text-sm text-sand-400">
            El coset de un hexagrama son todos los que comparten el mismo{" "}
            <b className="text-sand-200">upper ⊕ lower</b> (la diferencia binaria entre sus
            dos trigramas). El coset 0 es el propio subgrupo: los 8 puros.
          </p>
          <div className="space-y-1.5">
            {COSETS.map((coset, c) => (
              <div
                key={c}
                className="flex items-center gap-2 rounded-lg border px-2 py-1.5"
                style={{
                  borderColor: cosetSel === c ? ACCENT : c === 0 ? ACCENT + "55" : "#2A2620",
                  background: cosetSel === c ? "rgba(154,134,200,0.08)" : "transparent",
                }}
              >
                <span className="w-16 shrink-0 font-mono text-[10px] text-sand-500">
                  ⊕ = {c}
                  {c === 0 && <span className="block text-sand-600">puros</span>}
                </span>
                <div className="flex flex-wrap gap-1">
                  {coset.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSel(v === sel ? null : v)}
                      className="rounded p-0.5 transition-colors"
                      style={{ background: sel === v ? "rgba(245,239,223,0.12)" : "transparent" }}
                      title={`${hex(v).kw}. ${hex(v).py}`}
                    >
                      <Glyph
                        bits={hex(v).bits}
                        size={18}
                        className={sel === v ? "text-sand-100" : "text-sand-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {sel != null && (
            <p className="mt-3 font-mono text-[11px] text-sand-400">
              {hex(sel).kw}. {hex(sel).py} · upper ⊕ lower = {cosetDe(sel)} · su coset tiene
              8 hexagramas. Esta partición no coincide con la de los palacios (los distingue
              el comparador de particiones, aún por construir).
            </p>
          )}
        </Panel>
      </div>

      {/* Sierpinski */}
      <div>
        <SectionLabel accent={ACCENT}>El Sierpinski escondido en Pascal mod 2</SectionLabel>
        <Panel className="mt-2">
          <Prose>
            <p>
              La matriz <code>S[i][j] = 1</code> cuando <code>j</code> es submáscara de{" "}
              <code>i</code> (todas sus líneas yang están también en <code>i</code>) es,
              por el teorema de Lucas, exactamente <code>C(i,j) mod 2</code>: Pascal módulo
              2. Dibujada, es el <b>triángulo de Sierpinski</b>, autosimilar por bloques
              (S = [[S, 0], [S, S]]). Y es la misma relación de dominancia del{" "}
              <Link href="/experimentos/reticulo-b6" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
                retículo booleano B6
              </Link>
              : el fractal es la sombra del orden parcial.
            </p>
          </Prose>
          <div className="mt-4 overflow-x-auto">
            <svg viewBox={`0 0 ${S} ${S}`} className="mx-auto w-full max-w-[420px]" role="img" aria-label="matriz de Sierpinski 64x64: Pascal modulo 2">
              <rect x={0} y={0} width={S} height={S} fill="#151310" />
              {unos.map(([i, j], k) => (
                <rect key={k} x={j * cell} y={i * cell} width={cell} height={cell} fill={ACCENT} />
              ))}
            </svg>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] text-sand-500">
            64 × 64 · fila i, columna j · celda encendida cuando j ⊆ i · {UNOS_SIERPINSKI} unos
          </p>
        </Panel>
      </div>
    </div>
  );
}
