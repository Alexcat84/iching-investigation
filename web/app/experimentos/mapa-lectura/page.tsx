import type { Metadata } from "next";
import MapaLectura from "./MapaLectura";

export const metadata: Metadata = {
  title: "El mapa de la lectura",
  description:
    "Construye una consulta del I Ching y observa el salto en el hipercubo: hexagrama presente → futuro, la distancia exacta y la lectura de las líneas mutantes.",
};

export default function Page() {
  return <MapaLectura />;
}
