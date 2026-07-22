import type { Metadata } from "next";
import Hipercubo from "./Hipercubo";

export const metadata: Metadata = {
  title: "El hipercubo",
  description:
    "El anillo de los 64 hexagramas y las 192 aristas del hipercubo Q6. Orden Fu Xi vs. Rey Wen y un recorrido Gray por los 64 estados.",
};

export default function Page() {
  return <Hipercubo />;
}
