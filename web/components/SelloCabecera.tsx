"use client";

import { usePathname } from "next/navigation";
import { getExperimento } from "@/lib/experimentos";
import { SelloHallazgo } from "./SelloHallazgo";

/** Sello de hallazgo propio en la cabecera del experimento (si lo tiene). */
export function SelloCabecera() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  const exp = getExperimento(slug);
  if (!exp?.hallazgoPropio) return null;
  return (
    <span
      className="mt-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1"
      style={{ borderColor: "#C24C3355", background: "rgba(194,76,51,0.08)" }}
    >
      <SelloHallazgo tamano={16} conEnlace />
      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#C24C33" }}>
        Hallazgo propio
      </span>
    </span>
  );
}
