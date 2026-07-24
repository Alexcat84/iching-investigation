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
- `docs/registro-aplicabilidad.md`: documento vivo con el estado de cada teorema o dominio evaluado (construido, aprobado, en exploración, rechazado). Cada tanda futura lo actualiza.

```bash
python3 scripts/iching_engine.py    # verifica el motor y regenera el dataset
python3 scripts/experimentos.py     # verifica las afirmaciones de los experimentos
```

## Capa web: `web/`

Aplicación Next.js (App Router, React 19, Tailwind v4) con un **menú extensible de experimentos**, cada uno en su propia página visual e interactiva. La numeración sale del orden del registro (`web/lib/experimentos.ts`): reordenar experimentos es reordenar ese arreglo.

**Portada = menú acordeón.** Las cinco categorías se despliegan una a una (hover en escritorio, toque en táctil), con un buscador en cliente por título y una **miniatura SVG generativa** por experimento, dibujada con la matemática real de su propia lib (nunca con datos decorativos). `web/lib/miniaturas.tsx` tiene un generador por slug, y la suite comprueba que hay uno por experimento y ninguno huérfano.

**Sistema de etiquetado en facetas** (`docs/etiquetado-experimentos.md`): cada experimento tiene exactamente 1 **categoría** (geometría, álgebra, historia, azar, práctica), de 2 a 4 **etiquetas** de un vocabulario cerrado de 19 (union types que el compilador valida), un **tipo** y un **nivel**. El vocabulario de 19 etiquetas queda completamente cubierto (0 muertas).

**36 experimentos**, por categoría (la lista exacta vive en el registro y en `docs/etiquetado-experimentos.md`):

- **Geometría** (7): el cubo de 6 dimensiones y sus formas (hipercubo y recorrido Gray, sombras del 6-cubo, árbol de Fu Xi, serpiente de De Bruijn, retículo B6, conteos astronómicos, el cubo dice que no).
- **Álgebra** (12): grupos, matrices, particiones y espectros (simetrías, bosque y matriz nuclear, grupo (Z/2)⁶ y Sierpinski, comparador de particiones, Fourier sobre el cubo y sobre el anillo, codones, Fibonacci en el hexagrama, la matriz de transferencia, el espectro de Q6, las influencias de las líneas).
- **Historia** (8): los órdenes tradicionales y sus documentos (palacios de Jing Fang, secuencia del Rey Wen, cuadrado y círculo de Shao Yong, dos cielos, Rey Wen como permutación, ¿es el Rey Wen aleatorio?, Leibniz, el calendario de los soberanos).
- **Azar** (7): probabilidades, cadenas, paseos y física estadística (monedas contra milenrama, ritual de las 49 varillas, cadena de Markov, comparador de sorteos, paseo aleatorio, el hexagrama como cadena de espines de Ising, la entropía del oráculo).
- **Tu práctica** (2): herramientas sobre las propias consultas (el mapa de la lectura, la trayectoria personal).

La lógica del sitio (`web/lib/`) es un puerto TypeScript del motor de Python; ambos se mantienen en paralelo, con aserciones en desarrollo en las libs TS y `scripts/experimentos.py` como verificación autoritativa de cada afirmación estructural que aparece en pantalla.

**Sistema de fundamentos y fuentes** (`/fundamentos`, `web/lib/fundamentos.ts`): cada experimento lleva al pie un bloque de fundamento que clasifica sus afirmaciones en cinco tipos (teorema, cálculo, tradición documentada, reconstrucción académica, analogía con descargo). Los teoremas y cálculos enlazan la sección de la suite que los verifica; las tradiciones y reconstrucciones citan una fuente en formato APA 7. La **única** fuente de referencias es `docs/evidencias-fundamentos.md`, verificada, y ninguna se cita de memoria: `scripts/experimentos.py` comprueba que el render APA de cada ficha aparece verbatim en ese documento, que ninguna ficha queda sin uso y que todo experimento tiene su fundamento. Las referencias completas viven en la página `/fundamentos`, alfabéticas por apellido. Cuando una afirmación encarna un teorema clásico, lo declara con una **insignia de teorema** (por ejemplo «Teorema: modelo de Ising (1925)»).

**Hallazgos propios** (sello 印): los resultados originales del laboratorio que, tras una búsqueda de originalidad documentada, no hemos encontrado publicados en otra parte llevan un sello, visible en la tarjeta del menú, en la cabecera de su página y en su bloque de fundamento; y una sección propia en la portada y en `/fundamentos`. Es un marcador ortogonal (el experimento conserva su categoría; los conteos no cambian) y el conteo de sellos está congelado en la suite, así que un sello no aparece sin pasar por su proceso. El primer y único miembro por ahora es «Fibonacci en el hexagrama».

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
