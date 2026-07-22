"""
Motor binario del I Ching
Convencion Shao Yong-Leibniz: yang=1, yin=0, lineas leidas de abajo hacia arriba,
linea inferior = bit mas significativo (valor 32). Kun=0, Qian=63.
Verificado computacionalmente: la correspondencia hexagrama <-> entero 0-63 es una biyeccion.
"""
import json, os

TRI = {'Qian':'111','Dui':'110','Li':'101','Zhen':'100','Xun':'011','Kan':'010','Gen':'001','Kun':'000'}

KW = [
 (1,'Qian','Lo Creativo','Qian','Qian'),(2,'Kun','Lo Receptivo','Kun','Kun'),
 (3,'Zhun','La Dificultad Inicial','Zhen','Kan'),(4,'Meng','La Necedad Juvenil','Kan','Gen'),
 (5,'Xu','La Espera','Qian','Kan'),(6,'Song','El Conflicto','Kan','Qian'),
 (7,'Shi','El Ejercito','Kan','Kun'),(8,'Bi','La Solidaridad','Kun','Kan'),
 (9,'Xiao Chu','Fuerza Domesticadora Menor','Qian','Xun'),(10,'Lu','El Porte','Dui','Qian'),
 (11,'Tai','La Paz','Qian','Kun'),(12,'Pi','El Estancamiento','Kun','Qian'),
 (13,'Tong Ren','Comunidad con los Hombres','Li','Qian'),(14,'Da You','La Posesion de lo Grande','Qian','Li'),
 (15,'Qian','La Modestia','Gen','Kun'),(16,'Yu','El Entusiasmo','Kun','Zhen'),
 (17,'Sui','El Seguimiento','Zhen','Dui'),(18,'Gu','El Trabajo en lo Echado a Perder','Xun','Gen'),
 (19,'Lin','El Acercamiento','Dui','Kun'),(20,'Guan','La Contemplacion','Kun','Xun'),
 (21,'Shi He','La Mordedura Tajante','Zhen','Li'),(22,'Bi','La Gracia','Li','Gen'),
 (23,'Bo','La Desintegracion','Kun','Gen'),(24,'Fu','El Retorno','Zhen','Kun'),
 (25,'Wu Wang','La Inocencia','Zhen','Qian'),(26,'Da Chu','Fuerza Domesticadora Mayor','Qian','Gen'),
 (27,'Yi','La Nutricion','Zhen','Gen'),(28,'Da Guo','Preponderancia de lo Grande','Xun','Dui'),
 (29,'Kan','Lo Abismal','Kan','Kan'),(30,'Li','Lo Adherente','Li','Li'),
 (31,'Xian','El Influjo','Gen','Dui'),(32,'Heng','La Duracion','Xun','Zhen'),
 (33,'Dun','La Retirada','Gen','Qian'),(34,'Da Zhuang','El Poder de lo Grande','Qian','Zhen'),
 (35,'Jin','El Progreso','Kun','Li'),(36,'Ming Yi','El Oscurecimiento de la Luz','Li','Kun'),
 (37,'Jia Ren','El Clan','Li','Xun'),(38,'Kui','El Antagonismo','Dui','Li'),
 (39,'Jian','El Impedimento','Gen','Kan'),(40,'Xie','La Liberacion','Kan','Zhen'),
 (41,'Sun','La Merma','Dui','Gen'),(42,'Yi','El Aumento','Zhen','Xun'),
 (43,'Guai','La Resolucion','Qian','Dui'),(44,'Gou','Ir al Encuentro','Xun','Qian'),
 (45,'Cui','La Reunion','Kun','Dui'),(46,'Sheng','La Ascension','Xun','Kun'),
 (47,'Kun','La Opresion','Kan','Dui'),(48,'Jing','El Pozo','Xun','Kan'),
 (49,'Ge','La Revolucion','Li','Dui'),(50,'Ding','El Caldero','Xun','Li'),
 (51,'Zhen','La Conmocion','Zhen','Zhen'),(52,'Gen','El Aquietamiento','Gen','Gen'),
 (53,'Jian','El Desarrollo','Gen','Xun'),(54,'Gui Mei','La Muchacha que se Casa','Dui','Zhen'),
 (55,'Feng','La Plenitud','Li','Zhen'),(56,'Lu','El Andariego','Gen','Li'),
 (57,'Xun','Lo Suave','Xun','Xun'),(58,'Dui','Lo Sereno','Dui','Dui'),
 (59,'Huan','La Disolucion','Kan','Xun'),(60,'Jie','La Restriccion','Dui','Kan'),
 (61,'Zhong Fu','La Verdad Interior','Dui','Xun'),(62,'Xiao Guo','Preponderancia de lo Pequeno','Gen','Zhen'),
 (63,'Ji Ji','Despues de la Consumacion','Li','Kan'),(64,'Wei Ji','Antes de la Consumacion','Kan','Li'),
]

