/**
 * Los ocho palacios (八宮) de Jing Fang (siglo II a.C.).
 *
 * Cada palacio parte de uno de los 8 hexagramas puros (trigrama duplicado) y
 * genera 8 hexagramas cambiando líneas en un orden fijo:
 *
 *   posición 0  本宮   hexagrama puro P
 *   posición k  (1–5)  P con las líneas 1..k volteadas (una línea nueva por paso)
 *   posición 6  游魂   "alma errante": se revierte la línea 4 → P voltea {1,2,3,5}
 *   posición 7  歸魂   "alma que retorna": se recupera el trigrama inferior → P voltea {5}
 *
 * Los 8 × 8 = 64 hexagramas resultan ser todos distintos: los palacios particionan
 * el conjunto completo. Es un recorrido estructurado sobre el hipercubo Q6 descrito
 * 22 siglos antes de la teoría de grafos.
 */
import { bitsOf, hamming, hex, lineBit, type TrigramName } from "./iching";

export interface PosicionInfo {
  idx: number;
  etiqueta: string;
  chino: string;
  desc: string;
}

export const POSICIONES: PosicionInfo[] = [
  { idx: 0, etiqueta: "Puro", chino: "本宮", desc: "el palacio en su estado original" },
  { idx: 1, etiqueta: "1.ª generación", chino: "一世", desc: "cambia la línea 1" },
  { idx: 2, etiqueta: "2.ª generación", chino: "二世", desc: "cambia la línea 2" },
  { idx: 3, etiqueta: "3.ª generación", chino: "三世", desc: "cambia la línea 3" },
  { idx: 4, etiqueta: "4.ª generación", chino: "四世", desc: "cambia la línea 4" },
  { idx: 5, etiqueta: "5.ª generación", chino: "五世", desc: "cambia la línea 5" },
  {
    idx: 6,
    etiqueta: "Alma errante",
    chino: "游魂",
    desc: "revierte la línea 4, un salto hacia adentro",
  },
  {
    idx: 7,
    etiqueta: "Alma que retorna",
    chino: "歸魂",
    desc: "recupera el trigrama inferior de origen",
  },
];

/** Orden tradicional del bagong de Jing Fang (乾震坎艮坤巽離兌:
 *  padre, tres hijos por edad, madre, tres hijas por edad). */
export const CABEZAS: TrigramName[] = [
  "Qian",
  "Zhen",
  "Kan",
  "Gen",
  "Kun",
  "Xun",
  "Li",
  "Dui",
];

const LOWER_MASK = lineBit(1) | lineBit(2) | lineBit(3); // líneas del trigrama inferior

export interface CeldaPalacio {
  v: number;
  /** Líneas (1–6) que cambiaron respecto al hexagrama puro. */
  cambiosDesdePuro: number[];
  /** Distancia de Hamming al hexagrama anterior de la secuencia (0 en la primera). */
  saltoDesdeAnterior: number;
}

export interface Palacio {
  cabeza: TrigramName;
  /** Valor del hexagrama puro. */
  puro: number;
  celdas: CeldaPalacio[];
}

function cambios(a: number, b: number): number[] {
  const out: number[] = [];
  for (let k = 1; k <= 6; k++) {
    if ((a & lineBit(k)) !== (b & lineBit(k))) out.push(k);
  }
  return out;
}

export function construirPalacio(cabeza: TrigramName): Palacio {
  const puro = parseInt(bitsOf(cabeza, cabeza), 2);
  const seq: number[] = [puro];
  let cur = puro;
  for (let k = 1; k <= 5; k++) {
    cur = cur ^ lineBit(k);
    seq.push(cur);
  }
  const youhun = seq[5] ^ lineBit(4);
  seq.push(youhun);
  const guihun = (youhun & ~LOWER_MASK) | (puro & LOWER_MASK);
  seq.push(guihun);

  const celdas: CeldaPalacio[] = seq.map((v, i) => ({
    v,
    cambiosDesdePuro: cambios(puro, v),
    saltoDesdeAnterior: i === 0 ? 0 : hamming(seq[i - 1], v),
  }));

  return { cabeza, puro, celdas };
}

export const PALACIOS: Palacio[] = CABEZAS.map(construirPalacio);

/** Mapa valor → { palacio, posición } para clasificar cualquier hexagrama. */
export const CLASIFICACION: Record<
  number,
  { palacio: number; posicion: number }
> = (() => {
  const out: Record<number, { palacio: number; posicion: number }> = {};
  PALACIOS.forEach((p, pi) => {
    p.celdas.forEach((c, ci) => {
      out[c.v] = { palacio: pi, posicion: ci };
    });
  });
  return out;
})();

/** El perfil de saltos es idéntico en los 8 palacios: 1,1,1,1,1,1,3. */
export const PERFIL_SALTOS = PALACIOS[0].celdas.map((c) => c.saltoDesdeAnterior);

/** Verificación: los 64 hexagramas quedan cubiertos exactamente una vez. */
export function verificarParticion(): { ok: boolean; distintos: number } {
  const vistos = new Set<number>();
  for (const p of PALACIOS) for (const c of p.celdas) vistos.add(c.v);
  return { ok: vistos.size === 64, distintos: vistos.size };
}

// Aserción en desarrollo: refleja scripts/experimentos.py.
if (process.env.NODE_ENV !== "production") {
  const { ok } = verificarParticion();
  if (!ok) console.error("[palacios] la partición falló: hay hexagramas repetidos");
  // Comprobación de las caracterizaciones limpias del alma errante y la que retorna.
  for (const p of PALACIOS) {
    const errante = p.celdas[6];
    const retorna = p.celdas[7];
    if (
      JSON.stringify(errante.cambiosDesdePuro) !== JSON.stringify([1, 2, 3, 5]) ||
      JSON.stringify(retorna.cambiosDesdePuro) !== JSON.stringify([5])
    ) {
      console.error("[palacios] caracterización inesperada en", hex(p.puro).py);
    }
  }
}
