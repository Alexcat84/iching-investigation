"use client";

import Link from "next/link";
import {
  entropiaLinea,
  entropiaValor,
  entropiaMovimiento,
  HEXAGRAMA_UNIFORME,
  ESTACIONARIA_MONEDAS,
  ESTACIONARIA_MILENRAMA,
} from "@/lib/entropia";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#d98f6b";
const COL = { monedas: "#6B6353", milenrama: ACCENT };

/** Barra apilada valor + movimiento. */
function BarraMetodo({ metodo, x, w, escala }: { metodo: "monedas" | "milenrama"; x: number; w: number; escala: number }) {
  const valor = entropiaValor(metodo);
  const mov = entropiaMovimiento(metodo);
  const yBase = 150;
  const hValor = valor * escala;
  const hMov = mov * escala;
  return (
    <g>
      <rect x={x} y={yBase - hValor} width={w} height={hValor} rx={2} fill={COL[metodo]} opacity={0.55} />
      <rect x={x} y={yBase - hValor - hMov - 2} width={w} height={hMov} rx={2} fill={COL[metodo]} />
      <text x={x + w / 2} y={yBase - hValor - hMov - 8} textAnchor="middle" fontSize={12} fill={COL[metodo]} fontFamily="ui-monospace, monospace">
        {(valor + mov).toFixed(4)}
      </text>
      <text x={x + w / 2} y={yBase + 14} textAnchor="middle" fontSize={10} fill="#8a8271" fontFamily="ui-monospace, monospace">
        {metodo}
      </text>
    </g>
  );
}

export default function EntropiaOraculo() {
  const escala = 60; // px por bit
  const dif = entropiaLinea("monedas") - entropiaLinea("milenrama");
  return (
    <div>
      <ExperimentHeader
        kicker="熵 · 易 · entropía de Shannon (1948)"
        titulo="La entropía del oráculo"
        subtitulo="Cuánta información da cada método, en bits"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            La <b>entropía de Shannon</b>, H = menos la suma de p·log₂p, mide la información
            en bits. Un hexagrama uniforme son exactamente <b>6 bits</b>, el máximo para 64
            estados. Pero no todos los métodos dan lo mismo: una línea de{" "}
            <Link href="/experimentos/probabilidades" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              monedas
            </Link>{" "}
            tiene más entropía que una de milenrama, y toda la diferencia está en el{" "}
            <b>movimiento</b> (viejo o joven), porque el <b>valor</b> yin/yang puro es 1 bit
            exacto en ambos. En la primera página de aquel artículo de 1948 aparece, por
            primera vez, la palabra <b>bit</b>.
          </p>
        </Prose>
      </div>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Entropía de una línea: valor + movimiento</SectionLabel>
      </div>
      <Panel className="mb-6">
        <svg viewBox="0 0 300 175" className="mx-auto w-full max-w-[360px]" role="img" aria-label="Entropía de una línea por método, dividida en la parte del valor yin/yang (1 bit en ambos) y la parte del movimiento.">
          <line x1={30} y1={150 - 1 * escala} x2={270} y2={150 - 1 * escala} stroke="#3A352C" strokeDasharray="3 2" strokeWidth={0.8} />
          <text x={274} y={150 - 1 * escala + 3} fontSize={9} fill="#6b6353" fontFamily="ui-monospace, monospace">1 bit (valor)</text>
          <BarraMetodo metodo="monedas" x={70} w={54} escala={escala} />
          <BarraMetodo metodo="milenrama" x={176} w={54} escala={escala} />
        </svg>
        <p className="mt-1 text-center font-mono text-[10px] text-sand-500">
          claro = valor yin/yang (1 bit en ambos) · sólido = movimiento (viejo/joven)
        </p>
      </Panel>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={`${HEXAGRAMA_UNIFORME} bits`} etiqueta="hexagrama uniforme (máximo)" accent={ACCENT} />
        <Stat valor={entropiaLinea("monedas").toFixed(4)} etiqueta="línea de monedas" />
        <Stat valor={entropiaLinea("milenrama").toFixed(4)} etiqueta="línea de milenrama" accent={ACCENT} />
        <Stat valor={dif.toFixed(4)} etiqueta="diferencia (toda en el movimiento)" />
      </div>

      <div className="mb-2 mt-6">
        <SectionLabel accent={ACCENT}>A largo plazo: la estacionaria</SectionLabel>
      </div>
      <Panel>
        <Prose>
          <p>
            Encadenando consultas (la{" "}
            <Link href="/experimentos/markov-consultas" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              cadena de Markov
            </Link>
            ), la distribución de equilibrio de las monedas es uniforme y conserva los{" "}
            <b>{ESTACIONARIA_MONEDAS} bits</b>; la de la milenrama se sesga al yin y baja a{" "}
            <b>{ESTACIONARIA_MILENRAMA.toFixed(4)} bits</b> = 6·H(1/4). El método antiguo no
            solo cambia a dónde tiende la serie, sino cuánta información retiene.
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
