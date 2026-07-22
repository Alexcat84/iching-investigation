/**
 * Las probabilidades de los dos métodos de consulta.
 *
 * Cada línea sale en uno de cuatro estados:
 *   9  yang viejo (yang, mutante → se vuelve yin)
 *   8  yin joven  (yin, estático)
 *   7  yang joven (yang, estático)
 *   6  yin viejo  (yin, mutante → se vuelve yang)
 *
 * Las tres monedas dan una distribución simétrica; las varillas de milenrama, no.
 * Sorpresa central del experimento: pese a ello, coinciden en dos cosas
 * (P(yang) = 1/2 y P(muta) = 1/4) y divergen en una tercera (hacia dónde muta).
 */

export type Metodo = "monedas" | "milenrama";
export type Estado = 6 | 7 | 8 | 9;

/** Probabilidad de cada estado, expresada en dieciseisavos (numerador sobre 16). */
export const DIECISEISAVOS: Record<Metodo, Record<Estado, number>> = {
  // 3 monedas (cara = 3, cruz = 2): 1/8, 3/8, 3/8, 1/8
  monedas: { 9: 2, 8: 6, 7: 6, 6: 2 },
  // milenrama (método de las 49 varillas): 3/16, 7/16, 5/16, 1/16
  milenrama: { 9: 3, 8: 7, 7: 5, 6: 1 },
};

export const PROB = (m: Metodo, e: Estado): number => DIECISEISAVOS[m][e] / 16;

export const ES_YANG: Record<Estado, boolean> = { 9: true, 8: false, 7: true, 6: false };
export const ES_MUTANTE: Record<Estado, boolean> = { 9: true, 8: false, 7: false, 6: true };

export const NOMBRE_ESTADO: Record<Estado, string> = {
  9: "yang viejo",
  8: "yin joven",
  7: "yang joven",
  6: "yin viejo",
};

/** Cantidades teóricas derivadas, exactas (sin simular). */
export interface Teoria {
  pYang: number; // P(línea presente sea yang)
  pMuta: number; // P(línea mute)
  cuotaYangViejo: number; // entre las mutantes, cuota de yang viejo
  yangPresenteEsperado: number; // E[nº de líneas yang en el hexagrama presente]
  yangFuturoEsperado: number; // E[nº de líneas yang en el hexagrama futuro]
}

export function teoria(m: Metodo): Teoria {
  const p9 = PROB(m, 9);
  const p8 = PROB(m, 8);
  const p7 = PROB(m, 7);
  const p6 = PROB(m, 6);
  const pYang = p7 + p9;
  const pMuta = p6 + p9;
  // Futuro: la línea es yang si era yang joven (queda) o yin viejo (muta a yang).
  const pYangFuturo = p7 + p6;
  return {
    pYang,
    pMuta,
    cuotaYangViejo: p9 / pMuta,
    yangPresenteEsperado: 6 * pYang,
    yangFuturoEsperado: 6 * pYangFuturo,
  };
}

/** Muestrea el estado de una línea según el método. */
export function muestrearLinea(m: Metodo, rng: () => number = Math.random): Estado {
  const r = rng() * 16;
  const t = DIECISEISAVOS[m];
  if (r < t[9]) return 9;
  if (r < t[9] + t[8]) return 8;
  if (r < t[9] + t[8] + t[7]) return 7;
  return 6;
}

export interface Agregados {
  n: number;
  /** Histograma de nº de líneas mutantes por lectura (índice 0..6). */
  histCambios: number[];
  yangViejo: number; // total de líneas yang viejo
  yinViejo: number; // total de líneas yin viejo
  sumaYangPresente: number; // suma de líneas yang (presente) sobre todas las lecturas
  sumaYangFuturo: number; // suma de líneas yang (futuro)
}

/** Simula `n` lecturas completas (6 líneas cada una). */
export function simular(
  m: Metodo,
  n: number,
  rng: () => number = Math.random,
): Agregados {
  const histCambios = new Array(7).fill(0);
  let yangViejo = 0;
  let yinViejo = 0;
  let sumaYangPresente = 0;
  let sumaYangFuturo = 0;

  for (let i = 0; i < n; i++) {
    let cambios = 0;
    for (let k = 0; k < 6; k++) {
      const e = muestrearLinea(m, rng);
      if (ES_YANG[e]) sumaYangPresente++;
      if (ES_MUTANTE[e]) {
        cambios++;
        if (e === 9) {
          yangViejo++;
          // yang → yin en el futuro (no suma)
        } else {
          yinViejo++;
          sumaYangFuturo++; // yin viejo → yang en el futuro
        }
      } else if (ES_YANG[e]) {
        sumaYangFuturo++; // yang joven permanece yang
      }
    }
    histCambios[cambios]++;
  }

  return { n, histCambios, yangViejo, yinViejo, sumaYangPresente, sumaYangFuturo };
}

// Colores de serie validados para daltonismo sobre fondo oscuro (script del skill dataviz).
export const METODOS: { id: Metodo; nombre: string; color: string }[] = [
  { id: "monedas", nombre: "Tres monedas", color: "#5b8fd9" },
  { id: "milenrama", nombre: "Milenrama (49 varillas)", color: "#cf7a2e" },
];
