"use client";

import { useEffect, useMemo, useState } from "react";
import { hex, TRIGRAM_INFO, type TrigramName } from "@/lib/iching";
import {
  echarPresente,
  estadisticas,
  generarEjemplo,
  nombrePalacio,
  palacioIndice,
  posicionPalacio,
  STORAGE_KEY,
  type Consulta,
} from "@/lib/trayectoria";
import { Glyph } from "@/components/Glyph";
import { ExperimentHeader, Panel, Prose, SectionLabel, Stat } from "@/components/ui";

const ACCENT = "#e24b3b";
const CX = 175;
const CY = 175;
const R = 145;

function pos(v: number): [number, number] {
  const ang = -Math.PI / 2 + (v * 2 * Math.PI) / 64;
  return [CX + R * Math.cos(ang), CY + R * Math.sin(ang)];
}

function RingPath({ consultas }: { consultas: Consulta[] }) {
  const visitas = useMemo(() => {
    const m: Record<number, number> = {};
    consultas.forEach((c) => (m[c.v] = (m[c.v] ?? 0) + 1));
    return m;
  }, [consultas]);
  const maxVisitas = Math.max(1, ...Object.values(visitas));

  const edgePath = (a: number, b: number) => {
    if (a === b) return "";
    const [x1, y1] = pos(a);
    const [x2, y2] = pos(b);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const cx = CX + (mx - CX) * 0.28;
    const cy = CY + (my - CY) * 0.28;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  const ultimo = consultas.length ? consultas[consultas.length - 1].v : null;

  return (
    <svg viewBox="0 0 350 350" className="w-full max-w-[350px]" role="img" aria-label="ruta por el hipercubo">
      <circle cx={CX} cy={CY} r={R + 14} fill="none" stroke="#2A2620" strokeWidth="1" />
      {/* nodos base */}
      {Array.from({ length: 64 }, (_, v) => {
        const [x, y] = pos(v);
        const vis = visitas[v] ?? 0;
        if (!vis) return <circle key={v} cx={x} cy={y} r={1.2} fill="#3a362e" />;
        const r = 2.5 + (vis / maxVisitas) * 5;
        return (
          <circle
            key={v}
            cx={x}
            cy={y}
            r={r}
            fill={v === ultimo ? "#f5efdf" : ACCENT}
            opacity={v === ultimo ? 1 : 0.85}
          />
        );
      })}
      {/* camino, más brillante cuanto más reciente */}
      {consultas.slice(1).map((c, i) => {
        const a = consultas[i].v;
        const b = c.v;
        const t = (i + 1) / Math.max(1, consultas.length - 1);
        const d = edgePath(a, b);
        if (!d) return null;
        return (
          <path
            key={c.id}
            d={d}
            fill="none"
            stroke={ACCENT}
            strokeWidth={1.6}
            opacity={0.18 + 0.7 * t}
          />
        );
      })}
      {ultimo != null && (
        <circle cx={pos(ultimo)[0]} cy={pos(ultimo)[1]} r={10} fill="none" stroke="#f5efdf" strokeWidth="1" opacity={0.6} />
      )}
    </svg>
  );
}

function fechaCorta(ts: number): string {
  try {
    return new Intl.DateTimeFormat("es", { day: "numeric", month: "short" }).format(
      new Date(ts),
    );
  } catch {
    return "";
  }
}

export default function Trayectoria() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConsultas(JSON.parse(raw));
    } catch {
      /* ignora datos corruptos */
    }
    setCargado(true);
  }, []);

  const persistir = (next: Consulta[]) => {
    const ordenado = [...next].sort((a, b) => a.ts - b.ts);
    setConsultas(ordenado);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenado));
    } catch {
      /* almacenamiento no disponible */
    }
  };

  const registrar = () => {
    const v = echarPresente();
    persistir([
      ...consultas,
      { id: `c-${Date.now()}-${Math.floor(Math.random() * 1e6).toString(36)}`, ts: Date.now(), v },
    ]);
  };
  const generar = () => persistir(generarEjemplo(12, Date.now()));
  const vaciar = () => persistir([]);
  const borrar = (id: string) => persistir(consultas.filter((c) => c.id !== id));

  const stats = useMemo(() => estadisticas(consultas), [consultas]);
  const hayDatos = consultas.length > 0;

  return (
    <div>
      <ExperimentHeader
        kicker="䷆ · el historial como camino"
        titulo="Trayectoria personal"
        subtitulo="Tu historial de consultas, dibujado como una ruta por los 64 estados"
        accent={ACCENT}
      />

      <div className="mb-6">
        <Prose>
          <p>
            Cada consulta te deja en un estado (un hexagrama), y la sucesión de
            consultas traza un camino por el hipercubo. Ese camino tiene una{" "}
            <b>longitud</b> (cuántas líneas cambiaste en total), <b>regiones
            recurrentes</b> y un <b>palacio dominante</b>: el territorio donde
            transcurre tu período. Registra tus tiradas o genera un ejemplo.
            <span className="text-sand-500">
              {" "}
              Todo se guarda solo en tu navegador.
            </span>
          </p>
        </Prose>
      </div>

      {/* Controles */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={registrar}
          className="rounded-full px-4 py-2 text-sm"
          style={{ background: ACCENT, color: "#0b0a08" }}
        >
          🪙 Echar y registrar
        </button>
        <button
          onClick={generar}
          className="rounded-full border border-ink-700 px-4 py-2 text-sm text-sand-300"
        >
          Generar ejemplo
        </button>
        {hayDatos && (
          <button
            onClick={vaciar}
            className="rounded-full border border-ink-700 px-4 py-2 text-sm text-sand-500"
          >
            Vaciar
          </button>
        )}
      </div>

      {!cargado ? (
        <p className="text-center text-sm text-sand-500">Cargando tu trayectoria…</p>
      ) : !hayDatos ? (
        <Panel className="text-center">
          <p className="text-sand-400">
            Aún no hay consultas. Echa una tirada con{" "}
            <b className="text-sand-200">Echar y registrar</b>, o pulsa{" "}
            <b className="text-sand-200">Generar ejemplo</b> para ver una trayectoria de
            muestra.
          </p>
        </Panel>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[350px_minmax(0,1fr)]">
            {/* Ruta */}
            <Panel className="flex flex-col items-center">
              <RingPath consultas={consultas} />
              <p className="mt-2 text-center font-mono text-[10px] text-sand-500">
                orden Fu Xi · el nodo claro es tu última consulta · el tamaño del punto,
                cuántas veces caíste ahí
              </p>
            </Panel>

            {/* Métricas */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              <Stat valor={stats.n} etiqueta="consultas" accent={ACCENT} />
              <Stat
                valor={stats.distMedia.toFixed(1)}
                etiqueta="líneas de salto medio"
                accent={ACCENT}
              />
              <Stat valor={stats.distTotal} etiqueta="líneas recorridas en total" />
              <Stat
                valor={stats.masVisitados[0]?.n ?? 0}
                etiqueta={`veces en ${hex(stats.masVisitados[0]?.clave ?? 0).py}`}
              />
              {stats.palacioDominante != null && (
                <div className="col-span-2 rounded-lg border border-ink-700 bg-ink-850/40 px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-sand-500">
                    Palacio dominante
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xl" style={{ color: ACCENT }}>
                      {nombrePalacio(stats.palacioDominante).imagen}
                    </span>
                    <span className="text-base text-sand-100">
                      {nombrePalacio(stats.palacioDominante).cabeza} ·{" "}
                      {nombrePalacio(stats.palacioDominante).es}
                    </span>
                    <span className="ml-auto font-mono text-xs text-sand-500">
                      {stats.porPalacio[0].n}/{stats.n} consultas
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Regiones recurrentes */}
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <SectionLabel accent={ACCENT}>Regiones recurrentes</SectionLabel>
              <Panel className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {stats.masVisitados.slice(0, 6).map(({ clave, n }) => {
                    const h = hex(clave);
                    return (
                      <div
                        key={clave}
                        className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-850/40 px-2.5 py-1.5"
                      >
                        <Glyph bits={h.bits} size={22} className="text-sand-200" />
                        <div className="font-mono text-[10px] leading-tight text-sand-400">
                          {h.kw}. {h.py}
                          <br />
                          <span style={{ color: ACCENT }}>×{n}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>

            <div>
              <SectionLabel accent={ACCENT}>Familias de trigrama</SectionLabel>
              <Panel className="mt-2 space-y-3">
                <FamiliaBar titulo="trigrama inferior (raíz)" data={stats.porTrigramaInferior} total={stats.n} />
                <FamiliaBar titulo="trigrama superior (cima)" data={stats.porTrigramaSuperior} total={stats.n} />
              </Panel>
            </div>
          </div>

          {/* Línea de tiempo */}
          <div className="mt-6">
            <SectionLabel accent={ACCENT}>Línea de tiempo</SectionLabel>
            <div className="mt-2 space-y-1.5">
              {[...consultas].reverse().map((c, idx) => {
                const h = hex(c.v);
                const salto =
                  idx < consultas.length - 1
                    ? stats.saltos[consultas.length - 2 - idx]
                    : null;
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-lg border border-ink-800 bg-ink-850/30 px-3 py-2"
                  >
                    <span className="w-12 shrink-0 font-mono text-[10px] text-sand-500">
                      {fechaCorta(c.ts)}
                    </span>
                    <Glyph bits={h.bits} size={20} className="text-sand-200" />
                    <span className="min-w-0 flex-1 truncate text-sm text-sand-200">
                      {h.kw}. {h.py}{" "}
                      <span className="text-sand-500">
                        · {posicionPalacio(c.v)} · palacio{" "}
                        {nombrePalacio(palacioIndice(c.v)).cabeza}
                      </span>
                    </span>
                    {salto != null && (
                      <span className="shrink-0 font-mono text-[10px] text-sand-500">
                        +{salto}
                      </span>
                    )}
                    <button
                      onClick={() => borrar(c.id)}
                      className="shrink-0 rounded px-1.5 font-mono text-xs text-sand-600 hover:text-cinnabar-bright"
                      aria-label="borrar consulta"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FamiliaBar({
  titulo,
  data,
  total,
}: {
  titulo: string;
  data: { clave: TrigramName; n: number }[];
  total: number;
}) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[10px] text-sand-500">{titulo}</div>
      <div className="space-y-1">
        {data.slice(0, 4).map(({ clave, n }) => (
          <div key={clave} className="flex items-center gap-2">
            <span className="w-24 shrink-0 font-mono text-[10px] text-sand-400">
              {TRIGRAM_INFO[clave].imagen} {clave} · {TRIGRAM_INFO[clave].es}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-sm bg-ink-800">
              <div
                className="h-full rounded-sm"
                style={{ width: `${(n / total) * 100}%`, background: ACCENT, opacity: 0.8 }}
              />
            </div>
            <span className="w-6 shrink-0 text-right font-mono text-[10px] text-sand-500">
              {n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
