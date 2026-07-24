import type { Metadata } from "next";
import HermandadOrdenes from "./HermandadOrdenes";

export const metadata: Metadata = {
  title: "El árbol genealógico de los órdenes",
  description:
    "Entre dos órdenes aleatorios de 64 hexagramas se esperan 1008 inversiones (desviación 86,3): los tres órdenes históricos están a esa distancia del binario, no correlacionados con él. Pero entre sí, solo Rey Wen y Mawangdui se parecen más de lo que el azar permite (759 inversiones, z = −2,89); Jing Fang es el solitario.",
};

export default function Page() {
  return <HermandadOrdenes />;
}
