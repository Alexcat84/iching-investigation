import MenuExperimentos from "./MenuExperimentos";

export default function Home() {
  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="mb-10 max-w-2xl">
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
          repositorio de experimentos sobre esa estructura: cada uno, verificado y
          visual.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] text-sand-500">
          {["64 vértices", "192 aristas", "Q6", "biyección 0–63", "Fu Xi ↔ Rey Wen"].map(
            (t) => (
              <span key={t} className="rounded-full border border-ink-700 px-3 py-1">
                {t}
              </span>
            ),
          )}
        </div>
      </section>

      <MenuExperimentos />
    </div>
  );
}
