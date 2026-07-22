/**
 * El árbol de Fu Xi: la bifurcación yin/yang que genera el orden binario.
 *
 * Del taiji salen dos (yin, yang), de cada uno otros dos, y así seis veces:
 * 1, 2, 4, 8, 16, 32, 64. El nivel k del árbol decide la línea k del hexagrama
 * (contando desde abajo).
 *
 * Alineación con la convención del sitio (decisión documentada en la página):
 * dibujamos yin a la izquierda y yang a la derecha. Como la primera bifurcación
 * es la línea inferior, y en este sitio la línea inferior es el bit más
 * significativo, las hojas quedan de izquierda a derecha exactamente en el orden
 * binario 0 a 63. Se verifica computacionalmente aquí y en Python.
 */

export interface NodoArbol {
  nivel: number; // 0 = taiji ... 6 = hoja
  idx: number; // índice dentro del nivel, 0 .. 2^nivel - 1
  /** Bits elegidos hasta aquí (línea 1 primero; vacío en la raíz). */
  bits: string;
}

/** Todos los nodos del árbol, nivel por nivel. */
export const NODOS: NodoArbol[][] = (() => {
  const out: NodoArbol[][] = [];
  for (let nivel = 0; nivel <= 6; nivel++) {
    const fila: NodoArbol[] = [];
    for (let idx = 0; idx < 2 ** nivel; idx++) {
      fila.push({ nivel, idx, bits: idx.toString(2).padStart(nivel, "0") });
    }
    out.push(fila);
  }
  return out;
})();

/** Las hojas leídas de izquierda a derecha: deben ser exactamente 0..63. */
export function hojasEnOrden(): number[] {
  return NODOS[6].map((n) => parseInt(n.bits, 2));
}

/** El camino de la raíz a la hoja del hexagrama v: un nodo por nivel. */
export function caminoHasta(v: number): NodoArbol[] {
  const bits = v.toString(2).padStart(6, "0");
  return Array.from({ length: 7 }, (_, nivel) => {
    const prefijo = bits.slice(0, nivel);
    return NODOS[nivel][nivel === 0 ? 0 : parseInt(prefijo, 2)];
  });
}

export const ETIQUETAS_NIVEL = [
  "太極 taiji",
  "兩儀 los dos",
  "四象 los cuatro",
  "八卦 los ocho trigramas",
  "16",
  "32",
  "64 hexagramas",
];

// Aserciones en desarrollo: leer las hojas reproduce el orden binario del sitio.
if (process.env.NODE_ENV !== "production") {
  const hojas = hojasEnOrden();
  if (hojas.some((v, i) => v !== i))
    console.error("[arbol] las hojas no están en el orden binario 0..63");
  if (NODOS.reduce((s, f) => s + f.length, 0) !== 127)
    console.error("[arbol] el árbol debe tener 127 nodos");
}
