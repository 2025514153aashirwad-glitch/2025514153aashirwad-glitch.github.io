// Samatwam Studio teaser kit · 1920 × 1080 · one typeface (Geist), no italics.
// The desktop here mirrors the Figma templates (file 5gtXXe9mmF4SXNorcQu3xw): glass windows, a bottom taskbar,
// liquid-metal icons and a saffron-to-white field. Every frame is a pure function of time, so renders are exact.
function springEase(stiffness, damping, mass = 1) { const g = MotionLib.spring({ keyframes: [0, 1], stiffness, damping, mass, restDelta: .0005, restSpeed: .001 });
  let T = 0; while (!g.next(T).done && T < 5000) T += 4; const N = 400, tab = [...Array(N + 1)].map((_, i) => g.next(T * i / N).value);
  return p => { if (p <= 0) return 0; if (p >= 1) return 1; const x = p * N, i = Math.floor(x); return tab[i] + (tab[i + 1] - tab[i]) * (x - i); }; }
gsap.registerEase('reveal', springEase(140, 20)); gsap.registerEase('snap', springEase(320, 17)); gsap.registerEase('glide', springEase(90, 19)); gsap.registerEase('drop', springEase(260, 13)); gsap.registerEase('soft', springEase(60, 16));
const W = 1920, H = 1080, stage = document.getElementById('stage');
gsap.defaults({ lazy: false }); const tl = gsap.timeline({ paused: true }), perFrame = [];
const css = document.createElement('style'); css.textContent = `
@font-face{font-family:Geist;src:url(../shared/fonts/Geist-Regular.woff2) format('woff2');font-weight:400}
@font-face{font-family:Geist;src:url(../shared/fonts/Geist-Medium.woff2) format('woff2');font-weight:500}
@font-face{font-family:Geist;src:url(../shared/fonts/Geist-SemiBold.woff2) format('woff2');font-weight:600}
html,body{margin:0;background:#08080A;overflow:hidden}
#stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:Geist;-webkit-font-smoothing:antialiased}
[style*="--b"]{filter:blur(calc(max(0, var(--b)) * 1px))}
.abs{position:absolute}.d{--ink:245,243,238;--glass:255,255,255;--ga:.07;--gs:.16;--edge:255,255,255;--ea:.28;--acc:#F2B766}
.l{--ink:21,23,27;--glass:255,255,255;--ga:.62;--gs:.75;--edge:0,0,0;--ea:.08;--acc:#B5521A}
.win{position:absolute;border-radius:24px;overflow:hidden;background:linear-gradient(100deg,rgba(var(--glass),var(--gs)),rgba(var(--glass),var(--ga)) 45%,rgba(var(--glass),calc(var(--ga) + .03)));
 border:1px solid rgba(var(--edge),var(--ea));backdrop-filter:blur(40px) saturate(1.3);box-shadow:0 30px 80px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.18);color:rgb(var(--ink))}
.l .win{box-shadow:0 30px 80px rgba(80,40,10,.13),inset 0 1px 0 rgba(255,255,255,.9)}
.tb{height:56px;display:flex;align-items:center;gap:10px;padding:0 22px;border-bottom:1px solid rgba(var(--ink),.1);font-weight:500;font-size:15px;letter-spacing:-.01em}
.dot{width:12px;height:12px;border-radius:6px;background:rgba(var(--ink),.5)}.dot+.dot{opacity:.65}.dot+.dot+.dot{opacity:.4}
.t{letter-spacing:-.01em;line-height:1.3}.big{font-weight:600;letter-spacing:-.03em}
.chip{border-radius:18px;background:rgba(var(--glass),calc(var(--ga)*.8));border:1px solid rgba(var(--edge),calc(var(--ea)*.55))}
.l .chip{background:rgba(255,255,255,.7)}
.saff{background:linear-gradient(90deg,#B5521A,#E8963F 55%,#FFF1DE)}
.icon{position:relative;width:64px;height:64px;border-radius:18px;overflow:hidden;flex:none;
 background:linear-gradient(115deg,#F7F8FA 0%,#B9BEC5 42%,#EEF0F2 55%,#7C828A 100%);border:1px solid rgba(255,255,255,.85);box-sizing:border-box;
 box-shadow:0 8px 18px rgba(0,0,0,.35),inset 0 1.5px 0 rgba(255,255,255,.9),inset 0 -3px 5px rgba(0,0,0,.18)}
.icon .sh{position:absolute;inset:-40%;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.85) 50%,transparent 60%);transform:translateX(var(--sx,-120%))}
.icon svg{position:absolute;left:17px;top:17px;width:30px;height:30px}
.bar{position:absolute;display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:30px;
 background:linear-gradient(180deg,rgba(255,255,255,.2),rgba(255,255,255,.07));border:1px solid rgba(255,255,255,.32);backdrop-filter:blur(30px) saturate(1.4);box-shadow:0 20px 50px rgba(0,0,0,.45);color:rgb(var(--ink))}
.l .bar{background:rgba(255,255,255,.62);border-color:rgba(0,0,0,.08);box-shadow:0 20px 50px rgba(80,40,10,.15)}
.sep{width:1px;height:40px;background:rgba(var(--ink),.2)}
`; document.head.appendChild(css);
const el = (tag, cls = '', st = {}, p = stage, html = '') => { const e = document.createElement(tag); if (cls) e.className = cls; Object.assign(e.style, st); if (html) e.innerHTML = html; p.appendChild(e); return e; };
const div = (cls, st, p, html) => el('div', cls, st, p, html);
const GLYPH = { agent: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>', build: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>', research: '<circle cx="12" cy="10" r="6"/><path d="M9 15l-2 6 5-3 5 3-2-6"/>', arena: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>', exchange: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>', ring: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="5.5" r="1.2"/>', files: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>' };
const svgGlyph = (k, col = '#1B1F26', w = 1.7) => `<svg viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${GLYPH[k]}</svg>`;
// ---------- the vector mark as a mask; chrome is a moving gradient behind it, liquid is an animated displacement
let FID = 0;
function liquidFilter() { const id = 'lq' + (FID++); const s = el('div', '', { position: 'absolute', width: 0, height: 0 }, stage,
  `<svg width="0" height="0"><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".008 .012" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></svg>`);
  return { id, turb: s.querySelector('feTurbulence'), disp: s.querySelector('feDisplacementMap') }; }
