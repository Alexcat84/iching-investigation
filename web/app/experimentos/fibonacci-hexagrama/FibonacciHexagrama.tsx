"use client";

import { useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import {
  figuras,
  sinDosYin,
  sinDosYinCircular,
  SOLO_YIN,
  SOLO_YANG,
  ALTERNANTES,
  NINGUNA,
  SIN_DOS_YIN,
  fib,
  lucas,
} from "@/lib/fibonacci";
import { ExperimentHeader, Panel, Prose, Stat } from "@/components/ui";

const C = {
  tinta: "#E8E1D0",
  dim: "#3A352C",
  gris: "#6B6353",
  azul: "#5B8FD9",
  verde: "#5FAE7F",
  oro: "#E5C558",
  naranja: "#E8883A",
  cinabrio: "#C24C33",
  morado: "#9C6BC9",
};
const ACCENT = "#5ab89a";

/** Glifo de una figura: s[0] = línea 1 (abajo), s[n-1] = línea n (arriba). */
function Glifo({
  s,
  x = 0,
  y = 0,
  w = 14,
  bar = 2,
  gap = 2,
  color = C.tinta,
  opacity = 1,
}: {
  s: string;
  x?: number;
  y?: number;
  w?: number;
  bar?: number;
  gap?: number;
  color?: string;
  opacity?: number;
}) {
  const n = s.length;
  const filas: React.ReactNode[] = [];
  for (let k = n - 1; k >= 0; k--) {
    const yy = y + (n - 1 - k) * (bar + gap);
    if (s[k] === "1") {
      filas.push(<rect key={k} x={x} y={yy} width={w} height={bar} rx={0.6} fill={color} opacity={opacity} />);
    } else {
      filas.push(
        <rect key={`${k}a`} x={x} y={yy} width={w * 0.4} height={bar} rx={0.6} fill={color} opacity={opacity} />,
        <rect key={`${k}b`} x={x + w * 0.6} y={yy} width={w * 0.4} height={bar} rx={0.6} fill={color} opacity={opacity} />,
      );
    }
  }
  return <g>{filas}</g>;
}

interface Fila {
  n: number;
  idx: number;
  todas: string[];
  total: number;
  y: number;
  alto: number;
  pad: number;
  w: number;
  gapX: number;
  bar: number;
  gapY: number;
  x0: number;
  esUlt: boolean;
  mostradas: number;
}

/** Vista 1: la escalera, con la recurrencia F(n+2) = F(n+1) + F(n) hecha color. */
function Escalera({ circular }: { circular: boolean }) {
  const anchoVB = 760;
  const izq = 64;
  const der = 112;
  const disp = anchoVB - izq - der;
  const BANDAS = [C.azul, C.verde, C.oro, C.morado, C.naranja, C.cinabrio];
  const coma = (x: number) => x.toFixed(3).replace(".", ",");

  const layout: Fila[] = [];
  let yCursor = 24;
  for (let idx = 0; idx < 6; idx++) {
    const n = idx + 1;
    const todas = figuras(n);
    const total = todas.length;
    const gapX = n <= 3 ? 10 : n === 4 ? 8 : n === 5 ? 4.5 : 2.2;
    const w = Math.min(n <= 3 ? 22 : 18, (disp - (total - 1) * gapX) / total);
    const bar = n <= 4 ? 2.6 : 2;
    const gapY = 2;
    const anchoFila = total * w + (total - 1) * gapX;
    const x0 = izq + (disp - anchoFila) / 2;
    const alto = n * bar + (n - 1) * gapY;
    const pad = 13;
    const esUlt = n === 6;
    const vivasN = todas.filter(sinDosYin).length;
    const mostradas = esUlt && circular ? todas.filter(sinDosYinCircular).length : vivasN;
    layout.push({ n, idx, todas, total, y: yCursor, alto, pad, w, gapX, bar, gapY, x0, esUlt, mostradas });
    yCursor += alto + 2 * pad + 14;
  }

  return (
    <svg
      viewBox={`0 0 760 ${yCursor + 4}`}
      className="w-full"
      role="img"
      aria-label="Escalera de figuras por número de líneas: las que no tienen dos yin seguidos crecen como Fibonacci (2, 3, 5, 8, 13, 21). Cada superviviente que termina en yang viene de la fila anterior (azul) y cada uno que termina en yin viene de dos filas atrás (verde). La razón entre filas consecutivas converge a la razón áurea."
    >
      <line x1={anchoVB - der + 4} y1={10} x2={anchoVB - der + 4} y2={yCursor - 4} stroke="#2E2820" strokeWidth={1} />
      {layout.map((f) => {
        const tono = f.esUlt && circular ? C.naranja : BANDAS[f.idx];
        return (
          <g key={f.n}>
            <rect x={4} y={f.y - f.pad} width={anchoVB - 8} height={f.alto + 2 * f.pad} rx={7} fill={tono} opacity={0.06} />
            <line x1={4} y1={f.y - f.pad} x2={anchoVB - 4} y2={f.y - f.pad} stroke={tono} strokeWidth={1} opacity={0.22} />
            <text x={12} y={f.y + f.alto / 2 + 3} fontSize={11} fill={C.gris} fontFamily="ui-monospace, monospace">
              {f.n} {f.n > 1 ? "líneas" : "línea"}
            </text>
            <text x={anchoVB - der + 14} y={f.y + f.alto / 2 - 3} fontSize={13} fill={C.tinta} fontFamily="ui-monospace, monospace">
              {f.mostradas} <tspan fill={C.gris} fontSize={9}>/ {f.total}</tspan>
            </text>
            <text x={anchoVB - der + 14} y={f.y + f.alto / 2 + 11} fontSize={9} fill={f.esUlt && circular ? C.naranja : tono} fontFamily="ui-monospace, monospace">
              {f.esUlt && circular ? "Lucas L(6)" : `F(${f.n + 2})`}
            </text>
            {f.todas.map((s, i) => {
              const viva = sinDosYin(s);
              const muereEnCiclo = f.esUlt && circular && viva && !sinDosYinCircular(s);
              const topYang = s[s.length - 1] === "1";
              const color = !viva ? C.dim : muereEnCiclo ? C.naranja : topYang ? C.azul : C.verde;
              return <Glifo key={i} s={s} x={f.x0 + i * (f.w + f.gapX)} y={f.y} w={f.w} bar={f.bar} gap={f.gapY} color={color} opacity={viva ? 1 : 0.55} />;
            })}
          </g>
        );
      })}
      {layout.slice(0, -1).map((fila, idx) => {
        const sig = layout[idx + 1];
        const r = sig.mostradas / fila.mostradas;
        const yRazon = fila.y + fila.alto + fila.pad + 7;
        const esCambioRegimen = sig.esUlt && circular;
        const esUltimaRazon = idx === layout.length - 2;
        return (
          <text key={`r${idx}`} x={anchoVB - der + 14} y={yRazon + 3} fontSize={9.5} fill={esCambioRegimen ? C.naranja : C.oro} opacity={0.85} fontFamily="ui-monospace, monospace">
            ×{coma(r)}
            {esUltimaRazon && !esCambioRegimen ? "  → φ = 1,618…" : ""}
          </text>
        );
      })}
    </svg>
  );
}

/** Vista 2: el Venn con los 64 hexagramas reales repartidos por región. */
function Venn() {
  const W = 760;
  const H = 500;
  const r = 168;
  const ax = 285;
  const bx = 475;
  const cy = 210;
  const enA = (x: number, y: number) => (x - ax) ** 2 + (y - cy) ** 2 <= r * r;
  const enB = (x: number, y: number) => (x - bx) ** 2 + (y - cy) ** 2 <= r * r;
  const margen = 22;
  const aFull = (x: number, y: number) => (x - ax) ** 2 + (y - cy) ** 2 <= (r - margen) ** 2;
  const bFull = (x: number, y: number) => (x - bx) ** 2 + (y - cy) ** 2 <= (r - margen) ** 2;

  const candA: [number, number][] = [];
  const candB: [number, number][] = [];
  for (let gy = 58; gy < 372; gy += 25) {
    for (let gx = 118; gx < 662; gx += 23) {
      if (aFull(gx, gy) && !enB(gx, gy)) candA.push([gx, gy]);
      if (bFull(gx, gy) && !enA(gx, gy)) candB.push([gx, gy]);
    }
  }
  const reparte = (cand: [number, number][], k: number): [number, number][] => {
    if (cand.length <= k) return cand.slice(0, k);
    const paso = cand.length / k;
    return Array.from({ length: k }, (_, i) => cand[Math.floor(i * paso)]);
  };
  const posA = reparte(candA, SOLO_YIN.length);
  const posB = reparte(candB, SOLO_YANG.length);
  const posN: [number, number][] = NINGUNA.map((_, i) => {
    const col = i % 12;
    const fila = Math.floor(i / 12);
    return [134 + col * 41, fila === 0 ? 420 : 460];
  });

  const glifos = (vals: number[], pos: [number, number][], color: string, w = 16) =>
    vals.map((v, i) =>
      pos[i] ? <Glifo key={v} s={hex(v).bits} x={pos[i][0] - w / 2} y={pos[i][1] - 8} w={w} bar={2} gap={1.6} color={color} /> : null,
    );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Diagrama de Venn con los 64 hexagramas: 19 solo sin dos yin, 19 solo sin dos yang, 2 en la intersección (Ji Ji y Wei Ji) y 24 fuera de ambas reglas."
    >
      <circle cx={ax} cy={cy} r={r} fill={`${C.azul}12`} stroke={C.azul} strokeWidth={1.4} />
      <circle cx={bx} cy={cy} r={r} fill={`${C.verde}12`} stroke={C.verde} strokeWidth={1.4} />
      <text x={ax - r + 8} y={40} fontSize={12} fill={C.azul} fontFamily="ui-monospace, monospace">
        sin dos yin · {SOLO_YIN.length + ALTERNANTES.length} = F(8)
      </text>
      <text x={bx + r - 8} y={40} fontSize={12} textAnchor="end" fill={C.verde} fontFamily="ui-monospace, monospace">
        sin dos yang · {SOLO_YANG.length + ALTERNANTES.length} = F(8)
      </text>
      {glifos(SOLO_YIN, posA, C.azul)}
      {glifos(SOLO_YANG, posB, C.verde)}
      {ALTERNANTES.slice()
        .sort((a, b) => hex(a).kw - hex(b).kw)
        .map((v, i) => {
          const cxv = (ax + bx) / 2;
          const cyv = cy - 45 + i * 90;
          return (
            <g key={v}>
              <circle cx={cxv} cy={cyv} r={30} fill="none" stroke={C.cinabrio} strokeWidth={1.4} />
              <Glifo s={hex(v).bits} x={cxv - 12} y={cyv - 12} w={24} bar={3} gap={2} color={C.cinabrio} />
              <text x={cxv} y={cyv + 46} fontSize={10} textAnchor="middle" fill={C.tinta} fontFamily="ui-monospace, monospace">
                {hex(v).kw} · {hex(v).py}
              </text>
            </g>
          );
        })}
      <text x={W / 2} y={402} fontSize={11} textAnchor="middle" fill={C.gris} fontFamily="ui-monospace, monospace">
        fuera de ambas reglas · {NINGUNA.length}
      </text>
      {glifos(NINGUNA, posN, C.dim, 13)}
    </svg>
  );
}

