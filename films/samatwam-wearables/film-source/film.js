// Samatwam Ring · a 2-minute film. Backgrounds are only black or white. One typeface (Geist), sizes vary, no italics.
// Part 1 (0–60 s): the product. Part 2 (60–120 s): Samatwam's role in building it.
const INK = '#0A0A0B', PAPER = '#F7F7F5', ON_B = '#F5F5F2', ON_W = '#0B0B0C', SUB_B = 'rgba(255,255,255,.56)', SUB_W = 'rgba(11,11,12,.55)';
const FADE = .5;
let LAYER = 0;
// a hard cut or a quick fade to a full-frame black or white field
function field(color, at, until, fade = 0) { const f = el('div', { ...full, background: color, zIndex: ++LAYER }); tl.set(f, { opacity: 0 }, 0); if (fade) tl.to(f, { opacity: 1, duration: fade, ease: 'none' }, at); else tl.set(f, { opacity: 1 }, at); if (until != null) tl.set(f, { opacity: 0 }, until); return f; }
// a Blender still with a slow camera move (it was rendered with real depth of field; the move adds parallax-free drift)
function still(name, at, until, from = {}, to = {}, fade = FADE) {
  const w = el('div', { ...full, overflow: 'hidden', zIndex: ++LAYER }); const im = el('img', { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }, w); im.src = `../shared/renders/stills/${name}.png`;
  tl.set(w, { opacity: 0 }, 0).to(w, { opacity: 1, duration: fade, ease: 'none' }, at).set(w, { opacity: 0 }, until);
  tl.fromTo(im, { scale: 1.0, x: 0, y: 0, ...from }, { scale: 1.06, x: 0, y: 0, ...to, duration: until - at, ease: 'none' }, at); return w; }
// a rendered Blender sequence (90 frames) played at real speed, then held on its last frame with a slow push
function seq(name, at, until, n = 90, fade = FADE) {
  const w = el('div', { ...full, overflow: 'hidden', zIndex: ++LAYER }); const im = el('img', { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }, w);
  tl.set(w, { opacity: 0 }, 0).to(w, { opacity: 1, duration: fade, ease: 'none' }, at).set(w, { opacity: 0 }, until); tl.fromTo(im, { scale: 1 }, { scale: 1.05, duration: until - at, ease: 'none' }, at);
  perFrame.push(async (f, t) => { if (t < at || t > until) return; const k = clamp(Math.round((t - at) * 30) + 1, 1, n); const src = `../shared/renders/${name}/${String(k).padStart(4, '0')}.png`; if (im.dataset.k !== src) { im.src = src; im.dataset.k = src; try { await im.decode(); } catch (e) {} } }); return w; }
// type: one family; mode picks the GSAP reveal
function type(html, o) { const dark = o.on === 'w'; const e = txt(html, { left: (o.x ?? 140) + 'px', top: (o.y ?? 140) + 'px', fontSize: (o.s || 72) + 'px', lineHeight: Math.round((o.s || 72) * 1.04) + 'px', letterSpacing: o.ls || '-.035em', whiteSpace: 'normal', width: (o.w || 1100) + 'px', color: o.c || (dark ? ON_W : ON_B), fontWeight: o.wt || 500, textAlign: o.align || 'left', zIndex: 200 + (++LAYER), textShadow: 'none' });
  const sp = SplitText.create(e, { type: 'lines,words,chars', mask: 'lines' }); const m = o.mode || 'lines';
  if (m === 'lines') tl.from(sp.lines, { yPercent: 110, duration: .9, ease: 'reveal', stagger: .08 }, o.at);
  if (m === 'chars') tl.from(sp.chars, { yPercent: 110, duration: .8, ease: 'reveal', stagger: .022 }, o.at);
  if (m === 'fade') tl.from(e, { opacity: 0, duration: .8, ease: 'none' }, o.at);
  if (m === 'scramble') { const s = e.textContent; e.textContent = ''; tl.to(e, { scrambleText: { text: s, chars: '0123456789', speed: .5 }, duration: .9 }, o.at); }
  if (o.out != null) tl.to(m === 'scramble' || m === 'fade' ? e : sp.lines, { yPercent: m === 'fade' || m === 'scramble' ? 0 : -110, opacity: m === 'fade' || m === 'scramble' ? 0 : 1, duration: .5, ease: 'exit', stagger: .04 }, o.out);
  return e; }
