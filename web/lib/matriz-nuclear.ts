/**
 * El operador nuclear (hu gua) como matriz sobre F2.
 *
 * El hexagrama nuclear toma las líneas interiores: la salida (l1'..l6') es
 * (l2, l3, l4, l3, l4, l5) del hexagrama de entrada. Como cada línea de salida es
 * una copia de una línea de entrada, hu gua es un mapa LINEAL sobre F2 (sin término
 * constante): existe una matriz M de 6x6 con M·x = hu_gua(x) para los 64 hexagramas.
 *
 * De la matriz sale todo el bosque nuclear (experimento 15): rank(M)=4 explica la
 * imagen de 16; rank(M²)=2, la de 4; y M⁴=M², con la imagen de M² igual a los 4
 * atractores {Kun, Qian, Ji Ji, Wei Ji}, sobre los que M fija a Kun y Qian e
 * intercambia Ji Ji con Wei Ji.
 */
import { huGua } from "./iching";

export type Matriz = number[][]; // 6x6 sobre F2 (0/1)

/** M: fila i = línea de salida i+1; columna j = línea de entrada j+1. */
export const M: Matriz = [
  [0, 1, 0, 0, 0, 0], // l1' = l2
  [0, 0, 1, 0, 0, 0], // l2' = l3
  [0, 0, 0, 1, 0, 0], // l3' = l4
  [0, 0, 1, 0, 0, 0], // l4' = l3
  [0, 0, 0, 1, 0, 0], // l5' = l4
  [0, 0, 0, 0, 1, 0], // l6' = l5
];

/** Vector de 6 bits (l1..l6) de un hexagrama; x[0] = línea 1 (bit más significativo). */
export function vecDe(v: number): number[] {
  return Array.from({ length: 6 }, (_, i) => (v >> (5 - i)) & 1);
}
export function valorDe(x: number[]): number {
  return x.reduce((acc, b, i) => acc | (b << (5 - i)), 0);
}

/** Producto matriz por vector sobre F2. */
export function matVec(A: Matriz, x: number[]): number[] {
  return A.map((fila) => fila.reduce((s, a, j) => s ^ (a & x[j]), 0));
}

/** Producto de matrices sobre F2. */
export function matMul(A: Matriz, B: Matriz): Matriz {
  return A.map((fila) =>
    Array.from({ length: 6 }, (_, j) => {
      let s = 0;
      for (let k = 0; k < 6; k++) s ^= fila[k] & B[k][j];
      return s;
    }),
  );
}

/** Rango de una matriz sobre F2 por eliminación gaussiana. */
export function rango(A: Matriz): number {
  const m = A.map((f) => [...f]);
  let r = 0;
  for (let col = 0; col < 6 && r < 6; col++) {
    let piv = -1;
    for (let i = r; i < 6; i++) if (m[i][col]) { piv = i; break; }
    if (piv === -1) continue;
    [m[r], m[piv]] = [m[piv], m[r]];
    for (let i = 0; i < 6; i++) {
      if (i !== r && m[i][col]) for (let j = 0; j < 6; j++) m[i][j] ^= m[r][j];
    }
    r++;
  }
  return r;
}

export const M2 = matMul(M, M);
export const M3 = matMul(M2, M);
export const M4 = matMul(M2, M2);

export const POTENCIAS: { etiqueta: string; mat: Matriz; rango: number; imagen: number }[] = [
  { etiqueta: "M", mat: M, rango: rango(M), imagen: 2 ** rango(M) },
  { etiqueta: "M²", mat: M2, rango: rango(M2), imagen: 2 ** rango(M2) },
  { etiqueta: "M³", mat: M3, rango: rango(M3), imagen: 2 ** rango(M3) },
  { etiqueta: "M⁴", mat: M4, rango: rango(M4), imagen: 2 ** rango(M4) },
];

/** Aplica M (una vez) a un hexagrama por su valor. */
export function aplicarM(v: number): number {
  return valorDe(matVec(M, vecDe(v)));
}

export function matricesIguales(A: Matriz, B: Matriz): boolean {
  return A.every((f, i) => f.every((a, j) => a === B[i][j]));
}

/** Imagen de una matriz como mapa sobre los 64 hexagramas (valores alcanzados). */
export function imagenComoMapa(A: Matriz): number[] {
  const s = new Set<number>();
  for (let v = 0; v < 64; v++) s.add(valorDe(matVec(A, vecDe(v))));
  return [...s].sort((a, b) => a - b);
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  // M reproduce hu gua bit a bit sobre los 64.
  for (let v = 0; v < 64; v++)
    if (aplicarM(v) !== huGua(v)) {
      console.error("[matriz-nuclear] M no coincide con hu gua en v=", v);
      break;
    }
  if (rango(M) !== 4) console.error("[matriz-nuclear] rank(M) debe ser 4");
  if (rango(M2) !== 2) console.error("[matriz-nuclear] rank(M²) debe ser 2");
  if (!matricesIguales(M4, M2)) console.error("[matriz-nuclear] debe cumplirse M⁴ = M²");
  const img2 = imagenComoMapa(M2).join(",");
  if (img2 !== "0,21,42,63")
    console.error("[matriz-nuclear] la imagen de M² debe ser los 4 atractores, es", img2);
}
