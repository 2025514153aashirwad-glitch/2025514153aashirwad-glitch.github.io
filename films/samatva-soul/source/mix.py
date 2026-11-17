"""SAMATVA: The Vessel and the Light. Score and sound.
Tanpura on Sa (D) throughout: the equal note. One rhythmic phrase is handed around the loop:
tabla (Bharat) in Reform, madal (Nepal) in Build, talking drum (Nigeria) in Generation; all three interlock on the loop.
A single bell marks each metal reveal. Real silences at the cold open and before the end card."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from samatwam_audio import *
DUR = 90.0; M = Mix(DUR, HERE)
SA = 50            # D3
BEAT = 60 / 84     # 84 BPM, unhurried
VO = json.load(open(os.path.join(HERE, 'vo', 'times.json')))

# ---------------- instruments not in the shared kit
def madal(kind, v=1.0):     # Nepali two-headed drum: a deep, wet bass and a dry slap
    d = .5; tt = t_(d)
    if kind == 'dhin': f = 62 + 48 * np.exp(-tt * 11); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .3) + .3 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * env_exp(d, .12)
    else: f = 410; x = (np.sin(2 * np.pi * f * tt) + .7 * np.sin(2 * np.pi * f * 1.62 * tt)) * env_exp(d, .05) + bp(noise(d), 1200, 5000) * env_exp(d, .012) * .6
    x[:24] *= np.linspace(0, 1, 24); return x * v * .5
def talking(note, bend=0.0, v=1.0):   # Yoruba dùndún: pitched, the player squeezes the cords and the pitch glides
    d = .55; tt = t_(d); f0 = hz(note); f = f0 * 2 ** ((bend * (1 - np.exp(-tt * 9))) / 12)
    x = (np.sin(2 * np.pi * np.cumsum(f) / SR) + .35 * np.sin(2 * np.pi * np.cumsum(f * 2.04) / SR)) * env_exp(d, .22)
    x = x + bp(noise(d), 800, 3000) * env_exp(d, .01) * .5; x[:24] *= np.linspace(0, 1, 24); return x * v * .5
def drop(v=1.0):            # a single drop on still water
    d = .5; tt = t_(d); f = 1700 * np.exp(-tt * 18) + 380
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .05); x[:16] *= np.linspace(0, 1, 16); return x * v * .35
def hiss(d, v=1.0):         # molten metal cooling: bright hiss that darkens and thins out
    tt = t_(d); n = noise(d); x = hp(n, 2500) * np.exp(-tt * 1.1) + bp(n, 600, 2500) * np.exp(-tt * .6) * .4
    return x * adsr(d, .05, 1.2) * .12 * v
def rain(d, v=1.0):         # light rain: many soft droplets over a wash
    x = bp(noise(d), 1500, 7000) * .02
    for k in range(int(d * 40)):
        t0 = rng.random() * (d - .1); a = int(t0 * SR); y = drop(.08 + .1 * rng.random()) * .3
        e = min(len(x), a + len(y)); x[a:e] += y[:e - a] * (.5 + .5 * rng.random())
    return lp(x, 6000) * adsr(d, 1.5, 2.0) * v
def shimmer(d, v=1.0):      # heat draining from the metal
    tt = t_(d); return bp(noise(d), 3000, 9000) * np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2 * .05 * v

# ---------------- the drone and the bed
M.m(tanpura(SA, 86.0, .9), 2.2, 1.0, 0)
M.m(pad([SA - 12, SA - 5], 14.0, .35, a=4, r=4, cut=700), 6.5, 1.0, 0)          # the unseen: a low, still bed
M.m(pad([SA - 12, SA + 2], 12.0, .3, a=3, r=3, cut=900), 58.0, 1.0, 0)           # the loop opens up
M.m(pad([SA - 12, SA, SA + 7], 13.0, .42, a=3, r=5, cut=1400), 69.5, 1.0, 0)     # the family
M.f(air(90, .8), 0, 1.0, 0)

# cold open: silence, one drop, the ripple, then Sa
M.f(drop(1.0), 1.55, 1.0, 0); M.m(bell(SA + 24, .5, 5.0), 1.6, 1.0, 0)

# ---------------- the phrase passed around the loop (8 steps)
TAB = ['dha', 'na', 'tin', 'na', 'dha', 'ge', 'na', 'tin']
MAD = ['dhin', 'ta', 'ta', 'dhin', 'ta', 'dhin', 'ta', 'ta']
TAL = [(SA + 12, 0), (SA + 12, 3), (SA + 10, 0), (SA + 12, -2), (SA + 7, 0), (SA + 12, 4), (SA + 10, 0), (SA + 7, 0)]
def phrase(kind, a, b, v=.8, pan=0.0):
    t, i = a, 0
    while t < b - 1e-6:
        acc = 1.0 if i % 4 == 0 else .72
        if kind == 'tabla': M.m(tabla(TAB[i % 8], v * acc), t, 1.0, pan)
        elif kind == 'madal': M.m(madal(MAD[i % 8], v * acc), t, 1.0, pan)
        else: n, bnd = TAL[i % 8]; M.m(talking(n, bnd, v * acc), t, 1.0, pan)
        t += BEAT / 2; i += 1
phrase('tabla', 17.4, 31.0, .7, -.15)
phrase('madal', 31.0, 45.0, .75, .1)
phrase('talking', 45.0, 58.0, .7, .2)
phrase('tabla', 58.0, 70.0, .45, -.35); phrase('madal', 58.0 + BEAT / 4, 70.0, .45, .3); phrase('talking', 62.0, 70.0, .45, 0)
phrase('tabla', 70.0, 76.0, .3, -.35); phrase('madal', 70.0, 75.0, .25, .3)

# ---------------- each chapter: heat drains, the metal is revealed with one bell
for t0 in (21.6, 35.4, 49.2): M.f(shimmer(2.2, 1.0), t0 - 1.6, 1.0, 0); M.m(bell(SA + 19, .55, 4.0), t0, 1.0, 0)
# Reform: the wheel's detent on each notch (observes / logs / structures, and once more)
for t0 in (18.6, 20.0, 21.4, 26.6): M.f(detent(.9), t0 + .45, 1.0, .1)
# Build: the pour cools
M.f(hiss(11.0, 1.0), 32.0, 1.0, 0)
# Generation: light rain while new hands enter; the triangles polish
M.f(rain(9.0, .9), 47.0, 1.0, 0)
M.m(santoor(SA + 24, .35), 52.0, 1.0, -.3); M.m(santoor(SA + 26, .3), 53.0, 1.0, .3)
# the loop: a soft chime each time one of the four lights crosses the centre
for k in range(8): M.m(bell(SA + 31, .12, 1.8), 59.0 + k * 1.47, 1.0, (-1) ** k * .3)
# finale: the family revealed; everything drops away before the end card
M.m(bell(SA + 12, .7, 7.0), 82.0, 1.0, 0); M.m(bell(SA + 24, .35, 6.0), 82.05, 1.0, 0)
M.gate(0.0, 1.5, 0.0, fade=.05)
M.gate(80.6, 82.0, .05, fade=.3)
M.voice(VO); M.write()
