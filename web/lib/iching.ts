/**
 * Motor binario del I Ching — puerto TypeScript de scripts/iching_engine.py
 *
 * Convención Shao Yong–Leibniz: yang = 1, yin = 0, líneas leídas de abajo hacia
 * arriba; la línea inferior es el bit más significativo (valor 32). Kun = 0, Qian = 63.
 *
 * La correspondencia hexagrama ↔ entero 0–63 es una biyección verificada.
 * Fuente de verdad de la investigación: los scripts de Python. Este módulo es la
 * fuente de verdad del sitio y se mantiene en paralelo (mismos valores, mismas pruebas).
 */

export type TrigramName =
  | "Qian"
  | "Dui"
  | "Li"
  | "Zhen"
  | "Xun"
  | "Kan"
  | "Gen"
  | "Kun";

/** Patrón de 3 bits de cada trigrama (abajo→arriba, yang = 1). */
export const TRI: Record<TrigramName, string> = {
  Qian: "111",
  Dui: "110",
  Li: "101",
  Zhen: "100",
  Xun: "011",
  Kan: "010",
  Gen: "001",
  Kun: "000",
};

/** Nombre en español de cada trigrama y su atributo/imagen tradicional. */
export const TRIGRAM_INFO: Record<
  TrigramName,
  { es: string; imagen: string; atributo: string }
> = {
  Qian: { es: "Cielo", imagen: "☰", atributo: "lo creativo, fuerte" },
  Dui: { es: "Lago", imagen: "☱", atributo: "lo sereno, alegre" },
  Li: { es: "Fuego", imagen: "☲", atributo: "lo adherente, luminoso" },
  Zhen: { es: "Trueno", imagen: "☳", atributo: "lo suscitativo, móvil" },
  Xun: { es: "Viento", imagen: "☴", atributo: "lo suave, penetrante" },
  Kan: { es: "Agua", imagen: "☵", atributo: "lo abismal, peligroso" },
  Gen: { es: "Montaña", imagen: "☶", atributo: "el aquietamiento, quieto" },
  Kun: { es: "Tierra", imagen: "☷", atributo: "lo receptivo, entregado" },
};

// [KW, pinyin, nombre en español, trigrama inferior, trigrama superior]
type Row = [number, string, string, TrigramName, TrigramName];

