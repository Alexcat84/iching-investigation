"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CATEGORIA_INFO,
  CATEGORIAS,
  ETIQUETA_INFO,
  EXPERIMENTOS,
  NIVEL_INFO,
  TIPO_INFO,
  conteoPorCategoria,
  type Categoria,
  type Etiqueta,
  type Experimento,
} from "@/lib/experimentos";

const NIVEL_PUNTOS: Record<string, number> = {
  introductorio: 1,
  intermedio: 2,
  avanzado: 3,
};

function TagChip({
  tag,
  activo,
  onClick,
  count,
}: {
  tag: Etiqueta;
  activo: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      title={ETIQUETA_INFO[tag].def}
      className="rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
      style={
        activo
          ? { borderColor: "#b5442d", background: "rgba(181,68,45,0.14)", color: "#e8b9ad" }
          : { borderColor: "#3A362E", color: "#8a8271" }
      }
    >
      {ETIQUETA_INFO[tag].nombre}
      {count != null && <span className="ml-1 text-sand-600">{count}</span>}
    </button>
  );
}

function Card({
  e,
  onToggleTag,
  activeTags,
}: {
  e: Experimento;
  onToggleTag: (t: Etiqueta) => void;
  activeTags: Set<Etiqueta>;
}) {
  return (
    <Link href={`/experimentos/${e.slug}`} className="block h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-ink-700 bg-ink-850/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-800/60">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: e.accent }}
        />

        <div className="relative flex items-start justify-between gap-3">
          <span className="font-mono text-[11px] tracking-[0.18em]" style={{ color: e.accent }}>
            {String(e.n).padStart(2, "0")} · {CATEGORIA_INFO[e.categoria].nombre.toUpperCase()}
          </span>
          <span
            className="text-3xl leading-none transition-transform duration-300 group-hover:scale-110"
            style={{ color: e.accent }}
          >
            {e.simbolo}
          </span>
        </div>

        <h2 className="relative mt-4 text-xl font-normal leading-snug text-sand-100">
          {e.titulo}
        </h2>
        <p className="relative mt-1 font-mono text-[12px] text-sand-400">{e.subtitulo}</p>
        <p className="relative mt-3 text-sm leading-relaxed text-sand-300">{e.descripcion}</p>

        {e.descargo && (
          <p className="relative mt-3 rounded-md border border-ink-700 bg-ink-900/60 px-2.5 py-1.5 text-[12px] leading-snug text-sand-400">
            <span className="text-cinnabar-bright">⚠ </span>
            {e.descargo}
          </p>
        )}

        {/* Etiquetas (clic para filtrar sin abrir el experimento) */}
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {e.etiquetas.map((t) => (
            <button
              key={t}
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                onToggleTag(t);
              }}
              title={`filtrar por ${ETIQUETA_INFO[t].nombre}`}
              className="rounded-full border px-2 py-0.5 font-mono text-[10px] transition-colors hover:border-sand-500"
              style={
                activeTags.has(t)
                  ? { borderColor: "#b5442d", color: "#e8b9ad" }
                  : { borderColor: "#2A2620", color: "#6b6558" }
              }
            >
              {ETIQUETA_INFO[t].nombre}
            </button>
          ))}
        </div>

        {/* Tipo y nivel */}
        <div className="relative mt-3 flex items-center gap-3 border-t border-ink-800 pt-3 font-mono text-[10px] text-sand-500">
          <span>{TIPO_INFO[e.tipo].nombre}</span>
          <span className="flex items-center gap-1">
            {[1, 2, 3].map((k) => (
              <span
                key={k}
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: k <= NIVEL_PUNTOS[e.nivel] ? e.accent : "#3A362E" }}
              />
            ))}
            {NIVEL_INFO[e.nivel].nombre}
          </span>
          <span
            className="ml-auto uppercase tracking-widest transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: e.accent }}
          >
            Abrir →
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function MenuExperimentos() {
  const [cat, setCat] = useState<Categoria | "todas">("todas");
  const [tags, setTags] = useState<Set<Etiqueta>>(new Set());

  const conteoCat = useMemo(conteoPorCategoria, []);

  const toggleTag = (t: Etiqueta) =>
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  // Etiquetas en uso, ordenadas por frecuencia (la más usada primero).
  const tagsEnUso = useMemo(() => {
    const c = new Map<Etiqueta, number>();
    for (const e of EXPERIMENTOS) for (const t of e.etiquetas) c.set(t, (c.get(t) ?? 0) + 1);
    return [...c.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, []);

  const filtrados = useMemo(
    () =>
      EXPERIMENTOS.filter((e) => {
        if (cat !== "todas" && e.categoria !== cat) return false;
        for (const t of tags) if (!e.etiquetas.includes(t)) return false;
        return true;
      }),
    [cat, tags],
  );

  const hayFiltros = cat !== "todas" || tags.size > 0;

  return (
    <section>
      {/* Pestañas de categoría */}
      <div className="mb-3 flex flex-wrap gap-2" role="tablist" aria-label="Categorías">
        <button
          type="button"
          role="tab"
          aria-selected={cat === "todas"}
          onClick={() => setCat("todas")}
          className="rounded-full border px-3 py-1.5 text-xs transition-colors"
          style={
            cat === "todas"
              ? { background: "#B5442D", color: "#F5EFDF", borderColor: "transparent" }
              : { borderColor: "#3A362E", color: "#8a8271" }
          }
        >
          Todas <span className="opacity-70">{EXPERIMENTOS.length}</span>
        </button>
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            title={CATEGORIA_INFO[c].desc}
            className="rounded-full border px-3 py-1.5 text-xs transition-colors"
            style={
              cat === c
                ? { background: "#B5442D", color: "#F5EFDF", borderColor: "transparent" }
                : { borderColor: "#3A362E", color: "#8a8271" }
            }
          >
            {CATEGORIA_INFO[c].nombre} <span className="opacity-70">{conteoCat[c]}</span>
          </button>
        ))}
      </div>

      {/* Chips de etiquetas */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-widest text-sand-600">
          Etiquetas
        </span>
        {tagsEnUso.map(([t, n]) => (
          <TagChip key={t} tag={t} count={n} activo={tags.has(t)} onClick={() => toggleTag(t)} />
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between font-mono text-[11px] text-sand-500">
        <span>
          {filtrados.length} de {EXPERIMENTOS.length} experimentos
        </span>
        {hayFiltros && (
          <button
            type="button"
            onClick={() => {
              setCat("todas");
              setTags(new Set());
            }}
            className="text-sand-400 underline decoration-dotted underline-offset-2 hover:text-sand-200"
          >
            limpiar filtros
          </button>
        )}
      </div>

      {filtrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtrados.map((e) => (
            <Card key={e.slug} e={e} onToggleTag={toggleTag} activeTags={tags} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-ink-700 bg-ink-850/40 p-6 text-center text-sm text-sand-500">
          Ningún experimento combina esos filtros. Prueba con menos etiquetas.
        </p>
      )}
    </section>
  );
}
