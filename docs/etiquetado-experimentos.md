# Sistema de etiquetado en facetas

Documento de referencia del esquema de clasificacion de los experimentos del laboratorio. Este archivo describe el vocabulario; la asignacion concreta de cada experimento es un espejo del registro en [`web/lib/experimentos.ts`](../web/lib/experimentos.ts), que es la fuente de verdad, y la verifica `scripts/experimentos.py` (funcion `verificar_etiquetado`).

Cada experimento se clasifica con **cuatro facetas**:

1. **Categoria** (exactamente una): navegacion principal de la portada.
2. **Etiquetas** (de 2 a 4): temas transversales de un vocabulario cerrado.
3. **Tipo** (exactamente uno): que clase de artefacto es.
4. **Nivel** (exactamente uno): requisitos para leerlo.

Los cuatro son `union types` en TypeScript: el compilador rechaza cualquier valor fuera del vocabulario, y la suite de Python comprueba la misma regla (1 categoria, de 2 a 4 etiquetas, tipo y nivel validos, y que ninguna etiqueta del vocabulario quede sin uso).

## Faceta 1: Categoria

Exclusiva. Son las cinco secciones del menu acordeon.

| Categoria | Descripcion | Experimentos |
|---|---|---|
| **Geometría** | El cubo de 6 dimensiones y sus formas | 6 |
| **Álgebra** | Grupos, matrices, particiones, espectros | 7 |
| **Historia** | Los órdenes tradicionales y sus documentos | 8 |
| **Azar** | Probabilidades, cadenas, paseos, simulaciones | 5 |
| **Tu práctica** | Herramientas sobre tus propias consultas | 2 |

Total: **28 experimentos**.

## Faceta 2: Etiquetas (vocabulario cerrado de 17)

De 2 a 4 por experimento. Filtros transversales que cruzan categorias. El vocabulario esta completamente cubierto: ninguna etiqueta queda sin al menos un experimento.

| Etiqueta | Definicion |
|---|---|
| `hipercubo` | Usa la estructura de Q6: vértices, aristas, distancia de Hamming |
| `binario` | La correspondencia hexagrama ↔ número de 6 bits en primer plano |
| `permutaciones` | Órdenes como permutaciones: ciclos, inversiones, paridad |
| `secuencias históricas` | Fu Xi, Rey Wen, Mawangdui o Jing Fang como objeto de estudio |
| `trigramas` | La estructura 8×8 o los bagua como protagonistas |
| `hu gua` | El operador nuclear y su dinámica |
| `simetrías` | Grupos de simetría, órbitas, involuciones (fan, dui, D4) |
| `particiones` | Formas de partir los 64 en familias comparables |
| `probabilidad` | Distribuciones, procesos estocásticos, convergencia |
| `adivinación` | El mecanismo material del oráculo (varillas, monedas, fichas) |
| `recorridos` | Caminos sobre el grafo: Gray, hamiltonianos, De Bruijn, paseos |
| `álgebra lineal` | Matrices sobre F2, rangos, espectros de Walsh |
| `teoría de grupos` | (Z/2)^6, subgrupos, cosets, Burnside |
| `estadística` | Tests de hipótesis, Monte Carlo, p-valores |
| `leibniz` | La conexión histórica con el binario europeo |
| `interdisciplinar` | Correspondencias con sistemas externos (requiere descargo) |
| `consulta propia` | Opera sobre lecturas reales del usuario |

## Faceta 3: Tipo

| Tipo | Que es |
|---|---|
| **visualización** | ver una estructura |
| **simulador** | generar y observar procesos |
| **calculadora** | metes un input y recibes un resultado |
| **test** | pone a prueba una hipótesis |
| **referencia** | documenta hechos con fuentes |

## Faceta 4: Nivel

| Nivel | Requisitos |
|---|---|
| **introductorio** | sin requisitos |
| **intermedio** | ayuda haber visto el hipercubo |
| **avanzado** | usa maquinaria matemática explícita |

