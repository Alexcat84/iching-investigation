import type { Metadata } from "next";
import MatrizTransferencia from "./MatrizTransferencia";

export const metadata: Metadata = {
  title: "La matriz de transferencia: diseña tu regla",
  description:
    "Cada regla de adyacencia entre líneas es una matriz 2x2 cuyas potencias dan los conteos por número de líneas, cuya traza da los cíclicos y cuyo autovalor dominante es la razón de crecimiento (φ para Fibonacci, 2 para libre). Con la sección de Catalan: C₃ = 5 en [42, 44, 50, 52, 56].",
};

export default function Page() {
  return <MatrizTransferencia />;
}
