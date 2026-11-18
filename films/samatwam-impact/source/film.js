// Nine Doorsteps · Samatwam in Bisahda, 29 October 2026. Urban Sketch · Pen & Wash (lemo-opuscar), shot list per huashu-art-motion.
// Ink only, traced from the nine geotagged field photos; the one coloured thing is the saffron cap. Camera moves are Motion springs.
// Text is Geist only (studio rule), written on in ink with the pen.
import { INK, PAPER, clamp, lerp, ss, rng, n2, hex, penStroke, rasterPen, wash, arrivalField, compositor } from './engine.js';

window.DUR = 44;
const W = 5400, H = 3720, SAFF = hex('#E8963F');
// ---------- Motion springs sampled into eases (deterministic per frame)
function springEase(stiffness, damping) { const g = MotionLib.spring({ keyframes: [0, 1], stiffness, damping, restDelta: .0005, restSpeed: .001 });
  let T = 0; while (!g.next(T).done && T < 6000) T += 4; const N = 400, tab = [...Array(N + 1)].map((_, i) => g.next(T * i / N).value);
  return p => { if (p <= 0) return 0; if (p >= 1) return 1; const x = p * N, i = Math.floor(x); return tab[i] + (tab[i + 1] - tab[i]) * (x - i); }; }
const GLIDE = springEase(90, 19), SOFT = springEase(50, 15), SNAP = springEase(260, 24);

// ---------- the nine doorsteps, in the order they happened (photo, stamp time, cap position in the photo 0..1)
const STOPS = [['p5', '12:38', .73, .17], ['p2', '12:43', .69, .26], ['p6', '12:46', .40, .15], ['p7', '12:50', .33, .09], ['p1', '12:59', .37, .14], ['p3', '13:10', .36, .47], ['p4', '13:24', .76, .38], ['p8', '13:40', .29, .23], ['p9', '13:43', .68, .27]];
const START = [.3, 4.6, 8.4, 12.2, 16.2, 20.0, 24.0, 27.8, 31.4];
const PW = 1500, CROP = .66;                                    // the geotag panel sits below 66 % of each photo; the drawing stops above it
const CELLS = [[1000, 820], [2700, 820], [4400, 820], [4400, 1800], [2700, 1800], [1000, 1800], [1000, 2780], [2700, 2780], [4400, 2780]];   // a snake across the page
const load = s => new Promise((r, e) => { const i = new Image(); i.onload = () => r(i); i.onerror = () => e(new Error('missing ' + s)); i.src = s; });
const cv = (w, h, fill) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (fill) { x.fillStyle = fill; x.fillRect(0, 0, w, h); } return [c, x]; };

// ---------- marching squares: iso-lines of a scalar grid, joined into polylines
function isolines(F, gw, gh, L) {
  const segs = [], P = (i, j, a, b) => { const fa = F[j * gw + i]; return a; };
  const lerpE = (x0, y0, v0, x1, y1, v1) => { const t = (L - v0) / ((v1 - v0) || 1e-6); return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]; };
  for (let j = 0; j < gh - 1; j++) for (let i = 0; i < gw - 1; i++) {
    const a = F[j * gw + i], b = F[j * gw + i + 1], c = F[(j + 1) * gw + i + 1], d = F[(j + 1) * gw + i];
    const k = (a > L) | (b > L) << 1 | (c > L) << 2 | (d > L) << 3; if (k === 0 || k === 15) continue;
    const T = lerpE(i, j, a, i + 1, j, b), R = lerpE(i + 1, j, b, i + 1, j + 1, c), B = lerpE(i, j + 1, d, i + 1, j + 1, c), Lf = lerpE(i, j, a, i, j + 1, d);
    const tab = { 1: [[Lf, T]], 2: [[T, R]], 3: [[Lf, R]], 4: [[R, B]], 5: [[Lf, T], [R, B]], 6: [[T, B]], 7: [[Lf, B]], 8: [[B, Lf]], 9: [[B, T]], 10: [[T, R], [B, Lf]], 11: [[B, R]], 12: [[R, Lf]], 13: [[R, T]], 14: [[T, Lf]] }[k];
    for (const s of tab) segs.push(s);
  }
  const key = p => `${Math.round(p[0] * 64)},${Math.round(p[1] * 64)}`, map = new Map(), used = new Uint8Array(segs.length);
  segs.forEach((s, n) => { for (const e of [0, 1]) { const k = key(s[e]); (map.get(k) || map.set(k, []).get(k)).push(n); } });
  const lines = [];
  for (let n = 0; n < segs.length; n++) { if (used[n]) continue; used[n] = 1; const line = [segs[n][0], segs[n][1]];
    for (const dir of [1, 0]) { let end = dir ? line[line.length - 1] : line[0];
      for (;;) { const c = (map.get(key(end)) || []).find(m => !used[m]); if (c === undefined) break; used[c] = 1; const s = segs[c], nx = key(s[0]) === key(end) ? s[1] : s[0]; dir ? line.push(nx) : line.unshift(nx); end = nx; } }
    lines.push(line); }
  return lines;
}
const blur = (F, gw, gh, r = 1) => { const O = new Float32Array(F.length); for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { let s = 0, n = 0; for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { const ii = i + x, jj = j + y; if (ii >= 0 && jj >= 0 && ii < gw && jj < gh) { s += F[jj * gw + ii]; n++; } } O[j * gw + i] = s / n; } return O; };

