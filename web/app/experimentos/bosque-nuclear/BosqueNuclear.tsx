"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ALL_HEX, hex, huGua } from "@/lib/iching";
import { caida, CUENCAS, IMAGEN1, IMAGEN2, PROFUNDIDAD, type Cuenca } from "@/lib/bosque";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#b08968";
/** Colores por cuenca (decorativos: cada cuenca vive en su propio panel rotulado). */
const COLOR_CUENCA: Record<string, string> = {
  "63": "#e5c558", // Qian
  "0": "#5b8fd9", // Kun
  "21,42": "#b08968", // Ji Ji y Wei Ji
};

function colorDe(c: Cuenca): string {
  return COLOR_CUENCA[c.atractores.join(",")] ?? ACCENT;
}

/** Glifo compacto reutilizable dentro de los SVG de cuenca. */
function MiniGlyph({ v, x, y, w, color }: { v: number; x: number; y: number; w: number; color: string }) {
  const bits = hex(v).bits;
  const bar = w * 0.12;
  const gap = w * 0.145;
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

/** Una cuenca dibujada en radial: atractor al centro, profundidad 1 y 2 en anillos. */
function CuencaRadial({
  cuenca,
  sel,
  rastro,
  onSel,
}: {
  cuenca: Cuenca;
  sel: number | null;
  rastro: number[];
  onSel: (v: number) => void;
}) {
  const S = 330;
  const C = S / 2;
  const color = colorDe(cuenca);

  const pos = useMemo(() => {
    const p = new Map<number, [number, number]>();
    // Atractores al centro (1 o 2 nodos).
    cuenca.atractores.forEach((v, i) => {
      const off = cuenca.atractores.length === 1 ? 0 : i === 0 ? -26 : 26;
      p.set(v, [C + off, C]);
    });
    const anillo = (miembros: number[], r: number) => {
      miembros.forEach((v, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / miembros.length;
        p.set(v, [C + r * Math.cos(ang), C + r * Math.sin(ang)]);
      });
    };
    anillo(cuenca.profundidad1, 66);
    anillo(cuenca.profundidad2, 122);
    return p;
  }, [cuenca, C]);

  const miembros = [...cuenca.atractores, ...cuenca.profundidad1, ...cuenca.profundidad2];
  const rastroSet = new Set(rastro);

  return (
    <Panel className="flex flex-col">
      <div className="mb-1 flex items-baseline justify-between">
        <SectionLabel accent={color}>
          {cuenca.atractores.length === 1 ? "punto fijo" : "ciclo de 2"} ·{" "}
          {cuenca.atractores.map((v) => hex(v).py).join(" ⇄ ")}
        </SectionLabel>
        <span className="font-mono text-[10px] text-sand-500">cuenca {cuenca.total}</span>
      </div>
      <svg
        viewBox={`0 0 ${S} ${S}`}
        className="w-full select-none"
        role="img"
        aria-label={`Cuenca de ${cuenca.atractores.map((v) => hex(v).py).join(" y ")}: ${cuenca.total} hexagramas; anillo interior cae en 1 paso, exterior en 2`}
      >
        <circle cx={C} cy={C} r={66} fill="none" stroke="#2A2620" strokeDasharray="2 4" />
        <circle cx={C} cy={C} r={122} fill="none" stroke="#1C1915" />

        {/* flechas: cada miembro hacia su nuclear */}
        {miembros.map((v) => {
          const destino = huGua(v);
          if (v === destino) return null;
          const [x1, y1] = pos.get(v)!;
          const [x2, y2] = pos.get(destino)!;
          const enRastro = rastroSet.has(v) && rastroSet.has(destino);
          const mx = (x1 + x2) / 2 + (y2 - y1) * 0.12;
          const my = (y1 + y2) / 2 - (x2 - x1) * 0.12;
          return (
            <path
              key={v}
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              fill="none"
              stroke={enRastro ? "#f5efdf" : color}
              strokeWidth={enRastro ? 2 : 0.8}
              opacity={enRastro ? 1 : 0.4}
            />
          );
        })}

        {/* nodos */}
        {miembros.map((v) => {
          const [x, y] = pos.get(v)!;
          const esAtractor = cuenca.atractores.includes(v);
          const esSel = sel === v;
          const enRastro = rastroSet.has(v);
          return (
            <g key={v} onClick={() => onSel(v)} style={{ cursor: "pointer" }}>
              {(esSel || enRastro) && (
                <circle cx={x} cy={y} r={13} fill="none" stroke="#f5efdf" strokeWidth={1} opacity={0.8} />
              )}
              {esAtractor && <circle cx={x} cy={y} r={15} fill="none" stroke={color} strokeWidth={1.2} />}
              <MiniGlyph v={v} x={x} y={y} w={13} color={esSel || enRastro ? "#f5efdf" : esAtractor ? color : "#cfc7b2"} />
              <circle cx={x} cy={y} r={12} fill="transparent" />
            </g>
          );
        })}
      </svg>
    </Panel>
  );
}

export default function BosqueNuclear() {
  const [sel, setSel] = useState<number | null>(null);
  const [paso, setPaso] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const trayecto = useMemo(() => (sel == null ? [] : caida(sel)), [sel]);
  const rastro = trayecto.slice(0, paso + 1);

  // Animar la caída al seleccionar.
  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (sel == null) return;
    setPaso(0);
    timer.current = setInterval(() => {
      setPaso((p) => {
        if (p >= trayecto.length - 1) {
          if (timer.current) clearInterval(timer.current);
          return p;
        }
        return p + 1;
      });
    }, 650);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [sel, trayecto.length]);

  const h = sel != null ? hex(sel) : null;

  return (
    <div>
      <ExperimentHeader
        kicker="互 · dinámica del hu gua"
        titulo="El bosque nuclear"
        subtitulo="Las 64 flechas del mapa nuclear, completas"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El experimento de{" "}
            <Link href="/experimentos/simetrias" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              las simetrías
            </Link>{" "}
            resume la dinámica del hexagrama nuclear; aquí está entera. Cada hexagrama
            apunta a su nuclear: 64 flechas que colapsan rápido. La imagen de la primera
            aplicación son <b>16 hexagramas</b> (los nucleares clásicos); la de la
            segunda, <b>4</b>. Todo termina en 3 atractores: dos puntos fijos y un ciclo
            de 2 (4 hexagramas atractores), con cuencas de 16, 16 y 32 y caída máxima
            de 2 pasos.
          </p>
        </Prose>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor="64 → 16 → 4" etiqueta="imágenes del mapa iterado" accent={ACCENT} />
        <Stat valor="3" etiqueta="atractores (2 fijos + 1 ciclo de 2)" accent={ACCENT} />
        <Stat valor="16 · 16 · 32" etiqueta="cuencas de atracción" />
        <Stat valor={Math.max(...PROFUNDIDAD)} etiqueta="profundidad máxima de caída" />
      </div>

      {/* Selector accesible + caída */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="sel-caida" className="font-mono text-[11px] uppercase tracking-widest text-sand-500">
          Seguir la caída de
        </label>
        <select
          id="sel-caida"
          value={sel ?? ""}
          onChange={(e) => setSel(e.target.value === "" ? null : Number(e.target.value))}
          className="rounded-md border border-ink-600 bg-ink-850 px-2 py-1.5 font-mono text-xs text-sand-200"
        >
          <option value="">elige un hexagrama</option>
          {ALL_HEX.map((x) => (
            <option key={x.v} value={x.v}>
              {x.kw}. {x.py} ({x.bits})
            </option>
          ))}
        </select>
        {h && sel != null && (
          <span className="flex flex-wrap items-center gap-2 font-mono text-xs text-sand-300">
            {trayecto.map((v, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-sand-600">→</span>}
                <span style={{ color: i <= paso ? "#f5efdf" : "#6b6558" }}>
                  {hex(v).kw}. {hex(v).py}
                </span>
              </span>
            ))}
            <span className="text-sand-500">
              · llega al atractor en {PROFUNDIDAD[sel]}{" "}
              {PROFUNDIDAD[sel] === 1 ? "paso" : "pasos"}
            </span>
          </span>
        )}
      </div>

      {/* Las tres cuencas */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {CUENCAS.map((c) => (
          <CuencaRadial
            key={c.ciclo}
            cuenca={c}
            sel={sel}
            rastro={rastro}
            onSel={setSel}
          />
        ))}
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-sand-500">
        anillo punteado: caen en 1 paso · anillo exterior: caen en 2 · el aro marca a
        los atractores
      </p>

      {/* Los 16 nucleares */}
      <div className="mt-6">
        <SectionLabel accent={ACCENT}>Los 16 nucleares clásicos (la primera imagen)</SectionLabel>
        <Panel className="mt-2">
          <p className="mb-3 text-sm text-sand-400">
            Solo estos 16 hexagramas son el nuclear de alguien. Los 4 marcados forman a
            su vez la segunda imagen: el corazón del colapso.
          </p>
          <div className="flex flex-wrap gap-2">
            {IMAGEN1.map((v) => {
              const x = hex(v);
              const esNucleo = IMAGEN2.includes(v);
              return (
                <button
                  key={v}
                  onClick={() => setSel(v)}
                  className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left"
                  style={{ borderColor: esNucleo ? ACCENT : "#2A2620" }}
                >
                  <Glyph bits={x.bits} size={20} className="text-sand-200" />
                  <span className="font-mono text-[10px] leading-tight text-sand-400">
                    {x.kw}. {x.py}
                    {esNucleo && (
                      <>
                        <br />
                        <span style={{ color: ACCENT }}>2ª imagen</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
