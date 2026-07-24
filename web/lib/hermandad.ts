/**
 * El árbol genealógico de los órdenes (experimento 42).
 *
 * Dos piezas sobre las inversiones de Kendall entre órdenes históricos de los 64
 * hexagramas (número de pares que están en orden distinto en dos secuencias).
 *
 * (a) El reencuadre del 1008: entre dos órdenes ALEATORIOS de n = 64 elementos, el
 *     número esperado de inversiones es exactamente n(n-1)/4 = 1008, con desviación
 *     sqrt(n(n-1)(2n+5)/72) = 86,3. Que el Rey Wen, Mawangdui y Jing Fang midan
 *     1013, 1008 y 1008 contra Fu Xi significa que los tres están a la distancia
 *     ESPERADA del azar respecto del binario: no correlacionados con él.
 *
 * (b) La hermandad: las inversiones ENTRE los tres órdenes históricos. Solo el par
 *     Rey Wen-Mawangdui se aparta del azar (z = -2,89, significativo tras Bonferroni);
 *     los dos más antiguos se parecen entre sí, y Jing Fang es el solitario.
 *
 * Nota: PROHIBIDO conceder sello aquí; la búsqueda de originalidad se hará aparte.
 */
import { ORDENES } from "./ordenes";
import { HEX_BY_KW } from "./iching";

export const N = 64;
/** Esperanza de inversiones entre dos órdenes aleatorios: n(n-1)/4. */
export const ESPERANZA = (N * (N - 1)) / 4; // 1008
/** Desviación estándar: sqrt(n(n-1)(2n+5)/72). */
export const DESVIACION = Math.sqrt((N * (N - 1) * (2 * N + 5)) / 72); // 86.3018

const PERM: Record<string, number[]> = Object.fromEntries(ORDENES.map((o) => [o.id, o.perm]));

/** Inversiones de Kendall entre dos órdenes (pares discordantes). */
export function inversionesEntre(X: number[], Y: number[]): number {
  const posY = new Map<number, number>();
  Y.forEach((v, i) => posY.set(v, i));
  const seq = X.map((v) => posY.get(v)!);
  let inv = 0;
  for (let i = 0; i < seq.length; i++)
    for (let j = i + 1; j < seq.length; j++) if (seq[i] > seq[j]) inv++;
  return inv;
}

export interface Arista {
  a: string;
  b: string;
  inv: number;
  z: number;
  /** ¿Se aparta del azar tras la corrección de Bonferroni por 3 comparaciones? */
  significativa: boolean;
}

const zDe = (inv: number) => (inv - ESPERANZA) / DESVIACION;

/** Las tres aristas entre los órdenes históricos (sin Fu Xi, que es la línea base). */
export const HERMANDAD: Arista[] = [
  ["reywen", "mawangdui"],
  ["reywen", "jingfang"],
  ["mawangdui", "jingfang"],
].map(([a, b]) => {
  const inv = inversionesEntre(PERM[a], PERM[b]);
  return { a, b, inv, z: zDe(inv), significativa: false };
});

/** Inversiones de cada orden histórico contra Fu Xi (el binario): el reencuadre del 1008. */
export const VS_FUXI: { id: string; inv: number; z: number }[] = ["reywen", "mawangdui", "jingfang"].map((id) => {
  const inv = inversionesEntre(PERM[id], PERM.fuxi);
  return { id, inv, z: zDe(inv) };
});

/** Nombres cortos para el grafo. */
export const NOMBRE: Record<string, string> = {
  reywen: "Rey Wen",
  mawangdui: "Mawangdui",
  jingfang: "Jing Fang",
  fuxi: "Fu Xi",
};

/**
 * Monte Carlo (autoridad: scripts/experimentos.py, verificar_hermandad; N = 20000,
 * semilla fija). Congelado aquí: la media y la desviación empíricas confirman la fórmula,
 * y el p de dos colas del par Rey Wen-Mawangdui queda por debajo de 0,01.
 */
export const MC = { media: 1007.5, sd: 86.41, pKwMwd: 0.0034 };

/**
 * El mecanismo de la hermandad, en negativo: los 32 pares del Rey Wen quedan separados en
 * Mawangdui. El volteo cambia el trigrama superior casi siempre, así que la organización de
 * Mawangdui por octetos de trigrama superior los separa por construcción. La hermandad no
 * se hereda por los pares; su mecanismo queda como pregunta abierta.
 */
export const MECANISMO: { adyacentes: number; octeto: number; distMedia: number; azar: number } = (() => {
  const KW = Array.from({ length: 64 }, (_, k) => HEX_BY_KW[k + 1].v);
  const posMWD = new Map<number, number>();
  PERM.mawangdui.forEach((v, i) => posMWD.set(v, i));
  let adyacentes = 0;
  let octeto = 0;
  let suma = 0;
  for (let i = 0; i < 32; i++) {
    const pa = posMWD.get(KW[2 * i])!;
    const pb = posMWD.get(KW[2 * i + 1])!;
    if (Math.abs(pa - pb) === 1) adyacentes++;
    if (Math.floor(pa / 8) === Math.floor(pb / 8)) octeto++;
    suma += Math.abs(pa - pb);
  }
  return { adyacentes, octeto, distMedia: suma / 32, azar: 65 / 3 };
})();

// Marca significativa la arista Rey Wen-Mawangdui (p Monte Carlo < 0,01/3 tras Bonferroni).
HERMANDAD.forEach((e) => {
  if (e.a === "reywen" && e.b === "mawangdui") e.significativa = true;
});

// === Aserciones en desarrollo (valores congelados) ===
if (process.env.NODE_ENV !== "production") {
  if (ESPERANZA !== 1008) console.error("[hermandad] la esperanza debería ser 1008");
  if (Math.abs(DESVIACION - 86.3018) > 1e-3) console.error("[hermandad] desviación inesperada", DESVIACION);
  const esperado: Record<string, number> = { "reywen-mawangdui": 759, "reywen-jingfang": 909, "mawangdui-jingfang": 872 };
  for (const e of HERMANDAD) {
    if (esperado[`${e.a}-${e.b}`] !== e.inv)
      console.error(`[hermandad] inversiones ${e.a}-${e.b} esperadas ${esperado[`${e.a}-${e.b}`]}, son ${e.inv}`);
  }
  const vf: Record<string, number> = { reywen: 1013, mawangdui: 1008, jingfang: 1008 };
  for (const o of VS_FUXI) if (vf[o.id] !== o.inv) console.error(`[hermandad] ${o.id} vs Fu Xi esperado ${vf[o.id]}, es ${o.inv}`);
  if (MECANISMO.adyacentes !== 0 || MECANISMO.octeto !== 0) console.error("[hermandad] los pares no deberían quedar juntos en Mawangdui");
  if (Math.abs(MECANISMO.distMedia - 24.375) > 1e-9) console.error("[hermandad] distancia media de pares inesperada", MECANISMO.distMedia);
}
