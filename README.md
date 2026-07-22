# iching-investigation

Repositorio de experimentación e investigación sobre la estructura matemática del I Ching: la correspondencia binaria de los 64 hexagramas, las secuencias Fu Xi y Rey Wen, y el hipercubo de 6 dimensiones (Q6) que forman las mutaciones de una línea.

El proyecto tiene dos capas: una de **investigación verificada** (Python) y una **web de experimentos** (Next.js), pensada para publicarse en Vercel. Cada afirmación estructural del sitio está comprobada computacionalmente por los scripts.

## Capa de investigación — `scripts/` y `data/`

- `scripts/iching_engine.py`: motor binario verificado. Operaciones tradicionales (mutación, dui, fan, hu gua, trigramas) como operaciones de bits, secuencias Fu Xi y Rey Wen, recorrido Gray, distancia de Hamming, y suite de verificación (biyección 0 a 63, estructura de pares del Rey Wen, camino hamiltoniano).
- `scripts/experimentos.py`: verifica las afirmaciones de los experimentos del sitio contra el motor — partición de los palacios de Jing Fang, probabilidades de monedas vs. milenrama, y las simetrías (órbitas de Klein, palíndromos, dinámica nuclear, espectro de Q6).
- `data/hexagramas.json`: dataset de los 64 hexagramas. Generado por el motor; regenerar con `python3 scripts/iching_engine.py`.
- `docs/analisis-binario.md`: análisis completo con las tablas de ambas secuencias.
- `docs/ideas-aplicaciones.md`: ideas de aplicación.

```bash
python3 scripts/iching_engine.py    # verifica el motor y regenera el dataset
python3 scripts/experimentos.py     # verifica las afirmaciones de los experimentos
```

## Capa web — `web/`

Aplicación Next.js (App Router, React 19, Tailwind v4) con un **menú extensible de experimentos**, cada uno en su propia página visual e interactiva:

1. **El hipercubo** — el anillo de los 64 hexagramas y sus 192 aristas; Fu Xi vs. Rey Wen; recorrido Gray.
2. **Los ocho palacios de Jing Fang** — las casas del siglo II a.C. como recorridos sobre Q6, con la partición verificada.
3. **El mapa de la lectura** — una consulta como salto en el hipercubo, con las monedas.
4. **Monedas contra milenrama** — las probabilidades de cada método, simuladas en vivo.
5. **Las simetrías del hipercubo** — órbitas de Klein, palíndromos y el mapa nuclear.

La lógica del sitio (`web/lib/`) es un puerto TypeScript del motor de Python; ambos se mantienen en paralelo.

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
