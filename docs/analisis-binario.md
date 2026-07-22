# El I Ching en binario: las dos secuencias

**Convención:** yang (línea entera) = 1, yin (línea partida) = 0. Las líneas se leen de abajo hacia arriba; la línea inferior es el bit más significativo (valor 32) y la superior el menos significativo (valor 1). Esta es la convención del ordenamiento de Shao Yong / Fu Xi que estudió Leibniz. Con ella, Kun (todo yin) = 000000 = 0 y Qian (todo yang) = 111111 = 63.

## Tabla 1: Secuencia del Rey Wen (orden tradicional) con su valor binario

| N° Rey Wen | Hexagrama | Nombre | Líneas (abajo→arriba) | Valor decimal |
|---|---|---|---|---|
| 1 | ䷀ | Qian 乾 (Lo Creativo) | 111111 | 63 |
| 2 | ䷁ | Kun 坤 (Lo Receptivo) | 000000 | 0 |
| 3 | ䷂ | Zhun 屯 | 100010 | 34 |
| 4 | ䷃ | Meng 蒙 | 010001 | 17 |
| 5 | ䷄ | Xu 需 | 111010 | 58 |
| 6 | ䷅ | Song 訟 | 010111 | 23 |
| 7 | ䷆ | Shi 師 | 010000 | 16 |
| 8 | ䷇ | Bi 比 | 000010 | 2 |
| 9 | ䷈ | Xiao Chu 小畜 | 111011 | 59 |
| 10 | ䷉ | Lü 履 | 110111 | 55 |
| 11 | ䷊ | Tai 泰 | 111000 | 56 |
| 12 | ䷋ | Pi 否 | 000111 | 7 |
| 13 | ䷌ | Tong Ren 同人 | 101111 | 47 |
| 14 | ䷍ | Da You 大有 | 111101 | 61 |
| 15 | ䷎ | Qian 謙 (Modestia) | 001000 | 8 |
| 16 | ䷏ | Yu 豫 | 000100 | 4 |
| 17 | ䷐ | Sui 隨 | 100110 | 38 |
| 18 | ䷑ | Gu 蠱 | 011001 | 25 |
| 19 | ䷒ | Lin 臨 | 110000 | 48 |
| 20 | ䷓ | Guan 觀 | 000011 | 3 |
| 21 | ䷔ | Shi He 噬嗑 | 100101 | 37 |
| 22 | ䷕ | Bi 賁 (Gracia) | 101001 | 41 |
| 23 | ䷖ | Bo 剝 | 000001 | 1 |
| 24 | ䷗ | Fu 復 | 100000 | 32 |
| 25 | ䷘ | Wu Wang 無妄 | 100111 | 39 |
| 26 | ䷙ | Da Chu 大畜 | 111001 | 57 |
| 27 | ䷚ | Yi 頤 | 100001 | 33 |
| 28 | ䷛ | Da Guo 大過 | 011110 | 30 |
| 29 | ䷜ | Kan 坎 | 010010 | 18 |
| 30 | ䷝ | Li 離 | 101101 | 45 |
| 31 | ䷞ | Xian 咸 | 001110 | 14 |
| 32 | ䷟ | Heng 恆 | 011100 | 28 |
| 33 | ䷠ | Dun 遯 | 001111 | 15 |
| 34 | ䷡ | Da Zhuang 大壯 | 111100 | 60 |
| 35 | ䷢ | Jin 晉 | 000101 | 5 |
| 36 | ䷣ | Ming Yi 明夷 | 101000 | 40 |
| 37 | ䷤ | Jia Ren 家人 | 101011 | 43 |
| 38 | ䷥ | Kui 睽 | 110101 | 53 |
| 39 | ䷦ | Jian 蹇 | 001010 | 10 |
| 40 | ䷧ | Xie 解 | 010100 | 20 |
| 41 | ䷨ | Sun 損 | 110001 | 49 |
| 42 | ䷩ | Yi 益 (Aumento) | 100011 | 35 |
| 43 | ䷪ | Guai 夬 | 111110 | 62 |
| 44 | ䷫ | Gou 姤 | 011111 | 31 |
| 45 | ䷬ | Cui 萃 | 000110 | 6 |
| 46 | ䷭ | Sheng 升 | 011000 | 24 |
| 47 | ䷮ | Kun 困 (Opresión) | 010110 | 22 |
| 48 | ䷯ | Jing 井 | 011010 | 26 |
| 49 | ䷰ | Ge 革 | 101110 | 46 |
| 50 | ䷱ | Ding 鼎 | 011101 | 29 |
| 51 | ䷲ | Zhen 震 | 100100 | 36 |
| 52 | ䷳ | Gen 艮 | 001001 | 9 |
| 53 | ䷴ | Jian 漸 (Desarrollo) | 001011 | 11 |
| 54 | ䷵ | Gui Mei 歸妹 | 110100 | 52 |
| 55 | ䷶ | Feng 豐 | 101100 | 44 |
| 56 | ䷷ | Lü 旅 (Viajero) | 001101 | 13 |
| 57 | ䷸ | Xun 巽 | 011011 | 27 |
| 58 | ䷹ | Dui 兌 | 110110 | 54 |
| 59 | ䷺ | Huan 渙 | 010011 | 19 |
| 60 | ䷻ | Jie 節 | 110010 | 50 |
| 61 | ䷼ | Zhong Fu 中孚 | 110011 | 51 |
| 62 | ䷽ | Xiao Guo 小過 | 001100 | 12 |
| 63 | ䷾ | Ji Ji 既濟 | 101010 | 42 |
| 64 | ䷿ | Wei Ji 未濟 | 010101 | 21 |

