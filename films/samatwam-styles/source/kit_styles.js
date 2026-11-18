// Samatwam Reels · 1080 × 1920 · 15 s · one typeface (Geist), no italics. Real footage under liquid-glass and metal UI.
// Grammar: 0–2 s hook (no logo), 2–11 s turn, 11–15 s anchor (fact + source, then the Samatwam mark). Text stays inside the safe area.
const W = 1920, H = 1080, FPS = 60, DUR = 7, NF = DUR * FPS;
const SAFE = { l: 120, r: 1800, t: 110, b: 980 };
const C = { ink: '#0B1020', saff: '#D9822B', lsaff: '#F2B766', gold: '#B08D3C', text: '#F5F3EE', soft: 'rgba(255,255,255,.74)', mute: 'rgba(255,255,255,.55)', ok: '#7FD39B', red: '#E5533D' };
gsap.registerPlugin(SplitText, DrawSVGPlugin, ScrambleTextPlugin, CustomEase, MotionPathPlugin);
CustomEase.create('reveal', 'M0,0 C0.12,0.7 0.2,1 1,1');
CustomEase.create('glide', 'M0,0 C0.6,0 0.12,1 1,1');
CustomEase.create('snap', 'M0,0 C0.2,0 0.24,1.14 0.52,1.04 C0.7,0.97 0.82,1 1,1');
CustomEase.create('exit', 'M0,0 C0.5,0 0.85,0.4 1,1');
CustomEase.create('drop', 'M0,0 C0.4,0 0.6,1.2 0.75,1 C0.85,0.92 0.92,1 1,1');
// Framer Motion's spring physics, sampled into GSAP eases so every frame can be stepped exactly
function springEase(stiffness, damping, mass = 1) { const g = MotionLib.spring({ keyframes: [0, 1], stiffness, damping, mass, restDelta: .0005, restSpeed: .001 });
  let T = 0; while (!g.next(T).done && T < 5000) T += 4; const N = 400, tab = [...Array(N + 1)].map((_, i) => g.next(T * i / N).value);
  return p => { if (p <= 0) return 0; if (p >= 1) return 1; const x = p * N, i = Math.floor(x); return tab[i] + (tab[i + 1] - tab[i]) * (x - i); }; }
