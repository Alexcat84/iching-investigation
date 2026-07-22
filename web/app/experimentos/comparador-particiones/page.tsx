import type { Metadata } from "next";
import ComparadorParticiones from "./ComparadorParticiones";

export const metadata: Metadata = {
  title: "Comparador de particiones",
  description:
    "Mide con el índice de Rand ajustado cuánto se parecen dos particiones de los 64 hexagramas (palacios, cuencas nucleares, cosets, trigramas). Hallazgo: los palacios no son los cosets (ARI −0,125).",
};

export default function Page() {
  return <ComparadorParticiones />;
}
