"""Samatwam 03 · What Is Given Back — low cello drone, clock-like pizzicato at 72 BPM, a metal-on-wood tick per plate."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from samatwam_audio import *
E = json.load(open(os.path.join(HERE, 'events.json'))); M = Mix(E['dur'], HERE)
BEAT = 60 / 72
# cello drone (D), changing colour by section; holds still for the pauses
for t0, d, m, v in [(0, 20.5, 38, .9), (26, 12.5, 38, .8), (38, 6.6, 45, .7), (46.4, 10, 38, 1.0), (46.4, 10, 45, .6), (55.8, 4.6, 50, .8)]: M.m(cello(m, d, v, a=1.2, r=1.5), t0, 1.0, 0)
# clock-like pizzicato, every beat (quiet in the holds), D minor steps
seq = [62, 69, 65, 69, 62, 69, 67, 69]
t, i = 4.58, 0
while t < 55.5:
    if not (20.4 < t < 26.0 or 44.2 < t < 46.4): M.m(pizz(seq[i % 8], .55 if t < 46 else .7), t, 1.0, .25 if i % 2 else -.25)
    t += BEAT; i += 1
# foley: each plate lands on wood / on its stack (every tenth heavier: the ruler)
for e in E['ev']:
    if e['type'] == 'plate':
        k = e['k']; ruler = e['i'] == 0 and (k + 1) % 10 == 0
        pitch = {0: 1.0, 1: 1.35, 2: .8}[e['i']] * (1 + .02 * ((k * 7) % 5))
        M.f(metal_tick(.9 if k == 0 else .5, pitch * (.85 if ruler else 1)), e['t'], 1.0, (-.3, .4, .5)[e['i']])
        if ruler or (e['i'] > 0 and k == 14): M.f(detent(.6), e['t'] + .05, 1.0, .5)
    if e['type'] == 'puck': M.f(metal_tick(1.0, .6), e['t'], 1.0, 0); M.f(thump(.6, 70), e['t'], 1.0, 0)
M.f(air(60, 1.0), 0, 1.0, 0)
# a bell when each reading completes, and the end
for t0, m in [(19.0, 74), (34.2, 81), (44.0, 69), (51.5, 74), (56.0, 74)]: M.m(bell(m, .5), t0, 1.0, 0)
M.gate(20.6, 26.0, .12); M.gate(44.5, 46.3, .05)
M.voice({'l1': 1.0, 'l2': 8.2, 'l3': 27.4, 'l5': 47.4, 'l6': 56.6}); M.write()
