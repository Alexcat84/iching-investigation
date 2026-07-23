"use client";

import { useState } from "react";
import Link from "next/link";
import { hex } from "@/lib/iching";
import {
  PRESETS,
  type Regla,
  conteo,
  conteoCiclico,
  sucesion,
  autovalorDominante,
  CATALAN,
  catalan,
} from "@/lib/transferencia";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#8f7fd6";
const ETIQ = ["yin", "yang"];

function Glifo({ v }: { v: number }) {
  const bits = hex(v).bits;
  const w = 22;
  const bar = 2.4;
  const gap = 2.4;
  const rows = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = (6 - k) * (gap + bar);
    if (yang) rows.push(<rect key={k} x={0} y={y} width={w} height={bar} rx={0.5} fill={ACCENT} />);
    else {
      const seg = w * 0.4;
      rows.push(
        <rect key={`${k}a`} x={0} y={y} width={seg} height={bar} rx={0.5} fill={ACCENT} />,
        <rect key={`${k}b`} x={w - seg} y={y} width={seg} height={bar} rx={0.5} fill={ACCENT} />,
      );
    }
  }
  return (
    <svg viewBox={`0 0 ${w} ${6 * bar + 5 * gap}`} width={w} height={6 * bar + 5 * gap} aria-hidden="true">
      {rows}
    </svg>
  );
}

export default function MatrizTransferencia() {
  const [M, setM] = useState<Regla>([
    [0, 1],
    [1, 1],
  ]);

  const toggle = (i: number, j: number) => {
    const N = M.map((r) => r.slice());
    N[i][j] = N[i][j] ? 0 : 1;
    setM(N);
  };
  const igual = (A: Regla) => JSON.stringify(A) === JSON.stringify(M);

  const seq = sucesion(M);
  const cic = [2, 3, 4, 5, 6].map((n) => conteoCiclico(M, n));
  const lam = autovalorDominante(M);
  const maxSeq = Math.max(...seq, 1);

  return (
    <div>
      <ExperimentHeader
        kicker="T · 易 · la transformada z del conteo"
        titulo="La matriz de transferencia: diseña tu regla"
        subtitulo="Elige qué líneas pueden ir juntas y cuenta"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El experimento{" "}
            <Link href="/experimentos/fibonacci-hexagrama" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Fibonacci en el hexagrama
            </Link>{" "}
            era un caso: prohibir dos yin seguidos. Aquí eliges tú qué <b>adyacencias</b>{" "}
            permites, con una matriz 2x2 M donde M[a][b] = 1 si la línea b puede ir sobre la
            a. Sus <b>potencias</b> cuentan las figuras por número de líneas (1ᵀM<sup>n-1</sup>1),
            su <b>traza</b> las cíclicas, y su <b>autovalor dominante</b> es la razón de
            crecimiento. Es la <b>transformada z</b> del conteo; la de Laplace no aplica,
            porque el I Ching no tiene tiempo continuo: el no honesto junto al sí discreto.
          </p>
        </Prose>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((pr) => (
          <button key={pr.id} onClick={() => setM(pr.M.map((r) => r.slice()))} className="rounded-full border px-3 py-1.5 text-xs transition-colors" style={igual(pr.M) ? { background: ACCENT, color: "#0b0a08", borderColor: "transparent" } : { borderColor: "#3A362E", color: "#8a8271" }}>
            {pr.nombre}
          </button>
        ))}
      </div>

      <Panel className="mb-6" accent={ACCENT}>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {/* La matriz editable */}
          <div>
            <div className="mb-2 text-center font-mono text-[11px] text-sand-500">toca una casilla: ¿puede ir b sobre a?</div>
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-[auto_repeat(2,44px)] gap-1">
                <span />
                {ETIQ.map((e) => (
                  <span key={e} className="text-center font-mono text-[10px] text-sand-500">{e}</span>
                ))}
                {M.map((row, i) => (
                  <div key={i} className="contents">
                    <span className="flex items-center justify-end pr-1 font-mono text-[10px] text-sand-500">{ETIQ[i]}</span>
                    {row.map((val, j) => (
                      <button key={j} onClick={() => toggle(i, j)} className="h-11 w-11 rounded-md border text-sm transition-colors" style={val ? { background: `${ACCENT}33`, borderColor: ACCENT, color: "#E8E1D0" } : { borderColor: "#2E2820", color: "#5A5346" }}>
                        {val ? "1" : "0"}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Conteos */}
          <div className="min-w-[220px]">
            <div className="mb-1 font-mono text-[11px] text-sand-500">figuras por número de líneas (n = 1..6)</div>
            <div className="flex items-end gap-2" style={{ height: 90 }}>
              {seq.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-[10px] text-sand-300">{v}</span>
                  <div className="w-full rounded-sm" style={{ height: `${(v / maxSeq) * 64 + 4}px`, background: ACCENT }} />
                  <span className="font-mono text-[9px] text-sand-600">{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 font-mono text-[11px] text-sand-500">cíclicas (traza) n = 2..6: {cic.join(", ")}</div>
          </div>
        </div>
      </Panel>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={seq.join(" ")} etiqueta="sucesión de conteos" accent={ACCENT} />
        <Stat valor={lam.toFixed(4)} etiqueta="autovalor dominante (crecimiento)" accent={ACCENT} />
        <Stat valor={conteo(M, 6)} etiqueta="hexagramas válidos (6 líneas)" />
        <Stat valor={conteoCiclico(M, 6)} etiqueta="válidos en anillo" />
      </div>

      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Caso especial: los caminos de Catalan</SectionLabel>
      </div>
      <Panel>
        <Prose>
          <p>
            Fuera de las reglas de adyacencia hay otro conteo famoso escondido: los
            hexagramas <b>balanceados</b> (tres yang, tres yin) donde, leyendo de abajo
            arriba, el yang <b>nunca va por detrás</b> del yin. Son los caminos de Dyck, y
            hay exactamente <b>C₃ = {catalan(3)}</b>.
          </p>
        </Prose>
        <div className="mt-3 flex flex-wrap justify-center gap-4">
          {CATALAN.map((v) => (
            <div key={v} className="flex flex-col items-center gap-1">
              <Glifo v={v} />
              <span className="font-mono text-[10px] text-sand-500">{hex(v).kw}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-[11px] text-sand-500">
          los {CATALAN.length} hexagramas de Catalan: {CATALAN.join(", ")}
        </p>
      </Panel>
    </div>
  );
}
