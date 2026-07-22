"use client";

import { useMemo, useState } from "react";
import { ALL_HEX, hex } from "@/lib/iching";
import {
  AMINO_INFO,
  aminoDe,
  CODIFICACIONES,
  hexACodon,
  NUM_CODIFICACIONES,
} from "@/lib/codones";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#7cbf8a";
const DESCARGO =
  "Los 64 hexagramas y los 64 codones coinciden en número (ambos son 4³ = 2⁶), y eso permite emparejarlos. Pero es un isomorfismo de estructura combinatoria, no un hecho biológico ni una afinidad mística: no hay ninguna razón por la que un hexagrama 'sea' un aminoácido. Este experimento lo demuestra enseñando que el emparejamiento depende de una elección arbitraria.";

export default function Codones() {
  const [encIdx, setEncIdx] = useState(0);
  const [sel, setSel] = useState(0);
  const enc = CODIFICACIONES[encIdx];

  const h = hex(sel);
  const codon = hexACodon(sel, enc);
  const amino = aminoDe(sel, enc);

  // aminoácido del hexagrama seleccionado bajo TODAS las codificaciones (para mostrar la variación)
  const bajoTodas = useMemo(
    () => new Set(CODIFICACIONES.map((e) => aminoDe(sel, e))),
    [sel],
  );

  return (
    <div>
      <ExperimentHeader
        kicker="遺 · 64 = 4³ = 2⁶"
        titulo="Los 64 codones"
        subtitulo="El código genético también tiene 64 elementos"
        accent={ACCENT}
      />

      {/* Descargo visible */}
      <div className="mb-6 rounded-xl border p-4" style={{ borderColor: ACCENT + "77", background: "rgba(124,191,138,0.06)" }}>
        <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: ACCENT }}>
          <span className="text-cinnabar-bright">⚠</span> Descargo
        </div>
        <p className="text-sm leading-relaxed text-sand-300">{DESCARGO}</p>
      </div>

      <div className="mb-6">
        <Prose>
          <p>
            Cada codón son tres bases, y cada base se puede escribir con 2 bits: 3 × 2 =
            6 bits, un hexagrama. Para emparejarlos hay que decidir qué par de bits es
            cada base, y ahí está el truco: hay <b>4! = {NUM_CODIFICACIONES}</b>{" "}
            asignaciones posibles y <b>ninguna es canónica</b>. Cambia la codificación y
            el mapeo entero se reorganiza. La correspondencia es real como estructura y
            arbitraria en los detalles.
          </p>
        </Prose>
      </div>

      {/* Selector de codificación */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <SectionLabel accent={ACCENT}>Codificación base → 2 bits</SectionLabel>
        <div className="flex items-center gap-2 font-mono text-xs">
          {[0, 1, 2, 3].map((p) => (
            <span key={p} className="rounded-md border border-ink-700 px-2 py-1 text-sand-300">
              {p.toString(2).padStart(2, "0")} → <b style={{ color: ACCENT }}>{enc[p]}</b>
            </span>
          ))}
        </div>
        <button
          onClick={() => setEncIdx((i) => (i + 1) % NUM_CODIFICACIONES)}
          className="rounded-full border px-3 py-1.5 font-mono text-xs"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          otra ({encIdx + 1}/{NUM_CODIFICACIONES})
        </button>
      </div>

      {/* Rejilla de los 64 */}
      <Panel className="mb-6">
        <div className="grid grid-cols-8 gap-1">
          {ALL_HEX.map((x) => {
            const a = aminoDe(x.v, enc);
            const info = AMINO_INFO[a];
            const esSel = x.v === sel;
            return (
              <button
                key={x.v}
                onClick={() => setSel(x.v)}
                className="flex flex-col items-center rounded p-1 transition-transform hover:scale-110"
                style={{ outline: esSel ? `1.5px solid ${ACCENT}` : "none" }}
                title={`${x.kw}. ${x.py} → ${hexACodon(x.v, enc)} → ${info.nombre}`}
              >
                <span className="font-mono text-[13px] font-bold" style={{ color: info.color }}>
                  {a === "*" ? "■" : a}
                </span>
                <span className="font-mono text-[8px] text-sand-500">{hexACodon(x.v, enc)}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 font-mono text-[10px] text-sand-500">
          los 64 hexagramas (orden Fu Xi) → codón → aminoácido, coloreado por clase. ■ =
          codón de parada. Toca uno para el detalle.
        </p>
      </Panel>

      {/* Detalle del hexagrama */}
      <div className="mb-6">
        <Panel accent={ACCENT}>
          <div className="flex flex-wrap items-center gap-5">
            <div className="text-center">
              <Glyph bits={h.bits} size={44} className="text-sand-100" />
              <div className="mt-1 font-mono text-[10px] text-sand-500">{h.kw}. {h.py}</div>
            </div>
            <div className="font-mono text-sm text-sand-300">
              {h.bits} → pares{" "}
              <span style={{ color: ACCENT }}>
                {[(sel >> 4) & 3, (sel >> 2) & 3, sel & 3].map((p) => p.toString(2).padStart(2, "0")).join(" ")}
              </span>{" "}
              → codón <span className="text-sand-100">{codon}</span> →{" "}
              <span style={{ color: AMINO_INFO[amino].color }}>{AMINO_INFO[amino].nombre}</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-sand-400">
            Ese mismo hexagrama, según cuál de las {NUM_CODIFICACIONES} codificaciones uses,
            puede caer en <b style={{ color: ACCENT }}>{bajoTodas.size}</b> aminoácidos
            distintos. No hay uno "verdadero": la elección es libre.
          </p>
        </Panel>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat valor="64 = 4³" etiqueta="codones = 2⁶ hexagramas" accent={ACCENT} />
        <Stat valor={NUM_CODIFICACIONES} etiqueta="codificaciones posibles (4!)" accent={ACCENT} />
        <Stat valor="0" etiqueta="codificaciones canónicas" />
      </div>

      <p className="mt-6 text-center font-mono text-[11px] text-sand-600">
        Tabla de aminoácidos: código genético estándar (NCBI, tabla de traducción 1).
      </p>
    </div>
  );
}
