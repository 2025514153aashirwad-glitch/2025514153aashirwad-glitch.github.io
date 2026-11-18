// Samatwam Reels · the twenty. Hook 0–2 s, turn 2–11 s, anchor 11–15 s.
const RL = {};
const CLASSES = ['Build', 'Open Research', 'Simulation', 'Physical AI', 'Creative', 'Data'];
const ex = (css = {}) => label('Example', { fontSize: '17px', padding: '6px 12px', border: '1px solid rgba(242,183,102,.6)', borderRadius: '10px', color: C.lsaff, zIndex: 20, ...css });
const paper = (css, html = '') => el('div', { position: 'absolute', boxSizing: 'border-box', background: 'linear-gradient(180deg, #FBFAF6, #ECE9E1)', borderRadius: '6px', boxShadow: '0 30px 60px rgba(11,16,32,.45), inset 0 0 0 1px rgba(0,0,0,.05)', color: '#1B1F26', fontFamily: 'Geist', ...css }, stage, html);
const rows = (n, w = 70) => [...Array(n)].map((_, i) => `<div style="height:14px;margin:18px 0;width:${w - (i * 13) % 30}%;background:#D7D3C8;border-radius:7px"></div>`).join('');

// R01 · Marksheet to Machine
RL[1] = () => {
  foot(50116, { zoom: [1.2, 1.05], pos: '60% 50%' }); const B = cut(2235, 6.2, { grade: 'saturate(.6) contrast(1.1) brightness(.6)' }); wipeIn(B, 6.2);
  const sheet = paper({ ...box(190, 520, 700, 900), padding: '50px 54px', zIndex: 10 }, `<div style="font-weight:500;font-size:26px;letter-spacing:.16em">MARKSHEET · SEM 5</div>${['Strength of materials', 'Thermodynamics', 'Machine design', 'Fluid mechanics', 'Manufacturing'].map((s, i) => `<div style="display:flex;justify-content:space-between;font-size:30px;padding:26px 0;border-bottom:1px solid #DCD8CE"><span>${s}</span><span style="font-weight:500">${['A', 'B+', 'A', 'A+', 'B'][i]}</span></div>`).join('')}<div style="margin-top:40px;font-size:30px;font-weight:500">CGPA 8.4</div>`);
  tl.from(sheet, { y: 200, rotate: -6, opacity: 0, duration: .8, ease: 'reveal' }, 0).to(sheet, { scaleY: .05, scaleX: .6, rotate: 0, opacity: 0, duration: .7, ease: 'exit' }, 2.0);
  const s = svgIn(stage, W, H, `<g class="br"><path class="p1" d="M300 760 V1240" stroke="#F3F1EA" stroke-width="34" stroke-linecap="round"/><path class="p2" d="M300 1240 H760" stroke="#F3F1EA" stroke-width="34" stroke-linecap="round"/><path class="p3" d="M300 960 L520 1240" stroke="#F3F1EA" stroke-width="24" stroke-linecap="round"/></g>`, { zIndex: 10 });
  tl.from(s.querySelectorAll('path'), { drawSVG: 0, duration: .8, ease: 'glide', stagger: .2 }, 2.4);
  const wt = metal({ ...box(560, 1060, 190, 150), borderRadius: '18px', zIndex: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }, stage, '5 kg', 'dark');
  tl.set(wt, { opacity: 0 }, 0).set(wt, { opacity: 1 }, 4.0).from(wt, { y: -1300, duration: .7, ease: 'drop' }, 4.0).to(s.querySelector('.br'), { rotate: 1.2, transformOrigin: '300px 1240px', duration: .12, yoyo: true, repeat: 1 }, 4.6);
  head(`What you remember`, { t: 240, s: 92, at: 2.3, out: 5.6 }); head(`is not what you can ${hl('build.')}`, { t: 240, s: 92, at: 6.4, mode: 'words', out: 10.6 });
  const st = glass({ left: SAFE.l + 'px', top: '540px', padding: '22px 28px', zIndex: 13 }, stage, `<div style="position:relative;z-index:2;font-family:Geist;font-weight:500;font-size:64px;letter-spacing:-.03em" class="n">0%</div><div style="position:relative;z-index:2;font-family:Geist;font-size:20px;letter-spacing:.12em;text-transform:uppercase;color:${C.lsaff}">Graduate employability · India Skills Report 2026</div>`, { r: 28 });
  tl.from(st, { x: -60, opacity: 0, duration: .7, ease: 'reveal' }, 7.4).to(st, { opacity: 0, duration: .4 }, 10.6); count(st.querySelector('.n'), 56.35, 7.5, 1.4, v => v.toFixed(2) + '%');
  caption('Paper becomes a bracket. The bracket holds.', 4.8, 7.2);
  anchor({ line: `Your marks don't hold weight. Your ${hl('work')} does.`, fact: 'Graduate employability in India: 56.35%.', src: 'India Skills Report 2026', call: 'What did you build this semester? · Cohort 01 · link in bio' });
};

// R02 · The Certificate That Says No
RL[2] = () => {
  foot(47783, { zoom: [1.15, 1.0], grade: 'saturate(.7) contrast(1.05) brightness(.6)' });
  const c = glass({ ...box(SAFE.l, 520, SAFE.r - SAFE.l, 860), zIndex: 10, padding: '50px 46px' }, stage, '', { r: 40, a: .22 });
  tl.from(c, { y: 80, opacity: 0, duration: 1, ease: 'reveal' }, 0).fromTo(c, { scale: 1 }, { scale: 1.06, duration: 9, ease: 'none' }, 2);
  label('Certificate', { left: '46px', top: '50px', zIndex: 2 }, c); const id = txt('', { left: '44px', top: '90px', fontSize: '60px', zIndex: 2 }, c); tl.to(id, { scrambleText: { text: 'SAM-ENG-2027-0042', chars: '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ-', speed: .5 }, duration: 1.4 }, .4);
  const items = [['Holds 2 kN at the mount', true], ['40% lighter than the solid part', true], ['Fatigue life past 1 million cycles', false]];
  items.forEach(([s, ok], i) => { const r = el('div', { position: 'absolute', left: '46px', right: '46px', top: (230 + i * 150) + 'px', height: '120px', display: 'flex', alignItems: 'center', gap: '22px', borderBottom: '1.5px solid rgba(255,255,255,.22)', fontFamily: 'Geist', fontWeight: 500, fontSize: '34px', zIndex: 2, lineHeight: '40px' }, c, i < 2 ? `${tick(true, 44)}<span style="flex:1">${s}</span>` : '<span class="blank" style="flex:1;height:2px;border-top:2px dashed rgba(255,255,255,.45)"></span>');
    if (i < 2) tl.from(r, { opacity: 0, x: -30, duration: .6, ease: 'reveal' }, 2.6 + i * 1.2);
    else { const nc = el('div', { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: '22px' }, r, `${cross(44)}<span style="flex:1">${s}</span>`); tl.from(nc, { opacity: 0, duration: .5 }, 6.6); tl.to(r.querySelector('.blank'), { opacity: 0, duration: .3 }, 6.5);
      const nb = pill(`<span style="font-size:24px;letter-spacing:.14em;color:#F3A193">NOT CERTIFIED</span>`, { left: '46px', top: '600px', zIndex: 3 }, c, { h: 70, a: .12 }); nb.style.boxShadow += ', 0 0 0 1.5px rgba(229,83,61,.8)'; tl.from(nb, { scale: 1.6, opacity: 0, duration: .5, ease: 'snap' }, 7.4); } });
  ex({ right: '46px', top: '56px' });
  head(`Honesty is the ${hl('feature.')}`, { t: 230, s: 92, at: 1.6, mode: 'blur', out: 10.6 });
  anchor({ line: `The only certificate that tells you what you ${hl("didn't")} prove.`, fact: 'Every certificate lists exactly which claims passed and which did not.', src: 'Samatwam certificate standard', call: 'Proof over polish.' });
};

