"use client";

import { usePathname } from "next/navigation";
import { getExperimento } from "@/lib/experimentos";

/**
 * Pista de uso bajo el titulo de cada experimento: una linea discreta que dice que
 * hacer y que se obtiene. El texto vive en el registro (campo comoUsar), asi que una
 * pagina nueva la hereda sin tocar su componente.
 */
export function PistaDeUso() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  const exp = getExperimento(slug);
  if (!exp?.comoUsar) return null;
  return (
    <p className="mt-2 font-mono text-[11px] leading-relaxed" style={{ color: "#7A715E" }}>
      {exp.comoUsar}
    </p>
  );
}
