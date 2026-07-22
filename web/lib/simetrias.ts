/**
 * Simetrías de los 64 hexagramas.
 *
 * Dos involuciones clásicas actúan sobre el hipercubo:
 *   fan (反): volteo vertical: invierte el orden de las 6 líneas.
 *   dui (对): opuesto, complementa cada línea (NOT).
 * Conmutan, así que {id, fan, dui, fan∘dui} forman el grupo de Klein V₄.
 * Por Burnside, V₄ parte los 64 hexagramas en 20 órbitas.
 *
 * Aparte, el hexagrama nuclear (hu gua) NO es invertible: iterado, colapsa todos
 * los hexagramas en unos pocos atractores.
 */
import { dui, fan, huGua, HEX_BY_KW } from "./iching";

export const fanDui = (v: number): number => dui(fan(v));

export interface OpInfo {
  id: "id" | "fan" | "dui" | "fanDui";
  nombre: string;
  chino: string;
  aplicar: (v: number) => number;
}

export const OPERACIONES: OpInfo[] = [
  { id: "id", nombre: "identidad", chino: "·", aplicar: (v) => v },
  { id: "fan", nombre: "volteo", chino: "反", aplicar: fan },
  { id: "dui", nombre: "opuesto", chino: "对", aplicar: dui },
  { id: "fanDui", nombre: "volteo + opuesto", chino: "反对", aplicar: fanDui },
];

/** Órbita de un hexagrama bajo V₄ (valores únicos, ordenados). */
export function orbita(v: number): number[] {
  return Array.from(new Set([v, fan(v), dui(v), fanDui(v)])).sort((a, b) => a - b);
}

export interface Orbita {
  rep: number; // representante canónico (mínimo)
  miembros: number[];
  tam: number;
}

/** Las órbitas de V₄, agrupadas por representante. */
export const ORBITAS: Orbita[] = (() => {
  const vistos = new Set<number>();
  const out: Orbita[] = [];
  for (let v = 0; v < 64; v++) {
    if (vistos.has(v)) continue;
    const m = orbita(v);
    m.forEach((x) => vistos.add(x));
    out.push({ rep: m[0], miembros: m, tam: m.length });
  }
  return out.sort((a, b) => a.tam - b.tam || a.rep - b.rep);
})();

export const CONTEO_TAMANOS: Record<number, number> = ORBITAS.reduce(
  (acc, o) => ((acc[o.tam] = (acc[o.tam] ?? 0) + 1), acc),
  {} as Record<number, number>,
);

/** Palíndromos: fan(v) = v (líneas 1-6, 2-5, 3-4 iguales). Hay 8. */
export const PALINDROMOS: number[] = Array.from({ length: 64 }, (_, v) => v).filter(
  (v) => fan(v) === v,
);

/** Antipalíndromos: fan(v) = dui(v). Hay 8. */
export const ANTIPALINDROMOS: number[] = Array.from({ length: 64 }, (_, v) => v).filter(
  (v) => fan(v) === dui(v),
);

/** Los 4 pares especiales del Rey Wen que usan dui en vez de fan. */
export const PARES_ESPECIALES: [number, number][] = [
  [1, 2],
  [27, 28],
  [29, 30],
  [61, 62],
];

/** ¿Los 8 palíndromos coinciden con los hexagramas de esos 4 pares? */
export function palindromosSonParesEspeciales(): boolean {
  const desdeReyWen = new Set(
    PARES_ESPECIALES.flat().map((kw) => HEX_BY_KW[kw].v),
  );
  const desdePalindromos = new Set(PALINDROMOS);
  if (desdeReyWen.size !== desdePalindromos.size) return false;
  for (const v of desdePalindromos) if (!desdeReyWen.has(v)) return false;
  return true;
}

// === Dinámica del hexagrama nuclear ===

export interface DinamicaNuclear {
  ciclos: number[][]; // atractores (ciclos del mapa)
  pasos: number[]; // pasos hasta el atractor, por valor
  atractor: number[]; // índice de ciclo por valor
  cuencas: number[]; // tamaño de cada cuenca de atracción
  maxPasos: number;
}

