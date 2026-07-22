# Evidencias de soporte y bibliografía verificada

Documento de respaldo para el sistema de fundamentos del laboratorio. Cada ficha bibliográfica de la sección B fue verificada en línea el 22 de julio de 2026 contra catálogos, editoriales o bases académicas (se indica cómo). Regla de oro heredada del sitio: ninguna afirmación sin respaldo; y regla nueva de este documento: **ninguna referencia citada de memoria**. Lo que no está aquí verificado, se verifica antes de commitear o no se cita.

## A. Los cinco tipos de afirmación y su respaldo

1. **Teorema matemático**: respaldo = demostración + aserción en scripts/experimentos.py. La fuente es el propio laboratorio y eso es legítimo si la verificación es visible.
2. **Cálculo propio**: respaldo = método declarado (algoritmo, N, semilla) + sección de la suite que lo reproduce.
3. **Tradición histórica documentada**: respaldo = fuente académica o primaria (ficha de la sección B).
4. **Reconstrucción académica**: igual que 3, declarando que es reconstrucción, no dato directo.
5. **Analogía con descargo**: respaldo = el isomorfismo formal + declaración explícita de lo que NO se afirma.

## B. Bibliografía núcleo (verificada, formato APA 7.ª edición)

Norma de estilo: las referencias completas siguen APA 7 (autor-fecha; título del artículo en redonda y de la obra en cursiva; revista con volumen en cursiva y número entre paréntesis; DOI como URL). Las citas en el texto del sitio usan el formato autor-fecha: (Nielsen, 2003), (Ryan, 1996). Los rangos de páginas y de años usan guion medio (en dash), como manda APA: es un uso convencional legítimo. La regla del proyecto contra guiones aplica al guion largo como recurso estilístico de prosa, no a las convenciones tipográficas de las normas de cita.

**[shaughnessy1996]** Shaughnessy, E. L. (1996). *I Ching: The classic of changes: The first English translation of the newly discovered second-century B.C. Mawangdui texts*. Ballantine Books. ISBN 0-345-36243-8.
Verificación: ficha de la Library of Congress reproducida en el propio libro y reseñas académicas (Philosophy East and West; Yijing Dao). Evidencia de soporte: el manuscrito de Mawangdui fue desenterrado en 1973 y es el primer manuscrito nuevo de la obra en dos mil años; a diferencia del texto recibido, sus hexagramas están, en palabras de la descripción editorial, "arranged in a systematic and logical way", con nombres distintos en muchos casos. Fundamenta: el orden de Mawangdui del experimento 09 (tipo 4: reconstrucción académica) y las variantes textuales como extensión futura.

**[nielsen2003]** Nielsen, B. (2003). *A companion to Yi jing numerology and cosmology: Chinese studies of images and numbers from Han (202 BCE–220 CE) to Song (960–1279 CE)*. RoutledgeCurzon. ISBN 0-7007-1608-4 (rústica 2015: 978-1-138-86267-8).
Verificación: ficha de Routledge, reseñas en Journal of Chinese Philosophy y BSOAS. Evidencia de soporte: es la obra de referencia en lengua occidental para la tradición xiangshu ("imagen y número"), organizada como enciclopedia; cubre expresamente los términos técnicos que el sitio usa: los ocho palacios (bagong), las almas errantes y que regresan (you hun / gui hun gua), y los hexagramas de flujo y reflujo (xiaoxi gua, los 12 soberanos) con su asociación calendárica de la era Han. Fundamenta: experimentos 02 (palacios), 28 (calendario de los soberanos), y la parte histórica del 09 (tipo 3).

**[ryan1996]** Ryan, J. A. (1996). Leibniz' binary system and Shao Yong's "Yijing". *Philosophy East and West, 46*(1), 59–90. https://doi.org/10.2307/1399337
Verificación: PhilPapers, Semantic Scholar y bibliografías de Springer/Cambridge. Evidencia de soporte: el artículo estudia el episodio en que Leibniz reconoció en el diagrama de Fu Xi una "de facto representation of the binary number system"; la posición académica dominante, que el sitio adopta, es que no existió una aritmética binaria olvidada en la China antigua, y que la coincidencia estructural se explica por la progresión geométrica doble que tanto Shao Yong como Leibniz comprendieron. Fundamenta: el descargo central del sitio (los chinos no practicaban binario) y los experimentos 08, 14 y la página de Leibniz (tipo 3).

