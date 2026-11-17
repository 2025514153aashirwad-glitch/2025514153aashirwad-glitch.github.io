"""Samatwam film series — shared audio kit: synthesized instruments, foley, narrator placement and the final mix.
Everything is synthesized here (no samples). 48 kHz stereo."""
import os, sys, json
import numpy as np, soundfile as sf, soxr
from scipy.ndimage import uniform_filter1d
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
for p in (os.path.join(LIB, 'core', 'audio'), os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'core', 'audio')):
    if os.path.isdir(p): sys.path.insert(0, p)
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, click, clack, whoosh, thump, compress, limit, add

rng = np.random.default_rng(9)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def adsr(d, a=.01, r=.3):
    n = len(t_(d)); e = np.ones(n); na, nr = max(1, min(n, int(a * SR))), max(1, min(n, int(r * SR))); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def osc_saw(f, tt, k=10): return sum(np.sin(2 * np.pi * f * j * tt) / j for j in range(1, k))
# ---------------- melodic instruments
def pizz(m, v=1.0, d=.8):
    f = hz(m); tt = t_(d); x = sum((1 / k) * np.sin(2 * np.pi * f * k * tt) * env_exp(d, .26 / k ** .5) for k in range(1, 6)); x[:72] *= np.linspace(0, 1, 72); return lp(x, 1600) * v * .45
def bell(m, v=1.0, d=2.6):
    f = hz(m); tt = t_(d); x = np.sin(2 * np.pi * f * tt + 1.6 * env_exp(d, .25) * np.sin(2 * np.pi * f * 3.5 * tt)) * env_exp(d, .9) + .25 * np.sin(2 * np.pi * f * 2.76 * tt) * env_exp(d, .4)
    x[:48] *= np.linspace(0, 1, 48); return x * v * .3
def cello(m, d, v=1.0, a=.6, r=.8, vib=5.0):
    tt = t_(d); f = hz(m) * (1 + .004 * np.sin(2 * np.pi * vib * tt) * np.minimum(1, tt / .8))
    ph = 2 * np.pi * np.cumsum(f) / SR; x = sum(np.sin(ph * k) / k ** 1.15 for k in range(1, 12)) + .02 * noise(d)
    return lp(x, 1400) * adsr(d, a, r) * v * .22
def santoor(m, v=1.0, d=2.2):
    f = hz(m); tt = t_(d); x = 0
    for det in (-.0025, .0025): x = x + sum(np.sin(2 * np.pi * f * (1 + det) * k * tt) * env_exp(d, .9 / k ** .7) / k ** 1.2 for k in range(1, 7))
    x[:24] *= np.linspace(0, 1, 24); x += hp(noise(d), 3000) * env_exp(d, .004) * .3; return x * v * .18
def tanpura(root, d, v=1.0, cycle=2.6):
    tt = t_(d); out = np.zeros(len(tt))
    for j, (m, off) in enumerate([(root + 7, 0), (root + 12, .25), (root + 12, .5), (root, .75)]):
        f = hz(m); ph = ((tt / cycle - off) % 1)
        e = np.exp(-ph * 2.2) * np.minimum(1, ph * 40)
        x = sum(np.sin(2 * np.pi * f * k * tt) * (1 / k ** .6) for k in range(1, 16))   # jawari: bright partials
        out += x * e
    return lp(out, 3000) * adsr(d, 1.5, 2) * v * .06
def sarangi(notes, d, v=1.0):
    """notes: list of (t, midi); gliding bowed line with vibrato"""
    tt = t_(d); m = np.interp(tt, [n[0] for n in notes], [n[1] for n in notes])
    m = uniform_filter1d(m, int(.12 * SR)); f = hz(m) * (1 + .006 * np.sin(2 * np.pi * 5.5 * tt))
    ph = 2 * np.pi * np.cumsum(f) / SR; x = sum(np.sin(ph * k) * (1 / k) * (1.2 if k in (3, 5) else 1) for k in range(1, 14)) + .03 * noise(d)
    return bp(x, 250, 3500) * adsr(d, .4, .6) * v * .16
def tabla(kind, v=1.0):
    d = .6; tt = t_(d)
    if kind == 'ge':   # bayan: low with a pitch bend
        f = 70 + 60 * np.exp(-tt * 9); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .25)
    elif kind == 'na': # dayan ring
        f = 520; x = (np.sin(2 * np.pi * f * tt) + .6 * np.sin(2 * np.pi * f * 2.03 * tt) + .3 * np.sin(2 * np.pi * f * 3.01 * tt)) * env_exp(d, .18)
    elif kind == 'tin':
        f = 520; x = (np.sin(2 * np.pi * f * tt) * .8 + .5 * np.sin(2 * np.pi * f * 2.9 * tt)) * env_exp(d, .09)
    else:              # dha = ge + na
        return tabla('ge', v) * .8 + tabla('na', v) * .7
    x[:24] *= np.linspace(0, 1, 24); return (x + hp(noise(d), 2500) * env_exp(d, .003) * .2) * v * .5
