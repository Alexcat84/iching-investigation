"""
Verificacion de los experimentos del sitio web.

Cada afirmacion estructural que aparece en la app (web/) se comprueba aqui contra
el motor binario ya verificado (iching_engine.py). Es la contraparte de Python de
web/lib/palacios.ts, web/lib/oraculo.ts y web/lib/simetrias.ts: mismos numeros,
misma fuente de verdad.

Uso:  python3 scripts/experimentos.py
"""
import os
import sys
from math import comb

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from iching_engine import (  # noqa: E402
    BY_KW, BY_VALUE, LINE_BIT, TRI, bits_of, dui, fan, hamming, hu_gua, value_of,
)

# === 1. Palacios de Jing Fang ===
# Orden tradicional del bagong de Jing Fang: padre, tres hijos por edad, madre,
# tres hijas por edad (乾震坎艮坤巽離兌).
CABEZAS = ['Qian', 'Zhen', 'Kan', 'Gen', 'Kun', 'Xun', 'Li', 'Dui']
LOWER = LINE_BIT(1) | LINE_BIT(2) | LINE_BIT(3)


def palacio(cabeza):
    puro = value_of(bits_of(cabeza, cabeza))
    seq, cur = [puro], puro
    for k in range(1, 6):
        cur ^= LINE_BIT(k)
        seq.append(cur)
    youhun = seq[5] ^ LINE_BIT(4)
    seq.append(youhun)
    guihun = (youhun & ~LOWER & 63) | (puro & LOWER)
    seq.append(guihun)
    return seq


def cambios(a, b):
    return [k for k in range(1, 7) if (a & LINE_BIT(k)) != (b & LINE_BIT(k))]


def verificar_palacios():
    palacios = [palacio(c) for c in CABEZAS]
    vistos = set()
    for p in palacios:
        vistos.update(p)
    assert len(vistos) == 64, f'los palacios no particionan: {len(vistos)} distintos'

    perfil = [hamming(palacios[0][i - 1], palacios[0][i]) for i in range(1, 8)]
    assert perfil == [1, 1, 1, 1, 1, 1, 3], f'perfil inesperado: {perfil}'

    for p in palacios:
        puro = p[0]
        assert cambios(puro, p[6]) == [1, 2, 3, 5], 'alma errante inesperada'
        assert cambios(puro, p[7]) == [5], 'alma que retorna inesperada'

    print('1. Palacios de Jing Fang')
    print(f'   particion 8x8 -> {len(vistos)}/64 hexagramas distintos  OK')
    print(f'   perfil de saltos (Hamming) por palacio: {"·".join(map(str, perfil))}')
    print('   alma errante = puro voltea {1,2,3,5}; alma que retorna = puro voltea {5}')


# === 2. Monedas vs milenrama ===
# Probabilidad de cada estado en dieciseisavos: 9=yang viejo, 8=yin joven, 7=yang joven, 6=yin viejo
SESAVOS = {
    'monedas':   {9: 2, 8: 6, 7: 6, 6: 2},
    'milenrama': {9: 3, 8: 7, 7: 5, 6: 1},
}


def teoria(m):
    p = {e: SESAVOS[m][e] / 16 for e in (9, 8, 7, 6)}
    p_yang = p[7] + p[9]
    p_muta = p[6] + p[9]
    cuota_yang_viejo = p[9] / p_muta
    yang_futuro = 6 * (p[7] + p[6])   # yang joven queda + yin viejo muta a yang
    return p_yang, p_muta, cuota_yang_viejo, yang_futuro


def verificar_oraculo():
    mon = teoria('monedas')
    mil = teoria('milenrama')
    # Coincidencias:
    assert abs(mon[0] - 0.5) < 1e-12 and abs(mil[0] - 0.5) < 1e-12, 'P(yang) != 1/2'
    assert abs(mon[1] - 0.25) < 1e-12 and abs(mil[1] - 0.25) < 1e-12, 'P(muta) != 1/4'
    # Diferencias:
    assert abs(mon[2] - 0.5) < 1e-12, 'cuota yang viejo monedas != 1/2'
    assert abs(mil[2] - 0.75) < 1e-12, 'cuota yang viejo milenrama != 3/4'
    assert abs(mon[3] - 3.0) < 1e-12 and abs(mil[3] - 2.25) < 1e-12, 'yang futuro'

    print('2. Monedas contra milenrama')
    print(f'   P(linea = yang):  monedas {mon[0]:.3f} · milenrama {mil[0]:.3f}   identicos')
    print(f'   P(linea muta):    monedas {mon[1]:.3f} · milenrama {mil[1]:.3f}   identicos')
    print(f'   cuota yang viejo: monedas {mon[2]:.0%} · milenrama {mil[2]:.0%}   distinto')
    print(f'   yang esperado futuro: monedas {mon[3]:.2f} · milenrama {mil[3]:.2f}   el futuro se inclina al yin')


# === 3. Simetrias del hipercubo ===
def fan_dui(v):
    return dui(fan(v))


def orbita(v):
    return frozenset({v, fan(v), dui(v), fan_dui(v)})


def verificar_simetrias():
    orbitas = set(orbita(v) for v in range(64))
    assert len(orbitas) == 20, f'se esperaban 20 orbitas, hay {len(orbitas)}'
    tamanos = {}
    for o in orbitas:
        tamanos[len(o)] = tamanos.get(len(o), 0) + 1

    palindromos = set(v for v in range(64) if fan(v) == v)
    assert len(palindromos) == 8, 'deberia haber 8 palindromos'

    pares_especiales = [(1, 2), (27, 28), (29, 30), (61, 62)]
    desde_kw = set(BY_KW[kw]['valor'] for par in pares_especiales for kw in par)
    assert palindromos == desde_kw, 'los palindromos no son los pares especiales'

    # Dinamica nuclear: atractores del mapa hu_gua
    en_ciclo = [False] * 64
    for v in range(64):
        slow = fast = v
        while True:
            slow = hu_gua(slow)
            fast = hu_gua(hu_gua(fast))
            if slow == fast:
                break
        c = slow
        while True:
            en_ciclo[c] = True
            c = hu_gua(c)
            if c == slow:
                break
    ciclos = []
    id_ciclo = [-1] * 64
    for v in range(64):
        if en_ciclo[v] and id_ciclo[v] == -1:
            cyc, c = [], v
            while True:
                cyc.append(c)
                id_ciclo[c] = len(ciclos)
                c = hu_gua(c)
                if c == v:
                    break
            ciclos.append(cyc)

    # Hecho completo (redaccion unificada del sitio): 3 atractores, dos puntos
    # fijos y un ciclo de 2 (4 hexagramas atractores). Atractores = {Qian}, {Kun}
    # y {Ji Ji, Wei Ji}; cuencas 16, 16 y 32; profundidad maxima de caida 2.
    QIAN, KUN = BY_KW[1]['valor'], BY_KW[2]['valor']
    JIJI, WEIJI = BY_KW[63]['valor'], BY_KW[64]['valor']
    conjuntos = sorted(tuple(sorted(c)) for c in ciclos)
    assert conjuntos == sorted([(QIAN,), (KUN,), tuple(sorted((JIJI, WEIJI)))]), \
        f'atractores inesperados: {conjuntos}'
    assert sum(len(c) for c in ciclos) == 4, '4 hexagramas atractores esperados'
    pasos = []
    for v in range(64):
        c, s = v, 0
        while not en_ciclo[c]:
            c = hu_gua(c)
            s += 1
        pasos.append((s, id_ciclo[c]))
    cuenca = {}
    for _, cid in pasos:
        cuenca[cid] = cuenca.get(cid, 0) + 1
    por_conjunto = {tuple(sorted(ciclos[cid])): n for cid, n in cuenca.items()}
    assert por_conjunto[(QIAN,)] == 16 and por_conjunto[(KUN,)] == 16, 'cuencas de 16'
    assert por_conjunto[tuple(sorted((JIJI, WEIJI)))] == 32, 'cuenca de 32'
    assert max(s for s, _ in pasos) == 2, 'profundidad maxima de caida 2'

    espectro = {6 - 2 * k: comb(6, k) for k in range(7)}
    assert sum(espectro.values()) == 64, 'el espectro no suma 64'

    print('3. Simetrias del hipercubo')
    print(f'   grupo de Klein V4 -> {len(orbitas)} orbitas '
          f'({tamanos.get(4, 0)} de tamano 4, {tamanos.get(2, 0)} de tamano 2)')
    print(f'   8 palindromos == pares especiales del Rey Wen {pares_especiales}  OK')
    nombres = [' + '.join(BY_VALUE[v]['pinyin'] for v in c) for c in ciclos]
    print(f'   mapa nuclear -> {len(ciclos)} atractores: {"; ".join(nombres)}')
    print('   dos puntos fijos y un ciclo de 2 (4 hexagramas atractores);'
          ' cuencas 16, 16 y 32; caida maxima 2  OK')
    print(f'   espectro Q6: {espectro}  (suma {sum(espectro.values())})')


