// Samatwam 01 · The Line of a Work — growth phases, camera, printed furniture, counter, subtitles, cues.
// Facts used (brief only): four stages; six parent themes; the example work; the Crossing; certificate SAM-ENG-2027-0042.
import { clamp, lerp, seg, ss, eio, eo, ei, back, monotone } from '/core/lib.js';

const DUR = 60.0;
const W = v => v * 100;
const N = window.NET, TH = N.THEMES, FO = N.FOCUS;
const TEAL = TH[FO].color, NAVY = '#24346E', RED = '#E3002B';
let H = null;

// ------------------------------------------------------------------ narration (film time) and subtitles
export const VO = { l1: 0.9, l2: 6.0, l3: 14.0, l4: 28.0, l5: 35.0, l6: 47.5 };
const VOD = { l1: 3.406, l2: 3.705, l3: 3.73, l4: 2.309, l5: 3.74, l6: 3.982 };
export const CAP = [
  ['l1', 'Every work begins as a stop on a line.', 'हर काम एक लाइन पर एक स्टॉप से शुरू होता है।'],
  ['l2', 'Claimed. Then admitted, once the problem is real.', 'Claimed. फिर Admitted, जब समस्या असली हो।'],
  ['l3', 'Where the work meets the one who needs it, the lines cross.', 'जहाँ काम उससे मिलता है जिसे उसकी ज़रूरत है, वहाँ लाइनें मिलती हैं।'],
  ['l4', 'Here, every claim is tested.', 'यहाँ, हर दावे की जाँच होती है।'],
  ['l5', 'What passes is held. Exactly what was tested.', 'जो खरा उतरता है, वह Held होता है। ठीक उतना, जितना जाँचा गया।'],
  ['l6', 'One line among many. Six themes. One network.', 'कई लाइनों में से एक। छह थीम। एक नेटवर्क।'],
];
export const CUES_T = CAP.map(([id]) => ({ id, t0: VO[id] - .1, t1: VO[id] + Math.max(VOD[id] + .6, 1.9) }));

// ------------------------------------------------------------------ growth
const P = (path, a, b, extra = {}) => ({ path, a, b, t0: 0, t1: 0, ...extra });
const others = [0, 1, 2, 4, 5];
const PHASES = [
  P(TH[FO].id, 'C3', 'A3', { keys: [[0.7, 'C3'], [1.5, 'C3'], [9.0, 'A3']] }),
  P(TH[FO].id, 'A3', 'X3', { keys: [[9.0, 'A3'], [11.2, 'A3'], [16.0, 'X3']] }),
  P('IN', 'INN', 'X3', { keys: [[13.6, 'INN'], [17.3, 'X3']] }),
  P(TH[FO].id, 'X3', 'S3', { keys: [[19.4, 'X3'], [20.0, 'X3'], [24.0, 'S3']] }),
  P(TH[FO].id, 'S3', 'H3', { keys: [[26.6, 'S3'], [34.0, 'H3']] }),
  P('IN', 'X3', 'INS', { t0: 42.4, t1: 45.2 }),
  ...others.map((i, k) => P(TH[i].id, 'C' + i, 'H' + i, { t0: 42.6 + k * 1.3, t1: 46.8 + k * 1.3 })),
];
const iWF0 = 0, iWF1 = 1, iWF2 = 3, iWF3 = 4;

