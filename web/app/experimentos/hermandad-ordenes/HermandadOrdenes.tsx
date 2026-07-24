"use client";

import Link from "next/link";
import { HERMANDAD, VS_FUXI, ESPERANZA, DESVIACION, NOMBRE, MC } from "@/lib/hermandad";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#d0a24e";

// Posiciones de los nodos en el grafo (Fu Xi al centro, los tres históricos alrededor).
const NODO: Record<string, [number, number]> = {
  reywen: [90, 66],
  mawangdui: [310, 66],
  jingfang: [200, 250],
  fuxi: [200, 150],
};

function fmtZ(z: number): string {
  return (z >= 0 ? "+" : "−") + Math.abs(z).toFixed(2).replace(".", ",");
}

export default function HermandadOrdenes() {
  return (
    <div>
      <ExperimentHeader
        kicker="系 · 易 · inversiones de Kendall"
        titulo="El árbol genealógico de los órdenes"
        subtitulo="Quién se parece a quién, medido en inversiones"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El experimento de{" "}
            <Link href="/experimentos/permutacion" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Rey Wen como permutación
            </Link>{" "}
            midió que el orden tradicional tiene <b>1013</b> inversiones contra el binario
            (Fu Xi), casi empatado con Mawangdui y Jing Fang (<b>1008</b>). Aquí está lo que
            eso significa de verdad: entre dos órdenes <b>aleatorios</b> de 64 elementos, el
            número esperado de inversiones es <b>exactamente n(n−1)/4 = 1008</b>, con
            desviación <b>86,3</b>. Los tres órdenes históricos caen justo en esa esperanza:
            respecto del binario, están <b>a la distancia del azar</b>, no correlacionados
            con él.
          </p>
        </Prose>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={ESPERANZA} etiqueta="inversiones esperadas del azar" accent={ACCENT} />
        <Stat valor={DESVIACION.toFixed(1).replace(".", ",")} etiqueta="desviación (Monte Carlo la confirma)" />
        {VS_FUXI.map((o) => (
          <Stat key={o.id} valor={o.inv} etiqueta={`${NOMBRE[o.id]} vs binario (z ${fmtZ(o.z)})`} accent={o.id === "reywen" ? ACCENT : undefined} />
        )).slice(0, 2)}
      </div>

      {/* La hermandad */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>La hermandad: inversiones entre los órdenes</SectionLabel>
      </div>
      <Panel className="mb-6" accent={ACCENT}>
        <svg viewBox="0 0 400 300" className="mx-auto w-full max-w-[520px]" role="img" aria-label="Grafo de los cuatro órdenes con las inversiones entre cada par; solo Rey Wen y Mawangdui se apartan del azar.">
          {/* aristas a Fu Xi (la línea base del azar), punteadas */}
          {VS_FUXI.map((o) => {
            const [x1, y1] = NODO[o.id];
            const [x2, y2] = NODO.fuxi;
            return <line key={o.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a352c" strokeWidth={1} strokeDasharray="3 3" />;
          })}
          {/* aristas entre históricos */}
          {HERMANDAD.map((e, i) => {
            const [x1, y1] = NODO[e.a];
            const [x2, y2] = NODO[e.b];
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={e.significativa ? ACCENT : "#6b6353"} strokeWidth={e.significativa ? 2.6 : 1.4} />
                <rect x={mx - 34} y={my - 12} width={68} height={24} rx={4} fill="#14120e" opacity={0.85} />
                <text x={mx} y={my - 1} textAnchor="middle" fontSize={11} fill={e.significativa ? ACCENT : "#cfc6b0"} fontFamily="ui-monospace, monospace">{e.inv}</text>
                <text x={mx} y={my + 9} textAnchor="middle" fontSize={8} fill="#8a8272" fontFamily="ui-monospace, monospace">z {fmtZ(e.z)}</text>
              </g>
            );
          })}
          {/* nodos */}
          {Object.entries(NODO).map(([k, [x, y]]) => {
            const esFuxi = k === "fuxi";
            return (
              <g key={k}>
                <circle cx={x} cy={y} r={esFuxi ? 6 : 9} fill={esFuxi ? "#3a352c" : k === "reywen" || k === "mawangdui" ? ACCENT : "#8a8272"} />
                <text x={x} y={y - 14} textAnchor="middle" fontSize={11} fill="#cfc6b0" fontFamily="ui-monospace, monospace">{NOMBRE[k]}</text>
                {esFuxi && <text x={x} y={y + 20} textAnchor="middle" fontSize={8} fill="#6b6353" fontFamily="ui-monospace, monospace">azar ≈ 1008</text>}
              </g>
            );
          })}
        </svg>
        <p className="mt-1 text-center font-mono text-[10px] text-sand-500">
          líneas punteadas: cada orden está a la distancia del azar (≈1008) del binario · líneas sólidas: inversiones entre históricos
        </p>
      </Panel>

      <Panel>
        <Prose>
          <p>
            Entre sí, los tres <b>no</b> son equidistantes. Solo el par{" "}
            <b style={{ color: ACCENT }}>Rey Wen-Mawangdui</b> (759 inversiones, z = −2,89) se
            aparta del azar: su <b>p Monte Carlo es {MC.pKwMwd.toFixed(4).replace(".", ",")}</b>,
            que sobrevive la corrección de Bonferroni por las 3 comparaciones. Los otros dos
            pares (Rey Wen-Jing Fang, z = −1,15; Mawangdui-Jing Fang, z = −1,58) no. La
            lectura: ninguno de los tres se parece al binario, pero los <b>dos más
            antiguos</b> se parecen entre sí, y <b>Jing Fang es el solitario</b>. Cálculo con{" "}
            {MC.media > 0 ? "20.000" : ""} órdenes aleatorios y semilla fija, verificado por la suite.
          </p>
        </Prose>
      </Panel>
    </div>
  );
}
