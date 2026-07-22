"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ALL_HEX, hex, lineBit } from "@/lib/iching";
import { caminoHasta, ETIQUETAS_NIVEL, NODOS } from "@/lib/arbol";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel } from "@/components/ui";

const ACCENT = "#8fae5a";

const W = 960;
const H = 480;
const M_IZQ = 118;
const M_DER = 16;

/** Centro x de un nodo: el centro del tramo de hojas que cubre. */
function xDe(nivel: number, idx: number): number {
  const hojas = 2 ** (6 - nivel);
  const desde = idx * hojas;
  const centro = desde + hojas / 2;
  return M_IZQ + ((centro - 0.5) * (W - M_IZQ - M_DER)) / 63;
}
function yDe(nivel: number): number {
  return 30 + (nivel * (H - 90)) / 6;
}

/** Pila parcial de líneas: las primeras `bits.length` líneas del hexagrama, desde abajo. */
function PilaParcial({
  bits,
  x,
  y,
  w,
  color,
}: {
  bits: string;
  x: number;
  y: number;
  w: number;
  color: string;
}) {
  const n = bits.length;
  const bar = Math.min(2.2, w * 0.16);
  const gap = bar * 1.15;
  const rows = [];
  for (let i = n - 1; i >= 0; i--) {
    // bits[0] = línea 1 (abajo); dibujar de abajo hacia arriba
    const yy = y + ((n - 1 - i) - (n - 1) / 2) * (bar + gap) - bar / 2;
    const yang = bits[i] === "1";
    if (yang) {
      rows.push(<rect key={i} x={x - w / 2} y={yy} width={w} height={bar} fill={color} rx={0.4} />);
    } else {
      rows.push(
        <rect key={`${i}a`} x={x - w / 2} y={yy} width={w * 0.4} height={bar} fill={color} rx={0.4} />,
        <rect key={`${i}b`} x={x + w * 0.1} y={yy} width={w * 0.4} height={bar} fill={color} rx={0.4} />,
      );
    }
  }
  return <g>{rows}</g>;
}