// ------------------------------------------------------------------ camera
const lz = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
const mixCam = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lz(a.z, b.z, u), tilt: lerp(a.tilt, b.tilt, u), head: lerp(a.head, b.head, u), ap: lerp(a.ap || 0, b.ap || 0, u), focus: 1 });
function phaseTip(idx, t) { const o = H.PH[idx]; const s = o.t0 >= t ? o.s0 : o.t1 <= t ? o.s1 : lerp(o.s0, o.s1, clamp(o.f(t))); return H.pointAt(o.path, s); }
function smoothTip(idx, t, span = .4) { let x = 0, y = 0; for (let k = -4; k <= 4; k++) { const q = phaseTip(idx, t + k * span / 4); x += q[0]; y += q[1]; } return [x / 9, y / 9]; }
const st = id => { const n = H.SNODE[id]; return [n.cx, n.cy]; };
const ride = (idx, t, z, tilt, head, ox = 150, oy = 20) => { const p = smoothTip(idx, t); return { x: p[0] + ox, y: p[1] + oy, z, tilt, head, ap: 16 }; };
function camera(t) {
  const c3 = st('C3'), x3 = st('X3'), h3 = st('H3');
  const open = { x: c3[0] + 110, y: c3[1] + 10, z: 2.5, tilt: 27, head: -12, ap: 16 };
  if (t < 12.0) return mixCam(open, ride(iWF0, t, 2.0, 24, -8), eio(seg(t, 1.0, 2.6)));
  const cross = { x: x3[0] + 60, y: x3[1] - 160, z: lerp(1.02, 1.12, seg(t, 16.2, 19.4)), tilt: 12, head: -2, ap: 4 };
  const k = t - 17.3; if (k > -.3 && k < .8) cross.z *= 1 + .06 * Math.exp(-Math.abs(k) * 5);
  if (t < 15.0) return mixCam(ride(iWF0, 11.99, 2.0, 24, -8), ride(iWF1, t, 1.9, 22, -6), eio(seg(t, 12.0, 13.0)));
  if (t < 19.6) return mixCam(ride(iWF1, Math.min(t, 16), 1.9, 22, -6), cross, eio(seg(t, 15.0, 16.3)));
  const low = { x: lerp(380, 560, seg(t, 26.6, 33.4)), y: x3[1] - 10, z: 1.85, tilt: 60, head: -10, ap: 26 };
  if (t < 24.6) return mixCam(cross, ride(iWF2, t, 1.8, 22, -6, 140), eio(seg(t, 19.4, 20.6)));
  const held = { x: h3[0] - 140, y: h3[1] + 30, z: 1.45, tilt: 0, head: 0, ap: 0 };
  if (t < 33.4) return mixCam(ride(iWF2, 24.59, 1.8, 22, -6, 140), low, eio(seg(t, 24.6, 26.2)));
  if (t < 42.0) return mixCam(low, held, eio(seg(t, 33.4, 34.6)));
  const wide = { x: -330, y: 30, z: .44, tilt: 0, head: 0, ap: 0 };
  const endv = { x: 1790, y: 0, z: 1.25, tilt: 0, head: 0, ap: 0 };
  if (t < 54.4) { const u = seg(t, 42.0, 51.6); const c = mixCam(held, wide, 1 - Math.pow(1 - u, 2.2)); c.tilt = 12 * Math.sin(Math.PI * Math.min(1, u * 1.4)); c.ap = 6 * Math.sin(Math.PI * Math.min(1, u * 1.4)); return c; }
  { const u = eio(seg(t, 54.4, 55.5)); const c = mixCam(wide, endv, u); c.tilt = 24 * Math.sin(Math.PI * u); c.ap = 8 * Math.sin(Math.PI * u); return c; }
}

// ------------------------------------------------------------------ helpers for printed text
function rt(c, R, id, s, x, y, size, a = 1, screen = false) {
  if (!R || !R.regW) return;
  const w = c.measureText(s).width, al = c.textAlign, x0 = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x, y0 = y - size * .9, y1 = y + size * .25;
  if (screen) R.regS(id, s, x0, y0, x0 + w, y1, a); else R.regW(id, s, x0, y0, x0 + w, y1, a, 12);
}
const SHEET = [-2050, -1150, 2600, 1150];