const CHROME = 'linear-gradient(115deg,#5E636B 0%,#F4F5F7 12%,#9AA0A8 22%,#FFFFFF 30%,#6A7078 40%,#E9EBEE 52%,#8B9199 62%,#FFFFFF 70%,#5E636B 80%,#D9DCE0 90%,#7C828A 100%)';
const GOLD = 'linear-gradient(115deg,#7A3410 0%,#F2B766 14%,#B5521A 26%,#FFF1DE 34%,#9A4512 46%,#F7C98E 58%,#B5521A 68%,#FFF4E6 76%,#7A3410 88%,#E8963F 100%)';
function chromeMark(h, parent = stage, grad = CHROME) { const w = h * 1721 / 2400, f = liquidFilter();
  const wrap = div('abs', { width: w + 'px', height: h + 'px', filter: `url(#${f.id})` }, parent);
  const m = div('abs', { inset: 0, background: grad, backgroundSize: '320% 320%', WebkitMaskImage: 'url(../shared/mark.svg)', WebkitMaskSize: '100% 100%', maskImage: 'url(../shared/mark.svg)', maskSize: '100% 100%' }, wrap);
  return { wrap, m, f, w, h, set(liquid, sheen) { f.disp.setAttribute('scale', String(liquid)); f.turb.setAttribute('baseFrequency', `${.006 + liquid * .00004} ${.01 + liquid * .00005}`); m.style.backgroundPosition = `${sheen * 100}% ${50 + sheen * 30}%`; } }; }
