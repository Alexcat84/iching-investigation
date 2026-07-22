import type { Metadata } from "next";
import Simetrias from "./Simetrias";

export const metadata: Metadata = {
  title: "Las simetrías del hipercubo",
  description:
    "El grupo de Klein (fan · dui) parte los 64 hexagramas en 20 órbitas; los 8 palíndromos son los pares especiales del Rey Wen; y el mapa nuclear iterado cae en cuatro atractores.",
};

export default function Page() {
  return <Simetrias />;
}
