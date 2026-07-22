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

# ————————————————————— 1. Palacios de Jing Fang —————————————————————

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


# ————————————————————— 2. Monedas vs milenrama —————————————————————

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


# ————————————————————— 3. Simetrias del hipercubo —————————————————————

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


# ————————————————————— 4. Secuencia del Rey Wen —————————————————————

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


# ————————————————————— 5. Cuadrado y circulo de Shao Yong —————————————————————

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


# ————————————————————— 6. Rey Wen como permutacion —————————————————————

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
    assert por_cat == {'geometria': 4, 'historia': 5, 'algebra': 3, 'azar': 2, 'practica': 2}, por_cat

    # Etiquetas sin uso: deben ser exactamente las reservadas para el catalogo.
    sin_uso = ETIQUETAS_VOCAB - usadas
    assert sin_uso <= RESERVADAS, f'etiqueta muerta fuera de las reservadas: {sin_uso - RESERVADAS}'

    print('16. Sistema de etiquetado en facetas')
    print(f'   {len(ETIQUETADO)} experimentos: 1 categoria, 2 a 4 etiquetas del vocabulario cerrado  OK')
    print(f'   distribucion por categoria {por_cat}  (ninguna vacia)  OK')
    print(f'   etiquetas reservadas (sin publicar aun): {sorted(sin_uso)}')


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
    verificar_etiquetado()
    print()
    print('Todas las afirmaciones de los experimentos verificadas.')
