/**
 * Miniaturas generativas por experimento (portada).
 *
 * Cada generador dibuja una vista previa en SVG usando la MATEMÁTICA REAL de su
 * experimento, derivada de las libs existentes; nunca de arreglos decorativos
 * cableados. Cuando un experimento no tiene datos numéricos (páginas de referencia
 * históricas), la miniatura es una ilustración geométrica de su tema.
 *
 * scripts/experimentos.py verifica que todo slug del registro tenga generador aquí y
 * que no haya generadores huérfanos.
 */
import type { ReactNode } from "react";
import { bitsOf, gray, hex, lineBit, LINE_COLOR, type TrigramName } from "./iching";
import { SOBERANOS, LINEAS_CAMBIO } from "./soberanos";
import { ESCALERA } from "./fibonacci";
import { probsBoltzmann } from "./ising";
import { entropiaLinea } from "./entropia";
import { PRESETS } from "./transferencia";
import { ESPECTRO } from "./espectro-q6";
import { ESPECTRO as ESPECTRO_FOURIER } from "./fourier-anillo";
import { influencias, PROPIEDADES } from "./influencias";
import { CODIGO_MAXIMO } from "./cubo-no";
import { PARES as METROS_PARES } from "./prosodia";
import { CARTA } from "./cage";
import { SECUENCIA } from "./debruijn";
import { sierpinski } from "./grupo";
import { M } from "./matriz-nuclear";
import { estacionaria } from "./transicion";
import { ENERGIA_ORDEN } from "./walsh";
import { HIST } from "./aleatorio-reywen";
import { generarEjemplo } from "./trayectoria";
import { paso } from "./paseo";
import { DISTANCIA } from "./conteos";
import { DIECISEISAVOS } from "./oraculo";
import { PARES } from "./reywen";
import { PERM } from "./permutacion";
import { ANTERIOR, POSTERIOR, TAU } from "./bagua";
import { CUENCA_DE } from "./bosque";
import { petrie } from "./sombras";
import { CABEZAS } from "./palacios";
import { PALINDROMOS, ANTIPALINDROMOS } from "./simetrias";
import { aminoDe, AMINO_INFO, CODIFICACIONES } from "./codones";

const W = 220;
const H = 120;
const CX = W / 2;
const CY = H / 2;
const R = 46;
const DIM = "#3A352C";
const GRIS = "#8A8272";
const TENUE = "#5A5346";

function pc(v: number): number {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (v >> k) & 1;
  return n;
}
function anilloPos(v: number, r = R, n = 64): [number, number] {
  const a = -Math.PI / 2 + (v * 2 * Math.PI) / n;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}
/** RNG determinista (mulberry32) para las miniaturas con azar. */
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Glifo pequeño de un hexagrama (6 líneas) centrado en (x,y). */
function glifo(bits: string, x: number, y: number, w: number, color: string): ReactNode {
  const bar = w * 0.14;
  const gap = w * 0.16;
  const rows: ReactNode[] = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const yy = y - (5 * (gap + bar)) / 2 + (6 - k) * (gap + bar);
    if (yang) {
      rows.push(<rect key={k} x={x - w / 2} y={yy} width={w} height={bar} rx={0.4} fill={color} />);
    } else {
      const seg = w * 0.4;
      rows.push(
        <rect key={`${k}a`} x={x - w / 2} y={yy} width={seg} height={bar} rx={0.4} fill={color} />,
        <rect key={`${k}b`} x={x + w / 2 - seg} y={yy} width={seg} height={bar} rx={0.4} fill={color} />,
      );
    }
  }
  return <g>{rows}</g>;
}
const puros = CABEZAS.map((t: TrigramName) => parseInt(bitsOf(t, t), 2));

export type Generador = (color: string) => ReactNode;