# === 4. Secuencia del Rey Wen ===
def verificar_rey_wen():
    fan_pairs = dui_pairs = 0
    for n in range(1, 33):
        a = BY_KW[2 * n - 1]['valor']
        b = BY_KW[2 * n]['valor']
        if fan(a) == a:  # palindromo -> se usa dui
            assert b == dui(a), f'par {n}: dui esperado'
            dui_pairs += 1
        else:
            assert b == fan(a), f'par {n}: fan esperado'
            fan_pairs += 1
    assert fan_pairs == 28 and dui_pairs == 4, (fan_pairs, dui_pairs)

    # El volteo conserva el nº de líneas yang; el opuesto lo complementa.
    for v in range(64):
        assert bin(fan(v)).count('1') == bin(v).count('1')
        assert bin(dui(v)).count('1') == 6 - bin(v).count('1')

    print('4. La secuencia del Rey Wen')
    print(f'   32 pares: {fan_pairs} por volteo (fan), {dui_pairs} por opuesto (dui)  OK')
    print('   fan conserva el nº de yang; dui lo complementa (yang <-> 6-yang)  OK')


# === 5. Cuadrado y circulo de Shao Yong ===
def verificar_shao_yong():
    def celda(fila, col):
        return (col << 3) | (7 - fila)
    vals = set(celda(f, c) for f in range(8) for c in range(8))
    assert vals == set(range(64)), 'el cuadrado no cubre 0..63'
    # Simetrias del circulo: dui = reflexion (63 - v); antipoda = voltear linea inferior.
    for v in range(64):
        assert dui(v) == 63 - v
        assert (v ^ 32) == v ^ LINE_BIT(1)
    print('5. El cuadrado y el circulo de Shao Yong')
    print('   las 64 celdas del cuadrado 8x8 son exactamente 0..63  OK')
    print('   circulo: dui = 63-v (reflexion vertical); antipoda = voltear linea 1  OK')


# === 6. Rey Wen como permutacion ===
def verificar_permutacion():
    from math import gcd
    perm = [BY_KW[k + 1]['valor'] for k in range(64)]
    visto = [False] * 64
    ciclos = []
    for i in range(64):
        if visto[i]:
            continue
        c, j = [], i
        while not visto[j]:
            visto[j] = True
            c.append(j)
            j = perm[j]
        ciclos.append(c)
    longs = sorted((len(c) for c in ciclos), reverse=True)
    fijos = [c[0] for c in ciclos if len(c) == 1]
    orden = 1
    for L in longs:
        orden = orden * L // gcd(orden, L)
    inv = sum(1 for i in range(64) for j in range(i + 1, 64) if perm[i] > perm[j])
    paridad = 'par' if (64 - len(ciclos)) % 2 == 0 else 'impar'

    print('6. Rey Wen como permutacion de Fu Xi')
    print(f'   {len(ciclos)} ciclos; longitudes {longs}')
    print(f'   {len(fijos)} puntos fijos: {fijos}')
    print(f'   orden {orden} · paridad {paridad} · {inv} inversiones (de {64*63//2})')


# ----------------- 7. El ritual de las 49 varillas -----------------

