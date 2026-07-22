import type { Metadata } from "next";
import GrupoSierpinski from "./GrupoSierpinski";

export const metadata: Metadata = {
  title: "El grupo (Z/2)⁶ y el Sierpinski",
  description:
    "Los 64 hexagramas como el grupo (Z/2)⁶ bajo XOR: el subgrupo de los 8 puros y sus 8 cosets particionan el conjunto, y la matriz de dominancia (Pascal mod 2, teorema de Lucas) dibuja el triángulo de Sierpinski.",
};

export default function Page() {
  return <GrupoSierpinski />;
}
