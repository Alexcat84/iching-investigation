"use client";

import Link from "next/link";
import { DESCARGO, HITOS } from "@/lib/leibniz";
import { ExperimentHeader, Panel, Prose, SectionLabel } from "@/components/ui";

const ACCENT = "#b89a6a";

export default function LeibnizDocumentos() {
  return (
    <div>
      <ExperimentHeader
        kicker="✉ · Bouvet · Shao Yong · 1703"
        titulo="Leibniz: los documentos"
        subtitulo="Cómo el I Ching y el binario europeo se encontraron"
        accent={ACCENT}
      />

      {/* Descargo visible, arriba */}
      <div
        className="mb-6 rounded-xl border p-4"
        style={{ borderColor: ACCENT + "77", background: "rgba(184,154,106,0.06)" }}
      >
        <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: ACCENT }}>
          <span className="text-cinnabar-bright">⚠</span> Descargo
        </div>
        <p className="text-sm leading-relaxed text-sand-300">{DESCARGO}</p>
      </div>

      <div className="mb-8">
        <Prose>
          <p>
            La conexión entre los 64 hexagramas y el sistema binario no es una leyenda: está
            documentada, con fechas y publicaciones. Pero conviene contarla con precisión.
            Estos son los hitos, cada uno con su fuente.
          </p>
        </Prose>
      </div>

      {/* Línea de tiempo */}
      <div className="mb-8">
        <SectionLabel accent={ACCENT}>La cronología, con fuentes</SectionLabel>
        <div className="mt-3 space-y-3">
          {HITOS.map((h) => (
            <Panel key={h.titulo}>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-sm" style={{ color: ACCENT }}>{h.fecha}</span>
                <span className="text-base text-sand-100">{h.titulo}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-sand-300">{h.texto}</p>
              <p className="mt-2 font-mono text-[11px] text-sand-500">fuente: {h.fuente}</p>
            </Panel>
          ))}
        </div>
      </div>

      <div>
        <Panel>
          <Prose>
            <p>
              El diagrama que Bouvet envió es justo el que reconstruye el experimento del{" "}
              <Link href="/experimentos/shao-yong" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
                cuadrado y el círculo de Shao Yong
              </Link>
              : leerlo en orden es contar de 0 a 63. Que dos tradiciones tan distintas
              (una cosmología del siglo XI y una aritmética del XVII) describan la misma
              estructura es el corazón de este laboratorio. Lo demás es leer con cuidado
              quién hizo qué, y cuándo.
            </p>
          </Prose>
        </Panel>
      </div>
    </div>
  );
}
