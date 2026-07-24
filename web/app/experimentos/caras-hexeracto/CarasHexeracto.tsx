"use client";

import { useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import {
  F_VECTOR,
  TOTAL_CARAS,
  EULER_FRONTERA,
  EULER_TOTAL,
  NOMBRES_DIMENSION,
  binom,
  dimensionDe,
  verticesDe,
} from "@/lib/hexeracto";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#5f93d8";

// yin = 0, yang = 1, indeterminado = 2. palabra[0] = linea 1 (abajo).
const CICLO = [0, 1, 2]; // yin -> yang -> indeterminado
const ETIQUETA: Record<number, string> = { 0: "yin", 1: "yang", 2: "indeterminado" };

/** Glifo de una linea parcial: yin (dos segmentos), yang (barra), indeterminado (fantasma). */
function LineaParcial({ estado, on, color }: { estado: number; on: () => void; color: string }) {
  return (
    <button onClick={on} className="block w-full py-1" aria-label={`línea ${ETIQUETA[estado]}, clic para cambiar`}>
      <svg viewBox="0 0 60 10" className="mx-auto w-24">
        {estado === 1 && <rect x={0} y={3} width={60} height={4} rx={1} fill={color} />}
        {estado === 0 && (
          <>
            <rect x={0} y={3} width={24} height={4} rx={1} fill={color} />
            <rect x={36} y={3} width={24} height={4} rx={1} fill={color} />
          </>
        )}
        {estado === 2 && (
          <rect x={0} y={3} width={60} height={4} rx={1} fill="none" stroke={color} strokeWidth={1} strokeDasharray="4 3" opacity={0.9} />
        )}
      </svg>
    </button>
  );
}

export default function CarasHexeracto() {
  // por defecto: dos lineas indeterminadas (un cuadrado, dimension 2)
  const [palabra, setPalabra] = useState<number[]>([2, 1, 2, 0, 1, 0]);

  const cambia = (i: number) =>
    setPalabra((p) => p.map((s, j) => (j === i ? CICLO[(CICLO.indexOf(s) + 1) % 3] : s)));

  const k = dimensionDe(palabra);
  const vertices = verticesDe(palabra);
  const fk = binom(6, k) * 2 ** (6 - k);
  const maxF = Math.max(...F_VECTOR);

  return (
    <div>
      <ExperimentHeader
        kicker="⧉ · 易 · f-vector del hexeracto"
        titulo="Las caras del hexeracto"
        subtitulo="Los hexagramas parciales y el f-vector del 6-cubo"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Las <b>caras</b> del 6-cubo son los <b>hexagramas parciales</b>: palabras de
            seis símbolos sobre yin, yang e <b>indeterminado</b>. Los <b>vértices</b> (nada
            indeterminado) son los 64 hexagramas completos; las <b>aristas</b> (una línea
            indeterminada) son nuestras{" "}
            <Link href="/experimentos/hipercubo" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              192 mutaciones
            </Link>
            ; el sólido entero (las seis indeterminadas) es el hexagrama totalmente abierto.
            Una cara de dimensión k se completa de <b>2ᵏ</b> maneras, y hay{" "}
            <b>C(6,k)·2⁶⁻ᵏ</b> de ellas.
          </p>
        </Prose>
      </div>

      {/* Interactivo */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Construye una cara</SectionLabel>
      </div>
      <Panel className="mb-6" accent={ACCENT}>
        <div className="flex flex-col-reverse items-center gap-1">
          {palabra.map((estado, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-10 text-right font-mono text-[10px] text-sand-600">línea {i + 1}</span>
              <LineaParcial estado={estado} on={() => cambia(i)} color={estado === 2 ? ACCENT : "#cfc6b0"} />
              <span className="w-24 font-mono text-[10px] text-sand-500">{ETIQUETA[estado]}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-[11px] text-sand-500">
          toca una línea para girar yin → yang → indeterminado
        </p>

        <div className="mt-4 rounded-lg border border-ink-700 bg-ink-850/40 p-4 text-center">
          <div className="font-mono text-sm" style={{ color: ACCENT }}>
            {NOMBRES_DIMENSION[k]} · dimensión {k}
          </div>
          <div className="mt-1 text-sm text-sand-300">
            una de <b>{fk.toLocaleString("es")}</b> caras de dimensión {k} (C(6,{k})·2^{6 - k})
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {vertices.map((v) => (
              <span key={v} className="rounded border border-ink-700 px-1.5 py-0.5 font-mono text-[11px] text-sand-300" title={`${hex(v).kw}. ${hex(v).py}`}>
                {hex(v).glyph} {hex(v).kw}
              </span>
            ))}
          </div>
          <div className="mt-1 font-mono text-[10px] text-sand-600">
            {vertices.length} = 2^{k} vértice{vertices.length === 1 ? "" : "s"} que contiene
          </div>
        </div>
      </Panel>

      {/* f-vector */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>El f-vector: caras por dimensión</SectionLabel>
      </div>
      <Panel className="mb-6">
        <div className="space-y-1.5">
          {F_VECTOR.map((f, dim) => (
            <div key={dim} className="flex items-center gap-3">
              <span className="w-8 text-right font-mono text-[11px] text-sand-500">f{dim}</span>
              <div className="relative h-6 flex-1 overflow-hidden rounded bg-ink-850/60">
                <div className="h-full rounded" style={{ width: `${(f / maxF) * 100}%`, background: dim === k ? "#f5efdf" : ACCENT, opacity: dim === k ? 1 : 0.55 }} />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[11px] text-sand-200">
                  {f.toLocaleString("es")} · {NOMBRES_DIMENSION[dim]}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] text-sand-500">
          f_k = C(6,k)·2^(6−k), verificado por fórmula y por enumeración directa de las 3⁶ palabras
        </p>
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={TOTAL_CARAS} etiqueta="caras en total = 3⁶" accent={ACCENT} />
        <Stat valor="(2+x)⁶" etiqueta="la función generatriz" />
        <Stat valor={EULER_FRONTERA} etiqueta="Euler de la frontera (5-esfera)" accent={ACCENT} />
        <Stat valor={EULER_TOTAL} etiqueta="Euler del sólido (contráctil)" />
      </div>

      <Panel>
        <Prose>
          <p>
            Las caras suman <b>729 = 3⁶</b>: tres opciones por línea, el desarrollo de{" "}
            <b>(2 + x)⁶</b> en x = 1. Es el mismo 729 del cociente Kun/Qian de la{" "}
            <Link href="/experimentos/markov-consultas" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              cadena de Markov
            </Link>
            , y la razón es estructural en ambos casos: <b>tres estados por línea</b> (allí
            viejo-yin, joven, viejo-yang; aquí yin, yang, indeterminado), no una coincidencia
            numerológica. La <b>característica de Euler</b> cierra el cuadro: la alternancia
            de las caras de la frontera da <b>0</b> (una 5-esfera) y, sumando el sólido,{" "}
            <b>1</b> (una bola contráctil).
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
