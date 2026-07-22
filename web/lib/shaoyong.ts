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

// === El círculo ===

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

// === Las 8 simetrías del cuadrado (grupo diédrico D4) ===
//
// Derivadas del layout REAL de este archivo: valorCelda(f, c) = (c << 3) | (7 - f),
// es decir, trigrama inferior = columna y trigrama superior = 7 - fila. Cada
// simetría geométrica del cuadrado induce una operación algebraica sobre los
// hexagramas; la correspondencia se verifica sobre los 64 en desarrollo y en Python.

/** Complemento de un trigrama (3 bits): 7 - t. */
const dui3 = (t: number): number => 7 - t;

/** Celda de origen de un hexagrama v: [fila desde arriba, columna]. */
export function celdaDe(v: number): [number, number] {
  const inferior = v >> 3;
  const superior = v & 7;
  return [7 - superior, inferior];
}

export interface SimetriaD4 {
  id: string;
  nombre: string;
  /** Descripción algebraica de la operación inducida sobre hexagramas. */
  operacion: string;
  /** Mapa geométrico de celdas: (fila, columna) → (fila, columna). */
  celda: (f: number, c: number) => [number, number];
  /** Operación algebraica inducida sobre el valor del hexagrama. */
  op: (v: number) => number;
}

export const SIMETRIAS_D4: SimetriaD4[] = [
  {
    id: "id",
    nombre: "identidad",
    operacion: "no cambia nada",
    celda: (f, c) => [f, c],
    op: (v) => v,
  },
  {
    id: "espejo-columnas",
    nombre: "espejo horizontal (columnas)",
    operacion: "complementa el trigrama inferior",
    celda: (f, c) => [f, 7 - c],
    op: (v) => (dui3(v >> 3) << 3) | (v & 7),
  },
  {
    id: "espejo-filas",
    nombre: "espejo vertical (filas)",
    operacion: "complementa el trigrama superior",
    celda: (f, c) => [7 - f, c],
    op: (v) => ((v >> 3) << 3) | dui3(v & 7),
  },
  {
    id: "rotacion-180",
    nombre: "rotación de 180 grados",
    operacion: "el opuesto total (dui): complementa las seis líneas",
    celda: (f, c) => [7 - f, 7 - c],
    op: (v) => 63 - v,
  },
  {
    id: "transposicion",
    nombre: "transposición (diagonal principal)",
    operacion: "intercambia los trigramas y complementa ambos",
    celda: (f, c) => [c, f],
    op: (v) => (dui3(v & 7) << 3) | dui3(v >> 3),
  },
  {
    id: "antitransposicion",
    nombre: "antitransposición (diagonal secundaria)",
    operacion: "intercambia los trigramas (fija los 8 hexagramas puros)",
    celda: (f, c) => [7 - c, 7 - f],
    op: (v) => ((v & 7) << 3) | (v >> 3),
  },
  {
    id: "rotacion-90",
    nombre: "rotación de 90 grados (horaria)",
    operacion: "inferior ← superior; superior ← complemento del inferior",
    celda: (f, c) => [c, 7 - f],
    op: (v) => ((v & 7) << 3) | dui3(v >> 3),
  },
  {
    id: "rotacion-270",
    nombre: "rotación de 270 grados",
    operacion: "inferior ← complemento del superior; superior ← inferior",
    celda: (f, c) => [7 - c, f],
    op: (v) => (dui3(v & 7) << 3) | (v >> 3),
  },
];

/** Puntos fijos de una simetría (hexagramas que no se mueven). */
export function fijosDe(s: SimetriaD4): number[] {
  const out: number[] = [];
  for (let v = 0; v < 64; v++) if (s.op(v) === v) out.push(v);
  return out;
}

/** Órbitas de los 64 hexagramas bajo D4 (por Burnside deben ser 10). */
export const ORBITAS_D4: number = (() => {
  const visto = new Array(64).fill(false);
  let n = 0;
  for (let v = 0; v < 64; v++) {
    if (visto[v]) continue;
    n++;
    const cola = [v];
    visto[v] = true;
    while (cola.length) {
      const x = cola.pop()!;
      for (const s of SIMETRIAS_D4) {
        const y = s.op(x);
        if (!visto[y]) {
          visto[y] = true;
          cola.push(y);
        }
      }
    }
  }
  return n;
})();

// Aserciones en desarrollo: la geometría induce exactamente el álgebra declarada.
if (process.env.NODE_ENV !== "production") {
  for (const s of SIMETRIAS_D4) {
    for (let v = 0; v < 64; v++) {
      const [f, c] = celdaDe(v);
      const [f2, c2] = s.celda(f, c);
      if (valorCelda(f2, c2) !== s.op(v)) {
        console.error(`[shaoyong] la simetría ${s.id} no coincide con su operación en v=${v}`);
        break;
      }
    }
  }
  const porBurnside =
    SIMETRIAS_D4.reduce((suma, s) => suma + fijosDe(s).length, 0) / SIMETRIAS_D4.length;
  if (porBurnside !== ORBITAS_D4 || ORBITAS_D4 !== 10)
    console.error("[shaoyong] Burnside y el conteo directo deben dar 10 órbitas");
  const puros = fijosDe(SIMETRIAS_D4[5]);
  if (puros.length !== 8 || !puros.every((v) => v >> 3 === (v & 7)))
    console.error("[shaoyong] la antitransposición debe fijar exactamente los 8 puros");
}
