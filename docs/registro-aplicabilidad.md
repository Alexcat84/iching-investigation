# Registro de aplicabilidad: teoremas y dominios frente al I Ching

**Documento vivo.** Registra todo lo evaluado para el laboratorio: lo construido, lo aprobado, lo en exploración y lo rechazado, con su porqué. Crece con cada candidato nuevo; ninguna entrada se borra (un rechazo documentado también enseña). Última actualización: 27 de julio de 2026.

## Estados y gobernanza

- 🟢 **CONSTRUIDO**: publicado en el sitio con aserciones en la suite (se indica el slug).
- 🔵 **APROBADO**: verificado externamente (cálculo independiente o ficha), pendiente de construir.
- 🟡 **EN EXPLORACIÓN**: la conexión parece real pero falta verificación, enunciado preciso o ficha.
- 🔴 **RECHAZADO**: no produce afirmaciones asertables ni documentables; se registra el porqué.
- ⚪ **EN ESPERA**: depende de otra pieza aún no construida.

Transiciones: 🟡→🔵 exige verificación externa (cálculo reproducido de cero o ficha verificada en línea); 🔵→🟢 exige construcción con aserciones; 🔴 es permanente salvo que aparezca un teorema nuevo. Regla heredada del sitio: aplica = produce afirmaciones tipo teorema o cálculo asertables, o tradición con ficha APA. No aplica = solo metáfora o numerología.

**Sellos de hallazgo propio (tanda 5, búsqueda 2026-07-25, en docs/informe-originalidad.md).** El conteo de sellos pasa de 1 a 4: se conceden a espectro-walsh (el espectro de Walsh de la ordenación del Rey Wen y su 77,4% en órdenes pares), comparador-particiones (el ARI = −0,125 entre palacios y cosets) y permutacion (el empate 1013/1008/1008 y los costos en líneas); ninguno aparece publicado. Nota (tanda 6): el reencuadre del 1008 refuerza el sello de permutacion sin tocar su busquedaNota, que es documentación histórica de la búsqueda; el 1008 es la esperanza exacta del azar (n(n-1)/4, desviación 86,3), así que el empate significa que los tres órdenes están a la distancia esperada del binario (ver hermandad-ordenes). El sello del test de aleatoriedad del Rey Wen (rey-wen-aleatorio) queda DENEGADO POR AHORA: Chan (2026), *Statistical properties of the King Wen sequence* (arXiv:2604.09234), es antecedente directo con cuatro propiedades significativas contra barajados libres. En su lugar se publica el diálogo condicional del experimento 19 (tres de esas cuatro propiedades son corolarios de la regla de pares; la cuarta, marginal), con ficha [chan2026]. Sello reevaluable en una búsqueda futura.

## 1. Análisis y señales

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Fourier sobre grupos finitos (Walsh-Hadamard) | 🟢 espectro-walsh · SELLO (tanda 5) | Sí | Es literalmente el análisis de Fourier del grupo (Z/2)⁶; la matriz es H⊗6 (verificado matricialmente); ficha terras1999; el 77,4% en órdenes pares es hallazgo propio |
| Fourier del círculo (DFT sobre Z/64) | 🟢 fourier-anillo | Sí | El anillo de Shao Yong es Z/64; la DFT descompone secuencias en armónicos cíclicos; Parseval asertable; ficha terras1999 |
| Transformada de Haar (wavelets) | 🟢 transformada-haar | Sí | Base ortogonal de 64 puntos hermana de Walsh; filas ortogonales (Gram diagonal) de normas distintas, reconstrucción exacta, Parseval con las normas; localiza dónde cambia el libro; coeficientes mayores congelados |
| Transformada de Laplace | 🔴 | No | Exige tiempo continuo, inexistente en el I Ching; su pariente discreto legítimo es la matriz de transferencia (ver 4) |