// cartouche, bottom-left: the map's name is the film's title (printed, bilingual), and a note that it is a diagram
function furniture(c, t, view, k) {
  const { F, INK, MUTED } = k;
  c.save(); c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  const x = -1960, y = 900;
  c.fillStyle = INK; c.fillRect(x, y - 70, 90, 10);
  c.font = F(800, 54); c.fillText('The Line of a Work', x, y); rt(c, k, 'cart', 'The Line of a Work', x, y, 54);
  c.font = F(600, 32); c.fillText('एक काम की लाइन', x, y + 46); rt(c, k, 'cart-hi', 'एक काम की लाइन', x, y + 46, 32);
  c.font = F(500, 24); c.fillStyle = MUTED; c.fillText('Samatwam · a diagram of how a work moves, not a transit map', x, y + 90); rt(c, k, 'cart-note', 'Samatwam · a diagram of how a work moves, not a transit map', x, y + 90, 24, 1);
  c.restore();
}
function riverLabels(c, t, view, { F }) {
  for (const [yy, rot] of [[-760, -Math.PI / 2], [760, -Math.PI / 2]]) {
    c.save(); c.fillStyle = '#5f88ad'; c.textBaseline = 'middle'; c.translate(440, yy); c.rotate(rot); c.textAlign = 'center';
    c.font = F(700, 24); c.fillText('REVIEW', 0, -12); c.font = F(600, 18); c.fillText('समीक्षा', 0, 13); c.restore();
  }
}

// ------------------------------------------------------------------ the Samatwam Prime mark, printed in ink (world units)
function mark(c, x, y, s, k, INK) { // s = scale (1 => ~300 units tall); k = 0..1 drawing progress
  const part = (a, b) => clamp((k - a) / (b - a));
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = INK; c.fillStyle = INK; c.lineCap = 'butt';
  const arc = (cx, cy, r, a0, a1, u) => { if (u <= 0) return; c.beginPath(); c.arc(cx, cy, r, a0, a0 + (a1 - a0) * u); c.stroke(); };
  // crescent (open vessel), never filled
  c.lineWidth = 9; arc(0, -100, 60, -Math.PI / 2 + .62, 3 * Math.PI / 2 - .62, part(0, .35));
  c.lineWidth = 5; arc(0, -118, 54, .62 - Math.PI / 2 + .45, 3 * Math.PI / 2 - .62 - .45, part(.1, .4));
  // sun with a spiral at its centre
  const su = part(.15, .5); if (su > 0) { c.lineWidth = 3; arc(0, -108, 15, 0, Math.PI * 2, su); for (let i = 0; i < 12; i++) { if (i / 12 > su) break; const a = i / 12 * Math.PI * 2; c.beginPath(); c.moveTo(Math.cos(a) * 20, -108 + Math.sin(a) * 20); c.lineTo(Math.cos(a) * 27, -108 + Math.sin(a) * 27); c.stroke(); }
    c.beginPath(); for (let i = 0; i <= 40 * su; i++) { const a = i / 40 * Math.PI * 3, r = 1 + 10 * i / 40; c.lineTo(Math.cos(a) * r, -108 + Math.sin(a) * r); } c.stroke(); }
  // spine with beads
  c.lineWidth = 4; const sp = part(.35, .55); if (sp > 0) { c.beginPath(); c.moveTo(0, -40); c.lineTo(0, -40 + 80 * sp); c.stroke(); for (let i = 0; i < 4; i++) if (i / 4 < sp) { c.beginPath(); c.arc(0, -30 + i * 20, 5, 0, 7); c.fill(); } }
  // infinity loop, never filled
  const lp = part(.5, .85); if (lp > 0) { c.lineWidth = 8; c.beginPath(); const n = 120; for (let i = 0; i <= n * lp; i++) { const th = i / n * Math.PI * 2, d = 1 + Math.sin(th) ** 2; const px = 95 * Math.cos(th) / d, py = 60 + 95 * Math.sin(th) * Math.cos(th) / d; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); }
  // two triangles: up (what enters), down (what is given back), solid
  const tr = part(.8, 1); if (tr > 0) { c.globalAlpha *= tr; c.beginPath(); c.moveTo(-55, 108); c.lineTo(-37, 140); c.lineTo(-73, 140); c.closePath(); c.fill(); c.beginPath(); c.moveTo(55, 140); c.lineTo(37, 108); c.lineTo(73, 108); c.closePath(); c.fill(); }
  c.restore();
}

