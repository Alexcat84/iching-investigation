# Registro de aplicabilidad: teoremas y dominios frente al I Ching

**Documento vivo.** Registra todo lo evaluado para el laboratorio: lo construido, lo aprobado, lo en exploración y lo rechazado, con su porqué. Crece con cada candidato nuevo; ninguna entrada se borra (un rechazo documentado también enseña). Última actualización: 24 de julio de 2026.

## Estados y gobernanza

- 🟢 **CONSTRUIDO**: publicado en el sitio con aserciones en la suite (se indica el slug).
- 🔵 **APROBADO**: verificado externamente (cálculo independiente o ficha), pendiente de construir.
- 🟡 **EN EXPLORACIÓN**: la conexión parece real pero falta verificación, enunciado preciso o ficha.
- 🔴 **RECHAZADO**: no produce afirmaciones asertables ni documentables; se registra el porqué.
- ⚪ **EN ESPERA**: depende de otra pieza aún no construida.

Transiciones: 🟡→🔵 exige verificación externa (cálculo reproducido de cero o ficha verificada en línea); 🔵→🟢 exige construcción con aserciones; 🔴 es permanente salvo que aparezca un teorema nuevo. Regla heredada del sitio: aplica = produce afirmaciones tipo teorema o cálculo asertables, o tradición con ficha APA. No aplica = solo metáfora o numerología.

## 1. Análisis y señales

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Fourier sobre grupos finitos (Walsh-Hadamard) | 🟢 espectro-walsh | Sí | Es literalmente el análisis de Fourier del grupo (Z/2)⁶; la matriz es H⊗6 (verificado matricialmente) |
| Fourier del círculo (DFT sobre Z/64) | 🟢 fourier-anillo | Sí | El anillo de Shao Yong es Z/64; la DFT descompone secuencias en armónicos cíclicos; Parseval asertable |
| Transformada de Haar (wavelets) | 🔵 | Sí | Base clásica de 64 puntos; localiza dónde cambia una señal; complementa a Walsh |
| Transformada de Laplace | 🔴 | No | Exige tiempo continuo, inexistente en el I Ching; su pariente discreto legítimo es la matriz de transferencia (ver 4) |

## 2. Álgebra y espectros

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Teoría espectral de operadores | 🟢 bosque-nuclear, matriz-nuclear | Sí | El hu gua es lineal sobre F2; rangos 6→4→2, M⁴=M², todo asertado |
| Espectro del hipercubo Q6 | 🟢 espectro-q6 (tanda 1) | Sí | Autovalores 6−2k con multiplicidad C(6,k), verificado; las multiplicidades son los niveles de yang |
| Perron-Frobenius | 🟢 markov-consultas (nombrado en tanda 1) | Sí | Garantiza la estacionaria única; autovalor 1 simple verificado (segundo módulo 0,5) |
| Teorema de Lucas (Pascal mod 2) | 🟢 grupo-sierpinski | Sí | Verificado sobre las 4096 celdas; ficha bibliográfica pendiente de verificación |
| Análisis de funciones booleanas (influencias) | 🟢 influencias-lineas | Sí | Toda propiedad de hexagramas es una función booleana de 6 variables; influencias computadas y verificadas: para "sin dos yin", las líneas 2 y 5 influyen más (22/64) y las extremas menos (10/64) |

## 3. Probabilidad e información

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Cadenas de Markov | 🟢 markov-consultas | Sí | Forma cerrada asertada; Kun 729x Qian bajo milenrama |
| Entropía de Shannon | 🟢 entropia-oraculo (tanda 1) | Sí | Monedas 1,8113 bits/línea vs milenrama 1,7490; hexagrama = 6 bits exactos; ficha shannon1948 verificada |
| Codificación de Huffman | 🟢 entropia-oraculo (sección Huffman) | Sí | Código óptimo computable por método; verifica el teorema de codificación en vivo (milenrama 29/16 = 1,8125 bits esperados; monedas 30/16 = 1,875) |
| Teorema central del límite | 🟡 | Probable | Campana emergiendo de tiradas; ilustración más que hallazgo; baja prioridad |
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
| Seis qubits (Hadamard tensorial) | 🔵 con descargo blindado | Sí, como identidad formal | H⊗6 verificado; el descargo debe excluir toda afirmación cuántica sobre el oráculo |
| "Quantum I Ching", caos como explicación del oráculo, relatividad | 🔴 | No | Sin conexión demostrable con la estructura; metáfora pura |

## 6. Geometría y grafos

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Hipercubo Q6, retículo B6, proyecciones | 🟢 base del sitio | Sí | Estructura madre de todo el laboratorio |
| Bipartición por paridad | 🟢 cubo-dice-no | Sí | 32/32 por paridad de yang; toda arista cruza mitades (verificado); Q6 es bipartito |
| Códigos correctores y teoremas de imposibilidad | 🟢 cubo-dice-no | Sí | Cota de Hamming: a lo sumo 9 palabras; máximo exacto = 8, computado por búsqueda exhaustiva propia; primer teorema de imposibilidad del sitio |
| Característica de Euler y f-vector del hexeracto | 🔵 | Sí | Conteo de caras del 6-cubo; extensión del exp. 24 |
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
| John Cage, Music of Changes (1951) | 🟡 ficha por verificar | Sí, como historia documentada | Composición real con operaciones de azar del I Ching; página de referencia tipo Leibniz |
| Geometría de los ritmos (collares, ritmos euclidianos) | 🟡 | Probable | Un ritmo de 6 pulsos es un hexagrama sonando; conecta con Pólya; falta ficha (Toussaint) y enunciado |

## 9. Otras civilizaciones

| Entrada | Estado | ¿Aplica? | Por qué |
|---|---|---|---|
| Prosodia sánscrita (Pingala, Virahanka, Hemachandra) | 🟡 ficha por verificar (Singh 1985, Historia Mathematica) | Sí | Contar sílabas cortas y largas sin restricción es EXACTAMENTE el problema del exp. 29 con yin y yang; los números "de Fibonacci" nacieron ahí, siglos antes de Fibonacci; sería la ampliación histórica del 29 |

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
