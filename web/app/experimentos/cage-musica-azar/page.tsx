import type { Metadata } from "next";
import CageMusicaAzar from "./CageMusicaAzar";

export const metadata: Metadata = {
  title: "Cage: la música del azar",
  description:
    "A fines de 1950 John Cage usó el I Ching y tiradas de monedas para seleccionar de cartas de 64 valores; Music of Changes (1951) es la obra fundacional de la composición por azar. Documentamos el método, no la obra: la demo usa una carta propia y el motor de monedas del experimento 21.",
};

export default function Page() {
  return <CageMusicaAzar />;
}
