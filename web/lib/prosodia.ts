/**
 * Los poetas que contaron primero (experimento 37, prosodia sánscrita).
 *
 * La prosodia sánscrita cuenta los metros de duración n hechos de sílabas cortas
 * (laghu, 1) y largas (guru, 2). El número de metros cumple C(n) = C(n-1) + C(n-2) =
 * 1, 2, 3, 5, 8, 13, 21: los números de Fibonacci, formulados por Virahanka, Gopala y
 * Hemachandra siglos antes de Fibonacci (tradición con ficha [singh1985]).
 *
 * Teorema propio: las 21 figuras de 6 líneas sin dos yin seguidos están en biyección
 * con los 21 metros de duración 7. Se añade un yang centinela como séptima línea y se
 * empareja cada yin con el yang inmediatamente superior como una sílaba larga (2); cada
 * yang no emparejado es una corta (1). El total dura siempre 7. Verificado en la suite.
 */
import { hex } from "./iching";
import { SIN_DOS_YIN } from "./fibonacci";

export type Metro = number[]; // secuencia de 1 (corta) y 2 (larga)

/** El metro de duración 7 asociado a una figura de 6 líneas sin dos yin. */
export function metroDe(v: number): Metro {
  const s = hex(v).bits + "1"; // centinela yang en la línea 7
  const m: Metro = [];
  let i = 0;
  while (i < 7) {
    if (s[i] === "0") {
      m.push(2); // yin + yang superior = sílaba larga
      i += 2;
    } else {
      m.push(1); // yang no emparejado = sílaba corta
      i += 1;
    }
  }
  return m;
}

/** Todas las composiciones de n en partes 1 y 2 (los metros de duración n). */
export function composiciones(n: number): Metro[] {
  if (n === 0) return [[]];
  const out: Metro[] = [];
  if (n >= 1) for (const c of composiciones(n - 1)) out.push([1, ...c]);
  if (n >= 2) for (const c of composiciones(n - 2)) out.push([2, ...c]);
  return out;
}

/** La escalera de metros por duración: C(n) para n = 1..6 (Fibonacci: 1..21). */
export const ESCALERA_METROS: number[] = [1, 2, 3, 4, 5, 6].map((n) => composiciones(n).length);

/** Los 21 pares (figura sin dos yin, su metro de duración 7), ordenados por valor. */
export const PARES: { v: number; metro: Metro }[] = [...SIN_DOS_YIN]
  .sort((a, b) => a - b)
  .map((v) => ({ v, metro: metroDe(v) }));

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (SIN_DOS_YIN.length !== 21) console.error("[prosodia] deberían ser 21 figuras");
  if (PARES.some((p) => p.metro.reduce((a, b) => a + b, 0) !== 7))
    console.error("[prosodia] algún metro no dura 7");
  const metros = PARES.map((p) => p.metro.join(""));
  if (new Set(metros).size !== 21) console.error("[prosodia] la biyección no es inyectiva");
  const todas = new Set(composiciones(7).map((c) => c.join("")));
  if (todas.size !== 21 || !metros.every((m) => todas.has(m)))
    console.error("[prosodia] la imagen no cubre las composiciones de 7");
  if (ESCALERA_METROS.join(",") !== "1,2,3,5,8,13") console.error("[prosodia] escalera != Fibonacci");
}