// ---------- desktop
function field(theme, p) { const D = theme === 'd', f = div('abs', { inset: 0, background: D ? '#08080A' : '#FBF8F3', overflow: 'hidden' }, p);
  const g = (x, y, w, h, bg, b) => div('abs', { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: '50%', background: bg, filter: `blur(${b}px)` }, f);
  const glows = D ? [g(-300, 380, 1500, 1000, 'radial-gradient(closest-side,rgba(224,122,42,.85),rgba(181,82,26,.35) 50%,rgba(181,82,26,0))', 100), g(900, -350, 1300, 900, 'radial-gradient(closest-side,rgba(255,241,222,.26),rgba(255,241,222,0))', 120), g(1250, 520, 900, 700, 'radial-gradient(closest-side,rgba(242,183,102,.38),rgba(242,183,102,0))', 100)]
    : [g(-200, 300, 1500, 1100, 'radial-gradient(closest-side,rgba(242,160,75,.75),rgba(247,201,142,.35) 55%,rgba(255,255,255,0))', 110), g(1100, 400, 1100, 900, 'radial-gradient(closest-side,rgba(255,215,166,.55),rgba(255,255,255,0))', 110)];
  return { f, glows }; }
function agentWin(p, x = 120, y = 130) { const w = div('win', { left: x + 'px', top: y + 'px', width: '880px', height: '525px' }, p);
  div('tb', {}, w, '<div class="dot"></div><div class="dot"></div><div class="dot"></div><span style="opacity:.85;margin-left:2px">Samatwam Agent</span>');
  const b = div('abs', { left: '40px', top: '88px', width: '800px' }, w);
  const hi = div('t big', { fontSize: '40px' }, b, 'Good morning, Aish.');
  const sub = div('t', { fontSize: '17px', opacity: .6, marginTop: '22px' }, b, 'Three build records are waiting for review. Cohort 01 closes its sprint on Friday.');
  const ask = div('chip', { marginTop: '22px', height: '68px', display: 'flex', alignItems: 'center', padding: '0 16px 0 20px', gap: '12px', boxSizing: 'border-box' }, b);
  const q = div('t', { fontSize: '16px', opacity: .9, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }, ask, '');
  const go = div('saff', { width: '36px', height: '36px', borderRadius: '18px', display: 'grid', placeItems: 'center' }, ask, '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>');
  const list = div('chip', { marginTop: '22px', overflow: 'hidden' }, b); const rows = [];
  [['Read 14 field notes and 9 photos', 'Done'], ['Compared flow readings with the 2025 baseline', 'Done'], ['Drafting the report for the panchayat', 'Running']].forEach(([s, st], i) => {
    const r = div('', { display: 'flex', alignItems: 'center', gap: '14px', padding: '0 20px', height: '52px', borderTop: i ? '1px solid rgba(var(--ink),.08)' : 'none' }, list);
    div(i === 2 ? 'saff' : '', { width: '10px', height: '10px', borderRadius: '5px', background: i === 2 ? '' : 'rgba(var(--ink),.35)' }, r);
    div('t', { fontSize: '15px', opacity: .85, flex: 1 }, r, s); const c = div('t', { fontSize: '13px', fontWeight: 500, color: i === 2 ? 'var(--acc)' : 'rgba(var(--ink),.45)' }, r, st); rows.push(r); });
  const pb = div('', { marginTop: '22px', height: '4px', borderRadius: '2px', background: 'rgba(var(--ink),.1)', overflow: 'hidden' }, b); const pf = div('saff', { height: '4px', width: '62%', borderRadius: '2px' }, pb);
  return { w, hi, sub, ask, q, go, rows, pf }; }
