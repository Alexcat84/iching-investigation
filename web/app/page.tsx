import Link from "next/link";
import { EXPERIMENTOS, type Experimento } from "@/lib/experimentos";

function Card({ e }: { e: Experimento }) {
  const activo = e.estado === "activo";
  const inner = (
    <article
      className={`group relative h-full overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
        activo
          ? "border-ink-700 bg-ink-850/40 hover:-translate-y-0.5 hover:bg-ink-800/60"
          : "border-ink-800 bg-transparent"
      }`}
      style={activo ? { boxShadow: "inset 0 0 0 1px transparent" } : undefined}
    >
      {/* Halo de acento al pasar el cursor */}
      {activo && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: e.accent }}
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <span
          className="font-mono text-[11px] tracking-[0.18em]"
          style={{ color: activo ? e.accent : "#4a453b" }}
        >
          {String(e.n).padStart(2, "0")} · {e.categoria.toUpperCase()}
        </span>
        <span
          className={`text-3xl leading-none transition-transform duration-300 ${
            activo ? "text-sand-200 group-hover:scale-110" : "text-sand-600"
          }`}
          style={activo ? { color: e.accent } : undefined}
        >
          {e.simbolo}
        </span>
      </div>

      <h2
        className={`relative mt-4 text-xl font-normal leading-snug ${
          activo ? "text-sand-100" : "text-sand-500"
        }`}
      >
        {e.titulo}
      </h2>
      <p
        className={`relative mt-1 font-mono text-[12px] ${
          activo ? "text-sand-400" : "text-sand-600"
        }`}
      >
        {e.subtitulo}
      </p>
      <p
        className={`relative mt-3 text-sm leading-relaxed ${
          activo ? "text-sand-300" : "text-sand-600"
        }`}
      >
        {e.descripcion}
      </p>

      <div className="relative mt-4 flex items-center gap-2">
        {activo ? (
          <span
            className="font-mono text-[11px] uppercase tracking-widest transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: e.accent }}
          >
            Abrir experimento →
          </span>
        ) : (
          <span className="rounded-full border border-ink-700 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-sand-600">
            Próximamente
          </span>
        )}
      </div>
    </article>
  );

  return activo ? (
    <Link href={`/experimentos/${e.slug}`} className="block h-full">
      {inner}
    </Link>
  ) : (
    <div className="h-full cursor-default">{inner}</div>
  );
}

export default function Home() {
  const activos = EXPERIMENTOS.filter((e) => e.estado === "activo");
  const proximos = EXPERIMENTOS.filter((e) => e.estado === "proximamente");

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="mb-12 max-w-2xl">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.32em] text-cinnabar-bright">
          Laboratorio · estructura binaria
        </div>
        <h1 className="text-4xl font-normal leading-[1.1] text-sand-100 sm:text-5xl">
          Los 64 hexagramas son
          <br />
          los 64 números de 6 bits.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-sand-300">
          Yang = 1, yin = 0. Con esa sola convención, el I Ching se convierte en
          geometría: los 64 hexagramas son los vértices del hipercubo de 6
          dimensiones, y cada mutación de una línea es una arista. Este es un
          repositorio de experimentos sobre esa estructura — cada uno,
          verificado y visual.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] text-sand-500">
          {["64 vértices", "192 aristas", "Q6", "biyección 0–63", "Fu Xi ↔ Rey Wen"].map(
            (t) => (
              <span
                key={t}
                className="rounded-full border border-ink-700 px-3 py-1"
              >
                {t}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Menú de experimentos */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-sand-500">
            Experimentos
          </h2>
          <span className="font-mono text-[11px] text-sand-600">
            {activos.length} activos
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {activos.map((e) => (
            <Card key={e.slug} e={e} />
          ))}
        </div>

        {proximos.length > 0 && (
          <>
            <div className="mb-4 mt-10 font-mono text-[11px] uppercase tracking-[0.28em] text-sand-600">
              En preparación
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {proximos.map((e) => (
                <Card key={e.slug} e={e} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