// ---------- edges: Sobel, non-maximum suppression, hysteresis, then chained into polylines (one pen stroke each)
function edgeLines(Lm, gw, gh) {
  const M = new Float32Array(gw * gh), A = new Uint8Array(gw * gh), at = (i, j) => Lm[Math.min(gh - 1, Math.max(0, j)) * gw + Math.min(gw - 1, Math.max(0, i))];
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const gx = at(i + 1, j - 1) + 2 * at(i + 1, j) + at(i + 1, j + 1) - at(i - 1, j - 1) - 2 * at(i - 1, j) - at(i - 1, j + 1), gy = at(i - 1, j + 1) + 2 * at(i, j + 1) + at(i + 1, j + 1) - at(i - 1, j - 1) - 2 * at(i, j - 1) - at(i + 1, j - 1);
    M[j * gw + i] = Math.hypot(gx, gy); const a = (Math.atan2(gy, gx) + Math.PI) % Math.PI; A[j * gw + i] = a < Math.PI / 8 || a >= 7 * Math.PI / 8 ? 0 : a < 3 * Math.PI / 8 ? 1 : a < 5 * Math.PI / 8 ? 2 : 3; }
  const N = new Float32Array(gw * gh), OFF = [[1, 0], [1, 1], [0, 1], [-1, 1]];
  for (let j = 1; j < gh - 1; j++) for (let i = 1; i < gw - 1; i++) { const k = j * gw + i, [dx, dy] = OFF[A[k]], m = M[k]; if (m >= M[(j + dy) * gw + i + dx] && m >= M[(j - dy) * gw + i - dx]) N[k] = m; }
  const sorted = Array.from(N).filter(v => v > 0).sort((a, b) => a - b), hi = sorted[Math.floor(sorted.length * .8)] || 1, lo = hi * .45;
  const used = new Uint8Array(gw * gh), lines = [];
  for (let j = 1; j < gh - 1; j++) for (let i = 1; i < gw - 1; i++) { const k0 = j * gw + i; if (used[k0] || N[k0] < hi) continue;
    const line = [[i, j]]; used[k0] = 1;
    for (const dir of [1, 0]) { let [ci, cj] = dir ? line[line.length - 1] : line[0], pd = null;
      for (;;) { let best = null, bs = -1;
        for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { if (!di && !dj) continue; const ni = ci + di, nj = cj + dj; if (ni < 1 || nj < 1 || ni >= gw - 1 || nj >= gh - 1) continue; const k = nj * gw + ni; if (used[k] || N[k] < lo) continue;
          const sc = N[k] + (pd ? (di * pd[0] + dj * pd[1]) * hi * .5 : 0); if (sc > bs) { bs = sc; best = [ni, nj, di, dj]; } }
        if (!best) break; used[best[1] * gw + best[0]] = 1; dir ? line.push([best[0], best[1]]) : line.unshift([best[0], best[1]]); ci = best[0]; cj = best[1]; pd = [best[2], best[3]]; } }
    if (line.length >= 7) lines.push(line); }
  return lines;
}

