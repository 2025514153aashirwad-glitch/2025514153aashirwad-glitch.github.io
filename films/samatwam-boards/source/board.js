// Samatwam motion-system boards. A 4 × 2 grid of dark tiles; each tile is one real interface state in motion.
const BG = '#050608', TILE = '#0D0E11', MUTE = 'rgba(255,255,255,.42)', LINE = 'rgba(255,255,255,.07)';
const BLUE = ['#9A4512', '#D9822B', '#F2B766', '#FFE9CF'], WARM = '#FFFFFF';  // Samatwam saffron to white (name kept for the board configs)
const GOLD = ['#7A5A1E', '#B08D3C', '#E9D49A', '#F6E7BF'];
const ICONS = {
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.6 2.6L16 9.6"/>',
  pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  move: '<path d="M12 3v18M3 12h18M7 7l-4 5 4 5M17 7l4 5-4 5"/>',
  temp: '<path d="M10 4a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/><path d="M12 9v6"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  loop: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/>',
  seal: '<circle cx="12" cy="10" r="6"/><path d="M9 15l-2 6 5-3 5 3-2-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
  people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 20a4 4 0 0 1 7-2.6"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
};
const LOGO = (s) => `<img src="../shared/mark-sun.png" style="height:${s}px;width:auto;filter:brightness(0) invert(1);display:block">`;
const icon = (n, s = 28, c = '#fff', w = 1.6) => n === 'spark' ? LOGO(s * 1.1) : `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;

// ---------------------------------------------------------------- tiles
function tile(i, name) { const c = i % 4, r = Math.floor(i / 4); const x = 104 + c * 434, y = 96 + r * 456;
  const t = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: '410px', height: '432px', borderRadius: '22px', background: TILE, border: `1px solid ${LINE}`, overflow: 'hidden', zIndex: 2 });
  label(name, { left: '22px', top: '20px', fontSize: '12px', letterSpacing: '.14em', color: MUTE, fontWeight: 500 }, t);
  tl.from(t, { opacity: 0, y: 26, scale: .97, duration: .8, ease: 'reveal' }, .08 + (c + r * 2) * .07); return t; }
const at0 = i => .55 + i * .08;

// a state ring: a conic light travelling round a ring, breathing; mode changes its behaviour
function T_ring(t, o, i) { const box = el('div', { position: 'absolute', left: '75px', top: '86px', width: '260px', height: '260px' }, t);
  const glow = el('div', { position: 'absolute', inset: '-30px', borderRadius: '50%', background: `radial-gradient(circle, rgba(217,130,43,0) 45%, rgba(217,130,43,.3) 58%, rgba(217,130,43,0) 72%)`, filter: 'blur(10px)' }, box);
  const ring = el('div', { position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from 0deg, rgba(217,130,43,0), ${o.c[1]} 40%, ${o.c[3]} 55%, rgba(217,130,43,0) 80%)`, webkitMask: 'radial-gradient(circle, transparent 60%, #000 61%, #000 66%, transparent 67%)', mask: 'radial-gradient(circle, transparent 60%, #000 61%, #000 66%, transparent 67%)' }, box);
  const faint = el('div', { position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,.08)' }, box);
  const lab = label(o.state[0], { left: 0, right: 0, top: '120px', textAlign: 'center', fontSize: '12px', letterSpacing: '.18em', color: 'rgba(255,255,255,.7)' }, box);
  if (o.mode === 'hub') for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; el('div', { position: 'absolute', left: (130 + Math.cos(a) * 92 - 4) + 'px', top: (130 + Math.sin(a) * 92 - 4) + 'px', width: '8px', height: '8px', borderRadius: '50%', background: k % 2 ? o.c[3] : 'rgba(255,255,255,.35)' }, box); }
  if (o.mode === 'seal') el('div', { position: 'absolute', inset: '70px', borderRadius: '50%', border: `1px solid ${o.c[2]}`, opacity: .6 }, box);
  tl.from(box, { scale: .6, opacity: 0, duration: 1, ease: 'reveal' }, at0(i));
  const st = o.state; perFrame.push((f, t2) => { const sp = o.mode === 'scan' ? 260 : 120; ring.style.transform = `rotate(${t2 * sp}deg)`; const br = 1 + Math.sin(t2 * (o.mode === 'listen' ? 5 : 2.4)) * .025; box.style.transform = `scale(${br})`; glow.style.opacity = .55 + .45 * Math.sin(t2 * 2.4);
    const k = Math.min(st.length - 1, Math.max(0, Math.floor((t2 - 1.1) / 1.4))); lab.textContent = st[k]; }); }
