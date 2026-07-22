/**
 * Registro de experimentos — fuente de verdad del menú.
 *
 * Para añadir un experimento nuevo:
 *   1. Añade una entrada a este arreglo.
 *   2. Crea app/experimentos/<slug>/page.tsx.
 * El menú de la portada se genera solo desde aquí.
 */

export type Categoria = "Geometría" | "Historia" | "Oráculo" | "Álgebra";
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
  /** Color de acento (de la paleta de líneas). */
  accent: string;
  estado: Estado;
  destacado?: boolean;
}

/** Entradas sin número: el orden de este arreglo ES la numeración.
 *  Reordenar experimentos = reordenar aquí, nada más. */
const BASE: Omit<Experimento, "n">[] = [
  {
    slug: "hipercubo",
    titulo: "El hipercubo del I Ching",
    subtitulo: "64 hexagramas · 192 mutaciones · un recorrido Gray",
    descripcion:
      "El anillo de los 64 hexagramas y las 192 aristas que forman el hipercubo de 6 dimensiones. Compara el orden Fu Xi (binario) con el del Rey Wen y recorre los 64 estados cambiando una sola línea por paso.",
    simbolo: "䷀",
    categoria: "Geometría",
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
    categoria: "Historia",
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
    categoria: "Oráculo",
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
    categoria: "Oráculo",
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
    categoria: "Álgebra",
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
    categoria: "Oráculo",
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
    categoria: "Historia",
    accent: "#cf9b5b",
    estado: "activo",
  },
  {
    slug: "shao-yong",
    titulo: "El cuadrado y el círculo",
    subtitulo: "El diagrama de Shao Yong que vio Leibniz",
    descripcion:
      "Los 64 hexagramas dispuestos a la vez en un cuadrado 8×8 y en un círculo, en orden binario. Es el diagrama que Bouvet envió a Leibniz hacia 1701: leerlo en orden es, literalmente, contar de 0 a 63.",
    simbolo: "圓",
    categoria: "Historia",
    accent: "#6fa8b0",
    estado: "activo",
  },
  {
    slug: "permutacion",
    titulo: "Rey Wen como permutación",
    subtitulo: "Cuánto desordena el libro la geometría",
    descripcion:
      "Si Fu Xi es la identidad, el Rey Wen es una permutación de los 64 números. La descomponemos en ciclos y medimos su desorden: puntos fijos, orden, paridad e inversiones.",
    simbolo: "σ",
    categoria: "Álgebra",
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
    categoria: "Oráculo",
    accent: "#c8873a",
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