const small = (s, o) => type(s, { s: 22, ls: '.16em', wt: 500, mode: 'fade', c: o.on === 'w' ? SUB_W : SUB_B, ...o, w: o.w || 900 });
function rule(x, y, w, at, out, on) { const r = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: '1px', background: on === 'w' ? 'rgba(11,11,12,.25)' : 'rgba(255,255,255,.25)', transformOrigin: '0 0', zIndex: 200 + (++LAYER) }); tl.from(r, { scaleX: 0, duration: .8, ease: 'glide' }, at); if (out != null) tl.to(r, { opacity: 0, duration: .4 }, out); return r; }
function specs(rows, x, y, at, out, on, w = 620) { rows.forEach(([k, v], i) => { const yy = y + i * 70; rule(x, yy, w, at + i * .12, out, on); small(k, { x, y: yy + 22, at: at + .2 + i * .12, out, on, s: 17 }); type(v, { x: x + w - 360, y: yy + 12, w: 360, s: 34, align: 'right', at: at + .3 + i * .12, out, on, mode: 'scramble' }); }); rule(x, y + rows.length * 70, w, at + rows.length * .12, out, on); }
function dot(x, y, at, out, size = 14) { const d = el('div', { position: 'absolute', left: (x - size / 2) + 'px', top: (y - size / 2) + 'px', width: size + 'px', height: size + 'px', borderRadius: '50%', background: '#FF8A2A', boxShadow: '0 0 24px rgba(255,138,42,.9), 0 0 60px rgba(255,138,42,.5)', zIndex: 200 + (++LAYER) }); tl.from(d, { scale: 0, opacity: 0, duration: .5, ease: 'snap' }, at); if (out != null) tl.to(d, { opacity: 0, duration: .4 }, out); return d; }

