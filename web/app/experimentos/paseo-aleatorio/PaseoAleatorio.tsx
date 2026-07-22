"use client";

import { useEffect, useRef, useState } from "react";
import { hex } from "@/lib/iching";
import {
  paso,
  RETORNO_ESPERADO,
  tiempoCobertura,
  tiempoRetorno,
} from "@/lib/paseo";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#6ab0a0";
const CX = 200;
const CY = 200;
const R = 158;

function pos(v: number): [number, number] {
  const a = -Math.PI / 2 + (v * 2 * Math.PI) / 64;
  return [CX + R * Math.cos(a), CY + R * Math.sin(a)];
}

export default function PaseoAleatorio() {
  const [v, setV] = useState(0);
  const [vistos, setVistos] = useState<Set<number>>(new Set([0]));
  const [pasos, setPasos] = useState(0);
  const [andando, setAndando] = useState(false);
  const [sim, setSim] = useState<{ cover: number; ret: number; coverMedia: number } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!andando) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setV((cur) => {
        const nx = paso(cur);
        setVistos((s) => {
          if (s.has(nx)) return s;
          const n = new Set(s);
          n.add(nx);
          if (n.size >= 64) setAndando(false);
          return n;
        });
        setPasos((p) => p + 1);
        return nx;
      });
    }, 90);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [andando]);

  const reiniciar = () => {
    setAndando(false);
    setV(0);
    setVistos(new Set([0]));
    setPasos(0);
  };

  const simular = () => {
    let cover = 0;
    const T = 2000;
    for (let t = 0; t < T; t++) cover += tiempoCobertura(0);
    setSim({
      cover: tiempoCobertura(0),
      ret: tiempoRetorno(),
      coverMedia: cover / T,
    });
  };

  return (
    <div>
      <ExperimentHeader
        kicker="↝ · paseo simple sobre Q6"
        titulo="Paseo aleatorio y cobertura"
        subtitulo="Cuánto tarda un caminante en ver los 64 hexagramas"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Un caminante empieza en Kun y, en cada paso, muta <b>una línea al azar</b>. Es
            el paseo aleatorio simple sobre el hipercubo. Dos preguntas clásicas: ¿cuánto
            tarda en <b>volver</b> al origen, y cuánto en <b>ver los 64</b> estados? La
            primera tiene respuesta exacta; la segunda se estima simulando.
          </p>
        </Prose>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={`${vistos.size}/64`} etiqueta="vistos en este paseo" accent={ACCENT} />
        <Stat valor={pasos} etiqueta="pasos dados" />
        <Stat valor={RETORNO_ESPERADO} etiqueta="retorno esperado (exacto)" accent={ACCENT} />
        <Stat valor="≈ 360" etiqueta="cobertura media (simulada)" />
      </div>

      {/* Controles + anillo */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {!andando ? (
          <button onClick={() => setAndando(true)} className="rounded-full px-4 py-1.5 text-sm" style={{ background: ACCENT, color: "#0b0a08" }}>
            {vistos.size >= 64 ? "▶ Otra vez" : "▶ Caminar"}
          </button>
        ) : (
          <button onClick={() => setAndando(false)} className="rounded-full border border-ink-600 px-4 py-1.5 text-sm">
            ⏸ Pausa
          </button>
        )}
        <button onClick={reiniciar} className="rounded-full border border-ink-700 px-3 py-1.5 text-sm text-sand-400">
          Reiniciar
        </button>
        <span className="font-mono text-xs text-sand-400">
          en {hex(v).kw}. {hex(v).py}
          {vistos.size >= 64 && <span style={{ color: ACCENT }}> · ¡cubiertos los 64 en {pasos} pasos!</span>}
        </span>
      </div>

      <Panel className="mb-8">
        <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[420px]" role="img" aria-label="paseo aleatorio sobre el anillo de los 64 hexagramas">
          <circle cx={CX} cy={CY} r={R + 14} fill="none" stroke="#2A2620" />
          {Array.from({ length: 64 }, (_, u) => {
            const [x, y] = pos(u);
            const visto = vistos.has(u);
            const actual = u === v;
            return (
              <circle
                key={u}
                cx={x}
                cy={y}
                r={actual ? 6 : visto ? 3.5 : 2}
                fill={actual ? "#f5efdf" : visto ? ACCENT : "#3a362e"}
                opacity={actual ? 1 : visto ? 0.85 : 1}
              />
            );
          })}
          <circle cx={pos(0)[0]} cy={pos(0)[1]} r={9} fill="none" stroke="#8a8271" strokeWidth={1} />
          <text x={CX} y={CY} textAnchor="middle" dy="0.35em" style={{ fontSize: 12, fontFamily: "monospace" }} fill={ACCENT}>
            {vistos.size}/64
          </text>
        </svg>
        <p className="mt-1 text-center font-mono text-[10px] text-sand-500">
          el nodo claro es el caminante; los verdes, ya vistos; el aro marca el origen (Kun)
        </p>
      </Panel>

      {/* Simulación */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel accent={ACCENT}>Simulación (2000 coberturas)</SectionLabel>
          <button onClick={simular} className="rounded-full border px-3 py-1.5 font-mono text-xs" style={{ borderColor: ACCENT, color: ACCENT }}>
            Simular
          </button>
        </div>
        <Panel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat valor={sim ? sim.coverMedia.toFixed(0) : "–"} etiqueta="cobertura media (pasos)" accent={ACCENT} />
            <Stat valor={sim ? sim.cover : "–"} etiqueta="una cobertura de ejemplo" />
            <Stat valor={sim ? sim.ret : "–"} etiqueta="un retorno de ejemplo (teoría 64)" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sand-300">
            El tiempo esperado de retorno al origen es <b style={{ color: ACCENT }}>exactamente 64</b>:
            como el paseo es simétrico, su estacionaria es uniforme (1/64 cada estado) y el
            retorno medio es su inverso. La cobertura de los 64 tarda mucho más, unos{" "}
            <b>360 pasos</b> de media: visitar el último puñado de estados nuevos es lo
            que más cuesta. La simulación con semilla fija queda dentro de esa banda,
            verificada por la suite.
          </p>
        </Panel>
      </div>
    </div>
  );
}
