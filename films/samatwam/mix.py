"""Score, foley and mix for SAMATWAM — all synthesized (no samples). Writes out/mix.wav (48 kHz stereo).
Score: marimba, vibraphone, kalimba and plucked bass, modal synthesis, D major pentatonic, 100 BPM."""
import json, os, sys
import numpy as np
import soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, click, clack, whoosh, thump, compress, limit, add

E = json.load(open(os.path.join(HERE, 'events.json')))
DUR = E['dur']; EV = E['ev']
BEAT = .6; BAR = 2.4
rng = np.random.default_rng(3)
mus = np.zeros((int((DUR + 2) * SR), 2)); fol = np.zeros_like(mus); amb = np.zeros_like(mus)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---- instruments (modal synthesis) ----
def marimba(m, v=1.0, d=1.2):
    f = hz(m); tt = t_(d)
    x = (np.sin(2 * np.pi * f * tt) * env_exp(d, .38 * (60 / max(m, 40)) ** .6)
         + .32 * np.sin(2 * np.pi * f * 3.93 * tt) * env_exp(d, .05)
         + .10 * np.sin(2 * np.pi * f * 9.2 * tt) * env_exp(d, .012))
    x[:48] *= np.linspace(0, 1, 48)
    x += hp(noise(d), 2000) * env_exp(d, .002) * .15   # mallet tick
    return x * v * .5

def vib(m, v=1.0, d=3.0, trem=5.2, trem_depth=.25):
    f = hz(m); tt = t_(d)
    x = (np.sin(2 * np.pi * f * tt) * env_exp(d, 1.3) + .18 * np.sin(2 * np.pi * f * 4.0 * tt) * env_exp(d, .25)
         + .06 * np.sin(2 * np.pi * f * 10 * tt) * env_exp(d, .05))
    x *= 1 - trem_depth * (.5 + .5 * np.sin(2 * np.pi * trem * tt))
    x[:96] *= np.linspace(0, 1, 96)
    return x * v * .4

def kalimba(m, v=1.0, d=1.0):
    f = hz(m); tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) * env_exp(d, .45) + .25 * np.sin(2 * np.pi * f * 5.4 * tt) * env_exp(d, .03) + .12 * np.sin(2 * np.pi * f * 2 * tt) * env_exp(d, .2)
    x[:48] *= np.linspace(0, 1, 48)
    return x * v * .35

def pizz(m, v=1.0, d=.9):
    f = hz(m); tt = t_(d)
    x = sum((1 / k) * np.sin(2 * np.pi * f * k * tt) * env_exp(d, .28 / k ** .5) for k in range(1, 6))
    x[:72] *= np.linspace(0, 1, 72)
    return lp(x, 1800) * v * .45

