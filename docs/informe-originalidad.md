# Informe de originalidad: los cuatro candidatos al sello

Fecha de las búsquedas: 25 de julio de 2026. Método: búsquedas web dirigidas por candidato (términos técnicos y nombres del campo), lectura de las fuentes encontradas, y análisis computacional adicional donde el veredicto lo exigió. Regla: sello solo si la formulación verificada no aparece publicada; toda concesión lleva nota y fecha; "no la encontramos" nunca significa "no existe".

## Candidato 1: el test de aleatoriedad del Rey Wen (exp. 19, p = 0,97) · SELLO DENEGADO POR AHORA

**Encontrado**: Chan, A. (2026). *Statistical properties of the King Wen sequence* (arXiv:2604.09234, abril de 2026). Análisis Monte Carlo del Rey Wen contra 100.000 permutaciones libres. Encuentra CUATRO propiedades significativas: distancia de transición media 3,35 (percentil 98,2), autocorrelación lag-1 de las distancias −0,251 (p = 0,037), 7 grupos de 4 hexagramas con balance exacto de yang (p = 0,002), y asimetría dentro/entre pares (percentil 99,2). Es antecedente directo en el territorio del experimento 19.

**Análisis propio decisivo** (hecho para este informe, reproducible): las cuatro propiedades de Chan, evaluadas bajo NUESTRA nula condicional (barajados que respetan la regla de pares):

| Estadístico de Chan | Percentil bajo barajado libre (reproduje) | Percentil bajo nula de pares |
|---|---|---|
| Distancia media de transición (3,349) | 97,9 (Chan: 98,2) | 29,0: corolario de la regla de pares |
| Autocorrelación de distancias (−0,247; Chan −0,251) | 4,0 | 6,4: señal marginal, NO significativa |
| Grupos de 4 con 12 yang (7; Chan 7) | 99,2 | 89,6: mayormente corolario (la nula de pares eleva la expectativa de 2,6 a 4,4) |
| Asimetría dentro/entre pares | 99,2 | invariante por construcción: corolario puro |

**Lectura honesta**: no hay contradicción entre Chan y nosotros; hay complementariedad exacta. Chan demuestra que el Rey Wen no es azar libre; nuestro experimento demuestra que, condicionado a la regla de pares, casi nada queda: tres de sus cuatro propiedades son corolarios de esa regla, y la cuarta queda en percentil aproximado 6 (sugerente, no significativa). Nuestra formulación condicional es más fina y el análisis de esta tabla parece original, pero como responde a un preprint de hace tres meses, lo correcto es publicarlo como DIÁLOGO con Chan (ampliación del exp. 19 con ficha), no como sello. Reevaluar el sello para la formulación condicional en una búsqueda futura.

**Consecuencia editorial obligatoria**: el copy del exp. 19 que diga "la única estructura es la regla de pares" debe precisarse: "bajo el estadístico de inversiones (p = 0,97); bajo los cuatro estadísticos de Chan (2026), tres resultan corolarios de la regla de pares y el cuarto no alcanza significación (percentil aproximado 6)".

## Candidato 2: el espectro de Walsh del Rey Wen (77,4% en órdenes pares) · SELLO CON NOTA

**Encontrado**: Schöter y la tradición del "Boolean I Ching" aplican álgebra booleana a hexagramas (operaciones, no espectros de la ordenación). Petoukhov (2017) asocia matrices de Hadamard/Walsh con las tablas del I Ching en un contexto de código genético (dirección numerológica, sin análisis espectral de la secuencia del Rey Wen). La asimetría de pares de Chan (2026) es el primo en dominio temporal de nuestro hallazgo espectral. **Nadie calcula el espectro de Walsh de la ordenación del Rey Wen ni establece el vínculo 77,4% en órdenes pares con la regla de pares.**

**Nota propuesta**: "Búsqueda 2026-07-25: Walsh y I Ching aparecen asociados en la literatura (Petoukhov 2017, contexto genético-numerológico; Schöter, álgebra de hexagramas), y Chan (2026) detecta la asimetría de pares en dominio temporal; el espectro de Walsh de la ordenación del Rey Wen y su concentración en órdenes pares como confirmación espectral de la regla de pares no aparecen publicados."

## Candidato 3: el ARI entre palacios y cosets (−0,125) · SELLO

**Encontrado**: literatura descriptiva abundante sobre los Ocho Palacios (Mesker 2002, glosarios, comparaciones de órdenes en Yijing Dao y sitios afines), incluida la observación cualitativa de que los inicios de octetos de Mawangdui coinciden en parte con los palacios. **Nadie aplica métricas de comparación de particiones (índice de Rand ajustado ni equivalentes) entre la partición de palacios y la partición algebraica en cosets.**

**Nota propuesta**: "Búsqueda 2026-07-25: existe literatura estructural sobre los palacios de Jing Fang (Mesker 2002; comparaciones en Yijing Dao) pero ninguna comparación cuantitativa de particiones; el ARI = −0,125 entre palacios y cosets del subgrupo de puros no aparece publicado."

## Candidato 4: el empate 1013/1008/1008 y los costos en líneas · SELLO CON NOTA

**Encontrado**: comparaciones cualitativas y visuales entre órdenes (Yijing Dao compara Rey Wen, Fu Xi, Mawangdui y palacios; Cottrell los grafica; Cook 2006 propone una derivación combinatoria del Rey Wen citada por Wikipedia). Yijing Dao afirma que el orden de Mawangdui "probablemente no tiene gran significado matemático". **Nadie cuantifica distancias entre los órdenes históricos y el conteo binario (inversiones de Kendall ni costos en líneas), y el empate 1013/1008/1008 no aparece en ninguna parte.**

**Nota propuesta**: "Búsqueda 2026-07-25: las comparaciones publicadas entre órdenes históricos son cualitativas o visuales (Yijing Dao; Cottrell; Cook 2006 como intento de derivación del Rey Wen); la métrica de inversiones respecto del conteo binario, el empate 1013/1008/1008 y la tabla de costos en líneas no aparecen publicados."

## Ficha nueva requerida (verificada hoy, para citar en la ampliación del 19)

[chan2026] Chan, A. (2026). Statistical properties of the King Wen sequence: An anti-habituation structure that does not improve neural network training [Preprint]. arXiv. https://arxiv.org/abs/2604.09234

## Resumen

- Sellos a conceder: 3 (espectro-walsh, comparador-particiones, permutacion), todos con nota y fecha; el conteo congelado pasa de 1 a 4.
- Sello denegado por ahora: rey-wen-aleatorio (antecedente directo: Chan 2026); en su lugar, ampliación de diálogo con el análisis condicional de esta tabla, y reevaluación futura.
- Toussaint (ritmos euclidianos) queda pendiente para la siguiente ronda de verificación de fichas.
