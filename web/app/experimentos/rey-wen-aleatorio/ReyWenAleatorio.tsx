"use client";

import Link from "next/link";
import {
  CHAN,
  COST,
  HIST,
  INV,
  N_NULA,
  REAL_COST,
  REAL_INV,
} from "@/lib/aleatorio-reywen";
import { FRACCION_PARES, FRACCION_PARES_AZAR } from "@/lib/walsh";
import { NotaAlMargen } from "@/components/NotaAlMargen";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#a89a5e";

function Histograma() {
  const W = 680;
  const H = 200;
  const n = HIST.bins.length;
  const bw = W / n;
  const maxC = Math.max(...HIST.bins);
  const xReal = (HIST.realBin + 0.5) * bw;
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 34}`} className="w-full min-w-[560px]" role="img" aria-label="histograma de inversiones bajo la hipótesis nula con el valor real marcado">
        {HIST.bins.map((c, i) => {
          const h = maxC > 0 ? (c / maxC) * H : 0;
          return (
            <rect
              key={i}
              x={i * bw + 0.8}
              y={H - h}
              width={bw - 1.6}
              height={h}
              rx={1}
              fill={i === HIST.realBin ? ACCENT : "#4a453b"}
              opacity={i === HIST.realBin ? 1 : 0.85}
            />
          );
        })}
        {/* línea del valor real */}
        <line x1={xReal} y1={0} x2={xReal} y2={H} stroke="#f5efdf" strokeWidth={1.5} strokeDasharray="3 3" />
        <text x={xReal} y={12} textAnchor="middle" style={{ fontSize: 11, fontFamily: "monospace" }} fill="#f5efdf">
          Rey Wen real = {REAL_INV}
        </text>
        {/* eje: lo, media, hi */}
        {[0, Math.floor(n / 2), n].map((b) => {
          const val = HIST.lo + b * HIST.ancho;
          return (
            <text key={b} x={b * bw} y={H + 18} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace" }} fill="#6b6558">
              {val}
            </text>
          );
        })}
        <text x={W / 2} y={H + 32} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace" }} fill="#8a8271">
          inversiones frente a Fu Xi · {N_NULA.toLocaleString("es")} órdenes bajo la nula
        </text>
      </svg>
    </div>
  );
}

export default function ReyWenAleatorio() {
  return (
    <div>
      <ExperimentHeader
        kicker="≟ · test de hipótesis"
        titulo="¿Es el Rey Wen aleatorio?"
        subtitulo="El empate 1013 / 1008 / 1008, puesto a prueba"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            El experimento de{" "}
            <Link href="/experimentos/permutacion" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              Rey Wen como permutación
            </Link>{" "}
            encontró que el orden tradicional tiene 1013 inversiones frente a Fu Xi, casi
            empatado con Mawangdui y Jing Fang (1008) y con el promedio de una permutación
            cualquiera (1008). La pregunta natural: <b>¿es 1013 típico?</b> Lo convertimos
            en un test. <b>Hipótesis nula:</b> el Rey Wen es un barajado cualquiera que
            respeta su propia regla de pares (los 32 pares fan/dui en cualquier orden, y
            cada par en cualquiera de sus dos orientaciones).
          </p>
        </Prose>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={REAL_INV} etiqueta="inversiones reales" accent={ACCENT} />
        <Stat valor={INV.media.toFixed(0)} etiqueta="media bajo la nula" />
        <Stat valor={INV.z.toFixed(2)} etiqueta="z-score" accent={ACCENT} />
        <Stat valor={INV.p2.toFixed(2)} etiqueta="p (dos colas)" accent={ACCENT} />
      </div>

      <div className="mb-8">
        <SectionLabel accent={ACCENT}>La distribución de inversiones bajo la nula</SectionLabel>
        <Panel className="mt-2">
          <Histograma />
          <p className="mt-3 text-sm leading-relaxed text-sand-300">
            El valor real cae <b style={{ color: ACCENT }}>en el centro exacto</b> de la
            campana: z = {INV.z.toFixed(2)}, p = {INV.p2.toFixed(2)}. En cuanto a
            inversiones, el orden del Rey Wen es <b>indistinguible de un barajado</b> que
            respeta su regla de pares.<NotaAlMargen slug="rey-wen-aleatorio" indice={0} /> Y
            esto no es un fracaso: es un hallazgo legítimo.{" "}
            <b>Bajo el estadístico de inversiones</b>, la regla de pares es la única
            estructura global detectable; más allá de ella, el arreglo se comporta como el
            azar (con un matiz importante bajo otros estadísticos: ver el{" "}
            <a href="#dialogo-chan" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>diálogo con Chan (2026)</a>{" "}
            más abajo). El{" "}
            <Link href="/experimentos/espectro-walsh" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
              espectro de Walsh
            </Link>{" "}
            lo confirma por una vía independiente: los órdenes pares concentran el{" "}
            <b style={{ color: ACCENT }}>{(FRACCION_PARES * 100).toFixed(1)}%</b> de la
            energía (un orden al azar repartiría un {(FRACCION_PARES_AZAR * 100).toFixed(0)}%),
            justo la huella de esa regla de pares y nada más.<NotaAlMargen slug="rey-wen-aleatorio" indice={1} />
          </p>
        </Panel>
      </div>

      {/* La otra métrica: costo en líneas */}
      <div>
        <SectionLabel accent={ACCENT}>¿Y el costo en líneas? La segunda métrica</SectionLabel>
        <Panel className="mt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-700 font-mono text-[11px] uppercase tracking-wider text-sand-500">
                  <th className="px-3 py-2 font-normal">Métrica</th>
                  <th className="px-3 py-2 text-right font-normal">Real</th>
                  <th className="px-3 py-2 text-right font-normal">Media nula</th>
                  <th className="px-3 py-2 text-right font-normal">σ</th>
                  <th className="px-3 py-2 text-right font-normal">z</th>
                  <th className="px-3 py-2 text-right font-normal">p (2 colas)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[13px] text-sand-300">
                <tr className="border-b border-ink-800">
                  <td className="px-3 py-2">inversiones</td>
                  <td className="px-3 py-2 text-right">{REAL_INV}</td>
                  <td className="px-3 py-2 text-right">{INV.media.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{INV.sigma.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{INV.z.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right" style={{ color: ACCENT }}>{INV.p2.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">costo en líneas</td>
                  <td className="px-3 py-2 text-right">{REAL_COST}</td>
                  <td className="px-3 py-2 text-right">{COST.media.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{COST.sigma.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right">{COST.z.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right" style={{ color: ACCENT }}>{COST.p2.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sand-300">
            También en el costo en líneas (cuánto salta de un hexagrama al siguiente) el
            Rey Wen es típico: z = {COST.z.toFixed(2)}, p = {COST.p2.toFixed(2)}. Ni en el
            desorden ni en los saltos se aparta del azar. La conclusión honesta: bajo su
            propia regla de pares, el orden del Rey Wen es estadísticamente indistinguible
            de aleatorio. Cálculo con {N_NULA.toLocaleString("es")} órdenes y semilla fija,
            verificado por la suite.
          </p>
        </Panel>
      </div>

      {/* El diálogo con Chan (2026) */}
      <div id="dialogo-chan" className="mt-8 scroll-mt-24">
        <SectionLabel accent={ACCENT}>El diálogo con Chan (2026)</SectionLabel>
        <Panel className="mt-2" accent={ACCENT}>
          <Prose>
            <p>
              En abril de 2026,{" "}
              <a href="https://arxiv.org/abs/2604.09234" className="underline decoration-dotted underline-offset-4" style={{ color: ACCENT }}>
                Chan (2026)
              </a>{" "}
              publicó un análisis Monte Carlo del Rey Wen contra 100.000{" "}
              <b>barajados libres</b> y encontró <b>cuatro</b> propiedades significativas.
              No contradice nuestro test: lo complementa. La pregunta que añadimos es cuánto
              de eso sobrevive a <b>nuestra nula</b>, la que respeta la regla de pares. La
              respuesta: casi nada. Tres de las cuatro son <b>corolarios</b> de esa regla.
            </p>
          </Prose>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-700 font-mono text-[11px] uppercase tracking-wider text-sand-500">
                  <th className="px-3 py-2 font-normal">Propiedad de Chan</th>
                  <th className="px-3 py-2 text-right font-normal">Rey Wen</th>
                  <th className="px-3 py-2 text-right font-normal">pct. barajado libre</th>
                  <th className="px-3 py-2 text-right font-normal">pct. nula de pares</th>
                  <th className="px-3 py-2 font-normal">veredicto</th>
                </tr>
              </thead>
              <tbody className="text-sand-300">
                {CHAN.filas.map((f) => (
                  <tr key={f.estadistico} className="border-b border-ink-800">
                    <td className="px-3 py-2">{f.estadistico}</td>
                    <td className="px-3 py-2 text-right font-mono">{f.real}</td>
                    <td className="px-3 py-2 text-right font-mono text-sand-500">{f.libre.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right font-mono" style={{ color: f.invariante ? ACCENT : undefined }}>
                      {f.invariante ? "invariante" : f.pares?.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-[13px]">{f.veredicto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {CHAN.filas
            .filter((f) => f.nota)
            .map((f) => (
              <p key={f.estadistico} className="mt-3 border-l-2 pl-3 text-[13px] leading-relaxed text-sand-400" style={{ borderColor: `${ACCENT}66` }}>
                {f.nota}
              </p>
            ))}

          <p className="mt-3 text-sm leading-relaxed text-sand-300">
            El giro es limpio: propiedades que bajo barajado libre están en el percentil 97
            a 99 caen, bajo la nula de pares, al centro (la distancia media al{" "}
            <b style={{ color: ACCENT }}>29</b>) o desaparecen (la asimetría dentro de pares
            es <b>invariante por construcción</b>: no se puede barajar). Solo la
            autocorrelación de distancias queda al percentil <b>6</b>, sugerente pero{" "}
            <b>no significativa</b>. <b>Chan demuestra que el Rey Wen no es azar libre;
            nosotros, que condicionado a la regla de pares casi nada queda.</b> Los dos
            resultados son verdaderos y complementarios. Análisis condicional con{" "}
            {CHAN.n.toLocaleString("es")} barajados y semilla fija, verificado por la suite.
          </p>
        </Panel>
      </div>
    </div>
  );
}