PENT = [62, 64, 66, 69, 71]                    # D E F# A B
def pent(i):                                     # i-th degree of D pentatonic upward from D4
    return PENT[i % 5] + 12 * (i // 5)

# ---- score ----
def P(buf, x, t, g=1.0, pan=0.0): add(buf, x, t, g, pan)

# A: 0–9.6  sparse vibraphone, one note per bar (D, A, B, F#)
for k, m in enumerate([74, 81, 71, 78]):
    P(mus, vib(m, .8), k * BAR + .05, 1.0, -.2 + .15 * k)
# low marimba pulse, bars 3–4 (beats 1 and 3)
for b in range(8, 16, 2):
    P(mus, marimba(50 if (b // 4) % 2 == 0 else 45, .7), b * BEAT, .9, -.1)

# B: 9.6–31.2 marimba ostinato in eighths, chords change by station
prog = [(9.6, [50, 57, 62, 66]), (16.8, [47, 54, 59, 62]), (21.6, [43, 50, 55, 59]), (26.4, [45, 52, 57, 61])]
def chord_at(t):
    c = prog[0][1]
    for t0, cc in prog:
        if t >= t0: c = cc
    return c
pattern = [0, 2, 3, 2, 1, 3, 2, 3]               # chord-tone index per eighth
t = 9.6 - BEAT / 2                               # the J-cut: the ostinato enters half a beat early
i = 0
while t < 31.2 - 1e-6:
    c = chord_at(max(t, 9.6)); m = c[pattern[i % 8]] + 12
    acc = 1.0 if i % 2 == 0 else .7
    P(mus, marimba(m, .55 * acc, .8), t, 1.0, .25 if i % 2 else -.25)
    if i % 8 == 0 and t >= 9.6:                  # bass on downbeats
        P(mus, pizz(c[0] - 12 + 12, .9), t, 1.0, 0)
    if i % 8 == 4 and t >= 9.6:
        P(mus, pizz(c[0] + 7 - 12 + 12, .6), t, 1.0, 0)
    t += BEAT / 2; i += 1
# station chords on vibraphone
for t0, c in prog:
    for m in c[1:]:
        P(mus, vib(m + 12, .45, 2.4), t0, 1.0, .1)

# C: held — vibraphone chord + low thud; D: swell; E: cadence
held = next(e['t'] for e in EV if e['type'] == 'held')
for m in [62, 66, 69, 74, 78]:
    P(mus, vib(m, .7, 4.5, trem=4.0), held, 1.0, (m - 70) / 20)
P(mus, pizz(38, 1.0, 1.6), held, 1.1, 0)
sw = next(e for e in EV if e['type'] == 'swell')
for k, m in enumerate([74, 78, 81, 86]):          # rising tremolo through the gold
    P(mus, vib(m, .35 + .1 * k, 3.4 - .5 * k, trem=7.0, trem_depth=.6), sw['t'] + k * .6, 1.0, -.3 + .2 * k)
# end card cadence D–A–D, on the bar grid (45.6, 46.8, 48.0)
for tt0, ms in [(45.6, [50, 62, 66]), (46.8, [45, 61, 64]), (48.0, [50, 62, 69, 74])]:
    for m in ms:
        P(mus, marimba(m + 12, .6, 2.2), tt0, 1.0, (m - 60) / 30)
    P(mus, pizz(ms[0], .8, 1.4), tt0, 1.0, 0)
P(mus, vib(86, .5, 3.0, trem=3.0), 48.0, 1.0, .2)

# ---- foley, from the page's events ----
def hiss(d, v=1.0):   # ruling pen across card
    n = bp(noise(d), 3000, 9000); e = np.minimum(1, t_(d) / .03) * np.minimum(1, (d - t_(d)) / .08)
    return n * e * .25 * v
def scratch(d, v=1.0):  # compass point turning
    n = bp(noise(d), 1500, 5000) * (1 + .6 * np.sin(2 * np.pi * 11 * t_(d))); e = np.sin(np.pi * t_(d) / d)
    return n * e * .18 * v
def drop(v=1.0, f=200):  # a small square landing on card
    d = .12; tt = t_(d)
    return norm(np.sin(2 * np.pi * f * tt) * env_exp(d, .02) + hp(noise(d), 1500) * env_exp(d, .003) * .6) * v

n_pix = 0
for e in EV:
    ty, t = e['type'], e['t']
    if ty == 'rule': P(fol, hiss(.45), t, .9, -.3 + .1 * (e['i'] % 6))
    elif ty == 'compass': P(fol, scratch(e['d']), t, 1.0, 0)
    elif ty == 'rise': P(fol, clack(1.6, .25), t, .5, .3)
    elif ty == 'path': P(fol, hiss(e['d'], 1.2), t, 1.0, .2)
    elif ty == 'slide': P(fol, hiss(e['d'] * .7, .5), t, .6, 0)
    elif ty == 'clack': P(fol, clack(.8, 1.0), t, .8, 0); P(fol, thump(.6, 90), t, .6, 0)
    elif ty == 'whoosh': P(fol, whoosh(e['d'], 1.0), t, .8, .4)
    elif ty == 'held': P(fol, thump(1.0, 55), t, 1.0, 0)
    elif ty == 'open': P(fol, whoosh(.9, .7), t - .3, .6, -.2)
    elif ty == 'pixel':
        n = e['n']
        pan = float(rng.uniform(-.5, .5))
        P(fol, click(1.3 + .2 * rng.random(), .3), t, .35, pan)
        P(fol, drop(.35, 160 + n), t, .3, pan)
        # a kalimba note per pixel, climbing the scale with the count; denser runs play every 2nd/3rd
        last16 = n > 97
        every = 1 if (n == 1 or last16) else (2 if n <= 46 else 3)
        if n % every == 0 or n == 1:
            deg = 5 + int(n / 113 * 9) if not last16 else 8 + (n - 97)
            P(mus, kalimba(pent(deg), .9 if last16 else .55), t, 1.0, pan * .6)

# ---- ambience: quiet room, all through ----
room = lp(brown(DUR + 2), 500) * .02 + hp(noise(DUR + 2), 4000) * .0015
amb[:, 0] += room[:len(amb)]; amb[:, 1] += np.roll(room, 2400)[:len(amb)]

# ---- near-silence before the last pixels: music out 31.6–34.6 ----
tt = np.arange(len(mus)) / SR
g = np.ones(len(mus))
g = np.where((tt > 31.6) & (tt < 34.55), np.clip(1 - (tt - 31.6) / .5, .0, 1), g)
mus *= g[:, None]

mix = mus * .9 + fol * .8 + amb
# low-end check: keep 20–120 Hz modest
for c in range(2):
    low = lp(mix[:, c], 120, 4); mix[:, c] = mix[:, c] - low * .3
mix = mix[:int(DUR * SR)]
mix = np.stack([limit(mix[:, c] / np.abs(mix).max() * .8, .9) for c in range(2)], 1)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
print('mix.wav', mix.shape[0] / SR, 's')
