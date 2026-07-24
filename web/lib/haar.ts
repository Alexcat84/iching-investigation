/**
 * La transformada de Haar de la secuencia del Rey Wen (experimento 39).
 *
 * La otra base clasica de 64 puntos, hermana de Walsh. Walsh pregunta en que
 * frecuencia (que subconjunto de lineas) vive una senal; Haar pregunta DONDE cambia.
 * La matriz se construye por recursion estandar: una fila constante (la media) y, por
 * cada escala p = 0..5 y posicion q, una onda +1 en la primera mitad de su soporte y
 * -1 en la segunda. A diferencia de Walsh, las filas tienen NORMAS DISTINTAS (2^p), y
 * por eso Parseval se escribe con esas normas.
 *
 * Senal: f(v) = numero del Rey Wen del hexagrama de valor v (la misma que espectro-walsh
 * y fourier-anillo, en otra geometria: la recta 0..63 en vez del cubo o el circulo).
 */
import { HEX_BY_VALUE } from "./iching";

const N = 64;

export interface FilaHaar {
  /** -1 = la media (DC); 0..5 = onda (0 la mas ancha, 5 la mas fina). */
  escala: number;
  /** Posicion de la onda dentro de su escala (0..2^escala-1). */
  pos: number;
  /** Ancho del soporte (64 >> escala para las ondas, 64 para la media). */
  ancho: number;
  /** Norma al cuadrado de la fila (= ancho): el peso que Parseval necesita. */
  norm2: number;
  /** Las 64 entradas, en {-1, 0, 1}. */
  fila: number[];
}

/** Construccion recursiva estandar de la matriz de Haar de 64 puntos (sin normalizar). */
function construirHaar(): FilaHaar[] {
  const filas: FilaHaar[] = [
    { escala: -1, pos: 0, ancho: N, norm2: N, fila: new Array(N).fill(1) },
  ];
  for (let p = 0; p < 6; p++) {
    const ancho = N >> p; // 64, 32, 16, 8, 4, 2
    const mitad = ancho >> 1;
    for (let q = 0; q < 1 << p; q++) {
      const fila = new Array(N).fill(0);
      const ini = q * ancho;
      for (let i = 0; i < mitad; i++) fila[ini + i] = 1;
      for (let i = mitad; i < ancho; i++) fila[ini + i] = -1;
      filas.push({ escala: p, pos: q, ancho, norm2: ancho, fila });
    }
  }
  return filas;
}

export const HAAR: FilaHaar[] = construirHaar();

/** Senal del Rey Wen: valor Fu Xi -> numero del Rey Wen. */
export const SENAL: number[] = Array.from({ length: N }, (_, v) => HEX_BY_VALUE[v].kw);

/** Coeficientes de Haar de una senal: c_r = <fila_r, f> (enteros si f lo es). */
export function transformar(f: number[]): number[] {
  return HAAR.map((r) => r.fila.reduce((s, x, v) => s + x * f[v], 0));
}

/** Reconstruccion desde los coeficientes: f = sum_r (c_r / norm2_r) fila_r. */
export function reconstruir(c: number[]): number[] {
  const f = new Array(N).fill(0);
  HAAR.forEach((r, i) => {
    const escala = c[i] / r.norm2;
    for (let v = 0; v < N; v++) f[v] += escala * r.fila[v];
  });
  return f;
}

export const COEFICIENTES: number[] = transformar(SENAL);

/** Energia (sum c^2/norm2) por escala; clave -1 = la media (DC). */
export const ENERGIA_ESCALA: { escala: number; energia: number }[] = (() => {
  const acc = new Map<number, number>();
  HAAR.forEach((r, i) => {
    const e = (COEFICIENTES[i] * COEFICIENTES[i]) / r.norm2;
    acc.set(r.escala, (acc.get(r.escala) ?? 0) + e);
  });
  return [...acc.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([escala, energia]) => ({ escala, energia }));
})();

export const ENERGIA_TOTAL: number = SENAL.reduce((s, x) => s + x * x, 0);
export const ENERGIA_SIN_DC: number =
  ENERGIA_ESCALA.filter((e) => e.escala >= 0).reduce((s, e) => s + e.energia, 0);

export interface CoefTop {
  escala: number;
  pos: number;
  c: number;
  norm2: number;
  /** Contribucion a la energia: c^2/norm2. */
  energia: number;
  /** Tramo del libro (posiciones Fu Xi) que cubre la onda. */
  ini: number;
  fin: number;
}

/** Los coeficientes de onda mas grandes (sin la media), por energia c^2/norm2. */
export const TOP: CoefTop[] = HAAR.map((r, i) => ({
  escala: r.escala,
  pos: r.pos,
  c: COEFICIENTES[i],
  norm2: r.norm2,
  energia: (COEFICIENTES[i] * COEFICIENTES[i]) / r.norm2,
  ini: r.pos * r.ancho,
  fin: r.pos * r.ancho + r.ancho,
}))
  .filter((t) => t.escala >= 0)
  .sort((a, b) => b.energia - a.energia)
  .slice(0, 6);

// === Aserciones en desarrollo (valores congelados, patron Mawangdui) ===
if (process.env.NODE_ENV !== "production") {
  // Las 64 filas son ortogonales: la matriz de Gram es diagonal.
  let offdiag = 0;
  for (let r = 0; r < N; r++)
    for (let s = 0; s < N; s++)
      if (r !== s) {
        let d = 0;
        for (let v = 0; v < N; v++) d += HAAR[r].fila[v] * HAAR[s].fila[v];
        offdiag = Math.max(offdiag, Math.abs(d));
      }
  if (offdiag !== 0) console.error("[haar] las filas no son ortogonales (Gram no diagonal)");

  // Reconstruccion exacta.
  const rec = reconstruir(COEFICIENTES);
  if (rec.some((x, v) => Math.abs(x - SENAL[v]) > 1e-9))
    console.error("[haar] la reconstruccion no es exacta");

  // Parseval con las normas correctas: sum f^2 == sum c^2/norm2.
  const rhs = HAAR.reduce((s, r, i) => s + (COEFICIENTES[i] * COEFICIENTES[i]) / r.norm2, 0);
  if (Math.abs(ENERGIA_TOTAL - rhs) > 1e-6) console.error("[haar] Parseval falla", ENERGIA_TOTAL, rhs);

  // DC = suma de la senal.
  if (COEFICIENTES[0] !== 2080) console.error("[haar] el coeficiente DC deberia ser 2080");

  // Coeficientes de onda mayores, congelados.
  const esperado = [
    { escala: 2, pos: 3, c: 198 },
    { escala: 2, pos: 0, c: -180 },
    { escala: 4, pos: 4, c: -77 },
    { escala: 5, pos: 27, c: 48 },
    { escala: 4, pos: 12, c: -61 },
    { escala: 5, pos: 31, c: 42 },
  ];
  const ok = esperado.every((e, i) => TOP[i] && TOP[i].escala === e.escala && TOP[i].pos === e.pos && TOP[i].c === e.c);
  if (!ok) console.error("[haar] los coeficientes mayores no coinciden con los congelados", TOP);
}
