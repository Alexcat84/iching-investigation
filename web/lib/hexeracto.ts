/**
 * Las caras del hexeracto (experimento 41): los hexagramas parciales.
 *
 * Las caras del 6-cubo son palabras de seis simbolos sobre {yin, yang, indeterminado}.
 * Los vertices (0 indeterminados) son los 64 hexagramas completos; las aristas (1
 * indeterminado) son las 192 mutaciones de una linea; el solido entero (6 indeterminados)
 * es el hexagrama totalmente abierto. El numero de caras de dimension k es
 * f_k = C(6,k) 2^(6-k), y suman 3^6 = 729 (tres opciones por linea), la funcion
 * generatriz (2 + x)^6.
 *
 * yin = 0, yang = 1, indeterminado = 2 (asterisco).
 */

/** Coeficiente binomial C(n, k). */
export function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

/** f_k = numero de caras de dimension k = C(6,k) 2^(6-k), por formula cerrada. */
export const F_VECTOR: number[] = Array.from({ length: 7 }, (_, k) => binom(6, k) * 2 ** (6 - k));

/** El mismo f-vector por enumeracion directa de {0,1,*}^6 contando asteriscos. */
export const F_VECTOR_ENUMERADO: number[] = (() => {
  const cnt = new Array(7).fill(0);
  for (let m = 0; m < 3 ** 6; m++) {
    let x = m;
    let estrellas = 0;
    for (let i = 0; i < 6; i++) {
      if (x % 3 === 2) estrellas++;
      x = Math.floor(x / 3);
    }
    cnt[estrellas]++;
  }
  return cnt;
})();

/** Suma total de caras: 3^6 = 729. */
export const TOTAL_CARAS = F_VECTOR.reduce((a, b) => a + b, 0);

/** Caracteristica de Euler de la frontera (k = 0..5): 0, porque es una 5-esfera. */
export const EULER_FRONTERA = F_VECTOR.slice(0, 6).reduce((s, f, k) => s + (k % 2 ? -f : f), 0);
/** Caracteristica de Euler del total (k = 0..6): 1, porque el solido es contractil. */
export const EULER_TOTAL = F_VECTOR.reduce((s, f, k) => s + (k % 2 ? -f : f), 0);

export const NOMBRES_DIMENSION = [
  "vertices (hexagramas)",
  "aristas (mutaciones)",
  "cuadrados",
  "cubos",
  "5-celdas",
  "6-celdas",
  "el hexeracto",
];

/** Dimension de una cara = numero de lineas indeterminadas (asteriscos). */
export function dimensionDe(palabra: number[]): number {
  return palabra.filter((s) => s === 2).length;
}

/** Los vertices (hexagramas completos) contenidos en una cara: 2^k completaciones. */
export function verticesDe(palabra: number[]): number[] {
  const estrellas: number[] = [];
  palabra.forEach((s, i) => {
    if (s === 2) estrellas.push(i);
  });
  const base: number[] = palabra.map((s) => (s === 1 ? 1 : 0));
  const out: number[] = [];
  for (let m = 0; m < 1 << estrellas.length; m++) {
    const bits = [...base];
    estrellas.forEach((idx, j) => {
      bits[idx] = (m >> j) & 1;
    });
    // linea 1 = bit mas significativo (valor 32), como en todo el sitio
    let v = 0;
    for (let i = 0; i < 6; i++) v = (v << 1) | bits[i];
    out.push(v);
  }
  return out.sort((a, b) => a - b);
}

// === Aserciones en desarrollo ===
if (process.env.NODE_ENV !== "production") {
  if (F_VECTOR.join(",") !== "64,192,240,160,60,12,1")
    console.error("[hexeracto] f-vector inesperado", F_VECTOR);
  if (F_VECTOR_ENUMERADO.join(",") !== F_VECTOR.join(","))
    console.error("[hexeracto] la enumeracion directa no coincide con la formula");
  if (TOTAL_CARAS !== 729 || 3 ** 6 !== 729) console.error("[hexeracto] la suma no es 3^6 = 729");
  if (EULER_FRONTERA !== 0) console.error("[hexeracto] Euler de la frontera deberia ser 0 (5-esfera)");
  if (EULER_TOTAL !== 1) console.error("[hexeracto] Euler del total deberia ser 1 (contractil)");
  // Una cara de dimension k contiene 2^k vertices.
  if (verticesDe([2, 2, 0, 1, 2, 0]).length !== 8) console.error("[hexeracto] una 3-cara debe tener 8 vertices");
  if (verticesDe([0, 1, 0, 1, 1, 0]).length !== 1) console.error("[hexeracto] un vertice se contiene a si mismo");
}
