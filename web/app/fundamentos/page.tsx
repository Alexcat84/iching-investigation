import type { Metadata } from "next";
import Link from "next/link";
import {
  AFIRMACIONES_POR_EXPERIMENTO,
  BIBLIOGRAFIA_ORDENADA,
  TIPO_AFIRMACION_INFO,
  italicoAPA,
  type Afirmacion,
  type Ficha,
  type TipoAfirmacion,
  BIBLIOGRAFIA,
} from "@/lib/fundamentos";
import { InsigniaTeorema } from "@/components/Fundamento";
import { SelloHallazgo } from "@/components/SelloHallazgo";
import { HALLAZGOS_PROPIOS, CATEGORIA_INFO } from "@/lib/experimentos";

export const metadata: Metadata = {
  title: "Fundamentos y fuentes",
  description:
    "El sistema de fundamentos del laboratorio: los cinco tipos de afirmación, el mapeo de cada experimento a sus teoremas y fuentes, y la bibliografía verificada en formato APA 7.",
};

const COLOR: Record<TipoAfirmacion, string> = {
  teorema: "#5fae7f",
  calculo: "#5b8fd9",
  tradicion: "#e5c558",
  reconstruccion: "#cf9b5b",
  analogia: "#9c6bc9",
};
const ACCENT = "#b89a6a";

/** Referencia en APA con el segmento en cursiva que manda la norma. */
function RefAPA({ f }: { f: Ficha }) {
  const it = italicoAPA(f);
  const idx = it ? f.apa.indexOf(it) : -1;
  if (idx < 0) return <>{f.apa}</>;
  return (
    <>
      {f.apa.slice(0, idx)}
      <i>{it}</i>
      {f.apa.slice(idx + it.length)}
    </>
  );
}

function Tarjeta({ af }: { af: Afirmacion }) {
  const info = TIPO_AFIRMACION_INFO[af.tipo];
  const color = COLOR[af.tipo];
  const verificable = af.tipo === "teorema" || af.tipo === "calculo";
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-850/40 p-3">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span aria-hidden="true" style={{ color }}>
          {info.marca}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color }}>
          {info.nombre}
        </span>
        {af.nombreTeorema && <InsigniaTeorema nombre={af.nombreTeorema} />}
      </div>
      <p className="text-[13px] leading-relaxed text-sand-300">{af.texto}</p>
      <div className="mt-1.5 font-mono text-[11px] text-sand-500">
        {verificable && af.respaldo && (
          <span>
            verificado en scripts/experimentos.py · <code>{af.respaldo}</code>
          </span>
        )}
        {af.claves.length > 0 && (
          <span>
            {verificable ? " · fuente: " : "fuente: "}
            {af.claves.map((k, i) => (
              <span key={k}>
                {i > 0 ? "; " : ""}
                <Link
                  href={`#${k}`}
                  className="underline decoration-dotted underline-offset-2"
                  style={{ color }}
                >
                  {BIBLIOGRAFIA[k].citaCorta}
                </Link>
              </span>
            ))}
          </span>
        )}
      </div>
      {af.nota && (
        <p className="mt-1.5 text-[11px] italic leading-relaxed text-sand-500">{af.nota}</p>
      )}
    </div>
  );
}

