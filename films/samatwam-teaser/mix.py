"""Score, foley, narrator and mix for the Samatwam teaser. All music is synthesized here (no samples).
96 BPM (bar 2.5 s), D major. Writes out/mix.wav (48 kHz stereo)."""
import json, os, sys
import numpy as np, soundfile as sf, soxr
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, click, clack, whoosh, thump, compress, limit, add

E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; EV = E['ev']
VO = {'l1': 1.2, 'l2': 9.2, 'l3': 15.0, 'l4': 25.4, 'l5': 30.6, 'l6': 36.25, 'l7': 46.6, 'l8': 55.4}
BEAT = .625; BAR = 2.5
N = int((DUR + 3) * SR)
mus = np.zeros((N, 2)); fol = np.zeros((N, 2)); vox = np.zeros((N, 2))
rng = np.random.default_rng(11)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------------- instruments ----------------
def adsr(d, a=.01, r=.3):
    n = len(t_(d)); e = np.ones(n); na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def pad(ms, d, v=1.0, a=1.2, r=1.6, cut=1600):
    tt = t_(d); x = np.zeros(len(tt))
    for m in ms:
        f = hz(m)
        for det in (-.07, 0, .06):
            ff = f * 2 ** (det / 12)
            for k in range(1, 9): x += np.sin(2 * np.pi * ff * k * tt + rng.random() * 6) / k ** 1.3
    x = lp(x, cut, 2) * adsr(d, a, r)
    return norm(x) * v * .5
def pluck(m, v=1.0, d=1.1, bright=1.0):
    f = hz(m); tt = t_(d)
    x = sum((1 / k ** 1.1) * np.sin(2 * np.pi * f * k * tt) * env_exp(d, .45 / (k ** (.8 * bright))) for k in range(1, 8))
    x[:64] *= np.linspace(0, 1, 64); return x * v * .32
def bell(m, v=1.0, d=2.6):
    f = hz(m); tt = t_(d); e = env_exp(d, .9)
    x = np.sin(2 * np.pi * f * tt + 1.6 * env_exp(d, .25) * np.sin(2 * np.pi * f * 3.5 * tt)) * e + .25 * np.sin(2 * np.pi * f * 2.76 * tt) * env_exp(d, .4)
    x[:48] *= np.linspace(0, 1, 48); return x * v * .3
def sub(v=1.0, d=1.6, f0=58, f1=38):
    tt = t_(d); f = f1 + (f0 - f1) * np.exp(-tt * 6)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .5)
    x = x + .3 * np.tanh(3 * x)                       # harmonics so it speaks on small speakers
    x[:96] *= np.linspace(0, 1, 96); return x * v * .9
def kick(v=1.0):
    d = .4; tt = t_(d); f = 48 + 90 * np.exp(-tt * 28)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .12) + hp(noise(d), 3000) * env_exp(d, .002) * .2) * v * .7
def hat(v=1.0):
    d = .06; return hp(noise(d), 7000) * env_exp(d, .012) * v * .25
def riser(d, v=1.0):
    tt = t_(d); n = noise(d); out = np.zeros_like(n)
    for i in range(0, len(n), 960):
        hi = min(len(n), i + 960); f = 300 + 5000 * (i / len(n)) ** 2
        out[i:hi] = bp(n[max(0, i - 4000):hi], f * .8, f * 1.25)[-(hi - i):]
    sw = np.sin(2 * np.pi * np.cumsum(220 + 660 * (tt / d) ** 2) / SR) * .15
    return (out * .6 + sw) * (tt / d) ** 2 * v
def P(buf, x, t, g=1.0, pan=0.0): add(buf, x, t, g, pan)

# ---------------- score ----------------
D_, Bm, G_, A_, Em, Asus = [50, 57, 62, 66, 69], [47, 54, 59, 62, 66], [43, 50, 55, 59, 62], [45, 52, 57, 61, 64], [40, 47, 52, 55, 59], [45, 52, 57, 62, 64]
PROG = [(0, D_), (5, Bm), (10, G_), (12.5, A_),                       # seed, what enters
        (15, G_), (17.5, D_), (20, Em), (22.5, A_),                    # studio
        (24.6, Bm),                                                    # review (held)
        (30, D_), (32.5, A_), (35, Bm),                                # verdict and record
        (37.5, G_), (40, D_), (42.5, A_),                              # give back, spine
        (45, G_), (47.5, Asus),                                        # vessel
        (50, D_), (52.5, G_), (55, D_)]                                # pull-back, reveal
