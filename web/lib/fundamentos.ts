/**
 * Sistema de fundamentos y fuentes del laboratorio.
 *
 * FUENTE UNICA de referencias: docs/evidencias-fundamentos.md. Ninguna referencia se
 * cita de memoria; cada ficha de BIBLIOGRAFIA es copia verbatim de la seccion B del
 * documento, y su render APA se congela en el campo `apa` (scripts/experimentos.py
 * comprueba que ese render aparece en el documento). Las entradas pendientes de la
 * seccion D (wilhelm; autoria de las 16 fichas; paginas de la Explication) NO se citan.
 *
 * Cita corta autor-fecha para bloques y popovers: (Nielsen, 2003). La referencia
 * completa vive en /fundamentos, alfabetica por apellido. Guiones: los rangos de
 * paginas y anios usan guion medio (en dash) como manda APA; el guion largo (em dash)
 * sigue prohibido en toda prosa, comentario y copy del proyecto.
 */
import { EXPERIMENTOS } from "./experimentos";

// === Bibliografia ===

export type ClaveBiblio =
  | "shaughnessy1996"
  | "nielsen2003"
  | "ryan1996"
  | "leibniz1703"
  | "debruijn1946"
  | "fkm1978"
  | "oeis-a003042"
  | "knuth4a"
  | "oeis-a000045"
  | "oeis-a000032";

export type TipoFicha = "libro" | "articulo" | "actas" | "obra-referencia" | "recurso-web";

export interface Ficha {
  clave: ClaveBiblio;
  tipo: TipoFicha;
  autores: string;
  anio: string;
  titulo: string;
  contenedor?: string;
  volumen?: string;
  numero?: string;
  paginas?: string;
  detalle?: string;
  editorial?: string;
  isbn?: string;
  doi?: string;
  url?: string;
  /** Cita corta autor-fecha para el texto. */
  citaCorta: string;
  /** Clave de ordenacion alfabetica por apellido. */
  orden: string;
  /** Render APA congelado desde el documento de evidencias (verbatim, sin markdown). */
  apa: string;
}