const DATA: Row[] = [
  [1, "Qián", "Lo Creativo", "Qian", "Qian"],
  [2, "Kūn", "Lo Receptivo", "Kun", "Kun"],
  [3, "Zhūn", "La Dificultad Inicial", "Zhen", "Kan"],
  [4, "Méng", "La Necedad Juvenil", "Kan", "Gen"],
  [5, "Xū", "La Espera", "Qian", "Kan"],
  [6, "Sòng", "El Conflicto", "Kan", "Qian"],
  [7, "Shī", "El Ejército", "Kan", "Kun"],
  [8, "Bǐ", "La Solidaridad", "Kun", "Kan"],
  [9, "Xiǎo Chù", "Fuerza Domesticadora Menor", "Qian", "Xun"],
  [10, "Lǚ", "El Porte", "Dui", "Qian"],
  [11, "Tài", "La Paz", "Qian", "Kun"],
  [12, "Pǐ", "El Estancamiento", "Kun", "Qian"],
  [13, "Tóng Rén", "Comunidad con los Hombres", "Li", "Qian"],
  [14, "Dà Yǒu", "La Posesión de lo Grande", "Qian", "Li"],
  [15, "Qiān", "La Modestia", "Gen", "Kun"],
  [16, "Yù", "El Entusiasmo", "Kun", "Zhen"],
  [17, "Suí", "El Seguimiento", "Zhen", "Dui"],
  [18, "Gǔ", "El Trabajo en lo Echado a Perder", "Xun", "Gen"],
  [19, "Lín", "El Acercamiento", "Dui", "Kun"],
  [20, "Guān", "La Contemplación", "Kun", "Xun"],
  [21, "Shì Hé", "La Mordedura Tajante", "Zhen", "Li"],
  [22, "Bì", "La Gracia", "Li", "Gen"],
  [23, "Bō", "La Desintegración", "Kun", "Gen"],
  [24, "Fù", "El Retorno", "Zhen", "Kun"],
  [25, "Wú Wàng", "La Inocencia", "Zhen", "Qian"],
  [26, "Dà Chù", "Fuerza Domesticadora Mayor", "Qian", "Gen"],
  [27, "Yí", "La Nutrición", "Zhen", "Gen"],
  [28, "Dà Guò", "Preponderancia de lo Grande", "Xun", "Dui"],
  [29, "Kǎn", "Lo Abismal", "Kan", "Kan"],
  [30, "Lí", "Lo Adherente", "Li", "Li"],
  [31, "Xián", "El Influjo", "Gen", "Dui"],
  [32, "Héng", "La Duración", "Xun", "Zhen"],
  [33, "Dùn", "La Retirada", "Gen", "Qian"],
  [34, "Dà Zhuàng", "El Poder de lo Grande", "Qian", "Zhen"],
  [35, "Jìn", "El Progreso", "Kun", "Li"],
  [36, "Míng Yí", "El Oscurecimiento de la Luz", "Li", "Kun"],
  [37, "Jiā Rén", "El Clan", "Li", "Xun"],
  [38, "Kuí", "El Antagonismo", "Dui", "Li"],
  [39, "Jiǎn", "El Impedimento", "Gen", "Kan"],
  [40, "Xiè", "La Liberación", "Kan", "Zhen"],
  [41, "Sǔn", "La Merma", "Dui", "Gen"],
  [42, "Yì", "El Aumento", "Zhen", "Xun"],
  [43, "Guài", "La Resolución", "Qian", "Dui"],
  [44, "Gòu", "Ir al Encuentro", "Xun", "Qian"],
  [45, "Cuì", "La Reunión", "Kun", "Dui"],
  [46, "Shēng", "La Ascensión", "Xun", "Kun"],
  [47, "Kùn", "La Opresión", "Kan", "Dui"],
  [48, "Jǐng", "El Pozo", "Xun", "Kan"],
  [49, "Gé", "La Revolución", "Li", "Dui"],
  [50, "Dǐng", "El Caldero", "Xun", "Li"],
  [51, "Zhèn", "La Conmoción", "Zhen", "Zhen"],
  [52, "Gèn", "El Aquietamiento", "Gen", "Gen"],
  [53, "Jiàn", "El Desarrollo", "Gen", "Xun"],
  [54, "Guī Mèi", "La Muchacha que se Casa", "Dui", "Zhen"],
  [55, "Fēng", "La Plenitud", "Li", "Zhen"],
  [56, "Lǚ", "El Andariego", "Gen", "Li"],
  [57, "Xùn", "Lo Suave", "Xun", "Xun"],
  [58, "Duì", "Lo Sereno", "Dui", "Dui"],
  [59, "Huàn", "La Disolución", "Kan", "Xun"],
  [60, "Jié", "La Restricción", "Dui", "Kan"],
  [61, "Zhōng Fú", "La Verdad Interior", "Dui", "Xun"],
  [62, "Xiǎo Guò", "Preponderancia de lo Pequeño", "Gen", "Zhen"],
  [63, "Jì Jì", "Después de la Consumación", "Li", "Kan"],
  [64, "Wèi Jì", "Antes de la Consumación", "Kan", "Li"],
];

export interface Hexagram {
  /** Valor decimal 0–63 (línea inferior = bit más significativo). */
  v: number;
  /** 6 bits, abajo→arriba, yang = 1. */
  bits: string;
  /** Número en la secuencia del Rey Wen (1–64). */
  kw: number;
  /** Pinyin con tono. */
  py: string;
  /** Nombre en español. */
  es: string;
  /** Carácter Unicode del hexagrama (䷀…䷿). */
  glyph: string;
  lower: TrigramName;
  upper: TrigramName;
}

/** bits de 6 (abajo→arriba) para un par de trigramas. */
export function bitsOf(lower: TrigramName, upper: TrigramName): string {
  return TRI[lower] + TRI[upper];
}

/** Entero 0–63; línea inferior = bit más significativo. */
export function valueOf(bits: string): number {
  return parseInt(bits, 2);
}

/** Indexado por valor 0–63. */
export const HEX_BY_VALUE: Record<number, Hexagram> = {};
/** Indexado por número del Rey Wen 1–64. */
export const HEX_BY_KW: Record<number, Hexagram> = {};

for (const [kw, py, es, lo, up] of DATA) {
  const bits = bitsOf(lo, up);
  const v = valueOf(bits);
  const hex: Hexagram = {
    v,
    bits,
    kw,
    py,
    es,
    glyph: String.fromCodePoint(0x4dc0 + kw - 1),
    lower: lo,
    upper: up,
  };
  HEX_BY_VALUE[v] = hex;
  HEX_BY_KW[kw] = hex;
}

