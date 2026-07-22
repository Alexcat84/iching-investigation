# iching-investigation

Repositorio de experimentación e investigación sobre la estructura matemática del I Ching: la correspondencia binaria de los 64 hexagramas, las secuencias Fu Xi y Rey Wen, y el hipercubo de 6 dimensiones (Q6) que forman las mutaciones de una línea.

El proyecto tiene dos capas: una de **investigación verificada** (Python) y una **web de experimentos** (Next.js), pensada para publicarse en Vercel. Cada afirmación estructural del sitio está comprobada computacionalmente por los scripts.

## Capa de investigación: `scripts/` y `data/`

- `scripts/iching_engine.py`: motor binario verificado. Operaciones tradicionales (mutación, dui, fan, hu gua, trigramas) como operaciones de bits, secuencias Fu Xi y Rey Wen, recorrido Gray, distancia de Hamming, y suite de verificación (biyección 0 a 63, estructura de pares del Rey Wen, camino hamiltoniano).
- `scripts/experimentos.py`: verifica las afirmaciones de los experimentos del sitio contra el motor: partición de los palacios de Jing Fang, probabilidades de monedas vs. milenrama, y las simetrías (órbitas de Klein, palíndromos, dinámica nuclear, espectro de Q6).
- `data/hexagramas.json`: dataset de los 64 hexagramas. Generado por el motor; regenerar con `python3 scripts/iching_engine.py`.
- `docs/analisis-binario.md`: análisis completo con las tablas de ambas secuencias.
- `docs/ideas-aplicaciones.md`: ideas de aplicación.

```bash
python3 scripts/iching_engine.py    # verifica el motor y regenera el dataset
python3 scripts/experimentos.py     # verifica las afirmaciones de los experimentos
```

## Capa web: `web/`

Aplicación Next.js (App Router, React 19, Tailwind v4) con un **menú extensible de experimentos** filtrable por facetas, cada uno en su propia página visual e interactiva. La numeración sale del orden del registro (`web/lib/experimentos.ts`): reordenar experimentos es reordenar ese arreglo.

**Sistema de etiquetado en facetas** (`docs/etiquetado-experimentos.md`): cada experimento tiene exactamente 1 **categoría** (geometría, álgebra, historia, azar, práctica), 2 a 4 **etiquetas** de un vocabulario cerrado de 17 (union types que el compilador valida), un **tipo** y un **nivel**. La portada filtra por categoría (pestañas) y etiquetas (chips combinables).

Experimentos actuales (27), por categoría:

- **Geometría** (6): el hipercubo (anillo + recorrido Gray), las sombras del 6-cubo, el árbol de Fu Xi, la serpiente de De Bruijn, los conteos astronómicos del cubo.
- **Álgebra y estructura** (7): las simetrías del hipercubo, Rey Wen como permutación (carrera de los órdenes + costo en líneas), el retículo booleano B6, el bosque nuclear, el operador nuclear como matriz sobre F2, el grupo (Z/2)⁶ y el Sierpinski, el comparador de particiones (ARI), el espectro de Walsh-Hadamard, los 64 codones (con descargo).
- **Historia y secuencias** (7): los ocho palacios de Jing Fang, la secuencia del Rey Wen, el cuadrado y el círculo de Shao Yong (con D4), los dos cielos (bagua), ¿es el Rey Wen aleatorio? (test), Leibniz: los documentos (con descargo).
- **Azar y dinámica** (5): monedas contra milenrama, el ritual de las 49 varillas, la cadena de Markov de las consultas, el comparador de métodos de sorteo, el paseo aleatorio y cobertura.
- **Tu práctica** (2): el mapa de la lectura, trayectoria personal.

El vocabulario de 17 etiquetas queda completamente cubierto. La lógica del sitio (`web/lib/`) es un puerto TypeScript del motor de Python; ambos se mantienen en paralelo y `scripts/experimentos.py` verifica cada afirmación estructural que aparece en pantalla.

### Desarrollo local

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
```

### Añadir un experimento nuevo

El menú se genera solo. Para añadir uno:

1. Añade una entrada a `web/lib/experimentos.ts`.
2. Crea `web/app/experimentos/<slug>/page.tsx`.

### Despliegue en Vercel

Importa el repositorio en Vercel y, en la configuración del proyecto, establece:

- **Root Directory:** `web`

El framework (Next.js) se detecta solo; no hace falta más configuración ni variables de entorno. Todas las páginas son estáticas.

## Convención

Yang = 1, yin = 0, líneas leídas de abajo hacia arriba, línea inferior = bit más significativo (convención Shao Yong–Leibniz). Kun = 000000 = 0, Qian = 111111 = 63.
