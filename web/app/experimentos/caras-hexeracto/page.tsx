import type { Metadata } from "next";
import CarasHexeracto from "./CarasHexeracto";

export const metadata: Metadata = {
  title: "Las caras del hexeracto",
  description:
    "Las caras del 6-cubo son los hexagramas parciales: palabras de seis símbolos sobre yin, yang e indeterminado. Los vértices son los 64 hexagramas, las aristas las 192 mutaciones, el sólido entero el hexagrama abierto. El f-vector es 64, 192, 240, 160, 60, 12, 1, suma 3⁶ = 729, y la característica de Euler distingue la frontera del sólido.",
};

export default function Page() {
  return <CarasHexeracto />;
}
