/**
 * La cadena de Markov de las consultas (C1), y el motor compartido con el
 * comparador de sorteos (C3).
 *
 * Si encadenamos consultas (tomando el hexagrama futuro de una como el presente de
 * la siguiente) tenemos una cadena de Markov sobre los 64 estados. Dado el presente,
 * cada línea muta de forma independiente con una probabilidad que depende de si la
 * línea es yang o yin y del método (derivada de las probabilidades de web/lib/oraculo):
 *
 *   q_yang = P(yang viejo) / P(yang)   ·   q_yin = P(yin viejo) / P(yin)
 *
 * Como las líneas evolucionan independientes, la estacionaria tiene forma cerrada:
 * cada línea es yang con probabilidad p = q_yin / (q_yang + q_yin), y
 *   π[v] = p^(yang) · (1 − p)^(6 − yang).
 * Con monedas p = 1/2 (estacionaria uniforme); con milenrama p = 1/4 (sesgo al yin).
 */
import { DIECISEISAVOS, type Metodo } from "./oraculo";

export interface ProbLinea {
  qYang: number; // P(una línea yang mute)
  qYin: number; // P(una línea yin mute)
}

export function probLinea(m: Metodo): ProbLinea {
  const d = DIECISEISAVOS[m];
  return {
    qYang: d[9] / (d[9] + d[7]),
    qYin: d[6] / (d[6] + d[8]),
  };
}

function popcount(v: number): number {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (v >> k) & 1;
  return n;
}

/** Matriz de transición 64×64 del método. P[i][j] = P(presente i → futuro j). */
export function matrizTransicion(m: Metodo): number[][] {
  const { qYang, qYin } = probLinea(m);
  const P = Array.from({ length: 64 }, () => new Array(64).fill(0));
  for (let i = 0; i < 64; i++) {
    for (let mask = 0; mask < 64; mask++) {
      const j = i ^ mask;
      let p = 1;
      for (let k = 0; k < 6; k++) {
        const yang = (i >> (5 - k)) & 1;
        const muta = (mask >> (5 - k)) & 1;
        const q = yang ? qYang : qYin;
        p *= muta ? q : 1 - q;
      }
      P[i][j] += p;
    }
  }
  return P;
}

/** Distribución estacionaria (forma cerrada). */
export function estacionaria(m: Metodo): number[] {
  const { qYang, qYin } = probLinea(m);
  const pYang = qYin / (qYang + qYin);
  return Array.from({ length: 64 }, (_, v) => {
    const y = popcount(v);
    return pYang ** y * (1 - pYang) ** (6 - y);
  });
}

/** Segundo autovalor (relajación): 1 − q_yang − q_yin. */
export function lambda2(m: Metodo): number {
  const { qYang, qYin } = probLinea(m);
  return 1 - qYang - qYin;
}

/** Correlación de Pearson entre π[v] y el número de líneas yang de v. */
export function correlacionYang(pi: number[]): number {
  const xs = Array.from({ length: 64 }, (_, v) => popcount(v));
  const n = 64;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = pi.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let sx = 0;
  let sy = 0;
  for (let i = 0; i < n; i++) {
    cov += (xs[i] - mx) * (pi[i] - my);
    sx += (xs[i] - mx) ** 2;
    sy += (pi[i] - my) ** 2;
  }
  if (sx === 0 || sy === 0) return 0;
  return cov / Math.sqrt(sx * sy);
}

export function yangEsperado(pi: number[]): number {
  return pi.reduce((s, p, v) => s + p * popcount(v), 0);
}

/** Un paso de la cadena desde el estado v (para el simulador). */
export function paso(v: number, m: Metodo, rng: () => number = Math.random): number {
  const { qYang, qYin } = probLinea(m);
  let mask = 0;
  for (let k = 1; k <= 6; k++) {
    const yang = (v >> (6 - k)) & 1;
    if (rng() < (yang ? qYang : qYin)) mask |= 1 << (6 - k);
  }
  return v ^ mask;
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  for (const m of ["monedas", "milenrama"] as Metodo[]) {
    const P = matrizTransicion(m);
    for (const fila of P) {
      const s = fila.reduce((a, b) => a + b, 0);
      if (Math.abs(s - 1) > 1e-12) {
        console.error(`[transicion] fila de P (${m}) no suma 1`);
        break;
      }
    }
    const pi = estacionaria(m);
    // πP = π
    let err = 0;
    for (let j = 0; j < 64; j++) {
      let s = 0;
      for (let i = 0; i < 64; i++) s += pi[i] * P[i][j];
      err = Math.max(err, Math.abs(s - pi[j]));
    }
    if (err > 1e-9) console.error(`[transicion] πP != π (${m}), err=${err}`);
  }
  if (Math.abs(correlacionYang(estacionaria("monedas"))) > 1e-9)
    console.error("[transicion] monedas debería tener correlación 0");
  if (correlacionYang(estacionaria("milenrama")) > -0.7)
    console.error("[transicion] milenrama debería tener correlación negativa fuerte");
}
