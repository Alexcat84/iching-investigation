"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  EDGES,
  HEX_BY_VALUE,
  LINE_COLOR,
  gray,
  hex,
  lineBit,
} from "@/lib/iching";
import { ExperimentHeader } from "@/components/ui";

const GRAY = gray();
const R = 292;
const CX = 350;
const CY = 350;

function pos(idx: number): [number, number] {
  const ang = -Math.PI / 2 + (idx * 2 * Math.PI) / 64;
  return [CX + R * Math.cos(ang), CY + R * Math.sin(ang)];
}

/** Glifo pequeño para el anillo (línea 6 arriba, línea 1 abajo). */
function RingGlyph({
  bits,
  cx,
  cy,
  color,
}: {
  bits: string;
  cx: number;
  cy: number;
  color: string;
}) {
  const w = 16;
  const gap = 2.4;
  const bar = 1.9;
  const rows = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = cy - (5 * (gap + bar)) / 2 + (6 - k) * (gap + bar);
    if (yang) {
      rows.push(
        <rect key={k} x={cx - w / 2} y={y} width={w} height={bar} fill={color} rx={0.5} />,
      );
    } else {
      rows.push(
        <rect key={`${k}a`} x={cx - w / 2} y={y} width={w * 0.4} height={bar} fill={color} rx={0.5} />,
        <rect key={`${k}b`} x={cx + w * 0.1} y={y} width={w * 0.4} height={bar} fill={color} rx={0.5} />,
      );
    }
  }
  return <g>{rows}</g>;
}

function BigGlyph({ bits, highlight }: { bits: string; highlight?: number | null }) {
  const w = 84;
  const gap = 7;
  const bar = 8;
  const rows = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = (6 - k) * (gap + bar);
    const col = highlight === k ? LINE_COLOR[k] : "#E9E3D3";
    if (yang) {
      rows.push(<rect key={k} x={0} y={y} width={w} height={bar} rx={1.5} fill={col} />);
    } else {
      rows.push(
        <rect key={`${k}a`} x={0} y={y} width={w * 0.42} height={bar} rx={1.5} fill={col} />,
        <rect key={`${k}b`} x={w * 0.58} y={y} width={w * 0.42} height={bar} rx={1.5} fill={col} />,
      );
    }
  }
  return (
    <svg
      viewBox={`-6 -6 ${w + 12} ${6 * bar + 5 * gap + 12}`}
      style={{ width: 76 }}
      aria-hidden="true"
    >
      {rows}
    </svg>
  );
}

