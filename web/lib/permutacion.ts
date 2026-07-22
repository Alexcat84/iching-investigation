/**
 * El orden del Rey Wen como permutación del orden Fu Xi.
 *
 * Fu Xi es la identidad (posición = valor 0–63). El Rey Wen reordena esos 64 números.
 * Aquí analizamos esa permutación: su descomposición en ciclos, puntos fijos, orden,
 * paridad e inversiones. Es la medida exacta de "cuánto desordena" el libro la geometría.
 */
import { HEX_BY_KW } from "./iching";

/** PERM[k] = valor Fu Xi del hexagrama en la posición k del Rey Wen (k = 0…63). */
export const PERM: number[] = Array.from({ length: 64 }, (_, k) => HEX_BY_KW[k + 1].v);

export interface EstructuraPermutacion {
  ciclos: number[][];
  numCiclos: number;
  longitudes: number[];
  maxLongitud: number;
  puntosFijos: number[];
  orden: number; // mcm de las longitudes de ciclo
  inversiones: number;
  paridad: "par" | "impar";
}

function mcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}
function mcm(a: number, b: number): number {
  return (a / mcd(a, b)) * b;
}

export function estructura(perm: number[]): EstructuraPermutacion {
  const n = perm.length;
  const visto = new Array(n).fill(false);
  const ciclos: number[][] = [];
  for (let i = 0; i < n; i++) {
    if (visto[i]) continue;
    const ciclo: number[] = [];
    let j = i;
    while (!visto[j]) {
      visto[j] = true;
      ciclo.push(j);
      j = perm[j];
    }
    ciclos.push(ciclo);
  }
  const longitudes = ciclos.map((c) => c.length).sort((a, b) => b - a);
  const puntosFijos = ciclos.filter((c) => c.length === 1).map((c) => c[0]);
  const orden = longitudes.reduce((a, b) => mcm(a, b), 1);

  // Inversiones: pares (i<j) con perm[i] > perm[j].
  let inversiones = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) if (perm[i] > perm[j]) inversiones++;

  // Paridad = paridad del número de transposiciones = (n − nº de ciclos) mod 2.
  const transposiciones = n - ciclos.length;
  const paridad = transposiciones % 2 === 0 ? "par" : "impar";

  return {
    ciclos,
    numCiclos: ciclos.length,
    longitudes,
    maxLongitud: longitudes[0],
    puntosFijos,
    orden,
    inversiones,
    paridad,
  };
}

export const ESTRUCTURA = estructura(PERM);

/** Inversiones máximas posibles para n elementos (permutación totalmente invertida). */
export const INVERSIONES_MAX = (64 * 63) / 2;
