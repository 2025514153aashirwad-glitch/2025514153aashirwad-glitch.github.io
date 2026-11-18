// Samatwam style frames: eight compositions in one system (dark field, saffron to white, Geist, the Samatwam mark).
const S = BLUE; // saffron ramp from board.js: deep, saffron, light saffron, cream
const INKBG = '#050608';
function bgField(glows) { el('div', { ...full, background: INKBG }); glows.forEach(([x, y, r, a]) => el('div', { ...full, background: `radial-gradient(${r}px ${r * .8}px at ${x}px ${y}px, rgba(217,130,43,${a}), rgba(217,130,43,0) 70%)` })); }
function hdr(label1, label2) { label(`Samatwam · ${label1}`, { left: '104px', top: '56px', fontSize: '13px', letterSpacing: '.16em', color: 'rgba(255,255,255,.62)' }); label(label2, { right: '104px', top: '56px', fontSize: '13px', letterSpacing: '.16em', color: 'rgba(255,255,255,.36)' }); }
const T = (s, css, p = stage) => txt(s, { whiteSpace: 'normal', letterSpacing: '-.04em', ...css }, p);
const L = (s, css, p = stage) => label(s, { fontSize: '14px', letterSpacing: '.14em', color: 'rgba(255,255,255,.55)', ...css }, p);
const panel = (css, p = stage) => el('div', { position: 'absolute', boxSizing: 'border-box', borderRadius: '24px', background: '#0D0E11', border: '1px solid rgba(255,255,255,.07)', ...css }, p);
const satGrad = `linear-gradient(180deg, ${S[0]} 0%, ${S[1]} 40%, ${S[2]} 70%, #FFFFFF 100%)`;
const hl2 = s => `<span style="background:linear-gradient(90deg,${S[2]},${S[1]});-webkit-background-clip:text;background-clip:text;color:transparent">${s}</span>`;
function orb(x, y, r, inner = '') { const b = el('div', { position: 'absolute', left: (x - r) + 'px', top: (y - r) + 'px', width: r * 2 + 'px', height: r * 2 + 'px' });
  el('div', { position: 'absolute', inset: (-r * .25) + 'px', borderRadius: '50%', background: `radial-gradient(circle, rgba(217,130,43,0) 48%, rgba(217,130,43,.35) 60%, rgba(217,130,43,0) 74%)`, filter: 'blur(14px)' }, b);
  el('div', { position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from 200deg, rgba(217,130,43,0), ${S[1]} 35%, #FFF4E6 52%, rgba(217,130,43,0) 80%)`, webkitMask: 'radial-gradient(circle, transparent 62%, #000 63%, #000 67%, transparent 68%)', mask: 'radial-gradient(circle, transparent 62%, #000 63%, #000 67%, transparent 68%)' }, b);
  el('div', { position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,.08)' }, b);
  if (inner) el('div', { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }, b, inner); return b; }

const FRAMES = {
  // 1 · Statement poster: what Samatwam is, in one sentence
  1: () => { bgField([[1350, 520, 900, .22]]); hdr('Statement', 'Style · Poster');
    T(`Samatwam turns learners into ${hl2('certified builders.')}`, { left: '104px', top: '250px', width: '900px', fontSize: '104px', lineHeight: '104px' });
    T('An open research and engineering institution: learners build real things, prove them, and own what they make.', { left: '108px', top: '640px', width: '760px', fontSize: '28px', lineHeight: '40px', fontWeight: 400, color: 'rgba(255,255,255,.7)', letterSpacing: '-.01em' });
    orb(1400, 520, 300, LOGO(170));
    [['6', 'classes'], ['01', 'cohort · Delhi NCR'], ['150', 'learners · Jan 2027']].forEach(([n, l], i) => { T(n, { left: (108 + i * 300) + 'px', top: '820px', fontSize: '64px' }); L(l, { left: (110 + i * 300) + 'px', top: '900px' }); }); },
  // 2 · The output: a Build Record, one object in macro
  2: () => { bgField([[960, 560, 1100, .32]]); hdr('What a learner leaves with', 'Style · Object');
    const c = glass({ left: '560px', top: '170px', width: '800px', height: '740px', padding: '48px' }, stage, '', { r: 36, a: .12 });
    L('Build record', { left: '48px', top: '48px', color: S[2] }, c); T('Lattice bracket, 2 kN', { left: '46px', top: '82px', fontSize: '56px' }, c);
    [['Authors', 'A. Learner, B. Learner'], ['AI tools used', 'Disclosed, with versions'], ['Sources', '3 checked at origin'], ['Licence', 'Chosen by the makers'], ['Fingerprint', 'a91f 3c07 e2b8 51d4']].forEach(([k, v], i) => { const y = 210 + i * 86;
      el('div', { position: 'absolute', left: '48px', right: '48px', top: y + 'px', height: '1px', background: 'rgba(255,255,255,.18)' }, c); L(k, { left: '48px', top: (y + 30) + 'px' }, c); T(v, { right: '48px', top: (y + 22) + 'px', fontSize: '30px', textAlign: 'right', letterSpacing: '-.01em' }, c); });
    const seal = el('div', { position: 'absolute', right: '44px', top: '40px', width: '120px', height: '120px', borderRadius: '50%', background: `linear-gradient(160deg, ${GOLD[3]}, ${GOLD[1]} 50%, ${GOLD[2]} 62%, ${GOLD[0]})`, boxShadow: 'inset 0 0 0 7px rgba(255,255,255,.2), 0 18px 40px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, c, `<div style="filter:brightness(0);opacity:.7">${LOGO(56)}</div>`);
    L('Certified · Open Research · example', { left: '48px', bottom: '96px', color: GOLD[2] }, c); },
  // 3 · Our role: Samatwam at the centre of learners, teachers, industry and government
  3: () => { bgField([[960, 560, 700, .25]]); hdr('Our role', 'Style · System');
    const cx = 960, cy = 560; const s = svgIn(stage, W, H, [230, 380].map(r => `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="rgba(255,255,255,.1)" stroke-dasharray="3 7"/>`).join('') +
      [[-90, 230], [30, 230], [150, 230], [-40, 380], [60, 380], [180, 380], [250, 380]].map(([a, r]) => { const x = cx + Math.cos(a * Math.PI / 180) * r, y = cy + Math.sin(a * Math.PI / 180) * r; return `<path d="M${cx} ${cy} Q ${(cx + x) / 2 + 40} ${(cy + y) / 2 - 40} ${x} ${y}" stroke="url(#sg)" stroke-width="1.6"/>`; }).join('') + `<defs><linearGradient id="sg"><stop offset="0" stop-color="${S[1]}"/><stop offset="1" stop-color="#FFF4E6" stop-opacity=".4"/></linearGradient></defs>`);
    orb(cx, cy, 120, LOGO(90));
    [[-90, 230, 'Learners'], [30, 230, 'Teachers'], [150, 230, 'Mentors'], [-40, 380, 'Industry'], [60, 380, 'Schools'], [180, 380, 'Government'], [250, 380, 'Creators']].forEach(([a, r, n]) => { const x = cx + Math.cos(a * Math.PI / 180) * r, y = cy + Math.sin(a * Math.PI / 180) * r;
      pill(`<span style="width:9px;height:9px;border-radius:50%;background:${r < 300 ? '#fff' : S[2]}"></span><span style="font-size:22px">${n}</span>`, { left: (x - 80) + 'px', top: (y - 28) + 'px' }, stage, { h: 56, pad: 22, a: .14 }); });
    T('We set the standard, test the work, and connect it to the people who need it.', { left: '104px', top: '930px', width: '1100px', fontSize: '32px', letterSpacing: '-.02em' }); },
  // 4 · Six classes, six kinds of output (bento)
  4: () => { bgField([[400, 300, 700, .18], [1600, 900, 700, .15]]); hdr('Six classes, six outputs', 'Style · Bento');
    const C = [['Build', 'cube', 'Working prototypes'], ['Open Research', 'seal', 'Certified claims'], ['Simulation', 'loop', 'Validated models'], ['Physical AI', 'target', 'Trained machines'], ['Creative Arena', 'spark', 'Films of Bharat'], ['Data', 'doc', 'Usable datasets']];
    C.forEach(([n, ic, o], i) => { const x = 104 + (i % 3) * 580, y = 130 + Math.floor(i / 3) * 440; const p = panel({ left: x + 'px', top: y + 'px', width: '552px', height: '412px', overflow: 'hidden' });
      if (i === 1) { el('div', { position: 'absolute', inset: '14px', borderRadius: '16px', background: satGrad }, p); }
      el('div', { position: 'absolute', left: '36px', top: '36px', width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 1 ? 'rgba(255,255,255,.22)' : 'rgba(217,130,43,.16)', border: '1px solid rgba(255,255,255,.2)' }, p, icon(ic, 32, '#fff'));
      L(`Class ${String(i + 1).padStart(2, '0')}`, { left: '38px', top: '260px', color: i === 1 ? 'rgba(26,15,5,.7)' : 'rgba(255,255,255,.5)' }, p); T(n, { left: '36px', top: '290px', fontSize: '44px', color: i === 1 ? '#1A0F05' : '#F5F3EE' }, p); L(o, { left: '38px', top: '352px', color: i === 1 ? '#5A2D0C' : S[2] }, p); }); },
  // 5 · Contribution: where the value goes (editorial data)
  5: () => { bgField([[1500, 400, 800, .2]]); hdr('Contribution', 'Style · Editorial data');
    T(`When work earns,<br>it ${hl2('gives back.')}`, { left: '104px', top: '160px', width: '900px', fontSize: '96px', lineHeight: '96px' });
    const y = 560, w = 1712; const bar = el('div', { position: 'absolute', left: '104px', top: y + 'px', width: w + 'px', height: '120px', borderRadius: '20px', overflow: 'hidden', display: 'flex' });
    [[70, satGrad.replace('180deg', '90deg'), 'To the builders'], [15, `linear-gradient(90deg, ${S[3]}, #FFFFFF)`, 'To the open commons'], [15, 'rgba(255,255,255,.08)', 'Platform and operations']].forEach(([v, bg, l], i) => { const seg = el('div', { width: v + '%', height: '100%', background: bg, borderRight: i < 2 ? '3px solid #050608' : 'none' }, bar);
      T(v + '%', { position: 'relative', left: '28px', top: '22px', fontSize: '64px', color: i === 2 ? '#fff' : '#1A0F05' }, seg); });
    [[0, 'To the builders'], [70, 'To the open commons'], [85, 'Platform and operations']].forEach(([p, l]) => L(l, { left: (104 + w * p / 100) + 'px', top: (y + 140) + 'px' }));
    L('Source · Samatwam creator terms. The remaining 15% split is illustrative.', { left: '104px', top: '900px', fontSize: '13px', color: 'rgba(255,255,255,.4)' }); },
  // 6 · Physical AI: the five wearables as a product lineup, the ring rendered in Blender
  6: () => { bgField([[960, 700, 1100, .2]]); hdr('Physical AI · wearables', 'Style · Lineup');
    T('Five wearables. Five small models that never leave the body.', { left: '104px', top: '130px', width: '1300px', fontSize: '56px', lineHeight: '62px' });
    const P = [['Ring', 'Strain', 'pulse'], ['Band', 'Gesture', 'move'], ['Glasses', 'Sight', 'target'], ['Glove', 'Grasp', 'people'], ['Pendant', 'Sound', 'bolt']];
    P.forEach(([n, d, ic], i) => { const x = 104 + i * 348, p = panel({ left: x + 'px', top: '330px', width: '324px', height: '600px', overflow: 'hidden' });
      if (i === 0) { const im = el('img', { position: 'absolute', left: '-120px', top: '40px', width: '560px', height: '315px', objectFit: 'cover' }, p); im.src = '../../ringfilm/shared/renders/stills/black_hero.png'; }
      else el('div', { position: 'absolute', left: '50%', top: '190px', transform: 'translate(-50%,-50%)', width: '150px', height: '150px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(217,130,43,.18), rgba(217,130,43,0) 70%)' }, p, icon(ic, 54, 'rgba(255,255,255,.85)', 1.3));
      L(`W${i + 1}`, { left: '28px', top: '420px', color: S[2] }, p); T(n, { left: '26px', top: '450px', fontSize: '44px' }, p); L(d + ' · edge model', { left: '28px', top: '512px' }, p);
      L(i ? 'Concept · to be modelled' : 'Modelled in Blender', { left: '28px', top: '548px', fontSize: '11px', color: 'rgba(255,255,255,.35)' }, p); }); },
  // 7 · The requirement loop as a product flow, with a cursor mid-action
  7: () => { bgField([[1300, 300, 800, .18]]); hdr('Requirement Exchange', 'Style · Product flow');
    T('Industry posts a need. Certified learners build it.', { left: '104px', top: '140px', width: '1300px', fontSize: '60px', lineHeight: '66px' });
    const N = [['Posted', 'pin', 'Clinic · splints in 5 sizes'], ['Matched', 'people', '3 of 40 learners'], ['Built', 'cube', 'Tested against the brief'], ['Delivered', 'check', 'Paid on acceptance']];
    N.forEach(([n, ic, d], i) => { const x = 104 + i * 440; const g = glass({ left: x + 'px', top: '440px', width: '400px', height: '300px', padding: '34px' }, stage, '', { r: 28, a: i === 1 ? .22 : .1 });
      if (i === 1) g.style.boxShadow += `, 0 0 0 1.5px ${S[2]}, 0 0 60px rgba(217,130,43,.45)`;
      el('div', { position: 'absolute', left: '34px', top: '34px' }, g, icon(ic, 36, '#fff')); L(`Step ${i + 1}`, { left: '36px', top: '150px', color: S[2] }, g); T(n, { left: '34px', top: '178px', fontSize: '44px' }, g); L(d, { left: '36px', top: '240px', letterSpacing: '.06em' }, g);
      if (i < 3) el('div', { position: 'absolute', left: (x + 400) + 'px', top: '588px', width: '40px', height: '2px', background: `linear-gradient(90deg, ${S[1]}, ${S[3]})` }); });
    el('div', { position: 'absolute', left: '780px', top: '610px', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.5))' }, stage, '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M4 2.5l15 9.2-6.6 1.3 3.8 7.2-2.6 1.4-3.8-7.3L5 19z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>');
    L('REQ-0081 · example', { left: '104px', top: '800px' }); },
  // 8 · Track record to launch: a milestone timeline
  8: () => { bgField([[1500, 560, 900, .2]]); hdr('Track record', 'Style · Timeline');
    T(`Built on a cohort that ${hl2('already worked.')}`, { left: '104px', top: '140px', width: '1300px', fontSize: '72px', lineHeight: '76px' });
    const y = 560; el('div', { position: 'absolute', left: '104px', top: y + 'px', width: '1712px', height: '2px', background: `linear-gradient(90deg, rgba(255,255,255,.2), ${S[1]} 70%, #FFF4E6)` });
    [[0, 'uInfinitum', '30', 'schools reached'], [0.33, 'uInfinitum', '104', 'paying students'], [0.66, 'Samatwam', '6', 'classes designed'], [1, 'January 2027', '150', 'learners · Cohort 01 · Delhi NCR']].forEach(([p, k, n, l], i) => { const x = 104 + 1712 * p - (i === 3 ? 360 : 0);
      el('div', { position: 'absolute', left: (104 + 1712 * p - 9) + 'px', top: (y - 8) + 'px', width: '18px', height: '18px', borderRadius: '50%', background: i === 3 ? '#fff' : S[1], boxShadow: i === 3 ? `0 0 24px ${S[2]}` : 'none' });
      L(k, { left: x + 'px', top: (y + 40) + 'px', color: i === 3 ? S[2] : 'rgba(255,255,255,.5)', textAlign: i === 3 ? 'right' : 'left', width: '360px' }); T(n, { left: x + 'px', top: (y + 70) + 'px', fontSize: '96px', width: '360px', textAlign: i === 3 ? 'right' : 'left' }); L(l, { left: x + 'px', top: (y + 180) + 'px', width: '360px', whiteSpace: 'normal', textAlign: i === 3 ? 'right' : 'left', lineHeight: '22px' }); }); },
};
async function STYLE(n) { FRAMES[n](); }
