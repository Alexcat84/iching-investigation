/**
 * Comparador de métodos de sorteo (C3). Reusa web/lib/oraculo (mismo motor de
 * probabilidades que la cadena de Markov de C1).
 *
 * Tres métodos, cada uno una distribución sobre los cuatro resultados de línea
 * (6 yin viejo, 7 yang joven, 8 yin joven, 9 yang viejo):
 *   - monedas: 2/6/6/2 sobre 16.
 *   - milenrama (49 varillas): 3/7/5/1 sobre 16.
 *   - 16 fichas: una simplificación moderna con 16 fichas en proporción 3/7/5/1;
 *     por construcción reproduce exactamente la distribución de la milenrama.
 *
 * El punto: monedas y milenrama NO son intercambiables; fichas y milenrama sí.
 */
import { DIECISEISAVOS, type Estado } from "./oraculo";

/** Composición de las 16 fichas (fichas por resultado); reproduce la milenrama. */
export const FICHAS_16: Record<Estado, number> = { 9: 3, 8: 7, 7: 5, 6: 1 };

export interface MetodoSorteo {
  id: string;
  nombre: string;
  cita?: string;
  dieciseisavos: Record<Estado, number>;
  color: string;
}

export const METODOS_SORTEO: MetodoSorteo[] = [
  {
    id: "monedas",
    nombre: "Tres monedas",
    dieciseisavos: DIECISEISAVOS.monedas,
    color: "#5b8fd9",
    cita: "cara = 3, cruz = 2; suma de tres monedas.",
  },
  {
    id: "milenrama",
    nombre: "Milenrama (49 varillas)",
    dieciseisavos: DIECISEISAVOS.milenrama,
    color: "#cf7a2e",
    cita: "el método antiguo; ver el experimento del ritual de las 49 varillas.",
  },
  {
    id: "fichas",
    nombre: "16 fichas",
    dieciseisavos: FICHAS_16,
    color: "#5fae7f",
    cita: "simplificación moderna: 16 fichas en proporción 3/7/5/1; reproduce por construcción la milenrama.",
  },
];

export const ESTADOS: Estado[] = [9, 8, 7, 6];

/** ¿La distribución de las 16 fichas es idéntica a la de la milenrama? */
export function fichasIgualMilenrama(): boolean {
  return ESTADOS.every((e) => FICHAS_16[e] === DIECISEISAVOS.milenrama[e]);
}

/** Muestrea un resultado de línea (6/7/8/9) según los dieciseisavos del método. */
export function muestrear(
  d: Record<Estado, number>,
  rng: () => number = Math.random,
): Estado {
  const r = rng() * 16;
  let acc = 0;
  for (const e of ESTADOS) {
    acc += d[e];
    if (r < acc) return e;
  }
  return 6;
}

export interface Simulacion {
  n: number;
  counts: Record<Estado, number>;
  chi2: number;
}

/** Simula n líneas y devuelve el conteo y el chi-cuadrado frente a la teoría. */
export function simular(
  d: Record<Estado, number>,
  n: number,
  rng: () => number = Math.random,
): Simulacion {
  const counts: Record<Estado, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
  for (let i = 0; i < n; i++) counts[muestrear(d, rng)]++;
  let chi2 = 0;
  for (const e of ESTADOS) {
    const esperado = (n * d[e]) / 16;
    chi2 += (counts[e] - esperado) ** 2 / esperado;
  }
  return { n, counts, chi2 };
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (!fichasIgualMilenrama())
    console.error("[sorteo] las 16 fichas no reproducen la milenrama");
  for (const m of METODOS_SORTEO) {
    const total = ESTADOS.reduce((s, e) => s + m.dieciseisavos[e], 0);
    if (total !== 16) console.error(`[sorteo] ${m.id} no suma 16/16`);
  }
  // Monedas y milenrama son distintas.
  if (ESTADOS.every((e) => DIECISEISAVOS.monedas[e] === DIECISEISAVOS.milenrama[e]))
    console.error("[sorteo] monedas y milenrama no deberían ser iguales");
}
