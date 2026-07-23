import type { Metadata } from "next";
import EspectroWalsh from "./EspectroWalsh";

export const metadata: Metadata = {
  title: "Fourier sobre el cubo: la transformada de Walsh-Hadamard",
  description:
    "La transformada de Walsh-Hadamard es el análisis de Fourier sobre el grupo (Z/2)⁶: la matriz es el producto tensorial de seis Hadamard (H⊗6). Aplicada al Rey Wen, la mitad de su energía vive en interacciones de orden 2. Con Parseval, delta e involución verificados.",
};

export default function Page() {
  return <EspectroWalsh />;
}
