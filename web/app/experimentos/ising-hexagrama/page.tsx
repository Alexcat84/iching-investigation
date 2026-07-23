import type { Metadata } from "next";
import IsingHexagrama from "./IsingHexagrama";

export const metadata: Metadata = {
  title: "El hexagrama como cadena de espines",
  description:
    "El modelo de Ising (1925) sobre las 6 líneas: yang = +1, yin = -1, energía E = -J por productos de vecinos y probabilidades de Boltzmann. Z abierta = 199,384322 y de anillo = 262,456561 a beta = 0,7; la misma matriz de transferencia del experimento 29. En 1D no hay transición de fase.",
};

export default function Page() {
  return <IsingHexagrama />;
}