export const BIBLIOGRAFIA: Record<ClaveBiblio, Ficha> = {
  shaughnessy1996: {
    clave: "shaughnessy1996",
    tipo: "libro",
    autores: "Shaughnessy, E. L.",
    anio: "1996",
    titulo:
      "I Ching: The classic of changes: The first English translation of the newly discovered second-century B.C. Mawangdui texts",
    editorial: "Ballantine Books",
    isbn: "0-345-36243-8",
    citaCorta: "Shaughnessy, 1996",
    orden: "Shaughnessy",
    apa: "Shaughnessy, E. L. (1996). I Ching: The classic of changes: The first English translation of the newly discovered second-century B.C. Mawangdui texts. Ballantine Books. ISBN 0-345-36243-8.",
  },
  nielsen2003: {
    clave: "nielsen2003",
    tipo: "libro",
    autores: "Nielsen, B.",
    anio: "2003",
    titulo:
      "A companion to Yi jing numerology and cosmology: Chinese studies of images and numbers from Han (202 BCE–220 CE) to Song (960–1279 CE)",
    editorial: "RoutledgeCurzon",
    isbn: "0-7007-1608-4 (rústica 2015: 978-1-138-86267-8)",
    citaCorta: "Nielsen, 2003",
    orden: "Nielsen",
    apa: "Nielsen, B. (2003). A companion to Yi jing numerology and cosmology: Chinese studies of images and numbers from Han (202 BCE–220 CE) to Song (960–1279 CE). RoutledgeCurzon. ISBN 0-7007-1608-4 (rústica 2015: 978-1-138-86267-8).",
  },
  ryan1996: {
    clave: "ryan1996",
    tipo: "articulo",
    autores: "Ryan, J. A.",
    anio: "1996",
    titulo: "Leibniz' binary system and Shao Yong's \"Yijing\"",
    contenedor: "Philosophy East and West",
    volumen: "46",
    numero: "1",
    paginas: "59–90",
    doi: "https://doi.org/10.2307/1399337",
    citaCorta: "Ryan, 1996",
    orden: "Ryan",
    apa: "Ryan, J. A. (1996). Leibniz' binary system and Shao Yong's \"Yijing\". Philosophy East and West, 46(1), 59–90. https://doi.org/10.2307/1399337",
  },
  leibniz1703: {
    clave: "leibniz1703",
    tipo: "obra-referencia",
    autores: "Leibniz, G. W.",
    anio: "1703",
    titulo: "Explication de l'arithmétique binaire",
    contenedor: "Mémoires de l'Académie Royale des Sciences",
    detalle: "año 1703",
    citaCorta: "Leibniz, 1703",
    orden: "Leibniz",
    apa: "Leibniz, G. W. (1703). Explication de l'arithmétique binaire. Mémoires de l'Académie Royale des Sciences, año 1703.",
  },
  debruijn1946: {
    clave: "debruijn1946",
    tipo: "actas",
    autores: "de Bruijn, N. G.",
    anio: "1946",
    titulo: "A combinatorial problem",
    contenedor: "Koninklijke Nederlandse Akademie van Wetenschappen",
    volumen: "49",
    paginas: "758–764",
    citaCorta: "de Bruijn, 1946",
    orden: "Bruijn",
    apa: "de Bruijn, N. G. (1946). A combinatorial problem. Koninklijke Nederlandse Akademie van Wetenschappen, 49, 758–764.",
  },
  fkm1978: {
    clave: "fkm1978",
    tipo: "articulo",
    autores: "Fredricksen, H., & Maiorana, J.",
    anio: "1978",
    titulo: "Necklaces of beads in k colors and k-ary de Bruijn sequences",
    contenedor: "Discrete Mathematics",
    volumen: "23",
    numero: "3",
    paginas: "207–210",
    doi: "https://doi.org/10.1016/0012-365X(78)90002-X",
    citaCorta: "Fredricksen & Maiorana, 1978",
    orden: "Fredricksen",
    apa: "Fredricksen, H., & Maiorana, J. (1978). Necklaces of beads in k colors and k-ary de Bruijn sequences. Discrete Mathematics, 23(3), 207–210. https://doi.org/10.1016/0012-365X(78)90002-X",
  },
  "oeis-a003042": {
    clave: "oeis-a003042",
    tipo: "recurso-web",
    autores: "OEIS Foundation Inc.",
    anio: "s.f.",
    titulo: "Sequence A003042: Number of Hamiltonian cycles on n-cube",
    contenedor: "The On-Line Encyclopedia of Integer Sequences",
    url: "https://oeis.org/A003042",
    citaCorta: "OEIS Foundation, s.f.",
    orden: "OEIS",
    apa: "OEIS Foundation Inc. (s.f.). Sequence A003042: Number of Hamiltonian cycles on n-cube. The On-Line Encyclopedia of Integer Sequences. https://oeis.org/A003042",
  },
  knuth4a: {
    clave: "knuth4a",
    tipo: "libro",
    autores: "Knuth, D. E.",
    anio: "2011",
    titulo: "The art of computer programming: Vol. 4A. Combinatorial algorithms, Part 1",
    editorial: "Addison-Wesley",
    citaCorta: "Knuth, 2011",
    orden: "Knuth",
    apa: "Knuth, D. E. (2011). The art of computer programming: Vol. 4A. Combinatorial algorithms, Part 1. Addison-Wesley.",
  },
  "oeis-a000045": {
    clave: "oeis-a000045",
    tipo: "recurso-web",
    autores: "OEIS Foundation Inc.",
    anio: "s.f.",
    titulo: "Sequence A000045: Fibonacci numbers",
    contenedor: "The On-Line Encyclopedia of Integer Sequences",
    url: "https://oeis.org/A000045",
    citaCorta: "OEIS Foundation, s.f.",
    orden: "OEIS Fibonacci",
    apa: "OEIS Foundation Inc. (s.f.). Sequence A000045: Fibonacci numbers. The On-Line Encyclopedia of Integer Sequences. https://oeis.org/A000045",
  },
  "oeis-a000032": {
    clave: "oeis-a000032",
    tipo: "recurso-web",
    autores: "OEIS Foundation Inc.",
    anio: "s.f.",
    titulo: "Sequence A000032: Lucas numbers",
    contenedor: "The On-Line Encyclopedia of Integer Sequences",
    url: "https://oeis.org/A000032",
    citaCorta: "OEIS Foundation, s.f.",
    orden: "OEIS Lucas",
    apa: "OEIS Foundation Inc. (s.f.). Sequence A000032: Lucas numbers. The On-Line Encyclopedia of Integer Sequences. https://oeis.org/A000032",
  },
};

