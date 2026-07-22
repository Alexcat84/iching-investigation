import type { Metadata } from "next";
import CalendarioSoberanos from "./CalendarioSoberanos";

export const metadata: Metadata = {
  title: "El calendario de los soberanos",
  description:
    "Los 12 hexagramas bi gua (辟卦) que la tradición Han asignó a los meses lunares, con las cuatro propiedades verificadas: ciclo Gray cerrado, orden de líneas 2,3,4,5,6,1, antípodas dui y los monótonos de Q6.",
};

export default function Page() {
  return <CalendarioSoberanos />;
}
