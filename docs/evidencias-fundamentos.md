# Evidencias de soporte y bibliografía verificada

Documento de respaldo para el sistema de fundamentos del laboratorio. Cada ficha bibliográfica de la sección B fue verificada en línea el 22 y el 23 de julio de 2026 contra catálogos, editoriales o bases académicas (se indica cómo). Regla de oro heredada del sitio: ninguna afirmación sin respaldo; y regla nueva de este documento: **ninguna referencia citada de memoria**. Lo que no está aquí verificado, se verifica antes de commitear o no se cita.

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

**[oeis-a000045]** OEIS Foundation Inc. (s.f.). *Sequence A000045: Fibonacci numbers*. The On-Line Encyclopedia of Integer Sequences. https://oeis.org/A000045
Verificación: consultada en línea el 23 de julio de 2026 vía la API de OEIS; nombre "Fibonacci numbers: F(n) = F(n-1) + F(n-2) with F(0) = 0 and F(1) = 1" y términos 0, 1, 1, 2, 3, 5, 8, 13, 21 confirmados. Fundamenta: experimento 29 (los supervivientes por regla son 21 = F(8) y la escalera es F(n+2)), como fuente complementaria de la sucesión (tipo 1 con fuente).

**[oeis-a000032]** OEIS Foundation Inc. (s.f.). *Sequence A000032: Lucas numbers*. The On-Line Encyclopedia of Integer Sequences. https://oeis.org/A000032
Verificación: consultada en línea el 23 de julio de 2026 vía la API de OEIS; nombre "Lucas numbers beginning at 2: L(n) = L(n-1) + L(n-2), L(0) = 2, L(1) = 1" y términos 2, 1, 3, 4, 7, 11, 18 confirmados. Fundamenta: experimento 29 (la versión circular da 18 = L(6)), como fuente complementaria (tipo 1 con fuente).

**[shannon1948]** Shannon, C. E. (1948). A mathematical theory of communication. *Bell System Technical Journal, 27*(3), 379–423. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
Verificación: Crossref el 23 de julio de 2026 (título "A Mathematical Theory of Communication", Bell System Technical Journal, vol. 27(3), páginas 379-423, 1948); la segunda parte es 27(4), 623-656. Evidencia de soporte: introduce la entropía H = menos la suma de p log p como medida de información y, en su primera página, la palabra "bit". Fundamenta: experimento 31 (la entropía del oráculo), tipo 1 con fuente.

**[ising1925]** Ising, E. (1925). Beitrag zur Theorie des Ferromagnetismus. *Zeitschrift für Physik, 31*, 253–258. https://doi.org/10.1007/BF02980577
Verificación: Crossref el 23 de julio de 2026 (título "Beitrag zur Theorie des Ferromagnetismus", Zeitschrift für Physik, vol. 31, páginas 253-258, 1925). Evidencia de soporte: el modelo, planteado por Lenz en 1920, lo resuelve Ising en 1925 en una dimensión y demuestra que en 1D no hay transición de fase. Fundamenta: experimento 30 (el hexagrama como cadena de espines), tipo 1 con fuente.

**[singh1985]** Singh, P. (1985). The so-called Fibonacci numbers in ancient and medieval India. *Historia Mathematica, 12*(3), 229–244. https://doi.org/10.1016/0315-0860(85)90021-7
Verificación: Crossref el 24 de julio de 2026 (título, Historia Mathematica, vol. 12(3), páginas 229-244, 1985). Evidencia de soporte: documenta que la sucesión que en Occidente se llama de Fibonacci fue formulada antes en la prosodia india (Virahanka, Gopala, Hemachandra) al contar metros de sílabas cortas y largas. Fundamenta: experimento 37 (los poetas que contaron primero), tipo 3.

**[lucas1878]** Lucas, É. (1878). Théorie des fonctions numériques simplement périodiques. *American Journal of Mathematics, 1*, 184–240, 289–321. https://doi.org/10.2307/2369373
Verificación: Crossref el 24 de julio de 2026 (título, American Journal of Mathematics, vol. 1, 1878). Evidencia de soporte: la memoria donde Lucas desarrolla las funciones numéricas periódicas, marco del teorema de Lucas sobre coeficientes binomiales módulo p. Fundamenta la insignia del experimento 18 (grupo Sierpinski), tipo 3.

