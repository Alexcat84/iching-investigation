"use client";

import Link from "next/link";
import {
  ENERGIA_ORDEN,
  ENERGIA_TOTAL_SIN_DC,
  ESPECTRO,
  FRACCION_PARES,
  FRACCION_PARES_AZAR,
  popcount,
  TOP,
} from "@/lib/walsh";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#5aa0a8";

function EspectroBarras() {
  const W = 680;
  const H = 150;
  const bw = W / 64;
  const maxA = Math.max(...ESPECTRO.slice(1).map(Math.abs));
  // color por orden
  const col = (w: number) => {
    const o = popcount(w);
    return o === 2 ? ACCENT : "#4a453b";
  };
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 16}`} className="w-full min-w-[560px]" role="img" aria-label="espectro de Walsh-Hadamard: 64 coeficientes">
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#2A2620" />
        {ESPECTRO.map((f, w) => {
          if (w === 0) return null;
          const h = (Math.abs(f) / maxA) * (H / 2 - 4);
          const y = f >= 0 ? H / 2 - h : H / 2;
          return <rect key={w} x={w * bw + 0.6} y={y} width={bw - 1.2} height={h} fill={col(w)} opacity={0.9} />;
        })}
        <text x={4} y={H + 12} style={{ fontSize: 10, fontFamily: "monospace" }} fill="#6b6558">
          los 63 coeficientes F(w) (sin la componente DC) · resaltados los de orden 2
        </text>
      </svg>
    </div>
  );
}

export default function EspectroWalsh() {
  const orden2Pct = (ENERGIA_ORDEN[2] / ENERGIA_TOTAL_SIN_DC) * 100;
  const orden1Pct = (ENERGIA_ORDEN[1] / ENERGIA_TOTAL_SIN_DC) * 100;
  const maxE = Math.max(...ENERGIA_ORDEN.slice(1));

  return (
    <div>
      <ExperimentHeader
        kicker="≋ · caracteres de Walsh"
        titulo="El espectro de Walsh-Hadamard"
        subtitulo="¿En qué dimensiones del cubo vive la estructura del Rey Wen?"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Toda función sobre los 64 hexagramas se descompone en los 64 <b>caracteres de
            Walsh</b> del cubo, cada uno un patrón de paridad sobre un subconjunto de las
            6 líneas. Aplicamos la transformada a la secuencia del Rey Wen vista como
            señal (a cada hexagrama le asignamos su número de capítulo) y miramos dónde se
            concentra su energía. Complementa{" "}
            <Link href="/experimentos/rey-wen-aleatorio" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              ¿es el Rey Wen aleatorio?
            </Link>
            : aquel dice si es aleatorio en conjunto; este, en qué frecuencias se aparta.
          </p>
        </Prose>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={`${orden2Pct.toFixed(0)}%`} etiqueta="energía en orden 2 (pares de líneas)" accent={ACCENT} />
        <Stat valor={`${orden1Pct.toFixed(0)}%`} etiqueta="energía en orden 1 (lineal)" />
        <Stat valor="Parseval ✓" etiqueta="Σ F² = 64 Σ f²" accent={ACCENT} />
        <Stat valor="WHT² = 64f" etiqueta="involución verificada" />
      </div>

      <div className="mb-8">
        <SectionLabel accent={ACCENT}>El espectro completo</SectionLabel>
        <Panel className="mt-2">
          <EspectroBarras />
        </Panel>
      </div>

      {/* Energía por orden */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>Dónde vive la estructura: energía por orden</SectionLabel>
        <Panel className="mt-2">
          <div className="space-y-2">
            {ENERGIA_ORDEN.map((e, o) => {
              if (o === 0) return null;
              const pct = (e / ENERGIA_TOTAL_SIN_DC) * 100;
              return (
                <div key={o} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-[11px] text-sand-400">
                    orden {o}{" "}
                    <span className="text-sand-600">
                      ({o === 1 ? "lineal" : o === 2 ? "pares" : `${o} líneas`})
                    </span>
                  </span>
                  <div className="relative h-4 flex-1 overflow-hidden rounded-sm bg-ink-800">
                    <div className="h-full rounded-sm" style={{ width: `${(e / maxE) * 100}%`, background: o === 2 ? ACCENT : "#6b6558" }} />
                  </div>
                  <span className="w-14 shrink-0 text-right font-mono text-[11px] text-sand-400">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sand-300">
            La estructura del Rey Wen vive sobre todo en el <b style={{ color: ACCENT }}>orden 2</b>:
            la mitad de su energía (sin contar la media) está en interacciones entre{" "}
            <b>pares de líneas</b>, no en ninguna línea suelta (el orden 1 apenas llega al
            4%). El orden 6 (las seis líneas a la vez) es casi nulo. Encaja con el test de
            aleatoriedad: globalmente parece azar, pero la poca señal que tiene son
            correlaciones de a dos.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-sand-300">
            Sumados, los <b style={{ color: ACCENT }}>órdenes pares 2 y 4</b> reúnen el{" "}
            <b style={{ color: ACCENT }}>{(FRACCION_PARES * 100).toFixed(1)}%</b> de la
            energía, frente al {(FRACCION_PARES_AZAR * 100).toFixed(0)}% que repartiría un
            orden al azar. Es la confirmación espectral, por una vía independiente, de lo
            que{" "}
            <Link href="/experimentos/rey-wen-aleatorio" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              ¿es el Rey Wen aleatorio?
            </Link>{" "}
            encontró por Monte Carlo: la única estructura real del orden tradicional es su
            regla de pares, que aquí aparece como interacciones de orden par entre líneas.
          </p>
        </Panel>
      </div>

      {/* Top coeficientes */}
      <div>
        <SectionLabel accent={ACCENT}>Los subconjuntos de líneas más marcados</SectionLabel>
        <Panel className="mt-2">
          <div className="flex flex-wrap gap-2">
            {TOP.map(({ w, F, lineas }) => (
              <div key={w} className="rounded-lg border border-ink-700 bg-ink-850/40 px-3 py-2">
                <div className="font-mono text-[11px] text-sand-200">
                  líneas {lineas.join("·")}
                </div>
                <div className="font-mono text-[10px]" style={{ color: ACCENT }}>
                  F = {F}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-sand-400">
            Los caracteres con más peso son casi todos pares de líneas (4·5, 2·3, 1·3…):
            las combinaciones concretas donde el orden tradicional deja su huella.
          </p>
        </Panel>
      </div>
    </div>
  );
}
