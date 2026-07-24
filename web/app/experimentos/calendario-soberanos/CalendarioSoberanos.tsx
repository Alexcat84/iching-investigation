"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { hex, dui, LINE_COLOR } from "@/lib/iching";
import {
  SOBERANOS,
  VALORES,
  LINEAS_CAMBIO,
  YANG_POR_MES,
  antipodaIdx,
  cicloGray,
  lineasEnOrden,
  antipodasDui,
  sonLosMonotonos,
  PUENTE_PALACIOS,
} from "@/lib/soberanos";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";
import { NotaAlMargen } from "@/components/NotaAlMargen";

const ACCENT = "#d99a4e";
const CX = 200;
const CY = 200;
const R = 150;

/** Posición en el reloj: mes 11 (índice 0) arriba, avanzando en el sentido horario. */
function relojXY(i: number, r = R): [number, number] {
  const a = ((-90 + i * 30) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

/** Barras de un hexagrama (6 líneas) centradas en (cx,cy); línea 1 = abajo. */
function barras(
  bits: string,
  cx: number,
  cy: number,
  w: number,
  color: string,
  hi?: { line: number; color: string },
): ReactNode[] {
  const bar = w * 0.13;
  const gap = w * 0.14;
  const total = 6 * bar + 5 * gap;
  const out: ReactNode[] = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const yy = cy - total / 2 + (6 - k) * (gap + bar);
    const col = hi && hi.line === k ? hi.color : color;
    if (yang) {
      out.push(<rect key={k} x={cx - w / 2} y={yy} width={w} height={bar} rx={0.8} fill={col} />);
    } else {
      const seg = w * 0.42;
      out.push(
        <rect key={`${k}a`} x={cx - w / 2} y={yy} width={seg} height={bar} rx={0.8} fill={col} />,
        <rect key={`${k}b`} x={cx + w / 2 - seg} y={yy} width={seg} height={bar} rx={0.8} fill={col} />,
      );
    }
  }
  return out;
}

export default function CalendarioSoberanos() {
  const [activo, setActivo] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ejes, setEjes] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!playing || reduced) return;
    const id = setInterval(() => setActivo((a) => (a + 1) % 12), 1100);
    return () => clearInterval(id);
  }, [playing, reduced]);

  const sob = SOBERANOS[activo];
  const h = hex(sob.v);
  const anti = antipodaIdx(activo);
  const hAnti = hex(SOBERANOS[anti].v);
  // Línea que acaba de cambiar al entrar en el mes activo (viene del mes anterior).
  const lineaEntra = LINEAS_CAMBIO[(activo + 11) % 12];
  const yang = YANG_POR_MES[activo];

  const paso = (d: number) => {
    setPlaying(false);
    setActivo((a) => (a + d + 12) % 12);
  };

  return (
    <div>
      <ExperimentHeader
        kicker="辟卦 · 消息卦 · el ciclo del año"
        titulo="El calendario de los soberanos"
        subtitulo="Los 12 hexagramas del flujo y reflujo del año"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            De los 64 hexagramas, la tradición Han apartó 12 como <b>bi gua</b> (辟卦,
            "hexagramas soberanos"), también llamados <b>xiao xi gua</b> (消息卦, "de
            merma y crecimiento"), y los asignó uno a cada mes lunar. La asociación se
            atribuye a Meng Xi y a la escuela de Jing Fang, la misma que ordenó los{" "}
            <Link href="/experimentos/palacios" className="underline decoration-1 underline-offset-2" style={{ textDecorationColor: ACCENT }}>
              ocho palacios
            </Link>
            .<NotaAlMargen slug="calendario-soberanos" indice={1} /> Leídos en orden de mes,
            los 12 dibujan la respiración del año: el yang entra por abajo una línea por mes
            hasta llenar el hexagrama, y luego el yin lo vacía en el mismo orden.
            <NotaAlMargen slug="calendario-soberanos" indice={0} />
          </p>
        </Prose>
      </div>

      {/* Reloj anual */}
      <Panel className="mb-3" accent={ACCENT}>
        <svg
          viewBox="0 0 400 400"
          className="mx-auto w-full max-w-[440px]"
          role="img"
          aria-label="Reloj anual de los 12 hexagramas soberanos: el mes 11 (El Retorno) arriba, avanzando en sentido horario; cada arista une dos meses que se diferencian en una sola línea, coloreada según qué línea cambia. En el centro, el hexagrama del mes activo."
        >
          {/* aristas del ciclo Gray, coloreadas por la línea que cambia */}
          {SOBERANOS.map((_, i) => {
            const [x1, y1] = relojXY(i);
            const [x2, y2] = relojXY((i + 1) % 12);
            return (
              <line
                key={`e${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={LINE_COLOR[LINEAS_CAMBIO[i]]}
                strokeWidth={2}
                opacity={0.7}
              />
            );
          })}

          {/* ejes de antípodas (dui) */}
          {ejes &&
            SOBERANOS.slice(0, 6).map((_, i) => {
              const [x1, y1] = relojXY(i, R - 30);
              const [x2, y2] = relojXY(i + 6, R - 30);
              return (
                <line key={`d${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a453a" strokeWidth={0.8} strokeDasharray="3 4" />
              );
            })}

          {/* diámetro del mes activo y su antípoda */}
          {(() => {
            const [x1, y1] = relojXY(activo, R - 30);
            const [x2, y2] = relojXY(anti, R - 30);
            return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ACCENT} strokeWidth={1.2} strokeDasharray="4 4" opacity={0.55} />;
          })()}

          {/* nodos */}
          {SOBERANOS.map((s, i) => {
            const [x, y] = relojXY(i);
            const hh = hex(s.v);
            const esActivo = i === activo;
            const esAnti = i === anti;
            const [lx, ly] = relojXY(i, R + 32);
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => { setPlaying(false); setActivo(i); }}>
                <circle cx={x} cy={y} r={19} fill="#151310" stroke={esActivo ? ACCENT : esAnti ? "#7a6b45" : "#2A2620"} strokeWidth={esActivo ? 2 : 1} />
                {barras(hh.bits, x, y, 20, esActivo ? "#efe7d3" : "#9a927e")}
                {s.solsticio && <circle cx={x} cy={y - 27} r={2.4} fill={ACCENT} />}
                <text x={lx} y={ly} textAnchor="middle" style={{ fontSize: 10, fontFamily: "monospace" }} fill={esActivo ? ACCENT : "#7a715e"}>
                  {s.mesLunar}
                </text>
              </g>
            );
          })}

          {/* centro: hexagrama del mes activo con la línea que acaba de cambiar */}
          {barras(h.bits, CX, CY, 58, "#efe7d3", { line: lineaEntra, color: LINE_COLOR[lineaEntra] })}
        </svg>

        {/* controles */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button onClick={() => paso(-1)} aria-label="Mes anterior" className="rounded-full border border-ink-700 px-3 py-1.5 font-mono text-xs text-sand-300 transition-colors hover:border-sand-500">
            ◀
          </button>
          {!reduced && (
            <button
              onClick={() => setPlaying((p) => !p)}
              className="rounded-full border px-4 py-1.5 font-mono text-xs tracking-wide transition-colors"
              style={playing ? { background: ACCENT, color: "#0b0a08", borderColor: "transparent" } : { borderColor: "#3A362E", color: "#8a8271" }}
            >
              {playing ? "❚❚ pausa" : "▶ la respiración del año"}
            </button>
          )}
          <button onClick={() => paso(1)} aria-label="Mes siguiente" className="rounded-full border border-ink-700 px-3 py-1.5 font-mono text-xs text-sand-300 transition-colors hover:border-sand-500">
            ▶
          </button>
          <button
            onClick={() => setEjes((e) => !e)}
            className="ml-1 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors"
            style={ejes ? { borderColor: ACCENT, color: ACCENT } : { borderColor: "#3A362E", color: "#8a8271" }}
          >
            ejes dui
          </button>
        </div>

        {/* leyenda de colores de línea */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[10px] text-sand-500">
          <span>línea que cambia:</span>
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <span key={k} className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: LINE_COLOR[k] }} />
              {k}
            </span>
          ))}
        </div>
      </Panel>

      {/* Detalle del mes activo */}
      <Panel className="mb-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none" style={{ color: ACCENT }}>
              {h.glyph}
            </span>
            <div>
              <div className="text-lg text-sand-100">
                {h.py} · {h.es}
              </div>
              <div className="font-mono text-[11px] text-sand-500">
                mes lunar {sob.mesLunar} ({sob.gregoriano}) · Rey Wen {h.kw}
                {sob.solsticio ? ` · solsticio de ${sob.solsticio}` : ""}
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-wrap justify-end gap-2">
            <Stat valor={yang} etiqueta="líneas yang" accent={ACCENT} />
            <Stat valor={sob.v} etiqueta="valor Fu Xi (0–63)" />
            <Stat
              valor={
                <span style={{ color: LINE_COLOR[lineaEntra] }}>línea {lineaEntra}</span>
              }
              etiqueta="cambió al entrar"
            />
          </div>
        </div>
        <p className="mt-3 font-mono text-[11px] text-sand-500">
          Su antípoda es el mes {SOBERANOS[anti].mesLunar}:{" "}
          <button className="underline decoration-1 underline-offset-2" style={{ textDecorationColor: ACCENT, color: "#c9c0ad" }} onClick={() => { setPlaying(false); setActivo(anti); }}>
            {hAnti.glyph} {hAnti.py}
          </button>{" "}
          , su complemento dui exacto (cada línea invertida). Medio año de distancia, seis
          líneas de diferencia.
        </p>
      </Panel>

      {/* Las cuatro propiedades */}
      <div className="mb-4">
        <SectionLabel accent={ACCENT}>Cuatro propiedades, todas verificadas</SectionLabel>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat valor={cicloGray() ? "sí" : "no"} etiqueta="ciclo Gray cerrado" accent={ACCENT} />
        <Stat valor={lineasEnOrden() ? "2,3,4,5,6,1…" : "no"} etiqueta="orden de las líneas" />
        <Stat valor={antipodasDui() ? "6 pares" : "no"} etiqueta="antípodas dui (m, m+6)" accent={ACCENT} />
        <Stat valor={sonLosMonotonos() ? "12 = 12" : "no"} etiqueta="son los monótonos de Q6" />
      </div>
      <Panel className="mb-6">
        <Prose>
          <p>
            <b>1. Un ciclo Gray cerrado.</b> Cada mes se diferencia del siguiente en una
            sola línea, y el regreso del mes 10 (Kun, todo yin) al mes 11 (Fu, El Retorno)
            también: los 12 forman un recorrido cerrado sobre el hipercubo, un{" "}
            <Link href="/experimentos/hipercubo" className="underline decoration-1 underline-offset-2" style={{ textDecorationColor: ACCENT }}>
              ciclo de 12 aristas
            </Link>{" "}
            de los 64 estados.
          </p>
          <p>
            <b>2. Las líneas cambian en orden.</b> La secuencia de líneas que mutan es
            2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1: primero el yang sube llenando de abajo
            hacia arriba durante seis meses (de Fu a Qian), luego el yin vacía en el mismo
            orden (de Gou a Kun). Es la onda triangular del número de líneas yang: 1, 2,
            3, 4, 5, 6, 5, 4, 3, 2, 1, 0.
          </p>
          <p>
            <b>3. Los meses opuestos son complementos.</b> El mes m y el mes m+6 están en
            las antípodas del reloj y son complementos dui exactos (su XOR es 63): La Paz
            (Tài) en el mes 1 frente al Estancamiento (Pǐ) en el mes 7 es el ejemplo
            clásico. Se cumple en los seis pares.
          </p>
          <p>
            <b>4. Son exactamente los monótonos.</b> Los 12 soberanos son precisamente los
            hexagramas donde todo el yang queda por debajo de todo el yin (o al revés):
            los hexagramas "monótonos" del cubo. Hay 12 así (dos por cada uno de los 0 a 6
            umbrales, menos los solapes en los extremos), y son estos.
          </p>
        </Prose>
      </Panel>

      {/* Onda de yang */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>La onda del año</SectionLabel>
      </div>
      <Panel className="mb-6">
        <svg viewBox="0 0 400 150" className="mx-auto w-full max-w-[440px]" role="img" aria-label="Número de líneas yang por mes: sube de 1 a 6 y baja de 6 a 0, una onda triangular.">
          {YANG_POR_MES.map((yv, i) => {
            const bw = 26;
            const x = 24 + i * 30;
            const bh = yv * 18 + 2;
            const esActivo = i === activo;
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => { setPlaying(false); setActivo(i); }}>
                <rect x={x} y={128 - bh} width={bw} height={bh} rx={2} fill={esActivo ? ACCENT : "#4a4436"} opacity={esActivo ? 1 : 0.85} />
                <text x={x + bw / 2} y={142} textAnchor="middle" style={{ fontSize: 9, fontFamily: "monospace" }} fill={esActivo ? ACCENT : "#7a715e"}>
                  {SOBERANOS[i].mesLunar}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-2 text-center font-mono text-[11px] text-sand-500">
          altura = líneas yang · el pico es Qian (mes 4) y el valle es Kun (mes 10)
        </p>
      </Panel>

      {/* El ciclo sobre el anillo de los 64 */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>El mismo ciclo, sobre los 64 estados</SectionLabel>
      </div>
      <Panel className="mb-6">
        <svg viewBox="0 0 260 260" className="mx-auto w-full max-w-[320px]" role="img" aria-label="Los 64 hexagramas dispuestos en anillo por valor Fu Xi; los 12 soberanos marcados y unidos en orden de mes forman un polígono cerrado, prueba de que el ciclo es un recorrido real sobre el hipercubo.">
          {Array.from({ length: 64 }, (_, v) => {
            const a = (-90 + (v / 64) * 360) * (Math.PI / 180);
            const x = 130 + 100 * Math.cos(a);
            const y = 130 + 100 * Math.sin(a);
            const esSob = VALORES.includes(v);
            return <circle key={v} cx={x} cy={y} r={esSob ? 3 : 1} fill={esSob ? ACCENT : "#3a352c"} />;
          })}
          {SOBERANOS.map((s, i) => {
            const b = SOBERANOS[(i + 1) % 12];
            const av = (-90 + (s.v / 64) * 360) * (Math.PI / 180);
            const bv = (-90 + (b.v / 64) * 360) * (Math.PI / 180);
            const x1 = 130 + 100 * Math.cos(av);
            const y1 = 130 + 100 * Math.sin(av);
            const x2 = 130 + 100 * Math.cos(bv);
            const y2 = 130 + 100 * Math.sin(bv);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE_COLOR[LINEAS_CAMBIO[i]]} strokeWidth={1.3} opacity={0.8} />;
          })}
        </svg>
        <p className="mt-2 text-center font-mono text-[11px] text-sand-500">
          los 12 marcados sobre el anillo binario 0–63, unidos en orden de mes: un
          polígono estrellado que se cierra
        </p>
      </Panel>

      {/* Puente con los palacios */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Puente: los soberanos son medio palacio de Qian y medio de Kun</SectionLabel>
      </div>
      <Panel className="mb-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { titulo: "Palacio de Qian, generaciones 1 a 6", vals: PUENTE_PALACIOS.qian },
            { titulo: "Palacio de Kun, generaciones 1 a 6", vals: PUENTE_PALACIOS.kun },
          ].map((col) => (
            <div key={col.titulo} className="rounded-lg border border-ink-700 bg-ink-850/40 p-3">
              <div className="mb-2 font-mono text-[11px] text-sand-500">{col.titulo}</div>
              <div className="flex flex-wrap gap-2">
                {col.vals.map((v) => (
                  <span key={v} className="inline-flex items-center gap-1 rounded border border-ink-700 px-1.5 py-0.5" title={`${hex(v).kw}. ${hex(v).py}`}>
                    <span className="text-lg leading-none" style={{ color: ACCENT }}>{hex(v).glyph}</span>
                    <span className="font-mono text-[10px] text-sand-500">{hex(v).kw}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sand-300">
          Los 12 soberanos no son un conjunto suelto: son <b>exactamente</b> las primeras{" "}
          <b style={{ color: ACCENT }}>seis generaciones del palacio de Qian</b> y las{" "}
          <b style={{ color: ACCENT }}>seis del de Kun</b> (6 y 6), y <b>ninguno</b> aparece en
          los otros seis{" "}
          <Link href="/experimentos/palacios" className="underline decoration-1 underline-offset-2" style={{ textDecorationColor: ACCENT, color: "#c9c0ad" }}>
            palacios de Jing Fang
          </Link>
          . Tiene sentido: llenar el yang de abajo hacia arriba (los soberanos crecientes) es
          justo cambiar las líneas 1 a 6 desde Qian o desde Kun, que es como se generan las
          primeras seis casas de cada palacio. La observación cualitativa está en Yijing Dao;
          aquí queda demostrada y asertada por la suite.
        </p>
      </Panel>

      {/* Fuentes y descargo */}
      <div className="mb-2">
        <SectionLabel accent={ACCENT}>Fuentes y alcance</SectionLabel>
      </div>
      <Panel>
        <Prose>
          <p>
            La asignación de un hexagrama soberano a cada mes lunar es <b>tradición
            documentada</b> de la dinastía Han, ligada a los calendarios de Meng Xi (孟喜)
            y a la escuela de Jing Fang (京房), no un teorema. Lo que sí son teoremas, y
            se verifican aquí y en la suite de Python, son las cuatro propiedades: el ciclo
            Gray cerrado, el orden de las líneas 2, 3, 4, 5, 6, 1, la simetría dui de los
            meses opuestos y la identidad con los 12 hexagramas monótonos del cubo. La
            correspondencia con los meses gregorianos es aproximada: el año lunar chino es
            lunisolar y los meses no coinciden con los del calendario occidental.
          </p>
        </Prose>
        <p className="mt-3 font-mono text-[11px] text-sand-500">
          Convención Shao Yong–Leibniz: yang = 1, línea inferior = bit más significativo,
          Kun = 0, Qian = 63.
        </p>
      </Panel>
    </div>
  );
}
