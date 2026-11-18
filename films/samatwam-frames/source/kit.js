// Samatwam Frames · Glass & Metal kit. Real Mixkit footage under premium product UI: liquid glass, brushed metal, kinetic type, animated widgets.
const W = 1920, H = 1080, FPS = 30, DUR = 5;
const C = { ink: '#0B1020', navy: '#13213D', saff: '#D9822B', lsaff: '#F2B766', gold: '#B08D3C', white: '#FFFFFF', text: '#F5F3EE', soft: 'rgba(255,255,255,.72)', mute: 'rgba(255,255,255,.55)', ok: '#7FD39B' };
gsap.registerPlugin(SplitText, DrawSVGPlugin, ScrambleTextPlugin, CustomEase, MotionPathPlugin);
CustomEase.create('reveal', 'M0,0 C0.12,0.7 0.2,1 1,1');
CustomEase.create('glide', 'M0,0 C0.6,0 0.12,1 1,1');
CustomEase.create('snap', 'M0,0 C0.2,0 0.24,1.14 0.52,1.04 C0.7,0.97 0.82,1 1,1');
CustomEase.create('exit', 'M0,0 C0.5,0 0.85,0.4 1,1');
const stage = document.getElementById('stage');
const tl = gsap.timeline({ paused: true });
const perFrame = [];
const full = { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px' };
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ss = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
function el(tag, css = {}, parent = stage, html = '') { const e = document.createElement(tag); Object.assign(e.style, css); if (html) e.innerHTML = html; parent.appendChild(e); return e; }
function svgIn(parent, w, h, inner, css = {}) { const d = el('div', { position: 'absolute', left: 0, top: 0, width: w + 'px', height: h + 'px', ...css }, parent, `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`); return d.querySelector('svg'); }
const box = (l, t, w, h) => ({ left: l + 'px', top: t + 'px', width: w + 'px', height: h + 'px' });
const mono = (s, css = {}, p = stage) => el('div', { position: 'absolute', fontFamily: 'JBM', fontSize: '13px', letterSpacing: '.14em', textTransform: 'uppercase', color: C.soft, whiteSpace: 'nowrap', ...css }, p, s);
const txt = (s, css = {}, p = stage) => el('div', { position: 'absolute', fontFamily: 'SG', fontWeight: 500, color: C.text, whiteSpace: 'nowrap', letterSpacing: '-.02em', ...css }, p, s);

// ---------------------------------------------------------------- footage: a real clip as a frame sequence, graded, with a slow camera move
function foot(id, o = {}) {
  const wrap = el('div', { position: 'absolute', overflow: 'hidden', ...(o.box || { left: 0, top: 0, width: W + 'px', height: H + 'px' }), borderRadius: (o.r || 0) + 'px', zIndex: o.z || 0, ...(o.css || {}) }, o.parent || stage);
  const img = el('img', { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', filter: o.grade || 'saturate(.9) contrast(1.06) brightness(.86)', transformOrigin: o.origin || '50% 50%' }, wrap);
  const tint = el('div', { position: 'absolute', inset: 0, background: o.tint || 'linear-gradient(180deg, rgba(11,16,32,.10) 0%, rgba(11,16,32,.0) 40%, rgba(11,16,32,.55) 100%)' }, wrap);
  const z = o.zoom || [1.08, 1.0]; tl.fromTo(img, { scale: z[0] }, { scale: z[1], duration: DUR, ease: 'none' }, 0);
  if (o.pan) tl.fromTo(img, { x: o.pan[0] }, { x: o.pan[1], duration: DUR, ease: 'none' }, 0);
  const off = o.off || 0, rate = o.rate || 1;
  perFrame.push(async (f) => { const k = clamp(Math.round(off * 30 + f * rate) + 1, 1, 150); const src = `../shared/footage/${id}/${String(k).padStart(4, '0')}.jpg`; if (img.dataset.k !== src) { img.src = src; img.dataset.k = src; try { await img.decode(); } catch (e) {} } });
  wrap.img = img; wrap.tint = tint; return wrap;
}

// ---------------------------------------------------------------- liquid glass: real backdrop blur, thick rim, specular, chromatic edge
function glass(css = {}, parent = stage, html = '', o = {}) {
  const r = o.r ?? 28;
  const g = el('div', { position: 'absolute', boxSizing: 'border-box', borderRadius: r + 'px', color: C.text, overflow: 'hidden',
    background: `linear-gradient(135deg, rgba(255,255,255,${o.a ?? .2}) 0%, rgba(255,255,255,${(o.a ?? .2) * .45}) 45%, rgba(255,255,255,${(o.a ?? .2) * .7}) 100%)`,
    backdropFilter: `blur(${o.blur ?? 28}px) saturate(1.8) brightness(${o.br ?? 1.05})`, webkitBackdropFilter: `blur(${o.blur ?? 28}px) saturate(1.8)`,
    border: '1px solid rgba(255,255,255,.5)',
    boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,.85), inset 1.5px 0 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(255,255,255,.25), inset 3px 3px 0 -2px rgba(242,183,102,.35), inset -3px -3px 0 -2px rgba(140,180,255,.35), inset 0 -24px 40px -20px rgba(11,16,32,.25), 0 24px 60px rgba(11,16,32,.35), 0 2px 6px rgba(11,16,32,.2)',
    ...css }, parent, html);
  el('div', { position: 'absolute', left: 0, top: 0, right: 0, height: '55%', borderRadius: `${r}px ${r}px 0 0`, background: 'radial-gradient(120% 100% at 30% 0%, rgba(255,255,255,.32), rgba(255,255,255,0) 60%)', pointerEvents: 'none' }, g);
  return g;
}
// a glass pill button; glow = the saffron under-light from the reference board
function pill(label, css = {}, parent = stage, o = {}) {
  const p = glass({ height: (o.h || 60) + 'px', padding: `0 ${o.pad || 28}px`, display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'SG', fontWeight: 500, fontSize: (o.fs || 22) + 'px', whiteSpace: 'nowrap', ...css }, parent, `<span style="position:relative;z-index:2;display:flex;align-items:center;gap:12px">${label}</span>`, { r: (o.h || 60) / 2, a: o.a ?? .18 });
  if (o.glow) p.style.boxShadow += `, 0 0 0 1px rgba(242,183,102,.6), 0 0 40px rgba(242,183,102,.55)`;
  return p;
}
// brushed metal: silver by default, gold only for proven or held work
const METAL = { silver: ['#F7F8FA', '#C9CDD3', '#EEF0F2', '#9EA4AC'], gold: ['#F6E7BF', '#B08D3C', '#E9D49A', '#8A6A26'], dark: ['#5A616C', '#2A2F38', '#474E59', '#1B1F26'] };
function metalBg(kind = 'silver', angle = 180) { const m = METAL[kind]; return `repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, rgba(0,0,0,.035) 1px 2px), linear-gradient(${angle}deg, ${m[0]} 0%, ${m[1]} 46%, ${m[2]} 54%, ${m[3]} 100%)`; }
function metal(css = {}, parent = stage, html = '', kind = 'silver') { return el('div', { position: 'absolute', boxSizing: 'border-box', background: metalBg(kind), border: '1px solid rgba(255,255,255,.7)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.95), inset 0 -2px 3px rgba(0,0,0,.25), 0 8px 18px rgba(11,16,32,.35)', color: kind === 'dark' ? C.text : C.ink, ...css }, parent, html); }
const chromeText = (kind = 'silver') => ({ background: `linear-gradient(180deg, ${METAL[kind][0]} 10%, ${METAL[kind][1]} 52%, ${METAL[kind][2]} 60%, ${METAL[kind][3]} 100%)`, webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' });

// ---------------------------------------------------------------- kinetic type
function head(html, o = {}) {
  const e = txt(html, { left: (o.l ?? 120) + 'px', top: (o.t ?? 160) + 'px', fontSize: (o.s || 96) + 'px', lineHeight: Math.round((o.s || 96) * 1.02) + 'px', letterSpacing: '-.04em', whiteSpace: 'normal', width: (o.w || 1000) + 'px', zIndex: o.z || 10, textShadow: '0 2px 30px rgba(11,16,32,.35)', ...(o.css || {}) }, o.parent || stage);
  const sp = SplitText.create(e, { type: 'lines,words,chars', mask: 'lines' });
  const at = o.at ?? .2, mode = o.mode || 'rise';
  if (mode === 'rise') tl.from(sp.chars, { yPercent: 120, duration: .9, ease: 'reveal', stagger: .016 }, at);
  if (mode === 'blur') tl.from(sp.chars, { opacity: 0, filter: 'blur(14px)', y: 24, duration: .8, ease: 'reveal', stagger: .02 }, at);
  if (mode === 'lines') tl.from(sp.lines, { yPercent: 110, duration: 1, ease: 'reveal', stagger: .1 }, at);
  if (o.out != null) tl.to(sp.chars, { yPercent: -120, duration: .5, ease: 'exit', stagger: .008 }, o.out);
  e.sp = sp; return e;
}
function kicker(s, o = {}) { const k = pill(`<span style="width:7px;height:7px;border-radius:50%;background:${C.saff};box-shadow:0 0 10px ${C.saff}"></span><span style="font-family:JBM;font-size:12px;letter-spacing:.16em;text-transform:uppercase">${s}</span>`, { left: (o.l ?? 120) + 'px', top: (o.t ?? 100) + 'px', zIndex: 11 }, o.parent || stage, { h: 40, pad: 16, a: .14 });
  tl.from(k, { opacity: 0, y: -10, duration: .6, ease: 'reveal' }, o.at ?? .1); if (o.out != null) tl.to(k, { opacity: 0, y: -10, duration: .4 }, o.out); return k; }
function count(node, to, at, dur = 1.2, fmt = v => Math.round(v).toLocaleString('en-IN'), from = 0) { const o = { v: from }; tl.to(o, { v: to, duration: dur, ease: 'glide' }, at); perFrame.push(() => { node.textContent = fmt(o.v); }); return o; }
function typer(node, s, at, dur) { const o = { n: 0 }; tl.to(o, { n: s.length, duration: dur, ease: 'none' }, at); perFrame.push(() => { node.textContent = s.slice(0, Math.round(o.n)); }); }

// ---------------------------------------------------------------- transitions
// glass wipe: the next layer is revealed behind a moving slab of liquid glass
function glassWipe(layer, at, dur = .9) {
  layer.style.clipPath = 'inset(0 0 0 100%)';
  const slab = el('div', { position: 'absolute', top: 0, left: W + 'px', width: '160px', height: H + 'px', zIndex: (+layer.style.zIndex || 0) + 1, backdropFilter: 'blur(18px) saturate(1.9) brightness(1.12)', webkitBackdropFilter: 'blur(18px) saturate(1.9)', background: 'linear-gradient(90deg, rgba(255,255,255,.28), rgba(255,255,255,.06) 40%, rgba(255,255,255,.18))', borderLeft: '1px solid rgba(255,255,255,.8)', borderRight: '1px solid rgba(255,255,255,.4)', boxShadow: '0 0 60px rgba(11,16,32,.35)' });
  const p = { v: 0 }; tl.to(p, { v: 1, duration: dur, ease: 'glide' }, at);
  perFrame.push(() => { const x = lerp(W + 20, -180, p.v); slab.style.left = x + 'px'; layer.style.clipPath = `inset(0 0 0 ${clamp(x + 80, 0, W)}px)`; slab.style.opacity = p.v > 0 && p.v < 1 ? 1 : 0; });
}
function iris(layer, at, cx = 960, cy = 540, dur = 1) { const p = { r: 0 }; layer.style.clipPath = `circle(0px at ${cx}px ${cy}px)`; tl.to(p, { r: 1300, duration: dur, ease: 'glide' }, at); perFrame.push(() => { layer.style.clipPath = `circle(${p.r}px at ${cx}px ${cy}px)`; }); }

// ---------------------------------------------------------------- widgets
function ring(parent, o) { const r = o.r || 54, sw = o.sw || 10, sz = (r + sw) * 2;
  const s = svgIn(parent, sz, sz, `<defs><linearGradient id="rg${o.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.lsaff}"/><stop offset="1" stop-color="${C.saff}"/></linearGradient></defs><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" stroke="rgba(255,255,255,.18)" stroke-width="${sw}"/><circle class="rv" cx="${sz / 2}" cy="${sz / 2}" r="${r}" stroke="url(#rg${o.id})" stroke-width="${sw}" stroke-linecap="round" transform="rotate(-90 ${sz / 2} ${sz / 2})"/>`, { left: o.x + 'px', top: o.y + 'px' });
  tl.fromTo(s.querySelector('.rv'), { drawSVG: '0%' }, { drawSVG: `${o.val}%`, duration: 1.3, ease: 'glide' }, o.at); return s; }
function spark(parent, o) { const pts = o.pts, w = o.w, h = o.h, mx = Math.max(...pts), mn = Math.min(...pts); const P = pts.map((v, i) => [i / (pts.length - 1) * w, h - (v - mn) / ((mx - mn) || 1) * h * .9 - 4]);
  const d = 'M' + P.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L');
  const s = svgIn(parent, w + 10, h + 10, `<defs><linearGradient id="sa${o.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.c || C.lsaff}" stop-opacity=".35"/><stop offset="1" stop-color="${o.c || C.lsaff}" stop-opacity="0"/></linearGradient></defs><path class="ar" d="${d} L${w} ${h} L0 ${h}Z" fill="url(#sa${o.id})"/><path class="ln" d="${d}" stroke="${o.c || C.lsaff}" stroke-width="${o.sw || 3}" stroke-linecap="round" stroke-linejoin="round"/><circle class="ed" cx="${P[P.length - 1][0]}" cy="${P[P.length - 1][1]}" r="6" fill="${C.white}" stroke="${o.c || C.saff}" stroke-width="3"/>`, { left: o.x + 'px', top: o.y + 'px' });
  tl.from(s.querySelector('.ln'), { drawSVG: 0, duration: 1.2, ease: 'glide' }, o.at).from(s.querySelector('.ar'), { opacity: 0, duration: .8 }, o.at + .5).from(s.querySelector('.ed'), { scale: 0, transformOrigin: '50% 50%', duration: .4, ease: 'snap' }, o.at + 1.1); return s; }
function gridLines(parent, w, h, n = 4) { return svgIn(parent, w, h, [...Array(n + 1)].map((_, i) => `<path d="M0 ${(i / n * h).toFixed(1)} H${w}" stroke="rgba(255,255,255,.14)" stroke-dasharray="${i === n ? '0' : '3 5'}"/>`).join('')); }
function check(on = true) { return `<span style="display:inline-flex;width:22px;height:22px;border-radius:50%;align-items:center;justify-content:center;background:${on ? C.saff : 'rgba(255,255,255,.12)'};border:1px solid rgba(255,255,255,.5);box-shadow:${on ? '0 0 14px rgba(217,130,43,.6)' : 'none'}"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3L9.6 3.6" fill="none" stroke="${on ? '#fff' : 'rgba(255,255,255,.4)'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`; }

// ---------------------------------------------------------------- finishing: UI chrome, title card, grain
let TITLE = null, ILLUS = false;
function title(html, kick) { TITLE = { html, kick }; }
function illustrative() { ILLUS = true; }
function finish(n) {
  const NN = String(n).padStart(2, '0');
  const nav = pill(`<span style="font-family:JBM;font-size:12px;letter-spacing:.18em">SAMATWAM</span><span style="width:1px;height:16px;background:rgba(255,255,255,.4)"></span><span style="font-family:JBM;font-size:12px;letter-spacing:.14em;color:rgba(255,255,255,.75)">FRAMES · ${NN} / 18</span>`, { left: '50%', top: '36px', transform: 'translateX(-50%)', zIndex: 40 }, stage, { h: 44, pad: 20, a: .14 });
  tl.from(nav, { opacity: 0, y: -16, duration: .7, ease: 'reveal' }, .05);
  // scrubber: a product-UI progress line with three phase marks
  const sc = el('div', { position: 'absolute', left: '120px', right: '120px', bottom: '44px', height: '2px', background: 'rgba(255,255,255,.22)', zIndex: 40, borderRadius: '1px' });
  const fill = el('div', { width: '0%', height: '100%', background: `linear-gradient(90deg, ${C.lsaff}, ${C.saff})`, boxShadow: `0 0 10px ${C.saff}`, borderRadius: '1px' }, sc);
  [30, 110].forEach(f => el('div', { position: 'absolute', left: (f / 150 * 100) + '%', top: '-4px', width: '1px', height: '10px', background: 'rgba(255,255,255,.55)' }, sc));
  perFrame.push(f => { fill.style.width = ((f + 1) / 150 * 100) + '%'; });
  if (ILLUS) { const t = pill('<span style="font-family:JBM;font-size:11px;letter-spacing:.16em">ILLUSTRATIVE</span>', { right: '120px', top: '38px', zIndex: 40 }, stage, { h: 40, pad: 16, a: .12 }); tl.from(t, { opacity: 0, duration: .5 }, .3); }
  if (TITLE) {
    const card = glass({ left: '96px', bottom: '84px', padding: '26px 34px 28px', zIndex: 30, maxWidth: '1180px' }, stage, '', { r: 30, a: .16 });
    const k = mono(TITLE.kick, { position: 'relative', color: C.lsaff, marginBottom: '10px', zIndex: 2 }, card);
    const h = txt(TITLE.html, { position: 'relative', fontSize: '58px', lineHeight: '64px', whiteSpace: 'normal', letterSpacing: '-.035em', zIndex: 2 }, card);
    const sp = SplitText.create(h, { type: 'lines,words', mask: 'lines' });
    tl.from(card, { y: 60, opacity: 0, scale: .96, transformOrigin: '0 100%', duration: .9, ease: 'reveal' }, 3.5).from(k, { opacity: 0, duration: .5 }, 3.7).from(sp.words, { yPercent: 110, duration: .8, ease: 'reveal', stagger: .035 }, 3.65);
  }
  el('div', { ...full, zIndex: 48, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,.28) 100%)' });
  const gr = el('div', { ...full, zIndex: 49, pointerEvents: 'none', opacity: .06, mixBlendMode: 'overlay' }, stage, `<svg width="${W}" height="${H}"><filter id="gn"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="1"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gn)"/></svg>`);
  const tb = gr.querySelector('feTurbulence'); perFrame.push(f => tb.setAttribute('seed', String(f % 23 + 1)));
}

window.DUR = DUR; window.EV = [];
const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
const ready = (async () => { for (const f of ['500 60px SG', '400 24px SG', 'italic 400 60px PF', '13px JBM']) await document.fonts.load(f); await FR[window.FRAME](); finish(window.FRAME); })();
window.render = async function (t) { await ready; const f = Math.min(Math.round(t * FPS), DUR * FPS - 1); tl.seek(t, false); await Promise.all(perFrame.map(fn => fn(f, t))); await raf(); };
window.READY = true;
