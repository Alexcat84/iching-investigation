import type { Metadata } from "next";
import Permutacion from "./Permutacion";

export const metadata: Metadata = {
  title: "Rey Wen como permutación",
  description:
    "El orden del Rey Wen como permutación del orden binario Fu Xi: ciclos, puntos fijos, orden, paridad e inversiones. Y la carrera contra Mawangdui, los palacios de Jing Fang y la línea base Fu Xi.",
};

export default function Page() {
  return <Permutacion />;
}
