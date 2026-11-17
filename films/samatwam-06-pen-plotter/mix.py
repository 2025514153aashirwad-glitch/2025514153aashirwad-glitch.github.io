"""Samatwam 06 · The Soyombo Grid — minimal piano and woodblock at 90 BPM; stepper motors, pen-down taps, pen-up whispers, the rack's click."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from samatwam_audio import *
E = json.load(open(os.path.join(HERE, 'events.json'))); M = Mix(E['dur'], HERE)
BEAT = 60 / 90
def piano(m, v=1.0, d=2.4):
    f = hz(m); tt = t_(d); x = sum((1 / k ** 1.3) * np.sin(2 * np.pi * f * k * (1 + .0004 * k * k) * tt) * env_exp(d, .9 / k ** .6) for k in range(1, 9))
    x[:48] *= np.linspace(0, 1, 48); return (x + hp(noise(d), 1800) * env_exp(d, .004) * .2) * v * .3
def woodblock(v=1.0, p=1.0):
    d = .15; tt = t_(d); return (np.sin(2 * np.pi * 900 * p * tt) * env_exp(d, .03) + .5 * np.sin(2 * np.pi * 1650 * p * tt) * env_exp(d, .015)) * v * .4
# piano phrases follow the plotting order: one note per part, a chord on the sum, a figure for the statement
for t0, ms in [(2.0, [74]), (4.6, [62, 69]), (12.0, [66]), (17.3, [69]), (24.6, [71]), (28.7, [74]), (36.8, [62, 66, 69, 74]), (40.8, [64]), (42.4, [64, 67]), (46.0, [69]), (46.8, [71]), (47.6, [74]), (48.4, [78]), (56.4, [62, 69, 74]), (58.2, [74, 78])]:
    for m in ms: M.m(piano(m, .7), t0, 1.0, (m - 70) / 20)
# woodblock on the beat while the machine works (not in the silences)
t = 4.6
while t < 56.4:
    if not (32.6 < t < 36.8 or 49.8 < t < 51.4): M.m(woodblock(.45 if int(round(t / BEAT)) % 4 else .7, 1.0 if int(round(t / BEAT)) % 4 else 1.25), t, 1.0, .3)
    t += BEAT
# machine: stepper whine while drawing (pitch with motion), pen-down tap, pen-up whisper, rack clicks
def stepper(d, v=1.0, f0=420):
    tt = t_(d); f = f0 * (1 + .15 * np.sin(2 * np.pi * 3 * tt)); x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .3 + np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * .2
    return bp(x, 300, 3000) * adsr(d, .03, .05) * .06 * v
downs = sorted(e['t'] for e in E['ev'] if e['type'] == 'down'); ups = sorted(e['t'] for e in E['ev'] if e['type'] == 'up')
for t0 in downs: M.f(click(1.1, .35), t0, .8, -.1)
for t0 in ups: M.f(hp(noise(.08), 3000) * env_exp(.08, .02) * .12, t0, 1.0, -.1)
for e in E['ev']:
    if e['type'] == 'write': M.f(stepper(e['d'], 1.0, 520), e['t'], 1.0, .2)
    if e['type'] == 'travel': M.f(stepper(e['d'] + 1.6, 1.3, 680), e['t'], 1.0, .5)
    if e['type'] == 'rack': M.f(clack(1.6, .8), e['t'], 1.0, .6)
    if e['type'] == 'stand': M.f(whoosh(1.4, .35), e['t'], 1.0, 0); M.f(whoosh(1.4, .3), e['t'] + 2.6, 1.0, 0)
# a continuous motor bed while strokes are drawn
for i in range(len(downs)):
    t0 = downs[i]; t1 = min([u for u in ups if u > t0] or [t0 + .2]);
    if t1 - t0 > .06: M.f(stepper(t1 - t0, .7, 380 + 60 * (i % 5)), t0, 1.0, 0)
M.f(air(60, .7), 0, 1.0, 0)
M.gate(32.8, 36.8, .05); M.gate(49.8, 51.3, .05)
M.voice({'l1': 1.0, 'l2': 13.4, 'l3': 19.4, 'l4': 25.4, 'l5': 36.6}); M.write()
