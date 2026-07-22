import type { Metadata } from "next";
import Trayectoria from "./Trayectoria";

export const metadata: Metadata = {
  title: "Trayectoria personal",
  description:
    "Tu historial de consultas del I Ching como una ruta por los 64 estados: longitud del camino, regiones recurrentes y palacio dominante. Los datos quedan solo en tu navegador.",
};

export default function Page() {
  return <Trayectoria />;
}
