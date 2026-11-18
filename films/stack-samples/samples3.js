// Round 3 · illustrated explainer scenes: designer-made unDraw illustrations (recoloured to brand blue),
// built shape by shape with GSAP, plus designed UI overlays that act out each Samatwam idea.
const W = 1920, H = 1080, DUR = 5, FPS = 30;
const INK = '#0B0F17', BLUE = '#2E6FD6', PALE = '#DCE6F8', FIELD = '#EEF2FA', MUTED = '#5E6470', GREEN = '#1F7A3A', RED = '#D9442E';
gsap.registerPlugin(SplitText, DrawSVGPlugin, ScrambleTextPlugin);
const stage = document.getElementById('stage');
const tl = gsap.timeline({ paused: true });
const perFrame = [];
const full = { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px' };
function el(tag, css = {}, parent = stage, html = '') { const e = document.createElement(tag); Object.assign(e.style, css); if (html) e.innerHTML = html; parent.appendChild(e); return e; }
function text(s, css, parent = stage) { return el('div', { position: 'absolute', fontFamily: 'Geist', fontWeight: 500, color: INK, whiteSpace: 'nowrap', ...css }, parent, s); }
function mono(s, css, parent = stage) { return text(s, { fontFamily: 'GeistMono', fontWeight: 400, fontSize: '15px', letterSpacing: '3px', textTransform: 'uppercase', color: MUTED, ...css }, parent); }
function grain(op = .07) { const s = el('div', { ...full, mixBlendMode: 'multiply', opacity: op, pointerEvents: 'none', zIndex: 50 }, stage, `<svg width="${W}" height="${H}"><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="1"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg>`); const tb = s.querySelector('feTurbulence'); perFrame.push(f => tb.setAttribute('seed', String(f % 19 + 1))); }
// a floating UI card in the house style
function card(css, html, parent = stage) { return el('div', { position: 'absolute', background: '#FFFFFF', border: '1px solid #DDE3EE', borderRadius: '14px', boxShadow: '0 1px 2px rgba(11,15,23,.06), 0 12px 32px rgba(11,15,23,.10)', fontFamily: 'Geist', color: INK, ...css }, parent, html); }
const tickSVG = (c = GREEN, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${c}"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// the shared scene frame: colour field, organic blob, editorial type, the illustration built shape by shape
async function scene({ svg, kicker, head, sub, x = 860, y = 150, w = 940, blob = '#DCE6F8' }) {
  el('div', { ...full, background: FIELD });
  const bl = el('div', { position: 'absolute', left: (x - 80) + 'px', top: (y - 60) + 'px', width: (w + 160) + 'px', height: '860px' }, stage,
    `<svg width="${w + 160}" height="860" viewBox="0 0 1100 860"><path d="M560 40C760 30 1010 120 1060 330C1110 540 960 780 690 820C420 860 140 800 70 600C0 400 120 160 300 90C390 55 470 44 560 40Z" fill="${blob}"/></svg>`);
  tl.from(bl, { scale: .7, opacity: 0, transformOrigin: '50% 55%', duration: 1.1, ease: 'expo.out' }, 0);
  const holder = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: '760px', display: 'flex', alignItems: 'center', justifyContent: 'center' });
  holder.innerHTML = await (await fetch('../shared/illus/' + svg)).text();
  const s = holder.querySelector('svg'); s.style.width = w + 'px'; s.style.height = '720px'; s.removeAttribute('class');
  // build from the ground up: leaf shapes sorted by vertical position, bottom first
  const shapes = [...s.querySelectorAll('path,circle,rect,ellipse,polygon,polyline,line')].map(e => { const b = e.getBBox(); return { e, y: b.y + b.height, a: b.width * b.height }; }).filter(o => o.a > 0);
  shapes.sort((a, b) => b.y - a.y);
  const n = shapes.length, span = 1.25;
  shapes.forEach((o, i) => tl.from(o.e, { opacity: 0, scale: .5, y: 14, transformOrigin: '50% 100%', duration: .55, ease: 'back.out(1.6)' }, .25 + span * i / n));
  tl.to(holder, { y: -10, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 1.6);
  // type
  const k = mono(kicker, { left: '140px', top: '250px', color: BLUE });
  const h = text(head, { left: '140px', top: '296px', fontSize: '76px', letterSpacing: '-2.6px', lineHeight: '82px', whiteSpace: 'normal', width: '660px' });
  const p = text(sub, { left: '142px', top: '0px', fontSize: '26px', fontWeight: 400, color: '#3C4250', lineHeight: '36px', whiteSpace: 'normal', width: '600px' });
  const hl = SplitText.create(h, { type: 'lines,words', mask: 'lines' });
  p.style.top = (296 + hl.lines.length * 82 + 26) + 'px';
  tl.from(k, { opacity: 0, x: -12, duration: .6, ease: 'power3.out' }, .2).from(hl.lines, { yPercent: 105, duration: 1, ease: 'expo.out', stagger: .1 }, .3).from(p, { opacity: 0, y: 12, duration: .7, ease: 'power3.out' }, .9);
  grain();
  return { x, y, w, svg: s, subTop: parseFloat(p.style.top) + p.offsetHeight };
}

const SCENES = {
  // 17 · THE QUESTION
  async question() {
    await scene({ svg: 'undraw-Thoughts.svg', kicker: 'Step 1 · Question', head: 'Every work begins with a real question.', sub: 'A learner, a teacher or an industry partner names a problem worth solving.' });
    const qs = ['Can bamboo fibre stiffen a beam?', 'Why does Ward 7 breathe worse air?', 'Can a clinic get splints under ₹200?'];
    qs.forEach((q, i) => { const c = card({ left: (1040 + (i % 2) * 260) + 'px', top: (190 + i * 92) + 'px', padding: '14px 20px', fontSize: '21px', display: 'flex', gap: '12px', alignItems: 'center' }, `<span style="font-family:GeistMono;color:${BLUE};font-size:20px">?</span>${q}`);
      tl.from(c, { opacity: 0, y: 30, scale: .9, duration: .8, ease: 'back.out(1.7)' }, 1.5 + i * .35).to(c, { y: -6, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 2.3 + i * .2); });
  },
  // 18 · THE STUDIO
  async studio() {
    await scene({ svg: 'undraw-WorkingLate.svg', kicker: 'The Studio', head: 'A laptop is enough.', sub: 'Small models, Skills for AI and cloud compute, prepared by Samatwam, so no learner needs a powerful computer.' });
    const items = [['Small model', 'ready'], ['Skills for AI', '12 loaded'], ['Cloud compute', '4 GPU-hours']];
    const c = card({ left: '1330px', top: '170px', width: '380px', padding: '20px 22px', display: 'grid', gap: '14px' }, `<div style="font-family:GeistMono;font-size:13px;letter-spacing:2px;color:${MUTED}">LEARNER WORKSPACE</div>`);
    tl.from(c, { opacity: 0, y: 24, duration: .8, ease: 'back.out(1.5)' }, 1.4);
    items.forEach(([a, b], i) => { const r = el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '21px' }, c, `<span>${a}</span><span style="font-family:GeistMono;font-size:15px;color:${GREEN}">● ${b}</span>`); tl.from(r, { opacity: 0, x: -12, duration: .5, ease: 'power3.out' }, 1.9 + i * .3); });
    const bar = el('div', { height: '6px', background: '#E6EBF5', borderRadius: '3px', overflow: 'hidden' }, c); const fill = el('div', { height: '100%', width: '100%', background: BLUE, transformOrigin: '0 50%' }, bar);
    tl.from(fill, { scaleX: 0, duration: 2, ease: 'power2.inOut' }, 2.6);
  },
  // 19 · TEST BENCH
  async testbench() {
    await scene({ svg: 'undraw-Checklist.svg', kicker: 'The Test Bench', head: 'Every claim is tested against reality.', sub: 'Simulation trials, validation cases, reproductions and user tests. Only what passes is certified.' });
    const claims = [['Flow rate meets 40 L/h', 1], ['Turbidity below 1 NTU', 1], ['Lasts 5 years outdoors', 0]];
    const c = card({ left: '1060px', top: '640px', width: '600px', padding: '18px 22px', display: 'grid', gap: '12px' }, `<div style="font-family:GeistMono;font-size:13px;letter-spacing:2px;color:${MUTED}">CLAIMS · WATER FILTER V2</div>`);
    tl.from(c, { opacity: 0, y: 30, duration: .8, ease: 'back.out(1.5)' }, 1.3);
    claims.forEach(([s, ok], i) => { const r = el('div', { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '22px' }, c, `<span class="mk" style="display:inline-flex;width:24px;height:24px;border-radius:12px;border:2px solid #C9D2E2"></span><span style="flex:1">${s}</span><span class="st" style="font-family:GeistMono;font-size:14px;letter-spacing:1px;color:${ok ? GREEN : RED}">${ok ? 'PASSED' : 'UNTESTED'}</span>`);
      const mk = r.querySelector('.mk'), st = r.querySelector('.st'); const t0 = 2.0 + i * .55;
      tl.from(r, { opacity: 0, duration: .3 }, 1.6 + i * .15).to(mk, { borderColor: ok ? GREEN : RED, backgroundColor: ok ? GREEN : '#FFFFFF', duration: .25 }, t0).from(st, { opacity: 0, x: 10, duration: .35 }, t0 + .1);
      if (ok) { mk.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 12.5l3.6 3.6L18 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>'; tl.from(mk.querySelector('path'), { drawSVG: '0%', duration: .3 }, t0 + .05); } });
  },
  // 20 · PEOPLE CERTIFY
  async certify() {
    await scene({ svg: 'undraw-Confirmed.svg', kicker: 'Certification', head: 'People certify.', sub: 'A named reviewer certifies exactly what passed, with reasons. No AI tool can pass or fail a work.' });
    const c = card({ left: '1290px', top: '520px', width: '440px', padding: '22px 24px', display: 'grid', gap: '8px' }, `<div style="font-family:GeistMono;font-size:13px;letter-spacing:2px;color:${MUTED}">CERTIFICATE</div><div style="font-size:30px;letter-spacing:-.6px">SAM-ENG-2027-0042</div><div style="font-size:19px;color:#3C4250">2 claims passed · 1 marked untested</div><div class="rv" style="font-size:19px;color:${BLUE}">Reviewed by a named engineer</div>`);
    const stamp = el('div', { position: 'absolute', left: '1610px', top: '350px', width: '150px', height: '150px', borderRadius: '50%', border: `4px solid ${GREEN}`, color: GREEN, fontFamily: 'GeistMono', fontSize: '16px', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: '22px', transform: 'rotate(-12deg)', background: 'rgba(255,255,255,.85)' }, stage, 'CERTIFIED<br>· SL3 ·');
    tl.from(c, { opacity: 0, y: 30, duration: .8, ease: 'back.out(1.5)' }, 1.4).from(c.querySelector('.rv'), { opacity: 0, duration: .4 }, 2.4)
      .from(stamp, { scale: 2.4, opacity: 0, duration: .45, ease: 'power4.in' }, 2.9).to(stamp, { scale: 1.06, duration: .12, yoyo: true, repeat: 1 }, 3.35);
  },
  // 21 · BUILD RECORD
  async record() {
    await scene({ svg: 'undraw-AtWork.svg', kicker: 'The Build Record', head: 'Proof travels with the work.', sub: 'Every work carries its authors, the AI tools used, its sources, its licence and a fingerprint that shows if it is altered.' });
    const rows = [['Authors', 'A. Learner, B. Learner'], ['AI tools used', 'Disclosed, with versions'], ['Sources', '3 checked against origin'], ['Licence', 'Open, chosen by the makers'], ['Fingerprint', 'a91f 3c07 e2b8 51d4']];
    const c = card({ left: '1150px', top: '600px', width: '600px', padding: '18px 22px', display: 'grid', gap: '10px' }, `<div style="font-family:GeistMono;font-size:13px;letter-spacing:2px;color:${MUTED}">BUILD RECORD</div>`);
    tl.from(c, { opacity: 0, y: 30, duration: .8, ease: 'back.out(1.5)' }, 1.3);
    rows.forEach(([k, v], i) => { const r = el('div', { display: 'flex', justifyContent: 'space-between', fontSize: '19px', borderTop: '1px solid #EDF0F5', paddingTop: '8px' }, c, `<span style="font-family:GeistMono;font-size:13px;letter-spacing:1px;color:${MUTED};text-transform:uppercase">${k}</span><span class="v" style="color:${i === 4 ? BLUE : INK};font-family:${i === 4 ? 'GeistMono' : 'Geist'}"></span>`);
      tl.from(r, { opacity: 0, duration: .25 }, 1.7 + i * .3).to(r.querySelector('.v'), { scrambleText: { text: v, chars: i === 4 ? '0123456789abcdef' : 'lowerCase', speed: .8 }, duration: .7 }, 1.75 + i * .3); });
  },
  // 22 · REQUIREMENT EXCHANGE
  async exchange() {
    await scene({ svg: 'undraw-ConnectingTeams.svg', kicker: 'The Requirement Exchange', head: 'Real needs, met by certified makers.', sub: 'Teachers, industry and public bodies post what they need. Certified learners are matched to deliver it, and are paid.' });
    const need = card({ left: '1000px', top: '170px', padding: '14px 20px', fontSize: '21px', display: 'grid', gap: '4px' }, `<span style="font-family:GeistMono;font-size:12px;letter-spacing:2px;color:${MUTED}">POSTED BY A CLINIC</span>Low-cost splints in 5 sizes`);
    const match = card({ left: '1380px', top: '690px', padding: '14px 20px', fontSize: '21px', display: 'grid', gap: '4px' }, `<span style="font-family:GeistMono;font-size:12px;letter-spacing:2px;color:${GREEN}">MATCHED · CERTIFIED TEAM</span>Delivery agreed · paid on acceptance`);
    const line = el('div', { position: 'absolute', left: 0, top: 0 }, stage, `<svg width="${W}" height="${H}"><path d="M1180 250 C 1500 300, 1700 520, 1560 690" fill="none" stroke="${BLUE}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/></svg>`).querySelector('path');
    tl.from(need, { opacity: 0, y: 24, duration: .8, ease: 'back.out(1.6)' }, 1.4).from(line, { drawSVG: '0%', duration: 1.1, ease: 'power2.inOut' }, 2.0).from(match, { opacity: 0, y: 24, duration: .8, ease: 'back.out(1.6)' }, 2.9);
  },
  // 23 · THE COMMONS
  async commons() {
    await scene({ svg: 'undraw-BuildingBlocks.svg', kicker: 'The Commons', head: 'What is proven becomes ground for the next work.', sub: 'Certified works are shared openly, so each cohort builds on the last instead of starting from scratch.' });
    const c = card({ left: '1440px', top: '170px', width: '300px', padding: '18px 22px', display: 'grid', gap: '4px' }, `<div style="font-family:GeistMono;font-size:12px;letter-spacing:2px;color:${MUTED}">IN THE COMMONS</div><div class="n" style="font-size:64px;letter-spacing:-2px;font-variant-numeric:tabular-nums">0</div><div style="font-size:18px;color:#3C4250">certified works, reused <span class="r">0</span> times</div>`);
    const o = { n: 0, r: 0 }; tl.from(c, { opacity: 0, y: 24, duration: .8, ease: 'back.out(1.6)' }, 1.5).to(o, { n: 248, r: 1312, duration: 2.6, ease: 'power3.out', onUpdate: () => { c.querySelector('.n').textContent = Math.round(o.n); c.querySelector('.r').textContent = Math.round(o.r).toLocaleString('en-IN'); } }, 1.8);
    mono('Example figures', { left: '1442px', top: '370px', fontSize: '11px', letterSpacing: '2px' });
  },
  // 24 · SIMULATION
  async science() {
    await scene({ svg: 'undraw-Science.svg', kicker: 'Class · Simulation', head: 'Test the world before you change it.', sub: 'Heat, stress, flow and motion are simulated, then checked against real measurements before anyone builds.' });
    const c = card({ left: '1050px', top: '640px', width: '560px', padding: '16px 20px' }, `<div style="font-family:GeistMono;font-size:12px;letter-spacing:2px;color:${MUTED};margin-bottom:6px">SIMULATED vs MEASURED</div><svg width="520" height="120" viewBox="0 0 520 120"><path class="sim" d="M0 20 C 120 30, 200 70, 300 88 S 460 104, 520 106" fill="none" stroke="${BLUE}" stroke-width="3.5"/>${[[40, 26], [130, 44], [220, 70], [320, 90], [420, 100], [500, 104]].map(([x, y]) => `<circle class="pt" cx="${x}" cy="${y + (x % 3) - 1}" r="7" fill="#fff" stroke="${INK}" stroke-width="2.4"/>`).join('')}</svg><div class="v" style="font-family:GeistMono;font-size:14px;color:${GREEN};letter-spacing:1px">MAX DEVIATION 3.1% · SL3 VALIDATED</div>`);
    tl.from(c, { opacity: 0, y: 24, duration: .8, ease: 'back.out(1.5)' }, 1.4).from(c.querySelector('.sim'), { drawSVG: '0%', duration: 1.3, ease: 'power2.inOut' }, 1.8)
      .from(c.querySelectorAll('.pt'), { scale: 0, transformOrigin: '50% 50%', duration: .35, stagger: .12, ease: 'back.out(2.5)' }, 2.6).from(c.querySelector('.v'), { opacity: 0, duration: .4 }, 3.5);
  },
  // 25 · COHORT 1
  async cohort() {
    await scene({ svg: 'undraw-BackToSchool.svg', kicker: 'Cohort 1 · January 2027 · online', head: 'Built on a cohort that already worked.', sub: 'Samatwam grows from uInfinitum, which reached 30 schools and 104 paying students. Cohort 1 opens four classes.' });
    const stats = [['30', 'schools reached'], ['104', 'paying students'], ['150', 'learners, Cohort 1'], ['4', 'classes open']];
    stats.forEach(([v, l], i) => { const c = card({ left: (1010 + (i % 2) * 360) + 'px', top: (i < 2 ? 170 : 700) + 'px', width: '320px', padding: '16px 20px', display: 'grid', gap: '2px' }, `<div class="n" style="font-size:56px;letter-spacing:-2px;font-variant-numeric:tabular-nums">0</div><div style="font-size:18px;color:#3C4250">${l}</div>`);
      const o = { n: 0 }; tl.from(c, { opacity: 0, y: 24, scale: .94, duration: .7, ease: 'back.out(1.6)' }, 1.4 + i * .22).to(o, { n: +v, duration: 1.4, ease: 'power3.out', onUpdate: () => { c.querySelector('.n').textContent = Math.round(o.n); } }, 1.6 + i * .22); });
  },
  // 26 · THREE NATIONS
  async nations() {
    await scene({ svg: 'undraw-MapLight.svg', kicker: 'Access', head: 'One standard. Three nations.', sub: 'Bharat, Nepal and Nigeria: different places, the same tests and the same certificate.' });
    const pins = [['Bharat', 1180, 470], ['Nepal', 1330, 330], ['Nigeria', 1560, 560]];
    pins.forEach(([n, x, y], i) => { const p = el('div', { position: 'absolute', left: (x - 22) + 'px', top: (y - 60) + 'px', width: '44px', height: '60px' }, stage, `<svg width="44" height="60" viewBox="0 0 44 60"><path d="M22 58C22 58 4 34 4 22a18 18 0 1 1 36 0c0 12-18 36-18 36z" fill="${INK}"/><circle cx="22" cy="22" r="7" fill="#fff"/></svg>`);
      const lb = card({ left: (x + 30) + 'px', top: (y - 66) + 'px', padding: '8px 14px', fontSize: '19px' }, `${n} <span style="font-family:GeistMono;font-size:12px;color:${GREEN};letter-spacing:1px">· LIVE</span>`);
      tl.from(p, { y: -120, opacity: 0, duration: .6, ease: 'bounce.out' }, 1.5 + i * .3).from(lb, { opacity: 0, x: -10, duration: .4 }, 1.9 + i * .3); });
  },
};

// ------------------------------------------------------------------ frame control for the recorder
window.DUR = DUR; window.EV = [];
const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
const ready = (async () => { for (const f of ['500 76px Geist', '400 26px Geist', '15px GeistMono']) await document.fonts.load(f); await SCENES[window.SAMPLE](); })();
window.render = async function (t) { await ready; const f = Math.min(Math.round(t * FPS), DUR * FPS - 1); tl.seek(t, false); perFrame.forEach(fn => fn(f)); await raf(); };
window.READY = true;
