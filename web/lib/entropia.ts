/**
 * La entropia del oraculo (experimento 31, teoria de la informacion de Shannon 1948).
 *
 * H = -suma de p log2 p, en bits. Un hexagrama uniforme son 6 bits (el maximo para 64
 * estados). Una linea de monedas tiene mas entropia que una de milenrama, y la
 * diferencia vive toda en el movimiento (viejo/joven), porque el valor yin/yang puro es
 * 1 bit exacto en ambos metodos. La estacionaria sesgada de la milenrama tiene menos de
 * 6 bits. Nada esta cableado: todo se computa de las probabilidades del oraculo.
 */
import { DIECISEISAVOS, ES_YANG, type Metodo, type Estado } from "./oraculo";

/** Entropia de Shannon en bits de una distribucion de probabilidad. */
export function H(ps: number[]): number {
  return -ps.reduce((s, p) => (p > 0 ? s + p * Math.log2(p) : s), 0);
}

const ESTADOS: Estado[] = [6, 7, 8, 9];

/** Probabilidades de los 4 estados de linea (6, 7, 8, 9) de un metodo. */
export function probsLinea(m: Metodo): number[] {
  return ESTADOS.map((e) => DIECISEISAVOS[m][e] / 16);
}

/** Entropia de una linea completa (los 4 estados): monedas 1,8113, milenrama 1,7490. */
export function entropiaLinea(m: Metodo): number {
  return H(probsLinea(m));
}

/** Entropia del valor yin/yang puro (colapsando viejo/joven): 1 bit en ambos. */
export function entropiaValor(m: Metodo): number {
  let pYang = 0;
  for (const e of ESTADOS) if (ES_YANG[e]) pYang += DIECISEISAVOS[m][e] / 16;
  return H([pYang, 1 - pYang]);
}

/** Entropia del movimiento (lo que sobra al fijar el valor): entropiaLinea - entropiaValor. */
export function entropiaMovimiento(m: Metodo): number {
  return entropiaLinea(m) - entropiaValor(m);
}

/** Un hexagrama uniforme: 6 bits, el maximo para 64 estados. */
export const HEXAGRAMA_UNIFORME = Math.log2(64);

/** Entropia de una estacionaria producto con probabilidad p de yang por linea: 6 H(p). */
export function entropiaEstacionaria(pYang: number): number {
  return 6 * H([pYang, 1 - pYang]);
}

/** Monedas: estacionaria uniforme = 6 bits. Milenrama: p_yang = 1/4 -> 6 H(1/4) = 4,8677. */
export const ESTACIONARIA_MONEDAS = entropiaEstacionaria(1 / 2);
export const ESTACIONARIA_MILENRAMA = entropiaEstacionaria(1 / 4);

/** Profundidad de cada hoja en el arbol de Huffman de una distribucion. */
export function huffmanProfundidades(probs: number[]): number[] {
  const prof = new Array(probs.length).fill(0);
  let nodos = probs.map((p, i) => ({ p, hojas: [i] }));
  while (nodos.length > 1) {
    nodos.sort((a, b) => a.p - b.p);
    const a = nodos.shift()!;
    const b = nodos.shift()!;
    for (const h of [...a.hojas, ...b.hojas]) prof[h]++;
    nodos.push({ p: a.p + b.p, hojas: [...a.hojas, ...b.hojas] });
  }
  return prof;
}

/** Longitud esperada del codigo optimo (Huffman) de una linea: bits por linea. */
export function longitudHuffman(m: Metodo): number {
  const probs = probsLinea(m);
  const prof = huffmanProfundidades(probs);
  return probs.reduce((s, p, i) => s + p * prof[i], 0);
}

/** Monedas 30/16 = 1,875; milenrama 29/16 = 1,8125 (menos entropia y mejor compresion). */
export const LONGITUD_HUFFMAN: Record<Metodo, number> = {
  monedas: longitudHuffman("monedas"),
  milenrama: longitudHuffman("milenrama"),
};

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  const err = (c: boolean, m: string) => c && console.error(`[entropia] ${m}`);
  err(Math.abs(entropiaLinea("monedas") - 1.8113) > 1e-3, "linea monedas != 1.8113");
  err(Math.abs(entropiaLinea("milenrama") - 1.749) > 1e-3, "linea milenrama != 1.7490");
  err(Math.abs(entropiaLinea("monedas") - entropiaLinea("milenrama") - 0.0623) > 1e-3, "diferencia != 0.0623");
  err(Math.abs(entropiaValor("monedas") - 1) > 1e-9, "valor monedas != 1");
  err(Math.abs(entropiaValor("milenrama") - 1) > 1e-9, "valor milenrama != 1");
  err(Math.abs(HEXAGRAMA_UNIFORME - 6) > 1e-9, "uniforme != 6");
  err(Math.abs(ESTACIONARIA_MILENRAMA - 4.8677) > 1e-3, "estacionaria milenrama != 4.8677");
  err(Math.abs(ESTACIONARIA_MONEDAS - 6) > 1e-9, "estacionaria monedas != 6");
  err(Math.abs(LONGITUD_HUFFMAN.monedas - 30 / 16) > 1e-9, "Huffman monedas != 30/16");
  err(Math.abs(LONGITUD_HUFFMAN.milenrama - 29 / 16) > 1e-9, "Huffman milenrama != 29/16");
  for (const m of ["monedas", "milenrama"] as const) {
    const h = entropiaLinea(m);
    err(!(h <= LONGITUD_HUFFMAN[m] && LONGITUD_HUFFMAN[m] < h + 1), `Huffman ${m} no cumple H <= L < H+1`);
  }
}