// ------------------------------------------------------------------ printed annotations
function annotations(c, t, view, K) {
  const { F, INK, MUTED } = K;
  // theme names, printed at the west end of each line once its pen has started
  TH.forEach((th, i) => {
    const ph = PHASES.find(p => p.path === th.id); const t0 = ph.keys ? ph.keys[0][0] : ph.t0;
    const a = seg(t, t0 + .1, t0 + .6); if (a <= 0) return;
    const n = H.SNODE['C' + i]; c.save(); c.globalAlpha *= a * (veil(t) > 0 && i !== FO ? 1 - .7 * veil(t) : 1);
    
    c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillStyle = INK; c.font = F(i === FO ? 700 : 600, i === FO ? 52 : 46);
    c.fillText(th.name, n.cx - 40, n.cy + 1); rt(c, K, 'theme' + i, th.name, n.cx - 40, n.cy + 16, i === FO ? 52 : 46, a);
    c.restore();
  });
  // the film's title, printed above the first stop as a callout
  { const n = H.SNODE.C3, a = eo(seg(t, .5, 1.0)); if (a > 0) {
    const x = n.cx - 40, y = n.cy - 120; c.save(); c.globalAlpha *= a * (1 - seg(t, 42, 44)); c.fillStyle = TEAL; c.fillRect(x, y - 52, 10 * 1, 74 * eo(seg(t, .5, .9)));
    c.save(); c.beginPath(); c.rect(x + 14, y - 60, 900 * eo(seg(t, .6, 1.1)), 110); c.clip(); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillStyle = INK;
    c.font = F(800, 34); c.fillText('01 · The Line of a Work', x + 26, y - 18); rt(c, K, 'callout', '01 · The Line of a Work', x + 26, y - 18, 34, a);
    c.font = F(600, 24); c.fillStyle = MUTED; c.fillText('एक काम की लाइन', x + 26, y + 14); c.restore(); c.restore(); } }
  // you are here (under the veil)
  { const a = seg(t, 52.5, 52.8) * (1 - seg(t, 54.4, 54.8)); if (a > 0) { const n = H.SNODE.H3, pulse = ((t - 52.5) % 1.2) / 1.2; c.save();
    c.globalAlpha = a * (1 - pulse) * .6; c.strokeStyle = RED; c.lineWidth = 5; c.beginPath(); c.arc(n.cx, n.cy, 22 + 46 * pulse, 0, 7); c.stroke();
    c.globalAlpha = a; c.fillStyle = RED; c.beginPath(); c.arc(n.cx, n.cy, 17 * back(seg(t, 52.5, 52.8), 3), 0, 7); c.fill(); c.lineWidth = 4; c.strokeStyle = '#fff'; c.stroke();
    c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.font = F(800, 64); c.fillStyle = 'rgba(244,240,231,.94)'; c.beginPath(); c.roundRect(n.cx + 40, n.cy - 60, 440, 140, 10); c.fill();
    c.fillStyle = INK; c.fillText('You are here', n.cx + 60, n.cy + 8); rt(c, K, 'here', 'You are here', n.cx + 60, n.cy + 8, 64, a);
    c.font = F(600, 44); c.fillStyle = MUTED; c.fillText('आप यहाँ हैं', n.cx + 60, n.cy + 64); c.restore(); } }
  // end card, printed in the sheet's east margin: the mark, the name, the line, the org line
  { const k = t - 55.0; if (k > 0) { const x = 1200, y = 0;
    c.save(); c.strokeStyle = 'rgba(27,28,30,.55)'; c.lineWidth = 3; c.strokeRect(x - 60, y - 330, 1300 * eo(clamp(k / .6)), 660); c.restore();
    mark(c, x + 120, y + 10, 1.25, clamp((k - .2) / 1.2), INK);
    c.save(); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillStyle = INK;
    const tx = x + 320, cl = (yy, h, u) => { c.save(); c.beginPath(); c.rect(tx - 10, yy - h, 1000 * eo(u), h * 1.5); c.clip(); return () => c.restore(); };
    let r = cl(y - 50, 120, seg(k, .6, 1.2)); c.font = F(800, 120); c.fillText('SAMATWAM', tx, y - 50); r(); rt(c, K, 'end-name', 'SAMATWAM', tx, y - 50, 120, 1);
    r = cl(y + 30, 52, seg(k, .9, 1.5)); c.font = F(600, 50); c.fillText('Build it. Prove it. Give it back.', tx, y + 30); r(); rt(c, K, 'end-line', 'Build it. Prove it. Give it back.', tx, y + 30, 50, 1);
    c.fillStyle = TEAL; c.fillRect(tx, y + 70, 140 * eo(seg(k, 1.1, 1.5)), 8);
    r = cl(y + 136, 40, seg(k, 1.0, 1.5)); c.font = F(500, 40); c.fillStyle = MUTED; c.fillText('Samatwam Org · Toward Viksit Bharat 2047', tx, y + 136); r(); rt(c, K, 'end-org', 'Samatwam Org · Toward Viksit Bharat 2047', tx, y + 136, 40, 1);
    c.restore(); } }
}

