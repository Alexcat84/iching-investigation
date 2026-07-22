/**
 * La secuencia del Rey Wen: la regla de pares y la búsqueda de una estructura global.
 *
 * El orden tradicional agrupa los 64 en 32 pares (1-2, 3-4, …). Cada par par es el
 * volteo (fan 反) del impar anterior; salvo en los 8 palíndromos, donde el volteo no
 * cambia nada y se usa el opuesto (dui 对). Fuera de esa regla no se conoce ninguna
 * fórmula binaria: a diferencia de Fu Xi, el Rey Wen no cuenta.
 */
import { dui, fan, hamming, HEX_BY_KW } from "./iching";

export type Operacion = "fan" | "dui";

export interface Par {
  n: number; // número de par 1–32
  aKw: number; // impar (2n-1)
  bKw: number; // par (2n)
  aV: number;
  bV: number;
  op: Operacion;
}

export const PARES: Par[] = Array.from({ length: 32 }, (_, i) => {
  const n = i + 1;
  const aKw = 2 * n - 1;
  const bKw = 2 * n;
  const aV = HEX_BY_KW[aKw].v;
  const bV = HEX_BY_KW[bKw].v;
  const op: Operacion = fan(aV) === aV ? "dui" : "fan";
  return { n, aKw, bKw, aV, bV, op };
});

export const PARES_FAN = PARES.filter((p) => p.op === "fan").length;
export const PARES_DUI = PARES.filter((p) => p.op === "dui").length;

/** Número de líneas yang de un hexagrama (0–6). */
export const yang = (v: number): number => hamming(v, 0);

/** Valores Fu Xi (0–63) en el orden del Rey Wen (posición 0 = hexagrama 1). */
export const FUXI_EN_ORDEN_KW: number[] = Array.from(
  { length: 64 },
  (_, i) => HEX_BY_KW[i + 1].v,
);

/** Líneas yang de cada hexagrama en orden del Rey Wen. */
export const YANG_EN_ORDEN_KW: number[] = FUXI_EN_ORDEN_KW.map(yang);

/** Verifica que la regla de pares se cumple en los 32 pares. */
export function verificarReglaPares(): boolean {
  return PARES.every((p) => p.bV === (p.op === "dui" ? dui(p.aV) : fan(p.aV)));
}