/** Render APA unico, aplicado en todas partes (nunca formatos a mano por pagina). */
export function renderAPA(f: Ficha): string {
  const cab = `${f.autores} (${f.anio}). `;
  switch (f.tipo) {
    case "libro":
      return `${cab}${f.titulo}. ${f.editorial}.${f.isbn ? ` ISBN ${f.isbn}.` : ""}`;
    case "articulo":
      return `${cab}${f.titulo}. ${f.contenedor}, ${f.volumen}(${f.numero}), ${f.paginas}.${f.doi ? ` ${f.doi}` : ""}`;
    case "actas":
      return `${cab}${f.titulo}. ${f.contenedor}, ${f.volumen}, ${f.paginas}.`;
    case "obra-referencia":
      return `${cab}${f.titulo}. ${f.contenedor}, ${f.detalle}.`;
    case "recurso-web":
      return `${cab}${f.titulo}. ${f.contenedor}. ${f.url}`;
  }
}

/** Segmento que va en cursiva segun APA (titulo de obra, o revista con su volumen). */
export function italicoAPA(f: Ficha): string {
  switch (f.tipo) {
    case "libro":
    case "recurso-web":
      return f.titulo;
    case "articulo":
    case "actas":
      return `${f.contenedor}, ${f.volumen}`;
    case "obra-referencia":
      return f.contenedor ?? "";
  }
}

/** Bibliografia alfabetica por apellido, para /fundamentos. */
export const BIBLIOGRAFIA_ORDENADA: Ficha[] = Object.values(BIBLIOGRAFIA).sort((a, b) =>
  a.orden.localeCompare(b.orden, "es"),
);

// === Afirmaciones ===

export type TipoAfirmacion = "teorema" | "calculo" | "tradicion" | "reconstruccion" | "analogia";

export interface Afirmacion {
  slug: string;
  tipo: TipoAfirmacion;
  /** teorema/calculo (y la analogia): funcion de la suite que lo verifica. */
  respaldo: string | null;
  /** tradicion/reconstruccion/analogia: claves de BIBLIOGRAFIA. */
  claves: ClaveBiblio[];
  texto: string;
  nota?: string;
}

export const TIPO_AFIRMACION_INFO: Record<
  TipoAfirmacion,
  { nombre: string; def: string; marca: string }
> = {
  teorema: {
    nombre: "teorema",
    def: "demostrado y asertado en la suite de verificacion",
    marca: "✓",
  },
  calculo: {
    nombre: "cálculo",
    def: "cómputo propio reproducible (algoritmo, N, semilla) asertado en la suite",
    marca: "✓",
  },
  tradicion: {
    nombre: "tradición documentada",
    def: "hecho histórico con fuente académica o primaria",
    marca: "※",
  },
  reconstruccion: {
    nombre: "reconstrucción académica",
    def: "lectura académica de una fuente, declarada como tal",
    marca: "※",
  },
  analogia: {
    nombre: "analogía con descargo",
    def: "isomorfismo formal con declaración explícita de lo que no se afirma",
    marca: "≈",
  },
};

function a(
  slug: string,
  tipo: TipoAfirmacion,
  respaldo: string | null,
  claves: ClaveBiblio[],
  texto: string,
  nota?: string,
): Afirmacion {
  return { slug, tipo, respaldo, claves, texto, nota };
}