// ------------------------------------------------------------------ the interchange that falls (The Crossing)
const drops = { X3: true };
function dropRing(c, n, k2, { capsule, INK }) {
  if (k2 < 0) return;
  if (k2 < .9) { const v = k2 / .9; c.save(); c.globalAlpha *= (1 - v) * .75; c.lineWidth = 7; c.strokeStyle = INK; c.beginPath(); c.arc(n.cx, n.cy, 30 + 230 * eo(v), 0, 7); c.stroke();
    c.lineWidth = 6; c.strokeStyle = NAVY; c.beginPath(); c.arc(n.cx, n.cy, 26 + 170 * eo(clamp(v * 1.15)), 0, 7); c.stroke();
    c.strokeStyle = TEAL; c.beginPath(); c.arc(n.cx, n.cy, 22 + 120 * eo(clamp(v * 1.3)), 0, 7); c.stroke(); c.restore(); }
  capsule(c, n, 1 + .18 * Math.exp(-k2 * 14) * Math.cos(k2 * 40), 7);
  // printed name stamp under the capsule
  const a = seg(k2, .25, .6); if (a > 0) { c.save(); c.globalAlpha *= a; c.fillStyle = INK; c.font = `800 30px Inter, NotoSC`; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.restore(); }
}

// ------------------------------------------------------------------ trains on finished track
function trains(c, t, { PATHS, train }) {
  const run = (key, t0, col) => { const p = PATHS[key]; if (!p) return; const a = seg(t, t0, t0 + .5); if (a <= 0) return; const s = ((t - t0) * 190) % p.total; train(c, p, s, col, a, 1.1); };
  run(TH[FO].id, 44.5, TEAL);
  if (t > 52.5) { TH.forEach((th, i) => { if (i !== FO) run(th.id, 52.5 + i * .2, th.color); }); run('IN', 52.8, NAVY); }
}

// ------------------------------------------------------------------ veil and the lit segment
function veil(t) { return ss(seg(t, 52.0, 52.9)); }
const LIT = ['C3', 'A3', 'X3', 'S3', 'H3'];
function stationDim(n, t, v) { if (v <= 0) return 1; return LIT.includes(n.id) ? 1 : 1 - .8 * v; }
function highlight(c, t, { PATHS, pointAt, subPath }, top = false) {
  const g = veil(t); if (g <= 0) return; const p = PATHS[TH[FO].id];
  c.save(); c.lineCap = 'round';
  if (!top) { c.strokeStyle = `rgba(0,137,123,${.22 * g})`; c.lineWidth = 60; c.beginPath(); subPath(c, p, 0, p.total); c.stroke(); }
  else { c.strokeStyle = TEAL; c.lineWidth = 15; c.beginPath(); subPath(c, p, 0, p.total); c.stroke(); }
  c.restore();
}

