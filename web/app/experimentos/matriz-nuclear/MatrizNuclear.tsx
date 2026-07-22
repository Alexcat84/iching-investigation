"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_HEX, hex, huGua } from "@/lib/iching";
import {
  aplicarM,
  imagenComoMapa,
  M,
  M2,
  matVec,
  matricesIguales,
  POTENCIAS,
  valorDe,
  vecDe,
  type Matriz,
} from "@/lib/matriz-nuclear";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#b8926a";

function MatrizGrid({
  mat,
  size = 26,
  destacarFilas,
  destacarCols,
}: {
  mat: Matriz;
  size?: number;
  destacarFilas?: Set<number>;
  destacarCols?: Set<number>;
}) {
  return (
    <div
      className="inline-grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(6, ${size}px)` }}
    >
      {mat.map((fila, i) =>
        fila.map((b, j) => {
          const activo = b === 1;
          const enFilaSel = destacarFilas?.has(i);
          const enColSel = destacarCols?.has(j);
          return (
            <div
              key={`${i}-${j}`}
              className="flex items-center justify-center rounded-[3px] font-mono"
              style={{
                width: size,
                height: size,
                fontSize: size * 0.42,
                background: activo
                  ? enColSel || enFilaSel
                    ? "#f5efdf"
                    : ACCENT
                  : "#151310",
                color: activo ? "#0b0a08" : "#4a453b",
                outline: enFilaSel || enColSel ? `1px solid ${ACCENT}` : "none",
              }}
            >
              {b}
            </div>
          );
        }),
      )}
    </div>
  );
}

/** Columna de 6 bits (l1 arriba). */
function VectorCol({
  x,
  size = 26,
  color = "#cfc7b2",
}: {
  x: number[];
  size?: number;
  color?: string;
}) {
  return (
    <div className="inline-grid gap-[3px]">
      {x.map((b, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-[3px] font-mono"
          style={{
            width: size,
            height: size,
            fontSize: size * 0.42,
            background: b ? color : "#151310",
            color: b ? "#0b0a08" : "#4a453b",
          }}
        >
          {b}
        </div>
      ))}
    </div>
  );
}

