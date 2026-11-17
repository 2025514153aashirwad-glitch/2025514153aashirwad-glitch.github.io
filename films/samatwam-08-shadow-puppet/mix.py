"""Samatwam 08 · The Creative Arena — dholak, khartal and harmonium at 100 BPM; silence for the pull toward the lamp."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from samatwam_audio import *
E = json.load(open(os.path.join(HERE, 'events.json'))); M = Mix(E['dur'], HERE)
BEAT = .6
def dholak(kind, v=1.0):
    d = .45; tt = t_(d)
    if kind == 'ge': f = 90 + 70 * np.exp(-tt * 14); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .18)
    else: f = 330; x = (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 2.3 * tt)) * env_exp(d, .07) + hp(noise(d), 2000) * env_exp(d, .01) * .4
    x[:24] *= np.linspace(0, 1, 24); return x * v * .5
def khartal(v=1.0):
    d = .12; tt = t_(d); x = sum(np.sin(2 * np.pi * f * tt) * env_exp(d, .025) for f in (3100, 4700, 6900)) + hp(noise(d), 5000) * env_exp(d, .01)
    return x * v * .12
def harmonium(ms, d, v=1.0):
    tt = t_(d); x = 0
    for m in ms:
        f = hz(m); x = x + sum(np.sin(2 * np.pi * f * k * tt) * (1 / k) * (1.2 if k % 2 else .7) for k in range(1, 10)) + .3 * sum(np.sin(2 * np.pi * f * 1.003 * k * tt) / k for k in range(1, 6))
    return lp(x, 2400) * adsr(d, .15, .4) * (1 + .06 * np.sin(2 * np.pi * 5.2 * tt)) * v * .07
PAT = ['ge', 'na', 'na', 'ge', 'na', 'ge', 'na', 'na']   # a keherwa-like groove in eighths
def groove(a, b, v=.8):
    t, i = a, 0
    while t < b - 1e-6:
        M.m(dholak(PAT[i % 8], v * (1 if i % 4 == 0 else .75)), t, 1.0, -.2)
        if i % 2 == 1: M.m(khartal(v), t, 1.0, .35)
        t += BEAT / 2; i += 1
groove(5.4, 28.0, .7); groove(33.0, 43.6, .8); groove(44.4, 55.6, .9)
CH = [(0.3, [62, 66, 69], 5.0), (5.4, [62, 66, 69], 6.0), (11.4, [64, 67, 71], 6.0), (17.4, [62, 66, 69], 6.0), (23.4, [59, 62, 66], 4.6), (33.0, [62, 66, 69, 74], 5.4), (38.4, [64, 67, 71], 5.2), (44.4, [62, 66, 69], 5.4), (49.8, [67, 71, 74], 5.6), (56.0, [62, 69, 74], 4.0)]
for t0, ms, d in CH: M.m(harmonium(ms, d, .9), t0, 1.0, .1)
for e in E['ev']:
    ty, t0 = e['type'], e['t']
    if ty == 'lamp': M.f(flame(3.0, 1.2), t0, 1.0, -.6 + .2 * e['i']); M.f(click(.8, .25), t0, 1.0, 0)
    elif ty == 'cloth': M.f(paper(.8, 1.0), t0 - .3, 1.0, 0)
    elif ty == 'tap': M.f(clack(1.2, .6), t0, 1.0, .2); M.f(clack(1.4, .4), t0 + .15, 1.0, .2)
    elif ty == 'pull': M.f(whoosh(2.6, .25), t0, 1.0, 0)
    elif ty == 'snap': M.f(clack(.9, 1.0), t0, 1.0, 0); M.f(thump(.6, 80), t0, 1.0, 0)
    elif ty == 'seal': M.f(thump(.8, 110), t0, 1.0, .3); M.f(clack(.7, .6), t0, 1.0, .3)
    elif ty == 'fifty': M.f(flame(11, 1.4), t0, 1.0, 0)
    elif ty == 'end': M.m(bell(74, .5), t0, 1.0, 0)
M.f(flame(60, .7), 0, 1.0, 0)
M.gate(28.0, 33.0, .0); M.gate(43.6, 44.4, .0, fade=.15)
M.voice({'l1': 1.2, 'l2': 7.0, 'l3': 12.8, 'l4': 35.0, 'l5': 46.6}); M.write()
