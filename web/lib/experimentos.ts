/**
 * Registro de experimentos: fuente de verdad del menú.
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

export const CATEGORIA_INFO: Record<
  Categoria,
  { nombre: string; desc: string; color: string }
> = {
  geometria: {
    nombre: "Geometría",
    desc: "El cubo de 6 dimensiones y sus formas",
    color: "#5B8FD9",
  },
  algebra: {
    nombre: "Álgebra",
    desc: "Grupos, matrices, particiones, espectros",
    color: "#9C6BC9",
  },
  historia: {
    nombre: "Historia",
    desc: "Los órdenes tradicionales y sus documentos",
    color: "#E5C558",
  },
  azar: {
    nombre: "Azar",
    desc: "Probabilidades, cadenas, paseos, simulaciones",
    color: "#E24B3B",
  },
  practica: {
    nombre: "Tu práctica",
    desc: "Herramientas sobre tus propias consultas",
    color: "#5FAE7F",
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
  | "combinatoria"
  | "fisica"
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
  "combinatoria",
  "fisica",
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
  combinatoria: { nombre: "combinatoria", def: "Conteo puro: cuántos objetos cumplen una regla (Fibonacci, Lucas, Pascal)" },
  fisica: { nombre: "física", def: "Modelos de la física estadística sobre los hexagramas (Ising, energía, temperatura)" },
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
  /** Pista de uso: una línea con verbo de acción y qué obtiene el lector.
   *  Las páginas de tipo referencia llevan el texto fijo de referencia. */
  comoUsar: string;
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
  /**
   * Sello de hallazgo propio: resultado original del laboratorio que, tras una busqueda
   * de originalidad documentada, no hemos encontrado publicado en otra parte. Marcador
   * ortogonal (el experimento conserva su categoria); en el menu se ve como una seccion
   * mas. Solo se concede cumpliendo las tres reglas (ver /fundamentos): afirmaciones
   * centrales tipo teorema o calculo, busqueda con fecha y nota, y copy con la humildad
   * exacta del descargo del exp. 29.
   */
  hallazgoPropio?: { busquedaFecha: string; busquedaNota: string };
}

// Candidatos a hallazgo propio (cada uno exige su propia busqueda de originalidad
// documentada ANTES del sello; se haran uno por uno en turnos futuros, sin efecto visible
// por ahora): rey-wen-aleatorio (el test del empate), espectro-walsh (77,4% de ordenes
// pares en Walsh), comparador-particiones (ARI palacios contra cosets), permutacion (el
// empate 1013/1008/1008 y los costos en lineas).