gsap.registerEase('reveal', springEase(140, 20)); gsap.registerEase('snap', springEase(320, 17)); gsap.registerEase('glide', springEase(90, 19)); gsap.registerEase('drop', springEase(260, 13));
const stage = document.getElementById('stage');
const tl = gsap.timeline({ paused: true });
const perFrame = [];
const full = { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px' };
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ss = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
const box = (l, t, w, h) => ({ left: l + 'px', top: t + 'px', width: w + 'px', height: h + 'px' });
function el(tag, css = {}, parent = stage, html = '') { const e = document.createElement(tag); Object.assign(e.style, css); if (html) e.innerHTML = html; parent.appendChild(e); return e; }
function svgIn(parent, w, h, inner, css = {}) { const d = el('div', { position: 'absolute', left: 0, top: 0, width: w + 'px', height: h + 'px', ...css }, parent, `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`); return d.querySelector('svg'); }
const hl = s => `<span class="hl">${s}</span>`;
// one family everywhere: Geist. Labels are Geist too, set small, uppercase and tracked.
const label = (s, css = {}, p = stage) => el('div', { position: 'absolute', fontFamily: 'Geist', fontWeight: 500, fontSize: '22px', letterSpacing: '.16em', textTransform: 'uppercase', color: C.soft, whiteSpace: 'nowrap', ...css }, p, s);
const txt = (s, css = {}, p = stage) => el('div', { position: 'absolute', fontFamily: 'Geist', fontWeight: 500, color: C.text, whiteSpace: 'nowrap', letterSpacing: '-.03em', ...css }, p, s);
function show(e, a, b, d = .4) { tl.from(e, { opacity: 0, duration: d }, a); if (b != null) tl.to(e, { opacity: 0, duration: d }, b); return e; }

// ---------------------------------------------------------------- footage
// at: when the shot starts; rate < 1 = slow motion; pp = ping-pong so a 5 s clip can carry a long shot
function foot(id, o = {}) {
  const wrap = el('div', { position: 'absolute', overflow: 'hidden', ...(o.box || full), borderRadius: (o.r || 0) + 'px', zIndex: o.z || 0, ...(o.css || {}) }, o.parent || stage);
  const img = el('img', { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: o.pos || '50% 50%', filter: o.grade || 'saturate(.9) contrast(1.06) brightness(.82)' }, wrap);
  if (o.blur) img.style.filter += ` blur(${o.blur}px)`;
  el('div', { position: 'absolute', inset: 0, background: o.tint || 'linear-gradient(180deg, rgba(11,16,32,.35) 0%, rgba(11,16,32,0) 30%, rgba(11,16,32,.15) 60%, rgba(11,16,32,.7) 100%)' }, wrap);
  const z = o.zoom || [1.1, 1.0]; tl.fromTo(img, { scale: z[0] }, { scale: z[1], duration: o.zd || DUR, ease: 'none' }, o.at || 0);
  if (o.pan) tl.fromTo(img, { x: o.pan[0] }, { x: o.pan[1], duration: o.zd || DUR, ease: 'none' }, o.at || 0);
  const at = o.at || 0, rate = o.rate ?? .7, pp = o.pp ?? true;
  perFrame.push(async f => { let u = Math.max(0, (f - at * 30) * rate); if (pp) { const m = 298; u = u % m; if (u > 149) u = m - u; } const k = clamp(Math.round(u) + 1, 1, 150);
    const src = `../shared/footage/${id}/${String(k).padStart(4, '0')}.jpg`; if (img.dataset.k !== src) { img.src = src; img.dataset.k = src; try { await img.decode(); } catch (e) {} } });
  wrap.img = img; return wrap;
}
// cut to a new full-frame shot at a given time (hard cut, or glass wipe / iris)
function cut(id, at, o = {}) { const s = foot(id, { at, z: o.z || 1, ...o }); tl.set(s, { opacity: 0 }, 0).set(s, { opacity: 1 }, at); if (o.until != null) tl.set(s, { opacity: 0 }, o.until); return s; }
function wipeIn(layer, at, dur = .9, dir = 'up') { layer.style.clipPath = dir === 'up' ? 'inset(100% 0 0 0)' : 'inset(0 0 0 100%)';
  const slab = el('div', { position: 'absolute', left: 0, top: 0, width: dir === 'up' ? W + 'px' : '140px', height: dir === 'up' ? '150px' : H + 'px', zIndex: (+layer.style.zIndex || 0) + 1, opacity: 0, backdropFilter: 'blur(18px) saturate(1.9) brightness(1.12)', background: 'linear-gradient(180deg, rgba(255,255,255,.3), rgba(255,255,255,.06) 45%, rgba(255,255,255,.2))', borderTop: '1px solid rgba(255,255,255,.85)', borderBottom: '1px solid rgba(255,255,255,.4)', boxShadow: '0 0 60px rgba(11,16,32,.4)' });
  const p = { v: 0 }; tl.to(p, { v: 1, duration: dur, ease: 'glide' }, at);
  perFrame.push(() => { if (dir === 'up') { const y = lerp(H + 20, -170, p.v); slab.style.top = y + 'px'; layer.style.clipPath = `inset(${clamp(y + 75, 0, H)}px 0 0 0)`; } else { const x = lerp(W + 20, -160, p.v); slab.style.left = x + 'px'; layer.style.clipPath = `inset(0 0 0 ${clamp(x + 70, 0, W)}px)`; } slab.style.opacity = p.v > 0 && p.v < 1 ? 1 : 0; }); }
function iris(layer, at, cx = 540, cy = 960, dur = 1) { const p = { r: 0 }; layer.style.clipPath = `circle(0px at ${cx}px ${cy}px)`; tl.to(p, { r: 2300, duration: dur, ease: 'glide' }, at); perFrame.push(() => { layer.style.clipPath = `circle(${p.r}px at ${cx}px ${cy}px)`; }); }
function blackout(a, b, z = 20) { const k = el('div', { ...full, background: '#05070C', zIndex: z }); tl.set(k, { opacity: 1 }, 0); if (a > 0) tl.set(k, { opacity: 0 }, 0).to(k, { opacity: 1, duration: .3 }, a); tl.to(k, { opacity: 0, duration: .6, ease: 'glide' }, b); return k; }

// ---------------------------------------------------------------- liquid glass and brushed metal
function glass(css = {}, parent = stage, html = '', o = {}) { const r = o.r ?? 36;
  const g = el('div', { position: 'absolute', boxSizing: 'border-box', borderRadius: r + 'px', color: C.text, overflow: 'hidden',
    background: `linear-gradient(135deg, rgba(255,255,255,${o.a ?? .2}) 0%, rgba(255,255,255,${(o.a ?? .2) * .45}) 45%, rgba(255,255,255,${(o.a ?? .2) * .7}) 100%)`,
    backdropFilter: `blur(${o.blur ?? 30}px) saturate(1.8) brightness(${o.br ?? 1.04})`, border: '1.5px solid rgba(255,255,255,.5)',
    boxShadow: 'inset 0 2px 0 rgba(255,255,255,.85), inset 2px 0 0 rgba(255,255,255,.3), inset 4px 4px 0 -2px rgba(242,183,102,.35), inset -4px -4px 0 -2px rgba(140,180,255,.35), inset 0 -30px 50px -24px rgba(11,16,32,.3), 0 30px 70px rgba(11,16,32,.4)', ...css }, parent, html);
  el('div', { position: 'absolute', left: 0, top: 0, right: 0, height: '50%', borderRadius: `${r}px ${r}px 0 0`, background: 'radial-gradient(120% 100% at 30% 0%, rgba(255,255,255,.3), rgba(255,255,255,0) 60%)', pointerEvents: 'none' }, g);
  return g; }
function pill(html, css = {}, parent = stage, o = {}) { const h = o.h || 76; const p = glass({ height: h + 'px', padding: `0 ${o.pad || 34}px`, display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'Geist', fontWeight: 500, fontSize: (o.fs || 28) + 'px', whiteSpace: 'nowrap', ...css }, parent, `<span style="position:relative;z-index:2;display:flex;align-items:center;gap:14px">${html}</span>`, { r: h / 2, a: o.a ?? .18 });
  if (o.glow) p.style.boxShadow += ', 0 0 0 1.5px rgba(242,183,102,.7), 0 0 50px rgba(242,183,102,.55)'; return p; }
const METAL = { silver: ['#F7F8FA', '#C9CDD3', '#EEF0F2', '#9EA4AC'], gold: ['#F6E7BF', '#B08D3C', '#E9D49A', '#8A6A26'], dark: ['#5A616C', '#2A2F38', '#474E59', '#1B1F26'] };
const metalBg = (k = 'silver', a = 180) => { const m = METAL[k]; return `repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, rgba(0,0,0,.035) 1px 2px), linear-gradient(${a}deg, ${m[0]} 0%, ${m[1]} 46%, ${m[2]} 54%, ${m[3]} 100%)`; };
function metal(css = {}, parent = stage, html = '', k = 'silver') { return el('div', { position: 'absolute', boxSizing: 'border-box', background: metalBg(k), border: '1px solid rgba(255,255,255,.7)', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,.95), inset 0 -3px 4px rgba(0,0,0,.25), 0 12px 26px rgba(11,16,32,.4)', color: k === 'dark' ? C.text : C.ink, fontFamily: 'Geist', fontWeight: 500, ...css }, parent, html); }
const saffBg = `linear-gradient(180deg, ${C.lsaff}, ${C.saff})`;
const tick = (on = true, s = 34) => `<span style="display:inline-flex;flex:none;width:${s}px;height:${s}px;border-radius:50%;align-items:center;justify-content:center;background:${on ? C.saff : 'rgba(255,255,255,.12)'};border:1.5px solid rgba(255,255,255,.55);box-shadow:${on ? '0 0 18px rgba(217,130,43,.65)' : 'none'}"><svg width="${s * .5}" height="${s * .5}" viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3L9.6 3.6" fill="none" stroke="${on ? '#fff' : 'rgba(255,255,255,.35)'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const cross = (s = 34) => `<span style="display:inline-flex;flex:none;width:${s}px;height:${s}px;border-radius:50%;align-items:center;justify-content:center;background:rgba(229,83,61,.18);border:1.5px solid rgba(229,83,61,.8)"><svg width="${s * .45}" height="${s * .45}" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="#F3A193" stroke-width="1.8" stroke-linecap="round"/></svg></span>`;

// ---------------------------------------------------------------- kinetic type (GSAP SplitText)
function head(html, o = {}) {
  const e = txt(html, { left: (o.l ?? SAFE.l) + 'px', top: (o.t ?? 300) + 'px', fontSize: (o.s || 104) + 'px', lineHeight: Math.round((o.s || 104) * 1.0) + 'px', letterSpacing: '-.045em', whiteSpace: 'normal', width: (o.w || SAFE.r - SAFE.l) + 'px', zIndex: o.z || 12, textAlign: o.align || 'left', textShadow: '0 4px 40px rgba(11,16,32,.45)', fontWeight: o.wt || 500, ...(o.css || {}) }, o.parent || stage);
  const sp = SplitText.create(e, { type: 'lines,words,chars', mask: 'lines' }); const at = o.at ?? .2, m = o.mode || 'rise';
  if (m === 'rise') tl.from(sp.chars, { yPercent: 115, duration: .9, ease: 'reveal', stagger: .018 }, at);
  if (m === 'blur') tl.from(sp.chars, { opacity: 0, filter: 'blur(16px)', y: 30, duration: .9, ease: 'reveal', stagger: .022 }, at);
  if (m === 'flip') tl.from(sp.words, { rotationX: -95, yPercent: 60, opacity: 0, transformOrigin: '50% 100% -40px', transformPerspective: 900, duration: .9, ease: 'reveal', stagger: .07 }, at);
  if (m === 'words') tl.from(sp.words, { yPercent: 110, duration: .8, ease: 'reveal', stagger: .06 }, at);
  if (m === 'scale') tl.from(sp.words, { scale: 1.6, opacity: 0, filter: 'blur(10px)', duration: .8, ease: 'reveal', stagger: .08 }, at);
  if (o.out != null) tl.to(sp.chars, { yPercent: -115, duration: .5, ease: 'exit', stagger: .006 }, o.out);
  e.sp = sp; return e; }
function count(node, to, at, dur = 1.3, fmt = v => Math.round(v).toLocaleString('en-IN'), from = 0) { const o = { v: from }; tl.to(o, { v: to, duration: dur, ease: 'glide' }, at); perFrame.push(() => { node.textContent = fmt(o.v); }); return o; }
function typer(node, s, at, dur) { const o = { n: 0 }; tl.to(o, { n: s.length, duration: dur, ease: 'none' }, at); perFrame.push(() => { node.textContent = s.slice(0, Math.round(o.n)); }); }
// a burned-in caption (most people watch muted): sits low in the safe area, words land one by one
function caption(s, at, out) { const c = pill(`<span class="cw">${s}</span>`, { left: SAFE.l + 'px', top: '1410px', zIndex: 30, maxWidth: (SAFE.r - SAFE.l) + 'px', whiteSpace: 'normal', height: 'auto', padding: '18px 30px' }, stage, { h: 80, fs: 32, a: .16 });
  const sp = SplitText.create(c.querySelector('.cw'), { type: 'words' }); tl.from(c, { opacity: 0, y: 20, duration: .4, ease: 'reveal' }, at).from(sp.words, { opacity: 0, y: 10, duration: .3, stagger: .06 }, at + .1); if (out != null) tl.to(c, { opacity: 0, y: -10, duration: .3 }, out); return c; }


// ---------------------------------------------------------------- liquid gradient field: moving radial blobs (saffron, navy, blue), loops with the reel
function meshGrad(o = {}) { const g = el('div', { ...full, zIndex: o.z ?? 1, opacity: o.op ?? 1, filter: 'blur(40px) saturate(1.2)', pointerEvents: 'none' }, o.parent || stage);
  const P = o.cols || [[217, 130, 43], [242, 183, 102], [31, 58, 122], [19, 33, 61], [217, 130, 43]];
  perFrame.push((f, t) => { const a = t / DUR * Math.PI * 2; g.style.background = P.map((c, i) => { const x = 50 + 38 * Math.cos(a * (i % 2 ? 1 : -1) + i * 1.3), y = 50 + 34 * Math.sin(a * (i % 3 ? 1 : -1) + i * 2.1); return `radial-gradient(circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgba(${c},${o.a ?? .55}) 0%, rgba(${c},0) ${o.size ?? 42}%)`; }).join(',') + ', #070A12'; });
  if (o.at != null) tl.from(g, { opacity: 0, duration: .8 }, o.at); if (o.until != null) tl.to(g, { opacity: 0, duration: .6 }, o.until); return g; }
// ---------------------------------------------------------------- the anchor (11–15 s): fact with its source, closing line, Samatwam mark, call
let SUN = '';
function anchor(o) {
  const A = 11;
  const mg = meshGrad({ z: 24, a: .5 }); tl.set(mg, { opacity: 0 }, 0).to(mg, { opacity: .9, duration: .9, ease: 'glide' }, A - .2);
  const scrim = el('div', { ...full, zIndex: 25, background: 'linear-gradient(180deg, rgba(11,16,32,.05), rgba(11,16,32,.35) 45%, rgba(11,16,32,.7))' }); tl.from(scrim, { opacity: 0, duration: .7, ease: 'glide' }, A - .2);
  const line = head(o.line, { t: o.lt ?? 380, s: o.ls || 96, at: A, z: 27, mode: 'flip' });
  if (o.fact) { const f = glass({ left: SAFE.l + 'px', top: (o.ft ?? 860) + 'px', width: (SAFE.r - SAFE.l) + 'px', padding: '30px 36px', zIndex: 27 }, stage, '', { r: 34 });
    el('div', { position: 'relative', zIndex: 2, fontFamily: 'Geist', fontWeight: 500, fontSize: '36px', lineHeight: '44px', letterSpacing: '-.02em', color: C.text }, f, o.fact);
    el('div', { position: 'relative', zIndex: 2, marginTop: '14px', fontFamily: 'Geist', fontWeight: 500, fontSize: '19px', letterSpacing: '.14em', textTransform: 'uppercase', color: C.lsaff }, f, 'Source · ' + o.src);
    tl.from(f, { y: 40, opacity: 0, duration: .8, ease: 'reveal' }, A + .6); }
  const mk = el('div', { position: 'absolute', left: SAFE.l + 'px', top: (o.mt ?? 1180) + 'px', display: 'flex', alignItems: 'center', gap: '22px', zIndex: 27 });
  const med = metal({ position: 'relative', width: '96px', height: '96px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }, mk, `<div style="width:46px;height:64px;filter:brightness(0) opacity(.78)">${SUN}</div>`);
  const wm = el('div', { fontFamily: 'Geist', fontWeight: 500, fontSize: '40px', letterSpacing: '.24em', color: C.text }, mk, 'SAMATWAM');
  tl.from(med, { scale: 0, rotate: -90, duration: .8, ease: 'snap' }, A + 1.5).from(wm, { opacity: 0, x: -20, letterSpacing: '.6em', duration: .9, ease: 'reveal' }, A + 1.6);
  caption(o.call, A + 2.1);
  // loop: the last frames fade toward the hook frame
  const lp = el('div', { ...full, zIndex: 60, background: o.loopBg || '#05070C', opacity: 0 }); tl.to(lp, { opacity: 1, duration: .45, ease: 'none' }, DUR - .45);
}

function finish() {
  perFrame.push((f, t) => stage.style.setProperty('--gp', (t * 220).toFixed(1) + 'px'));
  el('div', { ...full, zIndex: 48, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.25) 100%)' });
  const gr = el('div', { ...full, zIndex: 49, pointerEvents: 'none', opacity: 0, mixBlendMode: 'overlay' }, stage, `<svg width="${W}" height="${H}"><filter id="gn"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="1"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gn)"/></svg>`);
  const tb = gr.querySelector('feTurbulence'); perFrame.push(f => tb.setAttribute('seed', String(f % 23 + 1)));
}
window.DUR = DUR; window.EV = [];
const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
const ready = (async () => { for (const f of ['500 100px Geist', '400 30px Geist']) await document.fonts.load(f); SUN = (await (await fetch('../shared/sun-full.svg')).text()).replace(/width="[^"]*pt"/, 'width="100%"').replace(/height="[^"]*pt"/, 'height="100%"'); await new Promise(r => document.readyState === "complete" ? r() : addEventListener("load", r)); await STYLE(window.FRAMEN); finish(); })();
window.render = async function (t) { await ready; const f = Math.min(Math.round(t * FPS), NF - 1); tl.seek(t, false); await Promise.all(perFrame.map(fn => fn(f, t))); await raf(); };
window.READY = true;
