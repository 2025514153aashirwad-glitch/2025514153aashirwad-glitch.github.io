"""Samatwam 01 · The Line of a Work — score, foley, narrator, mix. All synthesized (no samples). 96 BPM, D major.
Writes out/mix.wav (48 kHz stereo)."""
import json, os, sys
import numpy as np, soundfile as sf, soxr
from scipy.ndimage import uniform_filter1d
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, click, clack, whoosh, thump, compress, limit, add

E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; EV = E['ev']
VO = {'l1': 0.9, 'l2': 6.0, 'l3': 14.0, 'l4': 28.0, 'l5': 35.0, 'l6': 47.5}
BEAT = .625; BAR = 2.5; N = int((DUR + 3) * SR)
mus, fol, vox = (np.zeros((N, 2)) for _ in range(3))
rng = np.random.default_rng(5); hz = lambda m: 440 * 2 ** ((m - 69) / 12)
P = lambda buf, x, t, g=1.0, pan=0.0: add(buf, x, t, g, pan)

def adsr(d, a=.01, r=.3):
    n = len(t_(d)); e = np.ones(n); na, nr = max(1, int(a * SR)), max(1, int(r * SR)); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def marimba(m, v=1.0, d=1.0):
    f = hz(m); tt = t_(d); x = np.sin(2 * np.pi * f * tt) * env_exp(d, .33 * (60 / max(m, 40)) ** .6) + .3 * np.sin(2 * np.pi * f * 3.93 * tt) * env_exp(d, .05) + .08 * np.sin(2 * np.pi * f * 9.2 * tt) * env_exp(d, .012)
    x[:48] *= np.linspace(0, 1, 48); return (x + hp(noise(d), 2000) * env_exp(d, .002) * .12) * v * .45
def glock(m, v=1.0, d=1.6):
    f = hz(m); tt = t_(d); x = np.sin(2 * np.pi * f * tt) * env_exp(d, .5) + .4 * np.sin(2 * np.pi * f * 2.76 * tt) * env_exp(d, .15) + .2 * np.sin(2 * np.pi * f * 5.4 * tt) * env_exp(d, .05)
    x[:24] *= np.linspace(0, 1, 24); return x * v * .3
def vib(m, v=1.0, d=2.4):
    f = hz(m); tt = t_(d); x = (np.sin(2 * np.pi * f * tt) * env_exp(d, 1.0) + .15 * np.sin(2 * np.pi * f * 4 * tt) * env_exp(d, .2)) * (1 - .2 * (.5 + .5 * np.sin(2 * np.pi * 5 * tt)))
    x[:96] *= np.linspace(0, 1, 96); return x * v * .38
def pizz(m, v=1.0, d=.8):
    f = hz(m); tt = t_(d); x = sum((1 / k) * np.sin(2 * np.pi * f * k * tt) * env_exp(d, .26 / k ** .5) for k in range(1, 6)); x[:72] *= np.linspace(0, 1, 72); return lp(x, 1600) * v * .45
def pad(ms, d, v=1.0, a=1.0, r=1.5, cut=1200):
    tt = t_(d); x = np.zeros(len(tt))
    for m in ms:
        for det in (-.06, 0, .05):
            f = hz(m) * 2 ** (det / 12); x += sum(np.sin(2 * np.pi * f * k * tt + rng.random() * 6) / k ** 1.4 for k in range(1, 7))
    return norm(lp(x, cut) * adsr(d, a, r)) * v * .4
def voice(kind, m, v=1.0, d=.5):   # extra ostinato voices that join as lines are drawn
    f = hz(m); tt = t_(d)
    if kind == 'flute': x = (np.sin(2 * np.pi * f * tt) + .05 * noise(d)) * adsr(d, .04, .2)
    elif kind == 'harp': x = sum(np.sin(2 * np.pi * f * k * tt) / k ** 1.5 * env_exp(d, .5 / k) for k in range(1, 6))
    elif kind == 'horn': x = lp(sum(np.sin(2 * np.pi * f * k * tt) / k for k in range(1, 8)), 900) * adsr(d, .05, .2)
    elif kind == 'oboe': x = lp(sum(np.sin(2 * np.pi * f * k * tt) * (1 if k % 2 else .6) / k for k in range(1, 9)), 2400) * adsr(d, .03, .15)
    else: x = glock(m, 1, d) / .3
    return x * v * .22
