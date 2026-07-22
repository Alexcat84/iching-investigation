/**
 * Registro de experimentos — fuente de verdad del menú.
 *
 * Diseño en facetas (ver docs/etiquetado-experimentos.md):
 *   1. Categoría (exactamente una por experimento, navegación principal).
 *   2. Etiquetas (2 a 4 de un vocabulario cerrado, filtros cruzados).
 *   3. Tipo (una por experimento).
 *   4. Nivel (una por experimento).
 *
 * El vocabulario es cerrado a propósito: los union types de abajo hacen que el
 * compilador rechace cualquier etiqueta fuera del vocabulario. scripts/experimentos.py
 * verifica la misma regla (1 categoría, 2 a 4 etiquetas, vocabulario cerrado).
 *
 * Para añadir un experimento nuevo:
 *   1. Añade una entrada al arreglo BASE (con sus facetas).
 *   2. Crea app/experimentos/<slug>/page.tsx.
 * El número visible se deriva del orden del arreglo; reordenar = reordenar aquí.
 */

// === Faceta 1: Categoría (exclusiva) ===
export type Categoria = "geometria" | "algebra" | "historia" | "azar" | "practica";

export const CATEGORIAS: Categoria[] = [
  "geometria",
  "algebra",
  "historia",
  "azar",
  "practica",
];

export const CATEGORIA_INFO: Record<Categoria, { nombre: string; desc: string }> = {
  geometria: {
    nombre: "Geometría",
    desc: "El cubo de 6 dimensiones y sus formas: proyecciones, retículos, árboles",
  },
  algebra: {
    nombre: "Álgebra y estructura",
    desc: "Operaciones, grupos, matrices, particiones, espectros",
  },
  historia: {
    nombre: "Historia y secuencias",
    desc: "Los órdenes tradicionales, sus autores y sus documentos",
  },
  azar: {
    nombre: "Azar y dinámica",
    desc: "Probabilidades del oráculo, cadenas, paseos, simulaciones",
  },
  practica: {
    nombre: "Tu práctica",
    desc: "Herramientas sobre las consultas del propio usuario",
  },
};

// === Faceta 2: Etiquetas temáticas (vocabulario controlado) ===
export type Etiqueta =
  | "hipercubo"
  | "binario"
  | "permutaciones"
  | "secuencias-historicas"
  | "trigramas"
  | "hu-gua"
  | "simetrias"
  | "particiones"
  | "probabilidad"
  | "adivinacion"
  | "recorridos"
  | "algebra-lineal"
  | "teoria-de-grupos"
  | "estadistica"
  | "leibniz"
  | "interdisciplinar"
  | "consulta-propia";

export const ETIQUETAS: Etiqueta[] = [
  "hipercubo",
  "binario",
  "permutaciones",
  "secuencias-historicas",
  "trigramas",
  "hu-gua",
  "simetrias",
  "particiones",
  "probabilidad",
  "adivinacion",
  "recorridos",
  "algebra-lineal",
  "teoria-de-grupos",
  "estadistica",
  "leibniz",
  "interdisciplinar",
  "consulta-propia",
];

