import type { Metadata } from "next";
import LeibnizDocumentos from "./LeibnizDocumentos";

export const metadata: Metadata = {
  title: "Leibniz: los documentos",
  description:
    "La cronología documentada del encuentro entre el I Ching y el binario: Shao Yong, la carta de Bouvet (1701) y la Explication de l'Arithmétique Binaire de Leibniz (1703), con fuentes y un descargo honesto.",
};

export default function Page() {
  return <LeibnizDocumentos />;
}