// ---------- build the page
async function build() {
  const photos = {}; for (const [k] of STOPS) photos[k] = await load(`../photos/${k}.jpg`);
  const mark = await load('../mark.svg');
  const [colorC, cx] = cv(W, H, '#fff');
  const [inkAC, ia] = cv(W, H), [timeAC, ta] = cv(W, H, '#fff'), [inkBC, ib] = cv(W, H), [timeBC, tb] = cv(W, H, '#fff');
  ta.globalCompositeOperation = 'darken'; tb.globalCompositeOperation = 'darken';
  const WIN_A = [0, 21], WIN_B = [21, 24];
  const pen = (st, t0, du) => { if (st.P.length < 2) return; if (t0 + du <= WIN_A[0] + WIN_A[1]) rasterPen(ia, ta, st, t0, du, WIN_A); else rasterPen(ib, tb, st, Math.max(t0, WIN_B[0]), du, WIN_B); };
  // text written on with the pen: ink = the glyphs, time = a left-to-right ramp
  const write = (s, x, y, size, t0, du, weight = 500, track = 0) => {
    for (const [ink, time, win] of t0 + du <= 21 ? [[ia, ta, WIN_A]] : [[ib, tb, WIN_B]]) {
      ink.save(); ink.font = `${weight} ${size}px Geist`; if ('letterSpacing' in ink) ink.letterSpacing = track + 'px'; ink.fillStyle = '#000'; ink.fillText(s, x, y); const w = ink.measureText(s).width; ink.restore();
      time.save(); time.font = `${weight} ${size}px Geist`; if ('letterSpacing' in time) time.letterSpacing = track + 'px';
      const g = time.createLinearGradient(x, 0, x + w, 0); const v = tt => { const q = Math.round(1 + clamp((tt - win[0]) / win[1]) * 253); return `rgb(${q},${q},${q})`; };
      g.addColorStop(0, v(t0)); g.addColorStop(1, v(t0 + du)); time.fillStyle = g; time.lineWidth = 3; time.strokeStyle = g; time.fillText(s, x, y); time.strokeText(s, x, y); time.restore();
    }
  };
  const sources = [];
  STOPS.forEach(([k, stamp, capx, capy], n) => {
    const img = photos[k], [ccx, ccy] = CELLS[n], PH = PW * (img.height * CROP) / img.width, ox = ccx - PW / 2, oy = ccy - PH / 2, T0 = START[n];
    const gw = 560, gh = Math.round(gw * PH / PW), s = PW / gw;
    const [g, gx] = cv(gw, gh); gx.drawImage(img, 0, 0, img.width, img.height * CROP, 0, 0, gw, gh); const D = gx.getImageData(0, 0, gw, gh).data;
    let Lm = new Float32Array(gw * gh), Rm = new Float32Array(gw * gh);
    for (let i = 0; i < gw * gh; i++) { const r = D[i * 4], gg = D[i * 4 + 1], b = D[i * 4 + 2]; Lm[i] = (r * .3 + gg * .59 + b * .11) / 255;
      const x = (i % gw) / gw, y = Math.floor(i / gw) / gh, near = Math.hypot((x - capx) * 2, y - capy) < .15 && y < capy + .07;
      const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), sat = mx ? (mx - mn) / mx : 0; let hue = 0;
      if (mx > mn) { hue = mx === r ? ((gg - b) / (mx - mn)) * 60 : mx === gg ? (2 + (b - r) / (mx - mn)) * 60 : (4 + (r - gg) / (mx - mn)) * 60; if (hue < 0) hue += 360; }
      Rm[i] = near && mx === r && (hue < 13 || hue > 335) && sat > .42 && mx > 70 ? 1 : 0; }
    Lm = blur(blur(Lm, gw, gh, 1), gw, gh, 1); Rm = blur(Rm, gw, gh, 1);
    // ink: iso-lines at four tones, darker tones in a slightly heavier line, drawn outward from the cap
    const R = rng(100 + n), strokes = [];
    const add = (line, w) => { const pts = line.filter((_, q) => q % 2 === 0 || q === line.length - 1).map(p => [ox + p[0] * s, oy + p[1] * s]);
      const m = pts[pts.length >> 1], d = Math.hypot(m[0] - (ox + capx * PW), (m[1] - (oy + capy * PH)) * 1.2); strokes.push({ pts, w, d: d + R() * 160, seed: n * 4000 + strokes.length }); };
    for (const line of edgeLines(Lm, gw, gh)) add(line, line.length > 40 ? 2.1 : 1.6);
    for (const line of isolines(Lm, gw, gh, .17)) if (line.length > 50) add(line, 2.6);   // only the darkest masses get a heavier contour
    strokes.sort((a, b) => a.d - b.d);
    const N = strokes.length, DRAW = 2.7;
    strokes.forEach((o, r) => { const st = penStroke(o.pts, { w: o.w, wob: .7, over: 4, gap: .3, seed: o.seed, smooth: false }); pen(st, T0 + DRAW * Math.pow(r / N, .85), clamp(st.L / 2600, .03, .28)); });
    // the stamp time and a dated corner note, written once the drawing lands
    write(stamp, ox, oy + PH + 84, 64, T0 + 2.5, .55, 600);
    // the one coloured thing: the cap, washed in saffron, slightly off the line
    for (const line of isolines(Rm, gw, gh, .35)) { if (line.length < 10) continue; const poly = line.map(p => [ox + p[0] * s, oy + p[1] * s]);
      wash(cx, poly, SAFF, { a: .78, j: 3, layers: 3, edge: .35, dx: 4, dy: 2, seed: 50 + n });
      const c = poly.reduce((a, p) => [a[0] + p[0] / poly.length, a[1] + p[1] / poly.length], [0, 0]); sources.push({ x: c[0], y: c[1], t: T0 + 2.2, v: 260, R: 260 }); }
  });
  // the route between doorsteps, drawn as the camera travels it
  for (let n = 0; n < 8; n++) { const a = CELLS[n], b = CELLS[n + 1], y0 = a[1] + 540, y1 = b[1] + 540;
    const pts = a[1] === b[1] ? [[a[0] + 120, y0], [lerp(a[0], b[0], .5), y0 + 26], [b[0] - 120, y1]] : [[a[0] + 760, a[1] + 300], [a[0] + 840, lerp(a[1], b[1], .5)], [b[0] + 760, b[1] - 300]];
    const st = penStroke(pts, { w: 2.2, wob: 1.4, over: 8, seed: 900 + n }); pen(st, START[n + 1] - .9, .9);
    for (let k = 0; k < 3; k++) { const u = .25 + k * .25, p = st.P[Math.floor(u * (st.P.length - 1))]; pen(penStroke([[p[0] - 6, p[1] - 10], [p[0] + 7, p[1] + 9]], { w: 2, wob: .4, over: 2, seed: 950 + n * 3 + k }), START[n + 1] - .9 + u * .9, .05); } }
  // margins: place, date, and the colophon
  write('Bisahda, Uttar Pradesh', 250, 200, 92, .6, 1.2, 600, -2); write('29 October 2026  ·  28.59° N, 77.57° E', 250, 286, 46, 1.2, 1.2, 400, 1);
  write('Nine doorsteps, one afternoon.', 2950, 3470, 78, 36.2, 1.6, 600, -1); write('Samatwam · listening before building', 2950, 3554, 44, 37.4, 1.4, 400, 1);
  // the stamp: the Samatwam mark pressed into the corner in saffron
  const mh = 340, mw = mh * 1721 / 2400, mx = 4880 - mw / 2, my = 3480 - mh / 2;
  { const [mc, mxc] = cv(Math.ceil(mw), Math.ceil(mh)); mxc.drawImage(mark, 0, 0, mw, mh); mxc.globalCompositeOperation = 'source-in'; mxc.fillStyle = '#E8963F'; mxc.fillRect(0, 0, mw, mh);
    cx.save(); cx.globalCompositeOperation = 'multiply'; cx.globalAlpha = .92; cx.drawImage(mc, mx, my); cx.restore(); sources.push({ x: 4880, y: 3480, t: 40.4, v: 900, R: 300, sy: 1 }); }
  const pack = (r, g) => { const out = new Uint8Array(W * H * 4), A = r.getImageData(0, 0, W, H).data, B = g.getImageData(0, 0, W, H).data; for (let i = 0, n = W * H; i < n; i++) { out[i * 4] = A[i * 4 + 3]; out[i * 4 + 1] = B[i * 4 + 3]; out[i * 4 + 3] = 255; } return out; };
  const packT = (r, g) => { const out = new Uint8Array(W * H * 4), A = r.getImageData(0, 0, W, H).data, B = g.getImageData(0, 0, W, H).data; for (let i = 0, n = W * H; i < n; i++) { out[i * 4] = A[i * 4]; out[i * 4 + 1] = B[i * 4]; out[i * 4 + 3] = 255; } return out; };
  const GW = 540, GH = 350, arr = arrivalField(W, H, GW, GH, sources, { amp: 60 });
  return { W, H, color: colorC, ink: pack(ia, ib), time: packT(ta, tb), winA: WIN_A, winB: WIN_B, arr, gw: GW, gh: GH, caps: sources };
}

