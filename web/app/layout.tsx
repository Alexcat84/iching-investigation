import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "易 · Experimentos del I Ching",
    template: "%s · Experimentos del I Ching",
  },
  description:
    "Laboratorio interactivo sobre la estructura binaria del I Ching: los 64 hexagramas como el hipercubo de 6 dimensiones, sus simetrías, palacios y probabilidades.",
  metadataBase: new URL("https://iching-experimentos.vercel.app"),
  openGraph: {
    title: "易 · Experimentos del I Ching",
    description:
      "La estructura binaria del I Ching, hecha experimento: hipercubo Q6, palacios de Jing Fang, simetrías y probabilidades del oráculo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 sm:px-6">
          <header className="flex items-center justify-between border-b border-ink-700/70 py-4">
            <Link
              href="/"
              className="group flex items-baseline gap-2.5 transition-opacity hover:opacity-90"
            >
              <span className="text-2xl leading-none text-cinnabar-bright">易</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-sand-400 group-hover:text-sand-300">
                Experimentos · I Ching
              </span>
            </Link>
            <span className="hidden font-mono text-[11px] tracking-widest text-sand-600 sm:inline">
              2⁶ = 64
            </span>
          </header>

          <main className="flex-1 py-8 sm:py-12">{children}</main>

          <footer className="border-t border-ink-700/70 py-6 text-center font-mono text-[11px] leading-relaxed text-sand-600">
            Convención Shao Yong–Leibniz · línea inferior = bit más significativo · Kun
            000000 = 0 · Qian 111111 = 63
            <br />
            <span className="text-sand-600/70">
              Toda afirmación estructural está{" "}
              <Link href="/fundamentos" className="underline decoration-dotted underline-offset-2 hover:text-sand-400">
                verificada o con fuente
              </Link>
              .
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
