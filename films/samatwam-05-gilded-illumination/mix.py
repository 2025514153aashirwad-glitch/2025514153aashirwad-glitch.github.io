"""Samatwam 05 · The Threaded Map — a sarangi line over a slow tabla theka at 60 BPM; one bell on the first gold flash."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from samatwam_audio import *
E = json.load(open(os.path.join(HERE, 'events.json'))); M = Mix(E['dur'], HERE)
ev = {e['type'] + str(e.get('i', '')): e['t'] for e in E['ev']}
# tabla: a slow theka (dha dhin dhin dha | dha dhin dhin dha | na tin tin na | te te dhin dhin dha), one bol per beat at 60 BPM
BOLS = ['dha', 'ge', 'ge', 'dha', 'dha', 'ge', 'ge', 'dha', 'na', 'tin', 'tin', 'na', 'tin', 'tin', 'ge', 'dha']
def theka(a, b, v=.7):
    t, i = a, 0
    while t < b - 1e-6: M.m(tabla(BOLS[i % 16], v * (1.0 if i % 4 == 0 else .8)), t, 1.0, -.15); t += 1.0; i += 1
theka(5.0, 29.8); theka(36.0, 49.8, .55); theka(51.0, 56.0, .5)
# tanpura bed (Sa = D) under everything except the silence
M.m(tanpura(50, 30.0, .9), 0.0, 1.0, 0); M.m(tanpura(50, 24.5, .9), 35.6, 1.0, 0)
# sarangi: slow gliding phrases in Yaman-like colour (D E F# G# A B C#), phrased to the picture
S = lambda t0, seq: M.m(sarangi([(t0 + a, n) for a, n in seq], seq[-1][0] + 1.4, 1.0), t0, 1.0, .1)
S(1.0, [(0, 62), (1.2, 64), (2.4, 66), (3.6, 66)])
S(8.0, [(0, 69), (1.5, 71), (2.6, 69), (3.8, 66), (5.2, 64), (6.0, 64)])
S(15.5, [(0, 66), (1.0, 68), (2.4, 69), (3.6, 71), (4.6, 69)])
S(21.4, [(0, 74), (1.6, 73), (3.0, 71), (4.4, 69), (6.0, 69)])
S(37.2, [(0, 62), (2.0, 66), (4.0, 69), (6.0, 71), (8.0, 74), (10.0, 74)])
S(50.4, [(0, 74), (1.8, 71), (3.2, 69), (4.6, 66), (5.6, 66)])
S(56.2, [(0, 69), (1.4, 66), (2.6, 62), (3.4, 62)])
# the one bell: the first gold flash
M.m(bell(81, 1.0, 4.0), ev['flash0'], 1.0, -.2); M.m(bell(69, .4, 3.0), ev['flash0'] + .02, 1.0, -.2)
# foley: brush on vellum while the page is painted, leaf crackle on gold, the lamp flame, the page turn
for t0 in (5.5, 9.0, 13.0, 16.5): M.f(brush(1.6, 1.0), t0, 1.0, (-.3, .3, -.3, .3)[int((t0 - 5) // 4) % 4])
M.f(brush(4.2, .8), ev['weave'], 1.0, .3)
for k in range(14): M.f(crackle(.2, .4), 24.6 + k * .28, 1.0, .3)
M.f(flame(13.8, 1.2), ev['lamp'] - .4, 1.0, 0)
M.f(crackle(.5, 1.0), ev['flash0'], 1.0, -.2); M.f(crackle(.5, 1.0), ev['flash1'], 1.0, .2)
M.f(paper(1.6, 1.2), ev['turn'], 1.0, 0); M.f(whoosh(1.0, .3), ev['turn'] + .8, 1.0, 0)
M.gate(29.8, 36.0, .0)   # silence: the page complete, gold laid dark
M.voice({'l1': 6.0, 'l2': 21.0, 'l3': 25.6, 'l4': 38.0, 'l5': 50.6}); M.write()