// ---------- camera: designed holds on each doorstep, travel between them on a Motion spring, a pull-back to the page, a push to the stamp
function cameraKeys(world) {
  const cap0 = world.caps[0], Z = 1.12, K = [[0, cap0.x - 40, cap0.y + 60, 2.7, SOFT], [3.0, CELLS[0][0], CELLS[0][1] + 40, Z, GLIDE]];
  START.slice(1).forEach((t, n) => { const c = CELLS[n + 1]; K.push([t - 1.0, CELLS[n][0], CELLS[n][1] + 40, Z, GLIDE], [t + .45, c[0], c[1] + 40, Z, GLIDE]); });
  K.push([34.8, CELLS[8][0], CELLS[8][1] + 40, Z, GLIDE], [38.6, W / 2, H / 2 + 20, Math.min(1920 / W, 1080 / H) * .97, SOFT], [40.0, W / 2, H / 2 + 20, Math.min(1920 / W, 1080 / H) * .97, SOFT], [42.4, 3880, 3420, .74, GLIDE]);
  return K;
}
function camera(K, t) {
  if (t <= K[0][0]) return K[0];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const a = K[i - 1], b = K[i], e = b[4]((t - a[0]) / (b[0] - a[0]));
    const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), e)); return [0, lerp(a[1], b[1], e), lerp(a[2], b[2], e), z]; }
  return K[K.length - 1];
}

