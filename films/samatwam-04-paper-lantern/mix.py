"""Samatwam 04 · Seven Levels of Sight — santoor over a tanpura drone at 66 BPM; each new layer on a new note."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from samatwam_audio import *
E = json.load(open(os.path.join(HERE, 'events.json'))); M = Mix(E['dur'], HERE)
BEAT = 60 / 66
# tanpura drone on D (Sa), quiet through the silences
M.m(tanpura(50, 27.6, 1.0), 1.4, 1.0, 0); M.m(tanpura(50, 14.2, 1.0), 34.0, 1.0, 0); M.m(tanpura(50, 12.0, 1.1), 48.0, 1.0, 0)
# santoor: a rising raga-like line (D Bhupali: Sa Re Ga Pa Dha); each opened layer is the next note
SCALE = [62, 64, 66, 69, 71, 74, 76, 78]
opened = {e['k']: e['t'] for e in E['ev'] if e['type'] == 'open'}
for k, t in opened.items():
    n = SCALE[k - 1] if k < 7 else 81
    for j, dt in enumerate([0, BEAT / 4, BEAT / 2]): M.m(santoor(n + (0, 12, 0)[j], .9 - .25 * j), t + dt, 1.0, (k - 4) / 6)
# gentle santoor tremolo phrases between events (not in the silences)
def phrase(t0, notes, step=BEAT / 2, v=.45):
    for i, n in enumerate(notes): M.m(santoor(n, v), t0 + i * step, 1.0, .3 if i % 2 else -.3)
phrase(2.73, [62, 66, 69, 66]); phrase(14.5, [69, 71, 74, 71, 69, 66]); phrase(36.4, [74, 71, 69, 66, 64, 62], BEAT * .75, .4)
phrase(42.7, [62, 64, 66, 69]); phrase(52.7, [81, 78, 74, 69, 66, 62], BEAT / 2, .5); phrase(56.4, [62, 69, 74], BEAT, .55)
# foley: filament, paper rustle, the knife scoring each window before it burns, the strip
for e in E['ev']:
    if e['type'] == 'filament': M.f(filament(.9), e['t'], 1.0, 0); M.f(filament(.6), e['t'] + .14, 1.0, 0)
    if e['type'] == 'lamp': M.f(flame(58, .8), e['t'], 1.0, 0)
    if e['type'] == 'score': M.f(knife(.55, 1.0), e['t'], 1.0, (e['k'] - 4) / 6)
    if e['type'] == 'open': M.f(paper(.6, .9), e['t'], 1.0, (e['k'] - 4) / 6); M.f(crackle(.5, .5), e['t'], 1.0, 0)
    if e['type'] == 'strip': M.f(paper(1.4, 1.0), e['t'], 1.0, 0); M.f(paper(1.8, .6), e['t'] + 1.0, 1.0, .2)
M.f(paper(1.2, .5), 18.5, 1.0, -.3); M.f(paper(1.2, .5), 40.2, 1.0, .3)
M.m(bell(74, .45), 56.4, 1.0, 0)
M.gate(28.4, 34.0, .03)   # silence: the door that stays closed
M.voice({'l1': 1.6, 'l2': 9.6, 'l3': 34.4, 'l4': 42.0, 'l5': 52.0}); M.write()
