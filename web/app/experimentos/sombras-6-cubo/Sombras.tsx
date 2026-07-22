"use client";

import { useMemo, useState } from "react";
import { ALL_HEX, EDGES, hex, LINE_COLOR, lineBit } from "@/lib/iching";
import {
  cuboDeCubos,
  PARTICION_ARISTAS,
  PETRIE_EXTERIOR,
  PETRIE_PUNTOS,
  porNiveles,
  TAMANOS_NIVEL,
} from "@/lib/sombras";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#82a7e8";

type Puntos = [number, number][];

function normalizar(puntos: Puntos, radioObjetivo: number): Puntos {
  const max = Math.max(...puntos.map(([x, y]) => Math.hypot(x, y)));
  const s = radioObjetivo / max;
  return puntos.map(([x, y]) => [x * s, y * s]);
}

/** Una sombra: SVG con las 192 aristas y los 64 vértices en las posiciones dadas. */
function Sombra({
  titulo,
  nota,
  puntos,
  sel,
  onSel,
}: {
  titulo: string;
  nota: string;
  puntos: Puntos;
  sel: number | null;
  onSel: (v: number) => void;
}) {
  const S = 380;
  const C = S / 2;
  const vecinos = useMemo(() => {
    if (sel == null) return new Set<number>();
    return new Set([1, 2, 3, 4, 5, 6].map((k) => sel ^ lineBit(k)));
  }, [sel]);

  return (
    <Panel className="flex flex-col">
      <SectionLabel accent={ACCENT}>{titulo}</SectionLabel>
      <svg
        viewBox={`0 0 ${S} ${S}`}
        className="mt-2 w-full select-none"
        role="img"
        aria-label={`${titulo}: 64 vértices y 192 aristas del hipercubo; ${nota}`}
      >
        {EDGES.map((e, i) => {
          const [x1, y1] = puntos[e.a];
          const [x2, y2] = puntos[e.b];
          const activa = sel != null && (e.a === sel || e.b === sel);
          return (
            <line
              key={i}
              x1={C + x1}
              y1={C + y1}
              x2={C + x2}
              y2={C + y2}
              stroke={LINE_COLOR[e.line]}
              strokeWidth={activa ? 2 : 0.7}
              opacity={sel == null ? 0.22 : activa ? 0.95 : 0.06}
            />
          );
        })}
        {Array.from({ length: 64 }, (_, v) => {
          const [x, y] = puntos[v];
          const esSel = v === sel;
          const esVecino = vecinos.has(v);
          return (
            <g key={v} onClick={() => onSel(v)} style={{ cursor: "pointer" }}>
              <circle
                cx={C + x}
                cy={C + y}
                r={esSel ? 6 : esVecino ? 4.5 : 2.6}
                fill={esSel ? "#f5efdf" : esVecino ? ACCENT : "#8a8271"}
                opacity={sel == null ? 0.9 : esSel || esVecino ? 1 : 0.35}
              />
              <circle cx={C + x} cy={C + y} r={9} fill="transparent" />
            </g>
          );
        })}
      </svg>
      <p className="mt-2 font-mono text-[10px] leading-relaxed text-sand-500">{nota}</p>
    </Panel>
  );
}

export default function Sombras() {
  const [sel, setSel] = useState<number | null>(42); // Ji Ji

  const petrie = useMemo(() => normalizar(PETRIE_PUNTOS, 170), []);
  const cubos = useMemo(
    () => normalizar(Array.from({ length: 64 }, (_, v) => cuboDeCubos(v)), 165),
    [],
  );
  const niveles = useMemo(
    () => normalizar(Array.from({ length: 64 }, (_, v) => porNiveles(v)), 170),
    [],
  );

  const h = sel != null ? hex(sel) : null;

  return (
    <div>
      <ExperimentHeader
        kicker="⬡ · proyecciones de Q6"
        titulo="Las sombras del 6-cubo"
        subtitulo="Tres siluetas del mismo objeto de 6 dimensiones"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El hipercubo de 6 dimensiones no cabe en la pantalla: solo podemos ver sus{" "}
            <b>sombras</b>. Aquí hay tres, y las tres contienen los mismos 64 vértices y
            los mismos 192 hilos coloreados por línea. Toca cualquier hexagrama (o
            elígelo abajo) y se encenderá, con sus 6 vecinos, en las tres proyecciones a
            la vez: tres siluetas de un solo objeto.
          </p>
        </Prose>
      </div>

      {/* Selector accesible */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label htmlFor="sel-hex" className="font-mono text-[11px] uppercase tracking-widest text-sand-500">
          Hexagrama
        </label>
        <select
          id="sel-hex"
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
        {h && (
          <span className="flex items-center gap-2 font-mono text-xs text-sand-300">
            <Glyph bits={h.bits} size={18} className="text-sand-200" />
            {h.kw}. {h.py} · {h.bits}₂ = {h.v}
          </span>
        )}
      </div>

      {/* Las tres sombras */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Sombra
          titulo="1 · Proyección de Petrie"
          nota={`cada línea es una dirección del plano separada 30 grados; el polígono exterior tiene exactamente ${PETRIE_EXTERIOR.cuantos} vértices (el polígono de Petrie del 6-cubo)`}
          puntos={petrie}
          sel={sel}
          onSel={setSel}
        />
        <Sombra
          titulo="2 · Cubo de cubos (Q3 × Q3)"
          nota={`el trigrama superior elige la esquina del cubo grande y el inferior la del pequeño; ${PARTICION_ARISTAS.intra} aristas viven dentro de los cubos pequeños (líneas 1 a 3) y ${PARTICION_ARISTAS.entre} entre ellos (líneas 4 a 6)`}
          puntos={cubos}
          sel={sel}
          onSel={setSel}
        />
        <Sombra
          titulo="3 · Niveles de yang"
          nota={`anillos concéntricos por número de líneas yang, de Kun en el centro a Qian en el borde: tamaños ${TAMANOS_NIVEL.join(", ")}; cada arista cruza exactamente un nivel`}
          puntos={niveles}
          sel={sel}
          onSel={setSel}
        />
      </div>

      {/* Verificaciones en pantalla */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor="64" etiqueta="vértices en cada sombra" />
        <Stat valor={EDGES.length} etiqueta="aristas en cada sombra" accent={ACCENT} />
        <Stat valor={PETRIE_EXTERIOR.cuantos} etiqueta="vértices del polígono de Petrie" accent={ACCENT} />
        <Stat
          valor={`${PARTICION_ARISTAS.intra} + ${PARTICION_ARISTAS.entre}`}
          etiqueta="partición Q3 × Q3 de las aristas"
        />
      </div>

      <p className="mt-5 text-center text-sm text-sand-500">
        La primera sombra es pariente del anillo del experimento del hipercubo; la
        tercera es la vista radial del retículo booleano. Mismo grafo, tres geometrías.
      </p>
    </div>
  );
}
