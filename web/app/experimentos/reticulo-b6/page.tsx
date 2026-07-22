import type { Metadata } from "next";
import Reticulo from "./Reticulo";

export const metadata: Metadata = {
  title: "El retículo booleano B6",
  description:
    "El orden parcial de dominancia bit a bit sobre los 64 hexagramas: diagrama de Hasse de 7 niveles, las 192 coberturas (las mismas aristas del hipercubo, orientadas hacia arriba) y las 720 cadenas de Kun a Qian.",
};

export default function Page() {
  return <Reticulo />;
}