**[terras1999]** Terras, A. (1999). *Fourier analysis on finite groups and applications* (London Mathematical Society Student Texts 43). Cambridge University Press. ISBN 978-0-521-45718-7.
Verificación: ficha de Cambridge University Press y OpenLibrary el 24 de julio de 2026 (título, autora Audrey Terras, CUP, LMS Student Texts 43, 1999). Evidencia de soporte: texto de referencia del análisis de Fourier sobre grupos finitos, que cubre tanto los grupos abelianos (Z/2)⁶ y Z/64 como los caracteres. Fundamenta las insignias de los experimentos 23 (Walsh-Hadamard) y 34 (DFT), tipo 3.

**[pritchett1993]** Pritchett, J. (1993). *The music of John Cage* (Music in the Twentieth Century 5). Cambridge University Press. ISBN 978-0-521-56544-8.
Verificación: ficha de Cambridge University Press y OpenLibrary el 24 de julio de 2026 (título, autor James Pritchett, CUP, Music in the Twentieth Century 5; la ISBN corresponde a la rústica del original de 1993). Evidencia de soporte: estudio académico del método compositivo de Cage con el I Ching y las tiradas de monedas, incluida Music of Changes (1951). Fundamenta: experimento 38 (Cage: la música del azar), tipo 3.

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

**Bloque Fibonacci en el hexagrama** (exp. 29)
- "Los hexagramas sin dos yin consecutivos (y, por simetría, sin dos yang) son exactamente 21 = F(8); contando por número de líneas, la escalera es 2, 3, 5, 8, 13, 21 = F(n+2)" → tipo 1 → suite (verificar_fibonacci) + [oeis-a000045] para la sucesión.
- "La versión circular (la línea 6 vecina de la 1) da 18 = L(6)" → tipo 1 → suite + [oeis-a000032].
- "La intersección de ambas reglas (alternancia perfecta) son exactamente Ji Ji y Wei Ji, y el desglose de los 21 por número de líneas yin es 1, 6, 10, 4 = C(7-k, k), la identidad de Fibonacci como suma de diagonales del triángulo de Pascal (conecta con el experimento 18)" → tipo 1 → suite. Descargo: es un teorema de conteo, no un código oculto; la numerología de Fibonacci y la razón áurea en el I Ching queda fuera por indemostrable.

**Bloque probabilidades del oráculo** (exps. 04, 10, 20, 21)
- "Las probabilidades de la milenrama son 1/16, 5/16, 7/16, 3/16 bajo el supuesto de restos uniformes" → tipo 2 → derivación propia del procedimiento del Gran Comentario (Xici), asertada en la suite; el procedimiento mismo → tipo 3 → [wilhelm] (una vez verificada la ficha).
- La cadena de Markov y su estacionaria → tipo 2 → forma cerrada asertada.
- ⚠ El método de las 16 fichas: NO citar autoría de memoria. Antes de atribuirlo (la atribución habitual es a literatura de práctica de los años 70), verificar la fuente en línea; mientras tanto el copy debe decir "método moderno equivalente" sin nombre propio.

**Bloque teoremas puros** (exps. 05, 12, 13, 15, 16, 18, 22, 23, 25)
- Todo lo de estos experimentos es tipo 1 o 2: el respaldo es la sección de suite correspondiente, y el bloque de fundamento debe enlazarla por nombre. [knuth4a] como lectura general opcional.

**Bloque analogías** (exp. 27)
- Correspondencia con codones → tipo 5 → código genético estándar (NCBI, ya citado en el experimento) + descargo de arbitrariedad de la codificación (las 24 asignaciones, ya implementado).

