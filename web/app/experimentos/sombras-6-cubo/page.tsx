import type { Metadata } from "next";
import Sombras from "./Sombras";

export const metadata: Metadata = {
  title: "Las sombras del 6-cubo",
  description:
    "Tres proyecciones del hexeracto Q6: el polígono de Petrie de 12 vértices, el cubo de cubos (Q3 × Q3) y los 7 niveles de líneas yang. Los mismos 64 vértices y 192 aristas en cada una.",
};

export default function Page() {
  return <Sombras />;
}