export const ETIQUETA_INFO: Record<Etiqueta, { nombre: string; def: string }> = {
  hipercubo: { nombre: "hipercubo", def: "Usa la estructura de Q6: vértices, aristas, distancia de Hamming" },
  binario: { nombre: "binario", def: "La correspondencia hexagrama ↔ número de 6 bits en primer plano" },
  permutaciones: { nombre: "permutaciones", def: "Órdenes como permutaciones: ciclos, inversiones, paridad" },
  "secuencias-historicas": { nombre: "secuencias históricas", def: "Fu Xi, Rey Wen, Mawangdui o Jing Fang como objeto de estudio" },
  trigramas: { nombre: "trigramas", def: "La estructura 8×8 o los bagua como protagonistas" },
  "hu-gua": { nombre: "hu gua", def: "El operador nuclear y su dinámica" },
  simetrias: { nombre: "simetrías", def: "Grupos de simetría, órbitas, involuciones (fan, dui, D4)" },
  particiones: { nombre: "particiones", def: "Formas de partir los 64 en familias comparables" },
  probabilidad: { nombre: "probabilidad", def: "Distribuciones, procesos estocásticos, convergencia" },
  adivinacion: { nombre: "adivinación", def: "El mecanismo material del oráculo (varillas, monedas, fichas)" },
  recorridos: { nombre: "recorridos", def: "Caminos sobre el grafo: Gray, hamiltonianos, De Bruijn, paseos" },
  "algebra-lineal": { nombre: "álgebra lineal", def: "Matrices sobre F2, rangos, espectros de Walsh" },
  "teoria-de-grupos": { nombre: "teoría de grupos", def: "(Z/2)^6, subgrupos, cosets, Burnside" },
  estadistica: { nombre: "estadística", def: "Tests de hipótesis, Monte Carlo, p-valores" },
  leibniz: { nombre: "leibniz", def: "La conexión histórica con el binario europeo" },
  interdisciplinar: { nombre: "interdisciplinar", def: "Correspondencias con sistemas externos (requiere descargo)" },
  "consulta-propia": { nombre: "consulta propia", def: "Opera sobre lecturas reales del usuario" },
};

// === Faceta 3: Tipo ===
export type Tipo = "visualizacion" | "simulador" | "calculadora" | "test" | "referencia";

export const TIPO_INFO: Record<Tipo, { nombre: string; def: string }> = {
  visualizacion: { nombre: "visualización", def: "ver una estructura" },
  simulador: { nombre: "simulador", def: "generar y observar procesos" },
  calculadora: { nombre: "calculadora", def: "metes un input y recibes un resultado" },
  test: { nombre: "test", def: "pone a prueba una hipótesis" },
  referencia: { nombre: "referencia", def: "documenta hechos con fuentes" },
};

// === Faceta 4: Nivel ===
export type Nivel = "introductorio" | "intermedio" | "avanzado";

export const NIVEL_INFO: Record<Nivel, { nombre: string; def: string }> = {
  introductorio: { nombre: "introductorio", def: "sin requisitos" },
  intermedio: { nombre: "intermedio", def: "ayuda haber visto el hipercubo" },
  avanzado: { nombre: "avanzado", def: "usa maquinaria matemática explícita" },
};

export type Estado = "activo" | "proximamente";

export interface Experimento {
  slug: string;
  /** Número visible: derivado de la posición en el registro, nunca cableado. */
  n: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  /** Símbolo o hexagrama representativo. */
  simbolo: string;
  categoria: Categoria;
  etiquetas: Etiqueta[];
  tipo: Tipo;
  nivel: Nivel;
  /** Color de acento (de la paleta de líneas). */
  accent: string;
  estado: Estado;
  destacado?: boolean;
  /** Descargo honesto para correspondencias externas (etiqueta interdisciplinar). */
  descargo?: string;
}

