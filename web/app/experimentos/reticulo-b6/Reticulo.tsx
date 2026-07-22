"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ALL_HEX, hex, LINE_COLOR } from "@/lib/iching";
import {
  CADENAS_MAXIMALES,
  COBERTURAS,
  conoInferior,
  conoSuperior,
  nivel,
  NIVELES,
  TAMANOS_NIVEL,
} from "@/lib/reticulo";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#8f7fd6";
const COLOR_ARRIBA = "#8f7fd6";
const COLOR_ABAJO = "#5fae7f";

const W = 720;
const H = 470;
const MARGEN = 42;

/** Posición de cada vértice en el diagrama de Hasse: Kun abajo, Qian arriba. */
function posiciones(): [number, number][] {
  const pos: [number, number][] = new Array(64);
  for (let k = 0; k <= 6; k++) {
    const fila = NIVELES[k];
    const y = H - 30 - (k * (H - 76)) / 6;
    fila.forEach((v, i) => {
      const x =
        fila.length === 1
          ? W / 2
          : MARGEN + (i * (W - 2 * MARGEN)) / (fila.length - 1);
      pos[v] = [x, y];
    });
  }
  return pos;
}

/** Glifo pequeño para el retículo. */
function NodoGlyph({ v, x, y, color }: { v: number; x: number; y: number; color: string }) {
  const bits = hex(v).bits;
  const w = 13;
  const bar = 1.6;
  const gap = 1.9;
  const rows = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const yy = y - (5 * (gap + bar)) / 2 + (6 - k) * (gap + bar);
    if (yang) {
      rows.push(<rect key={k} x={x - w / 2} y={yy} width={w} height={bar} fill={color} rx={0.4} />);
    } else {
      rows.push(
        <rect key={`${k}a`} x={x - w / 2} y={yy} width={w * 0.4} height={bar} fill={color} rx={0.4} />,
        <rect key={`${k}b`} x={x + w * 0.1} y={yy} width={w * 0.4} height={bar} fill={color} rx={0.4} />,
      );
    }
  }
  return <g>{rows}</g>;
}

