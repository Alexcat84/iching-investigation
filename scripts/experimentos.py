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
    'combinatoria', 'fisica', 'consulta-propia',
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
    'reticulo-b6':      ('geometria', ['hipercubo', 'binario', 'recorridos', 'combinatoria'], 'visualizacion', 'avanzado'),
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
    'conteos-astronomicos': ('geometria', ['hipercubo', 'recorridos', 'combinatoria'], 'referencia', 'intermedio'),
    'paseo-aleatorio': ('azar', ['probabilidad', 'recorridos', 'hipercubo'], 'simulador', 'intermedio'),
    'leibniz-documentos': ('historia', ['leibniz', 'binario'], 'referencia', 'introductorio'),
    'codones': ('algebra', ['interdisciplinar', 'binario'], 'visualizacion', 'intermedio'),
    'calendario-soberanos': ('historia', ['secuencias-historicas', 'recorridos', 'hipercubo'], 'visualizacion', 'introductorio'),
    'fibonacci-hexagrama': ('algebra', ['combinatoria', 'binario', 'simetrias'], 'visualizacion', 'introductorio'),
    'ising-hexagrama': ('azar', ['probabilidad', 'hipercubo', 'fisica'], 'simulador', 'intermedio'),
    'entropia-oraculo': ('azar', ['probabilidad', 'adivinacion', 'estadistica'], 'visualizacion', 'introductorio'),
    'matriz-transferencia': ('algebra', ['combinatoria', 'algebra-lineal', 'binario'], 'calculadora', 'avanzado'),
    'espectro-q6': ('algebra', ['algebra-lineal', 'hipercubo'], 'visualizacion', 'avanzado'),
    'fourier-anillo': ('algebra', ['algebra-lineal', 'secuencias-historicas', 'hipercubo'], 'visualizacion', 'avanzado'),
    'influencias-lineas': ('algebra', ['combinatoria', 'algebra-lineal', 'binario'], 'calculadora', 'intermedio'),
    'cubo-dice-no': ('geometria', ['combinatoria', 'hipercubo', 'teoria-de-grupos'], 'visualizacion', 'intermedio'),
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
    # Cierre B2 <-> A4: los ordenes pares 2 y 4 concentran la energia frente al azar.
    num = [0] * 7
    for w in range(64):
        num[bin(w).count('1')] += 1
    assert num == [1, 6, 15, 20, 15, 6, 1], num
    frac_pares = (en[2] + en[4]) / sin_dc
    frac_pares_azar = (num[2] + num[4]) / (sum(num) - num[0])
    assert abs(frac_pares - 0.7743) < 0.001, frac_pares
    assert abs(frac_pares_azar - 30 / 63) < 1e-9, frac_pares_azar

    # Fourier sobre (Z/2)^6: la transformada mariposa es el producto tensorial de seis
    # matrices de Hadamard, H tensor 6, y coincide con la definicion directa.
    H2 = [[1, 1], [1, -1]]

    def kron(A, B):
        return [[A[i // len(B)][j // len(B[0])] * B[i % len(B)][j % len(B[0])]
                 for j in range(len(A[0]) * len(B[0]))]
                for i in range(len(A) * len(B))]

    H6 = [[1]]
    for _ in range(6):
        H6 = kron(H6, H2)
    F_mariposa = [sum(H6[w][v] * senal[v] for v in range(64)) for w in range(64)]
    assert F_mariposa == F, 'H tensor 6 no coincide con la transformada directa'

    print('23. Fourier sobre el cubo: la transformada de Walsh-Hadamard (A4)')
    print('   Parseval, WHT(delta)=cte, WHT^2 = 64 f  OK')
    print('   analisis de Fourier sobre (Z/2)^6: la mariposa == H tensor 6 (Hadamard)  OK')
    print(f'   energia sin DC: orden 2 = {en[2]/sin_dc*100:.1f}% (pares de lineas), orden 1 = {en[1]/sin_dc*100:.1f}%  OK')
    print(f'   ordenes pares 2 y 4 = {frac_pares*100:.1f}% vs {frac_pares_azar*100:.1f}% del azar: confirma B2 por otra via  OK')
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

    # Teorema de Perron-Frobenius: la matriz de transicion es estrictamente positiva, asi
    # que 1 es un autovalor simple y estrictamente dominante. Con monedas la matriz es
    # simetrica y los caracteres de Walsh son autovectores con autovalor 0.5^popcount(w):
    # 1 aparece solo en w=0 (simple) y el segundo modulo es 0.5.
    Pm = matriz('monedas')
    assert all(Pm[i][j] > 0 for i in range(64) for j in range(64)), 'P no es estrictamente positiva'
    chi = lambda w, v: -1 if bin(w & v).count('1') & 1 else 1
    autovals = []
    for w in range(64):
        Pchi = [sum(Pm[i][v] * chi(w, v) for v in range(64)) for i in range(64)]
        lam = 0.5 ** bin(w).count('1')
        assert all(abs(Pchi[i] - lam * chi(w, i)) < 1e-12 for i in range(64)), f'chi_{w} no autovector'
        autovals.append(lam)
    mult1 = sum(1 for x in autovals if abs(x - 1) < 1e-12)
    segundo = max(x for x in autovals if abs(x - 1) > 1e-12)
    assert mult1 == 1, 'el autovalor 1 no es simple'
    assert abs(segundo - 0.5) < 1e-12, segundo

    print('20. La cadena de Markov de las consultas (C1)')
    print('   piP=pi (forma cerrada), cada fila de P suma 1  OK')
    print(f'   monedas: estacionaria uniforme (corr {c_mon:.2f}, yang esperado {ey_mon:.1f})  OK')
    print(f'   milenrama: sesgo al yin (corr {c_mil:.2f}, yang esperado {ey_mil:.1f}, Kun/Qian = 729)  OK')
    print('   ambos mezclan igual (lambda2 = 0.5, relajacion 2 pasos), a destinos distintos  OK')
    print(f'   Perron-Frobenius: P positiva -> autovalor 1 simple (mult {mult1}), segundo modulo {segundo}  OK')


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


# === 29. Calendario de los soberanos (bi gua) ===
def verificar_soberanos():
    """Los 12 hexagramas soberanos (bi gua, xiao xi gua) asignados a los meses lunares
    por la tradicion Han (Meng Xi, escuela de Jing Fang). La asignacion a los meses es
    tradicion documentada, no un teorema; lo que se verifica son las cuatro propiedades
    geometricas de los 12 valores. Espejo de web/lib/soberanos.ts."""
    # Meses (empezando en el 11, solsticio de invierno) y valores Fu Xi de los 12.
    meses = [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    valores = [32, 48, 56, 60, 62, 63, 31, 15, 7, 3, 1, 0]
    kw_esperado = [24, 19, 11, 34, 43, 1, 44, 33, 12, 20, 23, 2]
    assert len(meses) == 12 and len(valores) == 12

    pc = lambda v: bin(v).count('1')
    # La linea que cambia (1..6): d = a^b es una sola potencia de 2; 1<<(6-k) = d.
    linea_cambia = lambda a, b: 6 - ((a ^ b).bit_length() - 1)

    # 0. Los 12 valores corresponden a los numeros del Rey Wen de la tradicion.
    assert [BY_VALUE[v]['kw'] for v in valores] == kw_esperado, 'los KW no coinciden'

    # 1. Ciclo Gray cerrado: cada mes difiere del siguiente en una linea (incluye Kun->Fu).
    difs = [valores[i] ^ valores[(i + 1) % 12] for i in range(12)]
    assert all(pc(d) == 1 for d in difs), 'no forman un ciclo Gray cerrado'

    # 2. La linea que cambia avanza 2,3,4,5,6,1,... y el yang describe una onda triangular.
    lineas = [linea_cambia(valores[i], valores[(i + 1) % 12]) for i in range(12)]
    assert lineas == [2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1], lineas
    onda = [pc(v) for v in valores]
    assert onda == [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0], onda

    # 3. El mes m y el mes m+6 son complementos dui exactos (XOR = 63).
    assert all((valores[i] ^ valores[i + 6]) == 63 for i in range(6)), 'antipodas no son dui'
    assert dui(value_of('111000')) == value_of('000111'), 'Tai (mes 1) y Pi (mes 7) no son opuestos'

    # 4. Son exactamente los 12 hexagramas monotonos de Q6.
    def es_monotono(v):
        b = format(v, '06b')
        y = pc(v)
        return b == '1' * y + '0' * (6 - y) or b == '0' * (6 - y) + '1' * y
    monotonos = sorted(v for v in range(64) if es_monotono(v))
    assert len(monotonos) == 12, f'monotonos de Q6: {len(monotonos)}'
    assert sorted(valores) == monotonos, 'los 12 soberanos no coinciden con los monotonos'

    print('29. El calendario de los soberanos (bi gua)')
    print('   los 12 valores corresponden a los numeros del Rey Wen de la tradicion  OK')
    print('   ciclo Gray cerrado de 12 meses, incluido Kun->Fu: una linea por paso  OK')
    print('   lineas que cambian 2,3,4,5,6,1,... ; onda de yang 1,2,3,4,5,6,5,4,3,2,1,0  OK')
    print('   meses opuestos (m, m+6) complementos dui exactos: 6 pares  OK')
    print('   los 12 = los 12 hexagramas monotonos de Q6 (igualdad de conjuntos)  OK')


def verificar_miniaturas():
    """Portada: todo slug del registro tiene generador de miniatura, y ningun
    generador huerfano sin slug. Compara web/lib/experimentos.ts con web/lib/miniaturas.tsx."""
    import re
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    reg = open(os.path.join(raiz, 'web', 'lib', 'experimentos.ts'), encoding='utf-8').read()
    mini = open(os.path.join(raiz, 'web', 'lib', 'miniaturas.tsx'), encoding='utf-8').read()
    slugs_registro = set(re.findall(r'slug:\s*"([a-z0-9-]+)"', reg))
    slugs_gen = set(re.findall(r'"([a-z0-9-]+)":\s*\(c\)\s*=>', mini))
    assert len(slugs_registro) == 36, f'slugs en registro: {len(slugs_registro)}'
    faltan = slugs_registro - slugs_gen
    huerfanos = slugs_gen - slugs_registro
    assert not faltan, f'slugs sin generador de miniatura: {sorted(faltan)}'
    assert not huerfanos, f'generadores huerfanos sin slug: {sorted(huerfanos)}'

    print('28. Miniaturas de la portada')
    print(f'   {len(slugs_gen)} generadores, uno por slug del registro; sin huerfanos  OK')


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
    assert por_cat == {'geometria': 7, 'historia': 8, 'algebra': 12, 'azar': 7, 'practica': 2}, por_cat

    # Con el catalogo completo (36 experimentos), el vocabulario de 19 debe estar
    # totalmente cubierto: ninguna etiqueta muerta.
    sin_uso = ETIQUETAS_VOCAB - usadas
    assert sin_uso == set(), f'etiquetas del vocabulario sin uso: {sorted(sin_uso)}'

    print('18. Sistema de etiquetado en facetas')
    print(f'   {len(ETIQUETADO)} experimentos: 1 categoria, 2 a 4 etiquetas del vocabulario cerrado  OK')
    print(f'   distribucion por categoria {por_cat}  (ninguna vacia)  OK')
    print(f'   vocabulario de {len(ETIQUETAS_VOCAB)} etiquetas: completamente cubierto (0 muertas)  OK')


# === 30. El hipercubo Q6 (fundamento de 01, 03, 06) ===
def verificar_hipercubo():
    """Fundamento comun de hipercubo (01), mapa-lectura (03) y trayectoria (06): la
    estructura de Q6 (biyeccion 0-63, ciclo Gray, 192 aristas, mutacion = XOR, Hamming)."""
    assert sorted(BY_VALUE) == list(range(64)), 'la correspondencia no es biyectiva'
    # Codigo Gray reflejado: permutacion de 0..63, una linea por paso, cierra en ciclo.
    g = [n ^ (n >> 1) for n in range(64)]
    assert sorted(g) == list(range(64)), 'Gray no es permutacion de 0..63'
    for i in range(64):
        d = g[i] ^ g[(i + 1) % 64]
        assert bin(d).count('1') == 1, 'Gray: un paso cambia mas de una linea'
    aristas = sum(1 for v in range(64) for k in range(1, 7) if v < (v ^ LINE_BIT(k)))
    assert aristas == 192, aristas
    # Mutacion = XOR de lineas; distancia original-resultante = numero de lineas cambiadas.
    for v in (0, 21, 42, 63):
        for lineas in ([1], [2, 5], [1, 3, 6]):
            m = v
            for k in lineas:
                m ^= LINE_BIT(k)
            assert hamming(v, m) == len(lineas), (v, lineas)

    print('30. El hipercubo Q6 (fundamento de 01, 03, 06)')
    print('   biyeccion 0-63, ciclo Gray hamiltoniano (1 linea/paso), 192 aristas  OK')
    print('   mutacion = XOR de lineas; distancia original-resultante = lineas cambiadas  OK')


# === 31. Sistema de fundamentos y fuentes ===
def verificar_fundamentos():
    """web/lib/fundamentos.ts contra docs/evidencias-fundamentos.md (fuente unica).
    (a) los 28 experimentos tienen afirmacion; (b) teorema/calculo referencian una seccion
    de suite existente; (c) tradicion/reconstruccion/analogia con clave valida; (d) ninguna
    ficha sin uso; (e) el render APA de cada ficha aparece verbatim en el documento."""
    import re
    from collections import Counter
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    fund = open(os.path.join(raiz, 'web', 'lib', 'fundamentos.ts'), encoding='utf-8').read()
    reg = open(os.path.join(raiz, 'web', 'lib', 'experimentos.ts'), encoding='utf-8').read()
    doc = open(os.path.join(raiz, 'docs', 'evidencias-fundamentos.md'), encoding='utf-8').read()
    suite = open(os.path.abspath(__file__), encoding='utf-8').read()

    claves_bib = set(re.findall(r'clave:\s*"([a-z0-9-]+)"', fund))
    esperadas = {'shaughnessy1996', 'nielsen2003', 'ryan1996', 'leibniz1703',
                 'debruijn1946', 'fkm1978', 'oeis-a003042', 'knuth4a',
                 'oeis-a000045', 'oeis-a000032', 'shannon1948', 'ising1925'}
    assert claves_bib == esperadas, claves_bib

    # (e) El render APA congelado esta, verbatim, en el documento (sin markdown).
    doc_sin_md = doc.replace('*', '')
    apas = re.findall(r'apa:\s*"((?:[^"\\]|\\.)*)"', fund)
    assert len(apas) == len(claves_bib), f'apas {len(apas)} != fichas {len(claves_bib)}'
    for apa in apas:
        u = apa.replace('\\"', '"').replace('\\\\', '\\')
        assert u in doc_sin_md, f'render APA no esta en el documento: {u[:70]}'

    secciones = set(re.findall(r'def (verificar_[a-z0-9_]+)\(', suite))

    afs = re.findall(r'\n  a\("([^"]+)",\s*"([^"]+)",\s*(null|"[^"]*"),\s*\[([^\]]*)\]([^\n]*)', fund)
    assert afs, 'no se parsearon afirmaciones de fundamentos.ts'
    por_slug = {}
    claves_usadas = set()
    con_teorema = 0
    for slug, tipo, respaldo, claves_raw, resto in afs:
        por_slug.setdefault(slug, []).append(tipo)
        cs = re.findall(r'"([a-z0-9-]+)"', claves_raw)
        claves_usadas.update(cs)
        for c in cs:
            assert c in claves_bib, f'{slug}: clave inexistente {c}'
        resp = None if respaldo == 'null' else respaldo.strip('"')
        if tipo in ('teorema', 'calculo'):
            assert resp in secciones, f'{slug}: respaldo {resp} no es seccion de suite'
        if tipo in ('tradicion', 'reconstruccion'):
            assert cs, f'{slug}: {tipo} sin clave'
        if tipo == 'analogia':
            assert (resp in secciones) or cs, f'{slug}: analogia sin respaldo ni clave'
        # Insignia de teorema: solo sobre afirmaciones tipo teorema o calculo.
        if 'nombreTeorema:' in resto:
            con_teorema += 1
            assert tipo in ('teorema', 'calculo'), f'{slug}: nombreTeorema sobre tipo {tipo}'

    slugs_reg = re.findall(r'slug:\s*"([a-z0-9-]+)"', reg)
    faltan = [s for s in slugs_reg if s not in por_slug]
    extra = [s for s in por_slug if s not in slugs_reg]
    assert not faltan, f'experimentos sin afirmacion: {faltan}'
    assert not extra, f'afirmaciones con slug fuera del registro: {extra}'

    sin_uso = claves_bib - claves_usadas
    assert sin_uso == set(), f'fichas sin uso: {sin_uso}'

    dist = Counter(t for lst in por_slug.values() for t in lst)
    print('31. Sistema de fundamentos y fuentes')
    print(f'   {len(afs)} afirmaciones en {len(por_slug)} experimentos; los {len(slugs_reg)} del registro cubiertos  OK')
    print(f'   por tipo: {dict(dist)}  OK')
    print(f'   {len(claves_bib)} fichas APA, todas en uso y verbatim en el documento de evidencias  OK')
    print('   teorema/calculo enlazan seccion de suite; tradicion/reconstruccion/analogia con fuente  OK')
    print(f'   {con_teorema} afirmaciones con insignia de teorema, todas tipo teorema o calculo  OK')


# === 34. Fibonacci en el hexagrama ===
def verificar_fibonacci():
    """Los hexagramas sin lineas yin (o yang) adyacentes: conjuntos independientes del
    camino P6 (y del ciclo C6 en la version circular). Espejo de web/lib/fibonacci.ts."""
    from itertools import product

    def bits(v):
        return BY_VALUE[v]['bits']  # linea 1 (abajo, MSB) -> linea 6

    def sin_dos(s, bit, circular=False):
        if (bit + bit) in s:
            return False
        return not (circular and s[-1] == bit and s[0] == bit)

    def fib(n):
        a, b = 0, 1
        for _ in range(n):
            a, b = b, a + b
        return a

    def lucas(n):
        a, b = 2, 1
        for _ in range(n):
            a, b = b, a + b
        return a

    # 1. Sin dos yin -> 21 = F(8); por simetria, sin dos yang -> 21.
    sin_yin = [v for v in range(64) if sin_dos(bits(v), '0')]
    sin_yang = [v for v in range(64) if sin_dos(bits(v), '1')]
    assert len(sin_yin) == 21 == fib(8), len(sin_yin)
    assert len(sin_yang) == 21, len(sin_yang)

    # 2. Escalera n = 1..6: figuras de n lineas sin '00' -> F(n+2) = 2,3,5,8,13,21.
    escalera = [sum(1 for t in product('01', repeat=n) if '00' not in ''.join(t)) for n in range(1, 7)]
    assert escalera == [2, 3, 5, 8, 13, 21], escalera
    assert escalera == [fib(n + 2) for n in range(1, 7)], escalera
    assert escalera[2] == 5, 'con 3 lineas deben ser 5 trigramas'

    # 3. Desglose de los 21 por k lineas yin -> 1,6,10,4 = C(7-k, k) (diagonales de Pascal).
    desg = [0, 0, 0, 0]
    for v in sin_yin:
        desg[bits(v).count('0')] += 1
    assert desg == [1, 6, 10, 4], desg
    assert desg == [comb(7 - k, k) for k in range(4)], desg

    # 4. Version circular (linea 6 vecina de la 1) -> 18 = L(6).
    circ = [v for v in range(64) if sin_dos(bits(v), '0', circular=True)]
    assert len(circ) == 18 == lucas(6), len(circ)

    # 5. Interseccion (alternancia perfecta) = valores 42 y 21 = Ji Ji (63) y Wei Ji (64).
    inter = sorted(set(sin_yin) & set(sin_yang))
    assert inter == [21, 42], inter
    assert sorted(BY_VALUE[v]['kw'] for v in inter) == [63, 64], inter

    # 6. Marco formal: conjuntos independientes de P6 (lineal) y C6 (circular).
    #    F(n+2) cuenta los independientes de P_n; L(n) los de C_n.
    assert fib(8) == 21 and lucas(6) == 18

    # 7. Las cuatro regiones del Venn de los 64: solo yin, solo yang, ambas, ninguna.
    solo_yin = [v for v in sin_yin if v not in inter]
    solo_yang = [v for v in sin_yang if v not in inter]
    fuera = [v for v in range(64) if v not in sin_yin and v not in sin_yang]
    assert len(solo_yin) == 19 and len(solo_yang) == 19, (len(solo_yin), len(solo_yang))
    assert len(inter) == 2 and len(fuera) == 24, (len(inter), len(fuera))
    assert len(solo_yin) + len(solo_yang) + len(inter) + len(fuera) == 64

    # 8. La sucesion de razones entre supervivientes consecutivos = F(n+3)/F(n+2).
    razones = [escalera[i + 1] / escalera[i] for i in range(5)]
    for n in range(1, 6):
        assert abs(razones[n - 1] - fib(n + 3) / fib(n + 2)) < 1e-9, (n, razones[n - 1])

    print('34. Fibonacci en el hexagrama')
    print('   sin dos yin: 21 = F(8) | sin dos yang: 21 (simetria)  OK')
    print(f'   escalera n=1..6: {escalera} = F(n+2); con 3 lineas, 5 trigramas  OK')
    print('   desglose por yin 1,6,10,4 = C(7-k,k) (diagonales de Pascal, exp. 18)  OK')
    print('   circular (C6): 18 = L(6)  OK')
    print('   interseccion (alternancia): Ji Ji (63) y Wei Ji (64)  OK')
    print(f'   Venn de los 64: 19 + 19 + 2 + 24 = 64  OK')
    print(f'   razones {[round(r, 3) for r in razones]} = F(n+3)/F(n+2) -> phi  OK')


# === 35. El hexagrama como cadena de espines (Ising) ===
def verificar_ising():
    """Exp 30: 6 espines (yang +1, yin -1), matriz de transferencia (Ising 1D)."""
    import math

    def bits(v):
        return format(v, '06b')

    def spins(v):
        return [1 if c == '1' else -1 for c in bits(v)]

    def matmul(A, B):
        return [[sum(A[i][k] * B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]

    def matpow(A, p):
        R = [[1, 0], [0, 1]]
        for _ in range(p):
            R = matmul(R, A)
        return R

    b, J = 0.7, 1.0
    T = [[math.exp(b * J), math.exp(-b * J)], [math.exp(-b * J), math.exp(b * J)]]
    T5 = matpow(T, 5)
    Zab = sum(T5[i][j] for i in range(2) for j in range(2))
    T6 = matpow(T, 6)
    Zpe = T6[0][0] + T6[1][1]
    assert abs(Zab - 199.384322) < 1e-4, Zab
    assert abs(Zpe - 262.456561) < 1e-4, Zpe
    Zab_e = sum(math.exp(b * J * sum(spins(v)[i] * spins(v)[i + 1] for i in range(5))) for v in range(64))
    assert abs(Zab - Zab_e) < 1e-6
    T05 = matpow([[1, 1], [1, 1]], 5)
    assert sum(T05[i][j] for i in range(2) for j in range(2)) == 64
    for signo, esperado in [(1, {0, 63}), (-1, {21, 42})]:
        w = [math.exp(8.0 * signo * J * sum(spins(v)[i] * spins(v)[i + 1] for i in range(5))) for v in range(64)]
        top2 = sorted(range(64), key=lambda v: -w[v])[:2]
        assert set(top2) == esperado, (signo, top2)
        Z = sum(w)
        assert all(abs(w[t] / Z - 0.5) < 1e-3 for t in top2)
    dura = [v for v in range(64) if '00' not in bits(v)]
    anillo = [v for v in range(64) if '00' not in bits(v) and not (bits(v)[0] == '0' and bits(v)[5] == '0')]
    assert len(dura) == 21 and len(anillo) == 18
    tr, det = 1, -1
    phi = (tr + math.sqrt(tr * tr - 4 * det)) / 2
    assert abs(phi - 1.618034) < 1e-5, phi

    print('35. El hexagrama como cadena de espines (Ising)')
    print(f'   Z abierta 1T^5 1 = {Zab:.6f} | Z periodica Tr(T^6) = {Zpe:.6f}  OK')
    print('   beta a cero: Z = 64 (uniforme); baja T: J>0 Qian/Kun 50/50, J<0 Ji Ji/Wei Ji 50/50  OK')
    print(f'   restriccion dura: 21 (F8) cadena, 18 (L6) anillo, autovalor phi = {phi:.6f}  OK')


# === 36. La entropia del oraculo (Shannon) ===
def verificar_entropia():
    """Exp 31: entropia de Shannon (bits) de los metodos del oraculo."""
    import math

    def Hb(ps):
        return -sum(p * math.log2(p) for p in ps if p > 0)

    ses = {'monedas': {9: 2, 8: 6, 7: 6, 6: 2}, 'milenrama': {9: 3, 8: 7, 7: 5, 6: 1}}
    linea = lambda m: Hb([ses[m][e] / 16 for e in (6, 7, 8, 9)])
    valor = lambda m: Hb([(ses[m][7] + ses[m][9]) / 16, (ses[m][6] + ses[m][8]) / 16])
    assert abs(math.log2(64) - 6) < 1e-12
    hl_mon, hl_mil = linea('monedas'), linea('milenrama')
    assert abs(hl_mon - 1.8113) < 1e-3, hl_mon
    assert abs(hl_mil - 1.7490) < 1e-3, hl_mil
    assert abs((hl_mon - hl_mil) - 0.0623) < 1e-3
    assert abs(valor('monedas') - 1) < 1e-9 and abs(valor('milenrama') - 1) < 1e-9
    est_mil, est_mon = 6 * Hb([1 / 4, 3 / 4]), 6 * Hb([1 / 2, 1 / 2])
    assert abs(est_mil - 4.8677) < 1e-3, est_mil
    assert abs(est_mon - 6) < 1e-9

    # Codigo optimo de Huffman: longitud esperada y teorema de codificacion H <= L < H+1.
    def huffman(probs):
        prof = [0] * len(probs)
        nodos = [[p, [i]] for i, p in enumerate(probs)]
        while len(nodos) > 1:
            nodos.sort()
            a = nodos.pop(0)
            b = nodos.pop(0)
            for h in a[1] + b[1]:
                prof[h] += 1
            nodos.append([a[0] + b[0], a[1] + b[1]])
        return sum(probs[i] * prof[i] for i in range(len(probs)))

    l_mon = huffman([ses['monedas'][e] / 16 for e in (6, 7, 8, 9)])
    l_mil = huffman([ses['milenrama'][e] / 16 for e in (6, 7, 8, 9)])
    assert abs(l_mon - 30 / 16) < 1e-9 and abs(l_mil - 29 / 16) < 1e-9, (l_mon, l_mil)
    assert hl_mon <= l_mon < hl_mon + 1 and hl_mil <= l_mil < hl_mil + 1

    print('36. La entropia del oraculo (Shannon)')
    print('   hexagrama uniforme = 6 bits (maximo para 64 estados)  OK')
    print(f'   linea: monedas {hl_mon:.4f} vs milenrama {hl_mil:.4f} bits (dif {hl_mon - hl_mil:.4f}); valor = 1 bit en ambos  OK')
    print(f'   estacionaria: milenrama {est_mil:.4f} = 6 H(1/4) vs monedas {est_mon:.1f}  OK')
    print(f'   Huffman: monedas L = {l_mon} (30/16), milenrama L = {l_mil} (29/16); H <= L < H+1 (menos entropia y mejor compresion)  OK')


# === 37. La matriz de transferencia ===
def verificar_transferencia():
    """Exp 32: reglas de adyacencia como matrices 2x2; conteos y Catalan."""
    import math

    def matmul(A, B):
        return [[sum(A[i][k] * B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]

    def matpow(M, p):
        R = [[1, 0], [0, 1]]
        for _ in range(p):
            R = matmul(R, M)
        return R

    conteo = lambda M, n: sum(matpow(M, n - 1)[i][j] for i in range(2) for j in range(2))
    cicl = lambda M, n: matpow(M, n)[0][0] + matpow(M, n)[1][1]

    def eig(M):
        tr = M[0][0] + M[1][1]
        det = M[0][0] * M[1][1] - M[0][1] * M[1][0]
        return (tr + math.sqrt(max(0, tr * tr - 4 * det))) / 2

    presets = {'sin dos yin': [[0, 1], [1, 1]], 'sin dos yang': [[1, 1], [1, 0]],
               'todo permitido': [[1, 1], [1, 1]], 'solo alternancia': [[0, 1], [1, 0]]}
    assert [conteo(presets['sin dos yin'], n) for n in range(1, 7)] == [2, 3, 5, 8, 13, 21]
    assert [conteo(presets['sin dos yang'], n) for n in range(1, 7)] == [2, 3, 5, 8, 13, 21]
    assert [conteo(presets['todo permitido'], n) for n in range(1, 7)] == [2, 4, 8, 16, 32, 64]
    assert [conteo(presets['solo alternancia'], n) for n in range(1, 7)] == [2, 2, 2, 2, 2, 2]
    assert abs(eig(presets['sin dos yin']) - 1.618034) < 1e-5
    assert abs(eig(presets['todo permitido']) - 2) < 1e-9
    assert abs(eig(presets['solo alternancia']) - 1) < 1e-9
    assert cicl(presets['sin dos yin'], 6) == 18  # Lucas

    def dyck(v):
        s = format(v, '06b')
        if s.count('1') != 3:
            return False
        bal = 0
        for c in s:
            bal += 1 if c == '1' else -1
            if bal < 0:
                return False
        return True

    cat = sorted(v for v in range(64) if dyck(v))
    assert cat == [42, 44, 50, 52, 56], cat

    print('37. La matriz de transferencia: disena tu regla')
    print('   presets: sin yin/sin yang [2,3,5,8,13,21] phi; libre 2^n autovalor 2; alternancia autovalor 1  OK')
    print('   version ciclica de sin dos yin: Tr = 18 = L(6)  OK')
    print(f'   Catalan C3 = 5: {cat} (yang nunca detras de yin, balance 3-3)  OK')


# === 38. El espectro del hipercubo Q6 ===
def verificar_espectro_q6():
    """Exp 33: autovalores de la adyacencia de Q6 = 6-2k con multiplicidad C(6,k)."""
    from collections import Counter
    pc = lambda x: bin(x).count('1')
    espectro = Counter(6 - 2 * pc(w) for w in range(64))
    esperado = {6 - 2 * k: comb(6, k) for k in range(7)}
    assert dict(espectro) == esperado, dict(espectro)
    chi = lambda w, v: -1 if bin(w & v).count('1') & 1 else 1
    for w in (0, 1, 3, 7, 21, 63):
        for v in range(64):
            img = sum(chi(w, v ^ (1 << k)) for k in range(6))
            assert img == (6 - 2 * pc(w)) * chi(w, v)
    assert [comb(6, k) for k in range(7)] == [1, 6, 15, 20, 15, 6, 1]

    print('38. El espectro del hipercubo Q6')
    print(f'   autovalores 6-2k con multiplicidad C(6,k): {dict(sorted(espectro.items(), reverse=True))}  OK')
    print('   multiplicidades = niveles de yang del reticulo B6; paseo simple = espectro / 6  OK')


# === 40. El Fourier del anillo (DFT sobre Z/64) ===
def verificar_fourier():
    """Exp 34: DFT sobre Z/64. Parseval, delta, ida y vuelta; armonicos congelados."""
    import math
    import cmath
    senal = [BY_VALUE[v]['kw'] for v in range(64)]

    def dft(f):
        n = len(f)
        return [sum(f[v] * cmath.exp(-2j * math.pi * k * v / n) for v in range(n)) for k in range(n)]

    def idft(F):
        n = len(F)
        return [(sum(F[k] * cmath.exp(2j * math.pi * k * v / n) for k in range(n)) / n).real for v in range(n)]

    F = dft(senal)
    mag = [abs(x) for x in F]
    assert abs(sum(x * x for x in senal) - sum(m * m for m in mag) / 64) < 1e-6, 'Parseval'
    Fc = dft([5] * 64)
    assert abs(Fc[0] - 320) < 1e-9 and all(abs(x) < 1e-6 for x in Fc[1:]), 'delta'
    vuelta = idft(F)
    assert all(abs(vuelta[v] - senal[v]) < 1e-6 for v in range(64)), 'ida y vuelta'
    assert abs(mag[0] - 2080) < 1e-6

    ks = sorted(range(1, 33), key=lambda k: -mag[k])[:6]
    esperado = [(8, 388.42), (2, 274.0), (6, 233.67), (3, 208.61), (25, 204.05), (1, 188.76)]
    assert [k for k in ks] == [k for k, _ in esperado], ks
    for k, (_, m) in zip(ks, esperado):
        assert abs(mag[k] - m) < 0.1, (k, mag[k], m)

    print('40. El Fourier del anillo (DFT sobre Z/64)')
    print('   Parseval, DFT(constante) = delta, ida y vuelta recupera la senal  OK')
    print(f'   DC = {mag[0]:.0f} (suma de los numeros del Rey Wen); armonico dominante k = 8 (trigramas)  OK')
    print(f'   armonicos congelados (k, |F|): {[(k, round(mag[k], 2)) for k in ks]}  OK')


# === 41. Las influencias de las lineas (funciones booleanas) ===
def verificar_influencias():
    """Exp 35: influencia de cada linea; total = suma espectral ponderada de Walsh."""
    LB = lambda k: 1 << (6 - k)
    pc = lambda v: bin(v).count('1')
    bits = lambda v: format(v, '06b')
    sin_yin = lambda v: '00' not in bits(v)
    paridad = lambda v: (pc(v) & 1) == 0

    def inf(P):
        return [sum(1 for v in range(64) if P(v) != P(v ^ LB(k))) for k in range(1, 7)]

    assert inf(sin_yin) == [10, 22, 18, 18, 22, 10], inf(sin_yin)
    assert inf(paridad) == [64, 64, 64, 64, 64, 64]

    def total_walsh(P):
        g = [1 - 2 * (1 if P(v) else 0) for v in range(64)]
        t = 0.0
        for w in range(64):
            G = sum(g[v] * (-1 if bin(w & v).count('1') & 1 else 1) for v in range(64))
            t += pc(w) * (G / 64) ** 2
        return t

    for nombre, P in [('sin dos yin', sin_yin), ('paridad', paridad)]:
        assert abs(sum(inf(P)) / 64 - total_walsh(P)) < 1e-9, nombre

    print('41. Las influencias de las lineas (funciones booleanas)')
    print(f'   sin dos yin: influencias {inf(sin_yin)} de 64 (maximas en las lineas 2 y 5)  OK')
    print('   paridad de yang: la influencia de toda linea es exactamente 1  OK')
    print('   influencia total = suma espectral ponderada de Walsh (une con el exp. 23)  OK')


# === 42. El cubo dice que no (teoremas de imposibilidad) ===
def verificar_cubo_no():
    """Exp 36: (a) codigo max a distancia 3 = 8 por busqueda exhaustiva; (b) biparticion;
    (c) collares de Polya (14) y pulseras (13)."""
    ham = lambda a, b: bin(a ^ b).count('1')
    pc = lambda v: bin(v).count('1')

    # (a) cota de empaquetado 64/7 -> 9; maximo real 8 por branch and bound exhaustivo
    assert 64 // 7 == 9
    adj = [set(j for j in range(64) if j != i and ham(i, j) >= 3) for i in range(64)]
    best = [0]

    def rec(R, P):
        if len(R) > best[0]:
            best[0] = len(R)
        if len(R) + len(P) <= best[0]:
            return
        P = list(P)
        while P and len(R) + len(P) > best[0]:
            v = P.pop()
            rec(R + [v], [u for u in P if u in adj[v]])

    rec([], list(range(64)))
    assert best[0] == 8, best[0]
    cod = [11, 12, 18, 21, 33, 38, 56, 63]
    dmin = min(ham(a, b) for i, a in enumerate(cod) for b in cod[i + 1:])
    assert len(cod) == 8 and dmin == 3

    # (b) biparticion por paridad de yang: las 192 aristas cruzan
    cruces = sum(1 for v in range(64) for k in range(1, 7)
                 if v < (v ^ (1 << (6 - k))) and (pc(v) & 1) != (pc(v ^ (1 << (6 - k))) & 1))
    assert cruces == 192 and sum(1 for v in range(64) if pc(v) % 2 == 0) == 32

    # (c) collares (C6) y pulseras (D6)
    b6 = lambda v: format(v, '06b')
    rota = lambda v, r: int(b6(v)[r:] + b6(v)[:r], 2)
    refl = lambda v: int(b6(v)[::-1], 2)
    collares = sum(1 for v in range(64) if min(rota(v, r) for r in range(6)) == v)
    pulseras = sum(1 for v in range(64) if min(min(rota(v, r), refl(rota(v, r))) for r in range(6)) == v)
    polya = (1 * 2 ** 6 + 1 * 2 ** 3 + 2 * 2 ** 2 + 2 * 2 ** 1) // 6
    assert collares == 14 == polya and pulseras == 13

    print('42. El cubo dice que no (teoremas de imposibilidad)')
    print(f'   codigos: cota de empaquetado 9; maximo real {best[0]} (busqueda exhaustiva); codigo {cod}  OK')
    print(f'   biparticion: las {cruces} aristas cruzan yang par/impar (Q6 bipartito)  OK')
    print(f'   Polya: {collares} collares (formula = enumeracion) y {pulseras} pulseras  OK')


# === 39. Hallazgos propios (sello de originalidad) ===
def verificar_hallazgos():
    """Anexo: (a) cada hallazgo con afirmacion tipo teorema o calculo; (b) fecha valida y
    nota no vacia; (c) el conteo de sellos esta congelado en 1 (se actualiza a mano)."""
    import re
    import datetime
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    reg = open(os.path.join(raiz, 'web', 'lib', 'experimentos.ts'), encoding='utf-8').read()
    fund = open(os.path.join(raiz, 'web', 'lib', 'fundamentos.ts'), encoding='utf-8').read()

    base = reg[reg.index('const BASE'):]  # solo el arreglo, no la interfaz ni el comentario
    slugs = [(m.start(), m.group(1)) for m in re.finditer(r'slug:\s*"([a-z0-9-]+)"', base)]
    sellos = []
    for hm in re.finditer(r'hallazgoPropio:\s*\{', base):
        slug = max((s for s in slugs if s[0] < hm.start()), key=lambda s: s[0])[1]
        sellos.append(slug)

    # (c) conteo congelado en 1
    assert len(sellos) == 1, f'sellos: {sellos} (el conteo esta congelado en 1)'
    # (b) fecha valida + nota no vacia
    fechas = re.findall(r'busquedaFecha:\s*"(\d{4}-\d{2}-\d{2})"', base)
    notas = re.findall(r'busquedaNota:\s*"([^"]+)"', base)
    assert len(fechas) == 1 and len(notas) == 1, (len(fechas), len(notas))
    datetime.date.fromisoformat(fechas[0])
    assert len(notas[0].strip()) >= 20, 'busquedaNota vacia o demasiado corta'
    # (a) cada sello con afirmacion tipo teorema o calculo
    for slug in sellos:
        tipos = re.findall(r'\n  a\("' + re.escape(slug) + r'",\s*"([a-z]+)"', fund)
        assert any(t in ('teorema', 'calculo') for t in tipos), f'{slug}: sin teorema/calculo'

    print('39. Hallazgos propios (sello de originalidad)')
    print(f'   {len(sellos)} sello (conteo congelado): {sellos[0]}, con afirmacion teorema/calculo  OK')
    print(f'   busqueda con fecha {fechas[0]} y nota documentada  OK')


# === 33. Pistas de uso (comoUsar) ===
def verificar_como_usar():
    """Todo experimento no-referencia lleva una pista de uso concreta: no vacia, de 20 a
    140 caracteres y sin formulas genericas. Los de tipo referencia llevan el texto fijo."""
    import re
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    reg = open(os.path.join(raiz, 'web', 'lib', 'experimentos.ts'), encoding='utf-8').read()

    REF = 'Página de referencia, para leer'
    GENERICAS = ('interactua', 'interactúa', 'explora la visualizacion',
                 'explora la visualización', 'juega con', 'usa la herramienta',
                 'haz clic aqui', 'haz clic aquí', 'mira la visualizacion',
                 'mira la visualización', 'prueba la herramienta')

    # Cada entrada del registro: slug, comoUsar y tipo (el orden de campos es fijo).
    bloques = re.findall(
        r'slug:\s*"([a-z0-9-]+)",.*?comoUsar:\s*\n?\s*"([^"]+)",.*?tipo:\s*"([a-z]+)",',
        reg, re.S)
    assert len(bloques) == 36, f'entradas parseadas: {len(bloques)}'

    refs = [s for s, _, t in bloques if t == 'referencia']
    assert len(refs) == 2, f'experimentos de tipo referencia: {refs}'

    for slug, texto, tipo in bloques:
        if tipo == 'referencia':
            assert texto == REF, f'{slug}: referencia debe llevar el texto fijo, lleva: {texto}'
            continue
        assert texto.strip(), f'{slug}: comoUsar vacio'
        assert 20 <= len(texto) <= 140, f'{slug}: comoUsar mide {len(texto)} (debe ser 20 a 140)'
        bajo = texto.lower()
        for g in GENERICAS:
            assert g not in bajo, f'{slug}: comoUsar generico ({g})'
        # Una sola linea, con verbo de accion al principio (empieza en mayuscula).
        assert '\n' not in texto, f'{slug}: comoUsar debe ser una sola linea'
        assert texto[0].isupper(), f'{slug}: comoUsar debe empezar con verbo en mayuscula'

    largos = [len(t) for s, t, tp in bloques if tp != 'referencia']
    print('33. Pistas de uso (comoUsar)')
    print(f'   {len(bloques) - len(refs)} experimentos no-referencia con pista concreta '
          f'({min(largos)} a {max(largos)} caracteres)  OK')
    print(f'   {len(refs)} de tipo referencia con el texto fijo de lectura  OK')
    print(f'   ninguna pista generica ({len(GENERICAS)} formulas prohibidas)  OK')


# === 32. Chequeo de guiones (arbitro de estilo) ===
def verificar_guiones():
    """Em dash prohibido siempre (prosa, comentarios, copy). En dash permitido solo en
    referencias y rangos APA. El chequeo falla ante cualquier guion largo del repo."""
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    em = chr(0x2014)  # guion largo
    en = chr(0x2013)  # guion medio
    exts = ('.ts', '.tsx', '.py', '.md', '.css')
    total_em = 0
    total_en = 0
    ofensores = []
    for base, dirs, files in os.walk(raiz):
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.next', '.git', '__pycache__')]
        for fn in files:
            if not fn.endswith(exts):
                continue
            p = os.path.join(base, fn)
            s = open(p, encoding='utf-8', errors='ignore').read()
            ne = s.count(em)
            total_em += ne
            total_en += s.count(en)
            if ne:
                ofensores.append((os.path.relpath(p, raiz), ne))
    assert total_em == 0, f'guiones largos (em dash) prohibidos: {ofensores}'

    print('32. Chequeo de guiones (arbitro de estilo)')
    print(f'   guion largo (em dash) en todo el repo: {total_em}  OK (prohibido siempre)')
    print(f'   guion medio (en dash): {total_en}  (permitido solo en referencias y rangos APA)')


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
    verificar_soberanos()
    print()
    verificar_miniaturas()
    print()
    verificar_etiquetado()
    print()
    verificar_hipercubo()
    print()
    verificar_fundamentos()
    print()
    verificar_como_usar()
    print()
    verificar_fibonacci()
    print()
    verificar_ising()
    print()
    verificar_entropia()
    print()
    verificar_transferencia()
    print()
    verificar_espectro_q6()
    print()
    verificar_fourier()
    print()
    verificar_influencias()
    print()
    verificar_cubo_no()
    print()
    verificar_hallazgos()
    print()
    verificar_guiones()
    print()
    print('Todas las afirmaciones de los experimentos verificadas.')
