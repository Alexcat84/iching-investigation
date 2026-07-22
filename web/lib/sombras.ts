/**
 * Las sombras del 6-cubo: tres proyecciones del hexeracto Q6.
 *
 *  1. Petrie: cada línea k del hexagrama es una dirección del plano separada 30
 *     grados de la siguiente; el vértice es la suma de +-1 por cada dirección.
 *     El polígono exterior (el polígono de Petrie del 6-cubo) tiene 12 vértices.
 *  2. Cubo de cubos: Q6 = Q3 x Q3. El trigrama superior elige la esquina de un
 *     cubo grande; el inferior, la esquina de un cubo pequeño dentro de ella.
 *     Las 192 aristas se parten 96 (dentro de los cubos pequeños) + 96 (entre ellos).
 *  3. Niveles de yang: anillos concéntricos por número de líneas yang, con
 *     tamaños 1, 6, 15, 20, 15, 6 y 1 (los C(6,k) del espectro).
 */
import { EDGES, lineBit } from "./iching";

// ————— 1. Proyección de Petrie —————

/** Dirección de la línea k (1..6): ángulos separados 30 grados, línea 1 hacia arriba. */
function direccion(k: number): [number, number] {
  const ang = -Math.PI / 2 + ((k - 1) * Math.PI) / 6;
  return [Math.cos(ang), Math.sin(ang)];
}

/** Proyección de Petrie del vértice v (sin escalar). */
export function petrie(v: number): [number, number] {
  let x = 0;
  let y = 0;
  for (let k = 1; k <= 6; k++) {
    const s = v & lineBit(k) ? 1 : -1;
    const [dx, dy] = direccion(k);
    x += s * dx;
    y += s * dy;
  }
  return [x, y];
}

export const PETRIE_PUNTOS: [number, number][] = Array.from({ length: 64 }, (_, v) =>
  petrie(v),
);

/** Radio máximo y cuántos vértices lo alcanzan (el polígono de Petrie: deben ser 12). */
export const PETRIE_EXTERIOR: { radio: number; cuantos: number } = (() => {
  const radios = PETRIE_PUNTOS.map(([x, y]) => Math.hypot(x, y));
  const radio = Math.max(...radios);
  const cuantos = radios.filter((r) => Math.abs(r - radio) < 1e-9).length;
  return { radio, cuantos };
})();

// ————— 2. Cubo de cubos (Q3 x Q3) —————

/** Coordenadas 3D (+-1) de un trigrama 0..7: bit alto = x, medio = y, bajo = z. */
function esquina(t: number): [number, number, number] {
  return [t & 4 ? 1 : -1, t & 2 ? 1 : -1, t & 1 ? 1 : -1];
}

/** Proyección isométrica simple de un punto 3D. */
function iso(x: number, y: number, z: number): [number, number] {
  const c = Math.cos(Math.PI / 6);
  const s = Math.sin(Math.PI / 6);
  return [(x - y) * c, (x + y) * s - z];
}

/** Posición 2D del vértice v en el cubo de cubos (sin escalar). */
export function cuboDeCubos(v: number): [number, number] {
  const superior = v & 7; // esquina del cubo grande
  const inferior = v >> 3; // esquina del cubo pequeño
  const [gx, gy, gz] = esquina(superior);
  const [px, py, pz] = esquina(inferior);
  const G = 1;
  const P = 0.30;
  const [X, Y] = iso(gx * G + px * P, gy * G + py * P, gz * G + pz * P);
  return [X, Y];
}

/** Partición de las 192 aristas: dentro de un cubo pequeño (líneas 1 a 3) o entre cubos (4 a 6). */
export const PARTICION_ARISTAS: { intra: number; entre: number } = (() => {
  let intra = 0;
  let entre = 0;
  for (const e of EDGES) {
    if (e.line <= 3) intra++;
    else entre++;
  }
  return { intra, entre };
})();

// ————— 3. Niveles de líneas yang —————

export function nivelYang(v: number): number {
  let n = 0;
  for (let k = 1; k <= 6; k++) if (v & lineBit(k)) n++;
  return n;
}

/** Miembros de cada nivel 0..6, ordenados por valor. */
export const NIVELES: number[][] = (() => {
  const out: number[][] = Array.from({ length: 7 }, () => []);
  for (let v = 0; v < 64; v++) out[nivelYang(v)].push(v);
  return out;
})();

export const TAMANOS_NIVEL = NIVELES.map((n) => n.length);

/** Posición 2D del vértice v en la disposición por niveles (sin escalar). */
export function porNiveles(v: number): [number, number] {
  const nivel = nivelYang(v);
  if (nivel === 0) return [0, 0]; // Kun en el centro
  const miembros = NIVELES[nivel];
  const i = miembros.indexOf(v);
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / miembros.length;
  const r = nivel;
  return [r * Math.cos(ang), r * Math.sin(ang)];
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (EDGES.length !== 192) console.error("[sombras] deben ser 192 aristas");
  if (PETRIE_EXTERIOR.cuantos !== 12)
    console.error(
      "[sombras] el polígono de Petrie del 6-cubo debe tener 12 vértices, hay",
      PETRIE_EXTERIOR.cuantos,
    );
  if (PARTICION_ARISTAS.intra !== 96 || PARTICION_ARISTAS.entre !== 96)
    console.error("[sombras] la partición Q3xQ3 debe ser 96 + 96");
  const esperados = [1, 6, 15, 20, 15, 6, 1];
  if (TAMANOS_NIVEL.join(",") !== esperados.join(","))
    console.error("[sombras] tamaños de nivel inesperados:", TAMANOS_NIVEL);
}
