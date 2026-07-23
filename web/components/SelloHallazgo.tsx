import Link from "next/link";

const CINABRIO = "#C24C33";

/**
 * Sello de hallazgo propio, con la forma de un sello chino de autor: cuadrado de borde
 * cinabrio con el caracter 印 (yìn, "sello"). Discreto, es un sello y no un banner.
 */
export function SelloHallazgo({
  tamano = 16,
  conEnlace = false,
}: {
  tamano?: number;
  conEnlace?: boolean;
}) {
  const sello = (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-[3px] border font-serif leading-none"
      style={{
        width: tamano,
        height: tamano,
        borderColor: CINABRIO,
        color: CINABRIO,
        fontSize: Math.round(tamano * 0.62),
        background: "rgba(194,76,51,0.08)",
      }}
      title="Hallazgo propio"
    >
      印
    </span>
  );
  if (!conEnlace) return sello;
  return (
    <Link href="/fundamentos#hallazgos" aria-label="Hallazgo propio: ver criterio y búsqueda" className="inline-flex">
      {sello}
    </Link>
  );
}