// a gradient card with a glass pill: the one bright surface in the board
function T_card(t, o, i) { const c = el('div', { position: 'absolute', left: '18px', top: '52px', right: '18px', bottom: '18px', borderRadius: '16px', background: `linear-gradient(180deg, ${o.c[0]} 0%, ${o.c[1]} 38%, ${o.c[3]} 78%, ${o.warm || WARM} 100%)` }, t);
  const hold = el('div', { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }, c); const p = pill(`${icon(o.icon, 20, '#fff', 1.8)}<span class="pl" style="font-size:20px;color:#fff"></span>`, { position: 'relative' }, hold, { h: 54, pad: 22, a: .22 });
  const pl = p.querySelector('.pl'); tl.from(c, { opacity: 0, duration: .8 }, at0(i)).from(p, { scale: .8, opacity: 0, duration: .7, ease: 'snap' }, at0(i) + .4);
  const seq = o.texts; perFrame.push((f, t2) => { const k = Math.min(seq.length - 1, Math.max(0, Math.floor((t2 - 1.1) / 1.4))); pl.textContent = seq[k]; });
  const sh = el('div', { position: 'absolute', top: 0, bottom: 0, width: '35%', left: '-40%', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.28), rgba(255,255,255,0))', transform: 'skewX(-18deg)' }, c); tl.to(sh, { left: '130%', duration: 1.6, ease: 'glide' }, 2.4); }
// iconography: a vertical set that appears, then the active one lights
function T_icons(t, o, i) { o.list.forEach((n, k) => { const d = el('div', { position: 'absolute', left: '183px', top: (118 + k * 84) + 'px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }, t, icon(n, 30, 'rgba(255,255,255,.85)'));
    tl.from(d, { scale: 0, opacity: 0, duration: .5, ease: 'snap' }, at0(i) + k * .15).to(d, { background: 'rgba(217,130,43,.25)', boxShadow: `0 0 0 1px ${o.c[2]}`, duration: .3 }, 2.2 + k * .9).to(d, { background: 'rgba(217,130,43,0)', boxShadow: '0 0 0 0px transparent', duration: .3 }, 3.0 + k * .9); }); }
// input or signal bars: an icon, a gradient capsule that fills, small trailing marks
function T_bars(t, o, i) { o.rows.forEach(([ic, val, lab], k) => { const y = 120 + k * 76;
    el('div', { position: 'absolute', left: '28px', top: (y + 6) + 'px' }, t, icon(ic, 24, 'rgba(255,255,255,.75)'));
    const tr = el('div', { position: 'absolute', left: '68px', top: y + 'px', width: '250px', height: '36px', borderRadius: '18px', background: 'rgba(255,255,255,.05)' }, t);
    const b = el('div', { width: (val * 100) + '%', height: '100%', borderRadius: '18px', background: `linear-gradient(90deg, ${o.c[0]}, ${o.c[2]})`, boxShadow: `0 0 18px ${o.c[1]}55`, transformOrigin: '0 50%' }, tr);
    tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'glide' }, at0(i) + .3 + k * .18);
    if (o.live) perFrame.push((f, t2) => { b.style.width = (val * 100 * (.85 + .15 * Math.sin(t2 * 6 + k * 2))) + '%'; });
    label(lab, { left: '330px', top: (y + 10) + 'px', fontSize: '12px', color: 'rgba(255,255,255,.6)', letterSpacing: '.06em' }, t); }); }
// motion curves on a fine grid; dots travel each curve
function T_curves(t, o, i) { const s = svgIn(t, 410, 432, [...Array(9)].map((_, k) => `<path d="M${40 + k * 41} 90 V380" stroke="rgba(255,255,255,.05)"/>`).join('') + [...Array(8)].map((_, k) => `<path d="M40 ${90 + k * 41} H368" stroke="rgba(255,255,255,.05)"/>`).join('') + o.paths.map((d, k) => `<path id="cv${i}_${k}" class="cv" d="${d}" stroke="${k === o.paths.length - 1 ? o.c[3] : o.c[1]}" stroke-width="${k === o.paths.length - 1 ? 2.2 : 1.4}" opacity="${k === o.paths.length - 1 ? 1 : .55}"/>`).join('') + o.paths.map((_, k) => `<circle class="dt" r="4" fill="#fff"/>`).join(''), {});
  tl.from(s.querySelectorAll('.cv'), { drawSVG: 0, duration: 1.4, ease: 'glide', stagger: .1 }, at0(i));
  s.querySelectorAll('.dt').forEach((d, k) => tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: .2 }, 2.0 + k * .12).to(d, { motionPath: { path: `#cv${i}_${k}`, align: `#cv${i}_${k}`, alignOrigin: [.5, .5] }, duration: 2.2, ease: 'power2.inOut' }, 2.0 + k * .12)); }