function buildWin(p, x = 1100, y = 220) { const w = div('win', { left: x + 'px', top: y + 'px', width: '700px', height: '489px' }, p);
  div('tb', {}, w, '<div class="dot"></div><div class="dot"></div><div class="dot"></div><span style="opacity:.85;margin-left:2px">Build Record</span>');
  const b = div('abs', { left: '36px', top: '84px', width: '628px' }, w);
  div('t', { fontSize: '13px', fontWeight: 500, letterSpacing: '.04em', color: 'var(--acc)' }, b, 'BR-0142 · Hardware');
  div('t big', { fontSize: '30px', marginTop: '18px' }, b, 'Solar drip controller, revision C');
  const st = div('', { display: 'flex', gap: '12px', marginTop: '18px' }, b); const nums = [];
  [['312', 'Field hours'], ['41 / 44', 'Tests passed'], ['3', 'Reviewers']].forEach(([v, k]) => { const c = div('chip', { flex: 1, padding: '18px', borderRadius: '16px' }, st); nums.push(div('t big', { fontSize: '28px' }, c, v)); div('t', { fontSize: '13px', opacity: .55, marginTop: '6px' }, c, k); });
  const tlw = div('', { marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }, b); const ev = [];
  [['Prototype soldered and logged', 'Mon 09:12'], ['Moisture sensor calibrated in Bisahda', 'Tue 16:40'], ['Peer review requested', 'Today 08:55']].forEach(([s, t]) => { const r = div('', { display: 'flex', alignItems: 'center', gap: '12px' }, tlw); div('saff', { width: '3px', height: '18px', borderRadius: '2px' }, r); div('t', { fontSize: '15px', opacity: .85, flex: 1 }, r, s); div('t', { fontSize: '13px', opacity: .45 }, r, t); ev.push(r); });
  const bt = div('', { display: 'flex', gap: '10px', marginTop: '26px' }, b);
  const ok = div('saff t', { padding: '12px 22px', borderRadius: '999px', fontSize: '15px', fontWeight: 500, color: '#fff' }, bt, 'Approve record');
  div('chip t', { padding: '12px 22px', borderRadius: '999px', fontSize: '15px', fontWeight: 500, opacity: .9 }, bt, 'Ask a question');
  return { w, nums, ev, ok }; }
function launcherTile(p) { const t = div('icon', { background: 'linear-gradient(180deg,#9A4512,#D9822B 45%,#F2B766 80%,#FFF4E6)', border: '1px solid rgba(255,255,255,.6)' }, p);
  div('abs', { left: '18px', top: '12px', width: '28px', height: '40px', background: '#fff', WebkitMaskImage: 'url(../shared/mark.svg)', WebkitMaskSize: '100% 100%' }, t); div('sh', {}, t); return t; }
function taskbar(p) { const b = div('bar', {}, p); const L = launcherTile(b); div('sep', {}, b); const icons = {};
  for (const k of Object.keys(GLYPH)) { const i = div('icon', {}, b, svgGlyph(k)); div('sh', {}, i); icons[k] = i; }
  div('sep', {}, b); const c = div('', { padding: '0 8px 0 6px' }, b, '<div class="t" style="font-size:20px;font-weight:500">09:41</div><div class="t" style="font-size:11px;opacity:.6;margin-top:2px">Cohort 01 · Delhi NCR</div>');
  const w = 18 * 2 + 64 * 8 + 14 * 10 + 2 + 150; b.style.left = Math.round((W - b.offsetWidth) / 2) + 'px'; b.style.top = (H - 92 - 28) + 'px';
  return { b, L, icons, clock: c }; }
function sheen(nodes, t, t0, dur = .9, gap = .06) { nodes.forEach((n, i) => { const p = gsap.utils.clamp(0, 1, (t - t0 - i * gap) / dur); n.querySelector('.sh').style.setProperty('--sx', (-120 + 240 * p) + '%'); }); }
function desktop(theme, p = stage) { const root = div(theme, { position: 'absolute', inset: 0 }, p); const fl = field(theme, root); const a = agentWin(root), bw = buildWin(root), tb = taskbar(root); return { root, field: fl, a, bw, tb }; }
const ramp = (t, a, b) => gsap.utils.clamp(0, 1, (t - a) / (b - a)); const smooth = x => x * x * (3 - 2 * x);
// ---------- render hooks
window.DUR = 8;
const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
window.STUDIO = fn => { const ready = (async () => { for (const f of ['400 20px Geist', '500 20px Geist', '600 40px Geist']) await document.fonts.load(f); await new Promise(r => { const i = new Image(); i.onload = r; i.onerror = r; i.src = '../shared/mark.svg'; }); await fn(); })();
  window.render = async t => { await ready; tl.seek(t, false); perFrame.forEach(f => f(t)); await raf(); }; window.READY = true; };
