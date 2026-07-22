/**
 * Los dos cielos: el bagua del Cielo Anterior (先天, Fu Xi) y el del Cielo
 * Posterior (後天, Rey Wen) como dos disposiciones de los 8 trigramas en círculo.
 *
 * Convención del sitio para el valor 0 a 7 de un trigrama: sus 3 líneas leídas de
 * abajo hacia arriba, línea inferior = bit más significativo (Qian 111 = 7, Kun 000 = 0).
 *
 * Posiciones del círculo: 8 direcciones, índice 0 arriba y sentido horario. Como en
 * los mapas chinos tradicionales, el sur va arriba y el este a la izquierda.
 */
import { TRI, TRI_BY_VALUE, type TrigramName } from "./iching";
import { estructura } from "./permutacion";

export const POSICIONES_BRUJULA = ["S", "SO", "O", "NO", "N", "NE", "E", "SE"] as const;
/** Índice de posición en pantalla (0 arriba, horario) para cada dirección de brújula. */
const EN_PANTALLA: Record<(typeof POSICIONES_BRUJULA)[number], number> = {
  S: 0, // sur arriba
  O: 2, // oeste a la derecha
  N: 4, // norte abajo
  E: 6, // este a la izquierda
  SO: 1,
  NO: 3,
  NE: 5,
  SE: 7,
};

function valorDe(t: TrigramName): number {
  return parseInt(TRI[t], 2);
}

/** Disposición como arreglo de valores de trigrama por posición de pantalla 0..7. */
function disponer(porBrujula: [(typeof POSICIONES_BRUJULA)[number], TrigramName][]): number[] {
  const out = new Array(8).fill(-1);
  for (const [dir, tri] of porBrujula) out[EN_PANTALLA[dir]] = valorDe(tri);
  return out;
}

/** Cielo Anterior (Fu Xi): Qian al sur, Kun al norte, Li al este, Kan al oeste. */
export const ANTERIOR: number[] = disponer([
  ["S", "Qian"],
  ["SE", "Dui"],
  ["E", "Li"],
  ["NE", "Zhen"],
  ["SO", "Xun"],
  ["O", "Kan"],
  ["NO", "Gen"],
  ["N", "Kun"],
]);

/** Cielo Posterior (Rey Wen): Li al sur, Kan al norte, Zhen al este, Dui al oeste. */
export const POSTERIOR: number[] = disponer([
  ["S", "Li"],
  ["SO", "Kun"],
  ["O", "Dui"],
  ["NO", "Qian"],
  ["N", "Kan"],
  ["NE", "Gen"],
  ["E", "Zhen"],
  ["SE", "Xun"],
]);

/** Los 4 ejes (pares de posiciones opuestas por el centro). */
export const EJES: [number, number][] = [
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

/** ¿En cuántos ejes los trigramas enfrentados son complementos binarios (suman 7)? */
export function ejesComplementarios(disposicion: number[]): [number, number][] {
  return EJES.filter(([a, b]) => disposicion[a] + disposicion[b] === 7);
}

/**
 * La permutación τ que lleva del Anterior al Posterior: τ(valor que ocupa la
 * posición p en el Anterior) = valor que ocupa esa misma posición en el Posterior.
 */
export const TAU: number[] = (() => {
  const tau = new Array(8).fill(-1);
  for (let p = 0; p < 8; p++) tau[ANTERIOR[p]] = POSTERIOR[p];
  return tau;
})();

export const ESTRUCTURA_TAU = estructura(TAU);
export const INVERSIONES_MAX_8 = (8 * 7) / 2;

export function nombreTrigrama(v: number): TrigramName {
  return TRI_BY_VALUE[v];
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  const biyeccion = (a: number[]) => [...a].sort((x, y) => x - y).join(",") === "0,1,2,3,4,5,6,7";
  if (!biyeccion(ANTERIOR) || !biyeccion(POSTERIOR))
    console.error("[bagua] las disposiciones no son biyecciones 0..7");
  if (ejesComplementarios(ANTERIOR).length !== 4)
    console.error("[bagua] el Cielo Anterior debe tener los 4 ejes complementarios");
  const post = ejesComplementarios(POSTERIOR);
  if (post.length !== 1)
    console.error("[bagua] el Cielo Posterior debe conservar exactamente 1 eje");
  else {
    const [a, b] = post[0];
    const par = [POSTERIOR[a], POSTERIOR[b]].sort((x, y) => x - y).join(",");
    if (par !== "2,5") console.error("[bagua] el eje conservado debe ser Li y Kan");
  }
  const longs = [...ESTRUCTURA_TAU.longitudes].sort((a, b) => b - a).join(",");
  if (longs !== "4,4") console.error("[bagua] τ debe ser dos ciclos de 4, es", longs);
}
