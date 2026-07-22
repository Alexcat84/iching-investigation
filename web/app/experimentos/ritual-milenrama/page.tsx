import type { Metadata } from "next";
import RitualMilenrama from "./RitualMilenrama";

export const metadata: Metadata = {
  title: "El ritual de las 49 varillas",
  description:
    "El procedimiento antiguo de la milenrama, paso a paso, y la derivación exacta de sus probabilidades: 3/16, 7/16, 5/16 y 1/16, verificadas por enumeración y simulación.",
};

export default function Page() {
  return <RitualMilenrama />;
}