export const AFIRMACIONES: Afirmacion[] = [
  a("hipercubo", "teorema", "verificar_hipercubo", [], "Los 64 hexagramas se corresponden biyectivamente con los enteros 0 a 63, con la linea inferior como bit mas significativo."),
  a("hipercubo", "teorema", "verificar_hipercubo", [], "El codigo Gray reflejado recorre los 64 estados cambiando una sola linea por paso: un ciclo hamiltoniano sobre el hipercubo Q6 de 192 aristas."),
  a("hipercubo", "tradicion", null, ["ryan1996"], "El orden binario (Fu Xi) se asocia tradicionalmente a Shao Yong; la identidad con el conteo binario la reconocio Leibniz, no la cultura que lo produjo."),

  a("palacios", "teorema", "verificar_palacios", [], "Las ocho casas de Jing Fang particionan los 64 hexagramas sin repetir ninguno, generadas por cambios sucesivos de lineas desde los ocho puros."),
  a("palacios", "tradicion", null, ["nielsen2003"], "El sistema de los ocho palacios (bagong) se atribuye a Jing Fang, con el orden Qian, Zhen, Kan, Gen, Kun, Xun, Li, Dui y las generaciones puro, uno a cinco mundos, alma errante (you hun) y alma que regresa (gui hun)."),

  a("mapa-lectura", "teorema", "verificar_hipercubo", [], "Una consulta es un XOR de las lineas mutantes; el hexagrama original y el resultante distan exactamente el numero de lineas que cambiaron (distancia de Hamming en Q6)."),

  a("probabilidades", "calculo", "verificar_oraculo", [], "Con monedas P(yang) = 1/2 en cada linea; con milenrama las probabilidades de linea son 1/16, 3/16, 5/16 y 7/16. Ambos metodos dan P(yang) = 1/2, pero distinta proporcion de lineas viejas."),

  a("simetrias", "teorema", "verificar_simetrias", [], "El grupo de Klein generado por el volteo (fan) y el opuesto (dui) parte los 64 en 20 orbitas; los 8 palindromos son los pares especiales del Rey Wen; el mapa nuclear cae en 3 atractores."),

  a("trayectoria", "teorema", "verificar_hipercubo", [], "El historial de consultas de una persona es un camino por los 64 estados; la distancia entre dos lecturas es la de Hamming en el hipercubo Q6."),

  a("rey-wen", "teorema", "verificar_rey_wen", [], "El orden del Rey Wen agrupa los 64 en 32 pares: 28 por volteo (fan) y 4 por opuesto (dui). Fan conserva el numero de lineas yang; dui lo complementa."),

  a("shao-yong", "teorema", "verificar_shao_yong", [], "Las 64 celdas del cuadrado 8x8 son exactamente 0 a 63; las 8 simetrias geometricas del cuadrado son 8 operaciones de trigramas."),
  a("shao-yong", "tradicion", null, ["ryan1996", "leibniz1703"], "El diagrama de Shao Yong llego a Europa via Bouvet: su carta es del 4 de noviembre de 1701, Leibniz la recibio el 1 de abril de 1703 y publico la Explication ese mismo anio."),

  a("permutacion", "reconstruccion", null, ["shaughnessy1996"], "El orden de Mawangdui organiza los 64 por trigrama superior con una regla fija de trigramas inferiores; es una reconstruccion academica del manuscrito de 1973, no un dato directo."),
  a("permutacion", "calculo", "verificar_ordenes", [], "Como permutacion de Fu Xi, el Rey Wen tiene 1013 inversiones (orden 260), Mawangdui 1008 (orden 600) y Jing Fang 1008; el costo en lineas es 211, 141 y 93."),

  a("ritual-milenrama", "calculo", "verificar_milenrama", [], "La enumeracion exacta de los 4^3 = 64 casos del ritual de las 49 varillas da 3/16, 5/16, 7/16 y 1/16, identica a la tabla del experimento de probabilidades."),

  a("dos-cielos", "teorema", "verificar_dos_cielos", [], "Pasar del bagua del Cielo Anterior al Posterior es una permutacion de dos ciclos de 4; en el Anterior los 4 ejes unen complementos binarios, en el Posterior solo el eje de Li y Kan."),

  a("sombras-6-cubo", "teorema", "verificar_sombras", [], "Las tres proyecciones del hexeracto (poligono de Petrie de 12 vertices, cubo de cubos y niveles de yang) conservan las 192 aristas del hipercubo."),

  a("reticulo-b6", "teorema", "verificar_reticulo", [], "El orden de dominancia (submascara) forma un reticulo de 7 niveles con las 192 aristas orientadas hacia arriba; de Kun a Qian hay 720 = 6! caminos de ascenso."),

  a("arbol-fuxi", "teorema", "verificar_arbol", [], "Las hojas del arbol de bifurcacion yin y yang, de izquierda a derecha, son el orden binario 0 a 63; el camino de la raiz a la hoja coincide bit a bit con las lineas del hexagrama."),
  a("arbol-fuxi", "tradicion", null, ["ryan1996"], "El arbol reconstruye la genesis de la secuencia del Cielo Anterior atribuida a Shao Yong."),

  a("bosque-nuclear", "teorema", "verificar_bosque", [], "El mapa del hu gua colapsa las imagenes 64, 16 y 4 hasta 3 atractores: dos puntos fijos y un ciclo de 2, con cuencas 16, 16 y 32."),

  a("matriz-nuclear", "teorema", "verificar_matriz_nuclear", [], "El hu gua es lineal sobre F2: hay una matriz de 6x6 con rangos 6, 4 y 2, y M^4 = M^2, lo que explica el unico ciclo (Ji Ji con Wei Ji)."),

  a("serpiente-debruijn", "teorema", "verificar_debruijn", ["debruijn1946"], "Existe un anillo de 64 bits cuyas 64 ventanas de 6 consecutivas son los 64 hexagramas, cada uno una sola vez; hay 2^26 anillos asi."),
  a("serpiente-debruijn", "teorema", "verificar_debruijn", ["fkm1978"], "La construccion canonica usada es la de Fredricksen y Maiorana: concatenar las palabras de Lyndon en orden lexicografico da la secuencia de De Bruijn minima."),

  a("grupo-sierpinski", "teorema", "verificar_grupo_sierpinski", [], "Con XOR los 64 forman el grupo (Z/2)^6; los 8 puros son un subgrupo cuyos 8 cosets particionan el conjunto, y la matriz de dominancia es Pascal mod 2 (Lucas), el triangulo de Sierpinski."),

  a("rey-wen-aleatorio", "calculo", "verificar_rey_wen_aleatorio", [], "Bajo su propia regla de pares, el Rey Wen tiene 1013 inversiones, indistinguible de un barajado aleatorio (z = 0.05, p = 0.97), y tambien en el costo en lineas."),
  a("rey-wen-aleatorio", "calculo", "verificar_walsh", [], "El espectro de Walsh lo confirma por otra via: los ordenes pares 2 y 4 concentran el 77.4% de la energia, frente al 47.6% que repartiria el azar."),

  a("markov-consultas", "calculo", "verificar_markov", [], "La cadena de Markov de las consultas tiene estacionaria uniforme con monedas y sesgada al yin con milenrama (Kun es 729 = 3^6 veces mas probable que Qian); ambas mezclan a la misma velocidad."),

  a("comparador-sorteo", "calculo", "verificar_sorteo", [], "Tres metodos de sorteo con sus distribuciones exactas: P(muta) = 1/4 en los tres; el metodo moderno equivalente de 16 fichas (3, 7, 5, 1) reproduce la milenrama por construccion, mientras que las monedas son distintas.", "El metodo de 16 fichas se nombra como metodo moderno equivalente; su autoria queda pendiente de verificar (seccion D del documento de evidencias)."),

  a("comparador-particiones", "calculo", "verificar_particiones", [], "El indice de Rand ajustado mide la similitud entre dos particiones de los 64; palacios y cosets dan ARI = -0.125, mas distintos que el azar, porque las 8 mascaras de generacion no forman subgrupo."),

  a("espectro-walsh", "calculo", "verificar_walsh", [], "La transformada de Walsh del Rey Wen concentra su energia en el orden 2 (50.3%) y en los ordenes pares 2 y 4 (77.4%), frente al 47.6% del azar: su unica estructura son correlaciones entre lineas."),

  a("conteos-astronomicos", "calculo", "verificar_conteos", [], "Los conteos del cubo: 46080 automorfismos (2^6 por 6!), 2^26 secuencias de De Bruijn, las distancias C(6,k) = 1, 6, 15, 20, 15, 6, 1 y 720 cadenas de Kun a Qian."),
  a("conteos-astronomicos", "calculo", "verificar_conteos", ["oeis-a003042", "knuth4a"], "El numero de codigos Gray ciclicos de Q6 se cita a OEIS sin reproducir sus digitos; Knuth es la referencia general de codigos Gray y secuencias de De Bruijn.", "Cifra citada, no reproducida."),

  a("paseo-aleatorio", "calculo", "verificar_paseo", [], "El paseo aleatorio sobre Q6 tiene estacionaria uniforme; el tiempo esperado de retorno al origen es exactamente 64 y la cobertura de los 64 estados ronda los 360 pasos."),

  a("leibniz-documentos", "tradicion", null, ["ryan1996"], "Los chinos no practicaban aritmetica binaria: Shao Yong buscaba cosmologia y fue Leibniz, con su binario ya inventado, quien reconocio la identidad estructural."),
  a("leibniz-documentos", "tradicion", null, ["leibniz1703", "ryan1996"], "Cronologia documentada: Bouvet comunico la analogia en carta del 4 de noviembre de 1701, recibida por Leibniz el 1 de abril de 1703; la Explication de l'arithmetique binaire aparecio en 1703."),

  a("codones", "analogia", "verificar_codones", [], "El codigo genetico tiene 64 = 4^3 = 2^6 codones, como los hexagramas, pero la correspondencia es un isomorfismo combinatorio, no un hecho biologico: depende de una de las 24 codificaciones base a bits, ninguna canonica.", "Analogia con descargo: la coincidencia de numero es real como forma y arbitraria en los detalles; el codigo estandar se cita en el propio experimento (NCBI), que no forma parte de esta bibliografia."),

  a("calendario-soberanos", "teorema", "verificar_soberanos", [], "Los 12 bi gua cumplen cuatro propiedades: forman un ciclo Gray cerrado, la linea que cambia avanza 2, 3, 4, 5, 6, 1, los meses opuestos son complementos dui y son exactamente los 12 hexagramas monotonos de Q6."),
  a("calendario-soberanos", "tradicion", null, ["nielsen2003"], "Los 12 bi gua (xiaoxi gua) se asociaron a los 12 meses lunares en la tradicion Han, ligada a Meng Xi y al sistema gua qi."),

  a("fibonacci-hexagrama", "teorema", "verificar_fibonacci", ["oeis-a000045"], "Los hexagramas sin dos yin consecutivos (y, por simetria, sin dos yang) son exactamente 21 = F(8); contando por numero de lineas, la escalera es 2, 3, 5, 8, 13, 21 = F(n+2)."),
  a("fibonacci-hexagrama", "teorema", "verificar_fibonacci", ["oeis-a000032"], "En la version circular (la linea 6 vecina de la linea 1) los supervivientes son 18 = L(6), el numero de Lucas."),
  a("fibonacci-hexagrama", "teorema", "verificar_fibonacci", [], "La interseccion de ambas reglas (alternancia perfecta) son exactamente Ji Ji y Wei Ji, y el desglose de los 21 por numero de yin es 1, 6, 10, 4 = C(7-k, k), la identidad de Fibonacci en el triangulo de Pascal.", "Teorema de conteo, no un codigo oculto: la numerologia de Fibonacci y la razon aurea en el I Ching queda fuera por indemostrable."),
];

