"use client";

import { useState } from "react";
import Link from "next/link";
import { ESPECTRO, DC, DOMINANTES } from "@/lib/fourier-anillo";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#5aa0a8";

export default function FourierAnillo() {
  const [sel, setSel] = useState<number | null>(8);
  const maxMag = Math.max(...ESPECTRO.slice(1, 33));
  const W = 680;
  const H = 180;
  const bw = W / 33;

  return (
    <div>
      <ExperimentHeader
        kicker="圜 · 易 · DFT sobre Z/64"
        titulo="El Fourier del anillo"
        subtitulo="La DFT sobre el círculo Z/64 de Shao Yong"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            La otra geometría del sitio. El{" "}
            <Link href="/experimentos/shao-yong" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              círculo de Shao Yong
            </Link>{" "}
            es <b>Z/64</b>, y la transformada discreta de Fourier descompone cualquier
            secuencia sobre él en <b>armónicos cíclicos</b>. La aplicamos a la misma señal
            que{" "}
            <Link href="/experimentos/espectro-walsh" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Fourier sobre el cubo
            </Link>{" "}
            (a cada posición del círculo, el número del Rey Wen del hexagrama), pero con otra
            geometría: allí el cubo (Z/2)⁶, aquí el círculo. <b>Misma señal, dos geometrías,
            dos espectros.</b>
          </p>
        </Prose>
      </div>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>El espectro de magnitudes por frecuencia</SectionLabel>
      </div>
      <Panel className="mb-6" accent={ACCENT}>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full min-w-[560px]" role="img" aria-label="Espectro de magnitudes de la DFT por frecuencia k de 1 a 32; el armónico dominante es k=8.">
            <line x1={0} y1={H} x2={W} y2={H} stroke="#2A2620" />
            {ESPECTRO.slice(1, 33).map((m, i) => {
              const k = i + 1;
              const h = (m / maxMag) * (H - 10);
              const esSel = k === sel;
              return (
                <rect
                  key={k}
                  x={k * bw + 1}
                  y={H - h}
                  width={bw - 2}
                  height={h}
                  rx={1}
                  fill={k === 8 ? ACCENT : esSel ? "#cfc6b0" : "#4a453b"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSel(k)}
                />
              );
            })}
            {[1, 8, 16, 24, 32].map((k) => (
              <text key={k} x={k * bw + bw / 2} y={H + 14} textAnchor="middle" fontSize={9} fill="#6b6353" fontFamily="ui-monospace, monospace">
                {k}
              </text>
            ))}
            <text x={W / 2} y={H + 22} textAnchor="middle" fontSize={9} fill="#8a8271" fontFamily="ui-monospace, monospace">
              frecuencia k (armónicos cíclicos) · la componente DC (k=0) = {DC.toFixed(0)} se omite
            </text>
          </svg>
        </div>
        {sel !== null && (
          <p className="mt-2 text-center text-sm text-sand-300">
            armónico k = {sel}: magnitud |F| = {ESPECTRO[sel].toFixed(2)} · periodo {(64 / sel).toFixed(2)} posiciones
          </p>
        )}
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DOMINANTES.slice(0, 4).map((d) => (
          <Stat key={d.k} valor={`k = ${d.k}`} etiqueta={`|F| = ${d.mag}`} accent={d.k === 8 ? ACCENT : undefined} />
        ))}
      </div>

      <Panel>
        <Prose>
          <p>
            El armónico dominante es <b style={{ color: ACCENT }}>k = 8</b>: la secuencia del
            Rey Wen resuena con el periodo de los <b>ocho trigramas</b>, la estructura 8×8 que
            organiza el libro. El espectro cumple <b>Parseval</b> (la energía se conserva), la
            DFT de una constante es una <b>delta</b> en k=0, y la transformada inversa recupera
            la señal exacta: verificado en la suite. Donde{" "}
            <Link href="/experimentos/espectro-walsh" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              el Fourier del cubo
            </Link>{" "}
            veía interacciones entre pares de líneas, el del círculo ve periodicidades: dos
            preguntas distintas a la misma secuencia.
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