export default function Reticulo() {
  const [sel, setSel] = useState<number | null>(0b100010); // Zhun

  const pos = useMemo(posiciones, []);
  const arriba = useMemo(() => (sel == null ? new Set<number>() : new Set(conoSuperior(sel))), [sel]);
  const abajo = useMemo(() => (sel == null ? new Set<number>() : new Set(conoInferior(sel))), [sel]);

  const h = sel != null ? hex(sel) : null;

  return (
    <div>
      <ExperimentHeader
        kicker="⊑ · orden parcial"
        titulo="El retículo booleano B6"
        subtitulo="La otra geometría de las mismas 192 aristas"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Hay un orden natural entre hexagramas, y no es "tiene más líneas yang" (eso
            es solo el rango). Es la <b>dominancia línea a línea</b>: x está por debajo
            de y si toda línea yang de x también es yang en y. Se sube encendiendo una
            línea por vez, de Kun (nada encendido) a Qian (todo encendido). El diagrama
            resultante usa <b>exactamente las mismas 192 aristas</b> del{" "}
            <Link href="/experimentos/hipercubo" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              hipercubo
            </Link>
            , ahora orientadas hacia arriba: mismo grafo, otra lectura.
          </p>
        </Prose>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor="7" etiqueta="niveles (rango 0 a 6)" />
        <Stat valor={COBERTURAS.length} etiqueta="coberturas = aristas de Q6" accent={ACCENT} />
        <Stat valor={CADENAS_MAXIMALES} etiqueta="cadenas de Kun a Qian (6!)" accent={ACCENT} />
        <Stat valor={TAMANOS_NIVEL.join("·")} etiqueta="tamaños C(6,k), como el espectro" />
      </div>

      {/* Selector accesible */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="sel-ret" className="font-mono text-[11px] uppercase tracking-widest text-sand-500">
          Hexagrama
        </label>
        <select
          id="sel-ret"
          value={sel ?? ""}
          onChange={(e) => setSel(e.target.value === "" ? null : Number(e.target.value))}
          className="rounded-md border border-ink-600 bg-ink-850 px-2 py-1.5 font-mono text-xs text-sand-200"
        >
          <option value="">ninguno</option>
          {ALL_HEX.map((x) => (
            <option key={x.v} value={x.v}>
              {x.kw}. {x.py} ({x.bits})
            </option>
          ))}
        </select>
        {h && sel != null && (
          <span className="font-mono text-xs text-sand-400">
            <span style={{ color: COLOR_ARRIBA }}>↑ {arriba.size} por encima (2^{6 - nivel(sel)})</span>
            {" · "}
            <span style={{ color: COLOR_ABAJO }}>↓ {abajo.size} por debajo (2^{nivel(sel)})</span>
            <span className="text-sand-600"> · ambos conos incluyen al propio hexagrama</span>
          </span>
        )}
      </div>

      {/* Diagrama de Hasse */}
      <Panel>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full min-w-[640px] select-none"
            role="img"
            aria-label="Diagrama de Hasse del retículo booleano B6: 7 niveles de Kun abajo a Qian arriba, con las 192 coberturas orientadas hacia arriba"
          >
            {/* etiquetas de nivel */}
            {NIVELES.map((fila, k) => (
              <text
                key={k}
                x={8}
                y={pos[fila[0]][1] + 3}
                style={{ fontSize: 9, fontFamily: "monospace" }}
                className="fill-sand-600"
              >
                {k}·C={fila.length}
              </text>
            ))}
            {/* coberturas */}
            {COBERTURAS.map((c, i) => {
              const [x1, y1] = pos[c.abajo];
              const [x2, y2] = pos[c.arriba];
              const enConoArriba = sel != null && arriba.has(c.abajo) && arriba.has(c.arriba);
              const enConoAbajo = sel != null && abajo.has(c.abajo) && abajo.has(c.arriba);
              const activa = enConoArriba || enConoAbajo;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1 - 8}
                  x2={x2}
                  y2={y2 + 8}
                  stroke={
                    activa
                      ? enConoArriba
                        ? COLOR_ARRIBA
                        : COLOR_ABAJO
                      : LINE_COLOR[c.line]
                  }
                  strokeWidth={activa ? 1.6 : 0.6}
                  opacity={sel == null ? 0.25 : activa ? 0.85 : 0.05}
                />
              );
            })}
            {/* nodos */}
            {Array.from({ length: 64 }, (_, v) => {
              const [x, y] = pos[v];
              const esSel = v === sel;
              const enArriba = arriba.has(v);
              const enAbajo = abajo.has(v);
              const color = esSel
                ? "#f5efdf"
                : enArriba
                  ? COLOR_ARRIBA
                  : enAbajo
                    ? COLOR_ABAJO
                    : "#8a8271";
              const atenuado = sel != null && !esSel && !enArriba && !enAbajo;
              return (
                <g
                  key={v}
                  onClick={() => setSel(esSel ? null : v)}
                  style={{ cursor: "pointer" }}
                  opacity={atenuado ? 0.3 : 1}
                >
                  {esSel && <circle cx={x} cy={y} r={11} fill="none" stroke={ACCENT} strokeWidth={1.2} />}
                  <NodoGlyph v={v} x={x} y={y} color={color} />
                  <circle cx={x} cy={y} r={10} fill="transparent" />
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-sand-500">
          las aristas apuntan hacia arriba (encender una línea) · con un hexagrama
          elegido: violeta = su cono superior, verde = su cono inferior
        </p>
      </Panel>

      <div className="mt-5">
        <Prose>
          <p>
            Los tamaños de nivel, 1, 6, 15, 20, 15, 6 y 1, son los C(6,k): las mismas
            multiplicidades del espectro del hipercubo que aparece en el experimento de{" "}
            <Link href="/experimentos/simetrias" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              las simetrías
            </Link>
            . Y de Kun a Qian hay exactamente 6! = 720 cadenas maximales: una por cada
            orden posible de encender las seis líneas.
          </p>
        </Prose>
      </div>
    </div>
  );
}