export default function FundamentosPage() {
  const orden: TipoAfirmacion[] = ["teorema", "calculo", "tradicion", "reconstruccion", "analogia"];
  const grupos = AFIRMACIONES_POR_EXPERIMENTO.filter((g) => g.afirmaciones.length > 0);
  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-sand-500 transition-colors hover:text-sand-300"
        >
          ← todos los experimentos
        </Link>
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACCENT }}>
          諸 · evidencias y fuentes
        </div>
        <h1 className="text-3xl font-normal leading-tight text-sand-100 sm:text-4xl">
          Fundamentos y fuentes
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-sand-400">
          Cada afirmación del laboratorio lleva respaldo. Los teoremas y los cálculos se
          verifican en la suite de Python; las tradiciones y reconstrucciones citan una
          fuente académica o primaria; las analogías declaran lo que no afirman. La única
          fuente de referencias es{" "}
          <code className="text-sand-300">docs/evidencias-fundamentos.md</code>, y ninguna
          se cita de memoria. Qué teoremas y dominios se han evaluado, construido o
          rechazado (y por qué) vive en el documento vivo{" "}
          <a
            href="https://github.com/Alexcat84/iching-investigation/blob/main/docs/registro-aplicabilidad.md"
            className="underline decoration-dotted underline-offset-2 text-sand-300 hover:text-sand-100"
          >
            registro-aplicabilidad.md
          </a>
          .
        </p>
      </header>

      {/* Los cinco tipos */}
      <section className="mb-10">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-sand-500">
          Los cinco tipos de afirmación
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {orden.map((t) => {
            const info = TIPO_AFIRMACION_INFO[t];
            return (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-ink-700 bg-ink-850/40 p-3">
                <span aria-hidden="true" className="text-lg leading-none" style={{ color: COLOR[t] }}>
                  {info.marca}
                </span>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: COLOR[t] }}>
                    {info.nombre}
                  </div>
                  <div className="mt-0.5 text-[13px] leading-snug text-sand-400">{info.def}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hallazgos propios */}
      <section id="hallazgos" className="mb-10 scroll-mt-24">
        <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#C24C33" }}>
          <SelloHallazgo tamano={16} /> Hallazgos propios
        </div>
        <p className="mb-3 max-w-2xl text-[14px] leading-relaxed text-sand-400">
          Resultados originales del laboratorio que, tras una búsqueda documentada, no hemos
          encontrado publicados en otra parte. Es un marcador ortogonal: el experimento
          conserva su categoría temática. Un experimento recibe el sello 印 solo si cumple
          las tres reglas: (a) sus afirmaciones centrales son tipo teorema o cálculo,
          asertadas en la suite; (b) hay una búsqueda de originalidad con fecha y nota; (c)
          el copy lo dice con la humildad exacta del descargo del experimento 29: «hasta
          donde sabemos», «no hemos encontrado la fuente, no que no exista».
        </p>
        <div className="space-y-3">
          {HALLAZGOS_PROPIOS.map((e) => (
            <div key={e.slug} className="rounded-lg border p-3" style={{ borderColor: "#C24C3355", background: "rgba(194,76,51,0.05)" }}>
              <div className="mb-1 flex flex-wrap items-baseline gap-2">
                <SelloHallazgo tamano={14} />
                <Link href={`/experimentos/${e.slug}`} className="text-sand-100 decoration-1 underline-offset-2 hover:underline" style={{ textDecorationColor: "#C24C33" }}>
                  {e.titulo}
                </Link>
                <span className="font-mono text-[10px] text-sand-600">también en {CATEGORIA_INFO[e.categoria].nombre} · búsqueda del {e.hallazgoPropio?.busquedaFecha}</span>
              </div>
              <p className="text-[13px] leading-relaxed text-sand-400">{e.hallazgoPropio?.busquedaNota}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Afirmaciones por experimento */}
      <section className="mb-10">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-sand-500">
          Afirmaciones por experimento
        </div>
        <div className="space-y-6">
          {grupos.map((g) => (
            <div key={g.slug}>
              <Link
                href={`/experimentos/${g.slug}`}
                className="group inline-flex items-baseline gap-2"
              >
                <span className="text-base text-sand-100 decoration-1 underline-offset-2 group-hover:underline" style={{ textDecorationColor: ACCENT }}>
                  {g.titulo}
                </span>
                <span className="font-mono text-[10px] text-sand-600">/{g.slug}</span>
              </Link>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {g.afirmaciones.map((af, i) => (
                  <Tarjeta key={i} af={af} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bibliografia APA */}
      <section>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-sand-500">
          Bibliografía (APA 7, alfabética por apellido)
        </div>
        <ol className="space-y-3">
          {BIBLIOGRAFIA_ORDENADA.map((f) => (
            <li
              key={f.clave}
              id={f.clave}
              className="scroll-mt-24 border-l-2 pl-3 text-[13px] leading-relaxed text-sand-300"
              style={{ borderColor: "#2A2620" }}
            >
              <RefAPA f={f} />
              <span className="ml-2 font-mono text-[10px] text-sand-600">({f.citaCorta})</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 font-mono text-[11px] leading-relaxed text-sand-500">
          Las entradas pendientes de verificación (edición castellana de Wilhelm, autoría
          del método de las 16 fichas, páginas de la Explication de Leibniz) no se citan
          hasta resolverse. La lista viva está en{" "}
          <code className="text-sand-400">docs/evidencias-fundamentos.md</code>.
        </p>
      </section>
    </div>
  );
}
