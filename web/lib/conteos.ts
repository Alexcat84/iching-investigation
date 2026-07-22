/**
 * Conteos astronómicos del cubo Q6 (B4). Página de referencia.
 *
 * Regla de admisión: ninguna cifra sin fuente. Los números con fórmula cerrada se
 * computan aquí y se verifican en scripts/experimentos.py; los que no se computan
 * (número de ciclos hamiltonianos / códigos Gray de Q6) se citan a OEIS y no se
 * reproducen sus dígitos.
 */

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function comb(n: number, k: number): number {
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

export interface Conteo {
  etiqueta: string;
  valor: string;
  formula: string;
  fuente: string; // "computado" o una cita
}

/** Conteos con fórmula cerrada (computados y verificados). */
export const COMPUTADOS: Conteo[] = [
  { etiqueta: "Vértices (hexagramas)", valor: "64", formula: "2⁶", fuente: "computado" },
  { etiqueta: "Aristas (mutaciones de una línea)", valor: "192", formula: "6 · 2⁶ / 2", fuente: "computado" },
  { etiqueta: "Diámetro (distancia máxima)", valor: "6", formula: "n", fuente: "computado" },
  {
    etiqueta: "Automorfismos del grafo Q6",
    valor: (2 ** 6 * factorial(6)).toLocaleString("es"),
    formula: "2⁶ · 6!",
    fuente: "grupo hiperoctaédrico Z₂ ≀ S₆ (Harary, Graph Theory)",
  },
  {
    etiqueta: "Secuencias de De Bruijn B(2,6)",
    valor: (2 ** (2 ** 5 - 6)).toLocaleString("es"),
    formula: "2^(2⁵ − 6) = 2²⁶",
    fuente: "computado (fórmula de De Bruijn)",
  },
  {
    etiqueta: "Cadenas maximales de Kun a Qian",
    valor: factorial(6).toLocaleString("es"),
    formula: "6!",
    fuente: "computado (retículo B6)",
  },
  { etiqueta: "Órbitas bajo el grupo de Klein", valor: "20", formula: "Burnside", fuente: "computado" },
  { etiqueta: "Órbitas bajo D4 (cuadrado)", valor: "10", formula: "Burnside", fuente: "computado" },
];

/** Distribución de hexagramas por distancia de Hamming a uno dado. */
export const DISTANCIA: number[] = Array.from({ length: 7 }, (_, k) => comb(6, k));

/** Conteos citados (no se reproducen sus dígitos: viven en la fuente). */
export const CITADOS: {
  etiqueta: string;
  descripcion: string;
  fuente: string;
}[] = [
  {
    etiqueta: "Códigos Gray cíclicos (ciclos hamiltonianos) de Q6",
    descripcion:
      "El número de recorridos cerrados que visitan los 64 hexagramas cambiando una línea por paso es finito, conocido y astronómico. No lo reproducimos: su valor exacto está tabulado en la fuente.",
    fuente: "OEIS A003042 (códigos Gray cíclicos / ciclos hamiltonianos dirigidos del n-cubo)",
  },
];

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (DISTANCIA.reduce((a, b) => a + b, 0) !== 64) console.error("[conteos] distancias no suman 64");
  if (DISTANCIA.join(",") !== "1,6,15,20,15,6,1") console.error("[conteos] distancias != C(6,k)");
  if (2 ** 6 * factorial(6) !== 46080) console.error("[conteos] automorfismos != 46080");
  if (2 ** (2 ** 5 - 6) !== 67108864) console.error("[conteos] De Bruijn != 2^26");
  if (factorial(6) !== 720) console.error("[conteos] 6! != 720");
}
