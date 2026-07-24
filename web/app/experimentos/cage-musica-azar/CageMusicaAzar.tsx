"use client";

import { useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import { CARTA, seleccionaHexagrama, type Sonoridad } from "@/lib/cage";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#8a9bb0";

export default function CageMusicaAzar() {
  const [frase, setFrase] = useState<Sonoridad[]>([]);
  const ultimo = frase.length ? frase[frase.length - 1] : null;

  const tirar = () => {
    const v = seleccionaHexagrama(() => Math.random());
    setFrase((f) => [...f, CARTA[v]].slice(-14));
  };

  return (
    <div>
      <ExperimentHeader
        kicker="♪ · 易 · composición por azar (1951)"
        titulo="Cage: la música del azar"
        subtitulo="El I Ching como motor de composición"
        accent={ACCENT}
      />

      <div className="mb-6 rounded-xl border p-4" style={{ borderColor: `${ACCENT}66`, background: "rgba(138,155,176,0.06)" }}>
        <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: ACCENT }}>
          <span className="text-cinnabar-bright">⚠</span> Descargo
        </div>
        <p className="text-sm leading-relaxed text-sand-300">
          Documentamos el <b>método</b> compositivo, no la obra de Cage: la demo usa una
          carta demostrativa <b>propia</b> y no reproduce sus cartas, partituras ni
          fragmentos (copyright). La conexión es histórica (Pritchett, 1993), no una
          afirmación sobre el oráculo.
        </p>
      </div>

      <div className="mb-6">
        <Prose>
          <p>
            A fines de 1950, John Cage recibió un ejemplar del I Ching. Construyó{" "}
            <b>cartas de 64 valores</b> (sonoridades, duraciones, dinámicas) indexadas por
            los 64 hexagramas y usó <b>tiradas de monedas</b> para elegir de ellas.{" "}
            <i>Music of Changes</i> (1951) es la obra fundacional de la{" "}
            <b>composición por azar</b>. Aquí puedes
            probar el método con una carta propia: cada tirada de{" "}
            <Link href="/experimentos/comparador-sorteo" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              seis monedas
            </Link>{" "}
            elige, con probabilidad 1/64, una de las 64 sonoridades.
          </p>
        </Prose>
      </div>

      {/* Demo */}
      <Panel className="mb-6" accent={ACCENT}>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
          <button onClick={tirar} className="rounded-full px-4 py-2 text-sm" style={{ background: ACCENT, color: "#0b0a08" }}>
            ♪ Tirar las monedas (6 líneas)
          </button>
          {frase.length > 0 && (
            <button onClick={() => setFrase([])} className="rounded-full border px-3 py-2 text-xs" style={{ borderColor: "#3A362E", color: "#8a8271" }}>
              limpiar
            </button>
          )}
        </div>

        {/* La frase generada */}
        <div className="min-h-[120px] rounded-lg border border-ink-700 bg-ink-850/40 p-3">
          {frase.length === 0 ? (
            <p className="py-8 text-center font-mono text-[11px] text-sand-500">
              tira las monedas para seleccionar una sonoridad de la carta y encadenar una frase
            </p>
          ) : (
            <div className="flex flex-wrap items-end gap-2">
              {frase.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="flex items-end" style={{ height: 80 }}>
                    <div className="rounded-sm" style={{ width: 6 + s.duracion * 6, height: 8 + (s.altura / 11) * 64, background: i === frase.length - 1 ? "#f5efdf" : ACCENT, opacity: 0.5 + 0.5 * (s.altura / 11) }} />
                  </div>
                  <span className="font-mono text-[9px] text-sand-500">{s.nota}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {ultimo && (
          <p className="mt-2 text-center text-sm text-sand-300">
            última tirada → hexagrama {hex(ultimo.v).glyph} {hex(ultimo.v).kw}. {hex(ultimo.v).py} → sonoridad «{ultimo.nota}», duración {ultimo.duracion}
          </p>
        )}
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={64} etiqueta="valores en la carta" accent={ACCENT} />
        <Stat valor="1/64" etiqueta="probabilidad de cada uno" accent={ACCENT} />
        <Stat valor={frase.length} etiqueta="tiradas en tu frase" />
        <Stat valor="1951" etiqueta="Music of Changes" />
      </div>

      {/* La carta demostrativa */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>La carta demostrativa (propia, 64 valores)</SectionLabel>
      </div>
      <Panel>
        <div className="grid grid-cols-8 gap-1">
          {CARTA.map((s) => (
            <div key={s.v} className="aspect-square rounded-sm" title={`${hex(s.v).kw}. ${hex(s.v).py} · ${s.nota} · dur ${s.duracion}`} style={{ background: ACCENT, opacity: 0.2 + 0.7 * (s.altura / 11), outline: ultimo?.v === s.v ? "2px solid #f5efdf" : "none" }} />
          ))}
        </div>
        <p className="mt-2 text-center font-mono text-[10px] text-sand-500">
          64 celdas indexadas por hexagrama, con una sonoridad propia cada una (no las cartas de Cage)
        </p>
      </Panel>
    </div>
  );
}