// === Consultas ===

export function afirmacionesDe(slug: string): Afirmacion[] {
  return AFIRMACIONES.filter((x) => x.slug === slug);
}

export const SLUGS_CON_FUNDAMENTO: string[] = [...new Set(AFIRMACIONES.map((x) => x.slug))];

/** Afirmaciones agrupadas por slug, en el orden del registro de experimentos. */
export const AFIRMACIONES_POR_EXPERIMENTO: { slug: string; titulo: string; afirmaciones: Afirmacion[] }[] =
  EXPERIMENTOS.map((e) => ({
    slug: e.slug,
    titulo: e.titulo,
    afirmaciones: afirmacionesDe(e.slug),
  }));

/** Resumen de una linea para el bloque plegado. */
export function resumenFundamento(slug: string): string {
  const afs = afirmacionesDe(slug);
  if (afs.length === 0) return "Fundamento: sin afirmaciones registradas";
  const n = (t: TipoAfirmacion) => afs.filter((x) => x.tipo === t).length;
  const partes: string[] = [];
  const verif = n("teorema") + n("calculo");
  if (verif) partes.push(`${verif} ${verif === 1 ? "resultado verificado" : "resultados verificados"}`);
  const doc = n("tradicion") + n("reconstruccion");
  if (doc) partes.push(`${doc} ${doc === 1 ? "fuente documentada" : "fuentes documentadas"}`);
  const ana = n("analogia");
  if (ana) partes.push(`${ana} ${ana === 1 ? "analogía con descargo" : "analogías con descargo"}`);
  const cites = [...new Set(afs.flatMap((x) => x.claves).map((k) => BIBLIOGRAFIA[k].citaCorta))];
  const citeStr = cites.length ? ` (${cites.join("; ")})` : "";
  return `Fundamento: ${partes.join(" · ")}${citeStr}`;
}

