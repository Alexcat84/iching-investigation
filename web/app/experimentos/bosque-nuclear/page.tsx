import type { Metadata } from "next";
import BosqueNuclear from "./BosqueNuclear";

export const metadata: Metadata = {
  title: "El bosque nuclear",
  description:
    "El grafo funcional completo del hexagrama nuclear: 64 flechas, imágenes 64 → 16 → 4, y 3 atractores: dos puntos fijos y un ciclo de 2 (4 hexagramas atractores), con cuencas 16, 16 y 32.",
};

export default function Page() {
  return <BosqueNuclear />;
}
