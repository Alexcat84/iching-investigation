# Ideas de aplicación: la estructura binaria del I Ching

Repositorio de experimentación e investigación. Punto de partida: los 64 hexagramas son los 64 números binarios de 6 bits (yang=1, yin=0), y las conexiones por cambio de una línea forman el hipercubo de 6 dimensiones Q6 (64 vértices, 192 aristas).

## 1. Motor de bits (implementado en scripts/iching_engine.py)

Las transformaciones tradicionales son operaciones de bits:

- Líneas mutantes: `original XOR máscara` produce el hexagrama resultante
- Opuesto (dui, 对): `~h & 63` (NOT bit a bit)
- Volteo (fan, 反): invertir el orden de los 6 bits
- Hexagrama nuclear (hu gua, 互卦): bit slicing de las líneas 2 a 4 y 3 a 5
- Trigramas: `h >> 3` (inferior) y `h & 7` (superior)

Sin tablas de lookup, sin posibilidad de errores de datos. Verificado: la correspondencia hexagrama a entero 0 a 63 es una biyección perfecta, y la estructura de pares del Rey Wen (par = volteo del impar, o complemento en los 8 casos simétricos) se cumple en los 32 pares.

## 2. Recorrido Gray (implementado en web/hipercubo-iching.jsx)

El código Gray reflejado recorre los 64 hexagramas cambiando exactamente una línea por paso (camino hamiltoniano sobre Q6). Detalle notable: empieza en Kun (Lo Receptivo, 0) y termina en Fu (El Retorno, 32). Uso posible: modo meditación o recorrido contemplativo en la app; no existe en ninguna app de I Ching conocida.

## 3. Significado de las familias de conexiones

Los 192 hilos se dividen en 6 familias de 32 (una por línea), y cada posición de línea tiene significado tradicional propio:

- L1 (abajo): el comienzo, la raíz
- L2: el interior, la vida privada
- L3: la transición peligrosa entre trigramas
- L4: el ministro, lo público
- L5: el gobernante, el centro de mando
- L6 (arriba): la culminación, la salida

Dos hexagramas unidos por la familia L5 son la misma situación con distinto liderazgo. Cada color es una dimensión geométrica y a la vez un eje temático.

## 4. Distancia de Hamming como métrica de relación

Número de líneas que separan dos hexagramas = distancia en el hipercubo. Distancia 1: vecinos. Distancia 6: el opuesto total (dui), que la tradición ya conocía. Aplicación: función de "hexagramas relacionados" con fundamento matemático, y sistema de recomendación por afinidad (distancia 1 o 2).

## 5. El mapa de la lectura (candidato a prototipo siguiente)

Una consulta real ya es un movimiento en el grafo: hexagrama original + líneas mutantes = salto en el hipercubo cuya distancia es el número de líneas móviles. Tras cada consulta, mostrar el salto en el anillo con los hilos de las líneas que mutaron y su lectura simbólica ("tu situación cambió por la línea 5: el centro de mando").

## 6. Trayectoria personal

El historial de consultas de un usuario es una ruta por el espacio de 64 estados: regiones recurrentes, distancia promedio entre lecturas consecutivas, en qué palacio o familia de trigramas vive su período.

## 7. Ocho casas de Jing Fang

Jing Fang (siglo II a.C.) agrupó los 64 hexagramas en 8 palacios generados por cambios sucesivos de líneas desde los 8 hexagramas puros: caminos sobre el hipercubo descritos 22 siglos antes de la teoría de grafos. Candidato a visualización y a sistema de agrupación alternativo en la app.

## 8. Probabilidades del método de milenrama

Las varillas de milenrama no son simétricas como las monedas: yang viejo 3/16, yin viejo 1/16 (contra 2/16 y 2/16 de las monedas). Un motor que ofrezca ambos métodos con las probabilidades históricas correctas es un diferenciador de autenticidad.

## Contexto histórico

La secuencia Fu Xi (formalizada por Shao Yong, siglo XI) es literalmente contar en binario de 0 a 63. El diagrama fue enviado por Joachim Bouvet a Leibniz hacia 1701; Leibniz, que ya había inventado la aritmética binaria, reconoció la identidad estructural y lo citó en su publicación de 1703. La secuencia del Rey Wen no sigue ninguna fórmula binaria conocida; su regla organizadora es por pares (volteo o complemento).
