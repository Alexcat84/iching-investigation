"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { hex } from "@/lib/iching";
import {
  anguloCirculo,
  CAMINO_LECTURA,
  celdaDe,
  CUADRADO,
  fijosDe,
  ORBITAS_D4,
  SIMETRIAS_D4,
  simetriasCirculo,
} from "@/lib/shaoyong";
import { ExperimentHeader, Panel, Prose, SectionLabel } from "@/components/ui";

const ACCENT = "#6fa8b0";

// === glifo inline para SVG ===
function svgGlyph(bits: string, cx: number, cy: number, w: number, color: string) {
  const bar = w * 0.11;
  const gap = w * 0.08;
  const totalH = 6 * bar + 5 * gap;
  const y0 = cy - totalH / 2;
  const rects = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = y0 + (6 - k) * (gap + bar);
    if (yang) {
      rects.push(<rect key={k} x={cx - w / 2} y={y} width={w} height={bar} rx={0.4} fill={color} />);
    } else {
      const seg = w * 0.4;
      rects.push(
        <rect key={`${k}a`} x={cx - w / 2} y={y} width={seg} height={bar} rx={0.4} fill={color} />,
        <rect key={`${k}b`} x={cx + w / 2 - seg} y={y} width={seg} height={bar} rx={0.4} fill={color} />,
      );
    }
  }
  return <g>{rects}</g>;
}

// === El cuadrado ===
const CELL = 66;
const PAD = 26;
const SIZE = CELL * 8;

