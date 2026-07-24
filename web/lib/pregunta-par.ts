/**
 * La pregunta del par (experimento 43).
 *
 * Dentro de cada par del Rey Wen, ¿qué decide cuál hexagrama va primero? La literatura
 * lo declara abierto. El laboratorio responde en tres actos:
 *
 * (a) Micro-teorema de imposibilidad: el volteo (fan) conserva el número de yang, así que
 *     "primero el de más yang" es indecidible en los 28 pares no simétricos: empatan 28/28.
 * (b) Batería de criterios estructurales, cada uno con su conteo y su p binomial (una cola,
 *     dirección observada). Todos son compatibles con una moneda al aire.
 * (c) Los dos cánones: yang total y distancia de transición, y las posiciones de los 8
 *     hexagramas autovolteados.
 *
 * Los 4 pares simétricos (autovolteados) van por opuesto (dui), no por volteo, y se
 * tratan aparte. Nota: PROHIBIDO conceder sello aquí; la búsqueda se hará por separado.
 */
import { HEX_BY_KW, fan, lineIsYang, hamming, huGua } from "./iching";
import { binom as comb } from "./hexeracto";

/** Secuencia del Rey Wen: valor Fu Xi por posición. */
export const KW: number[] = Array.from({ length: 64 }, (_, k) => HEX_BY_KW[k + 1].v);

function pc(v: number): number {
  let n = 0;
  for (let k = 0; k < 6; k++) n += (v >> k) & 1;
  return n;
}

export interface Par {
  /** Índice de par (0..31). Los hexagramas ocupan posiciones KW 2i+1 y 2i+2. */
  i: number;
  a: number; // primero (posición 2i)
  b: number; // segundo (posición 2i+1)
  esFan: boolean; // par por volteo (no simétrico); si no, es par dui (simétrico)
}

export const PARES: Par[] = Array.from({ length: 32 }, (_, i) => {
  const a = KW[2 * i];
  const b = KW[2 * i + 1];
  return { i, a, b, esFan: fan(a) === b };
});

export const FAN: Par[] = PARES.filter((p) => p.esFan); // 28 no simétricos
export const DUI: Par[] = PARES.filter((p) => !p.esFan); // 4 simétricos (van por opuesto)

/** Micro-teorema: en los pares fan ambos miembros tienen el mismo yang (empate en "más yang"). */
export const EMPATE_MAS_YANG = FAN.filter((p) => pc(p.a) === pc(p.b)).length; // 28

/** p binomial de una cola en la dirección observada: P(X>=k) si k>=m/2, si no P(X<=k). */
export function pBinomial(k: number, m: number): number {
  const total = 2 ** m;
  let s = 0;
  if (2 * k >= m) for (let j = k; j <= m; j++) s += comb(m, j);
  else for (let j = 0; j <= k; j++) s += comb(m, j);
  return s / total;
}

export interface Criterio {
  id: string;
  nombre: string;
  descripcion: string;
  /** +1 si el primero (a) gana el criterio, -1 si el segundo, 0 si empate/no aplica. */
  evalua: (p: Par, pos: number) => number;
  /** ¿Es de tres resultados (gana/pierde/empata) o binario sobre los 28? */
  conEmpates: boolean;
}

// Suavizado: ¿la orientación del Rey Wen minimiza la distancia al hexagrama externo,
// frente a la orientación contraria? Empata si ambas orientaciones dan igual distancia.
function suaviza(p: Par, pos: number, salida: boolean): number {
  if (!salida) {
    if (pos === 0) return 0; // el primer hexagrama no tiene anterior
    const ext = KW[pos - 1];
    const dKW = hamming(ext, p.a);
    const dAlt = hamming(ext, p.b);
    return dKW === dAlt ? 0 : dKW < dAlt ? 1 : -1;
  }
  if (pos + 2 > 63) return 0; // el último par no tiene siguiente
  const ext = KW[pos + 2];
  const dKW = hamming(p.b, ext);
  const dAlt = hamming(p.a, ext);
  return dKW === dAlt ? 0 : dKW < dAlt ? 1 : -1;
}

export const CRITERIOS: Criterio[] = [
  {
    id: "valor",
    nombre: "mayor valor binario primero",
    descripcion: "va primero el hexagrama con el número Fu Xi más alto",
    evalua: (p) => (p.a > p.b ? 1 : -1),
    conEmpates: false,
  },
  {
    id: "linea1",
    nombre: "línea 1 yang primero",
    descripcion: "va primero el que tiene la línea inferior yang",
    evalua: (p) => (lineIsYang(p.a, 1) ? 1 : -1),
    conEmpates: false,
  },
  {
    id: "linea6",
    nombre: "línea 6 yang primero",
    descripcion: "va primero el que tiene la línea superior yang",
    evalua: (p) => (lineIsYang(p.a, 6) ? 1 : -1),
    conEmpates: false,
  },
  {
    id: "entrada",
    nombre: "suaviza la entrada",
    descripcion: "la orientación acerca el par al hexagrama anterior",
    evalua: (p, pos) => suaviza(p, pos, false),
    conEmpates: true,
  },
  {
    id: "salida",
    nombre: "suaviza la salida",
    descripcion: "la orientación acerca el par al hexagrama siguiente",
    evalua: (p, pos) => suaviza(p, pos, true),
    conEmpates: true,
  },
];

export interface Resultado {
  gana: number; // pares donde gana el primero
  pierde: number;
  empata: number;
  decidibles: number;
  p: number;
}

