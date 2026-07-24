import type { Metadata } from "next";
import CuboDiceNo from "./CuboDiceNo";

export const metadata: Metadata = {
  title: "El cubo dice que no",
  description:
    "Tres teoremas de imposibilidad sobre Q6: a lo sumo 8 hexagramas se corrigen entre sí a distancia 3 (la cota de empaquetado da 9, pero 7 no divide 64); los 32 de yang par y los 32 de impar forman una bipartición que toda arista cruza (Q6 es bipartito); y hay 14 collares de Pólya, 13 pulseras.",
};

export default function Page() {
  return <CuboDiceNo />;
}