// a colour token: the gradient, a dotted guide, a dot that travels it
function T_color(t, o, i) { const c = el('div', { position: 'absolute', left: '58px', top: '84px', right: '58px', bottom: '58px', borderRadius: '10px', background: `linear-gradient(180deg, #FFFFFF 0%, ${o.c[3]} 22%, ${o.c[2]} 48%, ${o.c[1]} 72%, ${o.c[0]} 100%)` }, t);
  const g = svgIn(c, 294, 290, `<path d="M147 0 V290" stroke="rgba(255,255,255,.45)" stroke-dasharray="2 6"/>`); const d = el('div', { position: 'absolute', left: '142px', top: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 12px #fff' }, c);
  tl.from(c, { opacity: 0, scaleY: .3, transformOrigin: '50% 100%', duration: 1, ease: 'reveal' }, at0(i)).fromTo(d, { top: 4 }, { top: 276, duration: 3, ease: 'sine.inOut' }, 1.8);
  label(o.hex, { left: '14px', bottom: '12px', fontSize: '12px', color: 'rgba(255,255,255,.85)' }, c); }
// one large number, counting
function T_stat(t, o, i) { const n = txt('0', { left: '28px', top: '150px', fontSize: '96px', letterSpacing: '-.05em', color: '#fff' }, t); count(n, o.v, at0(i) + .3, 1.6, o.fmt);
  label(o.unit, { left: '32px', top: '270px', fontSize: '13px', color: 'rgba(255,255,255,.6)' }, t); tl.from(n, { opacity: 0, duration: .4 }, at0(i) + .3); }
// an almost empty tile: a crosshair and one living dot
function T_dot(t, o, i) { const d = el('div', { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', filter: `drop-shadow(0 0 10px ${o.c[1]})` }, t, LOGO(46));
  perFrame.push((f, t2) => { d.style.opacity = (.35 + .65 * (Math.sin(t2 * 3.2) * .5 + .5)).toFixed(2); }); }
const TILES = { ring: T_ring, card: T_card, icons: T_icons, bars: T_bars, curves: T_curves, color: T_color, stat: T_stat, dot: T_dot };

// ---------------------------------------------------------------- the five boards
const ease = (k) => `M40 ${380 - k * 8} C ${150 + k * 20} ${380 - k * 8}, ${200 - k * 10} 100, 368 ${92 + k * 6}`;
const BOARDS = {
  1: { title: 'Samatwam Agent', c: BLUE, tiles: [
    ['ring', 'State', { mode: 'listen', state: ['LISTENING', 'THINKING', 'ANSWERING'] }], ['card', 'Agent', { icon: 'spark', texts: ['Ask Samatwam', 'Thinking…', 'Here is a plan'] }],
    ['icons', 'Iconography', { list: ['mic', 'spark', 'check'] }], ['dot', 'Idle', {}],
    ['bars', 'Input', { rows: [['mic', .72, 'Voice'], ['doc', .48, 'Text'], ['cube', .3, 'Sketch']] }], ['curves', 'Motion', { paths: [0, 1, 2, 3].map(ease) }],
    ['color', 'Colour', { hex: 'Samatwam saffron · #D9822B' }], ['stat', 'On device', { v: 120, fmt: v => Math.round(v) + ' ms', unit: 'To first word, no cloud' }]] },
  2: { title: 'Ring · W1', c: BLUE, tiles: [
    ['ring', 'Pairing', { mode: 'ring', state: ['SEARCHING', 'PAIRED', 'SENSING'] }], ['card', 'Device', { icon: 'target', texts: ['Samatwam Ring', 'Paired', 'Sensing'] }],
    ['icons', 'Sensors', { list: ['pulse', 'move', 'temp'] }], ['stat', 'Battery', { v: 7, fmt: v => Math.round(v) + ' days', unit: 'Target, not measured' }],
    ['bars', 'Signals', { live: true, rows: [['pulse', .64, 'Grip'], ['move', .82, 'Motion'], ['temp', .4, 'Temp']] }], ['curves', 'Strain', { paths: [`M40 330 C 120 320, 160 260, 220 240 S 320 150, 368 120`, `M40 340 C 140 330, 200 300, 368 220`] }],
    ['color', 'Colour', { hex: 'Signal saffron · #F2B766' }], ['dot', 'Live', {}]] },
  3: { title: 'Simulation Arena', c: BLUE, tiles: [
    ['ring', 'Training', { mode: 'scan', state: ['RUN A', 'RUN B', 'RUN C'] }], ['card', 'Run', { icon: 'loop', texts: ['Run 1 of 3', 'Run 2 of 3', 'Run 3 of 3'] }],
    ['icons', 'Stages', { list: ['cube', 'loop', 'check'] }], ['stat', 'Episodes', { v: 4800, fmt: v => Math.round(v).toLocaleString('en-IN'), unit: 'Simulated grasps · illustrative' }],
    ['bars', 'Runs', { rows: [['loop', .92, 'A'], ['loop', .74, 'B'], ['loop', .58, 'C']] }], ['curves', 'Error', { paths: [0, 1, 2].map(k => `M40 ${110 + k * 30} C 120 ${300 - k * 10}, 220 ${350 - k * 4}, 368 362`) }],
    ['color', 'Colour', { hex: 'Arena saffron · #9A4512' }], ['dot', 'Converged', {}]] },
  4: { title: 'Open Research', c: BLUE, gold: true, tiles: [
    ['ring', 'Seal', { mode: 'seal', state: ['CLAIMED', 'TESTED', 'CERTIFIED'] }], ['card', 'Claim', { icon: 'seal', texts: ['Claim filed', 'Proof reproduced', 'Claim sealed'], gold: true }],
    ['icons', 'Path', { list: ['doc', 'flask', 'seal'] }], ['stat', 'Claims', { v: 2, fmt: v => Math.round(v) + ' / 3', unit: 'Passed · example' }],
    ['bars', 'Evidence', { rows: [['flask', .9, 'Test'], ['doc', .7, 'Data'], ['people', .5, 'Review']] }], ['curves', 'Motion', { paths: [0, 1, 2].map(ease) }],
    ['color', 'Colour', { hex: 'Proof gold · held work only', gold: true }], ['dot', 'Pending', {}]] },
  5: { title: 'Requirement Exchange', c: BLUE, tiles: [
    ['ring', 'Routing', { mode: 'hub', state: ['POSTED', 'MATCHING', 'ROUTED'] }], ['card', 'Request', { icon: 'route', texts: ['Request posted', 'Matching…', 'Routed to 3'] }],
    ['icons', 'Flow', { list: ['pin', 'people', 'bolt'] }], ['stat', 'Due', { v: 14, fmt: v => Math.round(v) + ' days', unit: 'REQ-0081 · example' }],
    ['bars', 'Match', { rows: [['people', .88, 'A'], ['people', .76, 'D'], ['people', .69, 'K']] }], ['curves', 'Routes', { paths: [`M40 230 C 140 230, 200 120, 368 110`, `M40 230 C 160 230, 220 230, 368 230`, `M40 230 C 140 230, 200 340, 368 350`] }],
    ['color', 'Colour', { hex: 'Exchange saffron · #D9822B' }], ['dot', 'Waiting', {}]] },
};
async function BOARD(n) {
  const B = BOARDS[n]; el('div', { ...full, background: BG });
  const head = label(`Samatwam · ${B.title}`, { left: '104px', top: '46px', fontSize: '13px', letterSpacing: '.16em', color: 'rgba(255,255,255,.6)', zIndex: 3 }); tl.from(head, { opacity: 0, duration: .6 }, 0);
  const sys = label('Motion system · concept', { right: '104px', top: '46px', fontSize: '13px', letterSpacing: '.16em', color: 'rgba(255,255,255,.35)', zIndex: 3 }); tl.from(sys, { opacity: 0, duration: .6 }, .1);
  B.tiles.forEach(([type, name, o], i) => { const t = tile(i, name); const c = (o.gold || (type === 'card' && o.gold)) ? GOLD : B.c; TILES[type](t, { ...o, c, warm: o.gold ? '#FFF3D6' : WARM }, i); });
  // a slow push across the board, like a camera on a design sheet
  const all = [...stage.children].filter(e => e.style.zIndex === '2'); const wrap = el('div', { ...full, zIndex: 2 }); all.forEach(e => wrap.appendChild(e));
  tl.fromTo(wrap, { scale: 1.0 }, { scale: 1.035, transformOrigin: '50% 50%', duration: DUR, ease: 'none' }, 0);
}
