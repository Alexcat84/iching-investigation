/**
 * El cuadrado y el círculo de Shao Yong — el diagrama "Xiantian" (先天).
 *
 * Shao Yong (siglo XI) dispuso los 64 hexagramas a la vez en un cuadrado 8×8 y en un
 * círculo, ambos en orden binario Fu Xi. Ese diagrama, enviado por Bouvet a Leibniz
 * hacia 1701, es el que Leibniz reconoció como aritmética binaria: leer el cuadrado en
 * orden es contar de 0 a 63.
 *
 * Cuadrado: columna = trigrama inferior (0=Kun … 7=Qian, de izquierda a derecha);
 * fila = trigrama superior (7=Qian arriba … 0=Kun abajo). Así Kun (0) queda abajo a la
 * izquierda y Qian (63) arriba a la derecha, y v = (inferior << 3) | superior.
 */

/** Valor 0–63 en la celda (fila desde arriba 0–7, columna 0–7). */
export function valorCelda(filaDesdeArriba: number, columna: number): number {
  const inferior = columna; // 0..7 izquierda→derecha
  const superior = 7 - filaDesdeArriba; // abajo→arriba creciente
  return (inferior << 3) | superior;
}

/** Todas las celdas del cuadrado, fila por fila desde arriba. */
export const CUADRADO: number[][] = Array.from({ length: 8 }, (_, fila) =>
  Array.from({ length: 8 }, (_, col) => valorCelda(fila, col)),
);

/** El "camino de lectura": el orden 0→63 recorrido sobre el cuadrado. */
export interface CeldaPos {
  v: number;
  fila: number;
  col: number;
}
export const CAMINO_LECTURA: CeldaPos[] = (() => {
  const pos: Record<number, { fila: number; col: number }> = {};
  for (let f = 0; f < 8; f++)
    for (let c = 0; c < 8; c++) pos[valorCelda(f, c)] = { fila: f, col: c };
  return Array.from({ length: 64 }, (_, v) => ({ v, ...pos[v] }));
})();

/** Verifica que las 64 celdas del cuadrado son exactamente los enteros 0–63. */
export function verificarCuadrado(): boolean {
  const vals = new Set(CUADRADO.flat());
  return vals.size === 64;
}

// ————————————————————— El círculo —————————————————————

/** Ángulo (radianes) de un valor en el círculo Fu Xi (0 arriba, sentido horario). */
export function anguloCirculo(v: number): number {
  return -Math.PI / 2 + (v * 2 * Math.PI) / 64;
}

/**
 * Simetrías del círculo (orden Fu Xi 0–63):
 *   dui (opuesto, 63−v): reflexión sobre el eje vertical.
 *   antípoda (índice + 32, = voltear la línea inferior): el punto diametralmente opuesto.
 */
export function simetriasCirculo(v: number): { dui: number; antipoda: number } {
  return { dui: 63 - v, antipoda: v ^ 32 };
}
