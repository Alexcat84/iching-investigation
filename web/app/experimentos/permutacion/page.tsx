import type { Metadata } from "next";
import Permutacion from "./Permutacion";

export const metadata: Metadata = {
  title: "Rey Wen como permutación",
  description:
    "El orden del Rey Wen como permutación del orden binario Fu Xi: descomposición en ciclos, puntos fijos, orden, paridad e inversiones — la medida exacta del desorden.",
};

export default function Page() {
  return <Permutacion />;
}