**Bloque Ising** (exp. 30)
- "Un hexagrama es una cadena de 6 espines; con la matriz de transferencia T (beta = 0,7, J = 1) la función de partición abierta es 1ᵀT⁵1 = 199,384322 y la periódica Tr(T⁶) = 262,456561; con beta a cero, Z tiende a 64 y la distribución es uniforme" → tipo 1 → suite (verificar_ising) + [ising1925].
- "A temperatura baja con J positivo dominan Qian y Kun al 50/50, y con J negativo Ji Ji y Wei Ji; la restricción dura (sin yin-yin adyacente) reproduce F(8) en cadena y L(6) en anillo, con autovalor dominante phi" → tipo 1 → suite. Conecta con el exp. 29 (misma matriz de transferencia).
- "En 1D no hay transición de fase (Ising 1925): la cadena se ordena gradualmente al enfriar, no de golpe" → tipo 3 → [ising1925]. La conexión con el I Ching es identidad de estructura, no una afirmación física sobre el oráculo.

**Bloque entropía del oráculo** (exp. 31)
- "Un hexagrama uniforme son exactamente 6 bits (el máximo para 64 estados); una línea de monedas tiene 1,8113 bits de entropía y una de milenrama 1,7490, una diferencia de 0,0623 que vive toda en el movimiento, porque el valor yin/yang puro es 1 bit en ambos métodos" → tipo 1 → suite (verificar_entropia) + [shannon1948].
- "La estacionaria de la cadena de milenrama tiene 4,8677 = 6 por H(1/4) bits, contra los 6 de la uniforme de monedas" → tipo 1 → suite + [shannon1948].

**Bloque matriz de transferencia** (exp. 32)
- "Cada regla de adyacencia entre líneas es una matriz 2x2; sus potencias dan los conteos por número de líneas, su traza los conteos cíclicos y su autovalor dominante la razón de crecimiento (phi para las reglas de Fibonacci, 2 para la libre, 1 para la alternancia)" → tipo 1 → suite (verificar_transferencia).
- "Los hexagramas balanceados (tres yang, tres yin) donde el yang nunca va por detrás del yin son exactamente C₃ = 5, los valores 42, 44, 50, 52 y 56" → tipo 1 → suite. Es la transformada z del conteo; la de Laplace no aplica (no hay tiempo continuo en el I Ching), y eso se dice.

**Bloque espectro del hipercubo** (exp. 33)
- "Los autovalores de la matriz de adyacencia de Q6 son 6 menos 2k con multiplicidad C(6,k): {6:1, 4:6, 2:15, 0:20, -2:15, -4:6, -6:1}; las multiplicidades son los niveles de yang del retículo B6 (exp. 13) y el espectro del paseo simple (exp. 25) es este dividido por 6" → tipo 1 → suite (verificar_espectro_q6).

**Bloque prosodia sánscrita** (exp. 37)
- "La prosodia sánscrita cuenta los metros de duración n hechos de sílabas cortas (1) y largas (2), y la cuenta cumple C(n) = C(n-1) + C(n-2): 1, 2, 3, 5, 8, 13, 21, los números de Fibonacci, formulados por Virahanka, Gopala y Hemachandra siglos antes de Fibonacci" → tipo 3 → [singh1985].
- "Las 21 figuras de 6 líneas sin dos yin seguidos están en biyección con los 21 metros de duración 7 (añadir un yang centinela, emparejar cada yin con el yang superior como sílaba larga)" → tipo 1 → suite (verificar_prosodia). Teorema propio del experimento, verificado enumerando ambos lados.

**Bloque Cage** (exp. 38)
- "A fines de 1950 Cage recibió el I Ching, construyó cartas de 64 valores indexadas por los hexagramas y las seleccionó con tiradas de monedas; Music of Changes (1951) es la obra fundacional de la composición por azar" → tipo 3 → [pritchett1993]. Descargo interdisciplinar: se documenta el método, no la obra; la demo usa una carta propia y el motor de monedas del exp. 21, y no reproduce partituras ni fragmentos de Cage (copyright).

