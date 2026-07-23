/**
 * El espectro del hipercubo (experimento 33).
 *
 * Los autovalores de la matriz de adyacencia de Q6 (los 64 hexagramas, aristas = mutar
 * una linea) son 6 - 2k con multiplicidad C(6,k), para k = 0..6. Es un teorema clasico:
 * los autovectores son los caracteres chi_w(v) = (-1)^{<w,v>}, con autovalor 6 - 2
 * popcount(w). Las multiplicidades son exactamente los niveles de yang del reticulo B6
 * (experimento 13), y el espectro del paseo simple (experimento 25) es este dividido por
 * 6, lo que fija su velocidad de mezcla. Todo se computa.
 */

/** Coeficiente binomial C(n, k). */
export function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

export interface Nivel {
  /** Autovalor de la adyacencia: 6 - 2k. */
  autovalor: number;
  /** Multiplicidad: C(6,k), tambien el tamano del nivel k del reticulo B6. */
  mult: number;
  /** Numero de lineas yang del nivel (k contado desde arriba). */
  k: number;
  /** Autovalor del paseo aleatorio simple: autovalor / 6. */
  autovalorPaseo: number;
}

export const ESPECTRO: Nivel[] = Array.from({ length: 7 }, (_, k) => ({
  autovalor: 6 - 2 * k,
  mult: binom(6, k),
  k,
  autovalorPaseo: (6 - 2 * k) / 6,
}));

/** El multiconjunto de autovalores como {autovalor: multiplicidad}. */
export const MULTISET: Record<number, number> = Object.fromEntries(
  ESPECTRO.map((n) => [n.autovalor, n.mult]),
);

/** Aplica la adyacencia de Q6 a un vector caracter chi_w y devuelve el vector imagen. */
export function aplicaAdyacencia(vec: number[]): number[] {
  return Array.from({ length: 64 }, (_, v) => {
    let s = 0;
    for (let k = 0; k < 6; k++) s += vec[v ^ (1 << k)];
    return s;
  });
}
function popcount(x: number): number {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (x >> k) & 1;
  return n;
}
function caracter(w: number): number[] {
  return Array.from({ length: 64 }, (_, v) => (popcount(w & v) & 1 ? -1 : 1));
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  const total = ESPECTRO.reduce((a, n) => a + n.mult, 0);
  if (total !== 64) console.error("[espectro-q6] las multiplicidades no suman 64", total);
  if (MULTISET[6] !== 1 || MULTISET[2] !== 15 || MULTISET[0] !== 20)
    console.error("[espectro-q6] multiconjunto inesperado", MULTISET);
  // chi_w es autovector con autovalor 6 - 2 popcount(w).
  for (const w of [0, 1, 3, 7, 21, 63]) {
    const chi = caracter(w);
    const img = aplicaAdyacencia(chi);
    const lam = 6 - 2 * popcount(w);
    if (img.some((x, v) => x !== lam * chi[v]))
      console.error(`[espectro-q6] chi_${w} no es autovector`);
  }
}