// ---------- picture
const cvs = document.getElementById('c'), ctx = cvs.getContext('2d');
const ready = (async () => {
  for (const f of ['400 40px Geist', '500 40px Geist', '600 40px Geist']) await document.fonts.load(f);
  const world = await build(); const glc = document.createElement('canvas'); glc.width = 1920; glc.height = 1080;
  const comp = compositor(glc, world); const K = cameraKeys(world);
  const tooth = (() => { const [c, x] = cv(512, 512); const im = x.createImageData(512, 512);
    for (let j = 0; j < 512; j++) for (let i = 0; i < 512; i++) { const v = n2(i * .35, j * .35, 3) * .6 + n2(i * .09, j * .09, 5) * .4, g = 255 - Math.max(0, v - .55) * 50, k = (j * 512 + i) * 4; im.data[k] = g; im.data[k + 1] = g * .995; im.data[k + 2] = g * .985; im.data[k + 3] = 255; }
    x.putImageData(im, 0, 0); return ctx.createPattern(c, 'repeat'); })();
  return t => { const [, x, y, z] = camera(K, t); const b = Math.floor(t * 12);   // the page is still; only a 1-px hand tremor in the camera
    comp({ cx: x + (n2(b * .7, 1, 9) - .5) * .8, cy: y + (n2(b * .7, 4, 9) - .5) * .8, z, rot: 0 }, t);
    ctx.drawImage(glc, 0, 0); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = tooth; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); };
})();
window.render = async t => { const draw = await ready; draw(t); };
window.READY = true;