export default function MatrizNuclear() {
  const [v, setV] = useState(6); // 000110 = Cui
  const x = vecDe(v);
  const y = matVec(M, x);
  const vy = valorDe(y);
  const coincide = vy === huGua(v);

  // filas de M cuya única entrada activa apunta a una línea encendida de x
  const filasVivas = new Set<number>();
  M.forEach((fila, i) => {
    if (fila.some((a, j) => a && x[j])) filasVivas.add(i);
  });
  const colsVivas = new Set<number>(x.map((b, j) => (b ? j : -1)).filter((j) => j >= 0));

  const img2 = imagenComoMapa(M2);

  return (
    <div>
      <ExperimentHeader
        kicker="M · hu gua sobre F2"
        titulo="El operador nuclear como matriz"
        subtitulo="El hexagrama nuclear es un mapa lineal, y su matriz explica todo el bosque"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El hexagrama nuclear (hu gua) toma las líneas interiores: la salida es{" "}
            <code>(l2, l3, l4, l3, l4, l5)</code> del hexagrama de entrada. Como cada
            línea de salida es una copia de una línea de entrada, hu gua es un{" "}
            <b>mapa lineal sobre F2</b>: hay una matriz <b>M</b> de 6×6 tal que{" "}
            <code>M·x = hu gua(x)</code> para los 64 hexagramas. Y de esa matriz sale, sin
            más, toda la dinámica del{" "}
            <Link href="/experimentos/bosque-nuclear" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              bosque nuclear
            </Link>
            .
          </p>
        </Prose>
      </div>

      {/* La matriz + demo M·x */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <SectionLabel accent={ACCENT}>La matriz M (6×6 sobre F2)</SectionLabel>
          <Panel className="mt-2">
            <div className="flex items-start gap-3">
              <div className="flex flex-col justify-between py-[3px] font-mono text-[10px] text-sand-500" style={{ height: 6 * 26 + 5 * 3 }}>
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <span key={k}>l{k}′</span>
                ))}
              </div>
              <div>
                <MatrizGrid mat={M} destacarFilas={filasVivas} destacarCols={colsVivas} />
                <div className="mt-1.5 flex gap-[3px] font-mono text-[10px] text-sand-500">
                  {[1, 2, 3, 4, 5, 6].map((k) => (
                    <span key={k} className="inline-block text-center" style={{ width: 26 }}>
                      l{k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] text-sand-500">
              fila = línea de salida (l′), columna = línea de entrada. Un 1 en (i, j)
              significa: la línea i de salida copia la línea j de entrada.
            </p>
          </Panel>
        </div>

        <div>
          <SectionLabel accent={ACCENT}>M · x = hu gua(x)</SectionLabel>
          <Panel className="mt-2">
            <div className="mb-3 flex items-center gap-3">
              <label htmlFor="sel-m" className="font-mono text-[11px] text-sand-500">
                x =
              </label>
              <select
                id="sel-m"
                value={v}
                onChange={(e) => setV(Number(e.target.value))}
                className="rounded-md border border-ink-600 bg-ink-850 px-2 py-1.5 font-mono text-xs text-sand-200"
              >
                {ALL_HEX.map((h) => (
                  <option key={h.v} value={h.v}>
                    {h.kw}. {h.py} ({h.bits})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-center">
                <Glyph bits={hex(v).bits} size={40} className="text-sand-200" />
                <div className="mt-1 font-mono text-[9px] text-sand-500">x · {hex(v).py}</div>
              </div>
              <div className="flex items-center gap-2">
                <VectorCol x={x} color="#cfc7b2" />
                <span className="text-sand-500">→</span>
                <VectorCol x={y} color={ACCENT} />
              </div>
              <span className="text-2xl text-sand-600">=</span>
              <div className="text-center">
                <Glyph bits={hex(vy).bits} size={40} moving={[]} className="text-sand-100" />
                <div className="mt-1 font-mono text-[9px]" style={{ color: ACCENT }}>
                  hu gua = {hex(vy).py}
                </div>
              </div>
            </div>
            <p className="mt-3 font-mono text-[11px]" style={{ color: coincide ? "#7fc79b" : "#e24b3b" }}>
              {coincide ? "M·x coincide con hu gua(x) ✓" : "discrepancia"}
            </p>
          </Panel>
        </div>
      </div>

      {/* Potencias y rangos */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Las potencias de M y el colapso del rango</SectionLabel>
        <Panel className="mt-2">
          <div className="flex flex-wrap items-start gap-6">
            {POTENCIAS.map((p) => (
              <div key={p.etiqueta} className="text-center">
                <div className="mb-1.5 font-mono text-sm text-sand-200">{p.etiqueta}</div>
                <MatrizGrid mat={p.mat} size={20} />
                <div className="mt-1.5 font-mono text-[10px] text-sand-500">
                  rango {p.rango}
                  <br />
                  <span style={{ color: ACCENT }}>imagen {p.imagen}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-sand-300">
            El rango cae 6 → <b>4</b> → <b>2</b> y ahí se estabiliza: son las imágenes{" "}
            <b>64 → 16 → 4</b> del bosque nuclear, ahora como potencias de una matriz.
            Además <b style={{ color: ACCENT }}>M⁴ = M²</b>{" "}
            {matricesIguales(POTENCIAS[3].mat, POTENCIAS[1].mat) ? "(verificado)" : ""}: a
            partir del segundo paso, el sistema solo oscila.
          </p>
        </Panel>
      </div>

      {/* Los 4 atractores desde la imagen de M² */}
      <div>
        <SectionLabel accent={ACCENT}>La imagen de M² son los 4 atractores</SectionLabel>
        <Panel className="mt-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {img2.map((val) => {
              const h = hex(val);
              const esFijo = aplicarM(val) === val;
              return (
                <div
                  key={val}
                  className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-850/40 px-3 py-2"
                >
                  <Glyph bits={h.bits} size={26} className="text-sand-100" />
                  <div className="font-mono text-[10px] leading-tight text-sand-400">
                    {h.kw}. {h.py}
                    <br />
                    <span style={{ color: ACCENT }}>{esFijo ? "punto fijo" : "ciclo de 2"}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <Stat
            valor="0, 21, 42, 63"
            etiqueta="valores de la imagen de M² = Kun, Wei Ji, Ji Ji, Qian"
            accent={ACCENT}
          />
          <p className="mt-3 text-sm leading-relaxed text-sand-300">
            Sobre esos cuatro, M fija a Kun y Qian e intercambia Ji Ji con Wei Ji: el
            único ciclo del bosque sale del hecho de que M, restringida a la imagen, es
            una involución con dos puntos fijos. El álgebra lineal cuenta la misma
            historia que las flechas.
          </p>
        </Panel>
      </div>
    </div>
  );
}