**[leibniz1703]** Leibniz, G. W. (1703). Explication de l'arithmétique binaire. *Mémoires de l'Académie Royale des Sciences*, año 1703. (Sin páginas: no verificadas; no citar números de página).
Verificación de cronología (Journal of East-West Thought, artículo académico sobre el desarrollo de la aritmética binaria de Leibniz): Bouvet comunicó a Leibniz la analogía entre los hexagramas del Xiantiantu de Shao Yong y la diádica en carta fechada el 4 de noviembre de 1701, adjuntando los diagramas circular y cuadrado; Leibniz no recibió esa carta hasta el 1 de abril de 1703, y su artículo, su única publicación sobre aritmética binaria, apareció en 1703. Corrección de precisión para el copy del sitio: la fecha "circa 1701" corresponde al envío de Bouvet; la recepción y la publicación son de 1703. Fundamenta: página de Leibniz y experimento 08 (tipo 3).

**[debruijn1946]** de Bruijn, N. G. (1946). A combinatorial problem. *Koninklijke Nederlandse Akademie van Wetenschappen, 49*, 758–764.
Verificación: citada de forma consistente en la literatura revisada (arXiv, actas). Nota de honestidad histórica opcional para el copy: el propio de Bruijn publicó en 1975 un reconocimiento de prioridad a C. Flye Sainte-Marie (1894) por el conteo de estos arreglos circulares. Fundamenta: experimento 17 (tipo 3 para la historia, tipo 1 para las propiedades).

**[fkm1978]** Fredricksen, H., & Maiorana, J. (1978). Necklaces of beads in k colors and k-ary de Bruijn sequences. *Discrete Mathematics, 23*(3), 207–210. https://doi.org/10.1016/0012-365X(78)90002-X
Verificación: Scilit/Elsevier con DOI, más literatura secundaria (Moreno 2004 y su corrigendum). Evidencia de soporte: el teorema FKM demuestra que la concatenación de las palabras de Lyndon de longitud divisora de n en orden lexicográfico produce una secuencia de De Bruijn, y que es la mínima lexicográfica. Es exactamente el algoritmo que implementa debruijn.ts. Fundamenta: experimento 17 (la construcción canónica es teorema con fuente, tipo 1 + 3).

**[oeis-a003042]** OEIS Foundation Inc. (s.f.). *Sequence A003042: Number of Hamiltonian cycles on n-cube*. The On-Line Encyclopedia of Integer Sequences. https://oeis.org/A003042
Ya citada en el experimento 24 y verificada en esa entrega. Fundamenta: los conteos citados sin reproducir dígitos.

**[knuth4a]** Knuth, D. E. (2011). *The art of computer programming: Vol. 4A. Combinatorial algorithms, Part 1*. Addison-Wesley.
Verificación: citada de forma consistente en la literatura revisada de secuencias De Bruijn. Fundamenta: referencia general para códigos Gray y secuencias De Bruijn (opcional, tipo 3).

**[wilhelm]** Wilhelm, R. (1924). *I Ging: Das Buch der Wandlungen*. Eugen Diederichs. [Versión castellana: Vogelmann, D. J. (Trad.). (1975). *I Ching: El libro de las mutaciones*. Sudamericana.]
⚠ PENDIENTE DE VERIFICACIÓN FINAL: la ficha alemana y la existencia de la versión de Vogelmann son sólidas, pero la edición y año exactos de la castellana deben confirmarse en línea antes de commitear la ficha. Fundamenta: los nombres en español de los hexagramas usados en todo el sitio (tipo 3).

## C. Evidencias por bloque temático (afirmación → tipo → respaldo)