async function FILM() {
  // ================================================================ PART 1 · THE PRODUCT (black opens, white for craft, black for intelligence)
  field(INK, 0);
  // HOOK 0–5 s: darkness, one point of light pulses. Nothing else.
  const p = dot(960, 540, .4, 4.6, 12); tl.to(p, { scale: 1.6, duration: .35, yoyo: true, repeat: 5, ease: 'sine.inOut' }, .9);
  type('It noticed before you did.', { x: 0, y: 620, w: 1920, align: 'center', s: 46, at: 1.6, out: 4.4, mode: 'chars' });
  // 5–12 s: a strip light slides across titanium (Blender sequence), the name arrives
  seq('black_sweep', 5, 12.2);
  type('Samatwam Ring', { x: 140, y: 820, s: 96, at: 7.6, out: 11.6, mode: 'chars' });
  small('W1 · Physical AI wearable · concept', { x: 144, y: 930, at: 8.4, out: 11.6 });
  // 12–20 s: hero still, specs
  still('black_hero', 12, 20.2, { scale: 1.04, x: 30 }, { scale: 1.1, x: -20 });
  type('Titanium.<br>Eight millimetres.<br>Four grams.', { x: 1180, y: 300, w: 640, s: 58, at: 13, out: 19.4 });
  small('Design targets, not measurements', { x: 1184, y: 520, at: 14.4, out: 19.4, s: 15 });
  // 20–30 s: cut to WHITE. The embossed marks, in macro.
  field(PAPER, 20, 38);
  still('white_macro', 20, 30.2, { scale: 1.12, x: 60 }, { scale: 1.0, x: -40 }, .01);
  type('Every surface carries the mark.', { x: 140, y: 120, w: 1100, s: 64, on: 'w', at: 21, out: 29.4 });
  small('Samatwam marks, embossed and satin-finished, every 5.6 mm', { x: 144, y: 220, on: 'w', at: 22, out: 29.4 });
  // 30–38 s: the turntable on white
  seq('white_turn', 30, 38.2);
  type('Made to be forgotten on your hand.', { x: 140, y: 120, w: 900, s: 56, on: 'w', at: 31, out: 37.4 });
  specs([['Band width', '8 mm'], ['Wall', '2.6 mm'], ['Weight', '4 g'], ['Water', '10 m']], 140, 640, 32.2, 37.4, 'w', 560);
  // 38–46 s: BLACK. Inside the ring: the sensor window.
  field(INK, 38, 120);
  still('black_inner', 38, 46.2, { scale: 1.02 }, { scale: 1.12 });
  type('Inside, it reads three things.', { x: 140, y: 120, s: 60, at: 39, out: 45.4 });
  ['Grip pulse', 'Motion', 'Skin temperature'].forEach((s, i) => { type(s, { x: 140, y: 760 + i * 70, s: 40, at: 40.4 + i * .5, out: 45.4 }); rule(140, 750 + i * 70, 520, 40.3 + i * .5, 45.4); });
  // 46–55 s: the edge model, drawn on black (no cloud)
  const svgA = svgIn(stage, W, H, `
    <g class="ln" stroke="rgba(255,255,255,.5)" stroke-width="1.5"><path d="M330 540 H760"/><path d="M1160 540 H1590"/></g>
    <rect class="nd" x="760" y="440" width="400" height="200" rx="20" stroke="#F5F5F2" stroke-width="1.5"/>
    <circle class="sn" cx="300" cy="540" r="30" stroke="#F5F5F2" stroke-width="1.5"/>
    <path class="cl" d="M1500 470 C 1520 430, 1580 430, 1600 470 C 1640 470, 1650 520, 1610 530 L 1490 530 C 1450 530, 1460 470, 1500 470 Z" stroke="rgba(255,255,255,.35)" stroke-width="1.5" stroke-dasharray="5 7"/>
    <path class="x" d="M1520 470 L1590 530 M1590 470 L1520 530" stroke="#F5F5F2" stroke-width="2"/>`, { zIndex: 200 + (++LAYER) });
  tl.set(svgA, { opacity: 0 }, 0).set(svgA, { opacity: 1 }, 46).set(svgA, { opacity: 0 }, 55);
  tl.from(svgA.querySelector('.sn'), { scale: 0, transformOrigin: '300px 540px', duration: .5, ease: 'snap' }, 46.3).from(svgA.querySelectorAll('.ln path')[0], { drawSVG: 0, duration: .8, ease: 'glide' }, 46.8)
    .from(svgA.querySelector('.nd'), { drawSVG: 0, duration: 1, ease: 'glide' }, 47.4).from(svgA.querySelectorAll('.ln path')[1], { drawSVG: 0, duration: .8, ease: 'glide' }, 49.6)
    .from(svgA.querySelector('.cl'), { opacity: 0, duration: .6 }, 51).from(svgA.querySelector('.x'), { drawSVG: 0, duration: .5, ease: 'glide' }, 51.6);
  small('Sensor', { x: 220, y: 600, w: 160, align: 'center', at: 46.6, out: 54.6 });
  type('0.4 MB model', { x: 760, y: 486, w: 400, s: 40, align: 'center', at: 48, out: 54.6, mode: 'fade' }); small('on the ring', { x: 760, y: 548, w: 400, align: 'center', at: 48.4, out: 54.6 });
  type('4 ms', { x: 1240, y: 470, w: 220, s: 40, at: 50, out: 54.6, mode: 'scramble' }); small('to decide', { x: 1242, y: 530, w: 220, at: 50.2, out: 54.6 });
  type('Nothing leaves the ring.', { x: 140, y: 820, s: 64, at: 52, out: 54.8 });
  // 55–60 s: the decision. The status light on the real ring, one line.
  still('black_led', 55, 60.2, { scale: 1.0 }, { scale: 1.08 });
  type('Rest two minutes.', { x: 140, y: 820, s: 72, at: 56, out: 59.6, mode: 'chars' });
  small('Grip strain at 72% of your baseline · example', { x: 144, y: 920, at: 56.8, out: 59.6 });

  // ================================================================ PART 2 · SAMATWAM'S ROLE (white asks, black proves)
  // 60–67 s: WHITE hook, a question
  field(PAPER, 60, 86);
  type('Who builds<br>a ring like this?', { x: 140, y: 340, w: 1400, s: 120, on: 'w', at: 60.4, out: 66.4, mode: 'chars' });
  // 67–77 s: the class, and the path every work follows
  type('Learners in Samatwam’s Physical AI class.', { x: 140, y: 120, w: 1500, s: 60, on: 'w', at: 67, out: 76.4 });
  const steps = ['Question', 'Simulate', 'Build', 'Test', 'Certify'];
  steps.forEach((s, i) => { const x = 140 + i * 340; rule(x, 520, 300, 68 + i * .35, 76.4, 'w'); small(String(i + 1).padStart(2, '0'), { x, y: 540, on: 'w', at: 68.1 + i * .35, out: 76.4 }); type(s, { x, y: 580, w: 300, s: 44, on: 'w', at: 68.2 + i * .35, out: 76.4 }); });
  const pr = el('div', { position: 'absolute', left: '140px', top: '518px', width: '1660px', height: '3px', background: ON_W, transformOrigin: '0 0', zIndex: 300 }); tl.set(pr, { opacity: 0 }, 0).set(pr, { opacity: 1 }, 70).fromTo(pr, { scaleX: 0 }, { scaleX: 1, duration: 5, ease: 'none' }, 70).set(pr, { opacity: 0 }, 76.4);
  still('white_flat', 67, 77, { scale: .32, x: 640, y: 290 }, { scale: .34, x: 640, y: 290 }, .6).style.mixBlendMode = 'multiply';
  // 77–86 s: simulation first
  type('Trained in simulation<br>before it touches a hand.', { x: 140, y: 120, w: 1500, s: 72, on: 'w', at: 77, out: 85.4 });
  const sim = svgIn(stage, W, H, [...Array(3)].map((_, i) => `<path class="cv" d="${[...Array(60)].map((__, k) => `${k ? 'L' : 'M'}${140 + k * 25} ${760 - 220 * Math.exp(-k / (9 + i * 5)) + Math.sin(k * (1.3 + i * .4)) * (14 - i * 4)}`).join(' ')}" stroke="${i === 2 ? ON_W : 'rgba(11,11,12,.3)'}" stroke-width="${i === 2 ? 3 : 1.5}"/>`).join('') + `<path d="M140 800 H1640" stroke="rgba(11,11,12,.25)"/>`, { zIndex: 300 });
  tl.set(sim, { opacity: 0 }, 0).set(sim, { opacity: 1 }, 78).set(sim, { opacity: 0 }, 85.4).from(sim.querySelectorAll('.cv'), { drawSVG: 0, duration: 3, ease: 'glide', stagger: .4 }, 78.4);
  small('Error falls across simulated grips · Simulation Arena · illustrative', { x: 144, y: 830, w: 1400, on: 'w', at: 79, out: 85.4 });
  // 86–96 s: BLACK. Proven, then certified. Gold only on the seal, because the claim passed.
  type('Then it has to prove it.', { x: 140, y: 120, s: 64, at: 86.4, out: 95.4 });
  const card = el('div', { position: 'absolute', left: '140px', top: '300px', width: '1100px', height: '560px', border: '1px solid rgba(255,255,255,.28)', borderRadius: '6px', zIndex: 300 }); tl.set(card, { opacity: 0 }, 0).to(card, { opacity: 1, duration: .6 }, 87).set(card, { opacity: 0 }, 95.4);
  small('Certificate of record · Open Research', { x: 190, y: 350, at: 87.4, out: 95.4 });
  [['Flags grip strain within 4 ms', 'Passed'], ['Runs on the ring, offline', 'Passed'], ['Battery lasts 7 days', 'Not yet tested']].forEach(([c, v], i) => { rule(190, 430 + i * 120, 1000, 88 + i * .5, 95.4); type(c, { x: 190, y: 455 + i * 120, w: 700, s: 40, at: 88.1 + i * .5, out: 95.4 }); small(v, { x: 890, y: 470 + i * 120, w: 300, align: 'right', at: 88.6 + i * .5, out: 95.4, c: i < 2 ? ON_B : SUB_B }); });
  const seal = el('div', { position: 'absolute', left: '1380px', top: '380px', width: '300px', height: '300px', borderRadius: '50%', zIndex: 300, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, rgba(0,0,0,.04) 1px 2px), linear-gradient(160deg, #F6E7BF 0%, #B08D3C 45%, #E9D49A 58%, #8A6A26 100%)', boxShadow: 'inset 0 0 0 10px rgba(255,255,255,.18), inset 0 2px 0 rgba(255,255,255,.9), 0 20px 50px rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: 'Geist', fontWeight: 500, color: '#2A2110', letterSpacing: '.16em', fontSize: '18px', textAlign: 'center', lineHeight: '30px' }, stage, 'CERTIFIED<br><span style="font-size:44px;letter-spacing:-.02em">2 / 3</span>CLAIMS');
  tl.set(seal, { opacity: 0 }, 0).fromTo(seal, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .5, ease: 'snap' }, 91).set(seal, { opacity: 0 }, 95.4);
  small('Reviewed by a named engineer · example', { x: 1380, y: 720, w: 300, align: 'center', at: 91.6, out: 95.4, s: 15 });
  // 96–106 s: WHITE. Ownership.
  field(PAPER, 96, 114);
  type('Owned by the people<br>who built it.', { x: 140, y: 120, w: 1400, s: 84, on: 'w', at: 96.4, out: 105.4 });
  const pct = type('0%', { x: 140, y: 520, w: 800, s: 240, ls: '-.06em', on: 'w', at: 97.4, out: 105.4, mode: 'fade' }); count(pct, 70, 97.6, 2.4, v => Math.round(v) + '%');
  small('of what the work earns goes to its builders · source: Samatwam creator terms', { x: 150, y: 800, w: 1500, on: 'w', at: 99, out: 105.4 });
  // 106–114 s: industry asks, learners deliver
  type('Industry posts the need.<br>Certified learners build it.', { x: 140, y: 120, w: 1500, s: 72, on: 'w', at: 106.4, out: 113.4 });
  ['Requirement', 'Matched', 'Built', 'Delivered'].forEach((s, i) => { const x = 140 + i * 430; const c = el('div', { position: 'absolute', left: x + 'px', top: '560px', width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${ON_W}`, background: i === 3 ? ON_W : 'transparent', zIndex: 300 }); tl.set(c, { opacity: 0 }, 0).fromTo(c, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: 'snap' }, 107.4 + i * .5).set(c, { opacity: 0 }, 113.4); if (i < 3) rule(x + 34, 571, 380, 107.6 + i * .5, 113.4, 'w'); type(s, { x, y: 610, w: 380, s: 36, on: 'w', at: 107.5 + i * .5, out: 113.4 }); });
  // 114–120 s: BLACK end. The mark, the line, the call.
  const end = el('div', { position: 'absolute', left: '50%', top: '330px', width: '150px', height: '210px', transform: 'translateX(-50%)', zIndex: 400, filter: 'brightness(0) invert(.96)' }, stage, SUN); tl.set(end, { opacity: 0 }, 0).fromTo(end, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'reveal' }, 114.4);
  type('SAMATWAM', { x: 0, y: 600, w: 1920, s: 44, ls: '.32em', align: 'center', at: 115, mode: 'chars' });
  small('Samatwam Ring is a concept from the Physical AI class · Cohort 01 · Delhi NCR', { x: 0, y: 690, w: 1920, align: 'center', at: 116, s: 18 });
  const lp = el('div', { ...full, background: INK, zIndex: 900, opacity: 0 }); tl.to(lp, { opacity: 1, duration: .6, ease: 'none' }, 119.4);
}
