"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CATEGORIAS,
  CATEGORIA_INFO,
  EXPERIMENTOS,
  HALLAZGOS_PROPIOS,
  TIPO_INFO,
  type Categoria,
  type Experimento,
} from "@/lib/experimentos";
import { Miniatura } from "@/lib/miniaturas";
import { SelloHallazgo } from "@/components/SelloHallazgo";

const CINABRIO = "#C24C33";

const NIVEL_PUNTOS: Record<string, string> = {
  introductorio: "●",
  intermedio: "●●",
  avanzado: "●●●",
};

type Clave = Categoria | "hallazgos";

/** Normaliza para buscar sin acentos ni mayúsculas. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Tarjeta de un experimento en el menú. */
function Tarjeta({
  e,
  color,
  i,
  isOpen,
  reduced,
  categoria,
}: {
  e: Experimento;
  color: string;
  i: number;
  isOpen: boolean;
  reduced: boolean;
  categoria?: string;
}) {
  const esRef = e.tipo === "referencia";
  return (
    <Link
      href={`/experimentos/${e.slug}`}
      aria-label={`${e.titulo}, ${TIPO_INFO[e.tipo].nombre}${esRef ? ", para leer" : ""}${e.hallazgoPropio ? ", hallazgo propio" : ""}, nivel ${e.nivel}`}
      className="group block overflow-hidden rounded-lg transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        background: "#181512",
        border: "1px solid #262119",
        outlineColor: color,
        transitionDelay: reduced || !isOpen ? "0ms" : `${i * 40}ms`,
        transform: isOpen ? "translateY(0)" : "translateY(8px)",
        opacity: isOpen ? 1 : 0,
        transitionProperty: reduced ? "none" : "transform, opacity",
      }}
    >
      <div style={{ background: "#100E0C", padding: "6px 4px 0" }}>
        <Miniatura slug={e.slug} color={color} />
      </div>
      <div className="px-3 py-2.5">
        <div className="mb-0.5 flex items-center justify-between gap-1 font-mono text-[10px]" style={{ color: "#5A5346" }}>
          <span className="shrink-0">N.º {String(e.n).padStart(2, "0")}</span>
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate">{TIPO_INFO[e.tipo].nombre}</span>
            {esRef && (
              <span className="shrink-0 rounded-sm px-1" style={{ background: "#221E18", color: "#8A8272" }}>
                para leer
              </span>
            )}
            {e.hallazgoPropio && <SelloHallazgo tamano={12} />}
            <span className="shrink-0" aria-hidden="true">
              {NIVEL_PUNTOS[e.nivel]}
            </span>
          </span>
        </div>
        <div
          className="text-[13px] leading-snug decoration-1 underline-offset-2 group-hover:underline"
          style={{ textDecorationColor: color, color: "#E8E1D0" }}
        >
          {e.titulo}
        </div>
        {categoria && (
          <div className="mt-0.5 font-mono text-[9px]" style={{ color: "#5A5346" }}>
            también en {categoria}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Portada() {
  const [open, setOpen] = useState<Clave | null>("geometria");
  const [query, setQuery] = useState("");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const buscando = query.trim().length > 0;
  const q = norm(query.trim());
  const filtra = (exps: Experimento[]) => (buscando ? exps.filter((e) => norm(e.titulo).includes(q)) : exps);

  const porCat = CATEGORIAS.map((k) => {
    const exps = EXPERIMENTOS.filter((e) => e.categoria === k);
    return { k, info: CATEGORIA_INFO[k], exps, coincidencias: filtra(exps) };
  });
  const totalCoincidencias = porCat.reduce((s, c) => s + c.coincidencias.length, 0);
  const hallazgos = filtra(HALLAZGOS_PROPIOS);

  // El acordeón se abre y se cierra SOLO por decisión del usuario: clic, toque o
  // Enter/Espacio sobre la fila (el botón nativo ya cubre el teclado). Pasar el cursor
  // nunca despliega nada; solo realza. Una sola sección abierta a la vez.
  const alternar = (k: Clave) => {
    if (buscando) return;
    setOpen((o) => (o === k ? null : k));
  };

  return (
    <div className="animate-fade-up">
      {/* Encabezado con buscador */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: CINABRIO }}>
            易 · Laboratorio de estructura binaria
          </div>
          <h1 className="text-3xl font-normal leading-tight text-sand-100 sm:text-4xl">
            Experimentos del I Ching
          </h1>
          <p className="mt-2 font-mono text-[11px]" style={{ color: "#6B6353" }}>
            {EXPERIMENTOS.length} experimentos · ninguna cifra sin verificación o fuente
          </p>
        </div>
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar experimento…"
            aria-label="Buscar experimento por título"
            className="w-52 rounded-full border bg-transparent px-4 py-2 font-mono text-[12px] text-sand-200 outline-none transition-colors placeholder:text-sand-600 focus-visible:border-cinnabar-bright"
            style={{ borderColor: "#262119" }}
          />
        </div>
      </header>

      {/* Acordeón por categorías */}
      <main>
        {porCat.map(({ k, info, exps, coincidencias }) => {
          const isOpen = buscando ? coincidencias.length > 0 : open === k;
          const atenuado = buscando && coincidencias.length === 0;
          const tarjetas = buscando ? coincidencias : exps;
          return (
            <section key={k} style={{ borderTop: "1px solid #262119", opacity: atenuado ? 0.4 : 1 }}>
              <button
                type="button"
                onClick={() => alternar(k)}
                aria-expanded={isOpen}
                aria-controls={`panel-${k}`}
                aria-label={`${info.nombre}: ${info.desc}. ${exps.length} experimentos.`}
                className="flex w-full cursor-pointer items-baseline gap-4 py-5 text-left outline-none transition hover:brightness-125 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: info.color }}
              >
                <span className="text-2xl leading-none transition-colors duration-300 sm:text-[34px]" style={{ color: isOpen ? info.color : "#B8AE98" }}>
                  {info.nombre}
                </span>
                <span className="hidden flex-1 truncate text-[13px] transition-opacity duration-300 sm:block" style={{ color: "#7A715E", opacity: isOpen ? 1 : 0.5 }}>
                  {info.desc}
                  <span className="ml-2" style={{ color: "#5A5346" }}>
                    {exps.length}
                  </span>
                </span>
                <span aria-hidden="true" className="shrink-0 text-lg transition-transform duration-300" style={{ color: isOpen ? info.color : "#5A5346", transform: isOpen ? "rotate(45deg)" : "none", transition: reduced ? "none" : undefined }}>
                  +
                </span>
              </button>
              <div
                id={`panel-${k}`}
                inert={!isOpen}
                className="overflow-hidden"
                style={{ maxHeight: isOpen ? tarjetas.length * 200 + 100 : 0, opacity: isOpen ? 1 : 0, transition: reduced ? "none" : "max-height 500ms ease-out, opacity 400ms ease-out" }}
              >
                <div className="grid grid-cols-2 gap-3 pb-7 sm:grid-cols-3 lg:grid-cols-4">
                  {tarjetas.map((e, i) => (
                    <Tarjeta key={e.slug} e={e} color={info.color} i={i} isOpen={isOpen} reduced={reduced} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* Sección de hallazgos propios: una vista ortogonal, no una categoría */}
        {(() => {
          const isOpen = buscando ? hallazgos.length > 0 : open === "hallazgos";
          const atenuado = buscando && hallazgos.length === 0;
          return (
            <section style={{ borderTop: "1px solid #262119", opacity: atenuado ? 0.4 : 1 }}>
              <button
                type="button"
                onClick={() => alternar("hallazgos")}
                aria-expanded={isOpen}
                aria-controls="panel-hallazgos"
                aria-label={`Hallazgos propios: resultados de este laboratorio que, hasta donde sabemos, no están publicados. ${HALLAZGOS_PROPIOS.length}.`}
                className="flex w-full cursor-pointer items-baseline gap-4 py-5 text-left outline-none transition hover:brightness-125 focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: CINABRIO }}
              >
                <span className="flex shrink-0 items-center gap-2 text-2xl leading-none sm:text-[34px]" style={{ color: isOpen ? CINABRIO : "#B8AE98" }}>
                  <SelloHallazgo tamano={isOpen ? 26 : 22} />
                  Hallazgos propios
                </span>
                <span className="hidden flex-1 truncate text-[13px] transition-opacity duration-300 sm:block" style={{ color: "#7A715E", opacity: isOpen ? 1 : 0.5 }}>
                  Resultados que, hasta donde sabemos tras búsqueda, no están publicados
                  <span className="ml-2" style={{ color: "#5A5346" }}>
                    {HALLAZGOS_PROPIOS.length}
                  </span>
                </span>
                <span aria-hidden="true" className="shrink-0 text-lg transition-transform duration-300" style={{ color: isOpen ? CINABRIO : "#5A5346", transform: isOpen ? "rotate(45deg)" : "none", transition: reduced ? "none" : undefined }}>
                  +
                </span>
              </button>
              <div
                id="panel-hallazgos"
                inert={!isOpen}
                className="overflow-hidden"
                style={{ maxHeight: isOpen ? hallazgos.length * 220 + 120 : 0, opacity: isOpen ? 1 : 0, transition: reduced ? "none" : "max-height 500ms ease-out, opacity 400ms ease-out" }}
              >
                <p className="pb-3 text-[13px] leading-relaxed" style={{ color: "#8A8272" }}>
                  Resultados de este laboratorio que, hasta donde sabemos tras una búsqueda
                  documentada, no están publicados en otra parte. Es una vista, no una
                  categoría: cada uno conserva su hogar temático, y los conteos por categoría
                  no cambian.
                </p>
                <div className="grid grid-cols-2 gap-3 pb-7 sm:grid-cols-3 lg:grid-cols-4">
                  {(buscando ? hallazgos : HALLAZGOS_PROPIOS).map((e, i) => (
                    <Tarjeta key={e.slug} e={e} color={CINABRIO} i={i} isOpen={isOpen} reduced={reduced} categoria={CATEGORIA_INFO[e.categoria].nombre} />
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        <div style={{ borderTop: "1px solid #262119" }} />

        {buscando && totalCoincidencias === 0 && (
          <p className="mt-8 text-center text-sm" style={{ color: "#7A715E" }}>
            Ningún experimento coincide con «{query.trim()}». Prueba con otro título, o
            vacía el campo para volver al menú.
          </p>
        )}

        <p className="mt-8 font-mono text-[11px]" style={{ color: "#5A5346" }}>
          Toca una sección para desplegarla · el tipo dice qué esperar: visualización,
          simulador, calculadora y test se usan, referencia es para leer · el sello 印 marca
          un hallazgo propio (aparece también en su categoría) · ● introductorio · ●●
          intermedio · ●●● avanzado · cada vista previa está dibujada con la matemática real
          de su experimento
        </p>
      </main>
    </div>
  );
}
