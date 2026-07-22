# iching-investigation

Repositorio de experimentación e investigación sobre la estructura matemática del I Ching: la correspondencia binaria de los 64 hexagramas, las secuencias Fu Xi y Rey Wen, y el hipercubo de 6 dimensiones que forman las mutaciones de una línea.

## Contenido

- `scripts/iching_engine.py`: motor binario verificado. Operaciones tradicionales (mutación, dui, fan, hu gua, trigramas) como operaciones de bits, secuencias Fu Xi y Rey Wen, recorrido Gray, distancia de Hamming, y suite de verificación (biyección 0 a 63, estructura de pares del Rey Wen, camino hamiltoniano).
- `data/hexagramas.json`: dataset de los 64 hexagramas (número Rey Wen, pinyin, nombre en español, trigramas, bits, valor decimal, carácter Unicode). Generado por el motor; regenerar con `python3 scripts/iching_engine.py`.
- `web/hipercubo-iching.jsx`: visualización interactiva (React). Anillo de 64 hexagramas, 192 aristas coloreadas por línea, alternancia Fu Xi/Rey Wen, filtros por línea, recorrido Gray animado y panel de detalle con las 6 mutaciones de cada hexagrama.
- `docs/analisis-binario.md`: análisis completo con las tablas de ambas secuencias.
- `docs/ideas-aplicaciones.md`: ideas de aplicación (mapa de la lectura, trayectoria personal, casas de Jing Fang, milenrama, etc.).

## Convención

Yang = 1, yin = 0, líneas leídas de abajo hacia arriba, línea inferior = bit más significativo (convención Shao Yong-Leibniz). Kun = 000000 = 0, Qian = 111111 = 63.

## Verificación

```bash
python3 scripts/iching_engine.py
```

Corre todas las aserciones y regenera el dataset.
