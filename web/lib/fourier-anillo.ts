/**
 * El Fourier del anillo (experimento 34): la DFT sobre Z/64.
 *
 * El circulo de Shao Yong es Z/64. La transformada discreta de Fourier descompone
 * cualquier secuencia sobre ese anillo en armonicos ciclicos. La aplicamos a la MISMA
 * senal que el experimento 23 (a cada posicion del circulo, el numero del Rey Wen del
 * hexagrama), pero con otra geometria: alli el cubo (Z/2)⁶, aqui el circulo Z/64. Dos
 * geometrias, dos espectros. Los armonicos dominantes se computan y se congelan.
 */
import { HEX_BY_VALUE } from "./iching";

/** Senal: posicion en el circulo (valor Fu Xi) -> numero del Rey Wen. */
export const SENAL: number[] = Array.from({ length: 64 }, (_, v) => HEX_BY_VALUE[v].kw);

const N = 64;

/** Parte real e imaginaria de la DFT: F[k] = suma f[v] exp(-2 pi i k v / 64). */
export function dft(f: number[]): { re: number[]; im: number[] } {
  const re = new Array(N).fill(0);
  const im = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    for (let v = 0; v < N; v++) {
      const ang = (-2 * Math.PI * k * v) / N;
      re[k] += f[v] * Math.cos(ang);
      im[k] += f[v] * Math.sin(ang);
    }
  }
  return { re, im };
}

/** Transformada inversa (parte real). */
export function idft(re: number[], im: number[]): number[] {
  return Array.from({ length: N }, (_, v) => {
    let s = 0;
    for (let k = 0; k < N; k++) {
      const ang = (2 * Math.PI * k * v) / N;
      s += re[k] * Math.cos(ang) - im[k] * Math.sin(ang);
    }
    return s / N;
  });
}

const { re: RE, im: IM } = dft(SENAL);

/** Espectro de magnitudes |F[k]| por frecuencia k (0..63). */
export const ESPECTRO: number[] = RE.map((r, k) => Math.hypot(r, IM[k]));

/** Componente DC: F[0] = suma de la senal = 2080. */
export const DC = ESPECTRO[0];

/** Los 6 armonicos dominantes (sin DC), congelados tras el primer calculo. */
export const DOMINANTES: { k: number; mag: number }[] = (() => {
  const ks = Array.from({ length: 32 }, (_, i) => i + 1).sort((a, b) => ESPECTRO[b] - ESPECTRO[a]);
  return ks.slice(0, 6).map((k) => ({ k, mag: Math.round(ESPECTRO[k] * 100) / 100 }));
})();

// Aserciones en desarrollo.
if (process.env.NODE_ENV !== "production") {
  // Parseval: suma |f|^2 = (1/N) suma |F|^2.
  const ef = SENAL.reduce((s, x) => s + x * x, 0);
  const eF = ESPECTRO.reduce((s, x) => s + x * x, 0) / N;
  if (Math.abs(ef - eF) > 1e-6) console.error("[fourier-anillo] Parseval falla");
  // DFT de una constante = delta en k=0.
  const c = dft(new Array(64).fill(5));
  if (Math.abs(c.re[0] - 320) > 1e-9 || c.re.slice(1).some((x) => Math.abs(x) > 1e-6))
    console.error("[fourier-anillo] DFT(constante) no es delta");
  // ida y vuelta recupera la senal.
  const vuelta = idft(RE, IM);
  if (vuelta.some((x, v) => Math.abs(x - SENAL[v]) > 1e-6)) console.error("[fourier-anillo] ida y vuelta falla");
  if (Math.abs(DC - 2080) > 1e-6) console.error("[fourier-anillo] DC != 2080");
  if (DOMINANTES[0].k !== 8) console.error("[fourier-anillo] el armonico dominante no es k=8");
}
