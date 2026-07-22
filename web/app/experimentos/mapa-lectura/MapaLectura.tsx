"use client";

import { useMemo, useState } from "react";
import {
  hex,
  lineBit,
  LINE_COLOR,
  LINE_MEANING,
  mutate,
  TRIGRAM_INFO,
} from "@/lib/iching";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel } from "@/components/ui";

const ACCENT = "#5fae7f";
const CX = 160;
const CY = 160;
const R = 132;

function pos(v: number): [number, number] {
  const ang = -Math.PI / 2 + (v * 2 * Math.PI) / 64;
  return [CX + R * Math.cos(ang), CY + R * Math.sin(ang)];
}

/** Anillo compacto que resalta el salto de una lectura. */
function RingJump({
  origen,
  destino,
  moving,
}: {
  origen: number;
  destino: number;
  moving: number[];
}) {
  // Geodésica: voltear las líneas mutantes en orden ascendente.
  const path: { a: number; b: number; line: number }[] = [];
  let cur = origen;
  for (const k of [...moving].sort((a, b) => a - b)) {
    const nx = cur ^ lineBit(k);
    path.push({ a: cur, b: nx, line: k });
    cur = nx;
  }
  const edgePath = (a: number, b: number) => {
    const [x1, y1] = pos(a);
    const [x2, y2] = pos(b);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const cx = CX + (mx - CX) * 0.3;
    const cy = CY + (my - CY) * 0.3;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };
  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-[320px]" role="img" aria-label="salto en el hipercubo">
      <circle cx={CX} cy={CY} r={R + 12} fill="none" stroke="#2A2620" strokeWidth="1" />
      {Array.from({ length: 64 }, (_, v) => {
        const [x, y] = pos(v);
        const isEnd = v === origen || v === destino;
        return (
          <circle
            key={v}
            cx={x}
            cy={y}
            r={isEnd ? 3.2 : 1.3}
            fill={
              v === origen ? "#5b8fd9" : v === destino ? ACCENT : "#4a453b"
            }
          />
        );
      })}
      {path.map((e, i) => (
        <path
          key={i}
          d={edgePath(e.a, e.b)}
          fill="none"
          stroke={LINE_COLOR[e.line]}
          strokeWidth={2}
          opacity={0.95}
        />
      ))}
      {origen === destino && (
        <text x={CX} y={CY} textAnchor="middle" dy="0.35em" className="fill-sand-500" style={{ fontSize: 11, fontFamily: "monospace" }}>
          sin cambio
        </text>
      )}
    </svg>
  );
}

interface LineState {
  yang: boolean;
  moving: boolean;
}

const INIT: LineState[] = Array.from({ length: 6 }, () => ({
  yang: false,
  moving: false,
}));

/** Lanza 3 monedas (cara = 3, cruz = 2) para una línea. */
function tirarLinea(): LineState {
  let s = 0;
  for (let i = 0; i < 3; i++) s += Math.random() < 0.5 ? 3 : 2;
  // 6 = yin viejo, 7 = yang joven, 8 = yin joven, 9 = yang viejo
  if (s === 6) return { yang: false, moving: true };
  if (s === 7) return { yang: true, moving: false };
  if (s === 8) return { yang: false, moving: false };
  return { yang: true, moving: true };
}