def verificar_milenrama():
    """Deriva 1/3/5/7 sobre 16 por enumeracion exacta y comprueba la convergencia.

    Supuesto del modelo (declarado en la pagina): en cada division, el resto del
    monton izquierdo al contar de 4 en 4 (1..4) es equiprobable.
    """
    from fractions import Fraction
    from itertools import product
    import random

    def co(pile, rl):
        return ((pile - 2 - rl) % 4) + 1

    dist = {6: Fraction(0), 7: Fraction(0), 8: Fraction(0), 9: Fraction(0)}
    ramas = {}
    for r1, r2, r3 in product((1, 2, 3, 4), repeat=3):
        pile = 49
        quitadas = []
        for r in (r1, r2, r3):
            q = 1 + r + co(pile, r)
            quitadas.append(q)
            pile -= q
        assert pile in (24, 28, 32, 36), f'restantes invalidos: {pile}'
        dist[pile // 4] += Fraction(1, 64)
        ramas[tuple(quitadas)] = ramas.get(tuple(quitadas), 0) + 1

    esperada = {9: Fraction(3, 16), 8: Fraction(7, 16), 7: Fraction(5, 16), 6: Fraction(1, 16)}
    assert dist == esperada, f'derivacion inesperada: {dist}'
    assert len(ramas) == 8, 'el arbol debe tener 8 ramas'
    # Cierre del bucle: identica a la tabla que usa el experimento de probabilidades.
    assert all(dist[e] == Fraction(SESAVOS['milenrama'][e], 16) for e in (6, 7, 8, 9)), \
        'la derivacion no coincide con SESAVOS[milenrama]'

    rng = random.Random(20260722)
    n = 200000
    cnt = {6: 0, 7: 0, 8: 0, 9: 0}
    for _ in range(n):
        pile = 49
        for _ in range(3):
            pile -= 1 + (r := rng.randrange(1, 5)) + co(pile, r)
        cnt[pile // 4] += 1
    for e in (6, 7, 8, 9):
        assert abs(cnt[e] / n - float(esperada[e])) < 0.01, f'sim no converge en {e}'

    print('7. El ritual de las 49 varillas')
    print('   enumeracion exacta 4^3=64 casos -> 8 ramas -> 3/16, 7/16, 5/16, 1/16  OK')
    print('   identica a la tabla del experimento de probabilidades  OK')
    print(f'   simulacion n={n}: ' + ' '.join(f'{e}:{cnt[e]/n:.4f}' for e in (9, 8, 7, 6)) + '  converge  OK')


# ----------------- 8. Los dos cielos (bagua Anterior y Posterior) -----------------

def _metricas_perm(perm):
    """Ciclos, fijos, orden, paridad e inversiones de una permutacion (lista)."""
    from math import gcd
    n = len(perm)
    visto = [False] * n
    ciclos = []
    for i in range(n):
        if visto[i]:
            continue
        c, j = [], i
        while not visto[j]:
            visto[j] = True
            c.append(j)
            j = perm[j]
        ciclos.append(c)
    longs = sorted((len(c) for c in ciclos), reverse=True)
    fijos = [c[0] for c in ciclos if len(c) == 1]
    orden = 1
    for L in longs:
        orden = orden * L // gcd(orden, L)
    inv = sum(1 for i in range(n) for j in range(i + 1, n) if perm[i] > perm[j])
    paridad = 'par' if (n - len(ciclos)) % 2 == 0 else 'impar'
    return ciclos, longs, fijos, orden, paridad, inv


def verificar_dos_cielos():
    # Valores 0..7 por posicion de pantalla (0 arriba, horario; sur arriba, este
    # a la izquierda). Deben coincidir con web/lib/bagua.ts.
    val = {t: int(TRI[t], 2) for t in TRI}
    anterior = [val[t] for t in ['Qian', 'Xun', 'Kan', 'Gen', 'Kun', 'Zhen', 'Li', 'Dui']]
    posterior = [val[t] for t in ['Li', 'Kun', 'Dui', 'Qian', 'Kan', 'Gen', 'Zhen', 'Xun']]
    assert sorted(anterior) == list(range(8)) and sorted(posterior) == list(range(8))

    ejes_ant = [i for i in range(4) if anterior[i] + anterior[i + 4] == 7]
    ejes_pos = [i for i in range(4) if posterior[i] + posterior[i + 4] == 7]
    assert len(ejes_ant) == 4, 'el Cielo Anterior debe tener 4 ejes complementarios'
    assert len(ejes_pos) == 1, 'el Posterior debe conservar exactamente 1 eje'
    par = sorted([posterior[ejes_pos[0]], posterior[ejes_pos[0] + 4]])
    assert par == [2, 5], 'el eje conservado debe ser Li (5) y Kan (2)'

    tau = [0] * 8
    for p in range(8):
        tau[anterior[p]] = posterior[p]
    ciclos, longs, fijos, orden, paridad, inv = _metricas_perm(tau)
    assert longs == [4, 4] and fijos == [] and orden == 4
    assert paridad == 'par' and inv == 14

    print('8. Los dos cielos (bagua Anterior y Posterior)')
    print('   Anterior: 4 ejes complementarios (suman 7)  OK')
    print('   Posterior: solo 1 eje conservado, Li y Kan  OK')
    print(f'   permutacion tau: dos ciclos de 4, 0 fijos, orden 4, paridad par, {inv}/28 inversiones  OK')


# ----------------- 9. Las sombras del 6-cubo -----------------

def verificar_sombras():
    import math
    # Petrie: 6 direcciones separadas 30 grados; el poligono exterior tiene 12 vertices.
    def petrie(v):
        x = y = 0.0
        for k in range(1, 7):
            s = 1 if v & LINE_BIT(k) else -1
            ang = -math.pi / 2 + (k - 1) * math.pi / 6
            x += s * math.cos(ang)
            y += s * math.sin(ang)
        return x, y
    radios = [math.hypot(*petrie(v)) for v in range(64)]
    rmax = max(radios)
    exteriores = sum(1 for r in radios if abs(r - rmax) < 1e-9)
    assert exteriores == 12, f'el poligono de Petrie debe tener 12 vertices, hay {exteriores}'

    # Las 192 aristas y su particion Q3 x Q3: lineas 1-3 dentro del cubo pequeno,
    # lineas 4-6 entre cubos (el trigrama superior es la esquina del cubo grande).
    aristas = [(v, v ^ LINE_BIT(k), k) for v in range(64) for k in range(1, 7) if v < (v ^ LINE_BIT(k))]
    assert len(aristas) == 192
    intra = sum(1 for _, _, k in aristas if k <= 3)
    assert intra == 96 and len(aristas) - intra == 96, 'la particion debe ser 96 + 96'
    for a, b, k in aristas:
        if k <= 3:
            assert (a & 7) == (b & 7), 'lineas 1-3 no deben cambiar el trigrama superior'
        else:
            assert (a >> 3) == (b >> 3), 'lineas 4-6 no deben cambiar el inferior'

    # Niveles de yang: tamanos C(6,k) y toda arista cruza exactamente un nivel.
    tam = [0] * 7
    for v in range(64):
        tam[bin(v).count('1')] += 1
    assert tam == [comb(6, k) for k in range(7)], f'tamanos de nivel: {tam}'
    assert all(abs(bin(a).count('1') - bin(b).count('1')) == 1 for a, b, _ in aristas)

    print('9. Las sombras del 6-cubo')
    print('   poligono de Petrie: 12 vertices exteriores  OK')
    print('   cubo de cubos: particion de aristas 96 (dentro) + 96 (entre)  OK')
    print(f'   niveles de yang: tamanos {tam}; toda arista cruza un nivel  OK')


# ----------------- 10. El reticulo booleano B6 -----------------

def verificar_reticulo():
    # Coberturas del orden de dominancia bit a bit: x debajo de y, difieren en 1 bit.
    covers = set()
    for x in range(64):
        for y in range(64):
            if x != y and (x & y) == x and bin(x ^ y).count('1') == 1:
                covers.add((x, y))
    assert len(covers) == 192, f'coberturas: {len(covers)}'
    # Son exactamente las aristas de Q6 (como pares no ordenados).
    aristas = set()
    for v in range(64):
        for k in range(1, 7):
            u = v ^ LINE_BIT(k)
            aristas.add((min(u, v), max(u, v)))
    assert {(min(a, b), max(a, b)) for a, b in covers} == aristas, \
        'las coberturas no son las aristas del hipercubo'
    # Toda cobertura sube exactamente un nivel de yang.
    assert all(bin(y).count('1') - bin(x).count('1') == 1 for x, y in covers)

    # Cadenas maximales de Kun a Qian: 6! = 720.
    ways = [0] * 64
    ways[0] = 1
    for v in sorted(range(64), key=lambda x: bin(x).count('1')):
        if v:
            ways[v] = sum(ways[v ^ (1 << b)] for b in range(6) if v >> b & 1)
    assert ways[63] == 720, f'cadenas maximales: {ways[63]}'

    # Conos: 2^k hacia abajo, 2^(6-k) hacia arriba, para todo v.
    for v in range(64):
        k = bin(v).count('1')
        arriba = sum(1 for y in range(64) if (v & y) == v)
        abajo = sum(1 for x in range(64) if (x & v) == x)
        assert arriba == 2 ** (6 - k) and abajo == 2 ** k

    print('10. El reticulo booleano B6')
    print('   coberturas de la dominancia = las 192 aristas de Q6, orientadas  OK')
    print('   cadenas maximales Kun -> Qian: 720 = 6!  OK')
    print('   conos: 2^k por debajo y 2^(6-k) por encima, para los 64  OK')


# ----------------- 11. El arbol de Fu Xi -----------------

def verificar_arbol():
    # Arbol de bifurcacion: yin (0) a la izquierda, yang (1) a la derecha.
    # Nivel k decide la linea k (desde abajo). Con la convencion del sitio
    # (linea inferior = bit mas significativo), las hojas leidas de izquierda a
    # derecha deben ser exactamente 0..63.
    hojas = ['']
    for _ in range(6):
        hojas = [p + bit for p in hojas for bit in ('0', '1')]
    valores = [int(b, 2) for b in hojas]
    assert valores == list(range(64)), 'las hojas no reproducen el orden 0..63'
    # El camino de bits de la hoja i es exactamente la lectura del hexagrama i.
    for i, b in enumerate(hojas):
        assert BY_VALUE[i]['bits'] == b, f'hoja {i}: camino {b} != bits {BY_VALUE[i]["bits"]}'
    total_nodos = sum(2 ** n for n in range(7))
    assert total_nodos == 127

    print('11. El arbol de Fu Xi')
    print('   hojas de izquierda a derecha = orden binario 0..63  OK')
    print('   el camino raiz->hoja coincide bit a bit con las lineas del hexagrama  OK')
    print(f'   nodos del arbol: {total_nodos} (1+2+4+8+16+32+64)  OK')


# ----------------- 12. El bosque nuclear -----------------

def verificar_bosque():
    im1 = sorted(set(hu_gua(v) for v in range(64)))
    im2 = sorted(set(hu_gua(v) for v in im1))
    assert len(im1) == 16, f'primera imagen: {len(im1)}'
    assert len(im2) == 4, f'segunda imagen: {len(im2)}'
    QIAN, KUN = BY_KW[1]['valor'], BY_KW[2]['valor']
    JIJI, WEIJI = BY_KW[63]['valor'], BY_KW[64]['valor']
    assert set(im2) == {QIAN, KUN, JIJI, WEIJI}, 'la segunda imagen debe ser los 4 atractores'
    assert set(im2) <= set(im1), 'im2 debe estar contenida en im1'
    # La tercera aplicacion ya no reduce: hu(im2) == im2 como conjunto.
    assert sorted(set(hu_gua(v) for v in im2)) == im2

    kw16 = sorted(BY_VALUE[v]['kw'] for v in im1)
    print('12. El bosque nuclear')
    print(f'   imagenes del mapa: 64 -> {len(im1)} -> {len(im2)}  OK')
    print(f'   los 16 nucleares clasicos (numeros Rey Wen): {kw16}')
    print('   3 atractores (dos fijos + ciclo de 2), cuencas 16/16/32, caida <= 2:'
          ' verificado en la seccion 3  OK')


# ----------------- 13. La carrera de los ordenes (ampliacion del 09) -----------------

def verificar_ordenes():
    # Mawangdui: reconstruccion estandar del manuscrito de seda (c. 168 a.C.);
    # ver E. Shaughnessy, "I Ching: The Classic of Changes" (1996). Agrupa por
    # trigrama superior (Qian, Gen, Kan, Zhen, Kun, Dui, Li, Xun); dentro de cada
    # grupo abre el trigrama doblado y siguen los inferiores en el orden fijo
    # Qian, Kun, Gen, Dui, Kan, Li, Zhen, Xun.
    UP = ['Qian', 'Gen', 'Kan', 'Zhen', 'Kun', 'Dui', 'Li', 'Xun']
    LO = ['Qian', 'Kun', 'Gen', 'Dui', 'Kan', 'Li', 'Zhen', 'Xun']
    mwd = []
    for U in UP:
        mwd.append(value_of(bits_of(U, U)))
        for L in LO:
            if L != U:
                mwd.append(value_of(bits_of(L, U)))
    assert sorted(mwd) == list(range(64)), 'Mawangdui no es biyeccion'
    for b in range(8):
        bloque = mwd[8 * b:8 * b + 8]
        assert len({v & 7 for v in bloque}) == 1, f'bloque {b} mezcla trigramas superiores'
        assert bloque[0] >> 3 == bloque[0] & 7, f'bloque {b} no abre con el doblado'
    # Los primeros 8 en numeros Rey Wen deben ser 1, 12, 33, 10, 6, 13, 25, 44.
    assert [BY_VALUE[v]['kw'] for v in mwd[:8]] == [1, 12, 33, 10, 6, 13, 25, 44]

    # Jing Fang: los ocho palacios aplanados; coincide con la particion del
    # experimento de palacios (se reconstruye aqui de forma independiente).
    jf = [v for c in CABEZAS for v in palacio(c)]
    assert sorted(jf) == list(range(64)), 'Jing Fang no es biyeccion'
    vistos = set()
    for c in CABEZAS:
        p = set(palacio(c))
        assert len(p) == 8 and not (p & vistos), 'los palacios no particionan'
        vistos |= p

    rey_wen = [BY_KW[k + 1]['valor'] for k in range(64)]
    fu_xi = list(range(64))

    metricas = {}
    for nombre, perm in [('Rey Wen', rey_wen), ('Mawangdui', mwd),
                         ('Jing Fang', jf), ('Fu Xi', fu_xi)]:
        ciclos, longs, fijos, orden, paridad, inv = _metricas_perm(perm)
        metricas[nombre] = (len(ciclos), longs[0], len(fijos), orden, paridad, inv)

    # Valores fijados tras el primer calculo (cross-check con la tabla del sitio).
    assert metricas['Rey Wen'] == (3, 52, 0, 260, 'impar', 1013), metricas['Rey Wen']
    assert metricas['Mawangdui'] == (4, 50, 0, 600, 'par', 1008), metricas['Mawangdui']
    # Con el orden bagong autentico, Jing Fang empata con Mawangdui en 1008 inversiones.
    assert metricas['Jing Fang'] == (2, 57, 0, 399, 'par', 1008), metricas['Jing Fang']
    assert metricas['Fu Xi'] == (64, 1, 64, 1, 'par', 0), metricas['Fu Xi']

    # B3: costo en lineas (distancia de Hamming total entre consecutivos).
    ham = lambda a, b: bin(a ^ b).count('1')
    costo = lambda p: sum(ham(p[i], p[i + 1]) for i in range(len(p) - 1))
    gray = [n ^ (n >> 1) for n in range(64)]
    costos = {'Rey Wen': costo(rey_wen), 'Mawangdui': costo(mwd),
              'Jing Fang': costo(jf), 'Fu Xi': costo(fu_xi), 'Gray': costo(gray)}
    assert costos == {'Rey Wen': 211, 'Mawangdui': 141, 'Jing Fang': 93,
                      'Fu Xi': 120, 'Gray': 63}, costos
    assert costos['Gray'] == 63, 'el minimo teorico (Gray) debe ser 63'
    assert min(costos[k] for k in ('Rey Wen', 'Mawangdui', 'Jing Fang', 'Fu Xi')) == costos['Jing Fang']

    print('13. La carrera de los ordenes (ampliacion del experimento de permutacion)')
    for nombre, (nc, ml, nf, o, par, inv) in metricas.items():
        print(f'   {nombre:10s} ciclos {nc:2d} · mas largo {ml:2d} · fijos {nf:2d} · '
              f'orden {o:3d} · {par:5s} · inversiones {inv}/2016 · costo {costos[nombre]}')
    print('   Mawangdui: 8 bloques por trigrama superior, doblado al frente  OK')
    print('   Jing Fang: identico a la particion de los palacios  OK')
    print('   costo en lineas (B3): Gray 63 (minimo); Jing Fang 93 el mas suave; Rey Wen 211  OK')


# ----------------- 14. Simetrias D4 del cuadrado de Shao Yong -----------------

def verificar_d4():
    # Layout real del sitio: valorCelda(f, c) = (c << 3) | (7 - f).
    def valor_celda(f, c):
        return (c << 3) | (7 - f)

    def celda_de(v):
        return (7 - (v & 7), v >> 3)

    d3 = lambda t: 7 - t
    simetrias = [
        ('identidad',        lambda f, c: (f, c),          lambda v: v),
        ('espejo columnas',  lambda f, c: (f, 7 - c),      lambda v: (d3(v >> 3) << 3) | (v & 7)),
        ('espejo filas',     lambda f, c: (7 - f, c),      lambda v: ((v >> 3) << 3) | d3(v & 7)),
        ('rotacion 180',     lambda f, c: (7 - f, 7 - c),  lambda v: 63 - v),
        ('transposicion',    lambda f, c: (c, f),          lambda v: (d3(v & 7) << 3) | d3(v >> 3)),
        ('antitransposicion', lambda f, c: (7 - c, 7 - f), lambda v: ((v & 7) << 3) | (v >> 3)),
        ('rotacion 90',      lambda f, c: (c, 7 - f),      lambda v: ((v & 7) << 3) | d3(v >> 3)),
        ('rotacion 270',     lambda f, c: (7 - c, f),      lambda v: (d3(v & 7) << 3) | (v >> 3)),
    ]
    fijos_totales = 0
    for nombre, celda, op in simetrias:
        for v in range(64):
            f, c = celda_de(v)
            assert valor_celda(*celda(f, c)) == op(v), f'{nombre} falla en v={v}'
        fijos_totales += sum(1 for v in range(64) if op(v) == v)

    # Burnside: media de puntos fijos = numero de orbitas.
    assert fijos_totales / 8 == 10, f'Burnside debe dar 10 orbitas: {fijos_totales / 8}'
    # La antitransposicion (intercambio de trigramas) fija los 8 puros.
    puros = [v for v in range(64) if ((v & 7) << 3) | (v >> 3) == v]
    assert len(puros) == 8 and all(v >> 3 == (v & 7) for v in puros)
    # La transposicion fija los 8 con trigramas complementarios.
    comp = [v for v in range(64) if (d3(v & 7) << 3) | d3(v >> 3) == v]
    assert len(comp) == 8 and all((v >> 3) + (v & 7) == 7 for v in comp)

    print('14. Simetrias D4 del cuadrado de Shao Yong')
    print('   las 8 simetrias geometricas = 8 operaciones de trigramas, en los 64  OK')
    print('   antitransposicion fija los 8 puros; transposicion, los 8 complementarios  OK')
    print('   Burnside: 80 fijos entre 8 simetrias -> 10 orbitas  OK')


# ----------------- 15. Sistema de etiquetado en facetas -----------------

# Vocabulario cerrado (espejo de web/lib/experimentos.ts).
CATEGORIAS_VOCAB = {'geometria', 'algebra', 'historia', 'azar', 'practica'}
ETIQUETAS_VOCAB = {
    'hipercubo', 'binario', 'permutaciones', 'secuencias-historicas', 'trigramas',
    'hu-gua', 'simetrias', 'particiones', 'probabilidad', 'adivinacion', 'recorridos',
    'algebra-lineal', 'teoria-de-grupos', 'estadistica', 'leibniz', 'interdisciplinar',
    'consulta-propia',
}
TIPOS_VOCAB = {'visualizacion', 'simulador', 'calculadora', 'test', 'referencia'}
NIVELES_VOCAB = {'introductorio', 'intermedio', 'avanzado'}

# Etiquetas reservadas: en el vocabulario pero sin experimento publicado todavia
# (viven en el catalogo aun por construir: A1/A4, A2, D1).
RESERVADAS = {'algebra-lineal', 'teoria-de-grupos', 'interdisciplinar'}

# Asignacion de los publicados (slug: categoria, etiquetas, tipo, nivel).
ETIQUETADO = {
    'hipercubo':        ('geometria', ['hipercubo', 'binario', 'recorridos'], 'visualizacion', 'introductorio'),
    'palacios':         ('historia', ['secuencias-historicas', 'particiones', 'recorridos'], 'visualizacion', 'intermedio'),
    'mapa-lectura':     ('practica', ['consulta-propia', 'hipercubo', 'binario'], 'calculadora', 'introductorio'),
    'probabilidades':   ('azar', ['probabilidad', 'adivinacion'], 'visualizacion', 'introductorio'),
    'simetrias':        ('algebra', ['simetrias', 'hu-gua', 'hipercubo'], 'visualizacion', 'intermedio'),
    'trayectoria':      ('practica', ['consulta-propia', 'recorridos', 'hipercubo'], 'visualizacion', 'introductorio'),
    'rey-wen':          ('historia', ['secuencias-historicas', 'simetrias', 'binario'], 'visualizacion', 'introductorio'),
    'shao-yong':        ('historia', ['secuencias-historicas', 'trigramas', 'simetrias', 'leibniz'], 'visualizacion', 'intermedio'),
    'permutacion':      ('historia', ['permutaciones', 'secuencias-historicas', 'estadistica'], 'visualizacion', 'avanzado'),
    'ritual-milenrama': ('azar', ['adivinacion', 'probabilidad'], 'simulador', 'introductorio'),
    'dos-cielos':       ('historia', ['trigramas', 'permutaciones', 'simetrias'], 'visualizacion', 'intermedio'),
    'sombras-6-cubo':   ('geometria', ['hipercubo', 'simetrias'], 'visualizacion', 'intermedio'),
    'reticulo-b6':      ('geometria', ['hipercubo', 'binario', 'recorridos'], 'visualizacion', 'avanzado'),
    'arbol-fuxi':       ('geometria', ['binario', 'secuencias-historicas', 'recorridos'], 'visualizacion', 'introductorio'),
    'bosque-nuclear':   ('algebra', ['hu-gua', 'particiones', 'hipercubo'], 'visualizacion', 'intermedio'),
    'matriz-nuclear':   ('algebra', ['hu-gua', 'algebra-lineal', 'binario'], 'visualizacion', 'avanzado'),
    'serpiente-debruijn': ('geometria', ['recorridos', 'binario', 'hipercubo'], 'visualizacion', 'intermedio'),
    'grupo-sierpinski': ('algebra', ['teoria-de-grupos', 'particiones', 'binario'], 'visualizacion', 'intermedio'),
    'rey-wen-aleatorio': ('historia', ['estadistica', 'permutaciones', 'secuencias-historicas'], 'test', 'avanzado'),
    'markov-consultas': ('azar', ['probabilidad', 'adivinacion', 'hipercubo'], 'simulador', 'avanzado'),
    'comparador-sorteo': ('azar', ['adivinacion', 'probabilidad', 'estadistica'], 'simulador', 'introductorio'),
    'comparador-particiones': ('algebra', ['particiones', 'estadistica'], 'calculadora', 'avanzado'),
    'espectro-walsh': ('algebra', ['algebra-lineal', 'secuencias-historicas', 'estadistica'], 'test', 'avanzado'),
    'conteos-astronomicos': ('geometria', ['hipercubo', 'recorridos'], 'referencia', 'intermedio'),
    'paseo-aleatorio': ('azar', ['probabilidad', 'recorridos', 'hipercubo'], 'simulador', 'intermedio'),
    'leibniz-documentos': ('historia', ['leibniz', 'binario'], 'referencia', 'introductorio'),
    'codones': ('algebra', ['interdisciplinar', 'binario'], 'visualizacion', 'intermedio'),
}


def verificar_matriz_nuclear():
    """A1: hu gua como matriz sobre F2. M aplicada a los 64 = hu_gua; ranks 4 y 2; M^4=M^2."""
    # M: fila i = linea de salida i+1; salida = (l2,l3,l4,l3,l4,l5).
    M = [
        [0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0],
    ]

    def vec(v):
        return [(v >> (5 - i)) & 1 for i in range(6)]

    def val(x):
        r = 0
        for i, b in enumerate(x):
            r |= b << (5 - i)
        return r

    def matvec(A, x):
        return [sum(a & x[j] for j, a in enumerate(fila)) & 1 for fila in A]

    def matmul(A, B):
        return [[sum(A[i][k] & B[k][j] for k in range(6)) & 1 for j in range(6)] for i in range(6)]

    def rank(A):
        m = [row[:] for row in A]
        r = 0
        for col in range(6):
            piv = next((i for i in range(r, 6) if m[i][col]), None)
            if piv is None:
                continue
            m[r], m[piv] = m[piv], m[r]
            for i in range(6):
                if i != r and m[i][col]:
                    m[i] = [a ^ b for a, b in zip(m[i], m[r])]
            r += 1
        return r

    # M reproduce hu gua bit a bit.
    for v in range(64):
        assert val(matvec(M, vec(v))) == hu_gua(v), f'M != hu gua en {v}'
    M2 = matmul(M, M)
    M4 = matmul(M2, M2)
    assert rank(M) == 4 and rank(M2) == 2, (rank(M), rank(M2))
    assert M4 == M2, 'debe cumplirse M^4 = M^2'
    img2 = sorted({val(matvec(M2, vec(v))) for v in range(64)})
    assert img2 == [0, 21, 42, 63], f'imagen de M^2: {img2}'

    print('15. El operador nuclear como matriz (A1)')
    print('   M aplicada a los 64 coincide con hu gua bit a bit  OK')
    print('   rank(M)=4 (imagen 16), rank(M^2)=2 (imagen 4), M^4=M^2  OK')
    print('   imagen de M^2 = {0,21,42,63} = Kun, Wei Ji, Ji Ji, Qian  OK')


def verificar_codones():
    """D1: los 64 codones. Biyeccion hexagrama<->codon; 4!=24 codificaciones;
    tabla de aminoacidos del codigo estandar (NCBI). Ninguna codificacion canonica."""
    from itertools import permutations
    bases = ['A', 'C', 'G', 'U']
    encs = [list(p) for p in permutations(bases)]
    assert len(encs) == 24, 'deben ser 4! = 24 codificaciones'

    def hex_a_codon(v, enc):
        return enc[(v >> 4) & 3] + enc[(v >> 2) & 3] + enc[v & 3]

    # cada codificacion es una biyeccion hexagrama -> codon
    for enc in encs:
        cods = {hex_a_codon(v, enc) for v in range(64)}
        assert len(cods) == 64, 'codificacion no biyectiva'

    # codigo genetico estandar: 64 codones definidos (NCBI, tabla 1)
    codigo = {
        'UUU': 'F', 'UUC': 'F', 'UUA': 'L', 'UUG': 'L', 'UCU': 'S', 'UCC': 'S', 'UCA': 'S', 'UCG': 'S',
        'UAU': 'Y', 'UAC': 'Y', 'UAA': '*', 'UAG': '*', 'UGU': 'C', 'UGC': 'C', 'UGA': '*', 'UGG': 'W',
        'CUU': 'L', 'CUC': 'L', 'CUA': 'L', 'CUG': 'L', 'CCU': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
        'CAU': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q', 'CGU': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
        'AUU': 'I', 'AUC': 'I', 'AUA': 'I', 'AUG': 'M', 'ACU': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
        'AAU': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K', 'AGU': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
        'GUU': 'V', 'GUC': 'V', 'GUA': 'V', 'GUG': 'V', 'GCU': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
        'GAU': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E', 'GGU': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G',
    }
    assert len(codigo) == 64 and codigo['AUG'] == 'M' and codigo['UAA'] == '*'
    assert sum(1 for a in codigo.values() if a == '*') == 3, 'deben ser 3 codones de parada'
    # ninguna codificacion es canonica: cambiar el encoding cambia el aminoacido de algun hexagrama
    difieren = any(codigo[hex_a_codon(v, encs[0])] != codigo[hex_a_codon(v, encs[1])] for v in range(64))
    assert difieren, 'dos codificaciones distintas dan el mismo mapeo?'

    print('27. Los 64 codones (D1)')
    print('   64 = 4^3 = 2^6; cada codificacion base->bits es biyectiva  OK')
    print('   4! = 24 codificaciones, ninguna canonica; el mapeo cambia con la eleccion  OK')
    print('   tabla del codigo genetico estandar (NCBI): 64 codones, 3 de parada  OK')


def verificar_leibniz():
    """D2: pagina de referencia historica. Sin asercion numerica; la suite comprueba
    que la entrada existe y esta bien etiquetada (tipo referencia, etiquetas leibniz/binario)."""
    e = ETIQUETADO['leibniz-documentos']
    assert e == ('historia', ['leibniz', 'binario'], 'referencia', 'introductorio'), e
    print('26. Leibniz: los documentos (D2)')
    print('   entrada de referencia, bien etiquetada (leibniz, binario)  OK')
    print('   cada afirmacion historica lleva su fuente en la pagina (1703, Bouvet, Ryan 1996)')


def verificar_paseo():
    """C2: paseo aleatorio simple. Retorno esperado = 64 (estacionaria uniforme);
    cover time simulado con semilla fija dentro de una banda."""
    import random
    # matriz doblemente estocastica -> estacionaria uniforme -> retorno medio = 64
    cols = [0.0] * 64
    for i in range(64):
        fila = 0.0
        for k in range(1, 7):
            j = i ^ LINE_BIT(k)
            fila += 1 / 6
            cols[j] += 1 / 6
        assert abs(fila - 1) < 1e-12
    assert all(abs(c - 1) < 1e-12 for c in cols), 'no doblemente estocastica'

    rng = random.Random(20260722)

    def cover():
        v = 0; vis = {0}; steps = 0
        while len(vis) < 64:
            v ^= LINE_BIT(1 + rng.randrange(6)); steps += 1; vis.add(v)
        return steps

    T = 1500
    cs = [cover() for _ in range(T)]
    media = sum(cs) / T
    assert min(cs) >= 63, 'cubrir 64 requiere al menos 63 pasos'
    assert 320 < media < 400, f'cover time fuera de banda: {media}'

    # retorno: la simulacion confirma ~64
    def ret():
        v = 0; steps = 0
        while True:
            v ^= LINE_BIT(1 + rng.randrange(6)); steps += 1
            if v == 0:
                return steps
    R = 8000
    mr = sum(ret() for _ in range(R)) / R
    assert abs(mr - 64) < 3, f'retorno medio {mr} lejos de 64'

    print('25. Paseo aleatorio y cobertura (C2)')
    print('   matriz doblemente estocastica -> estacionaria uniforme  OK')
    print(f'   tiempo de retorno al origen: teoria 64, simulado {mr:.2f}  OK')
    print(f'   cover time (semilla fija, T={T}): media {media:.1f} en la banda [320, 400]  OK')


def verificar_conteos():
    """B4: conteos con formula cerrada del cubo Q6. Los citados (Gray ciclicos) no
    se computan; en el sitio van con fuente (OEIS), sin reproducir digitos."""
    from math import factorial
    dist = [comb(6, k) for k in range(7)]
    assert dist == [1, 6, 15, 20, 15, 6, 1] and sum(dist) == 64
    assert 2 ** 6 * factorial(6) == 46080, 'automorfismos'  # Z2 wr S6
    assert 2 ** (2 ** 5 - 6) == 67108864, 'De Bruijn = 2^26'
    assert factorial(6) == 720, 'cadenas maximales'
    assert 6 * 2 ** 6 // 2 == 192, 'aristas'
    print('24. Conteos astronomicos del cubo (B4)')
    print('   automorfismos 2^6 * 6! = 46080; De Bruijn 2^26 = 67108864  OK')
    print('   distancias C(6,k) = 1,6,15,20,15,6,1 (suman 64); cadenas 6! = 720  OK')
    print('   ciclos hamiltonianos de Q6: citados a OEIS (no se reproducen)  OK')


def verificar_walsh():
    """A4: Walsh-Hadamard de la secuencia del Rey Wen. Parseval, delta, involucion,
    y energia por orden (la estructura vive en orden 2)."""
    def wht(f):
        return [sum(f[v] * (-1 if bin(w & v).count('1') & 1 else 1) for v in range(64)) for w in range(64)]

    senal = [BY_VALUE[v]['kw'] for v in range(64)]
    F = wht(senal)
    # Parseval
    assert sum(x * x for x in F) == 64 * sum(x * x for x in senal), 'Parseval'
    # delta -> constante
    delta = [1] + [0] * 63
    assert len(set(wht(delta))) == 1, 'WHT(delta) no constante'
    # involucion
    assert wht(F) == [64 * s for s in senal], 'WHT^2 != 64 f'
    # DC = 64 * media
    assert F[0] == 2080
    # energia por orden
    en = [0] * 7
    for w in range(64):
        en[bin(w).count('1')] += F[w] * F[w]
    assert en == [4326400, 57856, 703072, 199616, 379232, 57728, 256], en
    sin_dc = sum(en) - en[0]
    assert en[2] / sin_dc > 0.5 and en[1] / sin_dc < 0.05  # orden 2 domina, orden 1 minimo

    print('23. El espectro de Walsh-Hadamard (A4)')
    print('   Parseval, WHT(delta)=cte, WHT^2 = 64 f  OK')
    print(f'   energia sin DC: orden 2 = {en[2]/sin_dc*100:.1f}% (pares de lineas), orden 1 = {en[1]/sin_dc*100:.1f}%  OK')
    print('   la estructura del Rey Wen vive en interacciones de a dos, no en la lineal  OK')


def verificar_particiones():
    """A3: comparador de particiones (ARI). Palacios != cosets; mascaras no subgrupo."""
    from math import comb
    from collections import defaultdict
    # particiones (reconstruidas de forma independiente)
    pal = {}
    for pi, c in enumerate(CABEZAS):
        for v in palacio(c):
            pal[v] = pi
    # cuencas nucleares
    en = [False] * 64
    for v in range(64):
        s = f = v
        while True:
            s = hu_gua(s)
            f = hu_gua(hu_gua(f))
            if s == f:
                break
        c = s
        while True:
            en[c] = True
            c = hu_gua(c)
            if c == s:
                break
    idc = [-1] * 64
    ncy = 0
    for v in range(64):
        if en[v] and idc[v] == -1:
            c = v
            while True:
                idc[c] = ncy
                c = hu_gua(c)
                if c == v:
                    break
            ncy += 1
    cuenca = {}
    for v in range(64):
        c = v
        while not en[c]:
            c = hu_gua(c)
        cuenca[v] = idc[c]
    coset = {v: (v >> 3) ^ (v & 7) for v in range(64)}
    triinf = {v: v >> 3 for v in range(64)}
    trisup = {v: v & 7 for v in range(64)}
    parts = {'palacios': pal, 'cuencas': cuenca, 'cosets': coset, 'tri_inf': triinf, 'tri_sup': trisup}

    def ari(A, B):
        ct = defaultdict(int); a = defaultdict(int); b = defaultdict(int)
        for v in range(64):
            ct[(A[v], B[v])] += 1; a[A[v]] += 1; b[B[v]] += 1
        sij = sum(comb(n, 2) for n in ct.values())
        sa = sum(comb(n, 2) for n in a.values()); sb = sum(comb(n, 2) for n in b.values())
        exp = sa * sb / comb(64, 2); mx = (sa + sb) / 2
        return 1.0 if mx == exp else (sij - exp) / (mx - exp)

    # propiedades del ARI: identidad = 1, simetria
    for n, p in parts.items():
        assert abs(ari(p, p) - 1) < 1e-9, f'ARI({n},{n}) != 1'
    for n1 in parts:
        for n2 in parts:
            assert abs(ari(parts[n1], parts[n2]) - ari(parts[n2], parts[n1])) < 1e-9

    # palacios != cosets; mascaras de generacion no forman subgrupo
    assert any(pal[v] != coset[v] for v in range(64)), 'palacios no deberia ser cosets'
    puros = [value_of(bits_of(c, c)) for c in CABEZAS]
    M = set(v ^ puros[0] for v in palacio('Qian'))
    sub = all((a ^ b) in M for a in M for b in M)
    assert not sub, 'las mascaras de generacion no deberian ser subgrupo'
    assert abs(ari(pal, coset) - (-0.125)) < 1e-4, ari(pal, coset)

    print('22. Comparador de particiones (A3)')
    print('   ARI: identidad = 1 y simetrico  OK')
    print(f'   mascaras de generacion {sorted(M)}: subgrupo? {sub}  OK')
    print(f'   palacios vs cosets: ARI = {ari(pal, coset):+.4f} (mas distintas que el azar)  OK')


def verificar_sorteo():
    """C3: comparador de metodos. Fichas = milenrama; monedas != milenrama;
    frecuencias simuladas convergen a la teoria (chi2 bajo umbral, semilla fija)."""
    import random
    fichas = {9: 3, 8: 7, 7: 5, 6: 1}
    assert fichas == SESAVOS['milenrama'], 'las 16 fichas deben reproducir la milenrama'
    assert SESAVOS['monedas'] != SESAVOS['milenrama'], 'monedas y milenrama son distintas'
    for m, d in [('monedas', SESAVOS['monedas']), ('milenrama', SESAVOS['milenrama']), ('fichas', fichas)]:
        assert sum(d.values()) == 16, f'{m} no suma 16/16'
        # P(muta) = viejo yin + viejo yang = 1/4 en los tres
        assert (d[6] + d[9]) / 16 == 0.25, f'{m}: P(muta) != 1/4'

    def sim(d, n, rng):
        estados = [9, 8, 7, 6]
        cnt = {e: 0 for e in estados}
        for _ in range(n):
            r = rng.random() * 16
            acc = 0
            for e in estados:
                acc += d[e]
                if r < acc:
                    cnt[e] += 1
                    break
        chi2 = sum((cnt[e] - n * d[e] / 16) ** 2 / (n * d[e] / 16) for e in estados)
        return chi2

    rng = random.Random(20260722)
    chis = {m: sim(d, 50000, rng) for m, d in
            [('monedas', SESAVOS['monedas']), ('milenrama', SESAVOS['milenrama']), ('fichas', fichas)]}
    # chi2 con 3 gl: umbral 16.27 (p=0.001). Con semilla fija todas quedan por debajo.
    for m, c in chis.items():
        assert c < 16.27, f'{m}: chi2={c} no converge'

    print('21. Comparador de metodos de sorteo (C3)')
    print('   16 fichas (3/7/5/1) identicas a la milenrama; monedas distintas  OK')
    print('   P(muta) = 1/4 en los tres metodos  OK')
    print(f'   simulacion 50000 lineas, semilla fija: chi2 ' +
          ' '.join(f'{m}={c:.2f}' for m, c in chis.items()) + ' (< 16.27)  OK')


def verificar_markov():
    """C1: cadena de Markov de las consultas. Estacionaria cerrada; piP=pi.
    Monedas uniforme; milenrama sesgada al yin (corr -0.73, Kun/Qian = 729)."""
    pc = lambda v: bin(v).count('1')

    def q(m):
        d = SESAVOS[m]
        return d[9] / (d[9] + d[7]), d[6] / (d[6] + d[8])

    def matriz(m):
        qy, qi = q(m)
        P = [[0.0] * 64 for _ in range(64)]
        for i in range(64):
            for mask in range(64):
                j = i ^ mask
                p = 1.0
                for k in range(6):
                    yang = (i >> (5 - k)) & 1
                    muta = (mask >> (5 - k)) & 1
                    qq = qy if yang else qi
                    p *= qq if muta else (1 - qq)
                P[i][j] += p
        return P

    def estacionaria(m):
        qy, qi = q(m)
        py = qi / (qy + qi)
        return [py ** pc(v) * (1 - py) ** (6 - pc(v)) for v in range(64)]

    def corr(pi):
        xs = [pc(v) for v in range(64)]
        mx = sum(xs) / 64
        my = sum(pi) / 64
        sx = (sum((x - mx) ** 2 for x in xs) / 64) ** 0.5
        sy = (sum((y - my) ** 2 for y in pi) / 64) ** 0.5
        if sx == 0 or sy == 0:
            return 0.0
        return sum((xs[i] - mx) * (pi[i] - my) for i in range(64)) / 64 / (sx * sy)

    resultados = {}
    for m in ('monedas', 'milenrama'):
        P = matriz(m)
        # cada fila suma 1
        assert all(abs(sum(r) - 1) < 1e-12 for r in P), f'{m}: filas'
        pi = estacionaria(m)
        assert abs(sum(pi) - 1) < 1e-12
        # piP = pi dentro de 1e-9
        piP = [sum(pi[i] * P[i][j] for i in range(64)) for j in range(64)]
        assert max(abs(piP[j] - pi[j]) for j in range(64)) < 1e-9, f'{m}: piP!=pi'
        qy, qi = q(m)
        lam2 = 1 - qy - qi
        resultados[m] = (pi, corr(pi), sum(pi[v] * pc(v) for v in range(64)), lam2)

    pi_mon, c_mon, ey_mon, lam_mon = resultados['monedas']
    pi_mil, c_mil, ey_mil, lam_mil = resultados['milenrama']
    assert all(abs(p - 1 / 64) < 1e-12 for p in pi_mon), 'monedas no uniforme'
    assert abs(c_mon) < 1e-9 and abs(ey_mon - 3.0) < 1e-9
    assert abs(c_mil - (-0.7300)) < 1e-4, c_mil
    assert abs(ey_mil - 1.5) < 1e-9
    assert abs(pi_mil[0] / pi_mil[63] - 729) < 1e-6  # Kun/Qian = 3^6
    assert abs(lam_mon - 0.5) < 1e-12 and abs(lam_mil - 0.5) < 1e-12

    print('20. La cadena de Markov de las consultas (C1)')
    print('   piP=pi (forma cerrada), cada fila de P suma 1  OK')
    print(f'   monedas: estacionaria uniforme (corr {c_mon:.2f}, yang esperado {ey_mon:.1f})  OK')
    print(f'   milenrama: sesgo al yin (corr {c_mil:.2f}, yang esperado {ey_mil:.1f}, Kun/Qian = 729)  OK')
    print('   ambos mezclan igual (lambda2 = 0.5, relajacion 2 pasos), a destinos distintos  OK')


def verificar_rey_wen_aleatorio():
    """B2: test de hipotesis. Nula = barajado que respeta la regla de pares.
    N=20000, semilla fija. Media/sigma congeladas; el generador respeta pares."""
    import random
    pairs = [(BY_KW[2 * k - 1]['valor'], BY_KW[2 * k]['valor']) for k in range(1, 33)]
    validos = set()
    for a, b in pairs:
        validos.add((a, b))
        validos.add((b, a))

    def inv(seq):
        bit = [0] * 65
        c = 0
        for x in reversed(seq):
            i = x
            while i > 0:
                c += bit[i]
                i -= i & -i
            i = x + 1
            while i <= 64:
                bit[i] += 1
                i += i & -i
        return c

    ham = lambda a, b: bin(a ^ b).count('1')
    cost = lambda s: sum(ham(s[i], s[i + 1]) for i in range(63))
    real = [BY_KW[k + 1]['valor'] for k in range(64)]
    real_inv, real_cost = inv(real), cost(real)
    assert real_inv == 1013 and real_cost == 211

    SEED, N = 20260722, 20000
    rng = random.Random(SEED)
    invs, costs = [], []
    for _ in range(N):
        pr = pairs[:]
        rng.shuffle(pr)
        seq = []
        for a, b in pr:
            if rng.random() < 0.5:
                a, b = b, a
            seq += [a, b]
        # el generador respeta la regla de pares y es una permutacion de 0..63
        assert len(set(seq)) == 64
        assert all((seq[i], seq[i + 1]) in validos for i in range(0, 64, 2))
        invs.append(inv(seq))
        costs.append(cost(seq))

    mi = sum(invs) / N
    si = (sum((x - mi) ** 2 for x in invs) / N) ** 0.5
    mc = sum(costs) / N
    sc = (sum((x - mc) ** 2 for x in costs) / N) ** 0.5
    p_inv = sum(1 for x in invs if abs(x - mi) >= abs(real_inv - mi)) / N
    p_cost = sum(1 for x in costs if abs(x - mc) >= abs(real_cost - mc)) / N

    # Congelados (deben coincidir con web/lib/aleatorio-reywen.ts).
    assert abs(mi - 1009.1236) < 1e-3 and abs(si - 80.3191) < 1e-3, (mi, si)
    assert abs(mc - 214.0762) < 1e-3 and abs(sc - 6.4934) < 1e-3, (mc, sc)
    assert abs(p_inv - 0.9662) < 1e-4 and abs(p_cost - 0.6499) < 1e-4, (p_inv, p_cost)

    print('19. Es el Rey Wen aleatorio? (B2)')
    print(f'   nula (regla de pares), N={N}, semilla {SEED}; generador valido  OK')
    print(f'   inversiones: real {real_inv} vs media {mi:.1f} (sigma {si:.1f}) -> z={(real_inv-mi)/si:.3f}, p={p_inv:.4f}')
    print(f'   costo: real {real_cost} vs media {mc:.1f} (sigma {sc:.1f}) -> z={(real_cost-mc)/sc:.3f}, p={p_cost:.4f}')
    print('   indistinguible de aleatorio bajo su propia regla de pares  (hallazgo legitimo)')


def verificar_grupo_sierpinski():
    """A2: (Z/2)^6 con XOR; subgrupo de puros y sus cosets; matriz = Pascal mod 2."""
    puros = [v for v in range(64) if v >> 3 == (v & 7)]
    assert len(puros) == 8
    sp = set(puros)
    for a in puros:
        for b in puros:
            assert (a ^ b) in sp, 'los puros no son cerrados bajo XOR'
    # 8 cosets por (upper XOR lower); particionan.
    cosets = {}
    for v in range(64):
        cosets.setdefault((v >> 3) ^ (v & 7), []).append(v)
    assert len(cosets) == 8 and all(len(c) == 8 for c in cosets.values())
    assert sum(len(c) for c in cosets.values()) == 64

    # La matriz de dominancia (j submascara de i) coincide con C(i,j) mod 2 (Lucas).
    from math import comb
    unos = 0
    for i in range(64):
        for j in range(64):
            dom = 1 if (i & j) == j else 0
            assert dom == comb(i, j) % 2, f'Lucas falla en ({i},{j})'
            unos += dom
    assert unos == 3 ** 6, f'unos del Sierpinski: {unos}'
    # Autosimilaridad recursiva S = [[S,0],[S,S]].
    def S(i, j):
        return 1 if (i & j) == j else 0
    for i in range(32):
        for j in range(32):
            assert S(i, j + 32) == 0
            assert S(i + 32, j) == S(i, j) and S(i + 32, j + 32) == S(i, j)

    print('17. El grupo (Z/2)^6 y el Sierpinski (A2)')
    print('   (Z/2)^6 con XOR; los 8 puros cerrados bajo XOR (subgrupo)  OK')
    print('   8 cosets por (upper XOR lower) particionan los 64  OK')
    print(f'   matriz de dominancia = Pascal mod 2 (Lucas); {unos} = 3^6 unos; recursion de Sierpinski  OK')


def verificar_debruijn():
    """B1: secuencia de De Bruijn B(2,6) canonica; las 64 ventanas son {0..63}."""
    def fkm(n, k=2):
        a = [0] * (k * n)
        seq = []
        def db(t, p):
            if t > n:
                if n % p == 0:
                    seq.extend(a[1:p + 1])
            else:
                a[t] = a[t - p]
                db(t + 1, p)
                for j in range(a[t - p] + 1, k):
                    a[t] = j
                    db(t + 1, t)
        db(1, 1)
        return seq

    s = fkm(6)
    assert len(s) == 64, 'la secuencia debe tener 64 bits'
    wins = []
    for i in range(64):
        v = 0
        for x in range(6):
            v |= s[(i + x) % 64] << (5 - x)
        wins.append(v)
    assert sorted(wins) == list(range(64)), 'las 64 ventanas no cubren {0..63}'
    assert 2 ** (2 ** 5 - 6) == 67108864, 'deben ser 2^26 secuencias'

    print('16. La serpiente de De Bruijn (B1)')
    print('   B(2,6) canonica de 64 bits: cada ventana de 6 es un hexagrama distinto  OK')
    print('   las 64 ventanas ciclicas = {0..63} sin repetir; 2^26 anillos posibles  OK')


def verificar_etiquetado():
    usadas = set()
    por_cat = {c: 0 for c in CATEGORIAS_VOCAB}
    for slug, (cat, tags, tipo, nivel) in ETIQUETADO.items():
        assert cat in CATEGORIAS_VOCAB, f'{slug}: categoria invalida {cat}'
        assert 2 <= len(tags) <= 4, f'{slug}: debe tener 2 a 4 etiquetas, tiene {len(tags)}'
        assert len(tags) == len(set(tags)), f'{slug}: etiquetas repetidas'
        for t in tags:
            assert t in ETIQUETAS_VOCAB, f'{slug}: etiqueta fuera del vocabulario: {t}'
        assert tipo in TIPOS_VOCAB, f'{slug}: tipo invalido {tipo}'
        assert nivel in NIVELES_VOCAB, f'{slug}: nivel invalido {nivel}'
        usadas.update(tags)
        por_cat[cat] += 1

    # Distribucion de los publicados: ninguna categoria vacia.
    assert por_cat == {'geometria': 6, 'historia': 7, 'algebra': 7, 'azar': 5, 'practica': 2}, por_cat

    # Con el catalogo completo (27 experimentos), el vocabulario de 17 debe estar
    # totalmente cubierto: ninguna etiqueta muerta.
    sin_uso = ETIQUETAS_VOCAB - usadas
    assert sin_uso == set(), f'etiquetas del vocabulario sin uso: {sorted(sin_uso)}'

    print('18. Sistema de etiquetado en facetas')
    print(f'   {len(ETIQUETADO)} experimentos: 1 categoria, 2 a 4 etiquetas del vocabulario cerrado  OK')
    print(f'   distribucion por categoria {por_cat}  (ninguna vacia)  OK')
    print(f'   vocabulario de {len(ETIQUETAS_VOCAB)} etiquetas: completamente cubierto (0 muertas)  OK')


if __name__ == '__main__':
    verificar_palacios()
    print()
    verificar_oraculo()
    print()
    verificar_simetrias()
    print()
    verificar_rey_wen()
    print()
    verificar_shao_yong()
    print()
    verificar_permutacion()
    print()
    verificar_milenrama()
    print()
    verificar_dos_cielos()
    print()
    verificar_sombras()
    print()
    verificar_reticulo()
    print()
    verificar_arbol()
    print()
    verificar_bosque()
    print()
    verificar_ordenes()
    print()
    verificar_d4()
    print()
    verificar_matriz_nuclear()
    print()
    verificar_debruijn()
    print()
    verificar_grupo_sierpinski()
    print()
    verificar_rey_wen_aleatorio()
    print()
    verificar_markov()
    print()
    verificar_sorteo()
    print()
    verificar_particiones()
    print()
    verificar_walsh()
    print()
    verificar_conteos()
    print()
    verificar_paseo()
    print()
    verificar_leibniz()
    print()
    verificar_codones()
    print()
    verificar_etiquetado()
    print()
    print('Todas las afirmaciones de los experimentos verificadas.')
