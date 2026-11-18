// Samatwam Frames · 18 scenes. Beat A (0–2.2 s) footage and kinetic type, transition, beat B (2.2–3.5 s) the idea as a live UI, hold (3.5–5 s) on the title card.
const FR = {};
const em = s => `<i class="em">${s}</i>`;
const chipCss = { fontFamily: 'JBM', fontSize: '12px', letterSpacing: '.14em', textTransform: 'uppercase' };

// F01 · To think is the real skill
FR[1] = () => {
  foot(47903, { zoom: [1.15, 1.02] }); const B = foot(50116, { z: 1, zoom: [1.1, 1.0] }); glassWipe(B, 2.1);
  kicker('Core belief', { at: .1, out: 2.0 }); head('Tools change.', { t: 170, s: 128, out: 1.95 });
  const tools = ['CAD', 'FEA', 'CFD', 'LLM', 'Simulation'];
  tools.forEach((t, i) => { const p = pill(`<span style="${'font-family:JBM;font-size:14px;letter-spacing:.16em'}">${t}</span>`, { left: (1280 + (i % 2) * 210) + 'px', top: (170 + i * 92) + 'px', zIndex: 12 }, stage, { h: 58, a: .16 });
    tl.from(p, { x: 80, opacity: 0, duration: .7, ease: 'reveal' }, .4 + i * .08).to(p, { filter: 'blur(8px)', opacity: .5, duration: .6 }, 1.3 + i * .05).to(p, { opacity: 0, duration: .3 }, 2.0); });
  head(`Thinking ${em('stays.')}`, { t: 170, s: 112, at: 2.55, z: 12 });
  const card = glass({ ...box(1060, 150, 740, 470), zIndex: 12 }, stage, '', { r: 30 });
  mono('Where the skill sits', { left: '34px', top: '30px', zIndex: 2 }, card);
  const s = svgIn(card, 740, 470, tools.map((t, i) => `<path class="cv" d="M190 ${110 + i * 66} C 360 ${110 + i * 66}, 420 245, 560 245" stroke="rgba(255,255,255,.55)" stroke-width="1.6"/>`).join('') + `<circle cx="560" cy="245" r="10" fill="${C.saff}"/>`);
  tools.forEach((t, i) => { const c = metal({ left: '34px', top: (88 + i * 66) + 'px', width: '150px', height: '44px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...chipCss, zIndex: 2 }, card, t); tl.from(c, { x: -30, opacity: 0, duration: .5, ease: 'reveal' }, 2.6 + i * .06); });
  tl.from(s.querySelectorAll('.cv'), { drawSVG: 0, duration: .8, ease: 'glide', stagger: .05 }, 2.8);
  const d = pill(`<span style="font-size:26px">Decide</span>`, { left: '520px', top: '212px', zIndex: 3 }, card, { h: 66, glow: true, a: .3 }); tl.from(d, { scale: .6, opacity: 0, duration: .6, ease: 'snap' }, 3.3);
  tl.from(card, { y: 40, opacity: 0, duration: .9, ease: 'reveal' }, 2.4);
  title(`To ${em('think')} is the real skill.`, 'F01 · Samatwam believes');
};

// F02 · The full bandwidth
FR[2] = () => {
  foot(23511, { zoom: [1.12, 1.0], pan: [20, -20] }); const B = foot(46748, { z: 1 }); glassWipe(B, 2.0);
  kicker('The full bandwidth', { out: 1.9 }); head(`From an ${em('idea')}<br>to reality.`, { t: 170, s: 110, out: 1.85, w: 1100 });
  const st = ['Idea', 'Research', 'Engineering proof', 'Governing framework', 'Interface & market', 'Recalibration'];
  const bar = glass({ ...box(120, 250, 1680, 300), zIndex: 12 }, stage, '', { r: 34 }); tl.from(bar, { y: 50, opacity: 0, duration: .9, ease: 'reveal' }, 2.3);
  mono('Six layers · one builder sees all of them', { left: '40px', top: '32px', zIndex: 2 }, bar);
  const track = el('div', { position: 'absolute', left: '90px', right: '90px', top: '146px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,.2)', zIndex: 2 }, bar);
  const fl = el('div', { width: '100%', height: '100%', borderRadius: '2px', background: `linear-gradient(90deg, ${C.lsaff}, ${C.saff})`, boxShadow: `0 0 12px ${C.saff}`, transformOrigin: '0 50%' }, track);
  tl.fromTo(fl, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'glide' }, 2.6);
  st.forEach((s, i) => { const x = 90 + i * (1500 / 5);
    const k = metal({ left: (x - 26) + 'px', top: '122px', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JBM', fontSize: '14px', zIndex: 3 }, bar, String(i + 1).padStart(2, '0'));
    const lb = txt(s, { left: (x - 120) + 'px', width: '240px', textAlign: 'center', top: '196px', fontSize: '24px', whiteSpace: 'normal', lineHeight: '28px', zIndex: 3 }, bar);
    const t0 = 2.6 + i * .25; tl.from([k, lb], { y: 16, opacity: 0, duration: .5, ease: 'reveal' }, 2.45 + i * .05).to(k, { background: metalBg('dark'), color: C.lsaff, boxShadow: `0 0 0 2px ${C.saff}, 0 0 22px rgba(217,130,43,.7)`, duration: .2 }, t0 + .1); });
  const loop = svgIn(bar, 1680, 300, `<path class="lp" d="M1590 236 C 1590 290, 90 290, 90 236" stroke="${C.lsaff}" stroke-width="1.6" stroke-dasharray="4 7"/>`); tl.from(loop.querySelector('.lp'), { drawSVG: 0, duration: .9, ease: 'glide' }, 3.9);
  title(`Six layers between an idea and ${em('reality.')}`, 'F02 · The full bandwidth');
};

// F03 · The womb
FR[3] = () => {
  foot(47263, { zoom: [1.2, 1.02], grade: 'saturate(.85) contrast(1.08) brightness(.8)' });
  kicker('How Samatwam grows', { out: 2.0 }); head(`Placed ${em('today.')}`, { t: 170, s: 128, out: 1.9 });
  head(`Grown with<br>the ${em('field.')}`, { t: 170, s: 88, at: 2.2, w: 820 });
  const card = glass({ ...box(1000, 140, 800, 560), zIndex: 12 }, stage, '', { r: 32 }); tl.from(card, { x: 60, opacity: 0, duration: .9, ease: 'reveal' }, .7);
  mono('Classes · 06', { left: '34px', top: '30px', zIndex: 2 }, card); const tot = txt('0', { right: '34px', top: '22px', fontSize: '44px', zIndex: 2, fontVariantNumeric: 'tabular-nums' }, card); mono('Features grown', { right: '34px', top: '76px', zIndex: 2, color: C.lsaff }, card);
  count(tot, 24, 2.3, 1.6);
  const feats = [5, 3, 4, 6, 2, 4];
  feats.forEach((n, i) => { const x = 34 + (i % 3) * 248, y = 130 + Math.floor(i / 3) * 200;
    const t = glass({ ...box(x, y, 228, 180), zIndex: 2 }, card, '', { r: 22, a: .12, blur: 10 });
    const hx = metal({ left: '20px', top: '20px', width: '54px', height: '54px', clipPath: i === 5 ? 'polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)' : 'polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)', borderRadius: 0 }, t);
    txt(['Build', 'Open Research', 'Simulation', 'Physical AI', 'Creative', 'Data'][i], { left: '20px', top: '88px', fontSize: '22px', zIndex: 2 }, t);
    const dots = el('div', { position: 'absolute', left: '20px', top: '134px', display: 'flex', gap: '6px', zIndex: 2 }, t);
    for (let k = 0; k < n; k++) { const d = el('span', { width: '18px', height: '18px', borderRadius: '6px', background: C.saff, boxShadow: '0 0 10px rgba(217,130,43,.6)' }, dots); tl.from(d, { scale: 0, duration: .35, ease: 'snap' }, 2.4 + k * .18 + i * .05); }
    tl.from(t, { y: 30, opacity: 0, duration: .6, ease: 'reveal' }, .9 + i * .07); });
  illustrative();
  title(`Classes placed today. Features ${em('grown')} with the field.`, 'F03 · The womb');
};

// F04 · Claim card and SAMT ticket
FR[4] = async () => {
  foot(22957, { zoom: [1.1, 1.0], grade: 'saturate(.85) contrast(1.05) brightness(.75)' });
  kicker('Every builder carries one', { out: 2.0 }); head(`Your ${em('claim,')}<br>on the record.`, { t: 170, s: 104, out: 1.95 });
  const sc = el('div', { ...full, perspective: '1600px', zIndex: 12 });
  const card = glass({ ...box(980, 170, 780, 470) }, sc, '', { r: 36, a: .22 });
  gsap.set(card, { rotateY: -24, rotateX: 8 }); tl.from(card, { x: 400, opacity: 0, duration: 1.1, ease: 'reveal' }, .5).to(card, { rotateY: 0, rotateX: 0, duration: 1.6, ease: 'glide' }, 1.2);
  const sheen = el('div', { position: 'absolute', top: '-20%', left: '-60%', width: '40%', height: '140%', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))', transform: 'rotate(18deg)', zIndex: 3 }, card);
  tl.to(sheen, { left: '130%', duration: 1.2, ease: 'glide' }, 2.0);
  metal({ left: '44px', top: '50px', width: '74px', height: '56px', borderRadius: '10px', zIndex: 2 }, card, '', 'silver');
  mono('Claim', { left: '140px', top: '52px', zIndex: 2 }, card); txt('SAMT01/001', { left: '138px', top: '72px', fontSize: '34px', zIndex: 2, letterSpacing: '0', fontFamily: 'JBM', fontWeight: 400 }, card);
  const qrSvg = await (await fetch('../shared/qr.svg')).text();
  const qr = el('div', { position: 'absolute', right: '44px', top: '44px', width: '136px', height: '136px', padding: '10px', background: '#fff', borderRadius: '14px', zIndex: 2 }, card, qrSvg.replace(/#ECE8DF/gi, '#0B1020')); qr.querySelector('svg').setAttribute('width', 136); qr.querySelector('svg').setAttribute('height', 136);
  qr.querySelectorAll('path').forEach(p => { if (p.getAttribute('stroke')) p.setAttribute('stroke', '#0B1020'); if (p.getAttribute('fill') && p.getAttribute('fill') !== 'none' && !/0000/.test(p.getAttribute('fill'))) p.setAttribute('fill', '#0B1020'); });
  const cl = txt('', { left: '44px', top: '230px', width: '690px', fontSize: '40px', lineHeight: '48px', whiteSpace: 'normal', zIndex: 2 }, card); typer(cl, 'Bracket holds 2 kN at 40% less mass.', 2.0, 1.2);
  mono('Builder · A. Learner', { left: '44px', bottom: '40px', zIndex: 2 }, card);
  const stages = ['Claimed', 'Tested', 'Certified', 'Held'];
  stages.forEach((s, i) => { const p = pill(`${i === 0 ? '<span style="width:8px;height:8px;border-radius:50%;background:#fff"></span>' : ''}<span style="font-family:JBM;font-size:12px;letter-spacing:.14em;text-transform:uppercase">${s}</span>`, { left: (980 + i * 196) + 'px', top: '668px', zIndex: 12, ...(i === 0 ? { background: `linear-gradient(180deg, ${C.lsaff}, ${C.saff})`, color: C.ink } : { opacity: .7 }) }, stage, { h: 46, pad: 18, glow: i === 0, a: .12 });
    tl.from(p, { y: 20, opacity: 0, duration: .5, ease: 'reveal' }, 2.9 + i * .08); });
  illustrative();
  title(`Claim · ${em('SAMT01/001')}`, 'F04 · Claim card and SAMT ticket');
};

// F05 · Three interface layers
FR[5] = () => {
  foot(23107, { zoom: [1.12, 1.0] }); const B = foot(48165, { z: 1 }); glassWipe(B, 1.9);
  kicker('Three interface layers', { out: 1.8 }); head(`One platform.<br>Three ${em('languages.')}`, { t: 170, s: 104, out: 1.75 });
  const defs = [['Individual', 'Generative'], ['Authority', 'Sustainative'], ['Institutional', 'Transmittive']];
  defs.forEach(([a, b], i) => { const c = glass({ ...box(120 + i * 570, 150, 540, 520), zIndex: 12 }, stage, '', { r: 30 });
    tl.from(c, { y: 80, opacity: 0, rotateX: 25, transformPerspective: 1200, duration: .9, ease: 'reveal' }, 2.25 + i * .14);
    mono(a, { left: '32px', top: '30px', zIndex: 2 }, c); txt(b, { left: '30px', top: '56px', fontSize: '44px', zIndex: 2 }, c);
    const tabs = [['Learner', 'Builder', 'Researcher'], ['Reviewer', 'Mentor', 'Steward'], ['School', 'Industry', 'Government']][i];
    tabs.forEach((t, j) => metal({ left: (32 + j * 158) + 'px', top: '128px', width: '146px', height: '38px', borderRadius: '19px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...chipCss, fontSize: '11px', zIndex: 2 }, c, t, j ? 'silver' : 'dark'));
    const area = el('div', { position: 'absolute', left: '32px', top: '200px', width: '476px', height: '280px', zIndex: 2 }, c);
    if (i === 0) { gridLines(area, 476, 260); [38, 62, 50, 84, 70, 110, 96, 140].forEach((v, k) => { const b = el('div', { position: 'absolute', left: (k * 60) + 'px', bottom: '20px', width: '40px', height: (v * 1.6) + 'px', borderRadius: '10px 10px 4px 4px', background: k === 7 ? `linear-gradient(180deg, ${C.lsaff}, ${C.saff})` : 'rgba(255,255,255,.55)', transformOrigin: '50% 100%' }, area); tl.from(b, { scaleY: 0, duration: .7, ease: 'snap' }, 2.6 + k * .06); }); }
    if (i === 1) { gridLines(area, 476, 260); el('div', { position: 'absolute', left: 0, right: 0, top: '96px', height: '60px', background: 'rgba(242,183,102,.16)', borderTop: '1px dashed rgba(242,183,102,.6)', borderBottom: '1px dashed rgba(242,183,102,.6)' }, area); spark(area, { id: 'f5', x: 0, y: 70, w: 466, h: 110, pts: [60, 20, 80, 40, 66, 48, 58, 52, 56, 54, 55, 55, 55], at: 2.75 }); mono('Holding level', { left: 0, top: '236px', color: C.lsaff }, area); }
    if (i === 2) { const N = [[60, 50], [416, 40], [40, 220], [430, 220], [238, 10], [238, 250]]; const s = svgIn(area, 476, 280, N.map(([x, y]) => `<path class="tx" d="M238 130 L${x} ${y}" stroke="rgba(255,255,255,.7)" stroke-width="1.6"/>`).join('') + `<circle cx="238" cy="130" r="22" fill="${C.saff}"/>`);
      tl.from(s.querySelectorAll('.tx'), { drawSVG: 0, duration: .6, ease: 'glide', stagger: .07 }, 3.0); N.forEach(([x, y], k) => { const m = metal({ left: (x - 15) + 'px', top: (y - 15) + 'px', width: '30px', height: '30px', borderRadius: '50%' }, area); tl.from(m, { scale: 0, duration: .4, ease: 'snap' }, 3.3 + k * .06); }); }
  });
  title(`One platform. Three ${em('languages.')}`, 'F05 · Three interface layers');
};

// F06 · Your AI, your data
FR[6] = () => {
  foot(46634, { zoom: [1.1, 1.0] });
  const R = foot(23215, { z: 1, box: box(960, 0, 960, 1080) }); R.style.clipPath = 'inset(0 0 0 100%)'; tl.to(R, { clipPath: 'inset(0 0 0 0%)', duration: 1, ease: 'glide' }, 1.6);
  const div = metal({ ...box(946, 0, 28, 1080), zIndex: 5, borderRadius: 0 }, stage, '', 'silver'); tl.from(div, { x: 1000, duration: 1, ease: 'glide' }, 1.6);
  const plug = pill('<span style="width:8px;height:8px;border-radius:50%;background:#7FD39B;box-shadow:0 0 10px #7FD39B"></span><span style="font-family:JBM;font-size:12px;letter-spacing:.14em">YOUR MODEL · API · CONNECTED</span>', { left: '120px', top: '108px', zIndex: 12 }, stage, { h: 44, pad: 18 }); tl.from(plug, { opacity: 0, y: -10, duration: .6 }, .2);
  head(`Your model.<br>Your ${em('data.')}`, { t: 180, s: 96, at: .3, w: 760 });
  const L = glass({ ...box(120, 430, 700, 250), zIndex: 12 }, stage, '', { r: 28 }); tl.from(L, { y: 40, opacity: 0, duration: .8, ease: 'reveal' }, .8);
  mono('Stays with you', { left: '30px', top: '26px', zIndex: 2 }, L);
  [['Raw data', 2.4, ' GB'], ['Files', 1284, ''], ['Model runs', 312, '']].forEach(([k, v, u], i) => { const n = txt('0', { left: (30 + i * 222) + 'px', top: '74px', fontSize: '60px', zIndex: 2, fontVariantNumeric: 'tabular-nums' }, L); mono(k, { left: (32 + i * 222) + 'px', top: '160px', zIndex: 2 }, L); count(n, v, 1.0, 1.2, x => (u ? x.toFixed(1) + u : Math.round(x).toLocaleString('en-IN'))); });
  const lock = metal({ left: '30px', top: '198px', padding: '6px 14px', borderRadius: '14px', ...chipCss, fontSize: '11px', zIndex: 2 }, L, 'Private · never uploaded', 'dark');
  const Rc = glass({ ...box(1100, 200, 700, 470), zIndex: 12 }, stage, '', { r: 28 }); tl.from(Rc, { x: 60, opacity: 0, duration: .8, ease: 'reveal' }, 2.2);
  mono('Shared with the platform', { left: '30px', top: '26px', zIndex: 2 }, Rc); txt(`You choose what to ${em('prove.')}`, { left: '30px', top: '58px', fontSize: '40px', zIndex: 2 }, Rc);
  [['Load', '2.0 kN'], ['Mass', '−40%'], ['Tests', '3 / 3']].forEach(([k, v], i) => { const r = el('div', { position: 'absolute', left: '30px', right: '30px', top: (160 + i * 92) + 'px', height: '74px', borderRadius: '18px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', boxSizing: 'border-box', zIndex: 2 }, Rc,
    `<span style="display:flex;gap:14px;align-items:center">${check()}<span style="font-family:JBM;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.8)">${k}</span></span><span style="font-family:SG;font-size:34px;font-weight:500">${v}</span>`);
    tl.from(r, { x: -260, opacity: 0, duration: .7, ease: 'reveal' }, 2.6 + i * .2); });
  illustrative();
  title(`Your model. Your data. ${em('You')} choose what to prove.`, 'F06 · Your AI, your data');
};

// F07 · Simulation Arena
FR[7] = () => {
  foot(47257, { zoom: [1.12, 1.0] }); const B = foot(49042, { z: 1, grade: 'saturate(.8) contrast(1.05) brightness(.8)' }); glassWipe(B, 1.9);
  kicker('Simulation Arena', { out: 1.8 }); head(`Train machines<br>${em('before')} they exist.`, { t: 170, s: 96, out: 1.75, w: 1100 });
  const c = glass({ ...box(880, 150, 920, 540), zIndex: 12 }, stage, '', { r: 32 }); tl.from(c, { y: 50, opacity: 0, duration: .9, ease: 'reveal' }, 2.15);
  mono('Cell 01 · grasp error per episode', { left: '34px', top: '30px', zIndex: 2 }, c);
  const kp = txt('0', { right: '34px', top: '20px', fontSize: '54px', zIndex: 2 }, c); mono('Parallel runs', { right: '34px', top: '84px', zIndex: 2, color: C.lsaff }, c); count(kp, 3, 2.4, .8);
  const area = el('div', { position: 'absolute', left: '34px', top: '130px', width: '852px', height: '330px', zIndex: 2 }, c); gridLines(area, 852, 300);
  const mk = (a, b, n) => [...Array(14)].map((_, i) => 80 * Math.exp(-i / a) + 10 + Math.sin(i * b) * n);
  [[mk(3, 1.3, 6), C.white], [mk(4.5, .9, 9), 'rgba(255,255,255,.6)'], [mk(2.4, 1.7, 4), C.lsaff]].forEach(([p, col], i) => spark(area, { id: 'r' + i, x: 0, y: 10, w: 840, h: 280, pts: [...p, 0], c: col, at: 2.5 + i * .15, sw: 3 }));
  ['Run A', 'Run B', 'Run C'].forEach((r, i) => { const p = pill(`<span style="width:10px;height:10px;border-radius:50%;background:${[C.white, 'rgba(255,255,255,.6)', C.lsaff][i]}"></span><span style="font-family:JBM;font-size:11px;letter-spacing:.14em">${r.toUpperCase()}</span>`, { left: (34 + i * 150) + 'px', top: '470px', zIndex: 2 }, c, { h: 40, pad: 14, a: .12 }); tl.from(p, { opacity: 0, y: 10, duration: .4 }, 2.6 + i * .08); });
  const cv = pill('<span style="font-family:JBM;font-size:12px;letter-spacing:.14em">CONVERGED · 1 POLICY</span>', { right: '34px', top: '466px', zIndex: 2 }, c, { h: 44, pad: 16, glow: true }); tl.from(cv, { opacity: 0, scale: .8, duration: .5, ease: 'snap' }, 3.4);
  illustrative();
  title(`Simulation Arena. Train machines ${em('before')} they exist.`, 'F07 · Physical AI');
};

// F08 · Thought to prototype
FR[8] = () => {
  foot(50116, { zoom: [1.15, 1.03] }); const B = foot(47266, { z: 1 }); iris(B, 1.8, 1340, 420, 1.1);
  kicker('Transition layer', { out: 1.7 }); head(`A ${em('thought.')}`, { t: 170, s: 140, out: 1.65 });
  head(`A part you can ${em('hold.')}`, { t: 170, s: 104, at: 2.3, w: 900 });
  const c = glass({ ...box(120, 470, 1680, 220), zIndex: 12 }, stage, '', { r: 32 }); tl.from(c, { y: 50, opacity: 0, duration: .9, ease: 'reveal' }, 2.2);
  const steps = [['Sketch', 'Day 1'], ['CAD', 'Day 4'], ['Sim', 'Day 9'], ['Prototype', 'Day 14']];
  const tr = el('div', { position: 'absolute', left: '120px', right: '120px', top: '82px', height: '4px', background: 'rgba(255,255,255,.22)', borderRadius: '2px', zIndex: 2 }, c);
  const fl = el('div', { width: '100%', height: '100%', background: `linear-gradient(90deg, ${C.lsaff}, ${C.saff})`, boxShadow: `0 0 12px ${C.saff}`, transformOrigin: '0 50%' }, tr); tl.fromTo(fl, { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'glide' }, 2.5);
  steps.forEach(([s, d], i) => { const x = 120 + i * (1440 / 3);
    const k = metal({ left: (x - 30) + 'px', top: '54px', width: '60px', height: '60px', borderRadius: '18px', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JBM', fontSize: '13px' }, c, String(i + 1));
    txt(s, { left: (x - 140) + 'px', width: '280px', textAlign: 'center', top: '128px', fontSize: '28px', zIndex: 3 }, c); mono(d, { left: (x - 140) + 'px', width: '280px', textAlign: 'center', top: '168px', zIndex: 3 }, c);
    tl.to(k, { background: `linear-gradient(180deg, ${C.lsaff}, ${C.saff})`, color: C.ink, boxShadow: '0 0 24px rgba(217,130,43,.8), inset 0 1px 0 rgba(255,255,255,.9)', duration: .25 }, 2.55 + i * .42); });
  illustrative();
  title(`From a thought to a part you can ${em('hold.')}`, 'F08 · Thought to prototype');
};

// F09 · Certified creation (gold allowed: proven work only)
FR[9] = () => {
  foot(47783, { zoom: [1.12, 1.0], grade: 'saturate(.8) contrast(1.05) brightness(.82)' });
  kicker('Open Research', { out: 1.9 }); head(`Claim it.<br>${em('Prove')} it.`, { t: 170, s: 112, out: 1.85 });
  const c = glass({ ...box(900, 140, 900, 560), zIndex: 12 }, stage, '', { r: 34, a: .22 }); tl.from(c, { x: 80, opacity: 0, duration: 1, ease: 'reveal' }, .6);
  mono('Certificate of record', { left: '40px', top: '36px', zIndex: 2 }, c); txt('OR-2027-0117', { left: '38px', top: '60px', fontSize: '50px', zIndex: 2, letterSpacing: '-.01em' }, c);
  const rows = [['Proof reproduced by an independent lab', true], ['Data and sources checked', true], ['Second claim: cooling by 12 °C', false]];
  rows.forEach(([s, ok], i) => { const r = el('div', { position: 'absolute', left: '40px', right: '260px', top: (170 + i * 84) + 'px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,.2)', zIndex: 2, fontFamily: 'SG', fontSize: '24px' }, c, `${check(ok)}<span style="flex:1">${s}</span><span style="font-family:JBM;font-size:11px;letter-spacing:.14em;color:${ok ? C.lsaff : 'rgba(255,255,255,.6)'}">${ok ? 'PASSED' : 'NOT YET TESTED'}</span>`);
    tl.from(r, { opacity: 0, x: -20, duration: .5, ease: 'reveal' }, 1.4 + i * .35); });
  const seal = metal({ ...box(660, 300, 190, 190), borderRadius: '50%', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'JBM', fontSize: '12px', letterSpacing: '.16em', textAlign: 'center', lineHeight: '20px', boxShadow: 'inset 0 0 0 8px rgba(255,255,255,.25), inset 0 0 0 10px rgba(138,106,38,.6), 0 14px 40px rgba(11,16,32,.45)' }, c, 'CERTIFIED<br><span style="font-size:24px;letter-spacing:0;font-family:SG">2 / 3</span>CLAIMS', 'gold');
  tl.from(seal, { scale: 1.8, opacity: 0, rotate: -30, duration: .6, ease: 'snap' }, 2.7);
  const by = mono('Reviewed by a named person · never by an AI tool', { left: '40px', bottom: '36px', zIndex: 2, color: C.lsaff }, c); tl.from(by, { opacity: 0, duration: .5 }, 3.1);
  illustrative();
  title(`Claim your idea. Prove it. ${em('Own')} the record.`, 'F09 · Certified creation');
};

// F10 · Engineering cases
FR[10] = () => {
  foot(2235, { zoom: [1.15, 1.0], grade: 'saturate(.6) contrast(1.12) brightness(.8)' });
  kicker('Engineering cases', { out: 1.9 }); head(`Real ${em('loads.')}`, { t: 170, s: 140, out: 1.85 });
  head(`Real ${em('proofs.')}`, { t: 170, s: 140, at: 2.15 });
  const c = glass({ ...box(960, 140, 840, 560), zIndex: 12 }, stage, '', { r: 32 }); tl.from(c, { x: 80, opacity: 0, duration: 1, ease: 'reveal' }, .6);
  mono('Case 07 · lattice bracket · 2.0 kN', { left: '36px', top: '32px', zIndex: 2 }, c);
  const bars = [['Solid part', 248, 'rgba(255,255,255,.55)'], ['Lattice infill', 162, null]];
  bars.forEach(([k, v, col], i) => { const y = 110 + i * 120; mono(k, { left: '36px', top: y + 'px', zIndex: 2 }, c);
    const tr = el('div', { position: 'absolute', left: '36px', top: (y + 26) + 'px', width: '520px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,.1)', zIndex: 2 }, c);
    const b = el('div', { width: (v / 260 * 100) + '%', height: '100%', borderRadius: '12px', background: col || `linear-gradient(90deg, ${C.lsaff}, ${C.saff})`, boxShadow: col ? 'none' : '0 0 16px rgba(217,130,43,.6)', transformOrigin: '0 50%' }, tr);
    tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'glide' }, 1.0 + i * .7);
    const n = txt('0', { left: '580px', top: (y + 18) + 'px', fontSize: '44px', zIndex: 2, fontVariantNumeric: 'tabular-nums' }, c); count(n, v, 1.0 + i * .7, 1.1, x => Math.round(x) + ' MPa'); });
  ring(c, { id: 'm', x: 46, y: 360, r: 62, sw: 14, val: 60, at: 2.4 }); const mm = txt('0%', { left: '72px', top: '420px', fontSize: '34px', width: '100px', textAlign: 'center', zIndex: 2 }, c); count(mm, -40, 2.4, 1.3, x => Math.round(x) + '%');
  txt('Mass', { left: '240px', top: '400px', fontSize: '30px', zIndex: 2 }, c); mono('Against the solid part', { left: '242px', top: '444px', zIndex: 2 }, c);
  const st = pill('<span style="font-family:JBM;font-size:12px;letter-spacing:.14em">PEAK STRESS −35%</span>', { left: '560px', top: '410px', zIndex: 2 }, c, { h: 48, pad: 18, glow: true }); tl.from(st, { opacity: 0, scale: .8, duration: .5, ease: 'snap' }, 2.9);
  illustrative();
  title(`Engineering cases. Real loads. Real ${em('proofs.')}`, 'F10 · Engineering cases');
};

// F11 · Open learning
FR[11] = () => {
  foot(45315, { zoom: [1.12, 1.0] }); const B = foot(23407, { z: 1 }); glassWipe(B, 2.0);
  kicker('Open learning', { out: 1.9 }); head(`Study the ${em('leaf.')}`, { t: 170, s: 128, out: 1.85 });
  head(`Build the ${em('roof.')}`, { t: 170, s: 128, at: 2.3 });
  const topics = [['Biomimicry', 'Nature → structure'], ['Structural dissection', 'Take it apart, rebuild it'], ['Biosensors', 'Measure the living world']];
  topics.forEach(([a, b], i) => { const c = glass({ ...box(1180, 150 + i * 176, 620, 152), zIndex: 12 }, stage, '', { r: 28 });
    metal({ left: '26px', top: '30px', width: '92px', height: '92px', borderRadius: '24px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JBM', fontSize: '15px' }, c, '0' + (i + 1));
    txt(a, { left: '144px', top: '36px', fontSize: '34px', zIndex: 2 }, c); mono(b, { left: '146px', top: '88px', zIndex: 2 }, c);
    tl.from(c, { x: 100, opacity: 0, duration: .8, ease: 'reveal' }, .6 + i * .14).to(c, { boxShadow: '0 0 0 1px rgba(242,183,102,.7), 0 0 40px rgba(242,183,102,.45), 0 24px 60px rgba(11,16,32,.35)', duration: .3 }, 2.6 + i * .25); });
  const q = pill(`<span style="font-family:JBM;font-size:12px;letter-spacing:.14em">NO QUIZZES · BUILD SOMETHING OF YOUR OWN</span>`, { left: '120px', top: '330px', zIndex: 12 }, stage, { h: 48, pad: 18 }); tl.from(q, { opacity: 0, y: 10, duration: .6 }, 2.8);
  title(`Study the leaf. Build the ${em('roof.')}`, 'F11 · Open learning');
};

// F12 · Creative Arena (octagon portholes with metal bezels)
FR[12] = () => {
  el('div', { ...full, background: `radial-gradient(ellipse at 50% 40%, #2A3550 0%, #0E1424 75%)` });
  const world = el('div', { ...full, transformOrigin: '960px 430px', zIndex: 1 });
  const oct = 'polygon(29% 0,71% 0,100% 29%,100% 71%,71% 100%,29% 100%,0 71%,0 29%)';
  const ids = [7386, 33805, 50772, 46148, 45315]; const S = 300, pos = [[290, 430], [625, 400], [960, 430], [1295, 400], [1630, 430]];
  ids.forEach((id, i) => { const [x, y] = pos[i];
    const bz = metal({ ...box(x - S / 2 - 16, y - S / 2 - 16, S + 32, S + 32), clipPath: oct, zIndex: 1 }, world, '', 'silver');
    const f = foot(id, { parent: world, box: box(x - S / 2, y - S / 2, S, S), z: 2, css: { clipPath: oct }, zoom: [1.15, 1.0], grade: 'saturate(1) contrast(1.05) brightness(.95)', tint: 'linear-gradient(160deg, rgba(255,255,255,.28) 0%, rgba(255,255,255,0) 35%)' });
    tl.from([bz, f], { scale: .7, opacity: 0, duration: .9, ease: 'reveal' }, .15 + Math.abs(i - 2) * .12); });
  tl.to(world, { scale: 4.2, duration: 1.3, ease: 'glide' }, 2.4);
  const kk = kicker('Creative Arena', { at: .3, out: 2.3 });
  const hd = head(`Stories of ${em('Bharat.')}`, { t: 680, s: 84, at: .6, out: 2.25 });
  const sl = glass({ ...box(1240, 130, 560, 150), zIndex: 12 }, stage, '', { r: 28 }); mono('Open series · agent-assisted', { left: '30px', top: '30px', zIndex: 2, color: C.lsaff }, sl); txt('Episode 01', { left: '28px', top: '58px', fontSize: '54px', zIndex: 2 }, sl);
  tl.from(sl, { y: -30, opacity: 0, duration: .8, ease: 'reveal' }, 3.2);
  const rec = pill('<span style="width:10px;height:10px;border-radius:50%;background:#E5533D;box-shadow:0 0 10px #E5533D"></span><span style="font-family:JBM;font-size:12px;letter-spacing:.14em">BY ITS CREATORS</span>', { left: '120px', top: '110px', zIndex: 12 }, stage, { h: 44, pad: 18 }); tl.from(rec, { opacity: 0, duration: .5 }, 3.3);
  title(`Creative Arena. Stories of ${em('Bharat,')} by its creators.`, 'F12 · Creative Arena');
};

// F13 · The requirements loop
FR[13] = () => {
  foot(5940, { zoom: [1.12, 1.0] }); const B = foot(23107, { z: 1 }); glassWipe(B, 1.9);
  kicker('The requirements loop', { out: 1.8 }); head(`Teachers and industry<br>${em('post')} a need.`, { t: 170, s: 84, out: 1.75, w: 1100 });
  const c = glass({ ...box(120, 160, 1680, 520), zIndex: 12 }, stage, '', { r: 34 }); tl.from(c, { y: 50, opacity: 0, duration: .9, ease: 'reveal' }, 2.1);
  mono('REQ-0081 · posted by a clinic', { left: '40px', top: '34px', zIndex: 2 }, c); txt('Low-cost splints in five sizes', { left: '38px', top: '62px', fontSize: '42px', zIndex: 2 }, c);
  const steps = [['Posted', 'Requirement'], ['Routed', '3 of 40 learners'], ['Built', 'Certified team'], ['Delivered', 'Due in 14 days']];
  const s = svgIn(c, 1680, 520, [0, 1, 2].map(i => `<path class="ln" d="M${240 + i * 400} 300 H${400 + i * 400}" stroke="${C.lsaff}" stroke-width="2" stroke-dasharray="5 7"/>`).join(''));
  steps.forEach(([a, b], i) => { const x = 40 + i * 400; const n = glass({ ...box(x, 220, 360, 160), zIndex: 2 }, c, '', { r: 26, a: .12, blur: 10 });
    metal({ left: '24px', top: '24px', width: '52px', height: '52px', borderRadius: '16px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JBM', fontSize: '13px' }, n, String(i + 1));
    txt(a, { left: '96px', top: '26px', fontSize: '32px', zIndex: 2 }, n); mono(b, { left: '26px', top: '104px', zIndex: 2 }, n);
    tl.from(n, { y: 30, opacity: 0, duration: .6, ease: 'reveal' }, 2.35 + i * .25).to(n, { boxShadow: '0 0 0 1px rgba(242,183,102,.8), 0 0 36px rgba(242,183,102,.45)', duration: .25 }, 2.55 + i * .25); });
  tl.from(s.querySelectorAll('.ln'), { drawSVG: 0, duration: .4, ease: 'glide', stagger: .25 }, 2.55);
  const av = el('div', { position: 'absolute', left: '440px', top: '410px', display: 'flex', gap: '-8px', zIndex: 2 }, c);
  ['A', 'D', 'K'].forEach((l, i) => { const a = metal({ position: 'relative', width: '44px', height: '44px', borderRadius: '50%', marginLeft: i ? '-10px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'SG', fontSize: '18px' }, av, l, i === 1 ? 'dark' : 'silver'); tl.from(a, { scale: 0, duration: .4, ease: 'snap' }, 3.0 + i * .08); });
  illustrative();
  title(`Posted by teachers and industry. Built by ${em('certified')} learners.`, 'F13 · The requirements loop');
};

// F14 · Tools built with earned tokens
FR[14] = () => {
  foot(46634, { zoom: [1.15, 1.02], grade: 'saturate(.7) contrast(1.05) brightness(.7) hue-rotate(-10deg)' });
  kicker('Earned, then spent', { out: 2.0 }); head(`Earn ${em('tokens.')}`, { t: 170, s: 128, out: 1.95 }); head(`Build the ${em('tools.')}`, { t: 170, s: 120, at: 2.25 });
  const w = glass({ ...box(1040, 140, 760, 300), zIndex: 12 }, stage, '', { r: 34, a: .22 }); tl.from(w, { x: 80, opacity: 0, duration: .9, ease: 'reveal' }, .5);
  mono('Token balance', { left: '36px', top: '32px', zIndex: 2 }, w); const bal = txt('0', { left: '34px', top: '58px', fontSize: '110px', letterSpacing: '-.05em', zIndex: 2, fontVariantNumeric: 'tabular-nums' }, w);
  const t = { v: 0 }; tl.to(t, { v: 12, duration: 1.2, ease: 'glide' }, .8); [0, 1, 2].forEach(i => tl.to(t, { v: 12 - 4 * (i + 1), duration: .3, ease: 'glide' }, 2.3 + i * .35)); perFrame.push(() => { bal.textContent = Math.round(t.v); });
  metal({ right: '36px', top: '40px', width: '86px', height: '62px', borderRadius: '12px', zIndex: 2 }, w, '', 'silver');
  const sb = el('div', { position: 'absolute', left: '36px', right: '36px', top: '218px', height: '26px', borderRadius: '13px', background: 'rgba(255,255,255,.12)', display: 'flex', overflow: 'hidden', zIndex: 2 }, w);
  [['Library', 'rgba(255,255,255,.75)'], ['Skill', C.lsaff], ['Connector', C.saff]].forEach(([k, col], i) => { const s = el('div', { width: '33.33%', height: '100%', background: col, transformOrigin: '0 50%' }, sb); tl.fromTo(s, { scaleX: 0 }, { scaleX: 1, duration: .35, ease: 'glide' }, 2.3 + i * .35);
    mono(k, { left: (36 + i * 230) + 'px', top: '256px', zIndex: 2 }, w); });
  const lg = glass({ ...box(1040, 470, 760, 230), zIndex: 12 }, stage, '', { r: 30 }); tl.from(lg, { y: 40, opacity: 0, duration: .8, ease: 'reveal' }, 2.0);
  mono('Agentic history', { left: '30px', top: '24px', zIndex: 2 }, lg);
  ['clone lib/fea-lite', 'add skill unit-check', 'add connector sensor-csv', 'tests 3 / 3 pass · tool load-check v1'].forEach((l, i) => { const r = el('div', { position: 'absolute', left: '30px', top: (64 + i * 38) + 'px', fontFamily: 'JBM', fontSize: '16px', color: i === 3 ? C.lsaff : C.text, zIndex: 2, display: 'flex', gap: '18px' }, lg, `<span style="color:rgba(255,255,255,.5)">12:${String(4 + i * 3).padStart(2, '0')}</span>${l}`); tl.from(r, { opacity: 0, x: -14, duration: .4 }, 2.3 + i * .3); });
  illustrative();
  title(`Earn tokens. Build the tools. Keep the ${em('history.')}`, 'F14 · Tools built with earned tokens');
};

// F15 · Transcendence phase
FR[15] = () => {
  foot(46747, { zoom: [1.12, 1.0], grade: 'saturate(.55) contrast(1.08) brightness(.75)' });
  kicker('Transcendence phase', { out: 2.0 }); head(`Tested against<br>${em('reality.')}`, { t: 170, s: 100, out: 1.95, w: 900 });
  const c = glass({ ...box(880, 140, 920, 560), zIndex: 12 }, stage, '', { r: 32 }); tl.from(c, { x: 80, opacity: 0, duration: .9, ease: 'reveal' }, .5);
  mono('Tool output vs field data', { left: '34px', top: '30px', zIndex: 2 }, c);
  const area = el('div', { position: 'absolute', left: '34px', top: '90px', width: '852px', height: '300px', zIndex: 2 }, c); gridLines(area, 852, 280);
  const cv = el('canvas', { position: 'absolute', left: 0, top: 0, width: '852px', height: '280px' }, area); cv.width = 1704; cv.height = 560; const o = cv.getContext('2d'); o.scale(2, 2);
  const ph = { v: 1.6 }, cm = { v: 0 }; tl.to(ph, { v: 0, duration: 1.4, ease: 'glide' }, 1.0).to(cm, { v: 1, duration: .8, ease: 'glide' }, 2.6);
  perFrame.push((f, t) => { o.clearRect(0, 0, 852, 280); const line = (fn, col, w, a) => { o.globalAlpha = a; o.strokeStyle = col; o.lineWidth = w; o.beginPath(); for (let x = 0; x <= 852; x += 3) { const y = 140 - fn(x); x ? o.lineTo(x, y) : o.moveTo(x, y); } o.stroke(); };
    const A = x => Math.sin(x * .016 - t * 2) * 90; const Bf = x => Math.sin(x * .016 - t * 2 + ph.v) * 86; const Cf = x => Math.sin(x * .032 - t * 4) * 40;
    line(A, 'rgba(255,255,255,.75)', 2, 1 - cm.v * .6); line(x => Bf(x) + Cf(x) * cm.v, C.saff, 3.5, 1); if (cm.v > 0) line(Cf, '#9DB6F0', 2, .8 * (1 - cm.v * .5)); o.globalAlpha = 1; });
  const err = mono('', { left: '34px', top: '400px', zIndex: 2, color: C.lsaff }, c); perFrame.push(() => { err.textContent = cm.v > .5 ? 'Tool B + tool C → new repo' : `Phase error ${(ph.v * 57.3).toFixed(1)}°`; });
  const stars = el('div', { position: 'absolute', left: '34px', top: '450px', display: 'flex', gap: '10px', alignItems: 'center', zIndex: 2 }, c);
  for (let i = 0; i < 5; i++) { const s = metal({ position: 'relative', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }, stars, '★'); tl.from(s, { scale: 0, duration: .35, ease: 'snap' }, 1.9 + i * .12); }
  mono('Rated by 5 peers', { left: '290px', top: '462px', zIndex: 2 }, c);
  const nr = pill('<span style="font-family:JBM;font-size:12px;letter-spacing:.14em">NEW REPO</span>', { right: '34px', top: '450px', zIndex: 2 }, c, { h: 48, pad: 18, glow: true }); tl.from(nr, { opacity: 0, scale: .8, duration: .5, ease: 'snap' }, 3.0);
  illustrative();
  title(`Tested against reality. Rated by peers. Combined into something ${em('new.')}`, 'F15 · Transcendence phase');
};

// F16 · The hive network
FR[16] = () => {
  foot(24033, { zoom: [1.2, 1.0] }); const B = foot(49878, { z: 1, grade: 'saturate(.8) contrast(1.05) brightness(.7)' }); iris(B, 1.6, 960, 300, 1.1);
  const bar = pill('<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><span class="q" style="font-size:24px"></span>', { left: '480px', top: '120px', width: '960px', zIndex: 12 }, stage, { h: 72, pad: 28, a: .2 });
  tl.from(bar, { y: -20, opacity: 0, duration: .8, ease: 'reveal' }, .3); typer(bar.querySelector('.q'), 'Which tool checks a bracket under 2 kN?', .8, 1.3);
  const R = 62, cx = 960, cy = 470; const cells = []; for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) if (Math.abs(q + r) <= 2) cells.push([cx + R * 1.732 * (q + r / 2), cy + R * 1.5 * r]);
  const names = ['FEA-LITE', 'UNIT-CHECK', 'SENSOR-CSV', 'LATTICE', 'MESH-FIX', 'BOM', 'CFD-2D', 'LOAD-CHECK', 'GRIP-SIM', 'KINE', 'COST', 'TOL', 'PCB', 'THERM', 'IO', 'DOCS', 'QA', 'RIG', 'FIT'];
  const path = [9, 8, 4, 3]; const hex = 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)';
  const els = cells.map(([x, y], i) => { const h = glass({ ...box(x - 56, y - 63, 112, 126), clipPath: hex, zIndex: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }, stage, `<span style="position:relative;z-index:2;font-family:JBM;font-size:10px;letter-spacing:.1em">${names[i]}</span>`, { r: 0, a: .2, blur: 16 });
    tl.from(h, { scale: 0, opacity: 0, duration: .6, ease: 'snap' }, 1.6 + Math.hypot(x - cx, y - cy) / 900); return h; });
  path.forEach((i, k) => tl.to(els[i], { background: `linear-gradient(160deg, ${C.lsaff}, ${C.saff})`, color: C.ink, duration: .2 }, 2.7 + k * .18));
  const s = svgIn(stage, W, H, `<polyline class="pp" points="${[[960, 192], ...path.map(i => cells[i])].map(a => a.join(',')).join(' ')}" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`, { zIndex: 13 });
  tl.from(s.querySelector('.pp'), { drawSVG: 0, duration: .9, ease: 'glide' }, 2.6);
  const an = pill('<span style="font-family:JBM;font-size:12px;letter-spacing:.14em">ANSWER · 4 TOOLS · 312 TOKENS</span>', { left: '1300px', top: '440px', zIndex: 12 }, stage, { h: 50, pad: 18, glow: true }); tl.from(an, { x: -30, opacity: 0, duration: .6, ease: 'reveal' }, 3.3);
  illustrative();
  title(`Every cohort leaves a ${em('hive.')} Ask it what it has built.`, 'F16 · The hive network');
};

// F17 · Vision modules (gold allowed: the final seal)
FR[17] = () => {
  foot(46148, { zoom: [1.15, 1.0] }); const B = foot(40654, { z: 1, grade: 'saturate(.85) contrast(1.05) brightness(.75)' }); glassWipe(B, 1.9);
  kicker('Vision modules', { out: 1.8 }); head(`The ${em('vision')}<br>of one person.`, { t: 170, s: 104, out: 1.75 });
  const c = glass({ ...box(120, 150, 1680, 540), zIndex: 12 }, stage, '', { r: 34 }); tl.from(c, { y: 50, opacity: 0, duration: .9, ease: 'reveal' }, 2.0);
  mono('Vision module · Q1 2027', { left: '40px', top: '34px', zIndex: 2 }, c); txt('Passes every gate, then goes to government and industry', { left: '38px', top: '62px', fontSize: '36px', zIndex: 2 }, c);
  mono('Seven streams', { left: '40px', top: '150px', zIndex: 2 }, c); mono('Six disciplines', { left: '40px', top: '300px', zIndex: 2 }, c);
  for (let i = 0; i < 13; i++) { const row = i < 7 ? 0 : 1, k = row ? i - 7 : i; const g = metal({ left: (40 + k * 156) + 'px', top: (row ? 330 : 180) + 'px', width: '140px', height: '84px', borderRadius: '20px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JBM', fontSize: '16px' }, c, row ? String(k + 1) : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][k]);
    tl.from(g, { y: 20, opacity: 0, duration: .4, ease: 'reveal' }, 2.15 + i * .03).to(g, { background: `linear-gradient(180deg, ${C.lsaff}, ${C.saff})`, boxShadow: '0 0 20px rgba(217,130,43,.6), inset 0 1px 0 rgba(255,255,255,.9)', duration: .15 }, 2.4 + i * .08); }
  const seal = metal({ ...box(1340, 170, 280, 280), borderRadius: '50%', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'JBM', fontSize: '13px', letterSpacing: '.16em', lineHeight: '22px' }, c, 'VISION<br><span style="font-family:SG;font-size:40px;letter-spacing:-.02em">13 / 13</span>GATES PASSED', 'silver');
  tl.to(seal, { background: metalBg('gold'), boxShadow: '0 0 40px rgba(176,141,60,.6), inset 0 1px 0 rgba(255,255,255,.95), inset 0 0 0 10px rgba(255,255,255,.18)', duration: .3 }, 3.45).from(seal, { scale: .6, opacity: 0, duration: .7, ease: 'snap' }, 2.3);
  ['Government', 'Industry'].forEach((s, i) => { const p = pill(`<span style="font-family:JBM;font-size:12px;letter-spacing:.14em">→ ${s.toUpperCase()}</span>`, { left: (1340 + i * 170) + 'px', top: '466px', zIndex: 3 }, c, { h: 44, pad: 14 }); tl.from(p, { opacity: 0, y: 10, duration: .4 }, 3.6 + i * .1); });
  illustrative();
  title(`The ${em('vision')} of the individual, valued highest.`, 'F17 · Vision modules');
};

// F18 · Four Es for schools
FR[18] = async () => {
  foot(35954, { zoom: [1.12, 1.0] });
  kicker('How we work with schools', { out: 3.3 }); head(`Four steps.<br>Then the ${em('school')} learns.`, { t: 170, s: 92, out: 3.3, w: 1200 });
  const defs = [['Enable', 'perception'], ['Engage', 'interest'], ['Enhance', 'sense of control'], [`Educate <i class="em" style="color:inherit">Samatwam</i>`, 'the institution learns']];
  const xs = [120, 520, 920, 1320], ws = [370, 370, 370, 480];
  const fills = defs.map(([a, b], i) => { const g = glass({ ...box(xs[i], 470, ws[i], 120), zIndex: 12 }, stage, '', { r: 60, a: .18 });
    const f = el('div', { position: 'absolute', inset: 0, borderRadius: '60px', background: `linear-gradient(180deg, ${C.lsaff}, ${C.saff})`, transformOrigin: '0 50%', transform: 'scaleX(0)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,.7)' }, g);
    txt(a, { left: '40px', top: '22px', fontSize: '38px', zIndex: 2 }, g); mono(b, { left: '42px', top: '74px', zIndex: 2, color: 'rgba(255,255,255,.85)' }, g);
    tl.from(g, { y: 40, opacity: 0, duration: .8, ease: 'reveal' }, .4 + i * .1); tl.to(f, { scaleX: 1, duration: .45, ease: 'glide' }, 1.3 + i * .45);
    tl.to(g, { boxShadow: '0 0 0 1px rgba(242,183,102,.8), 0 0 50px rgba(242,183,102,.55), 0 24px 60px rgba(11,16,32,.35)', duration: .3 }, 1.4 + i * .45); return f; });
  const sun = metal({ ...box(1490, 140, 210, 210), borderRadius: '50%', zIndex: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }, stage, '', 'silver');
  const sv = await (await fetch('../shared/sun-full.svg')).text(); const sh = el('div', { width: '100px', height: '140px', filter: 'brightness(0) opacity(.75)' }, sun, sv); sh.querySelector('svg').setAttribute('width', 100); sh.querySelector('svg').setAttribute('height', 140);
  tl.from(sun, { scale: .5, opacity: 0, duration: .8, ease: 'snap' }, 2.9);
  const flow = svgIn(stage, W, H, `<defs><filter id="goo"><feGaussianBlur stdDeviation="8"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -8"/></filter></defs><path id="fp" d="M1560 470 C 1560 410, 1595 380, 1595 350" stroke="none"/><g filter="url(#goo)">${[0, 1, 2, 3].map(i => `<circle class="dr" r="${16 - i * 2}" fill="${C.saff}"/>`).join('')}</g>`, { zIndex: 13 });
  flow.querySelectorAll('.dr').forEach((d, i) => tl.fromTo(d, { motionPath: { path: '#fp', align: '#fp', alignOrigin: [.5, .5], start: 0, end: 0 }, opacity: 0 }, { motionPath: { path: '#fp', align: '#fp', alignOrigin: [.5, .5], start: 0, end: 1 }, opacity: 1, duration: .7, ease: 'glide' }, 3.15 + i * .08).to(d, { opacity: 0, duration: .2 }, 3.85 + i * .08));
  tl.to(sun, { boxShadow: '0 0 0 2px rgba(242,183,102,.9), 0 0 60px rgba(242,183,102,.7), inset 0 1px 0 rgba(255,255,255,.95)', duration: .4 }, 3.8);
  title(`Enable. Engage. Enhance. Educate ${em('Samatwam.')}`, 'F18 · Four Es for schools');
};
