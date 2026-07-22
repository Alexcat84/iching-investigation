import type { Metadata } from "next";
import DosCielos from "./DosCielos";

export const metadata: Metadata = {
  title: "Los dos cielos",
  description:
    "El bagua del Cielo Anterior (Fu Xi) y el del Cielo Posterior (Rey Wen) como permutaciones de 8 elementos: en el primero los ejes unen complementos binarios; en el segundo solo sobrevive el eje Li y Kan.",
};

export default function Page() {
  return <DosCielos />;
}
