"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { hex } from "@/lib/iching";
import { SECUENCIA, TOTAL_SECUENCIAS, ventana, VENTANAS, verificar } from "@/lib/debruijn";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#63b6a6";
const CX = 200;
const CY = 200;
const R = 158;
const ok = verificar();

function pos(j: number): [number, number] {
  const ang = -Math.PI / 2 + (j * 2 * Math.PI) / 64;
  return [CX + R * Math.cos(ang), CY + R * Math.sin(ang)];
}

export default function Serpiente() {
  const [p, setP] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setP((x) => {
        if (x >= 63) {
          setPlaying(false);
          return x;
        }
        return x + 1;
      });
    }, 260);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing]);

  const enVentana = useMemo(() => {
    const s = new Set<number>();
    for (let x = 0; x < 6; x++) s.add((p + x) % 64);
    return s;
  }, [p]);

  const cubiertos = useMemo(() => new Set(VENTANAS.slice(0, p + 1)), [p]);
  const h = hex(ventana(p));

  const start = () => {
    if (p >= 63) setP(0);
    setPlaying(true);
  };

  return (
    <div>
      <ExperimentHeader
        kicker="⟳ · De Bruijn B(2,6)"
        titulo="La serpiente de De Bruijn"
        subtitulo="Los 64 hexagramas superpuestos en un anillo de 64 bits"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Existe un anillo de exactamente <b>64 líneas</b> yin/yang con una propiedad
            asombrosa: cada ventana de 6 posiciones consecutivas es un hexagrama{" "}
            <b>distinto</b>. Deslizando la ventana una posición cada vez, los 64
            hexagramas aparecen <b>una sola vez</b> cada uno. Es el libro entero
            comprimido al máximo: 64 hexagramas en 64 bits, sin desperdiciar ninguno. Y no
            es único: hay <b>2²⁶</b> anillos así; este es el canónico (el lexicográficamente
            mínimo).
          </p>
        </Prose>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor="64" etiqueta="bits en el anillo" accent={ACCENT} />
        <Stat valor="64/64" etiqueta={ok ? "ventanas distintas ✓" : "¡colisión!"} accent={ACCENT} />
        <Stat valor="2²⁶" etiqueta={`= ${TOTAL_SECUENCIAS.toLocaleString("es")} anillos`} />
        <Stat valor={`${cubiertos.size}/64`} etiqueta="hexagramas cubiertos" />
      </div>

      {/* Controles */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {!playing ? (
          <button onClick={start} className="rounded-full px-4 py-1.5 text-sm" style={{ background: ACCENT, color: "#0b0a08" }}>
            ▶ Deslizar la ventana
          </button>
        ) : (
          <button onClick={() => setPlaying(false)} className="rounded-full border border-ink-600 px-4 py-1.5 text-sm">
            ⏸ Pausa
          </button>
        )}
        <input
          type="range"
          min={0}
          max={63}
          value={p}
          onChange={(e) => {
            setPlaying(false);
            setP(Number(e.target.value));
          }}
          className="flex-1 accent-[#63b6a6]"
          aria-label="posición de la ventana"
        />
        <span className="font-mono text-xs text-sand-400">posición {p}/63</span>
      </div>

      {/* Anillo + hexagrama */}
      <Panel className="mb-6">
        <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[420px]" role="img" aria-label="anillo de De Bruijn de 64 bits con la ventana de 6 resaltada">
          <circle cx={CX} cy={CY} r={R + 16} fill="none" stroke="#2A2620" />
          {/* arco de la ventana */}
          {Array.from({ length: 6 }, (_, x) => {
            const [x1, y1] = pos((p + x) % 64);
            const [x2, y2] = pos((p + x + 1) % 64);
            if (x === 5) return null;
            return <line key={x} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ACCENT} strokeWidth={2} opacity={0.6} />;
          })}
          {/* beads */}
          {SECUENCIA.map((b, j) => {
            const [x, y] = pos(j);
            const dentro = enVentana.has(j);
            const yang = b === 1;
            return (
              <g key={j}>
                <circle
                  cx={x}
                  cy={y}
                  r={dentro ? 7 : 4.5}
                  fill={dentro ? (yang ? "#f5efdf" : ACCENT) : yang ? "#cfc7b2" : "#3a362e"}
                  stroke={dentro ? ACCENT : "none"}
                  strokeWidth={dentro ? 1.5 : 0}
                />
                {dentro && (
                  <text x={x} y={y} textAnchor="middle" dy="0.32em" style={{ fontSize: 7, fontFamily: "monospace" }} fill={yang ? "#0b0a08" : "#0b0a08"}>
                    {b}
                  </text>
                )}
              </g>
            );
          })}
          {/* hexagrama en el centro */}
          <foreignObject x={CX - 40} y={CY - 46} width={80} height={92}>
            <div className="flex flex-col items-center">
              <Glyph bits={h.bits} size={44} className="text-sand-100" />
              <div className="mt-1 text-center font-mono text-[10px] text-sand-300">
                {h.kw}. {h.py}
              </div>
              <div className="font-mono text-[9px]" style={{ color: ACCENT }}>
                {h.bits}
              </div>
            </div>
          </foreignObject>
        </svg>
        <p className="mt-1 text-center font-mono text-[10px] text-sand-500">
          la ventana lee 6 bits consecutivos; al girar todo el anillo pasan los 64
          hexagramas, cada uno una vez
        </p>
      </Panel>

      {/* Cobertura 8x8 */}
      <div>
        <SectionLabel accent={ACCENT}>Cobertura: cada posición, un hexagrama nuevo</SectionLabel>
        <Panel className="mt-2">
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 64 }, (_, val) => {
              const visto = cubiertos.has(val);
              const esActual = val === h.v;
              return (
                <div
                  key={val}
                  className="flex items-center justify-center rounded-[3px]"
                  title={`${hex(val).kw}. ${hex(val).py}`}
                  style={{
                    width: 16,
                    height: 16,
                    background: esActual ? "#f5efdf" : visto ? ACCENT : "#1c1915",
                    opacity: esActual ? 1 : visto ? 0.85 : 1,
                  }}
                />
              );
            })}
          </div>
          <p className="mt-3 text-sm text-sand-400">
            Los 64 cuadros son los 64 hexagramas (en orden Fu Xi). Al deslizar la ventana
            se encienden uno a uno, sin repetir: al completar la vuelta, están los 64.
          </p>
        </Panel>
      </div>
    </div>
  );
}
