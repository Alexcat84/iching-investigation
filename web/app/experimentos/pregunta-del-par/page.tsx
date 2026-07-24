import type { Metadata } from "next";
import PreguntaDelPar from "./PreguntaDelPar";

export const metadata: Metadata = {
  title: "La pregunta del par",
  description:
    "¿Qué decide cuál hexagrama va primero dentro de cada par del Rey Wen? La literatura lo declara abierto. El volteo conserva el yang, así que 'más yang primero' es indecidible (28/28). Y ningún criterio binario probado (valor, líneas, suavizado) se aparta de una moneda al aire: si hay una regla, no vive en la estructura binaria.",
};

export default function Page() {
  return <PreguntaDelPar />;
}
