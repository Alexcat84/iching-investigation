import type { Metadata } from "next";
import ReyWenAleatorio from "./ReyWenAleatorio";

export const metadata: Metadata = {
  title: "¿Es el Rey Wen aleatorio?",
  description:
    "Un test de hipótesis sobre el orden del Rey Wen: bajo su propia regla de pares, sus 1013 inversiones caen en el centro de la distribución nula (p = 0,97). Indistinguible de aleatorio, y es un hallazgo legítimo.",
};

export default function Page() {
  return <ReyWenAleatorio />;
}