/** Todos los hexagramas, orden Fu Xi (0→63). */
export const ALL_HEX: Hexagram[] = Array.from(
  { length: 64 },
  (_, v) => HEX_BY_VALUE[v],
);

export function hex(v: number): Hexagram {
  return HEX_BY_VALUE[((v % 64) + 64) % 64];
}

// === Operaciones de bits ===

/** Bit de la línea k (1 = abajo → 32, … 6 = arriba → 1). */
export const lineBit = (k: number): number => 1 << (6 - k);

/** ¿La línea k del hexagrama v es yang? (k: 1 = abajo … 6 = arriba) */
export const lineIsYang = (v: number, k: number): boolean =>
  (v & lineBit(k)) !== 0;

/** Aplica un conjunto de líneas mutantes. Una consulta real es exactamente esto. */
export function mutate(v: number, lineas: number[]): number {
  let m = 0;
  for (const k of lineas) m |= lineBit(k);
  return v ^ m;
}

/** Opuesto / complemento (dui 对): NOT bit a bit. */
export const dui = (v: number): number => ~v & 63;

/** Volteo vertical (fan 反): invierte el orden de las 6 líneas. */
export function fan(v: number): number {
  const b = v.toString(2).padStart(6, "0");
  return parseInt(b.split("").reverse().join(""), 2);
}

/** Hexagrama nuclear (hu gua 互卦): líneas 2-3-4 abajo, 3-4-5 arriba. */
export function huGua(v: number): number {
  const b = v.toString(2).padStart(6, "0");
  return parseInt(b.slice(1, 4) + b.slice(2, 5), 2);
}

/** Distancia de Hamming: cuántas líneas separan dos hexagramas (distancia en Q6). */
export function hamming(a: number, b: number): number {
  let x = a ^ b;
  let c = 0;
  while (x) {
    c += x & 1;
    x >>= 1;
  }
  return c;
}

/** Los 6 vecinos a una línea de distancia: { línea: valor }. */
export function vecinos(v: number): Record<number, number> {
  const out: Record<number, number> = {};
  for (let k = 1; k <= 6; k++) out[k] = v ^ lineBit(k);
  return out;
}

/** Trigramas (inferior, superior) como valores 0–7. */
export function trigramas(v: number): [number, number] {
  return [v >> 3, v & 7];
}

/** Nombre del trigrama a partir de sus 3 bits (valor 0–7). */
export const TRI_BY_VALUE: Record<number, TrigramName> = Object.fromEntries(
  (Object.keys(TRI) as TrigramName[]).map((name) => [
    parseInt(TRI[name], 2),
    name,
  ]),
) as Record<number, TrigramName>;

/** Código Gray reflejado: recorrido hamiltoniano, cambia UNA línea por paso.
 *  Empieza en Kun (0) y termina en Fu (32). */
export function gray(): number[] {
  return Array.from({ length: 64 }, (_, n) => n ^ (n >> 1));
}

/** Las 192 aristas del hipercubo Q6 (pares a distancia de Hamming 1). */
export interface Edge {
  a: number;
  b: number;
  line: number;
}
export const EDGES: Edge[] = (() => {
  const out: Edge[] = [];
  for (let v = 0; v < 64; v++) {
    for (let k = 1; k <= 6; k++) {
      const n = v ^ lineBit(k);
      if (v < n) out.push({ a: v, b: n, line: k });
    }
  }
  return out;
})();

/** Significado tradicional de cada posición de línea. */
export const LINE_MEANING: Record<
  number,
  { titulo: string; texto: string }
> = {
  1: { titulo: "El comienzo", texto: "la raíz, lo que aún no se manifiesta" },
  2: { titulo: "El interior", texto: "la vida privada, el funcionario en el campo" },
  3: {
    titulo: "La transición",
    texto: "el borde peligroso entre los dos trigramas",
  },
  4: { titulo: "El ministro", texto: "lo público, cercano al poder" },
  5: { titulo: "El gobernante", texto: "el centro de mando, el lugar del regente" },
  6: { titulo: "La culminación", texto: "la salida, lo que ya se ha cumplido" },
};

/** Paleta de las 6 líneas (una dimensión del hipercubo por color). */
export const LINE_COLOR: Record<number, string> = {
  1: "#e24b3b",
  2: "#e8883a",
  3: "#e5c558",
  4: "#5fae7f",
  5: "#5b8fd9",
  6: "#9c6bc9",
};

/** Etiqueta compacta de un hexagrama para tooltips y listas. */
export function label(v: number): string {
  const h = hex(v);
  return `${h.glyph} ${h.kw}. ${h.py}`;
}
