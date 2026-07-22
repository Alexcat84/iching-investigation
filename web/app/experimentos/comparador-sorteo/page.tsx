import type { Metadata } from "next";
import ComparadorSorteo from "./ComparadorSorteo";

export const metadata: Metadata = {
  title: "Comparador de métodos de sorteo",
  description:
    "Monedas, milenrama y 16 fichas lado a lado: sus distribuciones exactas de línea y un simulador que converge a ellas. Monedas y milenrama no son intercambiables; las 16 fichas reproducen la milenrama.",
};

export default function Page() {
  return <ComparadorSorteo />;
}