/** Entradas sin número: el orden de este arreglo ES la numeración. */
const BASE: Omit<Experimento, "n">[] = [
  {
    slug: "hipercubo",
    titulo: "El hipercubo del I Ching",
    subtitulo: "64 hexagramas · 192 mutaciones · un recorrido Gray",
    comoUsar:
      "Toca cualquier hexagrama del anillo para ver sus seis mutaciones y su valor binario.",
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
    comoUsar:
      "Toca una casa de la tabla para ver qué líneas la separan del hexagrama puro de su palacio.",
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
    comoUsar:
      "Clic en cada línea para ponerla yin o yang, marca las mutantes y mira el salto resultante.",
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
    comoUsar:
      "Elige cuántas lecturas simular y compara barra a barra las monedas contra la milenrama.",
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
    comoUsar:
      "Toca un hexagrama para recorrer su órbita bajo volteo (fan) y opuesto (dui).",
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
    comoUsar:
      "Registra tus consultas o genera un ejemplo para ver tu historial como ruta por los 64.",
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
    comoUsar:
      "Toca un par para ver si se forma por volteo (fan) o por opuesto (dui).",
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
    comoUsar:
      "Toca un hexagrama del cuadrado o el círculo, y aplica las ocho simetrías para seguirlo.",
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
    comoUsar:
      "Toca un ciclo para ver por dónde pasa, y compara los cuatro órdenes históricos.",
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
    comoUsar:
      "Echa las 49 varillas línea a línea, o simula miles y mira converger las fracciones.",
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
    comoUsar:
      "Alterna entre Cielo Anterior y Posterior y mira viajar cada trigrama a su nueva posición.",
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
    comoUsar:
      "Cambia de proyección y toca un hexagrama para seguirlo en las tres sombras del cubo.",
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
    comoUsar:
      "Elige un hexagrama y mira su cono: cuántos quedan por encima y cuántos por debajo.",
    descripcion:
      "Un hexagrama está por debajo de otro si toda línea yang suya también lo es en el otro. Ese orden de dominancia forma un retículo de 7 niveles con las mismas 192 aristas del hipercubo, ahora orientadas hacia arriba: de Kun a Qian hay 720 caminos de ascenso.",
    simbolo: "⊑",
    categoria: "geometria",
    etiquetas: ["hipercubo", "binario", "recorridos", "combinatoria"],
    tipo: "visualizacion",
    nivel: "avanzado",
    accent: "#8f7fd6",
    estado: "activo",
  },
  {
    slug: "arbol-fuxi",
    titulo: "El árbol de Fu Xi",
    subtitulo: "Cómo se genera el orden binario",
    comoUsar:
      "Toca una hoja del árbol y mira cómo cada bifurcación yin o yang escribe uno de sus bits.",
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
    comoUsar:
      "Elige un hexagrama y sigue sus flechas nucleares hasta el atractor donde acaba cayendo.",
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
    comoUsar:
      "Elige un hexagrama y comprueba que multiplicarlo por la matriz M da su nuclear.",
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
    comoUsar:
      "Desliza la ventana de seis por el anillo y comprueba que nunca se repite un hexagrama.",
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
  {
    slug: "grupo-sierpinski",
    titulo: "El grupo (Z/2)⁶ y el Sierpinski",
    subtitulo: "XOR, ocho cosets y un fractal que sale de Pascal",
    comoUsar:
      "Toca un hexagrama para ver su coset (upper XOR lower) y los siete que lo acompañan.",
    descripcion:
      "Con XOR, los 64 hexagramas forman el grupo (Z/2)⁶; los 8 puros son un subgrupo cuyos 8 cosets particionan el conjunto. Y la matriz de dominancia (j submáscara de i) coincide con Pascal mod 2 por el teorema de Lucas: dibujada, es el triángulo de Sierpinski, la sombra del retículo B6.",
    simbolo: "⊕",
    categoria: "algebra",
    etiquetas: ["teoria-de-grupos", "particiones", "binario"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#9a86c8",
    estado: "activo",
  },
  {
    slug: "rey-wen-aleatorio",
    titulo: "¿Es el Rey Wen aleatorio?",
    subtitulo: "El empate 1013 puesto a prueba",
    comoUsar:
      "Mira dónde cae el 1013 real dentro de la campana de la nula y lee su p-valor.",
    descripcion:
      "Convertimos el hallazgo del empate en un test de hipótesis. Bajo la nula (un barajado que respeta su regla de pares), las 1013 inversiones del Rey Wen caen en el centro exacto de la campana: es indistinguible de aleatorio, y también en el costo en líneas. Un hallazgo legítimo, no un fracaso.",
    simbolo: "≟",
    categoria: "historia",
    etiquetas: ["estadistica", "permutaciones", "secuencias-historicas"],
    tipo: "test",
    nivel: "avanzado",
    accent: "#a89a5e",
    estado: "activo",
  },
  {
    slug: "markov-consultas",
    titulo: "La cadena de Markov de las consultas",
    subtitulo: "¿Hacia dónde deriva una serie de lecturas?",
    comoUsar:
      "Pulsa Simular para encadenar consultas y ver a qué estacionaria tiende cada método.",
    descripcion:
      "Encadenar consultas define una cadena de Markov sobre los 64 estados. Con monedas la estacionaria es uniforme; con milenrama se sesga al yin (Kun es 729 veces más probable que Qian), porque el yang viejo muta más que el yin viejo. Ambos mezclan a la misma velocidad, pero a destinos distintos.",
    simbolo: "π",
    categoria: "azar",
    etiquetas: ["probabilidad", "adivinacion", "hipercubo"],
    tipo: "simulador",
    nivel: "avanzado",
    accent: "#6a9fd0",
    estado: "activo",
  },
  {
    slug: "comparador-sorteo",
    titulo: "Comparador de métodos de sorteo",
    subtitulo: "Monedas, milenrama y 16 fichas",
    comoUsar:
      "Pulsa Tirar para simular 50.000 líneas y comparar los tres métodos con su distribución exacta.",
    descripcion:
      "Tres formas de echar una línea, lado a lado, con sus distribuciones exactas y un simulador que converge a ellas. Monedas y milenrama no son intercambiables; las 16 fichas reproducen la milenrama por construcción. Útil para quien consulta de verdad.",
    simbolo: "⚄",
    categoria: "azar",
    etiquetas: ["adivinacion", "probabilidad", "estadistica"],
    tipo: "simulador",
    nivel: "introductorio",
    accent: "#d98f6b",
    estado: "activo",
  },
  {
    slug: "comparador-particiones",
    titulo: "Comparador de particiones",
    subtitulo: "¿Cuánto se parecen dos formas de agrupar los 64?",
    comoUsar:
      "Elige dos particiones de los 64 y compara cuánto coinciden con el índice de Rand ajustado.",
    descripcion:
      "Toma dos particiones cualesquiera de los 64 (palacios, cuencas nucleares, cosets, trigramas) y mide su similitud con el índice de Rand ajustado, más la matriz de cruce. Hallazgo: los palacios no son los cosets (ARI −0,125), porque las 8 máscaras de generación no forman subgrupo.",
    simbolo: "≈",
    categoria: "algebra",
    etiquetas: ["particiones", "estadistica"],
    tipo: "calculadora",
    nivel: "avanzado",
    accent: "#7f8fd0",
    estado: "activo",
  },
  {
    slug: "espectro-walsh",
    titulo: "Fourier sobre el cubo: la transformada de Walsh-Hadamard",
    subtitulo: "El análisis de Fourier sobre el grupo (Z/2)⁶",
    comoUsar:
      "Recorre la energía por orden y mira en qué interacciones de líneas vive la estructura.",
    descripcion:
      "La transformada de Walsh descompone la secuencia del Rey Wen en los 64 caracteres del cubo. La mitad de su energía (sin la media) vive en interacciones de orden 2, entre pares de líneas; casi nada en la estructura lineal. Complementa el test de aleatoriedad diciendo en qué frecuencias se aparta.",
    simbolo: "≋",
    categoria: "algebra",
    etiquetas: ["algebra-lineal", "secuencias-historicas", "estadistica"],
    tipo: "test",
    nivel: "avanzado",
    accent: "#5aa0a8",
    estado: "activo",
  },
  {
    slug: "conteos-astronomicos",
    titulo: "Conteos astronómicos del cubo",
    subtitulo: "Los números grandes de Q6, con fuente",
    comoUsar:
      "Página de referencia, para leer",
    descripcion:
      "Página de referencia con las cifras del hipercubo de los hexagramas: 46080 automorfismos (2⁶·6!), 2²⁶ secuencias de De Bruijn, la distribución C(6,k) por distancia, 720 cadenas. Los computables se verifican; los enormes (códigos Gray cíclicos de Q6) se citan a OEIS. Ninguna cifra sin fuente.",
    simbolo: "∞",
    categoria: "geometria",
    etiquetas: ["hipercubo", "recorridos", "combinatoria"],
    tipo: "referencia",
    nivel: "intermedio",
    accent: "#8a9bb0",
    estado: "activo",
  },
  {
    slug: "paseo-aleatorio",
    titulo: "Paseo aleatorio y cobertura",
    subtitulo: "Cuánto tarda un caminante en ver los 64",
    comoUsar:
      "Lanza el caminante y mira cuántos pasos tarda en visitar los 64 hexagramas.",
    descripcion:
      "Un caminante que muta una línea al azar por paso sobre el hipercubo. El tiempo esperado de retorno al origen es exactamente 64 (por la estacionaria uniforme); la cobertura de los 64 estados ronda los 360 pasos. Con animación del recorrido y simulación.",
    simbolo: "↝",
    categoria: "azar",
    etiquetas: ["probabilidad", "recorridos", "hipercubo"],
    tipo: "simulador",
    nivel: "intermedio",
    accent: "#6ab0a0",
    estado: "activo",
  },
  {
    slug: "leibniz-documentos",
    titulo: "Leibniz: los documentos",
    subtitulo: "Bouvet, Shao Yong y la aritmética binaria de 1703",
    comoUsar:
      "Página de referencia, para leer",
    descripcion:
      "La cronología documentada del encuentro entre el I Ching y el binario europeo: Shao Yong, la carta de Bouvet (1701) y la Explication de l'Arithmétique Binaire de Leibniz (1703). Cada afirmación con su fuente.",
    simbolo: "✉",
    categoria: "historia",
    etiquetas: ["leibniz", "binario"],
    tipo: "referencia",
    nivel: "introductorio",
    accent: "#b89a6a",
    estado: "activo",
    descargo:
      "Los chinos no practicaban aritmética binaria: Shao Yong buscaba cosmología, y fue Leibniz quien reconoció la identidad estructural con el binario que ya había inventado.",
  },
  {
    slug: "codones",
    titulo: "Los 64 codones",
    subtitulo: "El código genético también tiene 64 = 2⁶",
    comoUsar:
      "Cambia la codificación de bases a bits y mira cómo se reordena el mapa; toca un codón para el detalle.",
    descripcion:
      "El código genético tiene 64 = 4³ = 2⁶ elementos, como los hexagramas. La correspondencia es un isomorfismo combinatorio, no un hecho biológico: depende de una de las 4! = 24 codificaciones base a bits, ninguna canónica. El experimento lo demuestra dejando cambiar la codificación.",
    simbolo: "遺",
    categoria: "algebra",
    etiquetas: ["interdisciplinar", "binario"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#7cbf8a",
    estado: "activo",
    descargo:
      "La coincidencia de número (64) permite emparejar hexagramas y codones, pero es un isomorfismo de estructura, no un hecho biológico ni una afinidad mística. La correspondencia es real como forma y arbitraria en los detalles.",
  },
  {
    slug: "calendario-soberanos",
    titulo: "El calendario de los soberanos",
    subtitulo: "Los 12 hexagramas del flujo y reflujo del año",
    comoUsar:
      "Pulsa play para recorrer el año mes a mes y mira qué línea cambia en cada paso.",
    descripcion:
      "La tradición Han apartó 12 hexagramas soberanos (bi gua) y los asignó a los meses lunares. Leídos en orden, el yang sube una línea por mes y el yin lo vacía después: un ciclo Gray cerrado de 12 aristas sobre el hipercubo. Verificamos sus cuatro propiedades; la asignación a los meses es tradición documentada, no un teorema.",
    simbolo: "辟",
    categoria: "historia",
    etiquetas: ["secuencias-historicas", "recorridos", "hipercubo"],
    tipo: "visualizacion",
    nivel: "introductorio",
    accent: "#d99a4e",
    estado: "activo",
  },
  {
    slug: "fibonacci-hexagrama",
    titulo: "Fibonacci en el hexagrama",
    subtitulo: "Contar sin dos yin seguidos dibuja la sucesión",
    comoUsar:
      "Recorre la escalera y deja que el color explique la recurrencia, o abre el Venn: en la intersección solo quedan Ji Ji y Wei Ji.",
    descripcion:
      "Los hexagramas cuyas líneas yin nunca son adyacentes son exactamente 21 = F(8), y la escalera por número de líneas es F(n+2). Son los conjuntos independientes del camino de 6 vértices; en la versión circular, del ciclo, y el conteo baja a 18 = L(6). La intersección con la regla del yang deja solo Ji Ji y Wei Ji.",
    simbolo: "斐",
    categoria: "algebra",
    etiquetas: ["combinatoria", "binario", "simetrias"],
    tipo: "visualizacion",
    nivel: "introductorio",
    accent: "#5ab89a",
    estado: "activo",
    hallazgoPropio: {
      busquedaFecha: "2026-07-23",
      busquedaNota:
        "búsqueda web de la formulación (21 = F(8) sin dos yin consecutivos, escalera F(n+2), Lucas en la versión circular, intersección Ji Ji / Wei Ji); solo se encontró numerología (offsets de Fibonacci sobre el bagua, razón áurea en el Rey Wen); ninguna formulación verificada equivalente.",
    },
  },
  {
    slug: "ising-hexagrama",
    titulo: "El hexagrama como cadena de espines",
    subtitulo: "El modelo de Ising sobre las seis líneas",
    comoUsar:
      "Mueve la temperatura y el signo de J y mira la probabilidad de Boltzmann pasar de uniforme a concentrarse en unos pocos hexagramas.",
    descripcion:
      "Un hexagrama es una cadena de 6 espines (yang = +1, yin = -1). Con energía E = -J por la suma de productos de líneas vecinas, las probabilidades de Boltzmann y la matriz de transferencia dan Z abierta = 199,384322 y Z de anillo = 262,456561 a beta = 0,7. Al enfriar se ordena gradualmente: en 1D no hay transición de fase (Ising, 1925).",
    simbolo: "⇅",
    categoria: "azar",
    etiquetas: ["probabilidad", "hipercubo", "fisica"],
    tipo: "simulador",
    nivel: "intermedio",
    accent: "#e2704b",
    estado: "activo",
    descargo:
      "La conexión con el I Ching es identidad matemática de estructura (los mismos 64 estados, la misma matriz de transferencia que el experimento 29), no una afirmación física sobre el oráculo.",
  },
  {
    slug: "entropia-oraculo",
    titulo: "La entropía del oráculo",
    subtitulo: "Cuánta información da cada método, en bits",
    comoUsar:
      "Compara la entropía de cada método barra a barra y separa cuánta información está en el valor yin/yang y cuánta en el movimiento.",
    descripcion:
      "Un hexagrama uniforme son 6 bits, el máximo para 64 estados. Una línea de monedas tiene 1,8113 bits y una de milenrama 1,7490: el método antiguo da 0,0623 bits menos por línea, y la diferencia vive toda en el movimiento, porque el valor yin/yang puro es 1 bit en ambos. La entropía de Shannon (1948), aplicada al oráculo.",
    simbolo: "熵",
    categoria: "azar",
    etiquetas: ["probabilidad", "adivinacion", "estadistica"],
    tipo: "visualizacion",
    nivel: "introductorio",
    accent: "#d98f6b",
    estado: "activo",
  },
  {
    slug: "matriz-transferencia",
    titulo: "La matriz de transferencia: diseña tu regla",
    subtitulo: "Elige qué líneas pueden ir juntas y cuenta",
    comoUsar:
      "Elige qué adyacencias de líneas permites y mira la matriz, sus potencias, la sucesión de conteos y su autovalor dominante.",
    descripcion:
      "Generaliza el experimento 29: cada regla de adyacencia entre líneas es una matriz 2x2 cuyas potencias dan los conteos por número de líneas, cuya traza da los cíclicos y cuyo autovalor dominante es la razón de crecimiento (φ para Fibonacci, 2 para libre). Con la sección de Catalan y por qué la transformada z sí aplica al I Ching y la de Laplace no.",
    simbolo: "T",
    categoria: "algebra",
    etiquetas: ["combinatoria", "algebra-lineal", "binario"],
    tipo: "calculadora",
    nivel: "avanzado",
    accent: "#8f7fd6",
    estado: "activo",
  },
  {
    slug: "espectro-q6",
    titulo: "El espectro del hipercubo",
    subtitulo: "Los autovalores de Q6 son los niveles de yang",
    comoUsar:
      "Recorre los siete autovalores del hipercubo con su multiplicidad y compáralos con los niveles del retículo y con el paseo aleatorio.",
    descripcion:
      "Los autovalores de la matriz de adyacencia de Q6 son 6-2k con multiplicidad C(6,k): {6:1, 4:6, 2:15, 0:20, -2:15, -4:6, -6:1}. Las multiplicidades son los niveles de yang del retículo B6, y el espectro del paseo aleatorio simple es este dividido por 6, lo que explica su velocidad de mezcla desde el teorema.",
    simbolo: "λ",
    categoria: "algebra",
    etiquetas: ["algebra-lineal", "hipercubo"],
    tipo: "visualizacion",
    nivel: "avanzado",
    accent: "#7f8fd0",
    estado: "activo",
  },
  {
    slug: "fourier-anillo",
    titulo: "El Fourier del anillo",
    subtitulo: "La DFT sobre el círculo Z/64 de Shao Yong",
    comoUsar:
      "Recorre el espectro de magnitudes por frecuencia y descubre qué armónico cíclico domina la secuencia del Rey Wen sobre el círculo.",
    descripcion:
      "El círculo de Shao Yong es Z/64, y la transformada discreta de Fourier descompone cualquier secuencia sobre él en armónicos cíclicos. Aplicada al Rey Wen, el armónico dominante es k=8 (el periodo de los ocho trigramas). La misma señal que el espectro de Walsh, en otra geometría: el círculo en vez del cubo.",
    simbolo: "圜",
    categoria: "algebra",
    etiquetas: ["algebra-lineal", "secuencias-historicas", "hipercubo"],
    tipo: "visualizacion",
    nivel: "avanzado",
    accent: "#5aa0a8",
    estado: "activo",
  },
  {
    slug: "influencias-lineas",
    titulo: "Las influencias de las líneas",
    subtitulo: "Cuánto pesa cada línea en una propiedad",
    comoUsar:
      "Elige una propiedad y mira cuánto pesa cada línea en el veredicto; compara la influencia total con la suma espectral de Walsh.",
    descripcion:
      "Toda propiedad de hexagramas es una función booleana de 6 variables; la influencia de la línea k es la probabilidad de que voltearla cambie el veredicto. Para la regla sin dos yin, las líneas 2 y 5 pesan más (22/64) y las extremas menos (10/64); para la paridad de yang, toda línea influye 1. La influencia total es la suma espectral de Walsh.",
    simbolo: "∂",
    categoria: "algebra",
    etiquetas: ["combinatoria", "algebra-lineal", "binario"],
    tipo: "calculadora",
    nivel: "intermedio",
    accent: "#b57bb0",
    estado: "activo",
  },
  {
    slug: "cubo-dice-no",
    titulo: "El cubo dice que no",
    subtitulo: "Tres teoremas de imposibilidad sobre Q6",
    comoUsar:
      "Recorre los tres actos: el código máximo de 8 palabras, la bipartición que cruzan todas las aristas, y los 14 collares de Pólya.",
    descripcion:
      "Los primeros teoremas de imposibilidad del sitio: a lo sumo 8 hexagramas se corrigen entre sí a distancia 3 (la cota de empaquetado da 9, pero no hay código perfecto porque 7 no divide 64); los 32 de yang par y los 32 de impar forman una bipartición que toda arista cruza (Q6 es bipartito); y hay 14 collares de Pólya bajo rotación, 13 pulseras con reflejo.",
    simbolo: "無",
    categoria: "geometria",
    etiquetas: ["combinatoria", "hipercubo", "teoria-de-grupos"],
    tipo: "visualizacion",
    nivel: "intermedio",
    accent: "#d0563f",
    estado: "activo",
  },
  {
    slug: "prosodia-sanscrita",
    titulo: "Los poetas que contaron primero",
    subtitulo: "Fibonacci en la prosodia sánscrita, siglos antes",
    comoUsar:
      "Toca una figura sin dos yin y mira su metro sánscrito: cada yin con el yang de arriba es una sílaba larga; los 21 coinciden.",
    descripcion:
      "La prosodia sánscrita contaba los metros de sílabas cortas (1) y largas (2), y la cuenta cumple C(n) = C(n-1) + C(n-2): 1, 2, 3, 5, 8, 13, 21, los números de Fibonacci, formulados por Virahanka, Gopala y Hemachandra siglos antes. Las 21 figuras de 6 líneas sin dos yin están en biyección con los 21 metros de duración 7: dos civilizaciones contaron lo mismo.",
    simbolo: "⏑",
    categoria: "historia",
    etiquetas: ["combinatoria", "secuencias-historicas", "binario"],
    tipo: "visualizacion",
    nivel: "introductorio",
    accent: "#c99a52",
    estado: "activo",
  },
  {
    slug: "cage-musica-azar",
    titulo: "Cage: la música del azar",
    subtitulo: "El I Ching como motor de composición (1951)",
    comoUsar:
      "Pulsa para tirar las monedas seis veces, selecciona una sonoridad de la carta demostrativa y encadena una frase, como hacía Cage.",
    descripcion:
      "A fines de 1950 John Cage recibió el I Ching, construyó cartas de 64 valores indexadas por los hexagramas y las seleccionó con tiradas de monedas; Music of Changes (1951) es la obra fundacional de la composición por azar. Documentamos el método, no la obra: la demo usa una carta propia y el motor de monedas del experimento 21.",
    simbolo: "♪",
    categoria: "historia",
    etiquetas: ["interdisciplinar", "adivinacion", "secuencias-historicas"],
    tipo: "simulador",
    nivel: "introductorio",
    accent: "#8a9bb0",
    estado: "activo",
    descargo:
      "Documentamos el método compositivo, no la obra de Cage: la demo usa una carta demostrativa propia y no reproduce sus cartas, partituras ni fragmentos (copyright). La conexión es histórica (Pritchett, 1993), no una afirmación sobre el oráculo.",
  },
];

export const EXPERIMENTOS: Experimento[] = BASE.map((e, i) => ({
  ...e,
  n: i + 1,
}));

export const EXPERIMENTOS_ACTIVOS = EXPERIMENTOS.filter(
  (e) => e.estado === "activo",
);

/** Experimentos con sello de hallazgo propio (vista ortogonal, no una categoría). */
export const HALLAZGOS_PROPIOS: Experimento[] = EXPERIMENTOS.filter(
  (e) => e.hallazgoPropio,
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
