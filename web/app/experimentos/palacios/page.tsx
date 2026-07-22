import type { Metadata } from "next";
import Palacios from "./Palacios";

export const metadata: Metadata = {
  title: "Los ocho palacios de Jing Fang",
  description:
    "Las ocho casas de Jing Fang (s. II a.C.) reconstruidas como recorridos sobre el hipercubo Q6, con la verificación de que particionan los 64 hexagramas.",
};

export default function Page() {
  return <Palacios />;
}