**Bloque transformada de Haar** (exp. 39)
- "La base de Haar es la otra base ortogonal clásica de 64 puntos, hermana de Walsh: sus 64 filas son ortogonales (matriz de Gram diagonal) aunque de normas distintas, la reconstrucción es exacta y Parseval se cumple con esas normas" → tipo 1 → suite (verificar_haar). Teorema clásico nombrado (base de Haar); ficha pendiente (sección D).
- "Aplicada a la secuencia del Rey Wen, los coeficientes de Haar localizan dónde cambia el libro; los mayores viven en la escala de los bloques de trigramas (los tramos [0, 16) y [48, 64)) y se congelan" → tipo 2 → suite. Es la misma señal de Walsh y del Fourier del anillo, en la recta 0..63.

**Bloque seis qubits** (exp. 40)
- "Un hexagrama es un estado de la base computacional de 6 qubits, y la transformada de Walsh del sitio es la puerta de Hadamard H⊗6 (exp. 23); aplicada a |Kun⟩ = |000000⟩ da la superposición uniforme de los 64 hexagramas con amplitud 1/8 y probabilidad 1/64" → tipo 1 → suite (verificar_qubits). Descargo blindado: identidad matemática entre transformadas y estados; ninguna afirmación cuántica sobre el oráculo, y el "quantum I Ching" comercial está en el registro de aplicabilidad como rechazado. Teorema clásico nombrado (transformada de Hadamard); ficha pendiente (sección D).
- "La transformación normalizada es unitaria (H·Hᵀ = I): preserva normas" → tipo 1 → suite (verificar_qubits).

**Bloque caras del hexeracto** (exp. 41)
- "Las caras del 6-cubo son los hexagramas parciales (palabras sobre yin, yang e indeterminado); el número de caras de dimensión k es f_k = C(6,k)·2^(6-k), verificado por fórmula y por enumeración directa de {0,1,*}^6; el f-vector es 64, 192, 240, 160, 60, 12, 1" → tipo 1 → suite (verificar_hexeracto). Teorema nombrado (f-vector del politopo); ficha pendiente (sección D).
- "Las caras suman 3^6 = 729 (la generatriz (2+x)^6), el mismo número que el cociente Kun/Qian de la cadena de Markov; la característica de Euler es 0 en la frontera (una 5-esfera) y 1 en el sólido entero (contráctil)" → tipo 1 → suite. Teorema nombrado (característica de Euler-Poincaré); ficha pendiente (sección D).

**Bloque paseo aleatorio, la campana** (exp. 25, ampliación)
- "La estacionaria del número de yang del caminante es exactamente la binomial C(6,k)/64; con 200000 pasos y semilla fija la desviación máxima entre las frecuencias y la binomial queda bajo 0,003 (0,0008 con semilla 99)" → tipo 1 → suite (verificar_paseo). Teorema clásico nombrado (ley de los grandes números); ficha pendiente (sección D).

## D. Huecos conocidos (no citar hasta resolver)

1. Ficha exacta de la edición castellana de Wilhelm/Vogelmann.
2. Autoría del método de las 16 fichas.
3. Números de página de la Explication de Leibniz.
4. Ficha del teorema de Perron-Frobenius: se nombra en el exp. 20 (Markov) como teorema con respaldo de suite, sin ficha aún.
5. Fichas de teoremas clásicos nombrados con respaldo de suite y sin ficha aún: el análisis de funciones booleanas y las influencias (exp. 35), la cota de empaquetado de Hamming y la enumeración de Pólya (exp. 36).
6. Fichas de los teoremas clásicos nombrados en la tanda 4, todos con respaldo de suite y sin ficha aún: la base de Haar (exp. 39), la transformada de Hadamard H⊗n (exp. 40), el f-vector del politopo y la característica de Euler-Poincaré (exp. 41), y la ley de los grandes números (ampliación del exp. 25).
7. Cualquier fuente nueva que un experimento futuro necesite: pasa por este documento primero.

Resueltas en la tanda 3 (salen de la lista): el teorema de Lucas (exp. 18) con [lucas1878]; el análisis de Fourier sobre grupos finitos (exp. 23) y la transformada discreta de Fourier (exp. 34), ambos con [terras1999]. La tanda 4 no añade fichas: sus teoremas se nombran con respaldo de suite y quedan en el hueco 6 de esta lista.