export function dinamicaNuclear(): DinamicaNuclear {
  const nxt = (v: number) => huGua(v);
  const enCiclo = new Array(64).fill(false);
  for (let v = 0; v < 64; v++) {
    let slow = v;
    let fast = v;
    do {
      slow = nxt(slow);
      fast = nxt(nxt(fast));
    } while (slow !== fast);
    let c = slow;
    do {
      enCiclo[c] = true;
      c = nxt(c);
    } while (c !== slow);
  }
  const ciclos: number[][] = [];
  const idCiclo = new Array(64).fill(-1);
  for (let v = 0; v < 64; v++) {
    if (enCiclo[v] && idCiclo[v] === -1) {
      const cyc: number[] = [];
      let c = v;
      do {
        cyc.push(c);
        idCiclo[c] = ciclos.length;
        c = nxt(c);
      } while (c !== v);
      ciclos.push(cyc);
    }
  }
  const pasos = new Array(64).fill(0);
  const atractor = new Array(64).fill(-1);
  for (let v = 0; v < 64; v++) {
    let c = v;
    let s = 0;
    while (!enCiclo[c]) {
      c = nxt(c);
      s++;
    }
    pasos[v] = s;
    atractor[v] = idCiclo[c];
  }
  const cuencas = ciclos.map((_, i) => atractor.filter((a) => a === i).length);
  const maxPasos = Math.max(...pasos);
  return { ciclos, pasos, atractor, cuencas, maxPasos };
}

export const NUCLEAR = dinamicaNuclear();

// === Espectro del hipercubo Q6 ===

function comb(n: number, k: number): number {
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

/** Autovalores del grafo Q6: 6−2k con multiplicidad C(6,k). */
export const ESPECTRO: { valor: number; mult: number }[] = Array.from(
  { length: 7 },
  (_, k) => ({ valor: 6 - 2 * k, mult: comb(6, k) }),
);

if (process.env.NODE_ENV !== "production") {
  if (ORBITAS.length !== 20)
    console.error("[simetrias] se esperaban 20 órbitas, hay", ORBITAS.length);
  if (!palindromosSonParesEspeciales())
    console.error("[simetrias] los palíndromos no coinciden con los pares especiales");
  const totalMult = ESPECTRO.reduce((s, e) => s + e.mult, 0);
  if (totalMult !== 64) console.error("[simetrias] el espectro no suma 64");

  // Hecho completo de la dinámica nuclear (redacción unificada del sitio):
  // 3 atractores: dos puntos fijos y un ciclo de 2 (4 hexagramas atractores).
  // Atractores = {Qian}, {Kun} y {Ji Ji, Wei Ji}; cuencas 16, 16 y 32; caída máxima 2.
  const QIAN = 63;
  const KUN = 0;
  const JIJI = 42;
  const WEIJI = 21;
  const cuencaPorClave = new Map<string, number>();
  NUCLEAR.ciclos.forEach((c, i) => {
    const clave = [...c].sort((a, b) => a - b).join(",");
    cuencaPorClave.set(clave, NUCLEAR.cuencas[i]);
  });
  const esperado: [string, number][] = [
    [String(QIAN), 16],
    [String(KUN), 16],
    [[JIJI, WEIJI].sort((a, b) => a - b).join(","), 32],
  ];
  if (NUCLEAR.ciclos.length !== 3)
    console.error("[simetrias] atractores esperados: 3, hay", NUCLEAR.ciclos.length);
  if (NUCLEAR.ciclos.reduce((s, c) => s + c.length, 0) !== 4)
    console.error("[simetrias] hexagramas atractores esperados: 4");
  for (const [clave, cuenca] of esperado) {
    if (cuencaPorClave.get(clave) !== cuenca)
      console.error(`[simetrias] atractor {${clave}} con cuenca ${cuenca} no encontrado`);
  }
  if (NUCLEAR.maxPasos !== 2)
    console.error("[simetrias] profundidad máxima esperada 2, hay", NUCLEAR.maxPasos);
}
