/**
 * Seis qubits (experimento 40): la identidad formal, con descargo blindado.
 *
 * Un hexagrama es un estado de la base computacional de 6 qubits: |Kun> = |000000>,
 * |Qian> = |111111>. La transformada de Walsh del sitio (H tensor 6, ya asertada en el
 * experimento 23) es LITERALMENTE la puerta de Hadamard aplicada a las 6 lineas. La
 * pieza central: aplicar Hadamard a |Kun> produce la superposicion uniforme de los 64
 * hexagramas con amplitud 1/8 cada uno.
 *
 * DESCARGO: esto es identidad entre transformadas y estados matematicos; NO se afirma
 * nada cuantico sobre el oraculo. El "quantum I Ching" comercial esta en el registro de
 * aplicabilidad como rechazado.
 */

const N = 64;

/** Entrada (w, v) de la matriz de Hadamard entera H tensor 6: (-1)^popcount(w AND v). */
export function hadamard6(w: number, v: number): number {
  let p = 0;
  let x = w & v;
  while (x) {
    p ^= x & 1;
    x >>= 1;
  }
  return p ? -1 : 1;
}

/** Factor de normalizacion de H tensor 6: (1/sqrt2)^6 = 1/8. */
export const AMPLITUD_UNIFORME = 1 / 8;
/** Probabilidad de cada hexagrama al medir la superposicion uniforme: (1/8)^2 = 1/64. */
export const PROB_UNIFORME = 1 / 64;
/** |Kun> = |000000>. */
export const KUN = 0;
/** |Qian> = |111111>. */
export const QIAN = 63;

/**
 * Amplitudes de aplicar la puerta de Hadamard normalizada a un estado base |v>:
 * la columna v de H tensor 6 dividida por 8. Para |Kun> (v = 0) son las 64 iguales a 1/8.
 */
export function amplitudesDesde(v: number): number[] {
  return Array.from({ length: N }, (_, w) => hadamard6(w, v) / 8);
}

/** La superposicion que contiene el libro entero: H tensor 6 sobre |Kun>. */
export const SUPERPOSICION_KUN: number[] = amplitudesDesde(KUN);

/** Muestra un hexagrama midiendo la superposicion uniforme (todas 1/64). */
export function medir(rng: () => number = Math.random): number {
  return Math.floor(rng() * N);
}

/** Verifica que la transformacion normalizada es unitaria: H H^T = I (preserva normas). */
export function esUnitaria(): boolean {
  for (let a = 0; a < N; a++) {
    for (let b = 0; b < N; b++) {
      let s = 0;
      for (let w = 0; w < N; w++) s += (hadamard6(w, a) / 8) * (hadamard6(w, b) / 8);
      const esperado = a === b ? 1 : 0;
      if (Math.abs(s - esperado) > 1e-9) return false;
    }
  }
  return true;
}

// === Aserciones en desarrollo ===
if (process.env.NODE_ENV !== "production") {
  // Las 64 amplitudes de |Kun> valen 1/8.
  if (SUPERPOSICION_KUN.some((a) => Math.abs(a - AMPLITUD_UNIFORME) > 1e-12))
    console.error("[qubits] las amplitudes de |Kun> no son todas 1/8");
  // La superposicion esta normalizada: suma de probabilidades = 1.
  const norma = SUPERPOSICION_KUN.reduce((s, a) => s + a * a, 0);
  if (Math.abs(norma - 1) > 1e-9) console.error("[qubits] la superposicion no esta normalizada", norma);
  // Probabilidad por hexagrama = 1/64.
  if (Math.abs(SUPERPOSICION_KUN[0] ** 2 - PROB_UNIFORME) > 1e-12)
    console.error("[qubits] la probabilidad por hexagrama no es 1/64");
  // La transformacion es unitaria.
  if (!esUnitaria()) console.error("[qubits] H tensor 6 normalizada no es unitaria");
}
