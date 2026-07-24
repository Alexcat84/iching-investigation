import type { Metadata } from "next";
import TransformadaHaar from "./TransformadaHaar";

export const metadata: Metadata = {
  title: "Haar: dónde cambia el libro",
  description:
    "La transformada de Haar es la otra base ortogonal clásica de 64 puntos, hermana de Walsh: en vez de preguntar en qué frecuencia vive una señal, pregunta dónde cambia. Aplicada a la secuencia del Rey Wen, sus coeficientes localizan las irregularidades del libro por escala y posición. El trío queda completo: Walsh es el cubo, la DFT el círculo, Haar la localización.",
};

export default function Page() {
  return <TransformadaHaar />;
}
