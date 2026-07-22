import type { Metadata } from "next";
import MarkovConsultas from "./MarkovConsultas";

export const metadata: Metadata = {
  title: "La cadena de Markov de las consultas",
  description:
    "Encadenar consultas define una cadena de Markov sobre los 64 hexagramas. Con monedas la estacionaria es uniforme; con milenrama se sesga al yin (Kun 729 veces más probable que Qian), porque el yang viejo muta más.",
};

export default function Page() {
  return <MarkovConsultas />;
}