export default function Hipercubo() {
  const [order, setOrder] = useState<"fuxi" | "kingwen">("fuxi");
  const [selected, setSelected] = useState<number | null>(null);
  const [lines, setLines] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  });
  const [walking, setWalking] = useState(false);
  const [step, setStep] = useState(-1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const idxOf = useMemo(() => {
    const arr = new Array(64);
    if (order === "fuxi") {
      for (let v = 0; v < 64; v++) arr[v] = v;
    } else {
      for (let v = 0; v < 64; v++) arr[v] = HEX_BY_VALUE[v].kw - 1;
    }
    return arr;
  }, [order]);

  const pts = useMemo(() => {
    const p: [number, number][] = new Array(64);
    for (let v = 0; v < 64; v++) p[v] = pos(idxOf[v]);
    return p;
  }, [idxOf]);

  useEffect(() => {
    if (!walking) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setStep((s) => {
        const nx = s + 1;
        if (nx >= 64) {
          setWalking(false);
          return s;
        }
        setSelected(GRAY[nx]);
        return nx;
      });
    }, 420);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [walking]);

  const startWalk = () => {
    setStep(0);
    setSelected(GRAY[0]);
    setWalking(true);
  };
  const resetWalk = () => {
    setWalking(false);
    setStep(-1);
    setSelected(null);
  };

  const trail = useMemo(() => {
    const t: { a: number; b: number; line: number }[] = [];
    for (let s = 1; s <= step && s < 64; s++) {
      const a = GRAY[s - 1];
      const b = GRAY[s];
      const diff = a ^ b;
      const k = 6 - Math.round(Math.log2(diff));
      t.push({ a, b, line: k });
    }
    return t;
  }, [step]);

  const lastLine = trail.length ? trail[trail.length - 1].line : null;

  const edgePath = (a: number, b: number) => {
    const [x1, y1] = pts[a];
    const [x2, y2] = pts[b];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const cx = CX + (mx - CX) * 0.32;
    const cy = CY + (my - CY) * 0.32;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  const sel = selected != null ? HEX_BY_VALUE[selected] : null;
  const neighbors = sel
    ? [1, 2, 3, 4, 5, 6].map((k) => ({ k, h: hex(sel.v ^ lineBit(k)) }))
    : [];

  return (
    <div>
      <ExperimentHeader
        kicker="易 · 2⁶ = 64"
        titulo="El hipercubo del I Ching"
        subtitulo="64 hexagramas · 192 mutaciones de una línea · un recorrido Gray"
        accent="#5b8fd9"
      />

      {/* Controles de orden */}
      <div className="mb-1 flex flex-wrap items-center justify-center gap-2">
        {(["fuxi", "kingwen"] as const).map((o) => (
          <button
            key={o}
            onClick={() => setOrder(o)}
            className="rounded-full border px-3 py-1.5 text-xs tracking-wide transition-colors"
            style={
              order === o
                ? { background: "#B5442D", color: "#F5EFDF", borderColor: "transparent" }
                : { borderColor: "#3A362E", color: "#8a8271" }
            }
          >
            {o === "fuxi" ? "Orden Fu Xi (binario 0–63)" : "Orden Rey Wen (tradicional)"}
          </button>
        ))}
      </div>
      <p className="mb-4 text-center text-xs text-sand-500">
        {order === "fuxi"
          ? "Los hilos forman un patrón simétrico: el conteo binario respeta la geometría del hipercubo."
          : "Los mismos 192 hilos, ahora enredados: el orden del libro ignora la geometría binaria."}
      </p>

      {/* Anillo */}
      <svg
        viewBox="0 0 700 700"
        className="w-full select-none"
        role="img"
        aria-label="Anillo de 64 hexagramas con conexiones de una línea"
      >
        <circle cx={CX} cy={CY} r={R + 22} fill="none" stroke="#2A2620" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R - 20} fill="none" stroke="#1C1915" strokeWidth="1" />

        {EDGES.filter((e) => lines[e.line]).map((e, i) => {
          const touching = selected != null && (e.a === selected || e.b === selected);
          const dim = selected != null && !touching;
          return (
            <path
              key={i}
              d={edgePath(e.a, e.b)}
              fill="none"
              stroke={LINE_COLOR[e.line]}
              strokeWidth={touching ? 2 : 0.8}
              opacity={dim ? 0.05 : touching ? 0.95 : 0.28}
            />
          );
        })}

        {trail.map((e, i) => (
          <path
            key={`t${i}`}
            d={edgePath(e.a, e.b)}
            fill="none"
            stroke={LINE_COLOR[e.line]}
            strokeWidth={2.2}
            opacity={0.9}
          />
        ))}

        {Array.from({ length: 64 }, (_, v) => {
          const [x, y] = pts[v];
          const isSel = selected === v;
          return (
            <g
              key={v}
              onClick={() => {
                setWalking(false);
                setSelected(isSel ? null : v);
              }}
              style={{ cursor: "pointer" }}
            >
              {isSel && (
                <circle cx={x} cy={y} r={13} fill="none" stroke="#B5442D" strokeWidth="1.5" />
              )}
              <RingGlyph
                bits={HEX_BY_VALUE[v].bits}
                cx={x}
                cy={y}
                color={isSel ? "#F5EFDF" : "#CFC7B2"}
              />
              <circle cx={x} cy={y} r={13} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {/* Filtros de línea */}
      <div className="mb-5 mt-3 flex flex-wrap justify-center gap-2">
        {[1, 2, 3, 4, 5, 6].map((k) => (
          <button
            key={k}
            onClick={() => setLines((L) => ({ ...L, [k]: !L[k] }))}
            className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs"
            style={{
              borderColor: lines[k] ? LINE_COLOR[k] : "#3A362E",
              color: lines[k] ? "#E9E3D3" : "#6B6558",
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: lines[k] ? LINE_COLOR[k] : "#3A362E" }}
            />
            L{k}
            {k === 1 ? " (abajo)" : k === 6 ? " (arriba)" : ""}
          </button>
        ))}
      </div>

      {/* Recorrido Gray */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        {!walking ? (
          <button
            onClick={startWalk}
            className="rounded-full px-4 py-2 text-sm"
            style={{ background: "#B5442D", color: "#F5EFDF" }}
          >
            ▶ Recorrido Gray
          </button>
        ) : (
          <button
            onClick={() => setWalking(false)}
            className="rounded-full border border-ink-600 px-4 py-2 text-sm"
          >
            ⏸ Pausa
          </button>
        )}
        {step >= 0 && (
          <>
            {!walking && step < 63 && (
              <button
                onClick={() => setWalking(true)}
                className="rounded-full border border-ink-600 px-3 py-2 text-sm"
              >
                Continuar
              </button>
            )}
            <button
              onClick={resetWalk}
              className="rounded-full border border-ink-700 px-3 py-2 text-sm text-sand-400"
            >
              Reiniciar
            </button>
            <span className="font-mono text-xs text-sand-400">
              paso {Math.max(step, 0) + 1}/64
              {lastLine && (
                <span style={{ color: LINE_COLOR[lastLine] }}> · cambió L{lastLine}</span>
              )}
            </span>
          </>
        )}
      </div>
      {step === 63 && (
        <p className="-mt-3 mb-6 text-center text-xs text-sand-500">
          El recorrido empezó en Kun (Lo Receptivo, 0) y terminó en Fu — «El Retorno»
          (32). Cada paso cambió exactamente una línea.
        </p>
      )}

      {/* Panel de detalle */}
      {sel ? (
        <div className="rounded-xl border border-ink-700 bg-ink-850/40 p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <BigGlyph bits={sel.bits} highlight={walking || step >= 0 ? lastLine : null} />
            <div className="min-w-0">
              <div className="text-lg leading-tight text-sand-100">
                {sel.kw}. {sel.py} · {sel.es}
              </div>
              <div className="mt-1 font-mono text-sm text-sand-400">
                {sel.bits}₂ = {sel.v}{" "}
                <span className="text-sand-600">(abajo→arriba, yang=1)</span>
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-widest text-sand-500">
                Seis mutaciones posibles
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {neighbors.map(({ k, h }) => (
                  <button
                    key={k}
                    onClick={() => {
                      setWalking(false);
                      setSelected(h.v);
                    }}
                    className="rounded-md border px-2.5 py-1 font-mono text-xs text-sand-200"
                    style={{ borderColor: LINE_COLOR[k] + "88" }}
                  >
                    <span style={{ color: LINE_COLOR[k] }}>L{k}</span> → {h.kw} {h.py}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-sand-500">
          Toca cualquier hexagrama del anillo para ver su valor binario y sus seis
          vecinos, o lanza el recorrido Gray para ver los 64 estados conectados por
          mutaciones de una sola línea.
        </p>
      )}
    </div>
  );
}
