import { useState, useEffect, useMemo, useRef } from "react";

// ————— Datos verificados: trigramas (bits abajo→arriba, yang=1) —————
const TRI = { Qian: "111", Dui: "110", Li: "101", Zhen: "100", Xun: "011", Kan: "010", Gen: "001", Kun: "000" };

// [KW, pinyin, nombre, trigrama inferior, trigrama superior]
const DATA = [
  [1,"Qián","Lo Creativo","Qian","Qian"],[2,"Kūn","Lo Receptivo","Kun","Kun"],
  [3,"Zhūn","La Dificultad Inicial","Zhen","Kan"],[4,"Méng","La Necedad Juvenil","Kan","Gen"],
  [5,"Xū","La Espera","Qian","Kan"],[6,"Sòng","El Conflicto","Kan","Qian"],
  [7,"Shī","El Ejército","Kan","Kun"],[8,"Bǐ","La Solidaridad","Kun","Kan"],
  [9,"Xiǎo Chù","Fuerza Domesticadora Menor","Qian","Xun"],[10,"Lǚ","El Porte","Dui","Qian"],
  [11,"Tài","La Paz","Qian","Kun"],[12,"Pǐ","El Estancamiento","Kun","Qian"],
  [13,"Tóng Rén","Comunidad con los Hombres","Li","Qian"],[14,"Dà Yǒu","La Posesión de lo Grande","Qian","Li"],
  [15,"Qiān","La Modestia","Gen","Kun"],[16,"Yù","El Entusiasmo","Kun","Zhen"],
  [17,"Suí","El Seguimiento","Zhen","Dui"],[18,"Gǔ","El Trabajo en lo Echado a Perder","Xun","Gen"],
  [19,"Lín","El Acercamiento","Dui","Kun"],[20,"Guān","La Contemplación","Kun","Xun"],
  [21,"Shì Hé","La Mordedura Tajante","Zhen","Li"],[22,"Bì","La Gracia","Li","Gen"],
  [23,"Bō","La Desintegración","Kun","Gen"],[24,"Fù","El Retorno","Zhen","Kun"],
  [25,"Wú Wàng","La Inocencia","Zhen","Qian"],[26,"Dà Chù","Fuerza Domesticadora Mayor","Qian","Gen"],
  [27,"Yí","La Nutrición","Zhen","Gen"],[28,"Dà Guò","Preponderancia de lo Grande","Xun","Dui"],
  [29,"Kǎn","Lo Abismal","Kan","Kan"],[30,"Lí","Lo Adherente","Li","Li"],
  [31,"Xián","El Influjo","Gen","Dui"],[32,"Héng","La Duración","Xun","Zhen"],
  [33,"Dùn","La Retirada","Gen","Qian"],[34,"Dà Zhuàng","El Poder de lo Grande","Qian","Zhen"],
  [35,"Jìn","El Progreso","Kun","Li"],[36,"Míng Yí","El Oscurecimiento de la Luz","Li","Kun"],
  [37,"Jiā Rén","El Clan","Li","Xun"],[38,"Kuí","El Antagonismo","Dui","Li"],
  [39,"Jiǎn","El Impedimento","Gen","Kan"],[40,"Xiè","La Liberación","Kan","Zhen"],
  [41,"Sǔn","La Merma","Dui","Gen"],[42,"Yì","El Aumento","Zhen","Xun"],
  [43,"Guài","La Resolución","Qian","Dui"],[44,"Gòu","Ir al Encuentro","Xun","Qian"],
  [45,"Cuì","La Reunión","Kun","Dui"],[46,"Shēng","La Ascensión","Xun","Kun"],
  [47,"Kùn","La Opresión","Kan","Dui"],[48,"Jǐng","El Pozo","Xun","Kan"],
  [49,"Gé","La Revolución","Li","Dui"],[50,"Dǐng","El Caldero","Xun","Li"],
  [51,"Zhèn","La Conmoción","Zhen","Zhen"],[52,"Gèn","El Aquietamiento","Gen","Gen"],
  [53,"Jiàn","El Desarrollo","Gen","Xun"],[54,"Guī Mèi","La Muchacha que se Casa","Dui","Zhen"],
  [55,"Fēng","La Plenitud","Li","Zhen"],[56,"Lǚ","El Andariego","Gen","Li"],
  [57,"Xùn","Lo Suave","Xun","Xun"],[58,"Duì","Lo Sereno","Dui","Dui"],
  [59,"Huàn","La Disolución","Kan","Xun"],[60,"Jié","La Restricción","Dui","Kan"],
  [61,"Zhōng Fú","La Verdad Interior","Dui","Xun"],[62,"Xiǎo Guò","Preponderancia de lo Pequeño","Gen","Zhen"],
  [63,"Jì Jì","Después de la Consumación","Li","Kan"],[64,"Wèi Jì","Antes de la Consumación","Kan","Li"],
];

