import type { Metadata } from "next";
import Probabilidades from "./Probabilidades";

export const metadata: Metadata = {
  title: "Monedas contra milenrama",
  description:
    "Las probabilidades históricas de los dos métodos de consulta del I Ching, simuladas: qué distribuciones coinciden (el presente, la tasa de cambio) y cuál diverge (el futuro se inclina al yin).",
};

export default function Page() {
  return <Probabilidades />;
}
