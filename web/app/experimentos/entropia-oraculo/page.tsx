import type { Metadata } from "next";
import EntropiaOraculo from "./EntropiaOraculo";

export const metadata: Metadata = {
  title: "La entropía del oráculo",
  description:
    "La entropía de Shannon (1948) del oráculo: un hexagrama uniforme son 6 bits; una línea de monedas 1,8113 y una de milenrama 1,7490, con la diferencia de 0,0623 toda en el movimiento (el valor yin/yang es 1 bit en ambos). La estacionaria de la milenrama tiene 4,8677 = 6·H(1/4) bits.",
};

export default function Page() {
  return <EntropiaOraculo />;
}