function Cuadrado() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= 63) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 130);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing]);

  const start = () => {
    if (step >= 63) setStep(-1);
    setPlaying(true);
  };

  const centro = (fila: number, col: number): [number, number] => [
    PAD + col * CELL + CELL / 2,
    PAD + fila * CELL + CELL / 2,
  ];

  const trazo = CAMINO_LECTURA.slice(0, Math.max(step + 1, 0)).map((c) =>
    centro(c.fila, c.col),
  );
  const actual = step >= 0 ? step : null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {!playing ? (
          <button
            onClick={start}
            className="rounded-full px-4 py-1.5 text-sm"
            style={{ background: ACCENT, color: "#0b0a08" }}
          >
            ▶ Leer 0 → 63
          </button>
        ) : (
          <button
            onClick={() => setPlaying(false)}
            className="rounded-full border border-ink-600 px-4 py-1.5 text-sm"
          >
            ⏸ Pausa
          </button>
        )}
        {step >= 0 && (
          <button
            onClick={() => {
              setPlaying(false);
              setStep(-1);
            }}
            className="rounded-full border border-ink-700 px-3 py-1.5 text-sm text-sand-400"
          >
            Reiniciar
          </button>
        )}
        <input
          type="range"
          min={-1}
          max={63}
          value={step}
          onChange={(e) => {
            setPlaying(false);
            setStep(Number(e.target.value));
          }}
          className="flex-1 accent-[#6fa8b0]"
          aria-label="posición de lectura"
        />
        {actual != null && (
          <span className="font-mono text-xs text-sand-300">
            <span style={{ color: ACCENT }}>{actual.toString(2).padStart(6, "0")}</span>
            <span className="text-sand-500"> = {actual}</span> · {hex(actual).py}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${SIZE + PAD * 2} ${SIZE + PAD * 2}`}
          className="mx-auto w-full max-w-[560px]"
          role="img"
          aria-label="cuadrado 8×8 de Shao Yong"
        >
          {/* celdas */}
          {CUADRADO.map((filaArr, fila) =>
            filaArr.map((v, col) => {
              const x = PAD + col * CELL;
              const y = PAD + fila * CELL;
              const isActual = v === actual;
              const yaLeido = actual != null && v <= actual;
              return (
                <g key={v}>
                  <rect
                    x={x + 1.5}
                    y={y + 1.5}
                    width={CELL - 3}
                    height={CELL - 3}
                    rx={4}
                    fill={isActual ? "rgba(111,168,176,0.20)" : yaLeido ? "rgba(111,168,176,0.05)" : "transparent"}
                    stroke={isActual ? ACCENT : "#2A2620"}
                    strokeWidth={isActual ? 1.5 : 1}
                  />
                  {svgGlyph(
                    hex(v).bits,
                    x + CELL / 2,
                    y + CELL / 2 - 4,
                    CELL * 0.42,
                    isActual ? "#f5efdf" : yaLeido ? "#cfc7b2" : "#6b6558",
                  )}
                  <text
                    x={x + CELL / 2}
                    y={y + CELL - 7}
                    textAnchor="middle"
                    style={{ fontSize: 9, fontFamily: "monospace" }}
                    fill={isActual ? ACCENT : "#6b6558"}
                  >
                    {v}
                  </text>
                </g>
              );
            }),
          )}
          {/* camino de lectura */}
          {trazo.length > 1 && (
            <polyline
              points={trazo.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke={ACCENT}
              strokeWidth={2}
              strokeLinejoin="round"
              opacity={0.8}
            />
          )}
          {/* etiquetas de eje */}
          <text x={PAD} y={16} style={{ fontSize: 10, fontFamily: "monospace" }} fill="#8a8271">
            ← trigrama inferior (columna): Kun → Qian →
          </text>
          <text
            x={14}
            y={PAD + SIZE / 2}
            style={{ fontSize: 10, fontFamily: "monospace" }}
            fill="#8a8271"
            transform={`rotate(-90 14 ${PAD + SIZE / 2})`}
            textAnchor="middle"
          >
            trigrama superior (fila): Qian ↑ Kun
          </text>
        </svg>
      </div>
    </div>
  );
}

// === El círculo ===
const CX = 200;
const CY = 200;
const RC = 168;

function posC(v: number): [number, number] {
  const a = anguloCirculo(v);
  return [CX + RC * Math.cos(a), CY + RC * Math.sin(a)];
}

function Circulo() {
  const [sel, setSel] = useState<number | null>(24); // Fu (retorno del yang)
  const sim = sel != null ? simetriasCirculo(sel) : null;

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 400 400"
          className="mx-auto w-full max-w-[420px]"
          role="img"
          aria-label="círculo de Shao Yong"
        >
          {/* eje vertical de reflexión (dui) */}
          {sel != null && (
            <line x1={CX} y1={CY - RC - 16} x2={CX} y2={CY + RC + 16} stroke="#2A2620" strokeDasharray="3 4" />
          )}
          <circle cx={CX} cy={CY} r={RC + 12} fill="none" stroke="#2A2620" />
          {/* conexión dui (reflexión) y antípoda (diámetro) */}
          {sel != null && sim && (
            <>
              <line
                x1={posC(sel)[0]}
                y1={posC(sel)[1]}
                x2={posC(sim.dui)[0]}
                y2={posC(sim.dui)[1]}
                stroke={ACCENT}
                strokeWidth={1.5}
                opacity={0.8}
              />
              <line
                x1={posC(sel)[0]}
                y1={posC(sel)[1]}
                x2={posC(sim.antipoda)[0]}
                y2={posC(sim.antipoda)[1]}
                stroke="#b57bb0"
                strokeWidth={1.2}
                strokeDasharray="4 3"
                opacity={0.7}
              />
            </>
          )}
          {Array.from({ length: 64 }, (_, v) => {
            const [x, y] = posC(v);
            const isSel = v === sel;
            const isDui = sim?.dui === v;
            const isAnti = sim?.antipoda === v;
            const col = isSel ? "#f5efdf" : isDui ? ACCENT : isAnti ? "#b57bb0" : "#6b6558";
            return (
              <g key={v} onClick={() => setSel(v)} style={{ cursor: "pointer" }}>
                {svgGlyph(hex(v).bits, x, y, 13, col)}
                <circle cx={x} cy={y} r={11} fill="transparent" />
                {(isSel || isDui || isAnti) && (
                  <circle cx={x} cy={y} r={12} fill="none" stroke={col} strokeWidth={0.8} opacity={0.6} />
                )}
              </g>
            );
          })}
          <text x={CX} y={20} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace" }} fill="#8a8271">
            Qian 63
          </text>
          <text x={CX} y={392} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace" }} fill="#8a8271">
            Kun 0
          </text>
        </svg>
      </div>

      {sel != null && sim && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono text-[11px]">
          <span className="text-sand-200">
            {hex(sel).kw}. {hex(sel).py} <span className="text-sand-600">({sel})</span>
          </span>
          <span style={{ color: ACCENT }}>
            opuesto (dui) → {hex(sim.dui).py} <span className="opacity-70">reflejo vertical</span>
          </span>
          <span style={{ color: "#b57bb0" }}>
            antípoda → {hex(sim.antipoda).py} <span className="opacity-70">voltea la línea inferior</span>
          </span>
        </div>
      )}
    </div>
  );
}

/** Panel: las 8 simetrías del cuadrado (grupo diédrico D4), animadas. */
function SimetriasCuadrado() {
  const [simId, setSimId] = useState("id");
  const sim = SIMETRIAS_D4.find((s) => s.id === simId) ?? SIMETRIAS_D4[0];
  const fijos = useMemo(() => new Set(fijosDe(sim)), [sim]);

  const CEL = 40;
  const PADQ = 10;
  const SQ = CEL * 8 + PADQ * 2;

  return (
    <Panel className="mt-2">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {SIMETRIAS_D4.map((s) => (
          <button
            key={s.id}
            onClick={() => setSimId(s.id)}
            className="rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
            style={
              simId === s.id
                ? { background: ACCENT, color: "#0b0a08", borderColor: "transparent" }
                : { borderColor: "#3A362E", color: "#8a8271" }
            }
          >
            {s.nombre}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <svg
          viewBox={`0 0 ${SQ} ${SQ}`}
          className="w-full max-w-[380px] select-none"
          role="img"
          aria-label={`Cuadrado de Shao Yong bajo la simetría ${sim.nombre}: cada glifo viaja a su celda transformada; los fijos quedan marcados`}
        >
          <rect x={PADQ} y={PADQ} width={CEL * 8} height={CEL * 8} fill="none" stroke="#2A2620" />
          {/* rejilla tenue */}
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i} stroke="#1C1915">
              <line x1={PADQ + (i + 1) * CEL} y1={PADQ} x2={PADQ + (i + 1) * CEL} y2={PADQ + 8 * CEL} />
              <line x1={PADQ} y1={PADQ + (i + 1) * CEL} x2={PADQ + 8 * CEL} y2={PADQ + (i + 1) * CEL} />
            </g>
          ))}
          {/* glifos animados: cada hexagrama viaja a su celda transformada */}
          {Array.from({ length: 64 }, (_, v) => {
            const [f0, c0] = celdaDe(v);
            const [f, c] = sim.celda(f0, c0);
            const x = PADQ + c * CEL + CEL / 2;
            const y = PADQ + f * CEL + CEL / 2;
            const esFijo = fijos.has(v) && sim.id !== "id";
            return (
              <g
                key={v}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  transition: "transform 750ms cubic-bezier(0.3, 0.7, 0.2, 1)",
                }}
              >
                {esFijo && <circle r={15} fill="rgba(111,168,176,0.14)" stroke={ACCENT} strokeWidth={0.8} />}
                {svgGlyph(hex(v).bits, 0, 0, CEL * 0.42, esFijo ? "#f5efdf" : "#a99f8a")}
              </g>
            );
          })}
        </svg>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest" style={{ color: ACCENT }}>
            {sim.nombre}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-sand-300">
            Sobre los hexagramas: <b className="text-sand-100">{sim.operacion}</b>.
          </p>
          <p className="mt-2 font-mono text-[11px] text-sand-500">
            puntos fijos: {fijosDe(sim).length}
            {sim.id === "antitransposicion" && " (la diagonal de los 8 puros)"}
            {sim.id === "transposicion" && " (los 8 con trigramas complementarios: Tai, Pi, Xian, Heng...)"}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-sand-400">
            Derivado del layout real del cuadrado (columna = trigrama inferior, fila =
            superior invertido) y verificado sobre los 64 hexagramas: la geometría del
            papel y el álgebra de los trigramas son el mismo grupo. Las 8 simetrías
            parten los 64 hexagramas en{" "}
            <span style={{ color: ACCENT }}>{ORBITAS_D4} órbitas</span> (Burnside: la
            media de puntos fijos).
          </p>
        </div>
      </div>
    </Panel>
  );
}

export default function ShaoYong() {
  return (
    <div>
      <ExperimentHeader
        kicker="圓 · 先天 · Shao Yong, siglo XI"
        titulo="El cuadrado y el círculo"
        subtitulo="El diagrama que Bouvet envió a Leibniz (carta de 1701, citada en 1703)"
        accent={ACCENT}
      />

      <div className="mb-8">
        <Prose>
          <p>
            Shao Yong dispuso los 64 hexagramas a la vez en un <b>cuadrado</b> 8×8 y en un{" "}
            <b>círculo</b>, ambos en orden binario. El jesuita Joachim Bouvet le envió
            este diagrama a Leibniz (que ya había inventado la aritmética binaria) en una
            carta del 4 de noviembre de 1701 que Leibniz recibió el 1 de abril de 1703;
            reconoció al instante la identidad: leer el cuadrado en orden es contar de 0 a
            63. Lo citó en la Explication de ese mismo año.
          </p>
        </Prose>
      </div>

      <div className="mb-8">
        <SectionLabel accent={ACCENT}>El cuadrado: leerlo es contar en binario</SectionLabel>
        <Panel className="mt-2">
          <Cuadrado />
          <p className="mt-3 text-sm text-sand-400">
            La columna fija el trigrama inferior y la fila el superior; el valor de cada
            celda es <code>(inferior × 8) + superior</code>. Recorriendo las celdas en
            orden 0, 1, 2, … 63 se enciende, línea a línea, el conteo binario. Kun (0)
            abajo a la izquierda, Qian (63) arriba a la derecha.
          </p>
        </Panel>
      </div>

      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Las ocho simetrías del cuadrado (D4)</SectionLabel>
        <SimetriasCuadrado />
      </div>

      <div>
        <SectionLabel accent={ACCENT}>El círculo y sus simetrías</SectionLabel>
        <Panel className="mt-2">
          <Circulo />
          <p className="mt-3 text-sm text-sand-400">
            En el círculo, el <b className="text-sand-200">opuesto</b> de cada hexagrama
            (dui, sus seis líneas invertidas) es su <b className="text-sand-200">reflejo</b>{" "}
            exacto sobre el eje vertical Qian–Kun. Su <b className="text-sand-200">antípoda</b>{" "}
            (el punto diametralmente opuesto) es, en cambio, solo voltear la línea inferior.
            Toca cualquier hexagrama para verlo.
          </p>
        </Panel>
      </div>
    </div>
  );
}
