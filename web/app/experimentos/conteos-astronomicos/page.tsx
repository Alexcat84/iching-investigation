import type { Metadata } from "next";
import ConteosAstronomicos from "./ConteosAstronomicos";

export const metadata: Metadata = {
  title: "Conteos astronómicos del cubo",
  description:
    "Los números grandes del hipercubo Q6, cada uno con su fuente: 46080 automorfismos, 2²⁶ secuencias de De Bruijn, C(6,k) por distancia, 720 cadenas, y los códigos Gray cíclicos citados a OEIS.",
};

export default function Page() {
  return <ConteosAstronomicos />;
}
