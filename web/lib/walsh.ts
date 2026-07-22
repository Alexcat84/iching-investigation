/**
 * El espectro de Walsh-Hadamard de la secuencia del Rey Wen (A4).
 *
 * Toda función sobre los 64 hexagramas se descompone en los 64 caracteres de Walsh
 * del cubo: F(w) = Σ_v f(v) · (−1)^⟨w,v⟩, con ⟨w,v⟩ = paridad de (w AND v). Cada w es
 * un subconjunto de las 6 dimensiones (líneas); |F(w)|² mide cuánta estructura de la
 * señal vive en ese subconjunto.
 *
 * Señal: f(v) = número del Rey Wen del hexagrama de valor v. Complementa el test de
 * aleatoriedad (B2): B2 dice si el orden es aleatorio en conjunto; A4, en qué
 * frecuencias concretas se concentra la poca estructura que tiene.
 */
import { HEX_BY_VALUE } from "./iching";

/** Señal: valor Fu Xi → número del Rey Wen. */
export const SENAL: number[] = Array.from({ length: 64 }, (_, v) => HEX_BY_VALUE[v].kw);

function paridad(x: number): number {
  let p = 0;
  while (x) {
    p ^= x & 1;
    x >>= 1;
  }
  return p;
}

/** Transformada de Walsh-Hadamard de una señal de 64 valores. */
export function wht(f: number[]): number[] {
  return Array.from({ length: 64 }, (_, w) =>
    f.reduce((s, fv, v) => s + fv * (paridad(w & v) ? -1 : 1), 0),
  );
}

export const ESPECTRO: number[] = wht(SENAL);

export function popcount(w: number): number {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (w >> k) & 1;
  return n;
}

/** Energía (Σ F(w)²) por orden = número de líneas del subconjunto w (0..6). */
export const ENERGIA_ORDEN: number[] = (() => {
  const e = new Array(7).fill(0);
  for (let w = 0; w < 64; w++) e[popcount(w)] += ESPECTRO[w] ** 2;
  return e;
})();

export const ENERGIA_TOTAL_SIN_DC = ENERGIA_ORDEN.slice(1).reduce((a, b) => a + b, 0);

/** Número de coeficientes por orden = C(6,k) = [1,6,15,20,15,6,1]. Derivado, no cableado. */
export const NUM_POR_ORDEN: number[] = (() => {
  const c = new Array(7).fill(0);
  for (let w = 0; w < 64; w++) c[popcount(w)]++;
  return c;
})();

/** Energía en los órdenes pares 2 y 4 (interacciones entre pares y cuartetos de líneas). */
export const ENERGIA_PARES = ENERGIA_ORDEN[2] + ENERGIA_ORDEN[4];

/** Fracción de la energía (sin DC) que vive en los órdenes pares 2 y 4. */
export const FRACCION_PARES = ENERGIA_PARES / ENERGIA_TOTAL_SIN_DC;

/** Fracción que un orden aleatorio repartiría en los órdenes 2 y 4: proporcional al
 *  número de coeficientes, (C(6,2)+C(6,4)) / 63. La referencia contra la que comparar. */
export const FRACCION_PARES_AZAR =
  (NUM_POR_ORDEN[2] + NUM_POR_ORDEN[4]) /
  NUM_POR_ORDEN.slice(1).reduce((a, b) => a + b, 0);

/** Líneas (1..6) del subconjunto w. w = valor con línea k en el bit 6−k. */
export function lineasDe(w: number): number[] {
  const out: number[] = [];
  for (let k = 1; k <= 6; k++) if ((w >> (6 - k)) & 1) out.push(k);
  return out;
}

/** Los coeficientes más grandes (sin la componente DC w=0). */
export const TOP: { w: number; F: number; lineas: number[] }[] = Array.from(
  { length: 63 },
  (_, i) => i + 1,
)
  .map((w) => ({ w, F: ESPECTRO[w], lineas: lineasDe(w) }))
  .sort((a, b) => Math.abs(b.F) - Math.abs(a.F))
  .slice(0, 8);

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  // Parseval: Σ F² = 64 Σ f².
  const sF = ESPECTRO.reduce((s, x) => s + x * x, 0);
  const sf = SENAL.reduce((s, x) => s + x * x, 0);
  if (sF !== 64 * sf) console.error("[walsh] Parseval falla");
  // WHT de una delta es constante (todo 1).
  const delta = [1, ...new Array(63).fill(0)];
  if (new Set(wht(delta)).size !== 1) console.error("[walsh] WHT(delta) no es constante");
  // Involución: WHT(WHT(f)) = 64 f.
  const ff = wht(ESPECTRO);
  if (!ff.every((x, v) => x === 64 * SENAL[v])) console.error("[walsh] WHT² != 64 f");
  // DC = 64 · media.
  if (ESPECTRO[0] !== 2080) console.error("[walsh] la componente DC debería ser 2080");
  const esperado = [4326400, 57856, 703072, 199616, 379232, 57728, 256];
  if (ENERGIA_ORDEN.join(",") !== esperado.join(","))
    console.error("[walsh] energía por orden inesperada", ENERGIA_ORDEN);
  // Concentración en órdenes pares: 77,4% real frente a 47,6% del azar.
  if (Math.abs(FRACCION_PARES - 0.7743) > 0.001)
    console.error("[walsh] fracción de órdenes pares inesperada", FRACCION_PARES);
  if (Math.abs(FRACCION_PARES_AZAR - 30 / 63) > 1e-9)
    console.error("[walsh] fracción de azar (órdenes pares) inesperada", FRACCION_PARES_AZAR);
}