def bits_of(lower, upper):
    "Cadena de 6 bits abajo->arriba."
    return TRI[lower] + TRI[upper]

def value_of(bits):
    "Entero 0-63; linea inferior = MSB."
    return int(bits, 2)

BY_VALUE = {}
for kw, py, es, lo, up in KW:
    b = bits_of(lo, up)
    BY_VALUE[value_of(b)] = {'valor': value_of(b), 'bits': b, 'kw': kw, 'pinyin': py,
                             'nombre': es, 'trigrama_inferior': lo, 'trigrama_superior': up,
                             'unicode': chr(0x4DC0 + kw - 1)}
BY_KW = {h['kw']: h for h in BY_VALUE.values()}

LINE_BIT = lambda k: 1 << (6 - k)          # linea 1 (abajo) -> 32 ... linea 6 -> 1

def mutate(h, lineas):
    "Aplica lineas mutantes (lista de 1-6). Una consulta real del I Ching es exactamente esto."
    m = 0
    for k in lineas: m |= LINE_BIT(k)
    return h ^ m

def dui(h):
    "Opuesto / complemento (dui): NOT bit a bit."
    return (~h) & 63

def fan(h):
    "Volteo vertical (fan): invierte el orden de las 6 lineas."
    b = format(h, '06b')
    return int(b[::-1], 2)

def hu_gua(h):
    "Hexagrama nuclear: lineas 2-3-4 como trigrama inferior, 3-4-5 como superior."
    b = format(h, '06b')
    return int(b[1:4] + b[2:5], 2)

def hamming(a, b):
    "Cuantas lineas separan dos hexagramas (distancia en el hipercubo Q6)."
    return bin(a ^ b).count('1')

def vecinos(h):
    "Los 6 hexagramas a una linea de distancia: {linea: valor}."
    return {k: h ^ LINE_BIT(k) for k in range(1, 7)}

def trigramas(h):
    "Trigramas (inferior, superior) como valores 0-7."
    return (h >> 3, h & 7)

def gray():
    "Recorrido hamiltoniano por los 64 estados: cada paso cambia UNA linea. Kun(0) -> ... -> Fu(32)."
    return [n ^ (n >> 1) for n in range(64)]

def secuencia_fuxi():
    return [BY_VALUE[v] for v in range(64)]

def secuencia_rey_wen():
    return [BY_KW[n] for n in range(1, 65)]

def verificar():
    assert sorted(BY_VALUE) == list(range(64)), 'la correspondencia no es biyectiva'
    assert BY_KW[1]['valor'] == 63 and BY_KW[2]['valor'] == 0 and BY_KW[30]['valor'] == 45
    assert dui(BY_KW[29]['valor']) == BY_KW[30]['valor']
    g = gray()
    assert g[0] == 0 and g[-1] == 32
    assert all(hamming(g[i], g[i+1]) == 1 for i in range(63))
    for n in range(1, 65, 2):
        a, b = BY_KW[n]['valor'], BY_KW[n+1]['valor']
        assert b == (dui(a) if fan(a) == a else fan(a)), f'par {n}-{n+1}'
    return True

def exportar_json(ruta):
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump([BY_KW[n] for n in range(1, 65)], f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    verificar()
    print('Verificacion completa: biyeccion 0-63, pares del Rey Wen (fan/dui), recorrido Gray Kun->Fu. Todo OK.')
    aqui = os.path.dirname(os.path.abspath(__file__))
    exportar_json(os.path.join(aqui, '..', 'data', 'hexagramas.json'))
    print('data/hexagramas.json regenerado.')
    h = BY_KW[30]['valor']
    print(f"Demo con el hexagrama 30 (Li, {format(h,'06b')} = {h}):")
    print('  dui (opuesto)    ->', BY_VALUE[dui(h)]['kw'], BY_VALUE[dui(h)]['pinyin'])
    print('  fan (volteo)     ->', BY_VALUE[fan(h)]['kw'], BY_VALUE[fan(h)]['pinyin'])
    print('  hu gua (nuclear) ->', BY_VALUE[hu_gua(h)]['kw'], BY_VALUE[hu_gua(h)]['pinyin'])
    print('  mutando linea 5  ->', BY_VALUE[mutate(h,[5])]['kw'], BY_VALUE[mutate(h,[5])]['pinyin'])