## Tabla 2: Secuencia Fu Xi / binaria (Shao Yong–Leibniz): conteo 0 → 63

| Valor binario | Bits | Hexagrama | N° Rey Wen | Nombre |
|---|---|---|---|---|
| 0 | 000000 | ䷁ | 2 | Kun 坤 (Lo Receptivo) |
| 1 | 000001 | ䷖ | 23 | Bo 剝 |
| 2 | 000010 | ䷇ | 8 | Bi 比 |
| 3 | 000011 | ䷓ | 20 | Guan 觀 |
| 4 | 000100 | ䷏ | 16 | Yu 豫 |
| 5 | 000101 | ䷢ | 35 | Jin 晉 |
| 6 | 000110 | ䷬ | 45 | Cui 萃 |
| 7 | 000111 | ䷋ | 12 | Pi 否 |
| 8 | 001000 | ䷎ | 15 | Qian 謙 (Modestia) |
| 9 | 001001 | ䷳ | 52 | Gen 艮 |
| 10 | 001010 | ䷦ | 39 | Jian 蹇 |
| 11 | 001011 | ䷴ | 53 | Jian 漸 (Desarrollo) |
| 12 | 001100 | ䷽ | 62 | Xiao Guo 小過 |
| 13 | 001101 | ䷷ | 56 | Lü 旅 (Viajero) |
| 14 | 001110 | ䷞ | 31 | Xian 咸 |
| 15 | 001111 | ䷠ | 33 | Dun 遯 |
| 16 | 010000 | ䷆ | 7 | Shi 師 |
| 17 | 010001 | ䷃ | 4 | Meng 蒙 |
| 18 | 010010 | ䷜ | 29 | Kan 坎 |
| 19 | 010011 | ䷺ | 59 | Huan 渙 |
| 20 | 010100 | ䷧ | 40 | Xie 解 |
| 21 | 010101 | ䷿ | 64 | Wei Ji 未濟 |
| 22 | 010110 | ䷮ | 47 | Kun 困 (Opresión) |
| 23 | 010111 | ䷅ | 6 | Song 訟 |
| 24 | 011000 | ䷭ | 46 | Sheng 升 |
| 25 | 011001 | ䷑ | 18 | Gu 蠱 |
| 26 | 011010 | ䷯ | 48 | Jing 井 |
| 27 | 011011 | ䷸ | 57 | Xun 巽 |
| 28 | 011100 | ䷟ | 32 | Heng 恆 |
| 29 | 011101 | ䷱ | 50 | Ding 鼎 |
| 30 | 011110 | ䷛ | 28 | Da Guo 大過 |
| 31 | 011111 | ䷫ | 44 | Gou 姤 |
| 32 | 100000 | ䷗ | 24 | Fu 復 |
| 33 | 100001 | ䷚ | 27 | Yi 頤 |
| 34 | 100010 | ䷂ | 3 | Zhun 屯 |
| 35 | 100011 | ䷩ | 42 | Yi 益 (Aumento) |
| 36 | 100100 | ䷲ | 51 | Zhen 震 |
| 37 | 100101 | ䷔ | 21 | Shi He 噬嗑 |
| 38 | 100110 | ䷐ | 17 | Sui 隨 |
| 39 | 100111 | ䷘ | 25 | Wu Wang 無妄 |
| 40 | 101000 | ䷣ | 36 | Ming Yi 明夷 |
| 41 | 101001 | ䷕ | 22 | Bi 賁 (Gracia) |
| 42 | 101010 | ䷾ | 63 | Ji Ji 既濟 |
| 43 | 101011 | ䷤ | 37 | Jia Ren 家人 |
| 44 | 101100 | ䷶ | 55 | Feng 豐 |
| 45 | 101101 | ䷝ | 30 | Li 離 |
| 46 | 101110 | ䷰ | 49 | Ge 革 |
| 47 | 101111 | ䷌ | 13 | Tong Ren 同人 |
| 48 | 110000 | ䷒ | 19 | Lin 臨 |
| 49 | 110001 | ䷨ | 41 | Sun 損 |
| 50 | 110010 | ䷻ | 60 | Jie 節 |
| 51 | 110011 | ䷼ | 61 | Zhong Fu 中孚 |
| 52 | 110100 | ䷵ | 54 | Gui Mei 歸妹 |
| 53 | 110101 | ䷥ | 38 | Kui 睽 |
| 54 | 110110 | ䷹ | 58 | Dui 兌 |
| 55 | 110111 | ䷉ | 10 | Lü 履 |
| 56 | 111000 | ䷊ | 11 | Tai 泰 |
| 57 | 111001 | ䷙ | 26 | Da Chu 大畜 |
| 58 | 111010 | ䷄ | 5 | Xu 需 |
| 59 | 111011 | ䷈ | 9 | Xiao Chu 小畜 |
| 60 | 111100 | ䷡ | 34 | Da Zhuang 大壯 |
| 61 | 111101 | ䷍ | 14 | Da You 大有 |
| 62 | 111110 | ䷪ | 43 | Guai 夬 |
| 63 | 111111 | ䷀ | 1 | Qian 乾 (Lo Creativo) |

## Observaciones

- Los 64 valores de la Tabla 1 cubren exactamente los enteros 0–63 sin repetición: la correspondencia hexagrama ↔ número binario de 6 bits es una biyección perfecta.
- La secuencia Fu Xi **es** literalmente contar en binario de 0 a 63. No hay ninguna transformación adicional.
- La secuencia del Rey Wen no sigue el orden numérico. Su regla organizadora es por **pares**: cada hexagrama par es el volteo vertical (inversión, 反 fan) del impar anterior; en los 8 casos donde voltear el hexagrama lo deja igual (pares 1–2, 27–28, 29–30, 61–62), se usa en cambio el complemento línea a línea (对 dui), que en binario es la operación NOT (por ejemplo, Kan 010010 = 18 y Li 101101 = 45 suman 63).
- Cada hexagrama tiene exactamente 6 "vecinos" que difieren en una sola línea (distancia de Hamming 1). El grafo resultante es el hipercubo de 6 dimensiones (Q6): 64 vértices y 192 aristas. Los hilos de colores del post de Reddit son exactamente esas aristas.
