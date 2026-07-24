/**
 * El calendario de los soberanos: los 12 hexagramas bi gua (辟卦), también llamados
 * xiao xi gua (消息卦, "de flujo y reflujo"), que la tradición Han asignó a los 12
 * meses lunares (asociados a Meng Xi y a la escuela de Jing Fang).
 *
 * La asignación a los meses es tradición documentada, no un teorema. Los teoremas son
 * las cuatro propiedades verificadas aquí y en scripts/experimentos.py:
 *   1. En orden de mes, los 12 forman un ciclo Gray cerrado (cada paso, incluido el
 *      regreso Kun→Fu, cambia una sola línea).
 *   2. La línea que cambia avanza 2,3,4,5,6,1,...: el yang llena de abajo hacia arriba
 *      seis meses y el yin vacía en el mismo orden los otros seis (onda de yang
 *      1,2,3,4,5,6,5,4,3,2,1,0).
 *   3. El mes m y el mes m+6 son complementos dui exactos (v XOR v' = 63).
 *   4. Los 12 son exactamente los hexagramas monótonos de Q6 (todo el yang debajo de
 *      todo el yin, o al revés).
 */
import { lineBit } from "./iching";
import { PALACIOS } from "./palacios";

export interface Soberano {
  /** Mes lunar chino (1–12). */
  mesLunar: number;
  /** Valor Fu Xi 0–63. */
  v: number;
  /** Equivalente gregoriano aproximado (la correspondencia exacta es lunisolar). */
  gregoriano: string;
  /** Solsticio contenido en el mes, si aplica. */
  solsticio?: "invierno" | "verano";
}

/** Los 12 soberanos en orden de mes lunar, empezando por el mes 11 (solsticio de invierno). */
export const SOBERANOS: Soberano[] = [
  { mesLunar: 11, v: 32, gregoriano: "≈ diciembre", solsticio: "invierno" },
  { mesLunar: 12, v: 48, gregoriano: "≈ enero" },
  { mesLunar: 1, v: 56, gregoriano: "≈ febrero" },
  { mesLunar: 2, v: 60, gregoriano: "≈ marzo" },
  { mesLunar: 3, v: 62, gregoriano: "≈ abril" },
  { mesLunar: 4, v: 63, gregoriano: "≈ mayo" },
  { mesLunar: 5, v: 31, gregoriano: "≈ junio", solsticio: "verano" },
  { mesLunar: 6, v: 15, gregoriano: "≈ julio" },
  { mesLunar: 7, v: 7, gregoriano: "≈ agosto" },
  { mesLunar: 8, v: 3, gregoriano: "≈ septiembre" },
  { mesLunar: 9, v: 1, gregoriano: "≈ octubre" },
  { mesLunar: 10, v: 0, gregoriano: "≈ noviembre" },
];

export const VALORES: number[] = SOBERANOS.map((s) => s.v);

/**
 * Puente con los palacios de Jing Fang (la observación cualitativa está en Yijing Dao;
 * aquí se demuestra): los 12 soberanos (los monótonos de Q6) son exactamente las primeras
 * seis generaciones del palacio de Qian y las seis del de Kun. Cero en los otros seis.
 */
export const PUENTE_PALACIOS: { qian: number[]; kun: number[] } = (() => {
  const monos = new Set(VALORES);
  const primeras6 = (i: number) => PALACIOS[i].celdas.slice(0, 6).map((c) => c.v).filter((v) => monos.has(v));
  return { qian: primeras6(0), kun: primeras6(4) }; // PALACIOS[0]=Qian, PALACIOS[4]=Kun
})();

function popcount(v: number): number {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (v >> k) & 1;
  return n;
}

/** Línea (1–6) que cambia al pasar del mes de índice i al siguiente (cíclico). */
export function lineaQueCambia(i: number): number {
  const d = VALORES[i] ^ VALORES[(i + 1) % 12];
  for (let k = 1; k <= 6; k++) if (lineBit(k) === d) return k;
  return 0;
}

/** Secuencia de líneas que cambian mes a mes: [2,3,4,5,6,1,2,3,4,5,6,1]. */
export const LINEAS_CAMBIO: number[] = SOBERANOS.map((_, i) => lineaQueCambia(i));

/** Índice del mes antípoda (m + 6). */
export function antipodaIdx(i: number): number {
  return (i + 6) % 12;
}

/** Número de líneas yang por mes: la onda triangular. */
export const YANG_POR_MES: number[] = VALORES.map(popcount);

/** ¿v es monótono? (bits 1^k0^(6-k) o 0^k1^(6-k), leídos línea 1 → 6). */
export function esMonotono(v: number): boolean {
  const b = v.toString(2).padStart(6, "0");
  const y = popcount(v);
  return b === "1".repeat(y) + "0".repeat(6 - y) || b === "0".repeat(6 - y) + "1".repeat(y);
}

// === Verificaciones (las cuatro propiedades) ===

export function cicloGray(): boolean {
  return SOBERANOS.every((_, i) => {
    const d = VALORES[i] ^ VALORES[(i + 1) % 12];
    return popcount(d) === 1;
  });
}
export function lineasEnOrden(): boolean {
  return LINEAS_CAMBIO.join(",") === "2,3,4,5,6,1,2,3,4,5,6,1";
}
export function antipodasDui(): boolean {
  for (let i = 0; i < 6; i++) if ((VALORES[i] ^ VALORES[i + 6]) !== 63) return false;
  return true;
}
export function sonLosMonotonos(): boolean {
  const monotonos = Array.from({ length: 64 }, (_, v) => v).filter(esMonotono);
  const a = [...VALORES].sort((x, y) => x - y).join(",");
  const b = monotonos.sort((x, y) => x - y).join(",");
  return a === b;
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (SOBERANOS.length !== 12) console.error("[soberanos] deben ser 12");
  if (!cicloGray()) console.error("[soberanos] no forman un ciclo Gray cerrado");
  if (!lineasEnOrden()) console.error("[soberanos] la secuencia de líneas no es 2,3,4,5,6,1,...");
  if (!antipodasDui()) console.error("[soberanos] los meses m y m+6 no son complementos dui");
  if (!sonLosMonotonos()) console.error("[soberanos] no coinciden con los monótonos de Q6");
  if (YANG_POR_MES.join(",") !== "1,2,3,4,5,6,5,4,3,2,1,0")
    console.error("[soberanos] la onda de yang no es la esperada");
  if (PUENTE_PALACIOS.qian.length !== 6 || PUENTE_PALACIOS.kun.length !== 6)
    console.error("[soberanos] el puente con los palacios no da 6 + 6", PUENTE_PALACIOS);
  if (new Set([...PUENTE_PALACIOS.qian, ...PUENTE_PALACIOS.kun]).size !== 12)
    console.error("[soberanos] Qian[:6] y Kun[:6] no cubren los 12 monótonos");
}
