/**
 * Trayectoria personal: el historial de consultas como un camino por Q6.
 *
 * Cada consulta es un estado (un hexagrama). La sucesión de consultas es una ruta
 * por el hipercubo: mide su longitud (distancia de Hamming acumulada), sus regiones
 * recurrentes y en qué palacio de Jing Fang o familia de trigramas transcurre.
 *
 * Los datos viven solo en el navegador (localStorage): son personales.
 */
import {
  hamming,
  hex,
  TRI_BY_VALUE,
  TRIGRAM_INFO,
  trigramas,
  type TrigramName,
} from "./iching";
import { CABEZAS, CLASIFICACION, POSICIONES } from "./palacios";

export interface Consulta {
  id: string;
  ts: number; // epoch ms
  v: number; // hexagrama presente, 0–63
  nota?: string;
}

export const STORAGE_KEY = "iching:trayectoria:v1";

export interface Conteo<T> {
  clave: T;
  n: number;
}

export interface Estadisticas {
  n: number;
  saltos: number[]; // distancias de Hamming entre consultas consecutivas
  distMedia: number;
  distTotal: number;
  saltoMax: number;
  masVisitados: Conteo<number>[]; // hexagramas por frecuencia
  porPalacio: Conteo<number>[]; // índice de palacio → frecuencia
  porTrigramaInferior: Conteo<TrigramName>[];
  porTrigramaSuperior: Conteo<TrigramName>[];
  palacioDominante: number | null;
}

function contar<T>(items: T[]): Conteo<T>[] {
  const m = new Map<T, number>();
  for (const it of items) m.set(it, (m.get(it) ?? 0) + 1);
  return [...m.entries()]
    .map(([clave, n]) => ({ clave, n }))
    .sort((a, b) => b.n - a.n);
}

export function estadisticas(consultas: Consulta[]): Estadisticas {
  const n = consultas.length;
  const saltos: number[] = [];
  for (let i = 1; i < n; i++) saltos.push(hamming(consultas[i - 1].v, consultas[i].v));
  const distTotal = saltos.reduce((a, b) => a + b, 0);

  const masVisitados = contar(consultas.map((c) => c.v));
  const porPalacio = contar(consultas.map((c) => CLASIFICACION[c.v].palacio));
  const porTrigramaInferior = contar(
    consultas.map((c) => TRI_BY_VALUE[trigramas(c.v)[0]]),
  );
  const porTrigramaSuperior = contar(
    consultas.map((c) => TRI_BY_VALUE[trigramas(c.v)[1]]),
  );

  return {
    n,
    saltos,
    distMedia: saltos.length ? distTotal / saltos.length : 0,
    distTotal,
    saltoMax: saltos.length ? Math.max(...saltos) : 0,
    masVisitados,
    porPalacio,
    porTrigramaInferior,
    porTrigramaSuperior,
    palacioDominante: porPalacio.length ? porPalacio[0].clave : null,
  };
}

/** Nombre legible de un palacio por su índice (0–7). */
export function nombrePalacio(i: number): { cabeza: TrigramName; es: string; imagen: string } {
  const cabeza = CABEZAS[i];
  const info = TRIGRAM_INFO[cabeza];
  return { cabeza, es: info.es, imagen: info.imagen };
}

/** Etiqueta de la posición dentro del palacio (para el detalle de una consulta). */
export function posicionPalacio(v: number): string {
  const { posicion } = CLASIFICACION[v];
  return POSICIONES[posicion].etiqueta;
}

/** Índice del palacio (0–7) al que pertenece un hexagrama. */
export function palacioIndice(v: number): number {
  return CLASIFICACION[v].palacio;
}

// === Generador de trayectoria de ejemplo ===

/** Echa seis monedas y devuelve el hexagrama presente (P(yang) = 1/2 por línea). */
export function echarPresente(rng: () => number = Math.random): number {
  let v = 0;
  for (let k = 1; k <= 6; k++) if (rng() < 0.5) v |= 1 << (6 - k);
  return v;
}

/**
 * Genera una trayectoria de ejemplo: un paseo por Q6 que a veces salta lejos
 * (una consulta nueva) y a veces se queda cerca (vuelve sobre lo mismo).
 * `ahora` es el timestamp base; se reparten las consultas hacia atrás en el tiempo.
 */
export function generarEjemplo(
  cuantas: number,
  ahora: number,
  rng: () => number = Math.random,
): Consulta[] {
  const out: Consulta[] = [];
  let v = echarPresente(rng);
  const DIA = 86_400_000;
  for (let i = 0; i < cuantas; i++) {
    out.push({
      id: `ej-${i}-${Math.floor(rng() * 1e9).toString(36)}`,
      ts: ahora - (cuantas - 1 - i) * (3 + Math.floor(rng() * 6)) * DIA,
      v,
    });
    // Siguiente estado: 60% deriva cercana (1–2 líneas), 40% salto amplio.
    if (rng() < 0.6) {
      const cambios = 1 + (rng() < 0.4 ? 1 : 0);
      for (let c = 0; c < cambios; c++) v ^= 1 << Math.floor(rng() * 6);
    } else {
      v = echarPresente(rng);
    }
  }
  return out;
}
