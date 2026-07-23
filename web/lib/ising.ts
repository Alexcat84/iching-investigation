/**
 * El hexagrama como cadena de espines (experimento 30, modelo de Ising 1D).
 *
 * Cada hexagrama es una cadena de 6 espines (yang = +1, yin = -1). La energia es
 * E = -J por la suma de productos de lineas vecinas; las probabilidades son de
 * Boltzmann, w(v) = exp(-beta E(v)). La funcion de particion se calcula con la matriz
 * de transferencia T (la misma estructura que el experimento 29): Z abierta = 1ᵀT⁵1,
 * Z periodica = Tr(T⁶). Nada esta cableado: todo se computa.
 *
 * Descargo: Ising (1925, sobre el planteamiento de Lenz de 1920) demostro que en 1D no
 * hay transicion de fase; esta cadena de 6 se ordena gradualmente al enfriar, no de
 * golpe. La conexion con el I Ching es identidad de estructura, no fisica del oraculo.
 */
import { hex } from "./iching";

/** Espines de un hexagrama, linea 1 (abajo) a 6 (arriba): +1 = yang, -1 = yin. */
export function espines(v: number): number[] {
  return hex(v).bits.split("").map((b) => (b === "1" ? 1 : -1));
}

/** Energia de la cadena (abierta o anillo): E = -J por la suma de productos vecinos. */
export function energia(v: number, J: number, anillo: boolean): number {
  const s = espines(v);
  let suma = 0;
  for (let i = 0; i < 5; i++) suma += s[i] * s[i + 1];
  if (anillo) suma += s[5] * s[0];
  return -J * suma;
}

/** Matriz de transferencia 2x2: T[a][b] = exp(beta J s_a s_b), con s en {+1,-1}. */
export function matrizT(beta: number, J: number): number[][] {
  const e = Math.exp(beta * J);
  const f = Math.exp(-beta * J);
  return [
    [e, f],
    [f, e],
  ];
}

function matMul(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      let s = 0;
      for (let k = 0; k < n; k++) s += A[i][k] * B[k][j];
      return s;
    }),
  );
}
function matPow(A: number[][], p: number): number[][] {
  let R: number[][] = [
    [1, 0],
    [0, 1],
  ];
  for (let i = 0; i < p; i++) R = matMul(R, A);
  return R;
}

/** Z de cadena abierta de 6 sitios: 1ᵀ T⁵ 1. */
export function Zabierta(beta: number, J: number): number {
  const T5 = matPow(matrizT(beta, J), 5);
  return T5[0][0] + T5[0][1] + T5[1][0] + T5[1][1];
}

/** Z de anillo de 6 sitios: Tr(T⁶). */
export function Zperiodica(beta: number, J: number): number {
  const T6 = matPow(matrizT(beta, J), 6);
  return T6[0][0] + T6[1][1];
}

/** Peso de Boltzmann de cada hexagrama, w(v) = exp(-beta E(v)). */
export function pesos(beta: number, J: number, anillo: boolean): number[] {
  return Array.from({ length: 64 }, (_, v) => Math.exp(-beta * energia(v, J, anillo)));
}

/** Probabilidad de Boltzmann normalizada de cada hexagrama. */
export function probsBoltzmann(beta: number, J: number, anillo: boolean): number[] {
  const w = pesos(beta, J, anillo);
  const Z = w.reduce((a, b) => a + b, 0);
  return w.map((x) => x / Z);
}

/** Entropia de Shannon (bits) de la distribucion de Boltzmann. */
export function entropia(beta: number, J: number, anillo: boolean): number {
  const p = probsBoltzmann(beta, J, anillo);
  return -p.reduce((s, x) => (x > 0 ? s + x * Math.log2(x) : s), 0);
}

/** Restriccion dura (sin yin-yin adyacente): matriz de conteo y su autovalor dominante. */
export const MATRIZ_DURA: number[][] = [
  [0, 1],
  [1, 1],
];
/** Autovalor dominante de la matriz de conteo: la razon aurea. */
export function autovalorDominante(M: number[][]): number {
  const tr = M[0][0] + M[1][1];
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  return (tr + Math.sqrt(tr * tr - 4 * det)) / 2;
}

/** Valores de referencia congelados (beta = 0,7, J = 1), verificados en la suite. */
export const Z_REF_ABIERTA = 199.384322;
export const Z_REF_PERIODICA = 262.456561;

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (Math.abs(Zabierta(0.7, 1) - Z_REF_ABIERTA) > 1e-4)
    console.error("[ising] Z abierta != 199.384322", Zabierta(0.7, 1));
  if (Math.abs(Zperiodica(0.7, 1) - Z_REF_PERIODICA) > 1e-4)
    console.error("[ising] Z periodica != 262.456561", Zperiodica(0.7, 1));
  if (Math.abs(Zabierta(0, 1) - 64) > 1e-9) console.error("[ising] beta=0 -> Z != 64");
  if (Math.abs(autovalorDominante(MATRIZ_DURA) - 1.618034) > 1e-5)
    console.error("[ising] autovalor dominante != phi");
}
