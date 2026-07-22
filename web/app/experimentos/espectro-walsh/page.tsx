import type { Metadata } from "next";
import EspectroWalsh from "./EspectroWalsh";

export const metadata: Metadata = {
  title: "El espectro de Walsh-Hadamard",
  description:
    "La transformada de Walsh-Hadamard de la secuencia del Rey Wen: la mitad de su energía vive en interacciones de orden 2 (pares de líneas), casi nada en la estructura lineal. Con Parseval, delta e involución verificados.",
};

export default function Page() {
  return <EspectroWalsh />;
}
