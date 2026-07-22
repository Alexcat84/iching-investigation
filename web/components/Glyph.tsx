import { LINE_COLOR } from "@/lib/iching";

/**
 * Glifo de hexagrama dibujado en SVG.
 * bits: 6 caracteres "0"/"1", abajo→arriba (bits[0] = línea 1, la de abajo).
 * Se dibuja con la línea 6 arriba y la línea 1 abajo, como se lee un hexagrama.
 */
export function Glyph({
  bits,
  size = 40,
  highlight,
  moving,
  className,
}: {
  bits: string;
  /** Ancho del glifo en px. */
  size?: number;
  /** Línea (1–6) a resaltar con su color. */
  highlight?: number | null;
  /** Líneas (1–6) marcadas como mutantes: se dibuja un punto/aro. */
  moving?: number[];
  className?: string;
}) {
  const w = size;
  const bar = size * 0.095;
  const gap = size * 0.083;
  const totalH = 6 * bar + 5 * gap;
  const movingSet = new Set(moving ?? []);

  const rows = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = (6 - k) * (gap + bar);
    const col = highlight === k ? LINE_COLOR[k] : "currentColor";
    const isMoving = movingSet.has(k);
    if (yang) {
      rows.push(
        <rect key={k} x={0} y={y} width={w} height={bar} rx={bar * 0.3} fill={col} />,
      );
    } else {
      const seg = w * 0.42;
      rows.push(
        <rect key={`${k}a`} x={0} y={y} width={seg} height={bar} rx={bar * 0.3} fill={col} />,
        <rect
          key={`${k}b`}
          x={w - seg}
          y={y}
          width={seg}
          height={bar}
          rx={bar * 0.3}
          fill={col}
        />,
      );
    }
    if (isMoving) {
      rows.push(
        <circle
          key={`${k}m`}
          cx={w + bar * 1.6}
          cy={y + bar / 2}
          r={bar * 0.7}
          fill={LINE_COLOR[k]}
        />,
      );
    }
  }

  const padRight = moving && moving.length ? bar * 3 : 0;
  return (
    <svg
      viewBox={`0 0 ${w + padRight} ${totalH}`}
      style={{ width: w + padRight }}
      className={className}
      role="img"
      aria-label={`hexagrama ${bits}`}
    >
      {rows}
    </svg>
  );
}

/** Glifo compacto para el anillo del hipercubo (líneas finas, sin relleno grueso). */
export function GlyphMini({
  bits,
  size = 16,
  color = "currentColor",
}: {
  bits: string;
  size?: number;
  color?: string;
}) {
  const w = size;
  const bar = size * 0.12;
  const gap = size * 0.15;
  const totalH = 6 * bar + 5 * gap;
  const rows = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = (6 - k) * (gap + bar);
    if (yang) {
      rows.push(<rect key={k} x={0} y={y} width={w} height={bar} rx={0.4} fill={color} />);
    } else {
      const seg = w * 0.4;
      rows.push(
        <rect key={`${k}a`} x={0} y={y} width={seg} height={bar} rx={0.4} fill={color} />,
        <rect key={`${k}b`} x={w - seg} y={y} width={seg} height={bar} rx={0.4} fill={color} />,
      );
    }
  }
  return (
    <svg viewBox={`0 0 ${w} ${totalH}`} width={w} height={totalH} aria-hidden="true">
      {rows}
    </svg>
  );
}
