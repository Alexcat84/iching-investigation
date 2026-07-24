import type { Metadata } from "next";
import ProsodiaSanscrita from "./ProsodiaSanscrita";

export const metadata: Metadata = {
  title: "Los poetas que contaron primero",
  description:
    "La prosodia sánscrita contaba los metros de sílabas cortas y largas y obtenía los números de Fibonacci (1, 2, 3, 5, 8, 13, 21), formulados por Virahanka, Gopala y Hemachandra siglos antes. Las 21 figuras de 6 líneas sin dos yin están en biyección con los 21 metros de duración 7.",
};

export default function Page() {
  return <ProsodiaSanscrita />;
}
