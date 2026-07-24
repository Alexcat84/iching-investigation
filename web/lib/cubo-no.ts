/**
 * El cubo dice que no (experimento 36): tres teoremas de imposibilidad sobre Q6.
 *
 * (a) Codigos correctores: la cota de empaquetado de esferas da a lo sumo 9 palabras a
 *     distancia 3 (7 no divide 64, no hay codigo perfecto); el maximo real es 8, probado
 *     por busqueda exhaustiva en la suite. Un codigo de 8 corrige cualquier error de una
 *     linea.
 * (b) Biparticion: los 32 hexagramas de yang par contra los 32 de impar; toda mutacion
 *     de una linea cruza de mitad, asi que Q6 es bipartito (sin ciclos impares).
 * (c) Collares de Polya: bajo rotacion de las 6 lineas hay 14 collares; con reflejo, 13
 *     pulseras. Formula de Polya = enumeracion directa.
 */

export function hamming(a: number, b: number): number {
  let x = a ^ b;
  let c = 0;
  while (x) {
    c += x & 1;
    x >>= 1;
  }
  return c;
}
const pc = (v: number): number => hamming(v, 0);

// === (a) Codigos correctores ===

/** Cota de empaquetado de esferas: A(6,3) <= 64 / (1 + 6). */
export const COTA_HAMMING = Math.floor(64 / 7); // 9
/** Maximo real (probado por busqueda exhaustiva en la suite). */
export const MAXIMO = 8;
/** Un codigo maximo de distancia minima 3 (8 palabras), congelado desde la busqueda. */
export const CODIGO_MAXIMO: number[] = [11, 12, 18, 21, 33, 38, 56, 63];

/** Distancia minima entre las palabras de un codigo. */
export function distanciaMinima(codigo: number[]): number {
  let d = 6;
  for (let i = 0; i < codigo.length; i++)
    for (let j = i + 1; j < codigo.length; j++) d = Math.min(d, hamming(codigo[i], codigo[j]));
  return d;
}

/** Para un hexagrama recibido, la palabra del codigo mas cercana (correccion de 1 error). */
export function corrige(v: number, codigo: number[] = CODIGO_MAXIMO): number {
  let best = codigo[0];
  let bd = 6;
  for (const c of codigo) {
    const d = hamming(v, c);
    if (d < bd) {
      bd = d;
      best = c;
    }
  }
  return best;
}

// === (b) Biparticion por paridad de yang ===

export const PAR_YANG: number[] = Array.from({ length: 64 }, (_, v) => v).filter((v) => (pc(v) & 1) === 0);
export const IMPAR_YANG: number[] = Array.from({ length: 64 }, (_, v) => v).filter((v) => (pc(v) & 1) === 1);

/** Cuantas de las 192 aristas cruzan de una mitad a la otra (debe ser todas). */
export function aristasCruzan(): number {
  let c = 0;
  for (let v = 0; v < 64; v++)
    for (let k = 1; k <= 6; k++) {
      const n = v ^ (1 << (6 - k));
      if (v < n && (pc(v) & 1) !== (pc(n) & 1)) c++;
    }
  return c;
}

// === (c) Collares y pulseras de Polya ===

function bits6(v: number): string {
  return v.toString(2).padStart(6, "0");
}
function rota(v: number, r: number): number {
  const s = bits6(v);
  return parseInt(s.slice(r) + s.slice(0, r), 2);
}
function refleja(v: number): number {
  return parseInt(bits6(v).split("").reverse().join(""), 2);
}

/** Numero de collares (orbitas bajo rotacion ciclica C6). */
export function collares(): number {
  let n = 0;
  for (let v = 0; v < 64; v++) {
    let min = v;
    for (let r = 0; r < 6; r++) min = Math.min(min, rota(v, r));
    if (min === v) n++;
  }
  return n;
}

/** Numero de pulseras (orbitas bajo el grupo diedrico D6, rotacion y reflejo). */
export function pulseras(): number {
  let n = 0;
  for (let v = 0; v < 64; v++) {
    let min = v;
    for (let r = 0; r < 6; r++) {
      const rr = rota(v, r);
      min = Math.min(min, rr, refleja(rr));
    }
    if (min === v) n++;
  }
  return n;
}

/** Formula de Polya para los collares: (1/6) suma phi(d) 2^(6/d). */
export const COLLARES_POLYA = (1 * 2 ** 6 + 1 * 2 ** 3 + 2 * 2 ** 2 + 2 * 2 ** 1) / 6;

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (COTA_HAMMING !== 9) console.error("[cubo-no] la cota no es 9");
  if (CODIGO_MAXIMO.length !== 8 || distanciaMinima(CODIGO_MAXIMO) !== 3)
    console.error("[cubo-no] el codigo no es un (6,8,3)");
  if (aristasCruzan() !== 192) console.error("[cubo-no] no todas las aristas cruzan");
  if (PAR_YANG.length !== 32 || IMPAR_YANG.length !== 32) console.error("[cubo-no] biparticion no 32/32");
  if (collares() !== 14 || COLLARES_POLYA !== 14) console.error("[cubo-no] collares != 14");
  if (pulseras() !== 13) console.error("[cubo-no] pulseras != 13");
}