def kick(v=1.0):
    d = .35; tt = t_(d); f = 50 + 80 * np.exp(-tt * 28); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .1) * v * .6
def chime(t, v=1.0):   # the two-note station chime: A5 → F#5, glockenspiel an octave up
    for dt, m in [(0, 81), (.32, 78)]: P(mus, vib(m, v, 2.2), t + dt, 1.0, .1); P(mus, glock(m + 12, v * .6), t + dt, 1.0, -.1)

D_, Bm, G_, A_ = [50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]
PROG = [D_, Bm, G_, A_]
chord = lambda t: PROG[int(t // BAR) % 4]
# ostinato: marimba eighths + pizzicato bass; out for the tunnel (25.0–34.0), back on Held
def ost(a, b, v=.5):
    t = a; i = 0; pat = [0, 2, 3, 2, 1, 3, 2, 3]
    while t < b - 1e-6:
        c = chord(t); P(mus, marimba(c[pat[i % 8]] + 12, v * (1 if i % 2 == 0 else .7)), t, 1.0, .3 if i % 2 else -.3)
        if i % 4 == 0: P(mus, pizz(c[0] - 12 + 12, .85), t, 1.0, 0)
        if i % 8 == 0: P(mus, kick(.5), t, 1.0, 0)
        t += BEAT / 2; i += 1
ost(2.5, 24.6, .45); ost(34.2, 54.2, .45)
for t0 in np.arange(0, 25, BAR): P(mus, pad(chord(t0)[:3], BAR + 1.2, .35), t0, 1.0, 0)
for t0 in np.arange(35.0, 52.5, BAR): P(mus, pad(chord(t0)[:3], BAR + 1.2, .35), t0, 1.0, 0)
# pull-back: one voice joins per new line (each on its own phrase)
for k, (kind, t0) in enumerate([('flute', 42.6), ('harp', 43.9), ('horn', 45.2), ('oboe', 46.5), ('glock', 47.8)]):
    t = t0
    while t < 52.4:
        c = chord(t); m = c[(k + int(t / BEAT)) % 4] + (24 if kind in ('flute', 'glock', 'oboe') else 12)
        P(mus, voice(kind, m, .8, .5 if kind != 'harp' else .9), t, 1.0, -.6 + .3 * k); t += BEAT
# the end thins to a pad and the chime
P(mus, pad([50, 57, 62, 66, 69], 8.5, .5, a=1.5, r=3), 52.2, 1.0, 0)
# the tunnel: a submerged bed only (filtered water), so near-silence reads under the review
tun = lp(noise(7.0), 300) * adsr(7.0, 1.0, 1.0) * .05; P(mus, tun, 26.6, 1.0, 0)

# ---------------- foley from events
def nib(d, v=1.0):   # felt tip on paper tooth
    n = bp(noise(d), 1800, 6000) * (1 + .4 * np.sin(2 * np.pi * 13 * t_(d))); e = np.minimum(1, t_(d) / .1) * np.minimum(1, (d - t_(d)) / .2); return n * e * .05 * v
for a, b in [(1.5, 9.0), (11.2, 16.0), (13.6, 17.3), (20.0, 24.0), (26.6, 34.0), (42.4, 52.0)]: P(fol, nib(b - a, 1.0 if a < 42 else .6), a, 1.0, .1)
def relay(v=1.0): return (click(1.5, .6) + np.pad(click(2.2, .3), (int(.012 * SR), 0))[:len(click(1.5, .6))]) * v
STOPN = [62, 64, 66, 69, 71]
for e in EV:
    ty, t, pan = e['type'], e['t'], float(e.get('pan', 0) or 0)
    if ty == 'stop': P(fol, relay(.45), t, .6, pan); P(mus, glock(STOPN[int(t * 7) % 5] + 12, .55), t, .6, pan)
    elif ty == 'minor': P(fol, click(2.4, .12), t, .4, pan)
    elif ty == 'x': P(fol, clack(1.1, .5), t, .6, pan); P(fol, thump(.4, 80), t, .5, pan)
    elif ty == 'drop':
        tt = t_(.42); wh = np.sin(2 * np.pi * np.cumsum(2400 - 1800 * tt / .42) / SR) * .15 * adsr(.42, .02, .05)
        P(fol, wh, t - .42, 1.0, 0); P(fol, thump(1.0, 55), t, 1.0, 0); P(fol, clack(.6, .9), t, .8, 0)
    elif ty == 'chime': chime(t, .9)
    elif ty == 'stage': P(fol, relay(.6), t, .7, -.6)
    elif ty == 'land':
        for k in range(14): P(fol, click(3.0, .25), t - 1.2 + k * .085, .5, -.6)   # counter ratchet
        P(fol, clack(1.8, .5), t, .6, -.6)
    elif ty == 'surface': pass
    elif ty == 'glide': P(fol, whoosh(1.0, .4), t, .5, .3)
    elif ty == 'here': P(mus, vib(81, .6, 2.5), t, 1.0, 0)
    elif ty == 'end': chime(t + .3, .8)
# muted rail hum bed, whole film except the silences
hum = lp(noise(DUR + 3), 160) * .03 + np.sin(2 * np.pi * 50 * np.arange(N) / SR)[:len(lp(noise(DUR + 3), 160))] * .002
g = np.ones(N); tt = np.arange(N) / SR
g = np.where((tt > 24.6) & (tt < 34.0), .25, g); g = np.where((tt > 33.2) & (tt < 34.0), .0, g)
hum = hum[:N] * uniform_filter1d(g, int(.3 * SR)); fol[:, 0] += hum; fol[:, 1] += np.roll(hum, 1500)
# tunnel: everything low-passed (submerged) 26.6–33.6; silence 24.6–26.6 and 33.2–34.0 for the music
for c in range(2):
    seg_ = (tt > 26.4) & (tt < 33.8); mus[seg_, c] = lp(mus[:, c], 520)[seg_]
mg = np.ones(N); mg = np.where((tt > 24.8) & (tt < 26.6), .15, mg); mg = np.where((tt > 33.2) & (tt < 34.0), 0, mg)
mus *= uniform_filter1d(mg, int(.25 * SR))[:, None]

# ---------------- narrator
duck = np.ones(N)
for lid, t0 in VO.items():
    x, sr = sf.read(os.path.join(HERE, 'vo', lid + '.wav')); x = x.mean(1) if x.ndim > 1 else x
    x = compress(norm(hp(soxr.resample(x, sr, SR), 80), .9), .22, 3.0); s = int(t0 * SR); e = min(N, s + len(x))
    vox[s:e, 0] += x[:e - s]; vox[s:e, 1] += x[:e - s]; duck[max(0, s - int(.15 * SR)):min(N, e + int(.3 * SR))] = .5
duck = uniform_filter1d(duck, int(.12 * SR))
mid = np.stack([bp(mus[:, c], 300, 4000) for c in range(2)], 1); mus = mus * duck[:, None] - mid * (1 - duck)[:, None] * .4
rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-12); on = np.abs(vox[:, 0]) > 1e-4
gm = rms(vox[on]) / (rms(mus[on] + fol[on]) * 10 ** (10 / 20))
mix = (vox + (mus * .9 + fol) * gm)[:int(DUR * SR)]
for c in range(2): mix[:, c] -= lp(mix[:, c], 75, 4) * .4                         # shelf the sub
mix = np.tanh(mix / np.abs(mix).max() * 1.1) * .8                                   # soft-clip clicks before the limiter
mix = np.stack([limit(mix[:, c], .9) for c in range(2)], 1)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24'); print('mix.wav', len(mix) / SR, 's')