export default function ArbolFuxi() {
  const [nivelVisible, setNivelVisible] = useState(6);
  const [auto, setAuto] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!auto) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setNivelVisible((n) => {
        if (n >= 6) {
          setAuto(false);
          return n;
        }
        return n + 1;
      });
    }, 800);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [auto]);

  const crecerDesdeCero = () => {
    setSel(null);
    setNivelVisible(0);
    setAuto(true);
  };

  const camino = useMemo(() => (sel == null ? null : caminoHasta(sel)), [sel]);
  const enCamino = useMemo(() => {
    if (!camino) return new Set<string>();
    return new Set(camino.map((n) => `${n.nivel}:${n.idx}`));
  }, [camino]);

  const h = sel != null ? hex(sel) : null;

  return (
    <div>
      <ExperimentHeader
        kicker="木 · del taiji a los 64"
        titulo="El árbol de Fu Xi"
        subtitulo="Cómo se genera el orden binario, una bifurcación por línea"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            La secuencia de Shao Yong no se memoriza: se <b>genera</b>. Del taiji salen
            dos (yin y yang), de cada uno salen otros dos, y a la sexta duplicación hay
            64 hojas. Cada nivel del árbol decide una línea del hexagrama, de abajo
            hacia arriba. Es el eslabón entre el{" "}
            <Link href="/experimentos/hipercubo" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              hipercubo
            </Link>{" "}
            y el{" "}
            <Link href="/experimentos/shao-yong" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              cuadrado de Shao Yong
            </Link>
            : la fábrica del conteo.
          </p>
        </Prose>
      </div>

      {/* Controles */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={crecerDesdeCero}
          className="rounded-full px-4 py-1.5 text-sm"
          style={{ background: ACCENT, color: "#0b0a08" }}
        >
          ▶ Crecer desde el taiji
        </button>
        <button
          onClick={() => {
            setAuto(false);
            setNivelVisible((n) => Math.min(6, n + 1));
          }}
          className="rounded-full border border-ink-700 px-3 py-1.5 text-sm text-sand-300"
        >
          + un nivel
        </button>
        <button
          onClick={() => {
            setAuto(false);
            setNivelVisible(6);
          }}
          className="rounded-full border border-ink-700 px-3 py-1.5 text-sm text-sand-400"
        >
          Árbol completo
        </button>
        <span className="ml-auto flex items-center gap-2">
          <label htmlFor="sel-hoja" className="font-mono text-[11px] uppercase tracking-widest text-sand-500">
            Hoja
          </label>
          <select
            id="sel-hoja"
            value={sel ?? ""}
            onChange={(e) => {
              setNivelVisible(6);
              setSel(e.target.value === "" ? null : Number(e.target.value));
            }}
            className="rounded-md border border-ink-600 bg-ink-850 px-2 py-1.5 font-mono text-xs text-sand-200"
          >
            <option value="">ninguna</option>
            {ALL_HEX.map((x) => (
              <option key={x.v} value={x.v}>
                {x.kw}. {x.py} ({x.bits})
              </option>
            ))}
          </select>
        </span>
      </div>

      {/* Árbol */}
      <Panel>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full min-w-[760px] select-none"
            role="img"
            aria-label="Árbol de bifurcación yin yang: 7 niveles del taiji a las 64 hojas; el camino de la raíz a una hoja es la lectura en bits del hexagrama"
          >
            {/* etiquetas de nivel */}
            {ETIQUETAS_NIVEL.map((et, nivel) => (
              <text
                key={nivel}
                x={8}
                y={yDe(nivel) + 4}
                style={{ fontSize: 10, fontFamily: "monospace" }}
                fill={nivel <= nivelVisible ? "#8a8271" : "#4a453b"}
              >
                {et}
              </text>
            ))}

            {/* aristas */}
            {NODOS.slice(1).map((fila, i) =>
              fila.map((n) => {
                const nivel = i + 1;
                if (nivel > nivelVisible) return null;
                const padre = NODOS[nivel - 1][Math.floor(n.idx / 2)];
                const activo =
                  enCamino.has(`${nivel}:${n.idx}`) &&
                  enCamino.has(`${padre.nivel}:${padre.idx}`);
                return (
                  <line
                    key={`${nivel}-${n.idx}`}
                    x1={xDe(padre.nivel, padre.idx)}
                    y1={yDe(padre.nivel) + 9}
                    x2={xDe(nivel, n.idx)}
                    y2={yDe(nivel) - 9}
                    stroke={activo ? ACCENT : "#3a362e"}
                    strokeWidth={activo ? 1.8 : 0.7}
                    opacity={activo ? 0.95 : 0.7}
                  />
                );
              }),
            )}

            {/* nodos */}
            {NODOS.map((fila, nivel) =>
              nivel > nivelVisible
                ? null
                : fila.map((n) => {
                    const x = xDe(nivel, n.idx);
                    const y = yDe(nivel);
                    const activo = enCamino.has(`${nivel}:${n.idx}`);
                    const color = activo ? "#f5efdf" : "#cfc7b2";
                    if (nivel === 0) {
                      return (
                        <g key="raiz">
                          <circle cx={x} cy={y} r={7} fill="none" stroke={activo ? ACCENT : "#8a8271"} strokeWidth={1.4} />
                          <circle cx={x} cy={y} r={2.4} fill={activo ? ACCENT : "#8a8271"} />
                        </g>
                      );
                    }
                    const w = nivel <= 3 ? 16 : nivel === 4 ? 13 : nivel === 5 ? 11 : 9;
                    return (
                      <g
                        key={`${nivel}-${n.idx}`}
                        onClick={
                          nivel === 6
                            ? () => setSel(parseInt(n.bits, 2))
                            : undefined
                        }
                        style={nivel === 6 ? { cursor: "pointer" } : undefined}
                      >
                        <PilaParcial bits={n.bits} x={x} y={y} w={w} color={activo ? ACCENT : color} />
                        {nivel === 6 && <rect x={x - 6} y={y - 12} width={12} height={24} fill="transparent" />}
                      </g>
                    );
                  }),
            )}
          </svg>
        </div>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-sand-500">
          decisión documentada: yin a la izquierda, yang a la derecha; como la primera
          bifurcación es la línea inferior (el bit más pesado, 32), las hojas quedan de
          izquierda a derecha en el orden binario exacto 0 a 63 (verificado)
        </p>
      </Panel>

      {/* Detalle del camino */}
      {h && camino && sel != null && (
        <div className="mt-5">
          <SectionLabel accent={ACCENT}>El camino es la lectura</SectionLabel>
          <Panel className="mt-2" accent={ACCENT}>
            <div className="flex flex-wrap items-start gap-6">
              <div className="text-center">
                <Glyph bits={h.bits} size={52} className="text-sand-100" />
                <div className="mt-2 text-base leading-tight text-sand-100">
                  {h.kw}. {h.py}
                </div>
                <div className="text-xs text-sand-400">{h.es}</div>
                <div className="mt-0.5 font-mono text-[10px] text-sand-600">
                  {h.bits}₂ = {h.v}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-sm text-sand-400">
                  Seis bifurcaciones desde el taiji, leídas como las seis líneas de
                  abajo hacia arriba:
                </p>
                <div className="space-y-1 font-mono text-[12px]">
                  {Array.from({ length: 6 }, (_, i) => {
                    const bit = h.bits[i];
                    const yang = bit === "1";
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-20 text-sand-500">nivel {i + 1} · L{i + 1}</span>
                        <span style={{ color: yang ? ACCENT : "#8a8271" }}>
                          {yang ? "yang (1)" : "yin (0)"}
                        </span>
                        <span className="text-sand-600">
                          {yang ? "rama derecha" : "rama izquierda"}
                          {i === 0 ? " · bit más pesado (32)" : i === 5 ? " · bit más ligero (1)" : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}
      {sel == null && (
        <p className="mt-4 text-center text-sm text-sand-500">
          Toca una hoja del último nivel (o elígela en el selector) para iluminar su
          camino desde la raíz: ese camino es, bit a bit, el hexagrama.
        </p>
      )}
    </div>
  );
}
