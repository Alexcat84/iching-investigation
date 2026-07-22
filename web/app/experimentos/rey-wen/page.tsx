import type { Metadata } from "next";
import ReyWen from "./ReyWen";

export const metadata: Metadata = {
  title: "La secuencia del Rey Wen",
  description:
    "La regla de pares (fan/dui) del orden tradicional del I Ching, los 32 pares visualizados, y la demostración de que, fuera de esa regla, no sigue ninguna fórmula binaria.",
};

export default function Page() {
  return <ReyWen />;
}
