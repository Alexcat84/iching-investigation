/**
 * La serpiente de De Bruijn: un anillo de 64 bits yin/yang donde cada ventana de
 * 6 posiciones consecutivas (cíclicas) es un hexagrama distinto. Los 64 aparecen
 * superpuestos, una vez cada uno, en 64 bits: la compresión máxima posible del libro.
 *
 * Usamos la secuencia canónica: la lexicográficamente mínima, generada por el
 * algoritmo de Fredricksen–Kessler–Maiorana (concatenación de las palabras de Lyndon
 * de longitud divisora de 6, en orden lexicográfico). Hay 2^(2^5 − 6) = 2^26 en total.
 */

/** Secuencia de De Bruijn B(2,6) lexicográficamente mínima (64 bits). */
export const SECUENCIA: number[] = (() => {
  const n = 6;
  const k = 2;
  const a = new Array(k * n).fill(0);
  const seq: number[] = [];
  const db = (t: number, p: number) => {
    if (t > n) {
      if (n % p === 0) for (let i = 1; i <= p; i++) seq.push(a[i]);
    } else {
      a[t] = a[t - p];
      db(t + 1, p);
      for (let j = a[t - p] + 1; j < k; j++) {
        a[t] = j;
        db(t + 1, t);
      }
    }
  };
  db(1, 1);
  return seq;
})();

/** Valor del hexagrama en la ventana que empieza en la posición i (cíclica). */
export function ventana(i: number): number {
  let v = 0;
  for (let x = 0; x < 6; x++) v |= SECUENCIA[(i + x) % 64] << (5 - x);
  return v;
}

/** Los 64 hexagramas leídos por la ventana deslizante, uno por posición. */
export const VENTANAS: number[] = Array.from({ length: 64 }, (_, i) => ventana(i));

/** Número total de secuencias de De Bruijn B(2,6). */
export const TOTAL_SECUENCIAS = 2 ** (2 ** 5 - 6); // 2^26 = 67 108 864

/** Verifica que las 64 ventanas son exactamente {0..63}. */
export function verificar(): boolean {
  const s = new Set(VENTANAS);
  return s.size === 64;
}

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (SECUENCIA.length !== 64) console.error("[debruijn] la secuencia debe tener 64 bits");
  if (!verificar())
    console.error("[debruijn] las 64 ventanas no cubren {0..63} sin repetir");
  if (TOTAL_SECUENCIAS !== 67108864) console.error("[debruijn] deben ser 2^26 secuencias");
}
