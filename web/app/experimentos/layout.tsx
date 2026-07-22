"use client";

import { usePathname } from "next/navigation";
import { Fundamento } from "@/components/Fundamento";

/**
 * Layout comun de los experimentos: aniade el bloque de fundamento al pie de cada
 * pagina, derivando el slug de la ruta. Asi un experimento nuevo hereda su bloque
 * sin tocar su page (la fuente es AFIRMACIONES en web/lib/fundamentos.ts).
 */
export default function ExperimentosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  return (
    <>
      {children}
      <Fundamento slug={slug} />
    </>
  );
}
