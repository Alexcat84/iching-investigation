"use client";

import { useState } from "react";
import { hex } from "@/lib/iching";
import {
  COTA_HAMMING,
  MAXIMO,
  CODIGO_MAXIMO,
  distanciaMinima,
  corrige,
  hamming,
  PAR_YANG,
  IMPAR_YANG,
  aristasCruzan,
  collares,
  pulseras,
  COLLARES_POLYA,
} from "@/lib/cubo-no";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#d0563f";
const CX = 150;
const CY = 150;

function anillo(v: number, r = 120): [number, number] {
  const a = -Math.PI / 2 + (v * 2 * Math.PI) / 64;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

const ACTOS = [
  { id: "codigo", nombre: "1 · Códigos correctores" },
  { id: "biparticion", nombre: "2 · Bipartición" },
  { id: "polya", nombre: "3 · Collares de Pólya" },
] as const;

export default function CuboDiceNo() {
  const [acto, setActo] = useState<"codigo" | "biparticion" | "polya">("codigo");
  const [recibido, setRecibido] = useState<number | null>(null);
  const cod = new Set(CODIGO_MAXIMO);
  const corregido = recibido !== null ? corrige(recibido) : null;

  return (
    <div>
      <ExperimentHeader
        kicker="無 · 易 · teoremas de imposibilidad"
        titulo="El cubo dice que no"
        subtitulo="Tres teoremas de imposibilidad sobre Q6"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            No todo lo que se desea existe. Los primeros teoremas de <b>imposibilidad</b> del
            sitio, en tres actos verificados: cuántos hexagramas pueden corregirse entre sí,
            por qué no hay ciclos impares de mutaciones, y cuántos collares distintos hacen
            las seis líneas al girar.
          </p>
        </Prose>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {ACTOS.map((a) => (
          <button key={a.id} onClick={() => setActo(a.id)} className="rounded-full border px-3 py-1.5 text-xs transition-colors" style={acto === a.id ? { background: ACCENT, color: "#0b0a08", borderColor: "transparent" } : { borderColor: "#3A362E", color: "#8a8271" }}>
            {a.nombre}
          </button>
        ))}
      </div>

      {acto === "codigo" && (
        <>
          <Panel className="mb-6" accent={ACCENT}>
            <p className="mb-3 text-sm leading-relaxed text-sand-300">
              La <b>cota de empaquetado de esferas</b> dice que a distancia 3 caben a lo sumo{" "}
              64 / (1 + 6) = {(64 / 7).toFixed(2)}, es decir <b>{COTA_HAMMING}</b> palabras. Pero 7 no
              divide a 64: <b>no hay código perfecto</b>. El máximo real es{" "}
              <b style={{ color: ACCENT }}>{MAXIMO}</b>, probado por búsqueda exhaustiva. Estos 8
              hexagramas se corrigen entre sí: cualquier error de una línea se detecta y repara.
            </p>
            <svg viewBox="0 0 300 300" className="mx-auto w-full max-w-[340px]" role="img" aria-label="Los 64 hexagramas en anillo; 8 forman un código a distancia 3. Al elegir un hexagrama recibido, una línea lo une a su palabra más cercana.">
              {Array.from({ length: 64 }, (_, v) => {
                const [x, y] = anillo(v);
                const es = cod.has(v);
                return <circle key={v} cx={x} cy={y} r={es ? 5 : 2} fill={es ? ACCENT : recibido === v ? "#f5efdf" : "#3A352C"} style={{ cursor: "pointer" }} onClick={() => setRecibido(v)} />;
              })}
              {recibido !== null && corregido !== null && recibido !== corregido && (() => {
                const [x1, y1] = anillo(recibido);
                const [x2, y2] = anillo(corregido);
                return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f5efdf" strokeWidth={1} strokeDasharray="3 3" />;
              })()}
            </svg>
            {recibido !== null && corregido !== null && (
              <p className="mt-2 text-center text-sm text-sand-300">
                recibido {hex(recibido).glyph} {hex(recibido).py} → se corrige a {hex(corregido).glyph} {hex(corregido).py}{" "}
                {recibido === corregido ? "(es una palabra del código)" : `(a ${hamming(recibido, corregido)} línea${hamming(recibido, corregido) > 1 ? "s" : ""})`}
              </p>
            )}
            <p className="mt-1 text-center font-mono text-[10px] text-sand-500">
              toca cualquier hexagrama: si es un error de una línea, se repara al código más cercano
            </p>
          </Panel>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat valor={COTA_HAMMING} etiqueta="cota de empaquetado" />
            <Stat valor={MAXIMO} etiqueta="máximo real (búsqueda exhaustiva)" accent={ACCENT} />
            <Stat valor={distanciaMinima(CODIGO_MAXIMO)} etiqueta="distancia mínima del código" />
            <Stat valor={CODIGO_MAXIMO.length * 7} etiqueta="hexagramas cubiertos (8 × 7)" />
          </div>
        </>
      )}

      {acto === "biparticion" && (
        <>
          <Panel className="mb-6" accent={ACCENT}>
            <p className="mb-3 text-sm leading-relaxed text-sand-300">
              Parte los 64 según la <b>paridad</b> del número de líneas yang: 32 pares y 32
              impares. Como voltear una línea cambia el conteo de yang en 1, <b>toda</b>{" "}
              mutación cruza de una mitad a la otra. Las <b>{aristasCruzan()}</b> aristas del
              hipercubo cruzan: Q6 es <b>bipartito</b>, y por eso no existen ciclos impares de
              mutaciones (nunca vuelves al mismo hexagrama en un número impar de pasos).
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { t: "yang par", vs: PAR_YANG, col: "#5b8fd9" },
                { t: "yang impar", vs: IMPAR_YANG, col: ACCENT },
              ].map((g) => (
                <div key={g.t} className="rounded-lg border border-ink-700 bg-ink-850/40 p-2">
                  <div className="mb-1 text-center font-mono text-[11px]" style={{ color: g.col }}>{g.t} · {g.vs.length}</div>
                  <div className="grid grid-cols-8 gap-0.5">
                    {g.vs.map((v) => (
                      <div key={v} className="aspect-square rounded-sm" style={{ background: g.col, opacity: 0.5 }} title={`${hex(v).kw}. ${hex(v).py}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat valor="32 / 32" etiqueta="bipartición por paridad" accent={ACCENT} />
            <Stat valor={aristasCruzan()} etiqueta="aristas que cruzan (de 192)" accent={ACCENT} />
            <Stat valor={0} etiqueta="aristas dentro de una mitad" />
            <Stat valor="bipartito" etiqueta="sin ciclos impares" />
          </div>
        </>
      )}

      {acto === "polya" && (
        <>
          <Panel className="mb-6" accent={ACCENT}>
            <p className="mb-3 text-sm leading-relaxed text-sand-300">
              Si giramos las seis líneas como un anillo, muchos hexagramas se vuelven el mismo
              collar. La <b>enumeración de Pólya</b> cuenta cuántos collares distintos hay:
              (1/6)·Σ φ(d)·2<sup>6/d</sup> = <b style={{ color: ACCENT }}>{COLLARES_POLYA}</b>. La
              fórmula coincide exactamente con la enumeración directa de órbitas, <b>{collares()}</b>.
              Y si además permitimos el reflejo (el grupo diédrico), quedan <b>{pulseras()}</b>{" "}
              pulseras.
            </p>
          </Panel>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat valor={collares()} etiqueta="collares (rotación C6)" accent={ACCENT} />
            <Stat valor={COLLARES_POLYA} etiqueta="fórmula de Pólya (coincide)" />
            <Stat valor={pulseras()} etiqueta="pulseras (con reflejo, D6)" accent={ACCENT} />
            <Stat valor={64} etiqueta="hexagramas antes de identificar" />
          </div>
        </>
      )}
    </div>
  );
}