/** Evalúa un criterio sobre los 28 pares fan y devuelve conteos y p binomial. */
export function evaluar(c: Criterio): Resultado {
  let gana = 0;
  let pierde = 0;
  let empata = 0;
  for (const p of FAN) {
    const r = c.evalua(p, 2 * p.i);
    if (r > 0) gana++;
    else if (r < 0) pierde++;
    else empata++;
  }
  const decidibles = gana + pierde;
  return { gana, pierde, empata, decidibles, p: pBinomial(gana, decidibles) };
}

// === Ampliación (tanda 7): la propuesta nuclear a prueba y el diálogo con Radisic (2026) ===

/** El criterio del hu gua: poner primero al de mayor hexagrama nuclear. La señal más
 *  fuerte de la batería, pero no significativa: la propuesta publicada no se confirma. */
export const NUCLEAR: { mayor: number; menor: number; empate: number; decidibles: number; p: number } = (() => {
  let mayor = 0;
  let menor = 0;
  let empate = 0;
  for (const par of FAN) {
    const ha = huGua(par.a);
    const hb = huGua(par.b);
    if (ha === hb) empate++;
    else if (ha > hb) mayor++;
    else menor++;
  }
  return { mayor, menor, empate, decidibles: mayor + menor, p: pBinomial(mayor, mayor + menor) };
})();

/** Los 4 núcleos del cuarto nivel del bosque (hu gua iterado dos veces): {Kun, Ji Ji, Wei Ji, Qian}. */
export const NUCLEOS_4: number[] = [...new Set(Array.from({ length: 64 }, (_, v) => huGua(huGua(v))))].sort((a, b) => a - b);

/** Pares donde los dos miembros colapsan a núcleos distintos del cuarto nivel: 16 de 28. */
export const CUENCAS_DISTINTAS = FAN.filter((p) => huGua(huGua(p.a)) !== huGua(huGua(p.b))).length;

/** La partición de Radisic (2026): 4 por opuesto (dist 6), 4 anti-simétricos, 24 por volteo (dist 2 o 4). */
export const PARTICION: { opuesto: number; antisimetricos: number; volteo: number } = {
  opuesto: DUI.length,
  antisimetricos: FAN.filter((p) => hamming(p.a, p.b) === 6).length,
  volteo: FAN.filter((p) => hamming(p.a, p.b) === 2 || hamming(p.a, p.b) === 4).length,
};

// === Los dos cánones ===
export const YANG_SUPERIOR = Array.from({ length: 30 }, (_, k) => pc(KW[k])).reduce((a, b) => a + b, 0); // 86
export const YANG_INFERIOR = Array.from({ length: 34 }, (_, k) => pc(KW[30 + k])).reduce((a, b) => a + b, 0); // 106
export const LINEAS_SUPERIOR = 30 * 6; // 180
export const LINEAS_INFERIOR = 34 * 6; // 204

function distTransicion(desde: number, hasta: number): number {
  let s = 0;
  for (let k = desde; k < hasta; k++) s += hamming(KW[k], KW[k + 1]);
  return s / (hasta - desde);
}
export const DIST_SUPERIOR = distTransicion(0, 29); // 3.3793 (posiciones 1..30)
export const DIST_INFERIOR = distTransicion(30, 63); // 3.3333 (posiciones 31..64)

/** Los 8 hexagramas autovolteados (fan(v)=v) y sus posiciones en el Rey Wen. */
export const AUTOVOLTEADOS: number[] = (() => {
  const pos = new Map<number, number>();
  for (let kw = 1; kw <= 64; kw++) pos.set(HEX_BY_KW[kw].v, kw);
  return [...Array(64).keys()].filter((v) => fan(v) === v).map((v) => pos.get(v)!).sort((a, b) => a - b);
})(); // [1, 2, 27, 28, 29, 30, 61, 62]

// === Aserciones en desarrollo (valores congelados) ===
if (process.env.NODE_ENV !== "production") {
  if (FAN.length !== 28 || DUI.length !== 4) console.error("[pregunta-par] deben ser 28 fan + 4 dui");
  if (EMPATE_MAS_YANG !== 28) console.error("[pregunta-par] el micro-teorema debería empatar 28/28");
  const cuentas: Record<string, number> = { valor: 14, linea1: 16, linea6: 12, entrada: 7, salida: 7 };
  for (const c of CRITERIOS) {
    const r = evaluar(c);
    if (r.gana !== cuentas[c.id]) console.error(`[pregunta-par] ${c.id}: gana ${r.gana}, esperado ${cuentas[c.id]}`);
  }
  if (YANG_SUPERIOR !== 86 || YANG_INFERIOR !== 106) console.error("[pregunta-par] yang de los cánones inesperado");
  if (AUTOVOLTEADOS.join(",") !== "1,2,27,28,29,30,61,62") console.error("[pregunta-par] posiciones de autovolteados inesperadas", AUTOVOLTEADOS);
  if (NUCLEAR.mayor !== 8 || NUCLEAR.menor !== 16 || NUCLEAR.empate !== 4) console.error("[pregunta-par] propuesta nuclear inesperada", NUCLEAR);
  if (CUENCAS_DISTINTAS !== 16) console.error("[pregunta-par] cuencas distintas != 16", CUENCAS_DISTINTAS);
  if (PARTICION.opuesto !== 4 || PARTICION.antisimetricos !== 4 || PARTICION.volteo !== 24) console.error("[pregunta-par] partición de matchings inesperada", PARTICION);
}
