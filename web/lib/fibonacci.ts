/**
 * Fibonacci en el hexagrama (experimento 29).
 *
 * Un hexagrama es una cadena de 6 bits leida de abajo hacia arriba (linea 1 = bit mas
 * significativo, yang = 1, yin = 0). Contar los hexagramas cuyas posiciones yin no son
 * adyacentes es contar los conjuntos independientes del camino P6; su numero es un
 * Fibonacci. En la version circular (la linea 6 vecina de la linea 1) el grafo es el
 * ciclo C6 y el numero es un Lucas.
 *
 * Nada esta cableado: todos los conteos se computan. Fuente de la sucesion: OEIS
 * A000045 (Fibonacci) y A000032 (Lucas); el resto es teorema, verificado en la suite.
 */
import { hex, HEX_BY_VALUE } from "./iching";

/** Los 6 bits del hexagrama v, de la linea 1 (abajo) a la 6 (arriba). */
export function bitsDe(v: number): string {
  return hex(v).bits;
}

/** ¿Sin dos bits iguales a `bit` consecutivos? (P6, version lineal). */
function sinDosLineal(s: string, bit: string): boolean {
  return !s.includes(bit + bit);
}

/** ¿Sin dos bits iguales a `bit` consecutivos, cerrando el ciclo (C6, circular)? */
function sinDosCircular(s: string, bit: string): boolean {
  if (s.includes(bit + bit)) return false;
  return !(s[s.length - 1] === bit && s[0] === bit);
}

export type Regla = "yin" | "yang" | "ambas";

/** Los hexagramas que sobreviven a una regla, en la version lineal o circular. */
export function supervivientes(regla: Regla, circular: boolean): number[] {
  const ok = circular ? sinDosCircular : sinDosLineal;
  const out: number[] = [];
  for (let v = 0; v < 64; v++) {
    const s = bitsDe(v);
    const yin = ok(s, "0");
    const yang = ok(s, "1");
    const pasa = regla === "yin" ? yin : regla === "yang" ? yang : yin && yang;
    if (pasa) out.push(v);
  }
  return out;
}

/** Hexagramas sin dos yin consecutivos (version lineal): deben ser 21 = F(8). */
export const SIN_DOS_YIN: number[] = supervivientes("yin", false);
/** Hexagramas sin dos yang consecutivos: por simetria, tambien 21. */
export const SIN_DOS_YANG: number[] = supervivientes("yang", false);
/** Interseccion (alternancia perfecta): Ji Ji y Wei Ji, valores 42 y 21. */
export const ALTERNANTES: number[] = supervivientes("ambas", false);
/** Version circular sin dos yin: deben ser 18 = L(6). */
export const CIRCULAR_YIN: number[] = supervivientes("yin", true);

/** Numero de figuras de n lineas sin dos yin consecutivos = F(n+2). */
export function figurasSinDosYin(n: number): number {
  let c = 0;
  for (let m = 0; m < 1 << n; m++) {
    const s = m.toString(2).padStart(n, "0");
    if (!s.includes("00")) c++;
  }
  return c;
}

/** La escalera para n = 1..6 lineas: [2, 3, 5, 8, 13, 21]. */
export const ESCALERA: number[] = [1, 2, 3, 4, 5, 6].map(figurasSinDosYin);

/** Desglose de los 21 por numero de lineas yin (k = 0..3): [1, 6, 10, 4]. */
export const DESGLOSE_K: number[] = (() => {
  const out = [0, 0, 0, 0];
  for (const v of SIN_DOS_YIN) out[bitsDe(v).split("").filter((b) => b === "0").length]++;
  return out;
})();

/** Coeficiente binomial C(n, k). */
export function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

/** La identidad de Pascal: los 21 por diagonales, C(7-k, k) para k = 0..3. */
export const IDENTIDAD_PASCAL: number[] = [0, 1, 2, 3].map((k) => binom(7 - k, k));

/** Fibonacci: F(0) = 0, F(1) = 1. */
export function fib(n: number): number {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}

/** Lucas: L(0) = 2, L(1) = 1. */
export function lucas(n: number): number {
  let a = 2;
  let b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}

// Aserciones en desarrollo (las seis propiedades verificadas).
if (process.env.NODE_ENV !== "production") {
  if (SIN_DOS_YIN.length !== 21) console.error("[fibonacci] sin dos yin deben ser 21");
  if (SIN_DOS_YANG.length !== 21) console.error("[fibonacci] sin dos yang deben ser 21");
  if (SIN_DOS_YIN.length !== fib(8)) console.error("[fibonacci] 21 != F(8)");
  if (ESCALERA.join(",") !== "2,3,5,8,13,21") console.error("[fibonacci] escalera inesperada", ESCALERA);
  if (ESCALERA.some((x, i) => x !== fib(i + 3))) console.error("[fibonacci] escalera != F(n+2)");
  if (DESGLOSE_K.join(",") !== "1,6,10,4") console.error("[fibonacci] desglose por k inesperado", DESGLOSE_K);
  if (DESGLOSE_K.join(",") !== IDENTIDAD_PASCAL.join(",")) console.error("[fibonacci] desglose != C(7-k,k)");
  if (CIRCULAR_YIN.length !== 18) console.error("[fibonacci] circular deben ser 18");
  if (CIRCULAR_YIN.length !== lucas(6)) console.error("[fibonacci] 18 != L(6)");
  const alt = [...ALTERNANTES].sort((a, b) => a - b);
  if (alt.join(",") !== "21,42") console.error("[fibonacci] alternantes != {21,42}", alt);
  const kw = alt.map((v) => HEX_BY_VALUE[v].kw).sort((a, b) => a - b);
  if (kw.join(",") !== "63,64") console.error("[fibonacci] alternantes no son Ji Ji y Wei Ji", kw);
}