// === Aserciones en desarrollo ===
if (process.env.NODE_ENV !== "production") {
  // El render APA coincide con la cadena congelada desde el documento.
  for (const f of Object.values(BIBLIOGRAFIA)) {
    if (renderAPA(f) !== f.apa) console.error(`[fundamentos] render APA != apa congelado: ${f.clave}`);
    if (!f.apa.includes(italicoAPA(f))) console.error(`[fundamentos] segmento cursiva no esta en apa: ${f.clave}`);
  }
  // Toda clave usada existe; toda ficha se usa al menos una vez.
  const usadas = new Set(AFIRMACIONES.flatMap((x) => x.claves));
  for (const k of usadas) if (!(k in BIBLIOGRAFIA)) console.error(`[fundamentos] clave inexistente: ${k}`);
  for (const k of Object.keys(BIBLIOGRAFIA)) if (!usadas.has(k as ClaveBiblio)) console.error(`[fundamentos] ficha sin uso: ${k}`);
  // Cada experimento del registro tiene al menos una afirmacion.
  for (const e of EXPERIMENTOS)
    if (afirmacionesDe(e.slug).length === 0) console.error(`[fundamentos] experimento sin afirmacion: ${e.slug}`);
  // teorema/calculo llevan respaldo de suite; tradicion/reconstruccion llevan clave.
  for (const x of AFIRMACIONES) {
    if ((x.tipo === "teorema" || x.tipo === "calculo") && !x.respaldo)
      console.error(`[fundamentos] ${x.tipo} sin respaldo de suite: ${x.slug}`);
    if ((x.tipo === "tradicion" || x.tipo === "reconstruccion") && x.claves.length === 0)
      console.error(`[fundamentos] ${x.tipo} sin clave: ${x.slug}`);
    if (x.tipo === "analogia" && !x.respaldo && x.claves.length === 0)
      console.error(`[fundamentos] analogia sin respaldo ni clave: ${x.slug}`);
  }
}
