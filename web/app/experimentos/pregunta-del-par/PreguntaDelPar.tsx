"use client";

import { useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import {
  FAN,
  DUI,
  CRITERIOS,
  evaluar,
  EMPATE_MAS_YANG,
  YANG_SUPERIOR,
  YANG_INFERIOR,
  LINEAS_SUPERIOR,
  LINEAS_INFERIOR,
  DIST_SUPERIOR,
  DIST_INFERIOR,
  AUTOVOLTEADOS,
} from "@/lib/pregunta-par";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#b9884a";
const SEGUNDO = "#6a9fd0";

const fmtP = (p: number) => p.toFixed(3).replace(".", ",");

export default function PreguntaDelPar() {
  const [critId, setCritId] = useState("valor");
  const crit = CRITERIOS.find((c) => c.id === critId)!;
  const r = evaluar(crit);

  return (
    <div>
      <ExperimentHeader
        kicker="問 · 易 · ¿qué decide el orden dentro del par?"
        titulo="La pregunta del par"
        subtitulo="¿Qué decide cuál hexagrama va primero?"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El{" "}
            <Link href="/experimentos/rey-wen" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              orden del Rey Wen
            </Link>{" "}
            agrupa los 64 en 32 pares. Dentro de cada par, <b>¿qué decide cuál va
            primero?</b> La literatura lo declara una pregunta abierta. El laboratorio
            responde en tres actos, y el resumen es honesto: no lo decide la estructura
            binaria.
          </p>
        </Prose>
      </div>

      {/* (a) micro-teorema */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Acto 1: un micro-teorema de imposibilidad</SectionLabel>
      </div>
      <Panel className="mb-6" accent={ACCENT}>
        <p className="text-sm leading-relaxed text-sand-300">
          El primer criterio que uno probaría, <b>primero el de más yang</b>, es{" "}
          <b>indecidible por construcción</b>: los 28 pares no simétricos se forman por{" "}
          <b>volteo</b> (fan), que invierte el orden de las líneas y por tanto{" "}
          <b>conserva el número de yang</b>. Los dos miembros empatan siempre:{" "}
          <b style={{ color: ACCENT }}>{EMPATE_MAS_YANG}/28</b>. No hay nada que decidir.
        </p>
      </Panel>

      {/* (b) batería de criterios */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Acto 2: la batería de criterios</SectionLabel>
      </div>
      <Panel className="mb-6" accent={ACCENT}>
        <div className="mb-3 flex flex-wrap gap-2">
          {CRITERIOS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCritId(c.id)}
              className="rounded-full px-3 py-1.5 text-xs transition-colors"
              style={{
                background: c.id === critId ? ACCENT : "transparent",
                color: c.id === critId ? "#0b0a08" : "#c9c0ac",
                border: `1px solid ${c.id === critId ? ACCENT : "#3A362E"}`,
              }}
            >
              {c.nombre}
            </button>
          ))}
        </div>

        <p className="mb-3 text-sm text-sand-400">{crit.descripcion}.</p>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat valor={`${r.gana}/${r.decidibles}`} etiqueta="gana el primero" accent={ACCENT} />
          <Stat valor={`p = ${fmtP(r.p)}`} etiqueta="binomial (una cola)" />
          <Stat valor={r.empata > 0 ? r.empata : "0"} etiqueta="empates (indecidibles)" />
        </div>

        {/* los 28 pares */}
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
          {FAN.map((p) => {
            const v = crit.evalua(p, 2 * p.i);
            const primero = v > 0;
            const segundo = v < 0;
            return (
              <div
                key={p.i}
                title={`${hex(p.a).kw}. ${hex(p.a).py} / ${hex(p.b).kw}. ${hex(p.b).py}`}
                className="flex items-center justify-center gap-0.5 rounded border border-ink-700 bg-ink-850/40 py-1.5"
              >
                <span className="text-lg leading-none" style={{ color: primero ? ACCENT : "#5a5346" }}>{hex(p.a).glyph}</span>
                <span className="text-lg leading-none" style={{ color: segundo ? SEGUNDO : "#5a5346" }}>{hex(p.b).glyph}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 font-mono text-[10px] text-sand-500">
          cada celda es un par (primero · segundo); en color, el ganador del criterio · gris = empate o no aplica
        </p>

        <p className="mt-3 text-sm leading-relaxed text-sand-300">
          Todos los criterios estructurales dan p altos: son <b>compatibles con una moneda al
          aire</b>. Si existe la regla que ordena cada par, <b>no vive en la estructura
          binaria</b>; quizá en el texto, y eso queda declarado <b>fuera del alcance</b> del
          laboratorio.
        </p>
      </Panel>

      {/* los 4 pares simétricos */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Los 4 pares simétricos (van por opuesto)</SectionLabel>
      </div>
      <Panel className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {DUI.map((p) => (
            <div key={p.i} className="flex items-center gap-1 rounded-lg border border-ink-700 bg-ink-850/40 px-3 py-2" title={`${hex(p.a).kw} / ${hex(p.b).kw}`}>
              <span className="text-xl" style={{ color: "#8a8272" }}>{hex(p.a).glyph}</span>
              <span className="text-xl" style={{ color: "#8a8272" }}>{hex(p.b).glyph}</span>
              <span className="ml-1 font-mono text-[10px] text-sand-500">{hex(p.a).kw}/{hex(p.b).kw}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sand-300">
          Estos 4 son los <b>autovolteados</b> (el volteo los deja igual), así que el Rey Wen
          los empareja por <b>opuesto</b> (dui), no por volteo. Quedan aparte de la batería.
        </p>
      </Panel>

      {/* (c) los dos cánones */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Acto 3: los dos cánones</SectionLabel>
      </div>
      <Panel>
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat valor={`${YANG_SUPERIOR}/${LINEAS_SUPERIOR}`} etiqueta="yang, canon superior (1 a 30)" accent={ACCENT} />
          <Stat valor={`${YANG_INFERIOR}/${LINEAS_INFERIOR}`} etiqueta="yang, canon inferior (31 a 64)" />
          <Stat valor={DIST_SUPERIOR.toFixed(2).replace(".", ",")} etiqueta="distancia de transición superior" accent={ACCENT} />
          <Stat valor={DIST_INFERIOR.toFixed(2).replace(".", ",")} etiqueta="distancia de transición inferior" />
        </div>
        <Prose>
          <p>
            El libro se divide en dos cánones. El superior es algo más parco en yang (86 de
            180 líneas frente a 106 de 204), y las distancias de transición son casi iguales
            (3,38 y 3,33, sin diferencia apreciable). Y una curiosidad, sin test: los{" "}
            <b>8 hexagramas autovolteados</b> caen en las posiciones{" "}
            <b style={{ color: ACCENT }}>{AUTOVOLTEADOS.join(", ")}</b>, y el canon superior
            <b> termina exactamente</b> tras su tercer par simétrico (el 29-30).
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
