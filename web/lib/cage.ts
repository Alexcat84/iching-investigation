/**
 * Cage: la música del azar (experimento 38).
 *
 * Historia documentada (ficha [pritchett1993]): a fines de 1950 John Cage recibió el I
 * Ching, construyó cartas de 64 valores indexadas por los hexagramas y las seleccionó
 * con tiradas de monedas; Music of Changes (1951) es la obra fundacional de la
 * composicion por azar.
 *
 * Aqui documentamos el METODO, no la obra. La carta de abajo es PROPIA y demostrativa
 * (una sonoridad generada por hexagrama, nunca las cartas de Cage), y la seleccion usa
 * el mismo motor de monedas del experimento 21. PROHIBIDO reproducir partituras o
 * fragmentos de Cage.
 */

/** Una sonoridad demostrativa: una nota de una escala pentatónica, su altura y duración. */
export interface Sonoridad {
  v: number;
  nota: string;
  /** Altura relativa 0..11 para dibujarla. */
  altura: number;
  /** Duración en pulsos (1..4). */
  duracion: number;
}

const NOTAS = ["do", "re", "mi", "sol", "la"]; // pentatónica, sin implicación de obra alguna

function popcount(v: number): number {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (v >> k) & 1;
  return n;
}

/** Carta demostrativa PROPIA: un valor por cada uno de los 64 hexagramas (índice = valor). */
export const CARTA: Sonoridad[] = Array.from({ length: 64 }, (_, v) => ({
  v,
  nota: NOTAS[v % 5],
  altura: (v * 5) % 12,
  duracion: 1 + (popcount(v) % 4),
}));

/** Tira una línea con tres monedas (cara = 1): devuelve 1 si sale yang, 0 si yin. */
export function tiraLinea(rng: () => number): number {
  const suma = (rng() < 0.5 ? 1 : 0) + (rng() < 0.5 ? 1 : 0) + (rng() < 0.5 ? 1 : 0);
  // 3 monedas -> P(par de caras) = 1/2; par -> yang, impar -> yin (P(yang) = 1/2).
  return suma % 2 === 0 ? 1 : 0;
}

/** Selecciona un hexagrama con seis tiradas (línea 1 = bit más significativo). */
export function seleccionaHexagrama(rng: () => number): number {
  let v = 0;
  for (let k = 0; k < 6; k++) v = (v << 1) | tiraLinea(rng);
  return v;
}

/** Probabilidad de cada hexagrama bajo el método: (1/2)^6 = 1/64 (uniforme). */
export const PROB_HEXAGRAMA = 1 / 64;

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (CARTA.length !== 64) console.error("[cage] la carta debe tener 64 sonoridades");
  if (new Set(CARTA.map((s) => s.v)).size !== 64) console.error("[cage] la carta no indexa los 64");
  if (Math.abs(PROB_HEXAGRAMA - 1 / 64) > 1e-12) console.error("[cage] la selección no es uniforme");
}