// HEX[valor 0..63] = { v, bits (abajo→arriba), kw, py, es }
const HEX = {};
DATA.forEach(([kw, py, es, lo, up]) => {
  const bits = TRI[lo] + TRI[up];
  const v = parseInt(bits, 2); // línea inferior = bit más significativo (convención Shao Yong)
  HEX[v] = { v, bits, kw, py, es };
});

// Colores de hilo por línea (1 = abajo … 6 = arriba), como en el diagrama original
const LINE_COLOR = { 1: "#E24B3B", 2: "#E8883A", 3: "#E5C558", 4: "#5FAE7F", 5: "#5B8FD9", 6: "#9C6BC9" };
const LINE_BIT = (k) => 1 << (6 - k); // línea 1 → 32 … línea 6 → 1

// Las 192 aristas del hipercubo Q6: pares a distancia de Hamming 1
const EDGES = [];
for (let v = 0; v < 64; v++) {
  for (let k = 1; k <= 6; k++) {
    const n = v ^ LINE_BIT(k);
    if (v < n) EDGES.push({ a: v, b: n, line: k });
  }
}

// Código Gray reflejado: recorrido hamiltoniano, cambia UNA línea por paso
const GRAY = Array.from({ length: 64 }, (_, n) => n ^ (n >> 1)); // empieza en Kun (0), termina en Fu (32)

const R = 292; // radio del anillo
const CX = 350, CY = 350;

function pos(idx) {
  const ang = -Math.PI / 2 + (idx * 2 * Math.PI) / 64;
  return [CX + R * Math.cos(ang), CY + R * Math.sin(ang)];
}

// Glifo de hexagrama dibujado (línea 6 arriba, línea 1 abajo)
function Glyph({ bits, w = 16, gap = 2.4, bar = 1.9, stroke = "#E9E3D3", cx = 0, cy = 0 }) {
  const rows = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1"; // bits[0] = línea 1 (abajo)
    const y = cy - ((6 - 1) * (gap + bar)) / 2 + (6 - k) * (gap + bar);
    if (yang) {
      rows.push(<rect key={k} x={cx - w / 2} y={y} width={w} height={bar} fill={stroke} rx={0.5} />);
    } else {
      rows.push(<rect key={k + "a"} x={cx - w / 2} y={y} width={w * 0.4} height={bar} fill={stroke} rx={0.5} />);
      rows.push(<rect key={k + "b"} x={cx + w * 0.1} y={y} width={w * 0.4} height={bar} fill={stroke} rx={0.5} />);
    }
  }
  return <g>{rows}</g>;
}

function BigGlyph({ bits, highlight }) {
  const w = 84, gap = 7, bar = 8;
  const rows = [];
  for (let k = 6; k >= 1; k--) {
    const yang = bits[k - 1] === "1";
    const y = (6 - k) * (gap + bar);
    const col = highlight === k ? LINE_COLOR[k] : "#E9E3D3";
    if (yang) {
      rows.push(<rect key={k} x={0} y={y} width={w} height={bar} rx={1.5} fill={col} />);
    } else {
      rows.push(<rect key={k + "a"} x={0} y={y} width={w * 0.42} height={bar} rx={1.5} fill={col} />);
      rows.push(<rect key={k + "b"} x={w * 0.58} y={y} width={w * 0.42} height={bar} rx={1.5} fill={col} />);
    }
  }
  return (
    <svg viewBox={`-6 -6 ${w + 12} ${6 * bar + 5 * gap + 12}`} style={{ width: 76 }} aria-hidden="true">
      {rows}
    </svg>
  );
}