export const GENERADORES: Record<string, Generador> = {
  "hipercubo": (c) => {
    const path = gray().map((v) => anilloPos(v));
    return (
      <>
        {Array.from({ length: 64 }, (_, v) => {
          const [x, y] = anilloPos(v);
          return <circle key={v} cx={x} cy={y} r={1.1} fill={TENUE} />;
        })}
        <polyline points={path.map((p) => p.join(",")).join(" ")} fill="none" stroke={c} strokeWidth={0.8} opacity={0.85} />
      </>
    );
  },
  "palacios": (c) => (
    <>
      {puros.map((v, i) => {
        const [x, y] = anilloPos(v);
        return <line key={`l${i}`} x1={CX} y1={CY} x2={x} y2={y} stroke={i === 0 ? c : DIM} strokeWidth={1} />;
      })}
      {puros.map((v, i) => {
        const [x, y] = anilloPos(v);
        return <circle key={i} cx={x} cy={y} r={3.2} fill="none" stroke={i === 0 ? c : GRIS} strokeWidth={1.2} />;
      })}
      <circle cx={CX} cy={CY} r={3} fill={c} />
    </>
  ),
  "mapa-lectura": (c) => {
    const presente = 0b000110;
    const futuro = presente ^ lineBit(5);
    return (
      <>
        {glifo(hex(presente).bits, CX - 46, CY, 34, "#CFC6B0")}
        {glifo(hex(futuro).bits, CX + 46, CY, 34, c)}
        <path d={`M ${CX - 24} ${CY} Q ${CX} ${CY - 26} ${CX + 24} ${CY}`} fill="none" stroke={c} strokeWidth={1.4} />
        <circle cx={CX + 24} cy={CY} r={2.4} fill={c} />
      </>
    );
  },
  "probabilidades": (c) => {
    const mil = [9, 8, 7, 6].map((e) => DIECISEISAVOS.milenrama[e as 6 | 7 | 8 | 9]);
    const mon = [9, 8, 7, 6].map((e) => DIECISEISAVOS.monedas[e as 6 | 7 | 8 | 9]);
    return (
      <>
        {mil.map((v, i) => (
          <g key={i}>
            <rect x={40 + i * 38} y={H - 16 - v * 9} width={12} height={v * 9} fill={c} rx={1.5} />
            <rect x={56 + i * 38} y={H - 16 - mon[i] * 9} width={12} height={mon[i] * 9} fill="#6B6353" rx={1.5} />
          </g>
        ))}
      </>
    );
  },
  "simetrias": (c) => {
    const pal = new Set(PALINDROMOS);
    const anti = new Set(ANTIPALINDROMOS);
    return (
      <>
        {Array.from({ length: 64 }, (_, v) => {
          const r = v >> 3;
          const col = v & 7;
          const lit = pal.has(v) || anti.has(v);
          return (
            <rect key={v} x={CX - 44 + col * 11} y={16 + r * 11} width={9} height={9} rx={1}
              fill={lit ? c : (r + col) % 2 ? DIM : "#2A2620"} opacity={lit ? 0.95 : 0.6} />
          );
        })}
      </>
    );
  },
  "trayectoria": (c) => {
    const camino = generarEjemplo(7, 0, rng(7)).map((x) => anilloPos(x.v));
    return (
      <>
        {Array.from({ length: 64 }, (_, v) => {
          const [x, y] = anilloPos(v);
          return <circle key={v} cx={x} cy={y} r={0.9} fill={TENUE} />;
        })}
        <polyline points={camino.map((p) => p.join(",")).join(" ")} fill="none" stroke={c} strokeWidth={1.4} />
        {camino.map((p, i) => (
          <circle key={`t${i}`} cx={p[0]} cy={p[1]} r={2.2} fill={i === camino.length - 1 ? c : "#B8AE98"} />
        ))}
      </>
    );
  },
  "rey-wen": (c) => (
    <>
      {PARES.slice(0, 8).map((par, i) => (
        <g key={i}>
          {glifo(hex(par.aV).bits, 26 + i * 24, CY - 22, 15, i % 2 ? DIM : c)}
          {glifo(hex(par.bV).bits, 26 + i * 24, CY + 22, 15, i % 2 ? c : "#B8AE98")}
        </g>
      ))}
    </>
  ),
  "shao-yong": (c) => (
    <>
      <circle cx={CX} cy={CY} r={44} fill="none" stroke={DIM} strokeWidth={1.2} />
      <rect x={CX - 27} y={CY - 27} width={54} height={54} fill="none" stroke={c} strokeWidth={1.2} />
      {Array.from({ length: 16 }, (_, i) => {
        const [x, y] = anilloPos(i, 44, 16);
        return <circle key={i} cx={x} cy={y} r={1.4} fill={GRIS} />;
      })}
    </>
  ),
  "permutacion": (c) => {
    const muestra = Array.from({ length: 12 }, (_, i) => i * 5);
    return (
      <>
        {muestra.map((i, k) => {
          const x1 = 16 + (i / 63) * (W - 32);
          const x2 = 16 + (PERM[i] / 63) * (W - 32);
          return (
            <path key={k} d={`M ${x1} ${H - 16} Q ${(x1 + x2) / 2} ${16} ${x2} ${16}`}
              fill="none" stroke={k % 3 === 0 ? c : DIM} strokeWidth={1} opacity={0.8} />
          );
        })}
      </>
    );
  },
  "ritual-milenrama": (c) => (
    <>
      {Array.from({ length: 49 }, (_, i) => (
        <line key={i} x1={20 + (i % 25) * 7.4} y1={i < 25 ? 30 : 66} x2={24 + (i % 25) * 7.4} y2={i < 25 ? 54 : 90}
          stroke={i === 24 ? c : i < 25 ? GRIS : DIM} strokeWidth={1.6} />
      ))}
    </>
  ),
  "dos-cielos": (c) => {
    const posAnt = ANTERIOR.map((_, p) => anilloPos(p, 44, 8));
    const posPos = POSTERIOR.map((_, p) => anilloPos(p, 24, 8));
    // TAU[valorEnAnterior] = valorEnPosterior; localizamos posiciones por valor.
    const posDeAnt = new Array(8);
    ANTERIOR.forEach((val, p) => (posDeAnt[val] = p));
    const posDePos = new Array(8);
    POSTERIOR.forEach((val, p) => (posDePos[val] = p));
    return (
      <>
        {posAnt.map((p, i) => <circle key={`a${i}`} cx={p[0]} cy={p[1]} r={2.6} fill={GRIS} />)}
        {posPos.map((p, i) => <circle key={`i${i}`} cx={p[0]} cy={p[1]} r={2.6} fill={c} />)}
        {Array.from({ length: 8 }, (_, val) => {
          const [x1, y1] = anilloPos(posDeAnt[val], 44, 8);
          const [x2, y2] = anilloPos(posDePos[TAU[val]], 24, 8);
          return <line key={val} x1={x1} y1={y1} x2={x2} y2={y2} stroke={val === 7 ? c : DIM} strokeWidth={0.8} />;
        })}
      </>
    );
  },
  "sombras-6-cubo": (c) => {
    const pts = Array.from({ length: 64 }, (_, v) => petrie(v));
    const max = Math.max(...pts.map(([x, y]) => Math.hypot(x, y)));
    const esc = 46 / max;
    const P = pts.map(([x, y]) => [CX + x * esc, CY + y * esc] as [number, number]);
    // el poligono exterior: los 12 vertices de radio maximo
    const ext = pts
      .map((p, i) => ({ i, r: Math.hypot(p[0], p[1]) }))
      .filter((o) => Math.abs(o.r - max) < 1e-6)
      .map((o) => o.i)
      .sort((a, b) => Math.atan2(P[a][1] - CY, P[a][0] - CX) - Math.atan2(P[b][1] - CY, P[b][0] - CX));
    return (
      <>
        <polygon points={ext.map((i) => P[i].join(",")).join(" ")} fill="none" stroke={DIM} strokeWidth={0.9} />
        {P.map(([x, y], v) => (
          <circle key={v} cx={x} cy={y} r={1.4} fill={ext.includes(v) ? c : GRIS} opacity={0.85} />
        ))}
      </>
    );
  },
  "reticulo-b6": (c) => (
    <>
      {DISTANCIA.map((w, lv) =>
        Array.from({ length: w }, (_, i) => (
          <circle key={`${lv}-${i}`} cx={CX + (i - (w - 1) / 2) * 9.5} cy={16 + lv * 15} r={lv === 3 ? 2.2 : 1.7}
            fill={lv === 3 ? c : GRIS} />
        )),
      )}
    </>
  ),
  "arbol-fuxi": (c) => {
    const rows: ReactNode[] = [];
    for (let d = 0; d < 5; d++) {
      for (let i = 0; i < 1 << d; i++) {
        const x = CX + ((i + 0.5) / (1 << d) - 0.5) * 180;
        const y = 16 + d * 22;
        if (d < 4) {
          const xl = CX + ((2 * i + 0.5) / (1 << (d + 1)) - 0.5) * 180;
          const xr = CX + ((2 * i + 1.5) / (1 << (d + 1)) - 0.5) * 180;
          rows.push(
            <line key={`l${d}-${i}`} x1={x} y1={y} x2={xl} y2={y + 22} stroke={DIM} strokeWidth={0.8} />,
            <line key={`r${d}-${i}`} x1={x} y1={y} x2={xr} y2={y + 22} stroke={i === (1 << d) - 1 ? c : DIM} strokeWidth={0.8} />,
          );
        }
        rows.push(<circle key={`n${d}-${i}`} cx={x} cy={y} r={1.6} fill={d === 4 && i === 15 ? c : GRIS} />);
      }
    }
    return <>{rows}</>;
  },
  "bosque-nuclear": (c) => {
    const centro: Record<number, [number, number]> = { 0: [CX - 22, CY], 1: [CX + 22, CY - 6], 2: [CX + 22, CY + 6] };
    return (
      <>
        {Array.from({ length: 64 }, (_, v) => {
          const cu = CUENCA_DE[v];
          const [x, y] = anilloPos(v, 48);
          const [ax, ay] = centro[cu] ?? [CX, CY];
          return <line key={v} x1={x} y1={y} x2={ax} y2={ay} stroke={DIM} strokeWidth={0.5} opacity={0.7} />;
        })}
        {Object.values(centro).map(([x, y], i) => <circle key={`a${i}`} cx={x} cy={y} r={3.4} fill={c} />)}
      </>
    );
  },
  "matriz-nuclear": (c) =>
    M.flatMap((fila, r) =>
      fila.map((v, col) => (
        <circle key={`${r}-${col}`} cx={CX - 40 + col * 16} cy={20 + r * 16} r={v ? 4 : 1.4} fill={v ? c : DIM} />
      )),
    ),
  "serpiente-debruijn": (c) =>
    SECUENCIA.map((b, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 64;
      const x = CX + R * Math.cos(a);
      const y = CY + R * Math.sin(a);
      return (
        <rect key={i} x={x - 1.5} y={y - 1.5} width={3} height={b ? 8 : 4} rx={1}
          fill={i < 6 ? c : b ? "#CFC6B0" : TENUE} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />
      );
    }),
  "grupo-sierpinski": (c) =>
    Array.from({ length: 32 * 32 }, (_, k) => {
      const i = k >> 5;
      const j = k & 31;
      return sierpinski(i, j) ? (
        <rect key={k} x={CX - 48 + j * 3} y={12 + i * 3} width={2.4} height={2.4}
          fill={i < 16 && j < 16 ? c : GRIS} opacity={0.85} rx={0.3} />
      ) : null;
    }),
  "rey-wen-aleatorio": (c) => {
    const max = Math.max(...HIST.bins);
    const bw = (W - 24) / HIST.bins.length;
    return (
      <>
        {HIST.bins.map((v, i) => (
          <rect key={i} x={12 + i * bw} y={H - 14 - (v / max) * 78} width={bw - 0.8} height={(v / max) * 78} fill={DIM} rx={0.5} />
        ))}
        <line x1={12 + (HIST.realBin + 0.5) * bw} y1={16} x2={12 + (HIST.realBin + 0.5) * bw} y2={H - 12}
          stroke={c} strokeWidth={1.6} strokeDasharray="3 2" />
      </>
    );
  },
  "markov-consultas": (c) => {
    const est = estacionaria("milenrama");
    const porNivel = new Array(7).fill(0);
    for (let v = 0; v < 64; v++) porNivel[pc(v)] += est[v];
    const max = Math.max(...porNivel);
    return (
      <>
        {porNivel.map((m, k) => (
          <rect key={k} x={26 + k * 25} y={H - 14 - (m / max) * 88} width={16} height={(m / max) * 88}
            fill={k < 2 ? c : DIM} rx={1.5} />
        ))}
      </>
    );
  },
  "comparador-sorteo": (c) => {
    const fichas = { 9: 3, 8: 7, 7: 5, 6: 1 } as Record<6 | 7 | 8 | 9, number>;
    const grupos = [DIECISEISAVOS.monedas, DIECISEISAVOS.milenrama, fichas];
    return (
      <>
        {grupos.map((d, g) =>
          [9, 8, 7, 6].map((e, i) => {
            const v = d[e as 6 | 7 | 8 | 9];
            return (
              <rect key={`${g}-${i}`} x={26 + g * 62 + i * 13} y={H - 16 - v * 10} width={9} height={v * 10}
                fill={g === 0 ? DIM : g === 1 ? c : "#6B6353"} rx={1} />
            );
          }),
        )}
      </>
    );
  },
  "comparador-particiones": (c) => (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={24 + i * 22} y={26} width={18} height={10} rx={2} fill={i % 2 ? DIM : GRIS} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={`b${i}`} x={24 + i * 22} y={84} width={18} height={10} rx={2} fill={((i >> 1) ^ (i & 1)) % 2 ? DIM : c} />
      ))}
      {[0, 1, 2, 4, 6].map((i) => (
        <line key={`x${i}`} x1={33 + i * 22} y1={38} x2={33 + ((i * 3) % 8) * 22} y2={82} stroke={i === 0 ? c : DIM} strokeWidth={0.9} />
      ))}
    </>
  ),
  "espectro-walsh": (c) => {
    const ord = ENERGIA_ORDEN.slice(1); // ordenes 1..6
    const max = Math.max(...ord);
    return (
      <>
        {ord.map((v, i) => (
          <rect key={i} x={34 + i * 26} y={H - 14 - (v / max) * 90} width={16} height={(v / max) * 90}
            fill={i === 1 ? c : DIM} rx={1.5} />
        ))}
      </>
    );
  },
  "conteos-astronomicos": (c) => {
    const max = Math.max(...DISTANCIA);
    return (
      <>
        {DISTANCIA.map((d, i) => (
          <circle key={i} cx={20 + i * 30} cy={CY} r={2 + (d / max) * 22} fill="none"
            stroke={i === 3 ? c : DIM} strokeWidth={1.2} />
        ))}
      </>
    );
  },
  "paseo-aleatorio": (c) => {
    const r = rng(20260722);
    let v = 0;
    const pts: [number, number][] = [];
    for (let i = 0; i <= 14; i++) {
      pts.push([16 + i * 13, H - 16 - pc(v) * 13]);
      v = paso(v, r);
    }
    return (
      <>
        <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={c} strokeWidth={1.4} />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={1.8} fill={i === pts.length - 1 ? c : GRIS} />)}
      </>
    );
  },
  "leibniz-documentos": (c) => (
    <>
      {[120, 140, 100, 150, 90, 130, 60].map((w, i) => (
        <line key={i} x1={30} y1={26 + i * 11} x2={30 + w} y2={26 + i * 11} stroke={DIM} strokeWidth={2.2} strokeLinecap="round" />
      ))}
      <rect x={W - 52} y={H - 46} width={26} height={26} rx={2} fill="none" stroke={c} strokeWidth={1.6} />
      <text x={W - 39} y={H - 27} textAnchor="middle" fill={c} fontSize="13" fontFamily="Georgia, serif">易</text>
    </>
  ),
  "codones": (c) => {
    const enc = CODIFICACIONES[0];
    return (
      <>
        {Array.from({ length: 64 }, (_, v) => {
          const r = v >> 3;
          const col = v & 7;
          const a = aminoDe(v, enc);
          const cc = AMINO_INFO[a].color;
          return <circle key={v} cx={CX - 42 + col * 12} cy={18 + r * 12} r={2.1} fill={a === "*" ? DIM : cc} opacity={0.9} />;
        })}
      </>
    );
  },
  "calendario-soberanos": (c) => {
    const pos = (i: number, r = 44): [number, number] => {
      const a = ((-90 + i * 30) * Math.PI) / 180;
      return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
    };
    return (
      <>
        {SOBERANOS.map((_, i) => {
          const [x1, y1] = pos(i);
          const [x2, y2] = pos((i + 1) % 12);
          return <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE_COLOR[LINEAS_CAMBIO[i]]} strokeWidth={1.1} opacity={0.85} />;
        })}
        {SOBERANOS.map((s, i) => {
          const [x, y] = pos(i);
          return <circle key={i} cx={x} cy={y} r={s.solsticio ? 2.6 : 1.8} fill={s.solsticio ? c : GRIS} />;
        })}
        <circle cx={CX} cy={CY} r={2.2} fill={c} />
      </>
    );
  },
  "fibonacci-hexagrama": (c) => {
    const max = Math.max(...ESCALERA); // 21
    const bw = 26;
    return (
      <>
        {ESCALERA.map((v, i) => {
          const h = (v / max) * 90 + 4;
          const x = 20 + i * 31;
          const ultimo = i === ESCALERA.length - 1;
          return (
            <g key={i}>
              <rect x={x} y={H - 16 - h} width={bw} height={h} rx={2} fill={ultimo ? c : "#4a4436"} opacity={ultimo ? 1 : 0.85} />
              <text x={x + bw / 2} y={H - 5} textAnchor="middle" fontSize={7} fontFamily="ui-monospace, monospace" fill={ultimo ? c : GRIS}>
                {v}
              </text>
            </g>
          );
        })}
      </>
    );
  },
  "ising-hexagrama": (c) => {
    const p = probsBoltzmann(1, 1, false);
    const max = Math.max(...p);
    return (
      <>
        {Array.from({ length: 64 }, (_, v) => {
          const [x, y] = anilloPos(v);
          const r = 0.8 + (p[v] / max) * 3.4;
          return <circle key={v} cx={x} cy={y} r={r} fill={r > 2.6 ? c : TENUE} />;
        })}
      </>
    );
  },
  "entropia-oraculo": (c) => {
    const hs = [entropiaLinea("monedas"), entropiaLinea("milenrama")];
    const max = 2;
    return (
      <>
        <line x1={44} y1={H - 16 - (1 / max) * 88} x2={176} y2={H - 16 - (1 / max) * 88} stroke={DIM} strokeWidth={0.8} strokeDasharray="3 2" />
        {hs.map((h, i) => (
          <rect key={i} x={72 + i * 46} y={H - 16 - (h / max) * 88} width={30} height={(h / max) * 88} rx={2} fill={i === 0 ? GRIS : c} />
        ))}
      </>
    );
  },
  "matriz-transferencia": (c) =>
    PRESETS[0].M.flatMap((row, i) =>
      row.map((val, j) => (
        <rect key={`${i}-${j}`} x={CX - 30 + j * 30} y={CY - 30 + i * 30} width={26} height={26} rx={3}
          fill={val ? c : "none"} stroke={val ? c : DIM} strokeWidth={1.2} opacity={val ? 0.9 : 1} />
      )),
    ),
  "espectro-q6": (c) =>
    ESPECTRO.map((n, i) => {
      const y = 12 + i * 15;
      const dot = n.autovalor === 0 ? c : GRIS;
      return (
        <g key={i}>
          {Array.from({ length: n.mult }, (_, m) => (
            <circle key={m} cx={34 + m * 7.6} cy={y} r={1.7} fill={dot} />
          ))}
        </g>
      );
    }),
  "fourier-anillo": (c) => {
    const esp = ESPECTRO_FOURIER.slice(1, 25);
    const max = Math.max(...esp);
    const bw = (W - 24) / esp.length;
    return (
      <>
        {esp.map((m, i) => {
          const h = (m / max) * 92 + 2;
          return <rect key={i} x={12 + i * bw} y={H - 14 - h} width={bw - 0.8} height={h} rx={0.5} fill={i + 1 === 8 ? c : "#4a4436"} />;
        })}
      </>
    );
  },
  "influencias-lineas": (c) => {
    const inf = influencias(PROPIEDADES[0]);
    const max = 32;
    return (
      <>
        {inf.map((v, i) => {
          const h = (v / max) * 90 + 2;
          const x = 26 + i * 30;
          const alto = i === 1 || i === 4;
          return (
            <g key={i}>
              <rect x={x} y={H - 16 - h} width={22} height={h} rx={2} fill={alto ? c : "#4a4436"} />
              <text x={x + 11} y={H - 5} textAnchor="middle" fontSize={7} fontFamily="ui-monospace, monospace" fill={GRIS}>{i + 1}</text>
            </g>
          );
        })}
      </>
    );
  },
  "cubo-dice-no": (c) => {
    const cod = new Set(CODIGO_MAXIMO);
    return (
      <>
        {Array.from({ length: 64 }, (_, v) => {
          const [x, y] = anilloPos(v);
          const en = cod.has(v);
          return <circle key={v} cx={x} cy={y} r={en ? 3.4 : 1} fill={en ? c : DIM} />;
        })}
      </>
    );
  },
  "prosodia-sanscrita": (c) =>
    METROS_PARES.slice(0, 5).map((p, r) => {
      let x = 20;
      const y = 16 + r * 20;
      return (
        <g key={r}>
          {p.metro.map((s, i) => {
            const w = s === 2 ? 24 : 11;
            const rect = <rect key={i} x={x} y={y} width={w - 3} height={12} rx={2} fill={s === 2 ? c : "#4a4436"} />;
            x += w;
            return rect;
          })}
        </g>
      );
    }),
  "cage-musica-azar": (c) => {
    const sub = CARTA.slice(0, 30);
    return (
      <>
        <line x1={10} y1={H - 12} x2={W - 10} y2={H - 12} stroke={DIM} strokeWidth={0.8} />
        {sub.map((s, i) => {
          const x = 14 + i * 6.6;
          const y = H - 16 - (s.altura / 11) * 82;
          return <circle key={i} cx={x} cy={y} r={2} fill={i % 5 === 0 ? c : GRIS} />;
        })}
      </>
    );
  },
};

export const MINIATURA_SLUGS = Object.keys(GENERADORES);

/** Componente de miniatura para un slug dado. */
export function Miniatura({ slug, color }: { slug: string; color: string }) {
  const gen = GENERADORES[slug];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-hidden="true">
      {gen ? gen(color) : null}
    </svg>
  );
}

// Aserción en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (puros.length !== 8) console.error("[miniaturas] deberían ser 8 hexagramas puros");
  if (MINIATURA_SLUGS.length !== 38) console.error("[miniaturas] se esperaban 38 generadores");
}