for i, (t0, ch) in enumerate(PROG):
    t1 = PROG[i + 1][0] if i + 1 < len(PROG) else DUR
    v = .5 if t0 < 14 else .45
    if 24.6 <= t0 < 30: v = .55
    if t0 >= 50: v = .75
    P(mus, pad(ch[:4], t1 - t0 + 1.4, v, a=.5 if t0 > 0 else 1.5, r=1.4, cut=1300 if t0 < 50 else 2200), t0, 1.0, 0)
def chord_at(t):
    c = PROG[0][1]
    for t0, ch in PROG:
        if t >= t0: c = ch
    return c
# arpeggio plucks: sparse in act A, 8ths in the studio, 16ths in give-back
arp = [0, 2, 3, 4, 3, 2, 1, 2]
def arp_run(a, b, step, octv, v, bright=1.0):
    t = a; i = 0
    while t < b - 1e-6:
        c = chord_at(t); m = c[arp[i % 8] % len(c)] + 12 * octv
        P(mus, pluck(m, v * (1.0 if i % 2 == 0 else .7), 1.0, bright), t, 1.0, .35 if i % 2 else -.35); t += step; i += 1
arp_run(2.5, 13.75, BEAT, 1, .5)
arp_run(15.0, 24.4, BEAT / 2, 1, .45)
arp_run(30.0, 35.6, BEAT / 2, 1, .4)
arp_run(37.5, 42.4, BEAT / 4, 2, .28, 1.4)
# pulse and soft drums: studio, record, give back, pull-back
def groove(a, b, kickv=.7):
    t = a; i = 0
    while t < b - 1e-6:
        if i % 4 in (0, 2): P(mus, kick(kickv), t, 1.0, 0)
        P(mus, hat(.5 if i % 2 else .8), t + BEAT / 2, 1.0, .2)
        c = chord_at(t); P(mus, lp(pluck(c[0] - 12 + 12, .5, .3, .6), 900), t, 1.0, 0); P(mus, lp(pluck(c[0] - 12 + 12, .35, .3, .6), 900), t + BEAT / 2, 1.0, 0)
        t += BEAT; i += 1
groove(15.0, 24.4); groove(30.0, 35.6, .55); groove(37.5, 42.4, .6); groove(51.25, 55.0, .5)
# hits
P(mus, bell(86, .7), .15, 1.0, .1); P(mus, sub(.6, 1.4), .15, 1.0, 0)                     # the seed
for m in [62, 66, 69, 74, 78]: P(mus, bell(m + 12, .45, 3.2), 30.0, 1.0, (m - 70) / 16)   # the verdict
P(mus, sub(1.0, 2.0), 30.0, 1.0, 0)
for k, m in enumerate([93, 90, 86, 81]): P(mus, bell(m, .35, 1.8), 38.4 + k * .09, 1.0, -.4 + .27 * k)  # diverge
for k, m in enumerate([81, 83, 86, 90]): P(mus, bell(m, .5, 2.2), [45.6, 46.7, 47.8, 48.9][k], 1.0, -.2 + .15 * k)  # emblems
P(mus, riser(2.6, .5), 42.4, 1.0, 0); P(mus, riser(4.8, .55), 50.2, 1.0, 0)
for m in [50, 57, 62, 66, 69, 74]: P(mus, bell(m + 12, .55, 6.5), 55.0, 1.0, (m - 64) / 20)  # the reveal
P(mus, sub(1.1, 3.0, 62, 37), 55.0, 1.0, 0)
for k, m in enumerate([74, 69, 66, 62]): P(mus, pluck(m + 12, .5, 2.0), 57.5 + k * BEAT, 1.0, .2 - .13 * k)

# near-silence before the verdict: music down 29.2 → 30.0, back on the hit
tt = np.arange(N) / SR
gate = np.ones(N); gate = np.where((tt > 29.0) & (tt < 30.0), np.clip(1 - (tt - 29.0) / .45, .08, 1), gate)
mus *= gate[:, None]

# ---------------- foley (from the page's events) ----------------
def hiss(d, v=1.0, lo=2500, hi=9000):
    n = bp(noise(d), lo, hi); e = np.minimum(1, t_(d) / .03) * np.minimum(1, (d - t_(d)) / .1); return n * e * .2 * v
def softwhoosh(d, v=1.0): return lp(whoosh(d, 1.0), 2500) * v
def keys(d, v=1.0):
    out = np.zeros(len(t_(d))); t = 0.0
    while t < d - .05: x = click(1.8 + rng.random() * .4, .25); s = int(t * SR); e = min(len(out), s + len(x)); out[s:e] += x[:e - s]; t += .045 + rng.random() * .03
    return out * v