// R03 · Ten Tools, One Decision
RL[3] = () => {
  foot(47903, { zoom: [1.15, 1.0], grade: 'saturate(.7) contrast(1.05) brightness(.62)' }); const B = cut(50116, 6.0); iris(B, 6.0, 540, 1100, 1.1);
  const tools = ['CAD', 'FEA', 'CFD', 'LLM', 'CAM', 'PCB', 'MATLAB', 'SIM', 'BOM', 'IoT'];
  const chips = tools.map((t, i) => { const c = metal({ ...box(SAFE.l + (i % 2) * 450, 560 + Math.floor(i / 2) * 150, 420, 120), borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', letterSpacing: '.06em', zIndex: 10 }, stage, t, i % 3 ? 'silver' : 'dark');
    tl.from(c, { y: -1300, rotate: (i % 2 ? 8 : -8), duration: .55, ease: 'drop' }, .05 + i * .04).to(c, { filter: 'blur(14px)', opacity: .35, duration: .8 }, 4.6 + (i % 5) * .05).to(c, { opacity: 0, duration: .4 }, 5.8); return c; });
  const hv = el('div', { position: 'absolute', left: 0, top: 0, width: '150px', height: '150px', borderRadius: '50%', zIndex: 11, border: '2px solid rgba(255,255,255,.85)', background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(4px) brightness(1.2)', boxShadow: '0 0 40px rgba(255,255,255,.3)' });
  const pts = chips.map(c => [parseFloat(c.style.left) + 135, parseFloat(c.style.top) - 15]);
  tl.fromTo(hv, { x: pts[0][0], y: pts[0][1], opacity: 0 }, { opacity: 1, duration: .3 }, 2.2); tl.to(hv, { motionPath: { path: pts.map(([x, y]) => ({ x, y })), curviness: 1.2 }, duration: 2.2, ease: 'sine.inOut' }, 2.3).to(hv, { opacity: 0, duration: .3 }, 4.5);
  head(`The tool is not the ${hl('skill.')}`, { t: 230, s: 92, at: 2.0, mode: 'words', out: 5.7 });
  const card = glass({ ...box(SAFE.l, 700, SAFE.r - SAFE.l, 470), zIndex: 12, padding: '44px' }, stage, '', { r: 40, a: .24 }); tl.from(card, { y: 80, opacity: 0, duration: .9, ease: 'reveal' }, 6.6);
  label('Decision', { left: '44px', top: '44px', zIndex: 2, color: C.lsaff }, card);
  const d = txt('', { left: '42px', top: '96px', width: '780px', fontSize: '56px', lineHeight: '64px', whiteSpace: 'normal', zIndex: 2 }, card); typer(d, 'Use the lighter bracket. Test it twice before we cut steel.', 7.2, 2.4);
  head(`The decision ${hl('is.')}`, { t: 230, s: 92, at: 6.4, mode: 'words', out: 10.6 });
  anchor({ line: `Anyone can open software. Few can ${hl('decide')} with it.`, fact: 'To think is the real skill.', src: 'Samatwam founding belief', call: 'Learn to decide · Samatwam' });
};

// R04 · Claim It First
RL[4] = () => {
  foot(22957, { zoom: [1.15, 1.0], grade: 'saturate(.8) contrast(1.05) brightness(.6)' });
  const card = (y, z) => glass({ ...box(SAFE.l + 40, y, 800, 520), zIndex: z, padding: '40px' }, stage, '', { r: 36, a: .22 });
  const A = card(560, 11), B = card(640, 10);
  [A, B].forEach((c, i) => { label(i ? 'Idea · unsealed' : 'Idea', { left: '40px', top: '40px', zIndex: 2 }, c); txt(i ? 'A shade net that cools a classroom by 4 °C' : 'A lattice bracket that holds 2 kN at 40% less mass', { left: '38px', top: '86px', width: '720px', whiteSpace: 'normal', fontSize: '48px', lineHeight: '56px', zIndex: 2 }, c); });
  tl.from(A, { y: 100, opacity: 0, duration: .5, ease: 'reveal' }, 0).from(B, { opacity: 0, duration: .5 }, 0);
  const seal = metal({ ...box(560, 330, 190, 190), borderRadius: '50%', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '17px', letterSpacing: '.12em', textAlign: 'center', lineHeight: '24px' }, A, 'SEALED<br>18 NOV 2026<br>09:41:07', 'silver');
  tl.from(seal, { scale: 2.2, opacity: 0, rotate: -25, duration: .45, ease: 'drop' }, .9);
  tl.to(seal, { background: metalBg('gold'), boxShadow: '0 0 40px rgba(176,141,60,.65), inset 0 1.5px 0 rgba(255,255,255,.95)', duration: .4 }, 6.6);
  const hash = label('', { left: '40px', top: '420px', zIndex: 2, color: C.lsaff, fontSize: '19px' }, A); tl.to(hash, { scrambleText: { text: 'SHA-256 · 9F3A 07C1 B2E8 51D4', chars: '0123456789ABCDEF', speed: .4 }, duration: 1.6 }, 2.4);
  const tray = metal({ ...box(SAFE.l, 1240, SAFE.r - SAFE.l, 140), borderRadius: '24px', zIndex: 12, display: 'flex', alignItems: 'center', paddingLeft: '40px', fontSize: '22px', letterSpacing: '.16em' }, stage, 'FILED · OPEN RESEARCH', 'dark');
  tl.from(tray, { y: 300, opacity: 0, duration: .8, ease: 'reveal' }, 4.0).to(A, { y: 180, scale: .92, duration: 1, ease: 'glide' }, 4.6);
  tl.to(B, { x: 900, y: -700, rotate: 28, filter: 'blur(8px)', opacity: 0, duration: 3, ease: 'power1.in' }, 5.0);
  head(`Ideas made with AI still need an ${hl('owner.')}`, { t: 200, s: 82, at: 2.2, mode: 'words', out: 10.6 });
  ex({ left: SAFE.l + 'px', top: '1440px' });
  anchor({ line: `If you didn't ${hl('claim')} it, it isn't yours yet.`, fact: 'Open Research issues an independent certificate for works made with AI.', src: 'Samatwam Open Research', call: 'Claim · Prove · Own' });
};

// R05 · Your Data Stays Home
RL[5] = () => {
  const bg = foot(23215, { zoom: [1.2, 1.05], grade: 'saturate(.8) contrast(1.05) brightness(.55)' }); const bo = meshGrad({ z: 9, a: .4, size: 34 }); tl.to(bo, { opacity: 0, duration: .6, ease: 'glide' }, 1.8);
  const lock = svgIn(stage, W, H, `<g transform="translate(540 900)"><path class="sh" d="M-70 0 V-80 A70 70 0 0 1 70 -80 V0" stroke="#E8EAEE" stroke-width="22" stroke-linecap="round"/><rect x="-110" y="-10" width="220" height="190" rx="34" fill="url(#mt)"/><circle cy="70" r="18" fill="#2A2F38"/><rect x="-6" y="70" width="12" height="50" rx="6" fill="#2A2F38"/></g><defs><linearGradient id="mt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7F8FA"/><stop offset=".5" stop-color="#C9CDD3"/><stop offset="1" stop-color="#9EA4AC"/></linearGradient></defs>`, { zIndex: 10 });
  tl.from(lock.querySelector('.sh'), { y: -60, duration: .35, ease: 'drop' }, .7).to(lock, { opacity: 0, scale: .6, transformOrigin: '540px 900px', duration: .5 }, 1.8);
  const house = glass({ ...box(170, 620, 740, 720), zIndex: 10, clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)' }, stage, '', { r: 0, a: .22 });
  tl.from(house, { scale: .7, opacity: 0, duration: .9, ease: 'reveal' }, 2.0);
  for (let i = 0; i < 12; i++) { const w = el('div', { position: 'absolute', left: (110 + (i % 4) * 140) + 'px', top: (290 + Math.floor(i / 4) * 120) + 'px', width: '90px', height: '76px', borderRadius: '12px', background: saffBg, boxShadow: '0 0 24px rgba(242,183,102,.6)', zIndex: 2 }, house); tl.from(w, { opacity: 0, duration: .25 }, 2.5 + i * .07); }
  label('Your files · your model · your runs', { left: '110px', top: '220px', zIndex: 2, fontSize: '19px' }, house);
  const slot = metal({ ...box(870, 1220, 120, 26), borderRadius: '13px', zIndex: 12 }, stage, '', 'dark'); tl.from(slot, { opacity: 0, duration: .4 }, 3.4);
  ['Load 2.0 kN', 'Mass −40%', 'Tests 3 / 3'].forEach((s, i) => { const p = pill(`${tick(true, 30)}<span style="font-size:26px">${s}</span>`, { left: '600px', top: '1200px', zIndex: 13 }, stage, { h: 66, pad: 22 });
    tl.fromTo(p, { x: 0, y: 0, opacity: 0, scale: .5 }, { x: -480 + i * 0, y: -700 - i * 0 + i * 96 - 120, opacity: 1, scale: 1, duration: 1, ease: 'glide' }, 4.2 + i * .7); });
  tl.to(house, { x: 0, duration: 1 }, 7);
  head(`Privacy is ${hl('respect.')}`, { t: 240, s: 100, at: 2.0, mode: 'rise', out: 10.6 });
  ex({ left: SAFE.l + 'px', top: '1440px' });
  anchor({ line: `We see only what you ${hl('choose')} to prove.`, fact: 'Bring your own AI by API. Your data stays with you; only the metrics you choose are shared.', src: 'Samatwam data policy', call: 'Your model. Your data.' });
};

// R06 · Twelve Hours (cuts on a 120 BPM grid)
RL[6] = () => {
  foot(46634, { zoom: [1.1, 1.0] }); const ids = [50116, 48165, 46748, 47903, 22957, 46634, 23107, 47266, 50116, 46748, 48165, 22957];
  ids.forEach((id, i) => { const a = 2 + i * .5; cut(id, a, { until: a + .5, zoom: [1.12, 1.04], zd: .5, rate: 1 }); });
  const clk = el('div', { position: 'absolute', left: '50%', top: '540px', transform: 'translateX(-50%)', display: 'flex', gap: '14px', zIndex: 15 });
  const dg = [...Array(6)].map((_, i) => { if (i === 2 || i === 4) el('div', { fontFamily: 'Geist', fontSize: '110px', color: C.text, lineHeight: '210px' }, clk, ':'); return metal({ position: 'relative', width: '118px', height: '200px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '130px', letterSpacing: '-.04em', overflow: 'hidden' }, clk, '0', 'dark'); });
  dg.forEach(d => el('div', { position: 'absolute', left: 0, right: 0, top: '50%', height: '2px', background: 'rgba(0,0,0,.6)' }, d));
  tl.from(clk, { scale: 1.3, opacity: 0, duration: .25, ease: 'drop' }, .1);
  const tm = { s: 0 }; tl.to(tm, { s: 12 * 3600, duration: 8.5, ease: 'power1.in' }, 2.0);
  perFrame.push(f => { const s = f < 6 ? 12 * 3600 : Math.max(0, 12 * 3600 - tm.s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), q = Math.floor(s % 60); const str = String(h).padStart(2, '0') + String(m).padStart(2, '0') + String(q).padStart(2, '0'); dg.forEach((d, i) => { if (d.firstChild.nodeType === 3) d.firstChild.textContent = str[i]; else d.insertBefore(document.createTextNode(str[i]), d.firstChild); }); });
  tl.to(clk, { top: 260, scale: .62, duration: .6, ease: 'glide' }, 2.0);
  const tiles = glass({ ...box(SAFE.l, 720, SAFE.r - SAFE.l, 470), zIndex: 15, padding: '30px' }, stage, '', { r: 36 }); tl.from(tiles, { y: 60, opacity: 0, duration: .6, ease: 'reveal' }, 2.4);
  label('Teams · 12', { left: '32px', top: '28px', zIndex: 2 }, tiles);
  for (let i = 0; i < 12; i++) { const t = el('div', { position: 'absolute', left: (32 + (i % 4) * 204) + 'px', top: (80 + Math.floor(i / 4) * 124) + 'px', width: '186px', height: '106px', borderRadius: '22px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.3)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Geist', fontWeight: 500, fontSize: '26px' }, tiles, 'T' + String(i + 1).padStart(2, '0'));
    tl.to(t, { background: saffBg, color: C.ink, boxShadow: '0 0 26px rgba(217,130,43,.6)', duration: .15 }, 2.5 + i * .5); }
  const pip = pill(`<span style="width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 0 12px #fff"></span><span style="font-size:28px">Certified · Team 07</span>`, { left: SAFE.l + 'px', top: '1250px', zIndex: 16 }, stage, { glow: true }); tl.from(pip, { scale: .6, opacity: 0, duration: .5, ease: 'snap' }, 9.0);
  head(`Twelve hours.`, { t: 1260, s: 0.1, at: 99 });
  anchor({ line: `Twelve hours. One ${hl('proof.')}`, fact: 'A 12-hour event day for about 200 builders, on sponsored B200 GPUs and Trillium TPUs.', src: 'Samatwam event plan', call: 'Register for the event day.' });
};

// R07 · Train What Doesn't Exist
RL[7] = () => {
  el('div', { ...full, background: '#05070C' });
  const dots = 'radial-gradient(circle, #000 1.4px, transparent 1.9px)';
  const ghost = (dx, at, op, z) => { const f = foot(47257, { z, at, rate: .8, zoom: [1.12, 1.0], pos: '42% 50%', grade: 'grayscale(1) contrast(1.6) brightness(1.1)', tint: 'none', css: { maskImage: dots, webkitMaskImage: dots, maskSize: '7px 7px', webkitMaskSize: '7px 7px', mixBlendMode: 'screen', opacity: op } }); f.img.style.filter += ' sepia(.6) hue-rotate(-10deg) saturate(2.4)'; tl.fromTo(f, { x: dx }, { x: 0, duration: 1.4, ease: 'glide' }, 6.0); return f; };
  ghost(0, 0, 1, 1); const g1 = ghost(-170, -.4, .45, 2), g2 = ghost(170, .5, .45, 2);
  tl.from([g1, g2], { opacity: 0, duration: .5 }, 2.0).to([g1, g2], { opacity: 0, duration: .5 }, 7.3);
  ['Run A', 'Run B', 'Run C'].forEach((s, i) => { const p = pill(`<span style="font-size:22px;letter-spacing:.14em">${s.toUpperCase()}</span>`, { left: (SAFE.l + i * 290) + 'px', top: '1180px', zIndex: 12 }, stage, { h: 62, pad: 22 }); tl.from(p, { opacity: 0, y: 20, duration: .4 }, 2.4 + i * .15);
    if (i === 1) tl.to(p, { background: saffBg, color: C.ink, boxShadow: '0 0 40px rgba(217,130,43,.7)', duration: .3 }, 5.4); else tl.to(p, { opacity: .3, duration: .3 }, 5.4); });
  const sc = label('Pick · 0 / 3 succeeded', { left: SAFE.l + 'px', top: '1270px', zIndex: 12, color: C.lsaff }); tl.from(sc, { opacity: 0 }, 2.6).to(sc, { opacity: 0, duration: .2 }, 5.3);
  const sc2 = label('Pick · run B succeeded · ghosts merge', { left: SAFE.l + 'px', top: '1270px', zIndex: 12, color: C.lsaff }); show(sc2, 5.5, 8.2);
  const real = cut(22957, 8.4, { z: 5, zoom: [1.2, 1.05], pos: '55% 60%' }); iris(real, 8.4, 540, 900, .9);
  const mc = pill('<span style="font-size:24px;letter-spacing:.12em">MATCH CUT · A REAL HAND, THE SAME MOTION</span>', { left: SAFE.l + 'px', top: '1180px', zIndex: 12 }, stage, { h: 62, pad: 24 }); show(mc, 9.0, 10.7);
  head(`Machines learn in ${hl('simulation')} first.`, { t: 220, s: 90, at: 2.0, mode: 'words', out: 10.6 });
  anchor({ line: `Train it before you ${hl('build')} it.`, fact: 'Simulation Arena: multi-simulation training for production machinery.', src: 'Samatwam Physical AI class', call: 'Physical AI class · Cohort 01' });
};

// R08 · More Stories Than Screens
RL[8] = () => {
  el('div', { ...full, background: '#05070C' }); meshGrad({ a: .35, size: 36 });
  const v1 = caption('“Ek gaon mein ek nadi thi…”', .2, 3.4); const v2 = caption('“In a village there was a river, and a girl who listened to it.”', 3.6, 7.0); const v3 = caption('“Every evening she lit a lamp for the stories it told.”', 7.2, 10.6);
  const wave = svgIn(stage, W, H, `<path class="wv" stroke="${C.lsaff}" stroke-width="3" stroke-linecap="round"/>`, { zIndex: 9 }); const wv = wave.querySelector('.wv');
  perFrame.push((f, t) => { let d = ''; for (let x = 0; x <= 600; x += 6) { const a = Math.sin(x * .05 + t * 9) * Math.sin(x * .013) * (30 + 20 * Math.sin(t * 3)) * ss(0, .5, t) * (1 - ss(1.8, 2.2, t)); d += (x ? 'L' : 'M') + (240 + x) + ' ' + (900 + a).toFixed(1); } wv.setAttribute('d', d); });
  label('Voice · a real elder, recorded with consent', { left: SAFE.l + 'px', top: '1010px', zIndex: 9 });
  const ink = 'grayscale(.85) sepia(.35) contrast(1.35) brightness(.95)';
  const pan = (id, y, at, h = 380) => { const f = foot(id, { box: box(SAFE.l, y, SAFE.r - SAFE.l, h), r: 28, z: 10, at, rate: .5, grade: ink, tint: 'linear-gradient(180deg, rgba(242,183,102,.08), rgba(11,16,32,.25))' });
    f.style.clipPath = 'inset(0 100% 0 0 round 28px)'; tl.to(f, { clipPath: 'inset(0 0% 0 0 round 28px)', duration: 1.4, ease: 'glide' }, at); f.style.border = '1.5px solid rgba(255,255,255,.4)'; return f; };
  const p1 = pan(7386, 330, 2.1), p2 = pan(33805, 740, 3.9), p3 = pan(50772, 1150, 5.7, 240);
  tl.to([p1, p2], { opacity: .25, duration: .6 }, 7.6).to(p3, { top: 330, height: 820, duration: 1.2, ease: 'glide' }, 7.6).to(p3.img, { filter: 'saturate(1.05) contrast(1.05) brightness(.9)', duration: 1.2 }, 7.6);
  const sl = glass({ ...box(SAFE.l + 30, 1020, 520, 110), zIndex: 12, display: 'flex', alignItems: 'center', gap: '24px', padding: '0 30px' }, stage, `<span style="position:relative;z-index:2;font-family:Geist;font-weight:500;font-size:30px">Episode 01</span><span style="position:relative;z-index:2;font-family:Geist;font-size:20px;letter-spacing:.14em;color:${C.lsaff}">SCENE 1 · TAKE 1</span>`, { r: 24 });
  tl.from(sl, { y: 30, opacity: 0, duration: .6, ease: 'reveal' }, 8.9);
  head(`Bharat's ${hl('untold')} stories.`, { t: 190, s: 76, at: 2.0, mode: 'blur', out: 10.6 });
  anchor({ line: `Your grandmother's story deserves a ${hl('screen.')}`, fact: 'Creative Arena: stories of Bharat. Selected works join an open series.', src: 'Samatwam Creative Arena', call: 'Creative Arena · open call' });
};

// R09 · Signed by You
RL[9] = () => {
  foot(50116, { zoom: [1.2, 1.05], grade: 'saturate(.8) contrast(1.05) brightness(.55)' });
  const sg = glass({ ...box(SAFE.l, 560, SAFE.r - SAFE.l, 360), zIndex: 10 }, stage, '', { r: 36, a: .2 });
  const sig = svgIn(sg, 878, 360, `<path class="sg" d="M70 230 C 110 120, 160 110, 150 200 S 210 290, 250 180 C 270 130, 300 150, 290 210 C 285 250, 330 240, 360 190 C 390 140, 410 180, 430 220 C 450 260, 500 170, 540 150 C 580 130, 600 230, 650 220 C 700 210, 720 160, 800 170" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`, { zIndex: 2 });
  tl.from(sig.querySelector('.sg'), { drawSVG: 0, duration: 1.6, ease: 'power1.inOut' }, .1); label('Signed · the creator', { left: '40px', top: '300px', zIndex: 2 }, sg);
  tl.to(sg, { y: -260, scale: .7, transformOrigin: '0 0', duration: .8, ease: 'glide' }, 2.4);
  const post = foot(33805, { box: box(SAFE.l + 120, 600, 640, 700), r: 12, z: 11, at: 2.6, grade: 'grayscale(1) contrast(1.4) brightness(1.1)', tint: `linear-gradient(180deg, rgba(217,130,43,.55), rgba(11,16,32,.65))` });
  post.style.clipPath = 'inset(0 0 100% 0)'; const sq = metal({ ...box(SAFE.l + 90, 590, 700, 22), borderRadius: '11px', zIndex: 12 }, stage, '', 'dark');
  const pr = { v: 0 }; tl.to(pr, { v: 1, duration: 1.6, ease: 'glide' }, 2.8); perFrame.push(() => { post.style.clipPath = `inset(0 0 ${100 - pr.v * 100}% 0)`; sq.style.top = (590 + pr.v * 700) + 'px'; sq.style.opacity = pr.v > 0 && pr.v < 1 ? 1 : 0; });
  txt('THE LISTENER', { left: '40px', top: '560px', fontSize: '64px', letterSpacing: '.02em', zIndex: 3 }, post);
  const lic = metal({ ...box(640, 1180, 210, 120), borderRadius: '20px', zIndex: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '20px', letterSpacing: '.12em', lineHeight: '28px' }, stage, 'LICENSED<br>BY ITS CREATOR', 'silver');
  tl.from(lic, { scale: 2, opacity: 0, rotate: -12, duration: .4, ease: 'drop' }, 4.7);
  tl.to(post, { scale: .45, x: 330, y: -250, transformOrigin: '0 0', duration: .8, ease: 'glide' }, 6.0).to(lic, { opacity: 0, duration: .3 }, 6.0).to(sg, { opacity: 0, duration: .3 }, 6.0);
  const pl = glass({ ...box(SAFE.l, 940, SAFE.r - SAFE.l, 420), zIndex: 12 }, stage, '', { r: 34 }); tl.from(pl, { y: 60, opacity: 0, duration: .7, ease: 'reveal' }, 6.4);
  label('Creator', { left: '34px', top: '30px', zIndex: 2, color: C.lsaff }, pl); label('Platform', { right: '34px', top: '30px', zIndex: 2 }, pl);
  const cnt = txt('0 / 20', { left: '34px', top: '320px', fontSize: '54px', zIndex: 2 }, pl);
  for (let i = 0; i < 20; i++) { const x0 = 450 + (i % 10) * 38, y0 = 110 + Math.floor(i / 10) * 100; const p = metal({ ...box(x0, y0, 26, 84), borderRadius: '6px', zIndex: 2 }, pl, '', i < 14 ? 'silver' : 'dark');
    if (i < 14) tl.to(p, { left: (34 + (i % 7) * 40) + 'px', top: (110 + Math.floor(i / 7) * 100) + 'px', duration: .5, ease: 'glide' }, 7.2 + i * .12); }
  count(cnt, 14, 7.2, 1.8, v => Math.round(v) + ' / 20 · ' + Math.round(v * 5) + '%');
  head(`Made by ${hl('you.')}`, { t: 230, s: 110, at: 6.2, mode: 'rise', out: 10.6 });
  anchor({ line: `Made by you. ${hl('Owned')} by you.`, fact: 'The creator owns the work; 70% of what it earns goes to its builders.', src: 'Samatwam creator terms', call: 'Create · License · Earn' });
};

// R10 · Fifty Films
RL[10] = () => {
  el('div', { ...full, background: '#05070C' }); meshGrad({ a: .3, size: 40 });
  const ids = [50116, 2235, 47783, 47903, 22957, 46634, 23215, 48165, 47257, 49042, 7386, 50772, 33805, 35954, 24033, 23377, 47266, 23107, 47263, 46748, 5940, 49878];
  const cells = []; const N = 9, S = 92, gap = 8, ox = (W - N * (S + gap)) / 2, oy = 520;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const dx = Math.abs(c - 4), dy = Math.abs(r - 4); if (dx + dy <= 6 && !(dx === 4 && dy === 4)) cells.push([c, r]); }
  cells.sort((a, b) => Math.hypot(a[0] - 4, a[1] - 4) - Math.hypot(b[0] - 4, b[1] - 4)); const use = cells.slice(0, 50);
  use.forEach(([c, r], i) => { const t = el('div', { position: 'absolute', left: (ox + c * (S + gap)) + 'px', top: (oy + r * (S + gap)) + 'px', width: S + 'px', height: S + 'px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.35)', boxShadow: '0 0 20px rgba(242,183,102,.25)', zIndex: 10 }, stage, `<img src="../shared/footage/${ids[i % ids.length]}/${String(20 + (i * 37) % 120).padStart(4, '0')}.jpg" style="width:100%;height:100%;object-fit:cover;filter:saturate(.9) brightness(.85)">`);
    const at = i === 0 ? .3 : 2.2 + Math.pow(i / 49, 1.4) * 5.5; tl.from(t, { opacity: 0, scale: .4, duration: .4, ease: 'snap' }, at); });
  const n = txt('1', { left: SAFE.l + 'px', top: '1300px', fontSize: '120px', zIndex: 12, letterSpacing: '-.05em' }); count(n, 50, 2.2, 5.5, v => Math.max(1, Math.round(v)) + ' films'); tl.from(n, { opacity: 0, duration: .4 }, 2.2);
  head(`One phone. Then ${hl('fifty.')}`, { t: 230, s: 92, at: 1.8, mode: 'words', out: 10.6 });
  anchor({ line: `Fifty creators. One ${hl('cohort.')}`, fact: 'One cohort of 50 creators makes 50 films and their reels.', src: 'Samatwam Creative Arena plan', call: 'Apply to the Creative Arena.' });
};

// R11 · What Did You Build?
RL[11] = () => {
  el('div', { ...full, background: '#05070C' }); meshGrad({ a: .28, size: 38, until: 2.4 }); const bg = foot(35954, { at: 2.4, grade: 'saturate(.8) brightness(.45)', blur: 6 }); tl.from(bg, { opacity: 0, duration: 1 }, 2.4);
  const q1 = head('How much did you score?', { t: 600, s: 84, at: .1 }); const ln = svgIn(stage, W, H, `<path class="st" d="M66 690 L 940 650" stroke="${C.saff}" stroke-width="10" stroke-linecap="round"/>`, { zIndex: 13 });
  tl.from(ln.querySelector('.st'), { drawSVG: 0, duration: .5, ease: 'glide' }, 1.4).to([q1, ln], { opacity: 0, y: -40, duration: .5 }, 2.3);
  head(`What did you ${hl('build?')}`, { t: 260, s: 100, at: 2.5, mode: 'flip', out: 10.6 });
  const m = glass({ ...box(SAFE.l, 620, SAFE.r - SAFE.l, 700), zIndex: 12 }, stage, '', { r: 36 }); tl.from(m, { y: 60, opacity: 0, duration: .8, ease: 'reveal' }, 3.0);
  label('Threaded map · one year of work', { left: '34px', top: '30px', zIndex: 2 }, m);
  const cols = 6, rws = 8, gx = 140, gy = 70; let d = '', gold = []; const R = (k => () => (k = (k * 9301 + 49297) % 233280) / 233280)(5);
  let p = [70, 120]; const pts = [p]; for (let i = 1; i < 26; i++) { p = [70 + Math.floor(R() * cols) * gx, 120 + Math.floor(i / 26 * rws) * gy + 0]; pts.push(p); }
  pts.forEach((q, i) => { if (i) d += `M${pts[i - 1][0]} ${pts[i - 1][1]} Q ${(pts[i - 1][0] + q[0]) / 2 + 30} ${(pts[i - 1][1] + q[1]) / 2 - 20}, ${q[0]} ${q[1]} `; });
  const g1 = [pts[9], pts[10]], g2 = [pts[19], pts[20]];
  const s = svgIn(m, 878, 700, [...Array(cols * rws)].map((_, i) => `<circle cx="${70 + (i % cols) * gx}" cy="${120 + Math.floor(i / cols) * gy}" r="4" fill="rgba(255,255,255,.35)"/>`).join('') + `<path class="th" d="${d}" stroke="rgba(255,255,255,.8)" stroke-width="3" stroke-linecap="round"/>` + [g1, g2].map(g => `<path class="gd" d="M${g[0][0]} ${g[0][1]} Q ${(g[0][0] + g[1][0]) / 2 + 30} ${(g[0][1] + g[1][1]) / 2 - 20}, ${g[1][0]} ${g[1][1]}" stroke="url(#gg)" stroke-width="12" stroke-linecap="round"/>`).join('') + `<defs><linearGradient id="gg"><stop offset="0" stop-color="#F6E7BF"/><stop offset=".5" stop-color="${C.gold}"/><stop offset="1" stop-color="#E9D49A"/></linearGradient></defs>`, { zIndex: 2 });
  tl.from(s.querySelector('.th'), { drawSVG: 0, duration: 4, ease: 'power1.inOut' }, 3.4).from(s.querySelectorAll('.gd'), { drawSVG: 0, duration: .6, ease: 'glide', stagger: .5 }, 7.6);
  const gl = pill(`<span style="width:22px;height:8px;border-radius:4px;background:linear-gradient(90deg,#F6E7BF,${C.gold})"></span><span style="font-size:24px">Gold stitch = proven work</span>`, { left: '34px', top: '600px', zIndex: 3 }, m, { h: 62, pad: 22 }); tl.from(gl, { opacity: 0, y: 10, duration: .4 }, 8.4);
  anchor({ line: `Ask the better ${hl('question.')}`, fact: 'Every builder keeps a record of held work: a threaded map.', src: 'Samatwam builder record', call: 'For parents · Samatwam' });
};

// R12 · Seven Keys
RL[12] = () => {
  foot(24033, { zoom: [1.2, 1.05], grade: 'saturate(.8) brightness(.5)' });
  const door = metal({ ...box(SAFE.l, 520, 330, 860), borderRadius: '26px', zIndex: 10 }, stage, '', 'dark'); tl.from(door, { x: -400, opacity: 0, duration: .7, ease: 'reveal' }, 0);
  const layers = ['Name and class', 'Projects', 'Build records', 'Reviews', 'Certificates', 'Contact details', 'Home address'];
  const stack = glass({ ...box(440, 520, 510, 860), zIndex: 10 }, stage, '', { r: 30 }); tl.from(stack, { x: 300, opacity: 0, duration: .8, ease: 'reveal' }, 2.0);
  label('The record', { left: '28px', top: '26px', zIndex: 2 }, stack);
  layers.forEach((s, i) => { const y = 40 + i * 116; const lk = metal({ left: '115px', top: (y + 30) + 'px', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }, door, `<svg width="34" height="44" viewBox="0 0 34 44"><circle cx="17" cy="14" r="10" fill="#1B1F26"/><path d="M12 20h10l3 22H9z" fill="#1B1F26"/></svg>`, 'silver');
    const r = el('div', { position: 'absolute', left: '28px', right: '28px', top: (76 + i * 112) + 'px', height: '92px', borderRadius: '20px', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px', fontFamily: 'Geist', fontWeight: 500, fontSize: '28px', zIndex: 2, boxSizing: 'border-box', filter: 'blur(7px)', opacity: .5 }, stack, `<span style="font-size:18px;letter-spacing:.12em;color:${C.lsaff}">L${i + 1}</span>${s}`);
    const at = 2.6 + i * .95;
    if (i < 5) { tl.to(lk.querySelector('svg'), { rotate: 90, duration: .3, ease: 'snap' }, at).to(lk, { boxShadow: '0 0 0 3px rgba(242,183,102,.9), 0 0 30px rgba(217,130,43,.7)', duration: .2 }, at + .2).to(r, { filter: 'blur(0px)', opacity: 1, duration: .4 }, at + .2); }
    else { tl.to(lk, { boxShadow: '0 0 0 3px rgba(229,83,61,.85)', duration: .2 }, at); const c = label('Needs parental consent', { right: '24px', top: '36px', fontSize: '15px', color: '#F3A193', zIndex: 3, filter: 'none' }, r); r.appendChild(c); tl.to(r, { opacity: .8, duration: .2 }, at).from(c, { opacity: 0 }, at); } });
  head(`Consent and ${hl('safety.')}`, { t: 230, s: 100, at: 1.6, mode: 'rise', out: 10.6 });
  anchor({ line: `Their record. Their ${hl('consent.')}`, fact: 'Seven levels of sight, each opened only by consent; verifiable parental consent for minors under the DPDP Act 2023.', src: 'DPDP Act 2023 · Samatwam policy', call: 'Data protection by design.' });
};

// R13 · Explain It on Film
RL[13] = () => {
  foot(47903, { zoom: [1.12, 1.0], grade: 'saturate(.6) contrast(1.1) brightness(.6)' });
  el('div', { position: 'absolute', width: 0, height: 0 }, stage, `<svg width="0" height="0"><filter id="chalk"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3"/><feComposite operator="in" in2="SourceGraphic"/></filter></svg>`);
  const ch = head('EXPLAIN THE PELTON WHEEL.', { t: 330, s: 84, at: .1, mode: 'rise', css: { filter: 'url(#chalk)', letterSpacing: '.01em', color: '#F2F2EE' } }); tl.to(ch, { y: -120, scale: .7, transformOrigin: '0 0', duration: .7, ease: 'glide' }, 2.4);
  const cx = 470, cy = 880, R0 = 210;
  const buckets = [...Array(14)].map((_, i) => { const a = i / 14 * Math.PI * 2; const x = cx + Math.cos(a) * R0, y = cy + Math.sin(a) * R0; return `<path d="M${x} ${y} q ${Math.cos(a + 1.2) * 40} ${Math.sin(a + 1.2) * 40}, ${Math.cos(a) * 60} ${Math.sin(a) * 60}" stroke="#F3F1EA" stroke-width="10" stroke-linecap="round"/>`; }).join('');
  const s = svgIn(stage, W, H, `<g class="wh"><circle cx="${cx}" cy="${cy}" r="${R0}" stroke="#F3F1EA" stroke-width="8"/><circle cx="${cx}" cy="${cy}" r="40" fill="#F3F1EA"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${cx} ${cy} L${cx + Math.cos(i * 1.047) * R0} ${cy + Math.sin(i * 1.047) * R0}" stroke="#F3F1EA" stroke-width="5"/>`).join('')}${buckets}</g>
    <path class="nz" d="M940 ${cy - R0 - 30} H${cx + 60}" stroke="#7FB8F0" stroke-width="16" stroke-linecap="round"/><rect x="900" y="${cy - R0 - 60}" width="60" height="60" rx="10" fill="url(#mt2)"/><defs><linearGradient id="mt2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7F8FA"/><stop offset="1" stop-color="#9EA4AC"/></linearGradient></defs>`, { zIndex: 10 });
  tl.set(s, { opacity: 0 }, 0).set(s, { opacity: 1 }, 2.6).from(s.querySelectorAll('.wh > *'), { drawSVG: 0, duration: .9, ease: 'glide', stagger: .02 }, 2.6).from(s.querySelector('.nz'), { drawSVG: '100% 100%', duration: .5, ease: 'glide' }, 4.4);
  const sp = { a: 0 }; tl.to(sp, { a: 1080, duration: 6.5, ease: 'power2.in' }, 4.6); const wh = s.querySelector('.wh'); perFrame.push(() => wh.setAttribute('transform', `rotate(${sp.a} ${cx} ${cy})`));
  const rc = glass({ ...box(SAFE.l, 1170, SAFE.r - SAFE.l, 220), zIndex: 12, padding: '30px 34px' }, stage, '', { r: 30 }); tl.from(rc, { y: 50, opacity: 0, duration: .7, ease: 'reveal' }, 3.0);
  label('Request · Class 11 physics', { left: '34px', top: '30px', zIndex: 2, color: C.lsaff }, rc); txt('A 3-minute film on the Pelton wheel', { left: '32px', top: '72px', fontSize: '40px', zIndex: 2 }, rc); label('From a teacher · Noida', { left: '34px', top: '140px', zIndex: 2, fontSize: '18px' }, rc);
  const st = metal({ right: '30px', top: '40px', padding: '16px 22px', borderRadius: '16px', fontSize: '22px', letterSpacing: '.14em', zIndex: 3, transform: 'rotate(-6deg)' }, rc, 'DELIVERED', 'silver'); tl.from(st, { scale: 2.2, opacity: 0, duration: .4, ease: 'drop' }, 9.4);
  ex({ left: SAFE.l + 'px', top: '1410px' });
  anchor({ line: `Ask once. Teach for ${hl('years.')}`, fact: 'Teachers can ask creators to make films that explain syllabus concepts.', src: 'Samatwam teacher requests', call: 'For teachers · request a film' });
};

// R14 · Post a Problem
RL[14] = () => {
  foot(23377, { zoom: [1.15, 1.0], grade: 'saturate(.8) brightness(.55)' });
  const note = el('div', { position: 'absolute', left: '330px', top: '640px', width: '420px', height: '400px', background: 'linear-gradient(180deg, #FFE08A, #F6CF63)', boxShadow: '0 30px 50px rgba(0,0,0,.45)', transform: 'rotate(-4deg)', zIndex: 10, padding: '50px 40px', boxSizing: 'border-box', fontFamily: 'Geist', fontWeight: 500, fontSize: '50px', lineHeight: '58px', color: '#2A2F38', letterSpacing: '-.02em' }, stage, '');
  typer(note, 'Bracket keeps cracking.', .2, 1.3); tl.from(note, { y: 60, rotate: -14, opacity: 0, duration: .5, ease: 'drop' }, 0).to(note, { scale: .42, left: 50, top: 520, duration: .8, ease: 'glide' }, 2.4).to(note, { opacity: 0, duration: .4 }, 7.4);
  const nodes = [...Array(12)].map((_, i) => [260 + (i % 4) * 190, 860 + Math.floor(i / 4) * 170]); const pick = [1, 6, 11];
  const s = svgIn(stage, W, H, nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="rgba(255,255,255,.4)"/>`).join('') + pick.map(i => `<path class="rt" d="M180 640 C 260 ${nodes[i][1] - 200}, ${nodes[i][0] - 140} ${nodes[i][1]}, ${nodes[i][0]} ${nodes[i][1]}" stroke="${C.lsaff}" stroke-width="3" stroke-dasharray="6 9"/>`).join('') + `<circle cx="540" cy="1130" r="200" stroke="rgba(255,255,255,.18)" stroke-dasharray="3 10"/><circle cx="540" cy="1130" r="330" stroke="rgba(255,255,255,.12)"/>`, { zIndex: 10 });
  tl.from(s.querySelectorAll('circle'), { opacity: 0, scale: 0, transformOrigin: '50% 50%', duration: .4, stagger: .03 }, 2.8).from(s.querySelectorAll('.rt'), { drawSVG: 0, duration: .8, ease: 'glide', stagger: .25 }, 3.6).to(s, { opacity: .2, duration: .5 }, 7.4);
  pick.forEach((i, k) => { const a = metal({ ...box(nodes[i][0] - 46, nodes[i][1] - 46, 92, 92), borderRadius: '50%', zIndex: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', boxShadow: '0 0 0 3px rgba(242,183,102,.85), 0 0 30px rgba(217,130,43,.6)' }, stage, 'ADK'[k], k === 1 ? 'dark' : 'silver'); tl.from(a, { scale: 0, duration: .5, ease: 'snap' }, 4.2 + k * .25).to(a, { opacity: .2, duration: .4 }, 7.4); });
  const lb = label('Routed · 3 certified learners', { left: SAFE.l + 'px', top: '1400px', zIndex: 12, color: C.lsaff }); show(lb, 4.6, 7.3);
  const part = glass({ ...box(SAFE.l + 60, 760, 760, 560), zIndex: 12 }, stage, '', { r: 36 }); tl.from(part, { y: 80, opacity: 0, duration: .8, ease: 'reveal' }, 7.6);
  svgIn(part, 760, 560, `<path d="M160 120 V420 H600" stroke="url(#pm)" stroke-width="70" stroke-linejoin="round"/><path d="M160 260 L320 420" stroke="url(#pm)" stroke-width="40"/><defs><linearGradient id="pm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F8FA"/><stop offset=".5" stop-color="#9EA4AC"/><stop offset="1" stop-color="#E9EBEE"/></linearGradient></defs>`, { zIndex: 2 });
  const tg = pill(`${tick(true, 30)}<span style="font-size:24px">Tested · certificate attached</span>`, { left: '40px', top: '460px', zIndex: 3 }, part, { h: 66, pad: 22, glow: true }); tl.from(tg, { scale: .6, opacity: 0, duration: .5, ease: 'snap' }, 8.6);
  head(`A workforce that builds to ${hl('order.')}`, { t: 210, s: 84, at: 2.4, mode: 'words', out: 10.6 });
  anchor({ line: `Post the problem. Receive a ${hl('proven')} part.`, fact: 'Industry posts a need; certified learners deliver it.', src: 'Samatwam requirements loop', call: 'For industry · partner with us' });
};

// R15 · Hire on Proof
RL[15] = () => {
  foot(23107, { zoom: [1.15, 1.0], grade: 'saturate(.8) brightness(.5)', blur: 3 });
  const bin = metal({ ...box(330, 1290, 420, 200), borderRadius: '0 0 40px 40px', zIndex: 9 }, stage, '', 'dark'); tl.from(bin, { opacity: 0, duration: .4 }, 0).to(bin, { opacity: 0, duration: .4 }, 2.6);
  for (let i = 0; i < 9; i++) { const p = paper({ ...box(250 + (i % 3) * 10, 560 - i * 14, 580, 760), padding: '50px', zIndex: 10 + i }, `<div style="font-weight:500;font-size:34px">Résumé</div>${rows(8)}`); gsap.set(p, { rotate: (i % 2 ? 3 : -3) + i * .4 });
    tl.to(p, { y: 1900, rotate: (i % 2 ? 40 : -40), duration: .8, ease: 'power2.in' }, .6 + i * .12).set(p, { opacity: 0 }, 1.5 + i * .12); }
  const m = glass({ ...box(SAFE.l, 600, SAFE.r - SAFE.l, 720), zIndex: 20 }, stage, '', { r: 36 }); tl.from(m, { scale: .9, opacity: 0, duration: .8, ease: 'reveal' }, 2.6);
  label('Threaded map · A. Learner', { left: '34px', top: '30px', zIndex: 2 }, m);
  const P = [[90, 160], [300, 200], [220, 330], [520, 290], [700, 380], [430, 450], [640, 560], [260, 600], [120, 480]];
  const seg = (a, b) => `M${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2 + 40} ${(a[1] + b[1]) / 2 - 30}, ${b[0]} ${b[1]}`;
  const s = svgIn(m, 878, 720, P.slice(1).map((p, i) => `<path d="${seg(P[i], p)}" stroke="rgba(255,255,255,.55)" stroke-width="3"/>`).join('') + `<path id="g15" class="gd" d="${seg(P[2], P[3])} ${seg(P[3], P[4]).replace('M', 'L')} " stroke="url(#gg15)" stroke-width="12" stroke-linecap="round"/><path class="gd" d="${seg(P[5], P[6])}" stroke="url(#gg15)" stroke-width="12" stroke-linecap="round"/>` + P.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff"/>`).join('') + `<defs><linearGradient id="gg15"><stop offset="0" stop-color="#F6E7BF"/><stop offset=".5" stop-color="${C.gold}"/><stop offset="1" stop-color="#E9D49A"/></linearGradient></defs>`, { zIndex: 2 });
  tl.from(s.querySelectorAll('path:not(.gd)'), { drawSVG: 0, duration: .5, stagger: .15 }, 3.0).from(s.querySelectorAll('.gd'), { drawSVG: 0, duration: .6, stagger: .3 }, 4.6);
  const fg = el('div', { position: 'absolute', left: 0, top: 0, width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,.25)', border: '2px solid #fff', boxShadow: '0 0 30px rgba(242,183,102,.9)', zIndex: 3 }, m);
  tl.fromTo(fg, { opacity: 0 }, { opacity: 1, duration: .3 }, 5.8).to(fg, { motionPath: { path: '#g15', align: '#g15', alignOrigin: [.5, .5] }, duration: 2.6, ease: 'sine.inOut' }, 6.0);
  const tg = pill(`<span style="font-size:24px">Held · tested · 2 proofs</span>`, { left: '34px', top: '620px', zIndex: 3 }, m, { h: 62, pad: 22, glow: true }); tl.from(tg, { opacity: 0, y: 14, duration: .4 }, 8.6);
  head(`Records over ${hl('résumés.')}`, { t: 230, s: 96, at: 2.4, mode: 'rise', out: 10.6 });
  anchor({ line: `Don't read claims. Read ${hl('proofs.')}`, fact: 'Held work is shown only after it has been tested.', src: 'Samatwam builder record', call: 'Samatwam records' });
};

// R16 · NEP Asked For This
RL[16] = () => {
  foot(48165, { zoom: [1.15, 1.0], grade: 'saturate(.8) brightness(.45)', blur: 5 });
  const pg = paper({ ...box(150, 420, 780, 1000), padding: '70px 64px', zIndex: 10, lineHeight: '50px', fontSize: '31px' }, `<div style="font-size:20px;letter-spacing:.16em;color:#6B6F78">MINISTRY OF EDUCATION · GOVERNMENT OF INDIA</div><div style="font-weight:500;font-size:58px;line-height:62px;letter-spacing:-.03em;margin:26px 0 40px">National Education Policy 2020</div>
    <p style="margin:0">Education must move towards less content, and more towards learning how to think critically and solve problems; it must be <span class="mk">competency-based</span>, holistic and <span class="mk">multidisciplinary</span>, and build a culture of <span class="mk">research</span> and innovation.</p>`);
  tl.from(pg, { y: 120, opacity: 0, rotate: 2, duration: .8, ease: 'reveal' }, 0);
  const mks = [...pg.querySelectorAll('.mk')]; mks.forEach((m, i) => { m.style.position = 'relative'; m.style.zIndex = 1; const h = el('span', { position: 'absolute', left: '-4px', right: '-4px', top: '8px', bottom: '2px', background: 'rgba(242,183,102,.7)', zIndex: -1, transformOrigin: '0 50%', borderRadius: '4px' }, m); tl.from(h, { scaleX: 0, duration: .5, ease: 'glide' }, 2.4 + i * .6); });
  tl.to(pg, { opacity: .15, scale: .92, duration: .7 }, 5.2);
  const pos = CLASSES.map((c, i) => [SAFE.l + (i % 2) * 450, 640 + Math.floor(i / 2) * 210]);
  CLASSES.forEach((c, i) => { const t = glass({ ...box(pos[i][0], pos[i][1], 420, 180), zIndex: 12, padding: '30px' }, stage, '', { r: 30 });
    metal({ left: '28px', top: '30px', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }, t, String(i + 1));
    txt(c, { left: '28px', top: '108px', fontSize: '38px', zIndex: 2 }, t); tl.from(t, { y: 80, scale: .7, opacity: 0, duration: .7, ease: 'snap' }, 5.6 + i * .2); });
  head(`Competency. Many disciplines. ${hl('Research.')}`, { t: 200, s: 76, at: 2.4, mode: 'words', out: 10.6 });
  anchor({ line: `Built for the education ${hl('India')} asked for.`, fact: 'NEP 2020: competency-based, multidisciplinary learning; a target GER of 50% by 2035.', src: 'National Education Policy 2020, Ministry of Education', call: 'Partner as an institution' });
};

// R17 · 70 / 15
RL[17] = () => {
  foot(47266, { zoom: [1.15, 1.0], grade: 'saturate(.6) brightness(.5)', blur: 4 });
  const B0 = 1390, ST = 26;
  const plates = [...Array(20)].map((_, i) => { const p = metal({ ...box(390, B0 - i * ST, 300, 20), borderRadius: '7px', zIndex: 10 + i }, stage, '', 'silver'); tl.from(p, { y: -1200, opacity: 0, duration: .35, ease: 'drop' }, i * .07); return p; });
  plates.forEach((p, i) => { if (i < 14) tl.to(p, { left: SAFE.l, width: 280, top: B0 - i * ST, duration: .45, ease: 'glide' }, 2.4 + i * .18);
    else if (i < 17) tl.to(p, { left: 650, width: 280, top: B0 - (i - 14) * ST, background: metalBg('dark'), duration: .45, ease: 'glide' }, 5.2 + (i - 14) * .2);
    else tl.to(p, { left: 400, width: 200, top: B0 - (i - 17) * ST, opacity: .35, duration: .45, ease: 'glide' }, 6.0 + (i - 17) * .1); });
  const a = txt('0%', { left: SAFE.l + 'px', top: '600px', fontSize: '130px', zIndex: 12, letterSpacing: '-.05em' }); const b = txt('0%', { left: '650px', top: '600px', fontSize: '130px', zIndex: 12, letterSpacing: '-.05em', color: C.lsaff });
  count(a, 70, 2.4, 2.6, v => Math.round(v) + '%'); count(b, 15, 5.2, .8, v => Math.round(v) + '%'); tl.from(a, { opacity: 0, duration: .3 }, 2.4).from(b, { opacity: 0, duration: .3 }, 5.2);
  show(label('To builders', { left: SAFE.l + 'px', top: '750px', zIndex: 12 }), 2.4); show(label('Open commons', { left: '650px', top: '750px', zIndex: 12, color: C.lsaff }), 5.2);
  head(`Give ${hl('back.')}`, { t: 260, s: 120, at: 1.8, mode: 'rise', out: 10.6 });
  anchor({ line: `When work earns, it gives ${hl('back.')}`, fact: '70% to builders; 15% to an open commons.', src: 'Samatwam revenue model', call: 'Build it. Prove it. Give it back.' });
};

// R18 · Gold Is Never Given
RL[18] = () => {
  foot(2235, { zoom: [1.15, 1.0], grade: 'saturate(.5) contrast(1.15) brightness(.5)' });
  const c = glass({ ...box(SAFE.l, 820, SAFE.r - SAFE.l, 420), zIndex: 10, padding: '40px' }, stage, '', { r: 36, a: .2 });
  label('Claim', { left: '40px', top: '40px', zIndex: 2 }, c); txt('Lattice bracket holds 2 kN', { left: '38px', top: '86px', fontSize: '56px', zIndex: 2 }, c);
  const gauge = svgIn(c, 878, 420, `<path d="M90 360 A140 140 0 0 1 370 360" stroke="rgba(255,255,255,.2)" stroke-width="18" stroke-linecap="round"/><path class="gv" d="M90 360 A140 140 0 0 1 370 360" stroke="${C.lsaff}" stroke-width="18" stroke-linecap="round"/>`, { zIndex: 2 });
  tl.fromTo(gauge.querySelector('.gv'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 2.4, ease: 'glide' }, 4.0);
  const rd = txt('0.00 kN', { left: '440px', top: '270px', fontSize: '60px', zIndex: 2 }, c); count(rd, 2.04, 4.0, 2.4, v => v.toFixed(2) + ' kN'); const ok = label('', { left: '442px', top: '346px', zIndex: 2, color: C.ok }, c); tl.set(ok, { textContent: 'Held · test passed' }, 6.5);
  const leaf = el('div', { position: 'absolute', left: '160px', top: '470px', width: '700px', height: '300px', zIndex: 12, background: `linear-gradient(115deg, #8A6A26, #F6E7BF 30%, ${C.gold} 55%, #E9D49A 75%, #8A6A26)`, borderRadius: '6px 30px 8px 24px', boxShadow: '0 20px 50px rgba(176,141,60,.45)', opacity: .92 });
  perFrame.push((f, t) => { if (t < 6.8) { leaf.style.transform = `translateY(${Math.sin(t * 2.2) * 26}px) rotate(${Math.sin(t * 1.6) * 4}deg) skewX(${Math.sin(t * 2.8) * 6}deg)`; } });
  tl.from(leaf, { opacity: 0, y: -200, duration: 1, ease: 'reveal' }, 0).to(leaf, { top: 820, left: SAFE.l, width: SAFE.r - SAFE.l, height: 420, borderRadius: '36px', opacity: .55, duration: 1.4, ease: 'glide' }, 6.8);
  const w = metal({ ...box(700, 380, 180, 160), borderRadius: '20px', zIndex: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px' }, stage, '2 kN', 'dark'); tl.from(w, { opacity: 0, duration: .3 }, 3.4).to(w, { y: -80, duration: 1.2, ease: 'glide' }, 3.8).to(w, { opacity: 0, duration: .4 }, 6.4);
  head(`It hovers. It won't ${hl('land.')}`, { t: 220, s: 88, at: 1.6, mode: 'words', out: 6.4 }); head(`Until the test ${hl('passes.')}`, { t: 220, s: 88, at: 6.8, mode: 'words', out: 10.6 });
  ex({ left: SAFE.l + 'px', top: '1290px' });
  anchor({ line: `Gold is never given. Only ${hl('proven.')}`, fact: 'Gold appears only on held, tested work.', src: 'Samatwam visual standard', call: 'Samatwam' });
};

// R19 · The Womb
RL[19] = () => {
  foot(47263, { zoom: [1.2, 1.02], grade: 'saturate(.85) contrast(1.05) brightness(.5)', blur: 2 });
  const dish = glass({ ...box(290, 420, 500, 220), zIndex: 10 }, stage, '', { r: 110, a: .25 }); tl.from(dish, { scale: .6, opacity: 0, duration: .8, ease: 'reveal' }, 0);
  const seed = el('div', { position: 'absolute', left: '220px', top: '80px', width: '60px', height: '40px', borderRadius: '50%', background: 'linear-gradient(160deg, #C9A46A, #7A5A2A)', zIndex: 2, transform: 'rotate(-20deg)' }, dish);
  const R = (k => () => (k = (k * 9301 + 49297) % 233280) / 233280)(11); let d = ''; const ends = [];
  const grow = (x, y, a, l, dep) => { const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; d += `M${x.toFixed(1)} ${y.toFixed(1)} Q ${(x + x2) / 2 + (R() - .5) * 30} ${(y + y2) / 2}, ${x2.toFixed(1)} ${y2.toFixed(1)} `; if (dep === 0) { ends.push([x2, y2]); return; } grow(x2, y2, a - .35 - R() * .2, l * .78, dep - 1); grow(x2, y2, a + .35 + R() * .2, l * .78, dep - 1); };
  grow(540, 560, Math.PI / 2, 210, 3);
  const s = svgIn(stage, W, H, `<path class="rt" d="${d}" stroke="#EADFC8" stroke-width="5" stroke-linecap="round"/><path class="sh" d="M540 540 C 540 470, 520 430, 560 380 M548 460 C 600 440, 630 400, 640 360" stroke="#9BD37F" stroke-width="7" stroke-linecap="round"/>`, { zIndex: 11 });
  tl.from(s.querySelector('.rt'), { drawSVG: 0, duration: 5, ease: 'power1.inOut' }, 2.0).from(s.querySelector('.sh'), { drawSVG: 0, duration: 2, ease: 'glide' }, 3.0);
  ends.sort((a, b) => a[0] - b[0]); const pick = [0, 2, 4, 6, 8, 10].map(i => ends[Math.min(i, ends.length - 1)]);
  pick.forEach(([x, y], i) => { const p = pill(`<span style="font-size:24px">${CLASSES[i]}</span>`, { left: [72, 372, 640, 72, 372, 640][i] + 'px', top: (i < 3 ? 1190 : 1290) + 'px', zIndex: 12 }, stage, { h: 58, pad: 20 }); tl.from(p, { scale: .5, opacity: 0, duration: .5, ease: 'snap' }, 5.2 + i * .45); });
  head(`Growth over feature ${hl('spam.')}`, { t: 210, s: 84, at: 1.4, mode: 'words', out: 10.6 });
  anchor({ line: `We don't add features. We ${hl('grow')} them.`, fact: 'Samatwam places classes of concepts today, and they grow features through conversation with the field.', src: 'Samatwam founding principles', call: 'Samatwam · the institution that learns' });
};

// R20 · Cohort 01
RL[20] = () => {
  foot(49878, { zoom: [1.15, 1.0], grade: 'saturate(.8) brightness(.5)' });
  const st = [[180, 640, 'Rohini'], [360, 760, 'Pitampura'], [540, 860, 'Connaught Place'], [720, 980, 'Noida'], [860, 1120, 'Greater Noida'], [400, 1000, 'Dwarka'], [300, 1180, 'Gurugram'], [620, 1180, 'Faridabad']];
  const lines = [[0, 1, 2, 3, 4], [5, 2], [6, 5], [2, 7]];
  const s = svgIn(stage, W, H, lines.map((L, k) => `<polyline class="ml" points="${L.map(i => st[i].slice(0, 2).join(',')).join(' ')}" stroke="${k ? 'rgba(255,255,255,.85)' : C.saff}" stroke-width="${k ? 10 : 14}" stroke-linecap="round" stroke-linejoin="round"/>`).join('') + st.map(([x, y]) => `<circle class="sn" cx="${x}" cy="${y}" r="16" fill="#0B1020" stroke="#fff" stroke-width="5"/>`).join(''), { zIndex: 10 });
  tl.from(s.querySelectorAll('.ml'), { drawSVG: 0, duration: 1.6, ease: 'glide', stagger: .25 }, .05).from(s.querySelectorAll('.sn'), { scale: 0, transformOrigin: '50% 50%', duration: .3, stagger: .05 }, 1.0);
  const kinds = ['School', 'University', 'University', 'School', 'University', 'School', 'University', 'School'];
  st.forEach(([x, y, n], i) => { const c = s.querySelectorAll('.sn')[i]; const at = 2.6 + i * .7; tl.to(c, { attr: { fill: C.saff, r: 20 }, duration: .25 }, at);
    const lb = label(`${kinds[i]} · ${n}`, { left: clamp(x + 30, SAFE.l, SAFE.r - 330) + 'px', top: (y - 14) + 'px', fontSize: '18px', zIndex: 12, color: C.text, background: 'rgba(11,16,32,.45)', padding: '6px 10px', borderRadius: '10px' }); tl.from(lb, { opacity: 0, x: -10, duration: .3 }, at); });
  const ext = svgIn(stage, W, H, `<path class="ex" d="M860 1120 C 900 1220, 820 1300, 760 1330" stroke="${C.saff}" stroke-width="14" stroke-linecap="round"/>`, { zIndex: 10 }); tl.from(ext.querySelector('.ex'), { drawSVG: 0, duration: .8, ease: 'glide' }, 8.4);
  const med = metal({ ...box(640, 1270, 130, 130), borderRadius: '50%', zIndex: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }, stage, ''); tl.from(med, { scale: 0, duration: .6, ease: 'snap' }, 9.1).to(med, { boxShadow: '0 0 0 4px rgba(242,183,102,.9), 0 0 60px rgba(217,130,43,.8)', duration: .4 }, 9.6);
  perFrame.push(() => { if (!med.dataset.s && SUN) { med.innerHTML = `<div style="width:60px;height:84px;filter:brightness(0) opacity(.78)">${SUN}</div>`; med.dataset.s = 1; } });
  head(`The ${hl('call.')}`, { t: 260, s: 120, at: 1.8, mode: 'rise', out: 10.6 });
  anchor({ line: `Cohort 01. ${hl('Delhi NCR.')}`, fact: 'Cohort 01 is in Delhi NCR, and every student can hold an account.', src: 'Samatwam Cohort 01 plan', call: 'Apply · link in bio' });
};
