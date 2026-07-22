import type { Metadata } from "next";
import ArbolFuxi from "./ArbolFuxi";

export const metadata: Metadata = {
  title: "El árbol de Fu Xi",
  description:
    "La bifurcación yin/yang que genera el orden binario: del taiji a las 64 hojas en seis duplicaciones, con el camino de la raíz a cada hoja como lectura en bits del hexagrama.",
};

export default function Page() {
  return <ArbolFuxi />;
}
