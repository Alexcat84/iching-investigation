/**
 * La matriz de transferencia: disena tu regla (experimento 32).
 *
 * Generaliza el experimento 29. Una regla de adyacencia entre lineas es una matriz 2x2
 * M[a][b] in {0,1} (a, b in {yin=0, yang=1}): 1 si la linea b puede seguir a la a. Sus
 * potencias dan los conteos de figuras por numero de lineas (abierta: 1ᵀM^{n-1}1;
 * ciclica: Tr(M^n)) y su autovalor dominante es la razon de crecimiento. Es la
 * transformada z del conteo; la de Laplace no aplica (el I Ching no tiene tiempo
 * continuo). Nada esta cableado.
 */
import { hex } from "./iching";

/** Matriz de adyacencia 2x2. Filas/columnas: 0 = yin, 1 = yang. */
export type Regla = number[][];

export interface Preset {
  id: string;
  nombre: string;
  M: Regla;
  nota: string;
}

export const PRESETS: Preset[] = [
  { id: "sin-yin", nombre: "sin dos yin", M: [[0, 1], [1, 1]], nota: "Fibonacci, autovalor φ" },
  { id: "sin-yang", nombre: "sin dos yang", M: [[1, 1], [1, 0]], nota: "Fibonacci, autovalor φ" },
  { id: "libre", nombre: "todo permitido", M: [[1, 1], [1, 1]], nota: "2ⁿ, autovalor 2" },
  { id: "alterna", nombre: "solo alternancia", M: [[0, 1], [1, 0]], nota: "2, 2, 2…, autovalor 1" },
];

function matMul(A: Regla, B: Regla): Regla {
  return [0, 1].map((i) => [0, 1].map((j) => A[i][0] * B[0][j] + A[i][1] * B[1][j]));
}
export function matPow(M: Regla, p: number): Regla {
  let R: Regla = [[1, 0], [0, 1]];
  for (let i = 0; i < p; i++) R = matMul(R, M);
  return R;
}

/** Conteo de figuras de n lineas con la regla (cadena abierta): 1ᵀ M^{n-1} 1. */
export function conteo(M: Regla, n: number): number {
  const P = matPow(M, n - 1);
  return P[0][0] + P[0][1] + P[1][0] + P[1][1];
}

/** Conteo ciclico (anillo) de n lineas: Tr(M^n). */
export function conteoCiclico(M: Regla, n: number): number {
  const P = matPow(M, n);
  return P[0][0] + P[1][1];
}

/** La sucesion de conteos para n = 1..6. */
export function sucesion(M: Regla): number[] {
  return [1, 2, 3, 4, 5, 6].map((n) => conteo(M, n));
}

/** Autovalor dominante (2x2): la razon de crecimiento asintotica. */
export function autovalorDominante(M: Regla): number {
  const tr = M[0][0] + M[1][1];
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const disc = tr * tr - 4 * det;
  return (tr + Math.sqrt(Math.max(0, disc))) / 2;
}

// === Caso especial: Catalan (caminos de Dyck) ===

/** Hexagramas balanceados (3 yang, 3 yin) donde el yang nunca va por detras del yin. */
export const CATALAN: number[] = (() => {
  const out: number[] = [];
  for (let v = 0; v < 64; v++) {
    const s = hex(v).bits; // s[0] = linea 1
    if (s.split("").filter((c) => c === "1").length !== 3) continue;
    let bal = 0;
    let ok = true;
    for (const c of s) {
      bal += c === "1" ? 1 : -1;
      if (bal < 0) {
        ok = false;
        break;
      }
    }
    if (ok) out.push(v);
  }
  return out;
})();

/** El n-esimo numero de Catalan. */
export function catalan(n: number): number {
  let c = 1;
  for (let k = 0; k < n; k++) c = (c * 2 * (2 * k + 1)) / (k + 2);
  return Math.round(c);
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  const eig = (M: Regla) => autovalorDominante(M);
  if (sucesion(PRESETS[0].M).join(",") !== "2,3,5,8,13,21") console.error("[transferencia] sin-yin != Fibonacci");
  if (sucesion(PRESETS[2].M).join(",") !== "2,4,8,16,32,64") console.error("[transferencia] libre != 2^n");
  if (sucesion(PRESETS[3].M).join(",") !== "2,2,2,2,2,2") console.error("[transferencia] alternancia != 2");
  if (Math.abs(eig(PRESETS[0].M) - 1.618034) > 1e-5) console.error("[transferencia] autovalor sin-yin != phi");
  if (Math.abs(eig(PRESETS[2].M) - 2) > 1e-9) console.error("[transferencia] autovalor libre != 2");
  if (CATALAN.length !== 5 || CATALAN.join(",") !== "42,44,50,52,56") console.error("[transferencia] Catalan != [42,44,50,52,56]", CATALAN);
  if (catalan(3) !== 5) console.error("[transferencia] C3 != 5");
}