/** Entradas sin número: el orden de este arreglo ES la numeración. */
const BASE: Omit<Experimento, "n">[] = [
  {
    slug: "hipercubo",
    titulo: "El hipercubo del I Ching",
    subtitulo: "64 hexagramas · 192 mutaciones · un recorrido Gray",
    descripcion:
      "El anillo de los 64 hexagramas y las 192 aristas que forman el hipercubo de 6 dimensiones. Compara el orden Fu Xi (binario) con el del Rey Wen y recorre los 64 estados cambiando una sola línea por paso.",
    simbolo: "䷀",
    categoria: "geometria",
    etiquetas: ["hipercubo", "binario", "recorridos"],
    tipo: "visualizacion",
    nivel: "introductorio",
    accent: "#5b8fd9",
    estado: "activo",
    destacado: true,
  },
  {
    slug: "palacios",
    titulo: "Los ocho palacios de Jing Fang",
    subtitulo: "Caminos sobre el hipercubo, descritos en el siglo II a.C.",
    descripcion:
      "Jing Fang agrupó los 64 hexagramas en 8 casas generadas por cambios sucesivos de líneas desde los 8 hexagramas puros. Reconstruimos las casas como recorridos sobre Q6 y verificamos que particionan los 64 sin repetir ninguno.",
    simbolo: "☰",
    categoria: "historia",
    etiquetas: ["secuencias-historicas", "particiones", "recorridos"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#e5c558",
    estado: "activo",
    destacado: true,
  },
  {
    slug: "mapa-lectura",
    titulo: "El mapa de la lectura",
    subtitulo: "Toda consulta es un salto en el hipercubo",
    descripcion:
      "Arma un hexagrama, marca las líneas mutantes y observa el salto: hexagrama original → resultante, con la distancia exacta y la lectura simbólica de qué líneas cambiaron. También puedes echar las monedas.",
    simbolo: "䷗",
    categoria: "practica",
    etiquetas: ["consulta-propia", "hipercubo", "binario"],
    tipo: "calculadora",
    nivel: "introductorio",
    accent: "#5fae7f",
    estado: "activo",
    destacado: true,
  },
  {
    slug: "probabilidades",
    titulo: "Monedas contra milenrama",
    subtitulo: "Las probabilidades ocultas del oráculo",
    descripcion:
      "Las varillas de milenrama no son simétricas como las monedas. Simulamos miles de consultas con las probabilidades históricas de cada método y descubrimos qué distribuciones cambian… y cuáles resultan ser idénticas.",
    simbolo: "䷚",
    categoria: "azar",
    etiquetas: ["probabilidad", "adivinacion"],
    tipo: "visualizacion",
    nivel: "introductorio",
    accent: "#e8883a",
    estado: "activo",
  },
  {
    slug: "simetrias",
    titulo: "Las simetrías del hipercubo",
    subtitulo: "Órbitas, palíndromos y el mapa nuclear",
    descripcion:
      "El grupo de Klein generado por el volteo (fan) y el opuesto (dui) parte los 64 hexagramas en 20 órbitas. Los 8 palíndromos resultan ser exactamente los pares especiales del Rey Wen. Y el hexagrama nuclear, iterado, cae en 3 atractores: dos puntos fijos y un ciclo de 2 (4 hexagramas atractores).",
    simbolo: "䷾",
    categoria: "algebra",
    etiquetas: ["simetrias", "hu-gua", "hipercubo"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#9c6bc9",
    estado: "activo",
  },
  {
    slug: "trayectoria",
    titulo: "Trayectoria personal",
    subtitulo: "Tu historial como ruta por los 64 estados",
    descripcion:
      "El historial de consultas de una persona es un camino por el espacio de 64 estados: regiones recurrentes, distancia media entre lecturas, en qué palacio vive cada período. Tus datos quedan solo en tu navegador.",
    simbolo: "䷆",
    categoria: "practica",
    etiquetas: ["consulta-propia", "recorridos", "hipercubo"],
    tipo: "visualizacion",
    nivel: "introductorio",
    accent: "#e24b3b",
    estado: "activo",
  },
  {
    slug: "rey-wen",
    titulo: "La secuencia del Rey Wen",
    subtitulo: "La regla de pares y la búsqueda de una fórmula",
    descripcion:
      "El orden tradicional agrupa los 64 en 32 pares: cada par es el volteo del anterior, salvo en 4 casos donde se usa el opuesto. Fuera de esa regla no se conoce ninguna fórmula binaria. La visualizamos y buscamos la estructura que sí hay.",
    simbolo: "序",
    categoria: "historia",
    etiquetas: ["secuencias-historicas", "simetrias", "binario"],
    tipo: "visualizacion",
    nivel: "introductorio",
    accent: "#cf9b5b",
    estado: "activo",
  },
  {
    slug: "shao-yong",
    titulo: "El cuadrado y el círculo",
    subtitulo: "El diagrama de Shao Yong que vio Leibniz",
    descripcion:
      "Los 64 hexagramas dispuestos a la vez en un cuadrado 8×8 y en un círculo, en orden binario. Es el diagrama que Bouvet envió a Leibniz hacia 1701: leerlo en orden es, literalmente, contar de 0 a 63. Con las 8 simetrías del cuadrado traducidas a operaciones de trigramas.",
    simbolo: "圓",
    categoria: "historia",
    etiquetas: ["secuencias-historicas", "trigramas", "simetrias", "leibniz"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#6fa8b0",
    estado: "activo",
  },
  {
    slug: "permutacion",
    titulo: "Rey Wen como permutación",
    subtitulo: "Cuánto desordena el libro la geometría",
    descripcion:
      "Si Fu Xi es la identidad, el Rey Wen es una permutación de los 64 números. La descomponemos en ciclos y medimos su desorden: puntos fijos, orden, paridad e inversiones. Y la hacemos competir con los órdenes de Mawangdui y de los palacios de Jing Fang.",
    simbolo: "σ",
    categoria: "historia",
    etiquetas: ["permutaciones", "secuencias-historicas", "estadistica"],
    tipo: "visualizacion",
    nivel: "avanzado",
    accent: "#b57bb0",
    estado: "activo",
  },
  {
    slug: "ritual-milenrama",
    titulo: "El ritual de las 49 varillas",
    subtitulo: "De dónde salen 1, 3, 5 y 7 dieciseisavos",
    descripcion:
      "El método antiguo de la milenrama, paso a paso: dividir el manojo, contar de 4 en 4, tres operaciones por línea. Derivamos con fracciones exactas las probabilidades que el experimento de monedas contra milenrama usa como dato, y verificamos que coinciden.",
    simbolo: "蓍",
    categoria: "azar",
    etiquetas: ["adivinacion", "probabilidad"],
    tipo: "simulador",
    nivel: "introductorio",
    accent: "#c8873a",
    estado: "activo",
  },
  {
    slug: "dos-cielos",
    titulo: "Los dos cielos",
    subtitulo: "El bagua Anterior y el Posterior como permutaciones",
    descripcion:
      "Los 8 trigramas tienen dos disposiciones clásicas en círculo: el Cielo Anterior de Fu Xi y el Cielo Posterior del Rey Wen. En la primera, cada trigrama mira a su complemento binario exacto; en la segunda esa simetría se rompe salvo en el eje Li y Kan. La permutación entre ambas: dos ciclos de 4.",
    simbolo: "先",
    categoria: "historia",
    etiquetas: ["trigramas", "permutaciones", "simetrias"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#58b09c",
    estado: "activo",
  },
  {
    slug: "sombras-6-cubo",
    titulo: "Las sombras del 6-cubo",
    subtitulo: "Tres proyecciones del hexeracto",
    descripcion:
      "El hipercubo de 6 dimensiones no cabe en la pantalla, pero sus sombras sí: el polígono de Petrie de 12 vértices, el cubo de cubos (Q3 por Q3) y los 7 niveles de líneas yang. El mismo objeto, tres siluetas, y los 192 hilos presentes en todas.",
    simbolo: "⬡",
    categoria: "geometria",
    etiquetas: ["hipercubo", "simetrias"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#82a7e8",
    estado: "activo",
  },
  {
    slug: "reticulo-b6",
    titulo: "El retículo booleano B6",
    subtitulo: "El orden parcial de encender líneas",
    descripcion:
      "Un hexagrama está por debajo de otro si toda línea yang suya también lo es en el otro. Ese orden de dominancia forma un retículo de 7 niveles con las mismas 192 aristas del hipercubo, ahora orientadas hacia arriba: de Kun a Qian hay 720 caminos de ascenso.",
    simbolo: "⊑",
    categoria: "geometria",
    etiquetas: ["hipercubo", "binario", "recorridos"],
    tipo: "visualizacion",
    nivel: "avanzado",
    accent: "#8f7fd6",
    estado: "activo",
  },
  {
    slug: "arbol-fuxi",
    titulo: "El árbol de Fu Xi",
    subtitulo: "Cómo se genera el orden binario",
    descripcion:
      "Del taiji a los dos, los cuatro, los ocho... hasta 64: el árbol de bifurcación yin y yang que construye la secuencia de Shao Yong. Cada hoja es un hexagrama y el camino desde la raíz es, literalmente, su lectura en bits.",
    simbolo: "木",
    categoria: "geometria",
    etiquetas: ["binario", "secuencias-historicas", "recorridos"],
    tipo: "visualizacion",
    nivel: "introductorio",
    accent: "#8fae5a",
    estado: "activo",
  },
  {
    slug: "bosque-nuclear",
    titulo: "El bosque nuclear",
    subtitulo: "La dinámica completa del hu gua",
    descripcion:
      "Cada hexagrama apunta a su nuclear: un mapa de 64 flechas que colapsa rápido. La imagen cae de 64 a 16 (los nucleares clásicos) y de 16 a 4, hasta 3 atractores: dos puntos fijos y un ciclo de 2 (4 hexagramas atractores).",
    simbolo: "互",
    categoria: "algebra",
    etiquetas: ["hu-gua", "particiones", "hipercubo"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#b08968",
    estado: "activo",
  },
  {
    slug: "matriz-nuclear",
    titulo: "El operador nuclear como matriz",
    subtitulo: "El hu gua es un mapa lineal sobre F2",
    descripcion:
      "Como cada línea del hexagrama nuclear copia una línea del original, hu gua es lineal: hay una matriz M de 6×6 con M·x = hu gua(x). Su cadena de rangos 6→4→2 explica las imágenes 64→16→4 del bosque, y M⁴=M² produce el único ciclo, Ji Ji con Wei Ji.",
    simbolo: "M",
    categoria: "algebra",
    etiquetas: ["hu-gua", "algebra-lineal", "binario"],
    tipo: "visualizacion",
    nivel: "avanzado",
    accent: "#b8926a",
    estado: "activo",
  },
  {
    slug: "serpiente-debruijn",
    titulo: "La serpiente de De Bruijn",
    subtitulo: "Los 64 hexagramas en un anillo de 64 bits",
    descripcion:
      "Un anillo de 64 líneas yin/yang donde cada ventana de 6 consecutivas es un hexagrama distinto: los 64 aparecen superpuestos, una vez cada uno. La compresión máxima del libro, en la secuencia de De Bruijn canónica; y hay 2²⁶ anillos así.",
    simbolo: "⟳",
    categoria: "geometria",
    etiquetas: ["recorridos", "binario", "hipercubo"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#63b6a6",
    estado: "activo",
  },
];

export const EXPERIMENTOS: Experimento[] = BASE.map((e, i) => ({
  ...e,
  n: i + 1,
}));

export const EXPERIMENTOS_ACTIVOS = EXPERIMENTOS.filter(
  (e) => e.estado === "activo",
);

export function getExperimento(slug: string): Experimento | undefined {
  return EXPERIMENTOS.find((e) => e.slug === slug);
}

/** Cuántos experimentos activos hay por categoría. */
export function conteoPorCategoria(): Record<Categoria, number> {
  const out = Object.fromEntries(CATEGORIAS.map((c) => [c, 0])) as Record<
    Categoria,
    number
  >;
  for (const e of EXPERIMENTOS_ACTIVOS) out[e.categoria]++;
  return out;
}

/** Etiquetas del vocabulario que ningún experimento publicado usa todavía.
 *  (Reservadas para experimentos del catálogo aún no construidos.) */
export function etiquetasSinUso(): Etiqueta[] {
  const usadas = new Set(EXPERIMENTOS.flatMap((e) => e.etiquetas));
  return ETIQUETAS.filter((t) => !usadas.has(t));
}
