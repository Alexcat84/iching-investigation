"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CATEGORIAS,
  CATEGORIA_INFO,
  EXPERIMENTOS,
  type Categoria,
} from "@/lib/experimentos";
import { Miniatura } from "@/lib/miniaturas";

const NIVEL_PUNTOS: Record<string, string> = {
  introductorio: "●",
  intermedio: "●●",
  avanzado: "●●●",
};

/** Normaliza para buscar sin acentos ni mayúsculas. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export default function Portada() {
  const [open, setOpen] = useState<Categoria | null>("geometria");
  const [query, setQuery] = useState("");
  const [hoverable, setHoverable] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setHoverable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const buscando = query.trim().length > 0;
  const q = norm(query.trim());

  const porCat = CATEGORIAS.map((k) => {
    const exps = EXPERIMENTOS.filter((e) => e.categoria === k);
    const coincidencias = buscando ? exps.filter((e) => norm(e.titulo).includes(q)) : exps;
    return { k, info: CATEGORIA_INFO[k], exps, coincidencias };
  });
  const totalCoincidencias = porCat.reduce((s, c) => s + c.coincidencias.length, 0);

  // Escritorio (hover): pasar el cursor abre; la última abierta se mantiene.
  const abrir = (k: Categoria) => {
    if (buscando || !hoverable) return;
    setOpen(k);
  };
  // Clic/toque: en escritorio fija la abierta; en táctil alterna (abre y cierra).
  const alternar = (k: Categoria) => {
    if (buscando) return;
    if (hoverable) setOpen(k);
    else setOpen((o) => (o === k ? null : k));
  };

  return (
    <div className="animate-fade-up">
      {/* Encabezado con buscador */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "#C24C33" }}>
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
            <section
              key={k}
              onMouseEnter={() => abrir(k)}
              style={{ borderTop: "1px solid #262119", opacity: atenuado ? 0.4 : 1 }}
            >
              <button
                type="button"
                onClick={() => alternar(k)}
                aria-expanded={isOpen}
                aria-controls={`panel-${k}`}
                aria-label={`${info.nombre}: ${info.desc}. ${exps.length} experimentos.`}
                className="flex w-full items-baseline gap-4 py-5 text-left outline-none focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: info.color }}
              >
                <span
                  className="text-2xl leading-none transition-colors duration-300 sm:text-[34px]"
                  style={{ color: isOpen ? info.color : "#B8AE98" }}
                >
                  {info.nombre}
                </span>
                <span
                  className="hidden flex-1 truncate text-[13px] transition-opacity duration-300 sm:block"
                  style={{ color: "#7A715E", opacity: isOpen ? 1 : 0.5 }}
                >
                  {info.desc}
                  <span className="ml-2" style={{ color: "#5A5346" }}>
                    {exps.length}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-lg transition-transform duration-300"
                  style={{
                    color: isOpen ? info.color : "#5A5346",
                    transform: isOpen ? "rotate(45deg)" : "none",
                    transition: reduced ? "none" : undefined,
                  }}
                >
                  +
                </span>
              </button>

              <div
                id={`panel-${k}`}
                inert={!isOpen}
                className="overflow-hidden"
                style={{
                  maxHeight: isOpen ? tarjetas.length * 200 + 100 : 0,
                  opacity: isOpen ? 1 : 0,
                  transition: reduced ? "none" : "max-height 500ms ease-out, opacity 400ms ease-out",
                }}
              >
                <div className="grid grid-cols-2 gap-3 pb-7 sm:grid-cols-3 lg:grid-cols-4">
                  {tarjetas.map((e, i) => (
                    <Link
                      key={e.slug}
                      href={`/experimentos/${e.slug}`}
                      aria-label={`${e.titulo}, nivel ${e.nivel}`}
                      className="group block overflow-hidden rounded-lg transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        background: "#181512",
                        border: "1px solid #262119",
                        outlineColor: info.color,
                        transitionDelay: reduced || !isOpen ? "0ms" : `${i * 40}ms`,
                        transform: isOpen ? "translateY(0)" : "translateY(8px)",
                        opacity: isOpen ? 1 : 0,
                        transitionProperty: reduced ? "none" : "transform, opacity",
                      }}
                    >
                      <div style={{ background: "#100E0C", padding: "6px 4px 0" }}>
                        <Miniatura slug={e.slug} color={info.color} />
                      </div>
                      <div className="px-3 py-2.5">
                        <div className="mb-0.5 flex justify-between font-mono text-[10px]" style={{ color: "#5A5346" }}>
                          <span>N.º {String(e.n).padStart(2, "0")}</span>
                          <span aria-hidden="true">{NIVEL_PUNTOS[e.nivel]}</span>
                        </div>
                        <div
                          className="text-[13px] leading-snug decoration-1 underline-offset-2 group-hover:underline"
                          style={{ textDecorationColor: info.color, color: "#E8E1D0" }}
                        >
                          {e.titulo}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
        <div style={{ borderTop: "1px solid #262119" }} />

        {buscando && totalCoincidencias === 0 && (
          <p className="mt-8 text-center text-sm" style={{ color: "#7A715E" }}>
            Ningún experimento coincide con «{query.trim()}». Prueba con otro título, o
            vacía el campo para volver al menú.
          </p>
        )}

        <p className="mt-8 font-mono text-[11px]" style={{ color: "#5A5346" }}>
          {hoverable
            ? "Pasa el cursor por una categoría para desplegarla"
            : "Toca una categoría para desplegarla"}{" "}
          · ● introductorio · ●● intermedio · ●●● avanzado · cada vista previa está
          dibujada con la matemática real de su experimento
        </p>
      </main>
    </div>
  );
}