for e in EV:
    ty, t = e['type'], e['t']; i = e.get('i', 0)
    if ty == 'rule': P(fol, hiss(.6, .7), t, 1.0, -.3 + .3 * i)
    elif ty == 'chip': P(fol, click(1.2 + .08 * i, .35), t + .45, .5, -.6 + .24 * i)
    elif ty == 'select': P(fol, click(1.6, .6), t, .7, 0); P(fol, pluck(86, .5, .6), t + .45, .5, 0)
    elif ty == 'move': P(fol, softwhoosh(e['d'], .25), t, .5, .2)
    elif ty == 'draw': P(fol, hiss(e['d'], .35, 3000, 8000), t, .6, -.1)
    elif ty == 'person': P(fol, click(.9 + .05 * i, .4), t, .45, -.5)
    elif ty == 'card': P(fol, softwhoosh(.6, .6), t, .7, .4); P(fol, clack(1.4, .4), t + .55, .5, .4)
    elif ty == 'row': P(fol, click(2.0, .3), t, .4, .3)
    elif ty == 'hex': P(fol, click(1.1 + .07 * i, .45), t + .3, .5, -.4 + .16 * i)
    elif ty == 'type': P(fol, keys(e['d'], .5), t, .55, .4)
    elif ty == 'tick': P(fol, pluck(93, .4, .5), t, .5, .4)
    elif ty == 'whoosh': P(fol, whoosh(e['d'], .8), t, .55, -.2)
    elif ty == 'scan': P(fol, hiss(e['d'], .25, 1200, 3000), t, .6, 0)
    elif ty == 'pass': P(fol, pluck(81 + 4 * i, .6, .9, 1.3), t, .7, -.3)
    elif ty == 'fail': P(fol, thump(.6, 90), t, .6, -.3); P(fol, lp(click(.6, .5), 900), t, .5, -.3)
    elif ty == 'verdict': P(fol, clack(.8, .9), t, .7, 0)
    elif ty == 'print': P(fol, keys(.35, .45), t, .5, .45)
    elif ty == 'diverge': P(fol, softwhoosh(.7, .5), t, .6, 0)
    elif ty == 'cell': P(fol, click(1.7 + .04 * i, .25), t, .35, .5)
    elif ty == 'bead': P(fol, pluck([74, 76, 78, 81, 83][i], .5, .8, 1.2), t, .6, 0)
    elif ty == 'reveal': P(fol, clack(.7, .6), t, .5, 0)
room = lp(noise(DUR + 3), 400) * .004
fol[:, 0] += room[:N]; fol[:, 1] += np.roll(room, 3000)[:N]

# ---------------- narrator ----------------
duck = np.ones(N)
for lid, t0 in VO.items():
    x, sr = sf.read(os.path.join(HERE, 'vo', lid + '.wav'))
    if x.ndim > 1: x = x.mean(1)
    x = soxr.resample(x, sr, SR); x = hp(x, 80); x = compress(norm(x, .9), .22, 3.0)
    s = int(t0 * SR); e = min(N, s + len(x))
    vox[s:e, 0] += x[:e - s]; vox[s:e, 1] += x[:e - s]
    a = max(0, s - int(.15 * SR)); b = min(N, e + int(.3 * SR)); duck[a:b] = .5
from scipy.ndimage import uniform_filter1d
duck = uniform_filter1d(duck, int(.12 * SR))
# dip the music's 300 Hz–4 kHz band further under the voice
midband = np.stack([bp(mus[:, c], 300, 4000) for c in range(2)], 1)
mus = mus * duck[:, None] - midband * (1 - duck)[:, None] * .4

def rms(x): return np.sqrt(np.mean(x ** 2) + 1e-12)
vs = vox[np.abs(vox[:, 0]) > 1e-4]; ms = mus[np.abs(vox[:, 0]) > 1e-4]
gv = 1.0; gm = rms(vs) / (rms(ms) * 10 ** (10 / 20)) if len(vs) else 1.0     # voice ~10 dB above the bed
mix = vox * gv + mus * gm + fol * gm * 1.1
mix = mix[:int(DUR * SR)]
for c in range(2):
    low = lp(mix[:, c], 110, 4); mix[:, c] -= low * .25
mix = mix / np.abs(mix).max() * .85
mix = np.stack([limit(mix[:, c], .95) for c in range(2)], 1)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
print('mix.wav', round(len(mix) / SR, 2), 's; music gain', round(float(gm), 3))
