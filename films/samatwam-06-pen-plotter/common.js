// Samatwam film series — shared kit: helpers, series title, subtitles (English over Hindi), the Prime mark, text registry.
(function () {
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t, seg = (t, a, b) => clamp((t - a) / (b - a));
  const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }, eo = t => 1 - Math.pow(1 - clamp(t), 3), ei = t => Math.pow(clamp(t), 3);
  const back = (t, s = 1.7) => { t = clamp(t) - 1; return 1 + t * t * ((s + 1) * t + s); };
  const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
  const mulberry = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  let TX = [];
  const reg = (id, text, x0, y0, x1, y1, pass = false) => TX.push({ id, text, x0, y0, x1, y1, pass });
  const F = (w, px, fam = 'Inter') => `${w} ${px}px ${fam}, Deva`;
  // series title, top-left, the whole film. theme: {fg, sub, plate}
  function series(c, num, title, th, a = 1) {
    c.save(); c.globalAlpha = a; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    const s1 = 'SAMATWAM  ·  ' + num, s2 = title.toUpperCase();
    c.font = F(700, 20); c.letterSpacing = '3px'; const w1 = c.measureText(s1).width; c.font = F(600, 20); const w2 = c.measureText(s2).width;
    if (th.plate) { c.fillStyle = th.plate; c.beginPath(); c.roundRect(40, 38, w1 + w2 + 74, 44, 22); c.fill(); }
    c.fillStyle = th.accent || th.fg; c.font = F(700, 20); c.fillText(s1, 62, 67);
    c.fillStyle = th.fg; c.font = F(600, 20); c.fillText(s2, 62 + w1 + 18, 67);
    c.letterSpacing = '0px'; c.restore(); reg('series', s1 + ' ' + s2, 62, 50, 62 + w1 + w2 + 18, 72, false);
  }
  // subtitles: English (34) over Hindi (27); th: {box, en, hi}
  function subs(c, t, CAP, VO, VOD, th) {
    for (const [id, en, hi] of CAP) {
      const a = VO[id] - .1, b = VO[id] + Math.max(VOD[id] + .6, 1.9); if (t < a || t > b) continue;
      const k = Math.min(seg(t, a, a + .2), 1 - seg(t, b - .2, b));
      c.save(); c.globalAlpha = k; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
      c.font = F(600, 34); const m1 = c.measureText(en).width; c.font = F(500, 27); const m2 = c.measureText(hi).width;
      const w = Math.max(m1, m2) + 60; c.fillStyle = th.box; c.beginPath(); c.roundRect(960 - w / 2, 930, w, 112, 10); c.fill();
      c.fillStyle = th.en; c.font = F(600, 34); c.fillText(en, 960, 976); c.fillStyle = th.hi; c.font = F(500, 27); c.fillText(hi, 960, 1020);
      c.restore();
    }
  }
  // the Samatwam Prime mark (sun spiral in a crescent, spine with beads, infinity loop, two triangles); s = 1 => about 300 px tall
  function mark(c, x, y, s, k, col, lw = 1) {
    const part = (a, b) => clamp((k - a) / (b - a));
    c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'butt';
    const arc = (cx, cy, r, a0, a1, u) => { if (u <= 0) return; c.beginPath(); c.arc(cx, cy, r, a0, a0 + (a1 - a0) * u); c.stroke(); };
    c.lineWidth = 9 * lw; arc(0, -100, 60, -Math.PI / 2 + .62, 3 * Math.PI / 2 - .62, part(0, .35));
    c.lineWidth = 5 * lw; arc(0, -118, 54, .62 - Math.PI / 2 + .45, 3 * Math.PI / 2 - .62 - .45, part(.1, .4));
    const su = part(.15, .5); if (su > 0) { c.lineWidth = 3 * lw; arc(0, -108, 15, 0, Math.PI * 2, su);
      for (let i = 0; i < 12; i++) { if (i / 12 > su) break; const a = i / 12 * Math.PI * 2; c.beginPath(); c.moveTo(Math.cos(a) * 20, -108 + Math.sin(a) * 20); c.lineTo(Math.cos(a) * 27, -108 + Math.sin(a) * 27); c.stroke(); }
      c.beginPath(); for (let i = 0; i <= 40 * su; i++) { const a = i / 40 * Math.PI * 3, r = 1 + 10 * i / 40; c.lineTo(Math.cos(a) * r, -108 + Math.sin(a) * r); } c.stroke(); }
    c.lineWidth = 4 * lw; const sp = part(.35, .55); if (sp > 0) { c.beginPath(); c.moveTo(0, -40); c.lineTo(0, -40 + 80 * sp); c.stroke(); for (let i = 0; i < 4; i++) if (i / 4 < sp) { c.beginPath(); c.arc(0, -30 + i * 20, 5, 0, 7); c.fill(); } }
    const lp = part(.5, .85); if (lp > 0) { c.lineWidth = 8 * lw; c.beginPath(); const n = 120; for (let i = 0; i <= n * lp; i++) { const th = i / n * Math.PI * 2, d = 1 + Math.sin(th) ** 2; const px = 95 * Math.cos(th) / d, py = 60 + 95 * Math.sin(th) * Math.cos(th) / d; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); }
    const tr = part(.8, 1); if (tr > 0) { c.globalAlpha *= tr; c.beginPath(); c.moveTo(-55, 108); c.lineTo(-37, 140); c.lineTo(-73, 140); c.closePath(); c.fill(); c.beginPath(); c.moveTo(55, 140); c.lineTo(37, 108); c.lineTo(73, 108); c.closePath(); c.fill(); }
    c.restore();
  }
  // end card text block (left-aligned at x), revealed by wipe; returns nothing. th: {fg, sub, accent}
  function endText(c, t0, t, x, y, th, scale = 1) {
    const k = t - t0; if (k <= 0) return;
    const line = (str, yy, w, px, col, u, id) => { c.save(); c.font = F(w, px * scale, w >= 700 ? 'SG' : 'Inter'); const m = c.measureText(str).width; c.beginPath(); c.rect(x - 6, yy - px * scale, (m + 12) * eo(u), px * scale * 1.5); c.clip(); c.fillStyle = col; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText(str, x, yy); c.restore(); if (u > 0) reg(id, str, x, yy - px * scale * .8, x + m, yy + px * scale * .25); };
    line('SAMATWAM', y, 800, 110, th.fg, seg(k, .3, .8), 'end-name');
    line('Build it. Prove it. Give it back.', y + 66 * scale, 600, 44, th.fg, seg(k, .5, 1.0), 'end-line');
    c.fillStyle = th.accent; c.fillRect(x, y + 98 * scale, 130 * eo(seg(k, .7, 1.1)) * scale, 6 * scale);
    line('Samatwam Org · Toward Viksit Bharat 2047', y + 150 * scale, 500, 34, th.sub, seg(k, .6, 1.0), 'end-org');
  }
  window.SK = { clamp, lerp, seg, eio, eo, ei, back, hash, mulberry, F, series, subs, mark, endText, reg, reset: () => { TX = []; }, texts: () => TX };
})();