export default function FibonacciHexagrama() {
  const [vista, setVista] = useState<"escalera" | "venn">("escalera");
  const [circular, setCircular] = useState(false);

  const chip = (on: boolean, color: string) =>
    on
      ? { background: `${color}22`, borderColor: color, color: C.tinta }
      : { borderColor: "#2E2820", color: C.gris };

  return (
    <div>
      <ExperimentHeader
        kicker="斐 · conjuntos independientes de Q6"
        titulo="Fibonacci en el hexagrama"
        subtitulo="Dos leyes de crecimiento y una intersección"
        accent={ACCENT}
      />

      {/* Descargos */}
      <div className="mb-6 rounded-xl border p-4" style={{ borderColor: `${ACCENT}66`, background: "rgba(90,184,154,0.06)" }}>
        <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: ACCENT }}>
          <span className="text-cinnabar-bright">⚠</span> Dos descargos honestos
        </div>
        <p className="text-sm leading-relaxed text-sand-300">
          <b>Es un teorema de conteo, no un código oculto.</b> La numerología que circula
          sobre Fibonacci y el I Ching (offsets elegidos a mano, los niveles de retroceso del
          trading, la razón áurea escondida en el orden del Rey Wen) queda fuera por
          indemostrable: aquí solo hay conjuntos que se cuentan y resultan ser un número de
          Fibonacci. El único φ que aparece es el límite real de esos conteos, no un patrón
          impuesto.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-sand-300">
          <b>Hasta donde sabemos</b>, esta formulación verificada sobre los hexagramas (los
          supervivientes como conjuntos independientes del camino P6 y del ciclo C6) no está
          publicada en otro sitio. Lo decimos con esa humildad exacta: no hemos encontrado la
          fuente, no que no exista.
        </p>
      </div>

      <div className="mb-5">
        <Prose>
          <p>
            Cada línea nueva duplica la población (2, 4, 8, 16, 32, 64), pero las figuras{" "}
            <b>sin dos yin seguidos</b> solo crecen como Fibonacci (2, 3, 5, 8, 13, 21). El
            color muestra el porqué:{" "}
            <b style={{ color: C.azul }}>las que terminan en yang</b> vienen de la fila
            anterior, y <b style={{ color: C.verde }}>las que terminan en yin</b> vienen de
            dos filas atrás. Azules más verdes de una fila = las vivas de las dos filas de
            arriba: <b>F(n+2) = F(n+1) + F(n)</b>, a la vista.
          </p>
        </Prose>
      </div>

      {/* Conmutadores de vista */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button type="button" aria-pressed={vista === "escalera"} onClick={() => setVista("escalera")} className="rounded-full border px-3.5 py-1.5 text-xs transition-colors" style={chip(vista === "escalera", C.oro)}>
          La escalera
        </button>
        <button type="button" aria-pressed={vista === "venn"} onClick={() => setVista("venn")} className="rounded-full border px-3.5 py-1.5 text-xs transition-colors" style={chip(vista === "venn", C.cinabrio)}>
          La intersección (Venn)
        </button>
        {vista === "escalera" && (
          <button type="button" aria-pressed={circular} onClick={() => setCircular((c) => !c)} className="rounded-full border px-3.5 py-1.5 text-xs transition-colors" style={chip(circular, C.naranja)}>
            Cerrar el anillo (línea 6 junto a la 1)
          </button>
        )}
      </div>

      <Panel accent={ACCENT}>{vista === "escalera" ? <Escalera circular={circular} /> : <Venn />}</Panel>

      <p className="mt-4 font-mono text-[11px] leading-relaxed" style={{ color: C.gris }}>
        {vista === "escalera" ? (
          circular ? (
            "Al cerrar el anillo, tres supervivientes mueren (naranja): los que empiezan y terminan en yin quedan con dos yin juntos. La cuenta baja de 21 a 18, el número de Lucas L(6)."
          ) : (
            "Gris: figuras con dos yin seguidos (eliminadas). La columna derecha compara supervivientes contra población total y su razón entre filas."
          )
        ) : (
          <>
            19 + 19 + 2 + 24 = 64. La intersección de las dos reglas son exactamente{" "}
            <Link href="/experimentos/bosque-nuclear" className="underline decoration-dotted underline-offset-2" style={{ color: C.cinabrio }}>
              el ciclo atractor del bosque nuclear
            </Link>{" "}
            y{" "}
            <Link href="/experimentos/rey-wen" className="underline decoration-dotted underline-offset-2" style={{ color: C.cinabrio }}>
              la pareja que cierra el Rey Wen
            </Link>
            : Ji Ji y Wei Ji.
          </>
        )}
      </p>

      {/* Cierre */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={fib(8)} etiqueta="sin dos yin = F(8)" accent={ACCENT} />
        <Stat valor={lucas(6)} etiqueta="circular = L(6)" accent={ACCENT} />
        <Stat valor={ALTERNANTES.length} etiqueta="alternancia (Ji Ji, Wei Ji)" />
        <Stat valor={`${SOLO_YIN.length}+${SOLO_YANG.length}+${ALTERNANTES.length}+${NINGUNA.length}`} etiqueta="las regiones del Venn = 64" />
      </div>

      <p className="mt-4 font-mono text-[11px] text-sand-600">
        Los {SIN_DOS_YIN.length} supervivientes por regla son los conjuntos independientes de
        P6; en versión circular, de C6. Todo se cuenta, nada se cablea.
      </p>
    </div>
  );
}
