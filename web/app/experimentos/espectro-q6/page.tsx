import type { Metadata } from "next";
import EspectroQ6 from "./EspectroQ6";

export const metadata: Metadata = {
  title: "El espectro del hipercubo",
  description:
    "Los autovalores de la adyacencia de Q6 son 6-2k con multiplicidad C(6,k): {6:1, 4:6, 2:15, 0:20, -2:15, -4:6, -6:1}. Las multiplicidades son los niveles de yang del retículo B6, y el espectro del paseo aleatorio simple es este dividido por 6.",
};

export default function Page() {
  return <EspectroQ6 />;
}
