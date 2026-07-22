import type { Metadata } from "next";
import Codones from "./Codones";

export const metadata: Metadata = {
  title: "Los 64 codones",
  description:
    "El código genético también tiene 64 = 4³ = 2⁶. La correspondencia hexagrama ↔ codón es un isomorfismo combinatorio, no biológico: depende de una de las 4! = 24 codificaciones arbitrarias, ninguna canónica.",
};

export default function Page() {
  return <Codones />;
}
