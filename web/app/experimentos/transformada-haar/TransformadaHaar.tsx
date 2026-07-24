"use client";

import Link from "next/link";
import { hex } from "@/lib/iching";
import { HAAR, COEFICIENTES, TOP, ENERGIA_TOTAL } from "@/lib/haar";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#4fa89b";
const NEG = "#5b8fd9";

// Filas de onda (sin la media DC) con su coeficiente, agrupadas por escala.
const ONDAS = HAAR.map((r, i) => ({ ...r, c: COEFICIENTES[i] })).filter((r) => r.escala >= 0);
const MAX_MAG = Math.max(...ONDAS.map((r) => Math.abs(r.c) / Math.sqrt(r.norm2)));
const TOP_SET = new Set(TOP.map((t) => `${t.escala}:${t.pos}`));
const ESCALAS = [0, 1, 2, 3, 4, 5];

// Geometria del escalograma.
const X0 = 46;
const ANCHO = 344;
const ROW_H = 24;
const GAP = 6;

export default function TransformadaHaar() {
  const mayor = TOP[0];
  return (
    <div>
      <ExperimentHeader
        kicker="⊓ · 易 · base de Haar"
        titulo="Haar: dónde cambia el libro"
        subtitulo="La base que localiza, hermana de Walsh"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            La transformada de{" "}
            <Link href="/experimentos/espectro-walsh" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Walsh
            </Link>{" "}
            descompone una señal según <b>en qué frecuencia</b> (qué subconjunto de líneas)
            vive. La de <b>Haar</b> pregunta otra cosa: <b>dónde cambia</b>. Su matriz se
            construye por recursión: una fila constante (la media) y, por cada escala y
            posición, una onda +1 en la primera mitad de su tramo y −1 en la segunda. A
            diferencia de Walsh, sus filas tienen <b>normas distintas</b> (2 elevado a la
            escala), y por eso Parseval se escribe con esas normas.
          </p>
          <p>
            Aplicada a la secuencia del Rey Wen (posición → número del hexagrama, la misma
            señal de Walsh y del{" "}
            <Link href="/experimentos/fourier-anillo" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Fourier del anillo
            </Link>
            ), los coeficientes marcan <b>en qué tramos del libro</b> se concentran las
            irregularidades.
          </p>
        </Prose>
      </div>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>El escalograma: coeficientes por escala y posición</SectionLabel>
      </div>
      <Panel className="mb-6" accent={ACCENT}>
        <svg viewBox={`0 0 400 ${10 + 6 * (ROW_H + GAP) + 20}`} className="mx-auto w-full max-w-[520px]" role="img" aria-label="Escalograma de Haar: seis filas de escala, cada una con sus ondas coloreadas según el coeficiente sobre la secuencia del Rey Wen.">
          {ESCALAS.map((p) => {
            const y = 10 + p * (ROW_H + GAP);
            const celdas = ONDAS.filter((r) => r.escala === p);
            return (
              <g key={p}>
                <text x={X0 - 8} y={y + ROW_H / 2 + 4} textAnchor="end" fontSize={10} fill="#8a8272" fontFamily="ui-monospace, monospace">
                  2^{p}
                </text>
                {celdas.map((r) => {
                  const cw = (r.ancho / 64) * ANCHO;
                  const x = X0 + (r.pos * r.ancho / 64) * ANCHO;
                  const mag = Math.abs(r.c) / Math.sqrt(r.norm2);
                  const top = TOP_SET.has(`${r.escala}:${r.pos}`);
                  return (
                    <rect key={r.pos} x={x + 0.5} y={y} width={Math.max(cw - 1, 1)} height={ROW_H} rx={1}
                      fill={r.c >= 0 ? ACCENT : NEG} opacity={0.16 + 0.84 * (mag / MAX_MAG)}
                      stroke={top ? "#f5efdf" : "none"} strokeWidth={top ? 1.4 : 0} />
                  );
                })}
              </g>
            );
          })}
          {/* eje de posiciones del libro */}
          {[0, 16, 32, 48, 64].map((v) => {
            const x = X0 + (v / 64) * ANCHO;
            const yb = 10 + 6 * (ROW_H + GAP);
            return (
              <g key={v}>
                <line x1={x} y1={10} x2={x} y2={yb} stroke="#2A2620" strokeWidth={0.6} />
                <text x={x} y={yb + 12} textAnchor="middle" fontSize={9} fill="#6b6353" fontFamily="ui-monospace, monospace">{v}</text>
              </g>
            );
          })}
        </svg>
        <p className="mt-1 text-center font-mono text-[10px] text-sand-500">
          filas = escalas (más fina abajo) · verde = coeficiente positivo, azul = negativo · intensidad = magnitud · recuadro = los mayores
        </p>
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={64} etiqueta="base ortogonal de 64 puntos" accent={ACCENT} />
        <Stat valor={ENERGIA_TOTAL} etiqueta="Σf² = Σc²/norma² (Parseval)" />
        <Stat valor="exacta" etiqueta="reconstrucción desde la base" accent={ACCENT} />
        <Stat valor={`[${mayor.ini},${mayor.fin})`} etiqueta="tramo del mayor cambio" />
      </div>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Los coeficientes mayores (congelados)</SectionLabel>
      </div>
      <Panel className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-left font-mono text-[11px] uppercase tracking-wider text-sand-500">
                <th className="py-2">escala</th>
                <th>tramo del libro</th>
                <th>coeficiente</th>
                <th className="text-right">energía c²/norma²</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sand-300">
              {TOP.map((t, i) => (
                <tr key={i} className="border-b border-ink-800/60">
                  <td className="py-2">2^{t.escala}</td>
                  <td>
                    v [{t.ini}, {t.fin}){" "}
                    <span className="text-sand-500">
                      ({hex(t.ini).py} … {hex(t.fin - 1).py})
                    </span>
                  </td>
                  <td style={{ color: t.c >= 0 ? ACCENT : NEG }}>{t.c > 0 ? `+${t.c}` : t.c}</td>
                  <td className="text-right">{t.energia.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sand-300">
          Los dos mayores viven en la <b>escala de los bloques</b> (ancho 16): los tramos{" "}
          <b>[0, 16)</b> y <b>[48, 64)</b>, los extremos del libro por trigrama superior.
          Las irregularidades del Rey Wen no son finas: están en su estructura de bloques.
        </p>
      </Panel>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>El trío queda completo</SectionLabel>
      </div>
      <Panel>
        <Prose>
          <p>
            La misma señal del Rey Wen, leída en tres geometrías ortogonales de 64 puntos:{" "}
            <Link href="/experimentos/espectro-walsh" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Walsh
            </Link>{" "}
            es <b>el cubo</b> (en qué frecuencia), el{" "}
            <Link href="/experimentos/fourier-anillo" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Fourier del anillo
            </Link>{" "}
            es <b>el círculo</b> (en qué armónico cíclico) y Haar es <b>la localización</b>{" "}
            (dónde cambia). Tres preguntas distintas sobre la misma secuencia.
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