export default function MapaLectura() {
  // lines[0] = línea 1 (abajo)
  const [lines, setLines] = useState<LineState[]>(INIT);

  const origen = useMemo(() => {
    let v = 0;
    for (let k = 1; k <= 6; k++) if (lines[k - 1].yang) v |= lineBit(k);
    return v;
  }, [lines]);

  const moving = useMemo(
    () => lines.map((l, i) => (l.moving ? i + 1 : 0)).filter((k) => k > 0),
    [lines],
  );

  const destino = mutate(origen, moving);
  const hO = hex(origen);
  const hD = hex(destino);

  const setLine = (i: number, patch: Partial<LineState>) =>
    setLines((L) => L.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  const echarMonedas = () =>
    setLines(Array.from({ length: 6 }, () => tirarLinea()));
  const limpiar = () => setLines(INIT);

  return (
    <div>
      <ExperimentHeader
        kicker="䷗ · el oráculo como grafo"
        titulo="El mapa de la lectura"
        subtitulo="Toda consulta es un salto en el hipercubo"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Una consulta del I Ching ya es un movimiento en el grafo: partes de un
            hexagrama y las <b>líneas mutantes</b> te trasladan a otro. La distancia
            del salto es, exactamente, el número de líneas que cambian. Construye una
            lectura abajo —o <b>echa las monedas</b>— y observa el trayecto.
          </p>
        </Prose>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Constructor de líneas */}
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel accent={ACCENT}>Construye la lectura</SectionLabel>
            <div className="flex gap-2">
              <button
                onClick={echarMonedas}
                className="rounded-full px-3 py-1.5 text-xs"
                style={{ background: ACCENT, color: "#0b0a08" }}
              >
                🪙 Echar monedas
              </button>
              <button
                onClick={limpiar}
                className="rounded-full border border-ink-700 px-3 py-1.5 text-xs text-sand-400"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {[6, 5, 4, 3, 2, 1].map((k) => {
              const l = lines[k - 1];
              return (
                <div key={k} className="flex items-center gap-3">
                  <span className="w-14 font-mono text-[11px] text-sand-500">
                    L{k}
                    {k === 1 ? " ↓" : k === 6 ? " ↑" : ""}
                  </span>
                  {/* La línea, clicable para alternar yin/yang */}
                  <button
                    onClick={() => setLine(k - 1, { yang: !l.yang })}
                    className="relative flex h-7 flex-1 items-center"
                    aria-label={`línea ${k}, ${l.yang ? "yang" : "yin"}`}
                  >
                    {l.yang ? (
                      <span
                        className="h-2.5 w-full rounded-sm"
                        style={{ background: l.moving ? LINE_COLOR[k] : "#cfc7b2" }}
                      />
                    ) : (
                      <span className="flex w-full items-center justify-between">
                        <span
                          className="h-2.5 w-[42%] rounded-sm"
                          style={{ background: l.moving ? LINE_COLOR[k] : "#cfc7b2" }}
                        />
                        <span
                          className="h-2.5 w-[42%] rounded-sm"
                          style={{ background: l.moving ? LINE_COLOR[k] : "#cfc7b2" }}
                        />
                      </span>
                    )}
                  </button>
                  {/* Marca de mutante */}
                  <button
                    onClick={() => setLine(k - 1, { moving: !l.moving })}
                    className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-mono transition-colors"
                    style={{
                      borderColor: l.moving ? LINE_COLOR[k] : "#3A362E",
                      color: l.moving ? LINE_COLOR[k] : "#6B6558",
                      background: l.moving ? LINE_COLOR[k] + "22" : "transparent",
                    }}
                    aria-label={`marcar línea ${k} como mutante`}
                    title="marcar como línea mutante"
                  >
                    ○
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[10px] leading-relaxed text-sand-600">
            Clic en la línea para alternar yin/yang · clic en el círculo para marcarla
            como mutante (móvil).
          </p>
        </Panel>

        {/* Anillo del salto */}
        <Panel className="flex flex-col items-center justify-center">
          <RingJump origen={origen} destino={destino} moving={moving} />
          <div className="mt-2 text-center font-mono text-[11px] text-sand-500">
            distancia del salto:{" "}
            <span style={{ color: ACCENT }}>{moving.length}</span>{" "}
            {moving.length === 1 ? "línea" : "líneas"}
          </div>
        </Panel>
      </div>

      {/* Resultado */}
      <div className="mt-5">
        <Panel accent={ACCENT}>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <HexBlock titulo="Hexagrama presente" h={hO} moving={moving} color="#5b8fd9" />
            <div className="text-center">
              <div className="text-3xl text-sand-600">→</div>
              <div className="mt-1 font-mono text-[10px] text-sand-500">
                {moving.length === 0 ? "estático" : `${moving.length} mutan`}
              </div>
            </div>
            <HexBlock
              titulo="Hexagrama futuro"
              h={hD}
              moving={[]}
              color={ACCENT}
              dim={moving.length === 0}
            />
          </div>

          {/* Lectura de las líneas mutantes */}
          {moving.length > 0 && (
            <div className="mt-6 border-t border-ink-700 pt-4">
              <SectionLabel accent={ACCENT}>
                Lo que mueve — {moving.length}{" "}
                {moving.length === 1 ? "línea mutante" : "líneas mutantes"}
              </SectionLabel>
              <div className="mt-2 space-y-2">
                {moving.map((k) => (
                  <div key={k} className="flex items-baseline gap-3 text-sm">
                    <span
                      className="mt-0.5 w-16 shrink-0 font-mono text-xs"
                      style={{ color: LINE_COLOR[k] }}
                    >
                      L{k}
                    </span>
                    <span className="text-sand-200">
                      <b className="font-semibold">{LINE_MEANING[k].titulo}</b>
                      <span className="text-sand-400"> — {LINE_MEANING[k].texto}.</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {moving.length === 0 && (
            <p className="mt-5 text-center text-sm text-sand-500">
              Sin líneas mutantes, la lectura descansa: el hexagrama presente es también
              el futuro. Marca alguna línea como móvil para ver el salto.
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function HexBlock({
  titulo,
  h,
  moving,
  color,
  dim,
}: {
  titulo: string;
  h: ReturnType<typeof hex>;
  moving: number[];
  color: string;
  dim?: boolean;
}) {
  const lo = TRIGRAM_INFO[h.lower];
  const up = TRIGRAM_INFO[h.upper];
  return (
    <div className={`text-center ${dim ? "opacity-45" : ""}`}>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest" style={{ color }}>
        {titulo}
      </div>
      <div className="flex justify-center">
        <Glyph bits={h.bits} size={56} moving={moving} className="text-sand-100" />
      </div>
      <div className="mt-2 text-base leading-tight text-sand-100">
        {h.kw}. {h.py}
      </div>
      <div className="text-xs text-sand-400">{h.es}</div>
      <div className="mt-1 font-mono text-[10px] text-sand-600">
        {up.imagen} {up.es} / {lo.imagen} {lo.es}
      </div>
      <div className="font-mono text-[10px] text-sand-600">
        {h.bits}₂ = {h.v}
      </div>
    </div>
  );
}
