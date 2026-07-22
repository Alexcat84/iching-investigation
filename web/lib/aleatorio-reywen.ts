/**
 * ¿Es el Rey Wen aleatorio? Un test de hipótesis sobre el orden tradicional.
 *
 * Hipótesis nula: el orden del Rey Wen es un barajado cualquiera que respeta su
 * regla de pares — los 32 pares fan/dui en cualquier orden, y cada par en cualquiera
 * de sus dos orientaciones. Bajo esa nula medimos la distribución de inversiones (y
 * del costo en líneas de B3) frente a Fu Xi, y situamos el valor real (1013, 211).
 *
 * Los estadísticos de abajo se calculan en scripts/experimentos.py con N = 20000 y
 * semilla fija (20260722); la suite los reproduce y los verifica. La misma cifra que
 * ves aquí es la que asegura la suite.
 */
import { hamming, HEX_BY_KW } from "./iching";

/** Los 32 pares del Rey Wen como tuplas (valor impar, valor par). */
export const PARES: [number, number][] = Array.from({ length: 32 }, (_, i) => [
  HEX_BY_KW[2 * i + 1].v,
  HEX_BY_KW[2 * i + 2].v,
]);

export const N_NULA = 20000;
export const SEMILLA = 20260722;

/** Orden real del Rey Wen (valores Fu Xi por posición). */
export const REAL: number[] = Array.from({ length: 64 }, (_, k) => HEX_BY_KW[k + 1].v);
export const REAL_INV = 1013;
export const REAL_COST = 211;

/** Estadísticos de la nula (congelados desde la suite; N=20000, semilla 20260722). */
export const INV = { media: 1009.1236, sigma: 80.3191, z: 0.0483, p2: 0.9662 };
export const COST = { media: 214.0762, sigma: 6.4934, z: -0.4737, p2: 0.6499 };

/** Histograma de inversiones de la nula (congelado). */
export const HIST = {
  lo: 636,
  ancho: 24,
  bins: [
    0, 0, 0, 9, 3, 19, 47, 130, 279, 519, 799, 1142, 1552, 1968, 2183, 2301, 2215,
    2050, 1639, 1278, 844, 533, 264, 142, 51, 23, 9, 1, 0, 0, 0,
  ],
  realBin: 15,
};

/** Costo en líneas de una secuencia (métrica de B3). */
export function costo(seq: number[]): number {
  let s = 0;
  for (let i = 0; i < seq.length - 1; i++) s += hamming(seq[i], seq[i + 1]);
  return s;
}

/** Genera una muestra bajo la nula: baraja los pares y voltea orientaciones. */
export function muestra(rng: () => number = Math.random): number[] {
  const pr = PARES.map((p) => [...p] as [number, number]);
  for (let i = pr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pr[i], pr[j]] = [pr[j], pr[i]];
  }
  const seq: number[] = [];
  for (const [a, b] of pr) {
    if (rng() < 0.5) seq.push(b, a);
    else seq.push(a, b);
  }
  return seq;
}

/** ¿La secuencia respeta la regla de pares? (32 bloques de 2, cada uno un par válido) */
export function respetaPares(seq: number[]): boolean {
  if (seq.length !== 64 || new Set(seq).size !== 64) return false;
  const validos = new Set(PARES.flatMap(([a, b]) => [`${a},${b}`, `${b},${a}`]));
  for (let i = 0; i < 64; i += 2) if (!validos.has(`${seq[i]},${seq[i + 1]}`)) return false;
  return true;
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (PARES.length !== 32) console.error("[aleatorio] deben ser 32 pares");
  // El generador respeta la regla de pares sobre una muestra.
  for (let t = 0; t < 200; t++)
    if (!respetaPares(muestra())) {
      console.error("[aleatorio] el generador produjo una muestra inválida");
      break;
    }
  const sum = HIST.bins.reduce((a, b) => a + b, 0);
  if (sum !== N_NULA) console.error("[aleatorio] el histograma no suma N", sum);
}
