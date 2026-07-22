/**
 * La carrera de los órdenes: secuencias históricas de los 64 hexagramas como
 * permutaciones del orden binario Fu Xi (posición k → valor Fu Xi 0..63).
 *
 * Fuentes:
 *  - Rey Wen: el orden del libro recibido (ya en lib/permutacion.ts).
 *  - Mawangdui: reconstrucción estándar del manuscrito de seda (c. 168 a.C.),
 *    ver E. Shaughnessy, "I Ching: The Classic of Changes" (1996). Agrupa por
 *    trigrama SUPERIOR en el orden Qian, Gen, Kan, Zhen, Kun, Dui, Li, Xun
 *    (padre, hijos de menor a mayor, madre, hijas de menor a mayor); dentro de
 *    cada grupo, el primero es el trigrama doblado y los otros siete llevan el
 *    trigrama inferior en el orden fijo Qian, Kun, Gen, Dui, Kan, Li, Zhen, Xun.
 *  - Jing Fang: los ocho palacios en su orden tradicional; reusa la construcción
 *    del experimento de palacios (lib/palacios.ts), no la duplica.
 */
import { bitsOf, type TrigramName } from "./iching";
import { estructura, PERM, type EstructuraPermutacion } from "./permutacion";
import { PALACIOS } from "./palacios";

const UPPER_MWD: TrigramName[] = ["Qian", "Gen", "Kan", "Zhen", "Kun", "Dui", "Li", "Xun"];
const LOWER_MWD: TrigramName[] = ["Qian", "Kun", "Gen", "Dui", "Kan", "Li", "Zhen", "Xun"];

/** El orden de Mawangdui como valores Fu Xi por posición. */
export const MAWANGDUI: number[] = (() => {
  const out: number[] = [];
  for (const U of UPPER_MWD) {
    out.push(parseInt(bitsOf(U, U), 2)); // primero, el trigrama doblado
    for (const L of LOWER_MWD) {
      if (L !== U) out.push(parseInt(bitsOf(L, U), 2));
    }
  }
  return out;
})();

/** El orden de los ocho palacios de Jing Fang, aplanado. */
export const JING_FANG: number[] = PALACIOS.flatMap((p) => p.celdas.map((c) => c.v));

/** Fu Xi: la identidad, como línea base de la carrera. */
export const FU_XI: number[] = Array.from({ length: 64 }, (_, k) => k);

export interface OrdenHistorico {
  id: string;
  nombre: string;
  epoca: string;
  nota: string;
  perm: number[];
  estr: EstructuraPermutacion;
}

export const ORDENES: OrdenHistorico[] = [
  {
    id: "reywen",
    nombre: "Rey Wen",
    epoca: "el libro recibido",
    nota: "el orden tradicional de los 64 capítulos",
    perm: PERM,
    estr: estructura(PERM),
  },
  {
    id: "mawangdui",
    nombre: "Mawangdui",
    epoca: "c. 168 a.C.",
    nota: "manuscrito de seda: 8 bloques por trigrama superior",
    perm: MAWANGDUI,
    estr: estructura(MAWANGDUI),
  },
  {
    id: "jingfang",
    nombre: "Jing Fang",
    epoca: "siglo I a.C.",
    nota: "los ocho palacios, aplanados en su orden tradicional",
    perm: JING_FANG,
    estr: estructura(JING_FANG),
  },
  {
    id: "fuxi",
    nombre: "Fu Xi",
    epoca: "línea base",
    nota: "el conteo binario: la identidad, sin desorden alguno",
    perm: FU_XI,
    estr: estructura(FU_XI),
  },
];

// Aserciones en desarrollo: propiedades estructurales de cada orden.
if (process.env.NODE_ENV !== "production") {
  const biyeccion = (p: number[]) =>
    p.length === 64 && new Set(p).size === 64;
  for (const o of ORDENES) {
    if (!biyeccion(o.perm)) console.error(`[ordenes] ${o.id} no es una biyección`);
  }
  // Mawangdui: 8 bloques con trigrama superior constante, y el doblado abre cada bloque.
  for (let b = 0; b < 8; b++) {
    const bloque = MAWANGDUI.slice(8 * b, 8 * b + 8);
    const superiores = new Set(bloque.map((v) => v & 7));
    if (superiores.size !== 1)
      console.error(`[ordenes] bloque ${b} de Mawangdui mezcla trigramas superiores`);
    const primero = bloque[0];
    if (primero >> 3 !== (primero & 7))
      console.error(`[ordenes] el bloque ${b} de Mawangdui no abre con el trigrama doblado`);
  }
  // Jing Fang: coincide con la partición del experimento de palacios (por construcción,
  // pero se comprueba la biyección y el tamaño por palacio).
  if (JING_FANG.length !== 64) console.error("[ordenes] Jing Fang debe tener 64 posiciones");
}
