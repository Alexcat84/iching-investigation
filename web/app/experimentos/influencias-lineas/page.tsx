import type { Metadata } from "next";
import InfluenciasLineas from "./InfluenciasLineas";

export const metadata: Metadata = {
  title: "Las influencias de las líneas",
  description:
    "Toda propiedad de hexagramas es una función booleana de 6 variables; la influencia de cada línea es la probabilidad de que voltearla cambie el veredicto. Para la regla sin dos yin, las líneas 2 y 5 pesan más (22/64). La influencia total coincide con la suma espectral de Walsh.",
};

export default function Page() {
  return <InfluenciasLineas />;
}
