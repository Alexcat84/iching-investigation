import type { Metadata } from "next";
import FourierAnillo from "./FourierAnillo";

export const metadata: Metadata = {
  title: "El Fourier del anillo",
  description:
    "La transformada discreta de Fourier sobre el círculo Z/64 de Shao Yong descompone la secuencia del Rey Wen en armónicos cíclicos; el dominante es k=8 (el periodo de los ocho trigramas). La misma señal que el espectro de Walsh, en otra geometría. Con Parseval, delta e ida y vuelta verificados.",
};

export default function Page() {
  return <FourierAnillo />;
}