## 2. Álgebra y espectros

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Teoría espectral de operadores | 🟢 bosque-nuclear, matriz-nuclear | Sí | El hu gua es lineal sobre F2; rangos 6→4→2, M⁴=M², todo asertado |
| Espectro del hipercubo Q6 | 🟢 espectro-q6 (tanda 1) | Sí | Autovalores 6−2k con multiplicidad C(6,k), verificado; las multiplicidades son los niveles de yang |
| Perron-Frobenius | 🟢 markov-consultas (nombrado en tanda 1) | Sí | Garantiza la estacionaria única; autovalor 1 simple verificado (segundo módulo 0,5) |
| Teorema de Lucas (Pascal mod 2) | 🟢 grupo-sierpinski | Sí | Verificado sobre las 4096 celdas; ficha lucas1878 verificada (Crossref) |
| Análisis de funciones booleanas (influencias) | 🟢 influencias-lineas | Sí | Toda propiedad de hexagramas es una función booleana de 6 variables; influencias computadas y verificadas: para "sin dos yin", las líneas 2 y 5 influyen más (22/64) y las extremas menos (10/64) |

## 3. Probabilidad e información

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Cadenas de Markov | 🟢 markov-consultas | Sí | Forma cerrada asertada; Kun 729x Qian bajo milenrama |
| Entropía de Shannon | 🟢 entropia-oraculo (tanda 1) | Sí | Monedas 1,8113 bits/línea vs milenrama 1,7490; hexagrama = 6 bits exactos; ficha shannon1948 verificada |
| Codificación de Huffman | 🟢 entropia-oraculo (sección Huffman) | Sí | Código óptimo computable por método; verifica el teorema de codificación en vivo (milenrama 29/16 = 1,8125 bits esperados; monedas 30/16 = 1,875) |
| Teorema central del límite (ley de los grandes números) | 🟢 paseo-aleatorio (ampliación) | Sí | La estacionaria del número de yang es exactamente la binomial C(6,k)/64; la campana emerge de 200000 pasos con desviación bajo 0,003 (0,0008 con semilla 99); insignia LGN |
| Martingalas | 🟡 | Débil | Sin enunciado natural fuerte sobre consultas |

## 4. Combinatoria y teoría de números

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Fibonacci y Lucas | 🟢 fibonacci-hexagrama · SELLO DE HALLAZGO PROPIO | Sí | 21 = F(8), escalera F(n+2), circular 18 = L(6), intersección Ji Ji/Wei Ji; fichas OEIS verificadas |
| Números de Catalan | 🟢 dentro de matriz-transferencia (tanda 1) | Sí | Caminos de Dyck 3-3: exactamente C₃ = 5, valores 42, 44, 50, 52, 56 |
| Matriz de transferencia y funciones generatrices | 🟢 matriz-transferencia (tanda 1) | Sí | El método detrás de Fibonacci; autovalor dominante φ verificado |
| Enumeración de Pólya (collares) | 🟢 cubo-dice-no | Sí | 14 collares bajo rotación (fórmula = enumeración) y 13 pulseras con reflejo, verificados |
| Teorema chino del resto | ⚪ espera al najia | Sí, condicionado | El ciclo sexagenario es CRT sobre 10 y 12 (mcm 60); sin najia no hay dónde contarlo |
| Razón áurea escondida en el Rey Wen, primos, gematrías | 🔴 | No | Caza numerológica sin enunciado asertable; el 61,8% del trading pertenece aquí |

## 5. Física

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Modelo de Ising 1D | 🟢 ising-hexagrama (tanda 1) | Sí | Identidad de estructura: 6 espines, Boltzmann, misma matriz de transferencia; antiferro enfriado da Ji Ji/Wei Ji (verificado); ficha ising1925 verificada |
| Entropía termodinámica | 🟢 dentro del 30/31 | Sí | Curva de entropía frente a temperatura, gratis dentro de Ising |
| Seis qubits (Hadamard tensorial) | 🟢 seis-qubits | Sí, como identidad formal | H⊗6 = la transformada de Walsh; aplicada a Kun (000000) da la superposición uniforme (amplitud 1/8, prob 1/64) y es unitaria; descargo blindado activo (nada cuántico sobre el oráculo) |
| "Quantum I Ching", caos como explicación del oráculo, relatividad | 🔴 | No | Sin conexión demostrable con la estructura; metáfora pura |