// ------------------------------------------------------------------ counter (top-left, screen): series title + stage + certificate
function drum(c, x, y, w, h, pos, F, blur = 0) {
  c.save(); c.beginPath(); c.roundRect(x, y, w, h, 5); c.clip();
  const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#9c968a'); g.addColorStop(.18, '#efe9dc'); g.addColorStop(.5, '#faf6ee'); g.addColorStop(.82, '#efe9dc'); g.addColorStop(1, '#9c968a');
  c.fillStyle = g; c.fillRect(x, y, w, h);
  const d = Math.floor(pos) % 10, f = pos - Math.floor(pos);
  c.font = F(800, h * .7); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#1b1c1e';
  const n = blur > 0 ? 7 : 1;
  for (let k = 0; k < n; k++) { const off = n > 1 ? (k / (n - 1) - .5) * blur * h * .9 : 0; c.globalAlpha = n > 1 ? .26 : 1;
    for (const dd of [-1, 0, 1, 2]) c.fillText(String((d + dd + 10) % 10), x + w / 2, y + h / 2 + (dd - f) * h + 2 + off); }
  c.globalAlpha = 1;
  const sh = c.createLinearGradient(0, y, 0, y + h); sh.addColorStop(0, 'rgba(0,0,0,.35)'); sh.addColorStop(.25, 'rgba(0,0,0,0)'); sh.addColorStop(.75, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.35)'); c.fillStyle = sh; c.fillRect(x, y, w, h);
  c.restore();
}
const STAGES = [[0.8, 1, 'Claimed'], [9.0, 2, 'Admitted'], [24.0, 3, 'Submitted'], [34.0, 4, 'Held']];
const stageAt = t => { let v = 0, nm = ''; for (const [t0, s, n] of STAGES) if (t >= t0 - .35) { v = lerp(v, s, eio(seg(t, t0 - .35, t0))); nm = t >= t0 ? n : nm; } return [v, nm]; };
function counter(c, t, F, R) {
  const vis = seg(t, .2, .6); if (vis <= 0) return;
  const certOn = seg(t, 34.6, 35.0) * (1 - seg(t, 54.2, 54.6)), stOn = 1 - seg(t, 54.2, 54.6);
  const x = 46, y = 40, w = 640, head = 48, rh = 86, rows = stOn > 0 ? 1 + (certOn > 0 ? certOn : 0) : 0, h = head + 14 + rows * rh * Math.min(1, stOn + .0001);
  c.save(); c.globalAlpha = vis;
  c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 18; c.shadowOffsetY = 6;
  c.beginPath(); c.roundRect(x, y, w, h, 14); const pg = c.createLinearGradient(0, y, 0, y + h); pg.addColorStop(0, '#2a2d31'); pg.addColorStop(1, '#17191c'); c.fillStyle = pg; c.fill();
  c.shadowColor = 'transparent'; c.lineWidth = 1.5; c.strokeStyle = 'rgba(255,255,255,.12)'; c.stroke();
  for (const [sx, sy] of [[x + 12, y + 12], [x + w - 12, y + 12], [x + 12, y + h - 12], [x + w - 12, y + h - 12]]) { c.beginPath(); c.arc(sx, sy, 3.2, 0, 7); c.fillStyle = '#8b8577'; c.fill(); }
  c.beginPath(); c.rect(x, y, w, h); c.clip();
  // series title: film number and title, the whole film
  c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillStyle = '#efe8d8'; c.font = F(700, 22); c.fillText('SAMATWAM  ·  01  ·  THE LINE OF A WORK', x + 26, y + 38); rt(c, R, 'series', 'SAMATWAM  ·  01  ·  THE LINE OF A WORK', x + 26, y + 38, 22, vis, true);
  c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(x + 26, y + head + 4, w - 52, 1);
  if (stOn > 0) {
    const ry = y + head + 14, [v, nm] = stageAt(t); c.globalAlpha = vis * stOn;
    c.fillStyle = '#efe8d8'; c.font = F(700, 24); c.fillText('STAGE', x + 26, ry + 34); rt(c, R, 'stage-lbl', 'STAGE', x + 26, ry + 34, 24, vis, true);
    if (nm) { c.font = F(500, 18); c.fillStyle = '#aaa395'; c.fillText(nm, x + 26, ry + 60); rt(c, R, 'stage-' + nm, nm, x + 26, ry + 60, 18, vis, true); }
    drum(c, x + w - 26 - 84, ry + 6, 38, 60, 0, F); drum(c, x + w - 26 - 42, ry + 6, 38, 60, v, F);
    if (v % 1 === 0 && v > 0 && R && R.regS) R.regS('stage-v' + v, '0' + v, x + w - 110, ry + 6, x + w - 26, ry + 66, vis);
    if (certOn > 0) {
      const cy = ry + rh; c.globalAlpha = vis * certOn;
      c.fillStyle = '#efe8d8'; c.font = F(700, 24); c.fillText('CERTIFICATE', x + 26, cy + 34); rt(c, R, 'cert-lbl', 'CERTIFICATE', x + 26, cy + 34, 24, vis * certOn, true);
      c.font = F(500, 18); c.fillStyle = '#aaa395'; c.fillText('issued when Held', x + 26, cy + 60);
      const land = 35.9, rem = Math.max(0, land - t), digits = [0, 0, 4, 2];
      c.font = F(800, 30); c.fillStyle = '#efe8d8'; c.textAlign = 'right'; c.fillText('SAM-ENG-2027-', x + w - 26 - 168 - 6, cy + 48);
      digits.forEach((dg, i) => { const rate = [2, 5, 9, 14][i]; const pos = ((dg - rate * rem * 3) % 10 + 10) % 10; drum(c, x + w - 26 - 168 + i * 42, cy + 6, 38, 60, rem > 0 ? pos : dg, F, rem > 0 ? clamp(rate * rem / 4) : 0); });
      if (t >= land && R && R.regS) R.regS('cert', 'SAM-ENG-2027-0042', x + 230, cy + 6, x + w - 26, cy + 66, vis * certOn);
    }
  }
  c.restore();
}
// a station plate stands on the sheet near the lens as the tip passes ADMITTED
let plateImg = null;
function makePlate(F) {
  const W0 = 900, H0 = 820, c = document.createElement('canvas'); c.width = W0; c.height = H0; const g = c.getContext('2d');
  const pg = g.createLinearGradient(420, 0, 480, 0); pg.addColorStop(0, '#5d5f62'); pg.addColorStop(.5, '#9a9c9f'); pg.addColorStop(1, '#4a4c4f'); g.fillStyle = pg; g.fillRect(426, 300, 48, 520);
  g.fillStyle = '#2b2d31'; g.beginPath(); g.roundRect(0, 0, W0, 320, 24); g.fill();
  const fg = g.createLinearGradient(0, 16, 0, 304); fg.addColorStop(0, '#fbf9f3'); fg.addColorStop(1, '#e9e4d8'); g.fillStyle = fg; g.beginPath(); g.roundRect(16, 16, W0 - 32, 288, 14); g.fill();
  g.fillStyle = TEAL; g.fillRect(16, 236, W0 - 32, 16);
  g.beginPath(); g.arc(86, 120, 34, 0, 7); g.fillStyle = TEAL; g.fill(); g.fillStyle = '#fff'; g.font = F(800, 34); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('02', 86, 122);
  g.fillStyle = '#1b1c1e'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.font = F(800, 104); g.fillText('ADMITTED', 150, 160);
  g.font = F(600, 40); g.fillStyle = '#3d3a34'; g.fillText('Water, Flow & Hydraulics', 156, 216);
  return c;
}
function lensPlate(c, t, F, b, toScreen) {
  if (t < 7.4 || t > 12.2) return;
  if (!plateImg) plateImg = makePlate(F);
  const a3 = st('A3'), X = a3[0] + 330, Y = a3[1] + 170, h = 560;
  const base = toScreen(b, X, Y, 0), top = toScreen(b, X, Y, h); if (!base || !top) return;
  const ph = base[1] - top[1]; if (ph < 4) return;
  const pw = ph * 900 / 820, cx = (base[0] + top[0]) / 2, blur = Math.min(5, 6 * Math.abs(base[2] - b.D) / base[2]);
  c.save(); c.globalAlpha = seg(t, 7.4, 7.8) * (1 - seg(t, 11.8, 12.2));
  c.filter = `blur(${(blur + 6).toFixed(1)}px)`; c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(base[0] + pw * .05, base[1], pw * .12, ph * .02 + 3, 0, 0, 7); c.fill();
  c.filter = `blur(${blur.toFixed(1)}px)`; c.drawImage(plateImg, cx - pw / 2, top[1], pw, ph); c.restore();
}
function subtitles(c, t, F) {
  for (const [id, en, hi] of CAP) {
    const a = VO[id] - .1, b = VO[id] + Math.max(VOD[id] + .6, 1.9); if (t < a || t > b) continue;
    const k = Math.min(seg(t, a, a + .2), 1 - seg(t, b - .2, b));
    c.save(); c.globalAlpha = k; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    c.font = F(600, 34); const m1 = c.measureText(en).width; c.font = F(500, 27); const m2 = c.measureText(hi).width;
    const w = Math.max(m1, m2) + 60; c.fillStyle = 'rgba(244,240,231,.94)'; c.beginPath(); c.roundRect(960 - w / 2, 930, w, 112, 10); c.fill();
    c.fillStyle = '#1b1c1e'; c.font = F(600, 34); c.fillText(en, 960, 976); c.fillStyle = '#4a4740'; c.font = F(500, 27); c.fillText(hi, 960, 1020);
    c.restore();
  }
}
function overlay(c, t, O) { const { b, toScreen, F } = O; lensPlate(c, t, F, b, toScreen); counter(c, t, F, O); subtitles(c, t, F); }

