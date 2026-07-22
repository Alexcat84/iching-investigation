# Catálogo de experimentos (registro de cierre)

Registro histórico del catálogo de experimentos que se planificó por códigos (series A, B, C, D) y se fue construyendo en tandas. **Todos están construidos, publicados y verificados** por `scripts/experimentos.py`. Este documento deja la traza código -> experimento publicado para continuidad; la especificación viva de cada uno es su propia página, su lib en `web/lib/` y su sección en la suite.

La clasificación en facetas de cada uno vive en [`etiquetado-experimentos.md`](etiquetado-experimentos.md).

## Serie A: álgebra y estructura

| Código | Tema | Experimento publicado | Hallazgo / verificación clave | Estado |
|---|---|---|---|---|
| A1 | El operador nuclear como matriz sobre F2 | `matriz-nuclear` | `hu gua` es lineal; rangos 6 -> 4 -> 2, M⁴ = M² | construido |
| A2 | El grupo (Z/2)⁶ y el Sierpinski | `grupo-sierpinski` | 8 cosets particionan los 64; dominancia = Pascal mod 2 (Lucas) | construido |
| A3 | Comparador de particiones | `comparador-particiones` | palacios vs cosets: ARI = -0,125 (las máscaras no son subgrupo) | construido |
| A4 | El espectro de Walsh-Hadamard | `espectro-walsh` | energía en órdenes pares 2 y 4 = 77,4% vs 47,6% del azar | construido |

## Serie B: historia y aleatoriedad

| Código | Tema | Experimento publicado | Hallazgo / verificación clave | Estado |
|---|---|---|---|---|
| B1 | La serpiente de De Bruijn | `serpiente-debruijn` | B(2,6) canónica: 64 ventanas = {0..63}; 2²⁶ anillos | construido |
| B2 | ¿Es el Rey Wen aleatorio? | `rey-wen-aleatorio` | 1013 inversiones, indistinguible del azar bajo su regla de pares (p = 0,97) | construido |
| B3 | Costo en líneas de cada orden | columna dentro de `permutacion` | Gray 63, Jing Fang 93, Fu Xi 120, Mawangdui 141, Rey Wen 211 | construido (no es página propia) |
| B4 | Conteos astronómicos del cubo | `conteos-astronomicos` | 46080 automorfismos; De Bruijn 2²⁶; Gray cíclicos citados a OEIS | construido |

## Serie C: azar y dinámica

| Código | Tema | Experimento publicado | Hallazgo / verificación clave | Estado |
|---|---|---|---|---|
| C1 | La cadena de Markov de las consultas | `markov-consultas` | milenrama sesga al yin (Kun/Qian = 729 = 3⁶); ambas mezclan igual | construido |
| C2 | Paseo aleatorio y cobertura | `paseo-aleatorio` | retorno al origen = 64 (estacionaria uniforme); cobertura ~360 pasos | construido |
| C3 | Comparador de métodos de sorteo | `comparador-sorteo` | 16 fichas (3/7/5/1) idénticas a la milenrama; monedas distintas | construido |

## Serie D: correspondencias externas (con descargo)

| Código | Tema | Experimento publicado | Hallazgo / verificación clave | Estado |
|---|---|---|---|---|
| D1 | Los 64 codones | `codones` | 64 = 4³ = 2⁶; isomorfismo de estructura, no biológico (24 codificaciones, ninguna canónica) | construido (con descargo) |
| D2 | Leibniz: los documentos | `leibniz-documentos` | cronología documentada Shao Yong -> Bouvet (1701) -> Leibniz (1703) | construido (con descargo) |

## Cierre

Las cuatro series están completas. El catálogo original quedó sin deuda pendiente: cada código tiene su experimento publicado y su verificación en la suite, salvo B3, que por diseño es una columna dentro de `permutacion` y no una página propia. El experimento nº 28, `calendario-soberanos`, es un añadido posterior al catálogo, no parte de estas series.
