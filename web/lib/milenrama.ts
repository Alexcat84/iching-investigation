/**
 * El ritual de las 49 varillas: derivación exacta de las probabilidades de la
 * milenrama que web/lib/oraculo.ts usa como dato (1, 3, 5 y 7 dieciseisavos).
 *
 * Procedimiento por línea (3 operaciones sobre un manojo que empieza en 49):
 *   1. Se divide el manojo en dos montones y se toma 1 varilla del derecho.
 *   2. Se cuenta cada montón de 4 en 4; el resto de cada uno (1 a 4) se aparta.
 *   3. Quedan pile - (1 + rL + rR) varillas para la siguiente operación.
 * Tras 3 operaciones, quedan 24, 28, 32 o 36 varillas: entre 4 dan 6, 7, 8 o 9.
 *
 * SUPUESTO DEL MODELO (idealizado, y declarado en la página): en cada división,
 * el resto del montón izquierdo al contar de 4 en 4 (1, 2, 3 o 4) es equiprobable.
 * Con ese supuesto salen exactamente 1/3/5/7 sobre 16; con otros supuestos de
 * partición salen otros números.
 */
import { DIECISEISAVOS, type Estado } from "./oraculo";

/** Resto del montón derecho, forzado por el tamaño del manojo y el resto izquierdo. */
export function coResto(pile: number, rL: number): number {
  return ((((pile - 2 - rL) % 4) + 4) % 4) + 1;
}

/** Varillas que se apartan en una operación: 1 + resto izquierdo + resto derecho. */
export function quitadas(pile: number, rL: number): number {
  return 1 + rL + coResto(pile, rL);
}

export interface RamaExacta {
  /** Varillas apartadas en cada una de las 3 operaciones. */
  ops: [number, number, number];
  /** Varillas restantes al final (24, 28, 32 o 36). */
  restantes: number;
  /** Valor de la línea: restantes / 4. */
  valor: Estado;
  /** Probabilidad exacta en sesentaicuatroavos (casos de 4^3 con restos uniformes). */
  num64: number;
}

/** Las 8 ramas del árbol (agrupando los 64 casos de restos por varillas apartadas). */
export const RAMAS: RamaExacta[] = (() => {
  const acc = new Map<string, RamaExacta>();
  for (let r1 = 1; r1 <= 4; r1++) {
    for (let r2 = 1; r2 <= 4; r2++) {
      for (let r3 = 1; r3 <= 4; r3++) {
        let pile = 49;
        const q1 = quitadas(pile, r1);
        pile -= q1;
        const q2 = quitadas(pile, r2);
        pile -= q2;
        const q3 = quitadas(pile, r3);
        pile -= q3;
        const clave = `${q1},${q2},${q3}`;
        const previa = acc.get(clave);
        if (previa) {
          previa.num64 += 1;
        } else {
          acc.set(clave, {
            ops: [q1, q2, q3],
            restantes: pile,
            valor: (pile / 4) as Estado,
            num64: 1,
          });
        }
      }
    }
  }
  return [...acc.values()].sort(
    (a, b) => a.ops[0] - b.ops[0] || a.ops[1] - b.ops[1] || a.ops[2] - b.ops[2],
  );
})();

/** Distribución derivada, en dieciseisavos por estado (6, 7, 8, 9). */
export const DERIVADA: Record<Estado, number> = (() => {
  const d: Record<Estado, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const r of RAMAS) d[r.valor] += r.num64;
  // num64 / 64 = (num64 / 4) / 16: pasar a dieciseisavos.
  (Object.keys(d) as unknown as Estado[]).forEach((e) => (d[e] = d[e] / 4));
  return d;
})();

/** ¿La derivación coincide con la tabla que usa el experimento de probabilidades? */
export function coincideConOraculo(): boolean {
  return ([6, 7, 8, 9] as Estado[]).every(
    (e) => DERIVADA[e] === DIECISEISAVOS.milenrama[e],
  );
}

// === Muestreo bajo el supuesto del modelo (para el recorrido y la simulación) ===

export interface Operacion {
  pileInicial: number;
  izquierda: number;
  derecha: number;
  rL: number;
  rR: number;
  apartadas: number;
  pileFinal: number;
}

/** Tamaño del montón izquierdo compatible con un resto rL (elección uniforme). */
export function elegirIzquierda(
  pile: number,
  rL: number,
  rng: () => number = Math.random,
): number {
  const candidatos: number[] = [];
  for (let s = 5; s <= pile - 6; s++) {
    if (((s - 1) % 4) + 1 === rL) candidatos.push(s);
  }
  return candidatos[Math.floor(rng() * candidatos.length)];
}

/** Ejecuta una operación bajo el supuesto del modelo (resto izquierdo uniforme). */
export function operar(pile: number, rng: () => number = Math.random): Operacion {
  const rL = 1 + Math.floor(rng() * 4);
  const izquierda = elegirIzquierda(pile, rL, rng);
  const derecha = pile - izquierda;
  const rR = coResto(pile, rL);
  const apartadas = 1 + rL + rR;
  return { pileInicial: pile, izquierda, derecha, rL, rR, apartadas, pileFinal: pile - apartadas };
}

/** Genera una línea completa (3 operaciones) y devuelve su valor 6 a 9. */
export function generarLinea(rng: () => number = Math.random): {
  ops: Operacion[];
  valor: Estado;
} {
  const ops: Operacion[] = [];
  let pile = 49;
  for (let i = 0; i < 3; i++) {
    const op = operar(pile, rng);
    ops.push(op);
    pile = op.pileFinal;
  }
  return { ops, valor: (pile / 4) as Estado };
}

// Aserciones en desarrollo: la derivación reproduce exactamente la tabla del oráculo.
if (process.env.NODE_ENV !== "production") {
  if (RAMAS.length !== 8) console.error("[milenrama] se esperaban 8 ramas");
  if (!coincideConOraculo())
    console.error("[milenrama] la derivación no coincide con DIECISEISAVOS.milenrama");
  const restantes = new Set(RAMAS.map((r) => r.restantes));
  if (![...restantes].every((x) => [24, 28, 32, 36].includes(x)))
    console.error("[milenrama] restos finales inesperados");
}
