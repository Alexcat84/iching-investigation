/**
 * Los 64 codones (D1). El código genético también tiene 64 = 4³ = 2⁶: cada base son
 * 2 bits, tres posiciones. Hay una correspondencia hexagrama ↔ codón, pero es un
 * isomorfismo de estructura combinatoria, NO un hecho biológico ni una afinidad mística.
 *
 * El punto educativo: la correspondencia depende de una elección arbitraria de la
 * codificación base → 2 bits. Hay 4! = 24 asignaciones de las cuatro bases a los cuatro
 * pares de bits, y ninguna es canónica; al cambiarla, cambia todo el mapeo.
 *
 * La tabla de aminoácidos es la del código genético estándar (NCBI, tabla de
 * traducción 1), citada en la página.
 */

export const BASES = ["A", "C", "G", "U"] as const;
export type Base = (typeof BASES)[number];

/** Las 24 codificaciones: cada una asigna las 4 bases a los pares de bits 0,1,2,3. */
export const CODIFICACIONES: Base[][] = (() => {
  const out: Base[][] = [];
  const permutar = (resto: Base[], acc: Base[]) => {
    if (resto.length === 0) {
      out.push([...acc]);
      return;
    }
    for (let i = 0; i < resto.length; i++) {
      permutar([...resto.slice(0, i), ...resto.slice(i + 1)], [...acc, resto[i]]);
    }
  };
  permutar([...BASES], []);
  return out;
})();

/** Hexagrama (6 bits) → codón (3 bases) bajo una codificación. */
export function hexACodon(v: number, enc: Base[]): string {
  const p1 = (v >> 4) & 3;
  const p2 = (v >> 2) & 3;
  const p3 = v & 3;
  return enc[p1] + enc[p2] + enc[p3];
}

/** Código genético estándar (ARN): codón → aminoácido (letra), * = stop. */
export const CODIGO: Record<string, string> = (() => {
  const filas: [string, string][] = [
    ["UUU", "F"], ["UUC", "F"], ["UUA", "L"], ["UUG", "L"],
    ["UCU", "S"], ["UCC", "S"], ["UCA", "S"], ["UCG", "S"],
    ["UAU", "Y"], ["UAC", "Y"], ["UAA", "*"], ["UAG", "*"],
    ["UGU", "C"], ["UGC", "C"], ["UGA", "*"], ["UGG", "W"],
    ["CUU", "L"], ["CUC", "L"], ["CUA", "L"], ["CUG", "L"],
    ["CCU", "P"], ["CCC", "P"], ["CCA", "P"], ["CCG", "P"],
    ["CAU", "H"], ["CAC", "H"], ["CAA", "Q"], ["CAG", "Q"],
    ["CGU", "R"], ["CGC", "R"], ["CGA", "R"], ["CGG", "R"],
    ["AUU", "I"], ["AUC", "I"], ["AUA", "I"], ["AUG", "M"],
    ["ACU", "T"], ["ACC", "T"], ["ACA", "T"], ["ACG", "T"],
    ["AAU", "N"], ["AAC", "N"], ["AAA", "K"], ["AAG", "K"],
    ["AGU", "S"], ["AGC", "S"], ["AGA", "R"], ["AGG", "R"],
    ["GUU", "V"], ["GUC", "V"], ["GUA", "V"], ["GUG", "V"],
    ["GCU", "A"], ["GCC", "A"], ["GCA", "A"], ["GCG", "A"],
    ["GAU", "D"], ["GAC", "D"], ["GAA", "E"], ["GAG", "E"],
    ["GGU", "G"], ["GGC", "G"], ["GGA", "G"], ["GGG", "G"],
  ];
  return Object.fromEntries(filas);
})();

/** Nombre y color de cada aminoácido (por clase química, para la visualización). */
export const AMINO_INFO: Record<string, { nombre: string; color: string }> = {
  F: { nombre: "Fenilalanina", color: "#e5c558" },
  L: { nombre: "Leucina", color: "#e5c558" },
  I: { nombre: "Isoleucina", color: "#e5c558" },
  M: { nombre: "Metionina (inicio)", color: "#5fae7f" },
  V: { nombre: "Valina", color: "#e5c558" },
  S: { nombre: "Serina", color: "#82a7e8" },
  P: { nombre: "Prolina", color: "#9c6bc9" },
  T: { nombre: "Treonina", color: "#82a7e8" },
  A: { nombre: "Alanina", color: "#e5c558" },
  Y: { nombre: "Tirosina", color: "#82a7e8" },
  H: { nombre: "Histidina", color: "#5b8fd9" },
  Q: { nombre: "Glutamina", color: "#82a7e8" },
  N: { nombre: "Asparagina", color: "#82a7e8" },
  K: { nombre: "Lisina", color: "#5b8fd9" },
  D: { nombre: "Aspártico", color: "#e24b3b" },
  E: { nombre: "Glutámico", color: "#e24b3b" },
  C: { nombre: "Cisteína", color: "#82a7e8" },
  W: { nombre: "Triptófano", color: "#e5c558" },
  R: { nombre: "Arginina", color: "#5b8fd9" },
  G: { nombre: "Glicina", color: "#8fae5a" },
  "*": { nombre: "Stop", color: "#6b6558" },
};

export function aminoDe(v: number, enc: Base[]): string {
  return CODIGO[hexACodon(v, enc)];
}

/** El conteo de codificaciones alternativas: 4! = 24. */
export const NUM_CODIFICACIONES = CODIFICACIONES.length;

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  if (NUM_CODIFICACIONES !== 24) console.error("[codones] deben ser 4! = 24 codificaciones");
  // Cada codificación da una biyección hexagrama → codón.
  for (const enc of CODIFICACIONES) {
    const cods = new Set(Array.from({ length: 64 }, (_, v) => hexACodon(v, enc)));
    if (cods.size !== 64) {
      console.error("[codones] la codificación no es biyectiva");
      break;
    }
  }
  // El código estándar cubre los 64 codones.
  if (Object.keys(CODIGO).length !== 64) console.error("[codones] el código no tiene 64 codones");
  // Cambiar la codificación cambia el mapeo (dos encodings distintos difieren en algún hexagrama).
  const a = CODIFICACIONES[0];
  const b = CODIFICACIONES[1];
  if (Array.from({ length: 64 }, (_, v) => aminoDe(v, a) === aminoDe(v, b)).every(Boolean))
    console.error("[codones] dos codificaciones distintas no deberían dar el mismo mapeo");
}
