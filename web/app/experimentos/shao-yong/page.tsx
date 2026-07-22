import type { Metadata } from "next";
import ShaoYong from "./ShaoYong";

export const metadata: Metadata = {
  title: "El cuadrado y el círculo de Shao Yong",
  description:
    "El diagrama Xiantian de Shao Yong —los 64 hexagramas en cuadrado 8×8 y en círculo, en orden binario— que Bouvet envió a Leibniz hacia 1701. Leerlo en orden es contar de 0 a 63.",
};

export default function Page() {
  return <ShaoYong />;
}
