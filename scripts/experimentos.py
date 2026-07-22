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
    BY_KW, BY_VALUE, LINE_BIT, bits_of, dui, fan, hamming, hu_gua, value_of,
)

# ————————————————————— 1. Palacios de Jing Fang —————————————————————

CABEZAS = ['Qian', 'Dui', 'Li', 'Zhen', 'Xun', 'Kan', 'Gen', 'Kun']
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
    print('Todas las afirmaciones de los experimentos verificadas.')