## Asignacion completa

Espejo del registro (generado desde `web/lib/experimentos.ts`). El numero sale del orden del arreglo.

| N | Experimento | Categoria | Etiquetas | Tipo | Nivel |
|---:|---|---|---|---|---|
| 01 | El hipercubo del I Ching | Geometría | hipercubo, binario, recorridos | visualización | introductorio |
| 02 | Los ocho palacios de Jing Fang | Historia | secuencias-historicas, particiones, recorridos | visualización | intermedio |
| 03 | El mapa de la lectura | Tu práctica | consulta-propia, hipercubo, binario | calculadora | introductorio |
| 04 | Monedas contra milenrama | Azar | probabilidad, adivinacion | visualización | introductorio |
| 05 | Las simetrías del hipercubo | Álgebra | simetrias, hu-gua, hipercubo | visualización | intermedio |
| 06 | Trayectoria personal | Tu práctica | consulta-propia, recorridos, hipercubo | visualización | introductorio |
| 07 | La secuencia del Rey Wen | Historia | secuencias-historicas, simetrias, binario | visualización | introductorio |
| 08 | El cuadrado y el círculo | Historia | secuencias-historicas, trigramas, simetrias, leibniz | visualización | intermedio |
| 09 | Rey Wen como permutación | Historia | permutaciones, secuencias-historicas, estadistica | visualización | avanzado |
| 10 | El ritual de las 49 varillas | Azar | adivinacion, probabilidad | simulador | introductorio |
| 11 | Los dos cielos | Historia | trigramas, permutaciones, simetrias | visualización | intermedio |
| 12 | Las sombras del 6-cubo | Geometría | hipercubo, simetrias | visualización | intermedio |
| 13 | El retículo booleano B6 | Geometría | hipercubo, binario, recorridos | visualización | avanzado |
| 14 | El árbol de Fu Xi | Geometría | binario, secuencias-historicas, recorridos | visualización | introductorio |
| 15 | El bosque nuclear | Álgebra | hu-gua, particiones, hipercubo | visualización | intermedio |
| 16 | El operador nuclear como matriz | Álgebra | hu-gua, algebra-lineal, binario | visualización | avanzado |
| 17 | La serpiente de De Bruijn | Geometría | recorridos, binario, hipercubo | visualización | intermedio |
| 18 | El grupo (Z/2)⁶ y el Sierpinski | Álgebra | teoria-de-grupos, particiones, binario | visualización | intermedio |
| 19 | ¿Es el Rey Wen aleatorio? | Historia | estadistica, permutaciones, secuencias-historicas | test | avanzado |
| 20 | La cadena de Markov de las consultas | Azar | probabilidad, adivinacion, hipercubo | simulador | avanzado |
| 21 | Comparador de métodos de sorteo | Azar | adivinacion, probabilidad, estadistica | simulador | introductorio |
| 22 | Comparador de particiones | Álgebra | particiones, estadistica | calculadora | avanzado |
| 23 | El espectro de Walsh-Hadamard | Álgebra | algebra-lineal, secuencias-historicas, estadistica | test | avanzado |
| 24 | Conteos astronómicos del cubo | Geometría | hipercubo, recorridos | referencia | intermedio |
| 25 | Paseo aleatorio y cobertura | Azar | probabilidad, recorridos, hipercubo | simulador | intermedio |
| 26 | Leibniz: los documentos | Historia | leibniz, binario | referencia | introductorio |
| 27 | Los 64 codones | Álgebra | interdisciplinar, binario | visualización | intermedio |
| 28 | El calendario de los soberanos | Historia | secuencias-historicas, recorridos, hipercubo | visualización | introductorio |

## Cobertura

Las 17 etiquetas del vocabulario estan en uso (0 muertas): cada etiqueta tiene al menos un experimento publicado.
