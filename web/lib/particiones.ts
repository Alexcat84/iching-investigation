/**
 * Comparador de particiones (A3). El sitio ya tiene varias formas de partir los 64
 * hexagramas; esta herramienta mide cuánto se parecen dos cualesquiera con el índice
 * de Rand ajustado (ARI) y muestra su matriz de cruce.
 *
 * Reusa las particiones ya construidas: palacios de Jing Fang (lib/palacios), cuencas
 * nucleares (lib/bosque), cosets del subgrupo de puros (lib/grupo) y las filas y
 * columnas de trigramas (lib/iching). No duplica su lógica.
 *
 * Hallazgo: los palacios NO son los cosets. Las 8 máscaras de generación de Jing Fang
 * no forman subgrupo, así que los palacios no son cosets de nada; y su ARI es negativo.
 */
import { CLASIFICACION, PALACIOS } from "./palacios";
import { CUENCA_DE } from "./bosque";
import { cosetDe } from "./grupo";

export interface Particion {
  id: string;
  nombre: string;
  k: number;
  etiqueta: (v: number) => number;
}

export const PARTICIONES: Particion[] = [
  { id: "palacios", nombre: "Palacios de Jing Fang", k: 8, etiqueta: (v) => CLASIFICACION[v].palacio },
  { id: "cuencas", nombre: "Cuencas nucleares", k: 3, etiqueta: (v) => CUENCA_DE[v] },
  { id: "cosets", nombre: "Cosets de los puros", k: 8, etiqueta: (v) => cosetDe(v) },
  { id: "tri-inf", nombre: "Trigrama inferior", k: 8, etiqueta: (v) => v >> 3 },
  { id: "tri-sup", nombre: "Trigrama superior", k: 8, etiqueta: (v) => v & 7 },
];

export function getParticion(id: string): Particion {
  return PARTICIONES.find((p) => p.id === id) ?? PARTICIONES[0];
}

function c2(n: number): number {
  return (n * (n - 1)) / 2;
}

/** Índice de Rand ajustado entre dos particiones (rango ≤ 1; = 1 si idénticas). */
export function ari(A: Particion, B: Particion): number {
  const ct = new Map<string, number>();
  const a = new Map<number, number>();
  const b = new Map<number, number>();
  for (let v = 0; v < 64; v++) {
    const ka = A.etiqueta(v);
    const kb = B.etiqueta(v);
    ct.set(`${ka},${kb}`, (ct.get(`${ka},${kb}`) ?? 0) + 1);
    a.set(ka, (a.get(ka) ?? 0) + 1);
    b.set(kb, (b.get(kb) ?? 0) + 1);
  }
  const sij = [...ct.values()].reduce((s, n) => s + c2(n), 0);
  const sa = [...a.values()].reduce((s, n) => s + c2(n), 0);
  const sb = [...b.values()].reduce((s, n) => s + c2(n), 0);
  const exp = (sa * sb) / c2(64);
  const max = (sa + sb) / 2;
  return max === exp ? 1 : (sij - exp) / (max - exp);
}

/** Matriz de cruce: filas = grupos de A, columnas = grupos de B, celda = intersección. */
export function cruce(A: Particion, B: Particion): number[][] {
  const M = Array.from({ length: A.k }, () => new Array(B.k).fill(0));
  for (let v = 0; v < 64; v++) M[A.etiqueta(v)][B.etiqueta(v)]++;
  return M;
}

/** Las 8 máscaras de generación de los palacios (relativas al hexagrama puro). */
export const MASCARAS_PALACIO: number[] = (() => {
  const p = PALACIOS[0];
  return p.celdas.map((c) => c.v ^ p.puro).sort((a, b) => a - b);
})();

/** ¿Las máscaras de generación forman un subgrupo (cerradas bajo XOR)? */
export function mascarasSonSubgrupo(): boolean {
  const s = new Set(MASCARAS_PALACIO);
  for (const a of MASCARAS_PALACIO) for (const b of MASCARAS_PALACIO) if (!s.has(a ^ b)) return false;
  return true;
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  for (const p of PARTICIONES) {
    if (Math.abs(ari(p, p) - 1) > 1e-9) console.error(`[particiones] ARI(${p.id},${p.id}) != 1`);
    // simetría
    for (const q of PARTICIONES)
      if (Math.abs(ari(p, q) - ari(q, p)) > 1e-9) console.error("[particiones] ARI no simétrico");
  }
  const pal = getParticion("palacios");
  const cos = getParticion("cosets");
  const iguales = Array.from({ length: 64 }, (_, v) => pal.etiqueta(v) === cos.etiqueta(v)).every(Boolean);
  if (iguales) console.error("[particiones] palacios y cosets no deberían coincidir");
  if (mascarasSonSubgrupo())
    console.error("[particiones] las máscaras de palacio no deberían ser subgrupo");
  if (Math.abs(ari(pal, cos) - -0.125) > 1e-4)
    console.error("[particiones] ARI palacios vs cosets debería ser -0.125");
}
