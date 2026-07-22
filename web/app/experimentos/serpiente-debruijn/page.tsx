import type { Metadata } from "next";
import Serpiente from "./Serpiente";

export const metadata: Metadata = {
  title: "La serpiente de De Bruijn",
  description:
    "Un anillo de 64 bits donde cada ventana de 6 consecutivas es un hexagrama distinto: los 64 superpuestos, una vez cada uno. La secuencia de De Bruijn B(2,6) canónica, y las 2²⁶ que existen.",
};

export default function Page() {
  return <Serpiente />;
}
