import type { Metadata } from "next";
import FibonacciHexagrama from "./FibonacciHexagrama";

export const metadata: Metadata = {
  title: "Fibonacci en el hexagrama",
  description:
    "Los hexagramas sin dos líneas yin (o yang) adyacentes son 21 = F(8); la escalera por número de líneas es F(n+2), la versión circular da 18 = L(6) y la alternancia perfecta deja solo Ji Ji y Wei Ji. Un teorema de conteo, verificado.",
};

export default function Page() {
  return <FibonacciHexagrama />;
}
