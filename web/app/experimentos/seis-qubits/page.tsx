import type { Metadata } from "next";
import SeisQubits from "./SeisQubits";

export const metadata: Metadata = {
  title: "Seis qubits",
  description:
    "Un hexagrama es un estado de la base computacional de 6 qubits, y la transformada de Walsh del sitio es la puerta de Hadamard H⊗6. Aplicarla a |Kun⟩ = |000000⟩ produce la superposición uniforme de los 64 hexagramas con amplitud 1/8 cada uno. Identidad formal entre transformadas y estados, no una afirmación cuántica sobre el oráculo.",
};

export default function Page() {
  return <SeisQubits />;
}