def pad(ms, d, v=1.0, a=1.0, r=1.5, cut=1200):
    tt = t_(d); x = np.zeros(len(tt))
    for m in ms:
        for det in (-.06, 0, .05): f = hz(m) * 2 ** (det / 12); x += sum(np.sin(2 * np.pi * f * k * tt + rng.random() * 6) / k ** 1.4 for k in range(1, 7))
    return norm(lp(x, cut) * adsr(d, a, r)) * v * .4
# ---------------- foley
def metal_tick(v=1.0, pitch=1.0):   # brass plate on wood
    d = .35; tt = t_(d); x = sum(a * np.sin(2 * np.pi * f * pitch * tt) * env_exp(d, tau) for f, a, tau in [(2150, .5, .08), (3410, .35, .05), (5230, .2, .03), (840, .3, .02)])
    body = lp(noise(d), 600) * env_exp(d, .012) * .8 + np.sin(2 * np.pi * 180 * tt) * env_exp(d, .03) * .5
    return norm(x + body) * v
def detent(v=1.0): return (click(1.4, .5) + lp(click(.7, .4), 1200)) * v
def paper(d=.5, v=1.0): n = bp(noise(d), 900, 7000) * (np.abs(np.sin(2 * np.pi * 7 * t_(d))) ** 2); return n * adsr(d, .05, .2) * .2 * v
def knife(d=.6, v=1.0): n = bp(noise(d), 2500, 9000) * (1 + .7 * np.sin(2 * np.pi * 23 * t_(d))); return n * adsr(d, .03, .1) * .16 * v
def filament(v=1.0): x = bp(noise(.08), 4000, 9000) * env_exp(.08, .01) * .4; c = click(2.6, .35); x[:len(c)] += c; return x * v
def flame(d, v=1.0): n = lp(noise(d), 700) * (.6 + .4 * np.abs(np.sin(2 * np.pi * 1.7 * t_(d)))) + bp(noise(d), 1500, 4000) * .05; return n * adsr(d, 1, 1) * .05 * v
def crackle(d=.3, v=1.0): x = hp(noise(d), 4000) * (rng.random(len(t_(d))) > .993) * 4; return lp(x, 9000) * v * .3
def brush(d=.5, v=1.0): return bp(noise(d), 1200, 5000) * adsr(d, .08, .25) * .08 * v
def air(d, v=1.0): return lp(noise(d), 300) * .03 * v

class Mix:
    def __init__(s, dur, here):
        s.dur, s.here = dur, here; s.N = int((dur + 3) * SR); s.mus, s.fol, s.vox = (np.zeros((s.N, 2)) for _ in range(3)); s.duck = np.ones(s.N)
    def m(s, x, t, g=1.0, pan=0.0): add(s.mus, x, t, g, pan)
    def f(s, x, t, g=1.0, pan=0.0): add(s.fol, x, t, g, pan)
    def gate(s, a, b, level=0.0, fade=.25):       # music near-silence between a and b
        tt = np.arange(s.N) / SR; g = np.where((tt > a) & (tt < b), level, 1.0); s.mus *= uniform_filter1d(g, int(fade * SR))[:, None]
    def voice(s, VO):
        for lid, t0 in VO.items():
            x, sr = sf.read(os.path.join(s.here, 'vo', lid + '.wav')); x = x.mean(1) if x.ndim > 1 else x
            x = compress(norm(hp(soxr.resample(x, sr, SR), 80), .9), .22, 3.0); a = int(t0 * SR); e = min(s.N, a + len(x))
            s.vox[a:e, 0] += x[:e - a]; s.vox[a:e, 1] += x[:e - a]; s.duck[max(0, a - int(.15 * SR)):min(s.N, e + int(.3 * SR))] = .5
    def write(s, name='mix.wav'):
        duck = uniform_filter1d(s.duck, int(.12 * SR)); mid = np.stack([bp(s.mus[:, c], 300, 4000) for c in range(2)], 1)
        mus = s.mus * duck[:, None] - mid * (1 - duck)[:, None] * .4
        rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-12); on = np.abs(s.vox[:, 0]) > 1e-4
        gm = rms(s.vox[on]) / (rms(mus[on] + s.fol[on]) * 10 ** (10 / 20)) if on.any() else 1.0
        mix = (s.vox + (mus * .9 + s.fol) * gm)[:int(s.dur * SR)]
        for c in range(2): mix[:, c] -= lp(mix[:, c], 75, 4) * .4
        mix = np.tanh(mix / np.abs(mix).max() * 1.1) * .8
        mix = np.stack([limit(mix[:, c], .9) for c in range(2)], 1)
        os.makedirs(os.path.join(s.here, 'out'), exist_ok=True); sf.write(os.path.join(s.here, 'out', name), mix.astype(np.float32), SR, subtype='PCM_24'); print(name, len(mix) / SR, 's')
