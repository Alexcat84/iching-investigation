import type { Metadata } from "next";
import MatrizNuclear from "./MatrizNuclear";

export const metadata: Metadata = {
  title: "El operador nuclear como matriz",
  description:
    "El hexagrama nuclear (hu gua) es un mapa lineal sobre F2: la matriz M de 6×6 con M·x = hu gua(x), su cadena de rangos 6→4→2 y M⁴=M², de la que sale todo el bosque nuclear.",
};

export default function Page() {
  return <MatrizNuclear />;
}
