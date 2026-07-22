import type { Metadata } from "next";
import PaseoAleatorio from "./PaseoAleatorio";

export const metadata: Metadata = {
  title: "Paseo aleatorio y cobertura",
  description:
    "Un caminante que muta una línea al azar por paso sobre el hipercubo Q6: el tiempo de retorno al origen es exactamente 64 y la cobertura de los 64 estados ronda los 360 pasos.",
};

export default function Page() {
  return <PaseoAleatorio />;
}
