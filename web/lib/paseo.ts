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
}