**Bloque binario y Fu Xi** (exps. 01, 07, 08, 13, 14, 17)
- "Los 64 hexagramas se corresponden biyectivamente con los enteros 0-63" → tipo 1 → suite (biyección verificada) + [ryan1996] para el contexto histórico.
- "La secuencia Fu Xi es el conteo binario" → tipo 1 (la identidad estructural) + tipo 3 (la atribución a Shao Yong): [ryan1996], [leibniz1703].
- "Los chinos no practicaban aritmética binaria; Shao Yong buscaba cosmología" → tipo 3 → [ryan1996] (posición académica dominante).
- Cronología Bouvet-Leibniz → tipo 3 → [leibniz1703] con las fechas verificadas de la sección B.

**Bloque Mawangdui** (exp. 09)
- "El orden de Mawangdui organiza los 64 por trigrama superior con regla fija de inferiores" → tipo 4 (reconstrucción) → [shaughnessy1996]. El copy ya lo dice; el fundamento lo formaliza.
- Métricas (1008 inversiones, orden 600) → tipo 2 → suite, sección de la carrera de los órdenes.

**Bloque Jing Fang y palacios** (exps. 02, 09)
- "El sistema de los ocho palacios se atribuye a Jing Fang (siglo I a.C.), con el orden bagong Qian, Zhen, Kan, Gen, Kun, Xun, Li, Dui y las generaciones puro → 1-5 mundos → alma errante → alma que regresa" → tipo 3 → [nielsen2003] (entradas bagong, you hun, gui hun).
- Métricas del palacio como permutación → tipo 2 → suite.

**Bloque calendario de los soberanos** (exp. 28)
- "Los 12 bi gua / xiaoxi gua se asociaron a los 12 meses lunares en la tradición Han (Meng Xi, gua qi)" → tipo 3 → [nielsen2003] (entradas xiaoxi gua, gua qi, Meng Xi).
- Las cuatro propiedades geométricas (ciclo Gray, línea que avanza, antípodas dui, caracterización monótona) → tipo 1 → suite, sección 29.

**Bloque serpiente De Bruijn** (exp. 17)
- "Existe un anillo de 64 bits que contiene los 64 hexagramas exactamente una vez" → tipo 1 → suite + [debruijn1946].
- "La construcción canónica usada es la FKM (mínima lexicográfica)" → tipo 1 con fuente → [fkm1978].
- Conteo 2^26 → tipo 1 → suite (fórmula) + [debruijn1946].

**Bloque probabilidades del oráculo** (exps. 04, 10, 20, 21)
- "Las probabilidades de la milenrama son 1/16, 5/16, 7/16, 3/16 bajo el supuesto de restos uniformes" → tipo 2 → derivación propia del procedimiento del Gran Comentario (Xici), asertada en la suite; el procedimiento mismo → tipo 3 → [wilhelm] (una vez verificada la ficha).
- La cadena de Markov y su estacionaria → tipo 2 → forma cerrada asertada.
- ⚠ El método de las 16 fichas: NO citar autoría de memoria. Antes de atribuirlo (la atribución habitual es a literatura de práctica de los años 70), verificar la fuente en línea; mientras tanto el copy debe decir "método moderno equivalente" sin nombre propio.

**Bloque teoremas puros** (exps. 05, 12, 13, 15, 16, 18, 22, 23, 25)
- Todo lo de estos experimentos es tipo 1 o 2: el respaldo es la sección de suite correspondiente, y el bloque de fundamento debe enlazarla por nombre. [knuth4a] como lectura general opcional.

**Bloque analogías** (exp. 27)
- Correspondencia con codones → tipo 5 → código genético estándar (NCBI, ya citado en el experimento) + descargo de arbitrariedad de la codificación (las 24 asignaciones, ya implementado).

## D. Huecos conocidos (no citar hasta resolver)

1. Ficha exacta de la edición castellana de Wilhelm/Vogelmann.
2. Autoría del método de las 16 fichas.
3. Números de página de la Explication de Leibniz.
4. Cualquier fuente nueva que un experimento futuro necesite: pasa por este documento primero.
