/**
 * Las influencias de las lineas (experimento 35, analisis de funciones booleanas).
 *
 * Toda propiedad de hexagramas es una funcion booleana de 6 variables. La influencia de
 * la linea k es la probabilidad de que voltearla cambie el veredicto:
 *   Inf_k(P) = #{v : P(v) != P(v XOR linea_k)} / 64.
 * La influencia total coincide con la suma espectral ponderada de Walsh (exp. 23):
 *   I(P) = suma_w popcount(w) ghat(w)^2, con g = (-1)^P. Todo se computa.
 */
import { hex } from "./iching";
import { sinDosYin, sinDosYang } from "./fibonacci";
import { CUENCA_DE } from "./bosque";

const LINE_BIT = (k: number): number => 1 << (6 - k);
const pc = (v: number): number => {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (v >> k) & 1;
  return n;
};

export interface Propiedad {
  id: string;
  nombre: string;
  fn: (v: number) => 0 | 1;
}

const CUENCA_QIAN = CUENCA_DE[63];

export const PROPIEDADES: Propiedad[] = [
  { id: "sin-yin", nombre: "sin dos yin seguidos (los 21 de Fibonacci)", fn: (v) => (sinDosYin(hex(v).bits) ? 1 : 0) },
  { id: "sin-yang", nombre: "sin dos yang seguidos", fn: (v) => (sinDosYang(hex(v).bits) ? 1 : 0) },
  { id: "paridad", nombre: "paridad de yang (número par de líneas yang)", fn: (v) => ((pc(v) & 1) === 0 ? 1 : 0) },
  { id: "cuenca-qian", nombre: "cae en la cuenca de Qian (bosque nuclear)", fn: (v) => (CUENCA_DE[v] === CUENCA_QIAN ? 1 : 0) },
];

/** Numerador de la influencia de cada linea (1..6): #{v que cambian} de 64. */
export function influencias(P: Propiedad): number[] {
  return [1, 2, 3, 4, 5, 6].map((k) => {
    const b = LINE_BIT(k);
    let c = 0;
    for (let v = 0; v < 64; v++) if (P.fn(v) !== P.fn(v ^ b)) c++;
    return c;
  });
}

/** Influencia total (suma de las 6, sobre 64). */
export function totalDirecta(P: Propiedad): number {
  return influencias(P).reduce((a, b) => a + b, 0) / 64;
}

/** Influencia total via el espectro de Walsh: suma_w popcount(w) ghat(w)^2. */
export function totalWalsh(P: Propiedad): number {
  const g = Array.from({ length: 64 }, (_, v) => 1 - 2 * P.fn(v)); // (-1)^P
  let total = 0;
  for (let w = 0; w < 64; w++) {
    let G = 0;
    for (let v = 0; v < 64; v++) G += g[v] * (pc(w & v) & 1 ? -1 : 1);
    const ghat = G / 64;
    total += pc(w) * ghat * ghat;
  }
  return total;
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  const syin = PROPIEDADES[0];
  if (influencias(syin).join(",") !== "10,22,18,18,22,10")
    console.error("[influencias] sin dos yin != [10,22,18,18,22,10]", influencias(syin));
  const par = PROPIEDADES[2];
  if (influencias(par).join(",") !== "64,64,64,64,64,64")
    console.error("[influencias] paridad != [64]*6", influencias(par));
  for (const P of PROPIEDADES) {
    if (Math.abs(totalDirecta(P) - totalWalsh(P)) > 1e-9)
      console.error(`[influencias] total directo != Walsh en ${P.id}`);
  }
}
