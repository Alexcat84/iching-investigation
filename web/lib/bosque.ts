/**
 * El bosque nuclear: la dinámica completa del mapa hu gua (hexagrama nuclear).
 *
 * Cada hexagrama apunta a su nuclear: un grafo funcional de 64 flechas que
 * colapsa rápido. La imagen de la primera aplicación son 16 hexagramas (los 16
 * nucleares clásicos); la de la segunda, 4. Redacción unificada del sitio:
 * 3 atractores: dos puntos fijos y un ciclo de 2 (4 hexagramas atractores).
 */
import { huGua } from "./iching";
import { NUCLEAR } from "./simetrias";

/** Imagen de la primera aplicación: los 16 nucleares clásicos (ordenados por valor). */
export const IMAGEN1: number[] = [...new Set(Array.from({ length: 64 }, (_, v) => huGua(v)))].sort(
  (a, b) => a - b,
);

/** Imagen de la segunda aplicación: 4 hexagramas. */
export const IMAGEN2: number[] = [...new Set(IMAGEN1.map((v) => huGua(v)))].sort((a, b) => a - b);

/** Profundidad de caída de cada hexagrama (0 si ya es atractor; máximo 2). */
export const PROFUNDIDAD: number[] = NUCLEAR.pasos;

/** Índice de cuenca (ciclo de NUCLEAR) de cada hexagrama. */
export const CUENCA_DE: number[] = NUCLEAR.atractor;

export interface Cuenca {
  /** Índice del ciclo en NUCLEAR.ciclos. */
  ciclo: number;
  /** Hexagramas del atractor (1 o 2). */
  atractores: number[];
  /** Caen al atractor en 1 paso. */
  profundidad1: number[];
  /** Caen en 2 pasos. */
  profundidad2: number[];
  total: number;
}

/** Las tres cuencas, ordenadas de mayor a menor. */
export const CUENCAS: Cuenca[] = NUCLEAR.ciclos
  .map((cyc, i) => {
    const enCuenca = Array.from({ length: 64 }, (_, v) => v).filter(
      (v) => CUENCA_DE[v] === i,
    );
    return {
      ciclo: i,
      atractores: [...cyc].sort((a, b) => a - b),
      profundidad1: enCuenca.filter((v) => PROFUNDIDAD[v] === 1).sort((a, b) => a - b),
      profundidad2: enCuenca.filter((v) => PROFUNDIDAD[v] === 2).sort((a, b) => a - b),
      total: enCuenca.length,
    };
  })
  .sort((a, b) => b.total - a.total);

/** La caída completa de un hexagrama: v, hu(v), hu²(v), ... hasta entrar al atractor. */
export function caida(v: number): number[] {
  const out = [v];
  let cur = v;
  for (let i = 0; i < PROFUNDIDAD[v]; i++) {
    cur = huGua(cur);
    out.push(cur);
  }
  return out;
}

// Aserciones en desarrollo (complementan las de lib/simetrias.ts).
if (process.env.NODE_ENV !== "production") {
  if (IMAGEN1.length !== 16)
    console.error("[bosque] la primera imagen debe tener 16 hexagramas, hay", IMAGEN1.length);
  if (IMAGEN2.length !== 4)
    console.error("[bosque] la segunda imagen debe tener 4, hay", IMAGEN2.length);
  const totales = CUENCAS.map((c) => c.total).sort((a, b) => b - a).join(",");
  if (totales !== "32,16,16") console.error("[bosque] cuencas esperadas 32,16,16:", totales);
  if (Math.max(...PROFUNDIDAD) !== 2) console.error("[bosque] profundidad máxima esperada 2");
  // Los atractores están dentro de la primera imagen.
  const im1 = new Set(IMAGEN1);
  if (!IMAGEN2.every((v) => im1.has(v)))
    console.error("[bosque] la segunda imagen debe estar contenida en la primera");
}
