/**
 * Paseo aleatorio simple sobre el hipercubo Q6 (C2).
 *
 * Un caminante que en cada paso muta UNA línea uniforme al azar. La matriz de
 * transición es doblemente estocástica (P[i][j] = 1/6 si i y j difieren en una línea),
 * así que la estacionaria es uniforme y el tiempo esperado de retorno al origen es
 * 1/π = 64. El tiempo de cobertura (visitar los 64) se estima por simulación.
 */
import { lineBit } from "./iching";

/** Un paso del paseo: voltea una de las 6 líneas al azar. */
export function paso(v: number, rng: () => number = Math.random): number {
  return v ^ lineBit(1 + Math.floor(rng() * 6));
}

/** Tiempo de cobertura desde el estado inicial (pasos hasta ver los 64). */
export function tiempoCobertura(inicio = 0, rng: () => number = Math.random): number {
  let v = inicio;
  const vistos = new Set([v]);
  let pasos = 0;
  while (vistos.size < 64) {
    v = paso(v, rng);
    pasos++;
    vistos.add(v);
  }
  return pasos;
}

/** Tiempo de primer retorno al origen. */
export function tiempoRetorno(rng: () => number = Math.random): number {
  let v = 0;
  let pasos = 0;
  do {
    v = paso(v, rng);
    pasos++;
  } while (v !== 0);
  return pasos;
}

/** El tiempo esperado de retorno al origen: 64 (por la estacionaria uniforme). */
export const RETORNO_ESPERADO = 64;

// === La campana del caminante (ampliacion: teorema central del limite) ===

function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

function pc(v: number): number {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (v >> k) & 1;
  return n;
}

/** La distribucion estacionaria del numero de yang: exactamente la binomial C(6,k)/64. */
export const BINOMIAL: number[] = Array.from({ length: 7 }, (_, k) => binom(6, k) / 64);

/** Frecuencias del numero de yang del caminante a lo largo de un paseo de N pasos. */
export function frecuenciasYang(pasos: number, rng: () => number = Math.random): number[] {
  const cuenta = new Array(7).fill(0);
  let v = 0;
  cuenta[pc(v)]++;
  for (let i = 0; i < pasos; i++) {
    v = paso(v, rng);
    cuenta[pc(v)]++;
  }
  return cuenta.map((c) => c / (pasos + 1));
}

/** Desviacion maxima entre frecuencias observadas y la binomial. */
export function desviacionMax(frec: number[]): number {
  return Math.max(...frec.map((f, k) => Math.abs(f - BINOMIAL[k])));
}

/** ¿La matriz de transición es doblemente estocástica? (⇒ estacionaria uniforme) */
export function dobleEstocastica(): boolean {
  const cols = new Array(64).fill(0);
  for (let i = 0; i < 64; i++) {
    let fila = 0;
    for (let k = 1; k <= 6; k++) {
      const j = i ^ lineBit(k);
      fila += 1 / 6;
      cols[j] += 1 / 6;
    }
    if (Math.abs(fila - 1) > 1e-12) return false;
  }
  return cols.every((c) => Math.abs(c - 1) < 1e-12);
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (!dobleEstocastica()) console.error("[paseo] la matriz no es doblemente estocástica");
  // La binomial es una distribucion de probabilidad y vale C(6,k)/64.
  const suma = BINOMIAL.reduce((a, b) => a + b, 0);
  if (Math.abs(suma - 1) > 1e-12) console.error("[paseo] la binomial no suma 1", suma);
  if (BINOMIAL[3] !== 20 / 64) console.error("[paseo] C(6,3)/64 deberia ser 20/64");
}