export default function HipercuboIChing() {
  const [order, setOrder] = useState("fuxi"); // 'fuxi' | 'kingwen'
  const [selected, setSelected] = useState(null); // valor 0..63
  const [lines, setLines] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true });
  const [walking, setWalking] = useState(false);
  const [step, setStep] = useState(-1); // índice en GRAY
  const timer = useRef(null);

  // posición angular de cada valor según el orden elegido
  const idxOf = useMemo(() => {
    const arr = new Array(64);
    if (order === "fuxi") {
      for (let v = 0; v < 64; v++) arr[v] = v;
    } else {
      for (let v = 0; v < 64; v++) arr[v] = HEX[v].kw - 1;
    }
    return arr;
  }, [order]);

  const pts = useMemo(() => {
    const p = new Array(64);
    for (let v = 0; v < 64; v++) p[v] = pos(idxOf[v]);
    return p;
  }, [idxOf]);

  useEffect(() => {
    if (!walking) { clearInterval(timer.current); return; }
    timer.current = setInterval(() => {
      setStep((s) => {
        const nx = s + 1;
        if (nx >= 64) { setWalking(false); return s; }
        setSelected(GRAY[nx]);
        return nx;
      });
    }, 420);
    return () => clearInterval(timer.current);
  }, [walking]);

  const startWalk = () => {
    setStep(0);
    setSelected(GRAY[0]);
    setWalking(true);
  };
  const resetWalk = () => {
    setWalking(false);
    setStep(-1);
    setSelected(null);
  };

  // aristas ya recorridas por el paseo Gray
  const trail = useMemo(() => {
    const t = [];
    for (let s = 1; s <= step && s < 64; s++) {
      const a = GRAY[s - 1], b = GRAY[s];
      const diff = a ^ b;
      const k = 6 - Math.round(Math.log2(diff));
      t.push({ a, b, line: k });
    }
    return t;
  }, [step]);

  const lastLine = trail.length ? trail[trail.length - 1].line : null;

  const edgePath = (a, b) => {
    const [x1, y1] = pts[a], [x2, y2] = pts[b];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const cx = CX + (mx - CX) * 0.32, cy = CY + (my - CY) * 0.32;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  const sel = selected != null ? HEX[selected] : null;
  const neighbors = sel
    ? [1, 2, 3, 4, 5, 6].map((k) => ({ k, h: HEX[sel.v ^ LINE_BIT(k)] }))
    : [];

  const chip = (active) =>
    `px-3 py-1.5 text-xs tracking-wide rounded-full border transition-colors ${
      active ? "border-transparent" : "border-neutral-700 text-neutral-400"
    }`;

  return (
    <div style={{ background: "#100F0D", color: "#E9E3D3", fontFamily: "Georgia, 'Times New Roman', serif" }} className="min-h-screen w-full">
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-16">

        {/* ——— Cabecera ——— */}
        <header className="text-center mb-5">
          <div style={{ color: "#B5442D", letterSpacing: "0.35em", fontFamily: "ui-monospace, monospace" }} className="text-[11px] uppercase mb-2">
            易 · 2⁶ = 64
          </div>
          <h1 className="text-3xl sm:text-4xl" style={{ fontWeight: 400 }}>El hipercubo del I Ching</h1>
          <p className="mt-2 text-sm text-neutral-400" style={{ fontFamily: "ui-monospace, monospace" }}>
            64 hexagramas · 192 mutaciones de una línea · un recorrido Gray
          </p>
        </header>

        {/* ——— Controles de orden ——— */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
          <button
            onClick={() => setOrder("fuxi")}
            className={chip(order === "fuxi")}
            style={order === "fuxi" ? { background: "#B5442D", color: "#F5EFDF" } : {}}
          >
            Orden Fu Xi (binario 0–63)
          </button>
          <button
            onClick={() => setOrder("kingwen")}
            className={chip(order === "kingwen")}
            style={order === "kingwen" ? { background: "#B5442D", color: "#F5EFDF" } : {}}
          >
            Orden Rey Wen (tradicional)
          </button>
        </div>
        <p className="text-center text-xs text-neutral-500 mb-4">
          {order === "fuxi"
            ? "Los hilos forman un patrón simétrico: el conteo binario respeta la geometría del hipercubo."
            : "Los mismos 192 hilos, ahora enredados: el orden del libro ignora la geometría binaria."}
        </p>

        {/* ——— Anillo ——— */}
        <svg viewBox="0 0 700 700" className="w-full select-none" role="img" aria-label="Anillo de 64 hexagramas con conexiones de una línea">
          <circle cx={CX} cy={CY} r={R + 22} fill="none" stroke="#2A2620" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={R - 20} fill="none" stroke="#1C1915" strokeWidth="1" />

          {/* aristas base */}
          {EDGES.filter((e) => lines[e.line]).map((e, i) => {
            const touching = selected != null && (e.a === selected || e.b === selected);
            const dim = selected != null && !touching;
            return (
              <path
                key={i}
                d={edgePath(e.a, e.b)}
                fill="none"
                stroke={LINE_COLOR[e.line]}
                strokeWidth={touching ? 2 : 0.8}
                opacity={dim ? 0.05 : touching ? 0.95 : 0.28}
              />
            );
          })}

          {/* rastro del recorrido Gray */}
          {trail.map((e, i) => (
            <path
              key={"t" + i}
              d={edgePath(e.a, e.b)}
              fill="none"
              stroke={LINE_COLOR[e.line]}
              strokeWidth={2.2}
              opacity={0.9}
            />
          ))}

          {/* nodos */}
          {Array.from({ length: 64 }, (_, v) => {
            const [x, y] = pts[v];
            const isSel = selected === v;
            return (
              <g key={v} onClick={() => { setWalking(false); setSelected(isSel ? null : v); }} style={{ cursor: "pointer" }}>
                {isSel && <circle cx={x} cy={y} r={13} fill="none" stroke="#B5442D" strokeWidth="1.5" />}
                <Glyph bits={HEX[v].bits} cx={x} cy={y} stroke={isSel ? "#F5EFDF" : "#CFC7B2"} />
                <circle cx={x} cy={y} r={13} fill="transparent" />
              </g>
            );
          })}
        </svg>

        {/* ——— Leyenda / filtros de línea ——— */}
        <div className="flex flex-wrap justify-center gap-2 mt-3 mb-5">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <button
              key={k}
              onClick={() => setLines((L) => ({ ...L, [k]: !L[k] }))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs"
              style={{
                borderColor: lines[k] ? LINE_COLOR[k] : "#3A362E",
                color: lines[k] ? "#E9E3D3" : "#6B6558",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 99, background: lines[k] ? LINE_COLOR[k] : "#3A362E", display: "inline-block" }} />
              L{k}{k === 1 ? " (abajo)" : k === 6 ? " (arriba)" : ""}
            </button>
          ))}
        </div>

        {/* ——— Recorrido Gray ——— */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {!walking ? (
            <button
              onClick={startWalk}
              className="px-4 py-2 rounded-full text-sm"
              style={{ background: "#B5442D", color: "#F5EFDF" }}
            >
              ▶ Recorrido Gray
            </button>
          ) : (
            <button onClick={() => setWalking(false)} className="px-4 py-2 rounded-full text-sm border border-neutral-600">
              ⏸ Pausa
            </button>
          )}
          {step >= 0 && (
            <>
              {!walking && step < 63 && (
                <button onClick={() => setWalking(true)} className="px-3 py-2 rounded-full text-sm border border-neutral-600">
                  Continuar
                </button>
              )}
              <button onClick={resetWalk} className="px-3 py-2 rounded-full text-sm border border-neutral-700 text-neutral-400">
                Reiniciar
              </button>
              <span className="text-xs text-neutral-400" style={{ fontFamily: "ui-monospace, monospace" }}>
                paso {Math.max(step, 0) + 1}/64
                {lastLine && (
                  <span style={{ color: LINE_COLOR[lastLine] }}> · cambió L{lastLine}</span>
                )}
              </span>
            </>
          )}
        </div>
        {step === 63 && (
          <p className="text-center text-xs text-neutral-500 -mt-3 mb-6">
            El recorrido empezó en Kun (Lo Receptivo, 0) y terminó en Fu — «El Retorno» (32). Cada paso cambió exactamente una línea.
          </p>
        )}

        {/* ——— Panel de detalle ——— */}
        {sel ? (
          <div className="rounded-xl p-4 sm:p-5" style={{ background: "#17151238", border: "1px solid #2A2620" }}>
            <div className="flex items-start gap-4">
              <BigGlyph bits={sel.bits} highlight={walking || step >= 0 ? lastLine : null} />
              <div className="min-w-0">
                <div className="text-lg leading-tight">
                  {sel.kw}. {sel.py} · {sel.es}
                </div>
                <div className="mt-1 text-sm text-neutral-400" style={{ fontFamily: "ui-monospace, monospace" }}>
                  {sel.bits}₂ = {sel.v} <span className="text-neutral-600">(abajo→arriba, yang=1)</span>
                </div>
                <div className="mt-3 text-xs text-neutral-500 uppercase tracking-widest" style={{ fontFamily: "ui-monospace, monospace" }}>
                  Seis mutaciones posibles
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {neighbors.map(({ k, h }) => (
                    <button
                      key={k}
                      onClick={() => { setWalking(false); setSelected(h.v); }}
                      className="px-2.5 py-1 rounded-md text-xs border"
                      style={{ borderColor: LINE_COLOR[k] + "88", color: "#E9E3D3", fontFamily: "ui-monospace, monospace" }}
                    >
                      <span style={{ color: LINE_COLOR[k] }}>L{k}</span> → {h.kw} {h.py}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-neutral-500">
            Toca cualquier hexagrama del anillo para ver su valor binario y sus seis vecinos,
            o lanza el recorrido Gray para ver los 64 estados conectados por mutaciones de una sola línea.
          </p>
        )}

        <footer className="mt-8 text-center text-[11px] text-neutral-600" style={{ fontFamily: "ui-monospace, monospace" }}>
          Convención Shao Yong–Leibniz: línea inferior = bit más significativo · Kun 000000 = 0 · Qian 111111 = 63
        </footer>
      </div>
    </div>
  );
}