// ------------------------------------------------------------------ cues for the score
const CUES = [
  { t: .8, type: 'chime' }, { t: 9.0, type: 'stage' }, { t: 17.3, type: 'chime' }, { t: 24.0, type: 'stage' },
  { t: 26.6, type: 'dive' }, { t: 33.6, type: 'surface' }, { t: 34.0, type: 'chime' }, { t: 35.9, type: 'land' },
  { t: 42.4, type: 'pull' }, { t: 52.0, type: 'veil' }, { t: 52.5, type: 'here' }, { t: 54.4, type: 'glide' }, { t: 55.0, type: 'end' },
];

export const DATA = {
  DUR, SHEET, PHASES, camera, furniture, riverLabels, annotations, overlay, trains, highlight, veil, stationDim,
  drops, dropRing, noRoundel: ['BS', 'RB', 'AP', 'WF', 'TE', 'LS', 'IN'], roundelPos: {}, roundelAlpha: () => 0, roundelScale: () => 1,
  forceLabel: (n, t) => 0, hubLabelScale: z => clamp(Math.pow(.85 / z, .6), 1, 1.75),
  labelOnly: t => t < 42 ? ['C3', 'A3', 'X3', 'S3', 'H3', 'INN'] : ['C3', 'A3', 'X3', 'S3', 'H3', 'INN', 'INS'],
  tunnelOnly: t => false, cues: CUES, LABEL_PREF: { C3: 'n', A3: 'n', X3: 'se', S3: 'n', H3: 'n', INN: 'e', INS: 'e' },
  nameAt: (n, t) => [n.zh, n.en],
  init(h) { H = h; },
};
