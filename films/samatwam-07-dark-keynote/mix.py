"""Samatwam 07 · Five Layers — phasing synth arpeggios at 120 BPM; a low sub on each snap; digital zero at the freeze; one tone at the end."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from samatwam_audio import *
E = json.load(open(os.path.join(HERE, 'events.json'))); M = Mix(E['dur'], HERE)
BEAT = .5
def syn(m, v=1.0, d=.22, cut=2600):
    f = hz(m); tt = t_(d); x = np.sign(np.sin(2 * np.pi * f * tt)) * .4 + np.sin(2 * np.pi * f * 2 * tt) * .3 + np.sin(2 * np.pi * f * 1.004 * tt) * .5
    return lp(x, cut) * adsr(d, .004, .12) * v * .25
def sub(v=1.0, d=1.0):
    tt = t_(d); f = 38 + 30 * np.exp(-tt * 8); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .35); x = x + .25 * np.tanh(3 * x); x[:96] *= np.linspace(0, 1, 96); return x * v * .9
def tick(v=1.0, p=1.0): return click(2.2 * p, .4) * v
# two arpeggios at slightly different lengths (7 and 8 steps) phase against each other; more voices join with each layer
A = [62, 66, 69, 73, 76, 73, 69]; B = [50, 57, 62, 64, 62, 57, 54, 57]
layers = sorted(e['t'] for e in E['ev'] if e['type'] == 'layer')
def density(t): return sum(1 for x in layers if x <= t)
t, i = 4.0, 0
while t < 54.0:
    if not (30.0 <= t < 33.0):
        d = density(t); fast = t >= 24.2 and t < 30
        M.m(syn(A[i % 7] + 12, .55, .2), t, 1.0, -.4)
        if d >= 2 or fast: M.m(syn(B[i % 8] + 12, .45, .2, 1800), t + .01, 1.0, .4)
        if d >= 3 or fast: M.m(syn(A[(i + 3) % 7] + 24, .3, .14, 4000), t + BEAT / 4, 1.0, .1)
        if d >= 4: M.m(syn(B[i % 8], .5, .3, 900), t, 1.0, 0)
        if t > 46: M.m(syn(A[i % 7] + 12, .3 * (1 - (t - 46) / 8), .2), t, 1.0, -.4)
    step = BEAT / 2 if not (24.2 <= t < 30) else BEAT / (2 + 2 * (t - 24.2) / 5.8)   # faster and faster
    t += step; i += 1
# the single tone the music subtracts to, held under the end card
tt = t_(6.5); M.m(np.sin(2 * np.pi * hz(74) * tt) * adsr(6.5, 1.0, 2.0) * .12, 53.5, 1.0, 0)
# UI foley from one family: tile ticks, card whooshes, a sub on each layer snap and the big snap
for e in E['ev']:
    ty, t0 = e['type'], e['t']
    if ty == 'tile': M.f(tick(.5, 1.0 + .1 * e['i']), t0, 1.0, 0)
    elif ty == 'layer': M.f(sub(.8), t0, 1.0, 0); M.f(tick(.7, .8), t0, 1.0, 0)
    elif ty == 'card' and t0 < 30: M.f(hp(whoosh(.18, .25), 1500), t0, 1.0, (hash(t0) - .5) if 'hash' in dir() else 0)
    elif ty == 'snap': M.f(sub(1.2, 1.4), t0, 1.0, 0); M.f(clack(1.8, .8), t0 + .5, 1.0, 0); M.f(whoosh(.5, .5), t0, 1.0, 0)
    elif ty == 'giant': M.f(sub(.7, 1.2), t0, 1.0, 0)
    elif ty == 'end': M.f(sub(.6, 1.6), t0, 1.0, 0)
    elif ty == 'blink':
        for k in range(8): M.f(tick(.25, 1.6), k * .5, 1.0, 0)
M.gate(30.0, 33.0, 0.0, fade=.02)   # digital zero
M.voice({'l1': 1.5, 'l2': 14.2, 'l3': 19.2, 'l4': 25.0, 'l5': 33.4, 'l6': 47.4}); M.write()