## 6. Geometría y grafos

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Hipercubo Q6, retículo B6, proyecciones | 🟢 base del sitio | Sí | Estructura madre de todo el laboratorio |
| Bipartición por paridad | 🟢 cubo-dice-no | Sí | 32/32 por paridad de yang; toda arista cruza mitades (verificado); Q6 es bipartito |
| Códigos correctores y teoremas de imposibilidad | 🟢 cubo-dice-no | Sí | Cota de Hamming: a lo sumo 9 palabras; máximo exacto = 8, computado por búsqueda exhaustiva propia; primer teorema de imposibilidad del sitio |
| Característica de Euler y f-vector del hexeracto | 🟢 caras-hexeracto | Sí | f-vector 64, 192, 240, 160, 60, 12, 1 por fórmula y por enumeración de {0,1,*}⁶; suma 3⁶ = 729; Euler 0 (frontera, 5-esfera) y 1 (sólido contráctil) |
| Teorema de Ramsey | 🟡 | Tenue | R(3,3) = 6 permite un mini-enunciado, pero aún no habla de hexagramas de verdad |

## 7. Computación y criptografía

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Secuencias De Bruijn (FKM) | 🟢 serpiente-debruijn | Sí | Construcción canónica con fichas verificadas |
| Autómatas finitos y lenguajes regulares | 🟢 implícito en matriz-transferencia | Sí | Las reglas locales de líneas son lenguajes regulares; nombrable en el copy |
| LFSR y cifradores de flujo | 🟡 | Probable | Pariente directo de De Bruijn; falta el enunciado preciso sobre hexagramas |

## 8. Música y ritmo

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| John Cage, Music of Changes (1951) | 🟢 cage-musica-azar | Sí, como historia documentada | Método compositivo con I Ching y monedas; ficha pritchett1993 verificada; demo con carta propia, sin reproducir la obra (copyright) |
| Geometría de los ritmos (collares, ritmos euclidianos) | 🟡 | Probable | Un ritmo de 6 pulsos es un hexagrama sonando; conecta con Pólya; falta ficha (Toussaint) y enunciado |

## 9. Otras civilizaciones

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Prosodia sánscrita (Pingala, Virahanka, Hemachandra) | 🟢 prosodia-sanscrita | Sí | Los metros de sílabas cortas y largas dan Fibonacci siglos antes; biyección verificada entre las 21 figuras sin dos yin y los 21 metros de duración 7; ficha singh1985 verificada |

## 10. Tradición calendárica china

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Bi gua / xiao xi gua (12 soberanos) | 🟢 calendario-soberanos | Sí | Ciclo Gray anual; tradición con ficha nielsen2003 |
| Najia, Meihua Yishu, ciclo sexagenario | ⚪ | Sí, condicionado | Algoritmos históricos deterministas, implementables como "así calculaba esta escuela"; requieren fichas y construcción propia |

## 11. Psicología y recepción moderna

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Jung y la sincronicidad | 🟡 solo como referencia histórica | Parcial | Documentable como historia de la recepción (prólogo de Jung a Wilhelm); jamás como afirmación del sitio; exigiría el descargo más grande del laboratorio |

## 12. Mercados financieros

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| I Ching aplicado al trading | 🔴 | No | No existe teorema ni cálculo asertable; el único mecanismo documentable de los niveles "de Fibonacci" en mercados es la profecía autocumplida; se registra como ejemplo canónico de lo que el criterio excluye |

## 13. Biología

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Los 64 codones | 🟢 codones | Sí, como analogía con descargo | Isomorfismo combinatorio real; la codificación concreta es arbitraria (24 asignaciones) y el experimento lo demuestra |

## 14. Estructura de los órdenes históricos

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Hermandad de los órdenes (inversiones de Kendall) | 🟢 hermandad-ordenes | Sí | La esperanza de inversiones entre órdenes aleatorios es n(n-1)/4 = 1008 (desviación 86,3, teorema mahoniano verificado contra Monte Carlo); los tres históricos están a esa distancia del binario; entre sí, solo Rey Wen-Mawangdui se aparta del azar (759, z = −2,89, p Monte Carlo 0,003, sobrevive Bonferroni) |
| La pregunta del par (qué ordena cada par) | 🟢 pregunta-del-par | Sí | Micro-teorema: el volteo conserva el yang, así que "más yang primero" empata 28/28; ningún criterio binario probado (valor, líneas, suavizado) se aparta de una moneda; si hay regla, no vive en la estructura binaria (el texto queda fuera del alcance) |
| PROHIBIDO conceder sello en la tanda 6 | ⚪ | Pendiente | La búsqueda de originalidad de ambos experimentos se hará después, por separado |
