/**
 * El retículo booleano B6: el orden parcial de los 64 hexagramas por dominancia
 * bit a bit. x está por debajo de y si toda línea yang de x también es yang en y.
 *
 * Precisión importante: el orden NO es "tiene más líneas yang" (eso es solo el
 * rango o nivel). Es la dominancia línea a línea; se sube encendiendo una línea
 * por vez. Las relaciones de cobertura son exactamente las 192 aristas del
 * hipercubo Q6, ahora orientadas hacia arriba.
 */
import { EDGES, lineBit } from "./iching";

/** ¿x está por debajo (o es igual) de y en el orden de dominancia? */
export function domina(x: number, y: number): boolean {
  return (x & y) === x;
}

export function nivel(v: number): number {
  let n = 0;
  for (let k = 1; k <= 6; k++) if (v & lineBit(k)) n++;
  return n;
}

/** Miembros de cada nivel 0..6, ordenados por valor. */
export const NIVELES: number[][] = (() => {
  const out: number[][] = Array.from({ length: 7 }, () => []);
  for (let v = 0; v < 64; v++) out[nivel(v)].push(v);
  return out;
})();

export const TAMANOS_NIVEL = NIVELES.map((n) => n.length);

/** Relaciones de cobertura (x debajo de y, difieren en una línea): orientadas hacia arriba. */
export const COBERTURAS: { abajo: number; arriba: number; line: number }[] = (() => {
  const out: { abajo: number; arriba: number; line: number }[] = [];
  for (const e of EDGES) {
    const [abajo, arriba] = nivel(e.a) < nivel(e.b) ? [e.a, e.b] : [e.b, e.a];
    out.push({ abajo, arriba, line: e.line });
  }
  return out;
})();

/** Cono superior de v: todo lo que v puede llegar a ser encendiendo líneas yang. */
export function conoSuperior(v: number): number[] {
  const out: number[] = [];
  for (let y = 0; y < 64; y++) if (domina(v, y)) out.push(y);
  return out;
}

/** Cono inferior de v: todo lo que puede haber sido antes de encender sus líneas. */
export function conoInferior(v: number): number[] {
  const out: number[] = [];
  for (let x = 0; x < 64; x++) if (domina(x, v)) out.push(x);
  return out;
}

/** Cadenas maximales de Kun (0) a Qian (63): deben ser 6! = 720. */
export const CADENAS_MAXIMALES: number = (() => {
  const ways = new Array(64).fill(0);
  ways[0] = 1;
  const orden = Array.from({ length: 64 }, (_, v) => v).sort((a, b) => nivel(a) - nivel(b));
  for (const v of orden) {
    if (v === 0) continue;
    let total = 0;
    for (let k = 1; k <= 6; k++) {
      if (v & lineBit(k)) total += ways[v ^ lineBit(k)];
    }
    ways[v] = total;
  }
  return ways[63];
})();

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (COBERTURAS.length !== 192)
    console.error("[reticulo] deben ser 192 coberturas, hay", COBERTURAS.length);
  const esperados = [1, 6, 15, 20, 15, 6, 1];
  if (TAMANOS_NIVEL.join(",") !== esperados.join(","))
    console.error("[reticulo] tamaños de nivel inesperados:", TAMANOS_NIVEL);
  if (CADENAS_MAXIMALES !== 720)
    console.error("[reticulo] cadenas maximales esperadas 720, hay", CADENAS_MAXIMALES);
  // Toda cobertura es una dominancia estricta que sube exactamente un nivel.
  for (const c of COBERTURAS) {
    if (!domina(c.abajo, c.arriba) || nivel(c.arriba) - nivel(c.abajo) !== 1) {
      console.error("[reticulo] cobertura inválida", c);
      break;
    }
  }
  // Tamaños de cono: 2^k hacia abajo y 2^(6-k) hacia arriba.
  const v = 0b101010;
  if (conoSuperior(v).length !== 2 ** (6 - nivel(v)) || conoInferior(v).length !== 2 ** nivel(v))
    console.error("[reticulo] tamaños de cono inesperados");
}
