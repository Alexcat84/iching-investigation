/**
 * El grupo (Z/2)^6 y el Sierpinski.
 *
 * Con XOR (la mutación de líneas), los 64 hexagramas forman el grupo abeliano
 * (Z/2)^6: Kun (0) es el neutro y cada hexagrama es su propio inverso.
 *
 * Los 8 hexagramas puros (trigrama duplicado, upper == lower) son un subgrupo. Sus
 * 8 cosets particionan los 64: el coset de v es {w : upper(w) XOR lower(w) = c}, con
 * c = upper(v) XOR lower(v). Es una partición nueva, comparable con los palacios.
 *
 * Aparte, la matriz de dominancia S[i][j] = 1 si (i AND j) == j (j es submáscara de
 * i) coincide con C(i,j) mod 2 (teorema de Lucas: Pascal mod 2) y es, dibujada, el
 * triángulo de Sierpinski: es autosimilar, S = [[S,0],[S,S]] por bloques. Es la misma
 * relación de dominancia del retículo booleano B6.
 */

/** Los 8 hexagramas puros (trigrama duplicado): el subgrupo. */
export const PUROS: number[] = Array.from({ length: 64 }, (_, v) => v).filter(
  (v) => v >> 3 === (v & 7),
);

/** Índice de coset de un hexagrama: upper XOR lower (0..7). El coset 0 es el subgrupo. */
export function cosetDe(v: number): number {
  return (v >> 3) ^ (v & 7);
}

/** Los 8 cosets, cada uno con sus 8 hexagramas (ordenados por valor). */
export const COSETS: number[][] = (() => {
  const out: number[][] = Array.from({ length: 8 }, () => []);
  for (let v = 0; v < 64; v++) out[cosetDe(v)].push(v);
  return out;
})();

/** ¿PUROS es cerrado bajo XOR? (es subgrupo) */
export function subgrupoCerrado(): boolean {
  const set = new Set(PUROS);
  for (const a of PUROS) for (const b of PUROS) if (!set.has(a ^ b)) return false;
  return true;
}

/** ¿Los 8 cosets cubren los 64 exactamente una vez? */
export function cosetsParticionan(): boolean {
  const vistos = new Set<number>();
  for (const c of COSETS) {
    if (c.length !== 8) return false;
    for (const v of c) {
      if (vistos.has(v)) return false;
      vistos.add(v);
    }
  }
  return vistos.size === 64;
}

// === Matriz de Sierpinski (dominancia = Pascal mod 2) ===

/** S[i][j] = 1 si j es submáscara de i ((i AND j) == j), es decir C(i,j) mod 2. */
export function sierpinski(v: number, w: number): number {
  return (v & w) === w ? 1 : 0;
}

export const SIERPINSKI: number[][] = Array.from({ length: 64 }, (_, i) =>
  Array.from({ length: 64 }, (_, j) => sierpinski(i, j)),
);

/** Número de unos de la matriz: debe ser 3^6 (cada bit contribuye un factor 3). */
export const UNOS_SIERPINSKI = SIERPINSKI.flat().reduce((s, x) => s + x, 0);

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (PUROS.length !== 8) console.error("[grupo] deben ser 8 hexagramas puros");
  if (!subgrupoCerrado()) console.error("[grupo] los puros no son cerrados bajo XOR");
  if (!cosetsParticionan()) console.error("[grupo] los cosets no particionan los 64");
  if (UNOS_SIERPINSKI !== 3 ** 6)
    console.error("[grupo] la matriz de Sierpinski debe tener 3^6 unos, tiene", UNOS_SIERPINSKI);
  // Autosimilaridad: S de 64 = [[S32,0],[S32,S32]] (construcción recursiva de Sierpinski).
  let ok = true;
  for (let i = 0; i < 32 && ok; i++) {
    for (let j = 0; j < 32; j++) {
      const s = SIERPINSKI[i][j];
      if (SIERPINSKI[i][j + 32] !== 0) ok = false; // bloque superior derecho = 0
      if (SIERPINSKI[i + 32][j] !== s) ok = false; // inferior izquierdo = S
      if (SIERPINSKI[i + 32][j + 32] !== s) ok = false; // inferior derecho = S
    }
  }
  if (!ok) console.error("[grupo] la matriz no cumple la recursión de Sierpinski");
}
