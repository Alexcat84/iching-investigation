# iching-investigation

Repositorio de experimentación e investigación sobre la estructura matemática del I Ching: la correspondencia binaria de los 64 hexagramas, las secuencias Fu Xi y Rey Wen, y el hipercubo de 6 dimensiones (Q6) que forman las mutaciones de una línea.

El proyecto tiene dos capas: una de **investigación verificada** (Python) y una **web de experimentos** (Next.js), pensada para publicarse en Vercel. Cada afirmación estructural del sitio está comprobada computacionalmente por los scripts.

## Capa de investigación: `scripts/` y `data/`

- `scripts/iching_engine.py`: motor binario verificado. Operaciones tradicionales (mutación, dui, fan, hu gua, trigramas) como operaciones de bits, secuencias Fu Xi y Rey Wen, recorrido Gray, distancia de Hamming, y suite de verificación (biyección 0 a 63, estructura de pares del Rey Wen, camino hamiltoniano).
- `scripts/experimentos.py`: verifica contra el motor **cada afirmación estructural** que aparece en el sitio, un bloque por experimento, más la cobertura del etiquetado y de las miniaturas. Es la **puerta de publicación**: no se hace push si no sale con exit 0. Cada cifra visible en la web o está asertada aquí o lleva su cita.
- `data/hexagramas.json`: dataset de los 64 hexagramas. Generado por el motor; regenerar con `python3 scripts/iching_engine.py`.
- `docs/analisis-binario.md`: análisis completo con las tablas de ambas secuencias.
- `docs/ideas-aplicaciones.md`: ideas de aplicación (base de la categoría práctica y de la app).
- `docs/etiquetado-experimentos.md`: el esquema de clasificación en facetas y la asignación completa.
- `docs/catalogo-experimentos-restantes.md`: registro histórico del catálogo, ya construido en su totalidad.

```bash
python3 scripts/iching_engine.py    # verifica el motor y regenera el dataset
python3 scripts/experimentos.py     # verifica las afirmaciones de los experimentos
```

## Capa web: `web/`

Aplicación Next.js (App Router, React 19, Tailwind v4) con un **menú extensible de experimentos**, cada uno en su propia página visual e interactiva. La numeración sale del orden del registro (`web/lib/experimentos.ts`): reordenar experimentos es reordenar ese arreglo.

**Portada = menú acordeón.** Las cinco categorías se despliegan una a una (hover en escritorio, toque en táctil), con un buscador en cliente por título y una **miniatura SVG generativa** por experimento, dibujada con la matemática real de su propia lib (nunca con datos decorativos). `web/lib/miniaturas.tsx` tiene un generador por slug, y la suite comprueba que hay uno por experimento y ninguno huérfano.

**Sistema de etiquetado en facetas** (`docs/etiquetado-experimentos.md`): cada experimento tiene exactamente 1 **categoría** (geometría, álgebra, historia, azar, práctica), de 2 a 4 **etiquetas** de un vocabulario cerrado de 17 (union types que el compilador valida), un **tipo** y un **nivel**. El vocabulario de 17 etiquetas queda completamente cubierto (0 muertas).

**28 experimentos**, por categoría (la lista exacta vive en el registro y en `docs/etiquetado-experimentos.md`):

- **Geometría** (6): el cubo de 6 dimensiones y sus formas (hipercubo y recorrido Gray, sombras del 6-cubo, árbol de Fu Xi, serpiente de De Bruijn, retículo B6, conteos astronómicos).
- **Álgebra** (7): grupos, matrices, particiones y espectros (simetrías, bosque nuclear, matriz nuclear sobre F2, grupo (Z/2)⁶ y Sierpinski, comparador de particiones, espectro de Walsh-Hadamard, codones con descargo).
- **Historia** (8): los órdenes tradicionales y sus documentos (palacios de Jing Fang, secuencia del Rey Wen, cuadrado y círculo de Shao Yong, dos cielos, Rey Wen como permutación, ¿es el Rey Wen aleatorio?, Leibniz, el calendario de los soberanos).
- **Azar** (5): probabilidades, cadenas y paseos (monedas contra milenrama, ritual de las 49 varillas, cadena de Markov, comparador de sorteos, paseo aleatorio).
- **Tu práctica** (2): herramientas sobre las propias consultas (el mapa de la lectura, la trayectoria personal).

La lógica del sitio (`web/lib/`) es un puerto TypeScript del motor de Python; ambos se mantienen en paralelo, con aserciones en desarrollo en las libs TS y `scripts/experimentos.py` como verificación autoritativa de cada afirmación estructural que aparece en pantalla.

### Desarrollo local

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
```

### Añadir un experimento nuevo

El menú se genera solo desde el registro. Un experimento nuevo es un commit atómico con:

1. Una entrada en el registro `web/lib/experimentos.ts` (con sus cuatro facetas).
2. La página `web/app/experimentos/<slug>/page.tsx` (más su componente cliente si es interactiva) y, si hace falta, su lib en `web/lib/`.
3. Un generador de miniatura en `web/lib/miniaturas.tsx`, derivado de la matemática real.
4. Una sección de verificación en `scripts/experimentos.py` y la actualización de los conteos (miniaturas, distribución del etiquetado).

Puerta antes de publicar: `python3 scripts/experimentos.py` con exit 0 y `npm run build` con exit 0.

### Despliegue en Vercel

Importa el repositorio en Vercel y, en la configuración del proyecto, establece:

- **Root Directory:** `web`

El framework (Next.js) se detecta solo; no hace falta más configuración ni variables de entorno. Todas las páginas son estáticas.

## Convención

Yang = 1, yin = 0, líneas leídas de abajo hacia arriba, línea inferior = bit más significativo (convención Shao Yong–Leibniz). Kun = 000000 = 0, Qian = 111111 = 63.
