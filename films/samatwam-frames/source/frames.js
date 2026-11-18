// Samatwam Frames · the 18 scenes. Frames 0–30 reveal, 30–110 the idea in motion, 110–150 hold with the title line.
const FR = {};
const sec = f => f / FPS;

// F01 · To think is the real skill · Focus | Blur
FR[1] = async () => {
  const L = liquid(stage, { split: [1, -1, 1.7], k: 1.4, seed: 2 });
  L.cv.style.filter = 'blur(40px)'; L.cv.style.transform = 'scale(1.08)';
  tl.to(L.cv, { filter: 'blur(10px)', duration: 2.6, ease: 'glide' }, .6);
  const s = svgEl(stage, { zIndex: 5 }, `<path class="dg" d="M40 1040 L1880 40" stroke="rgba(236,232,223,.55)" stroke-width="1.2"/>`);
  tl.from(s.querySelector('.dg'), { drawSVG: 0, duration: 1, ease: 'glide' }, .1);
  [['CAD', 190, 210, 84], ['FEA', 560, 300, 64], ['CFD', 250, 470, 72], ['LLM', 860, 190, 58], ['SIMULATION', 380, 640, 54]].forEach(([w, x, y, fs], i) => {
    const e = disp(w, { left: x + 'px', top: y + 'px', fontSize: fs + 'px', color: 'rgba(236,232,223,.5)', filter: 'blur(9px)', letterSpacing: '.02em', zIndex: 4 });
    tl.from(e, { opacity: 0, duration: .9 }, .9 + i * .12).to(e, { x: 70 - i * 14, y: -18 + i * 6, duration: 4.4, ease: 'none' }, .6);
  });
  const d = disp('DECIDE', { left: '1010px', top: '560px', fontSize: '196px', letterSpacing: '-.045em', color: C.text, filter: 'blur(40px)', zIndex: 6 });
  tl.from(d, { opacity: 0, duration: .8 }, .9).to(d, { filter: 'blur(0px)', duration: 2.2, ease: 'glide' }, 1.1).from(d, { letterSpacing: '.04em', duration: 2.4, ease: 'glide' }, 1.1);
  [[.36, 92], [.52, 64], [.67, 124]].forEach(([k, r], i) => {
    const x = 40 + 1840 * k, y = 1040 - 1000 * k;
    const g = el('div', { position: 'absolute', left: (x - r / 2) + 'px', top: (y - r / 2) + 'px', width: r + 'px', height: r + 'px', borderRadius: '50%', zIndex: 7,
      background: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,.75) 0 5%, rgba(255,255,255,.12) 18%, rgba(255,255,255,.03) 55%, rgba(242,183,102,.18) 100%)',
      backdropFilter: 'blur(1px) saturate(1.9) brightness(1.25)', border: '1px solid rgba(255,255,255,.34)',
      boxShadow: 'inset 0 -8px 16px rgba(0,0,0,.35), inset 0 2px 2px rgba(255,255,255,.4), 0 10px 24px rgba(0,0,0,.35)' });
    tl.from(g, { scale: 0, duration: .8, ease: 'snap' }, 1.2 + i * .2);
  });
  title('To <i class="em">think</i> is the real skill.', 'F01 · Core belief');
};

// F02 · The full bandwidth · Layered Panes
FR[2] = async () => {
  liquid(stage, { sat: .18, dim: .55, k: 1.2, seed: 5 });
  const sc = el('div', { ...full, perspective: '1700px', perspectiveOrigin: '50% 42%', zIndex: 3 });
  const rig = el('div', { position: 'absolute', left: '960px', top: '430px', transformStyle: 'preserve-3d', transform: 'rotateY(-40deg)' }, sc);
  const labs = ['Idea', 'Research', 'Engineering proof', 'Governing framework', 'Interface & market', 'Recalibration'];
  const panes = labs.map((l, i) => { const p = glass({ left: '-150px', top: '-210px', width: '300px', height: '420px', transform: `translateX(${(i - 2.5) * 250}px)` }, rig, '', { r: 22, fill: .05, blur: 8 });
    mono(`0${i + 1} · ${l}`, { left: '22px', top: '20px', fontSize: '12px', color: C.text }, p);
    const cv = el('canvas', { position: 'absolute', left: '20px', top: '70px', width: '260px', height: '300px' }, p); cv.width = 520; cv.height = 600; return { p, cv, ctx: cv.getContext('2d') }; });
  tl.from(panes.map(o => o.p), { opacity: 0, y: 40, duration: .9, ease: 'reveal', stagger: .06 }, .1);
  const centers = () => panes.map(o => { const b = o.p.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
  const A = centers(); rig.style.transform = 'rotateY(-32deg)'; const B = centers(); rig.style.transform = 'rotateY(-40deg)';
  tl.to(rig, { rotateY: -32, duration: 1.2, ease: 'glide' }, 3.7);
  const arc = svgEl(stage, { zIndex: 4 }, `<path class="arc" d="M${B[5][0]} ${B[5][1] + 230} C ${B[5][0]} ${B[5][1] + 380}, ${B[0][0]} ${B[0][1] + 380}, ${B[0][0]} ${B[0][1] + 230}" stroke="${C.saff}" stroke-width="1.4"/><circle class="ad" cx="${B[0][0]}" cy="${B[0][1] + 230}" r="4" fill="${C.saff}"/>`);
  tl.from(arc.querySelector('.arc'), { drawSVG: 0, duration: 1, ease: 'glide' }, 3.9).from(arc.querySelector('.ad'), { scale: 0, transformOrigin: '50% 50%', duration: .4, ease: 'snap' }, 4.8);
  const ov = el('canvas', { ...full, zIndex: 5 }); ov.width = W; ov.height = H; const o = ov.getContext('2d');
  const R = rng(3); const pts = [...Array(70)].map(() => [R() * 2 - 1, R() * 2 - 1, R()]);
  const arrive = i => 1.0 + i * .45;
  const draw = (ctx, k, a) => { ctx.clearRect(0, 0, 520, 600); ctx.globalAlpha = a; ctx.strokeStyle = C.lsaff; ctx.fillStyle = C.lsaff; ctx.lineWidth = 2; const cx = 260, cy = 300;
    if (k === 0) pts.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(cx + x * 170, cy + y * 170, 4, 0, 7); ctx.fill(); });
    if (k === 1) for (let r = 1; r <= 6; r++) { ctx.beginPath(); for (let i = 0; i <= 64; i++) { const th = i / 64 * Math.PI * 2, rr = r * 28 + 10 * vn(Math.cos(th) * 2 + r, Math.sin(th) * 2); ctx.lineTo(cx + Math.cos(th) * rr, cy + Math.sin(th) * rr * .9); } ctx.stroke(); }
    if (k === 2) { for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.ellipse(cx, cy, 170, 170 * Math.abs(Math.cos(i / 8 * Math.PI)) + 1, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy, 170 * Math.abs(Math.cos(i / 8 * Math.PI)) + 1, 170, 0, 0, 7); ctx.stroke(); } }
    if (k === 3) { for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(cx - 170 + i * 42.5, cy - 170); ctx.lineTo(cx - 170 + i * 42.5, cy + 170); ctx.moveTo(cx - 170, cy - 170 + i * 42.5); ctx.lineTo(cx + 170, cy - 170 + i * 42.5); ctx.stroke(); } ctx.lineWidth = 5; ctx.strokeRect(cx - 170, cy - 170, 340, 340); }
    if (k >= 4) { ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(cx - 180, cy - 150, 360, 300, 26); ctx.stroke(); ctx.fillRect(cx - 150, cy - 110, 150, 18); ctx.globalAlpha = a * .5; [0, 1, 2].forEach(i => ctx.fillRect(cx - 150, cy - 60 + i * 36, 300 - i * 70, 10)); ctx.globalAlpha = a; ctx.beginPath(); ctx.roundRect(cx - 150, cy + 70, 140, 46, 23); ctx.fill();
      if (k === 5) { ctx.strokeStyle = C.saff; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx + 110, cy + 92, 34, -2.6, 2.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx + 96, cy + 92); ctx.lineTo(cx + 108, cy + 104); ctx.lineTo(cx + 128, cy + 80); ctx.stroke(); } }
    ctx.globalAlpha = 1; };
  perFrame.push((f, t) => {
    panes.forEach((p, i) => draw(p.ctx, i, ss(arrive(i) - .1, arrive(i) + .25, t)));
    o.clearRect(0, 0, W, H); const k = clamp((t - .7) / (arrive(5) - .7 + .2)) * 5.2; const C0 = centers();
    const i0 = Math.min(4, Math.floor(k)), fr = clamp(k - i0); const px = lerp(C0[i0][0], C0[i0 + 1][0], fr), py = lerp(C0[i0][1], C0[i0 + 1][1], fr);
    if (t > .7 && t < 3.7) { const sp = 46 - Math.min(5, k) * 6; o.fillStyle = C.lsaff; pts.forEach(([x, y, z]) => { o.globalAlpha = .4 + z * .6; o.beginPath(); o.arc(px + x * sp + Math.sin(t * 6 + z * 9) * 3, py + y * sp, 2.2, 0, 7); o.fill(); }); o.globalAlpha = 1;
      const g = o.createRadialGradient(px, py, 0, px, py, 90); g.addColorStop(0, 'rgba(217,130,43,.35)'); g.addColorStop(1, 'rgba(217,130,43,0)'); o.fillStyle = g; o.fillRect(px - 90, py - 90, 180, 180); }
  });
  title('Six layers between an idea and <i class="em">reality.</i>', 'F02 · The full bandwidth');
};

// F03 · The womb · flow-field
FR[3] = async () => {
  el('div', { ...full, background: `radial-gradient(ellipse at 50% 44%, ${C.navy} 0%, ${C.night} 70%)` });
  const cv = el('canvas', { ...full }); cv.width = W; cv.height = H; const o = cv.getContext('2d');
  const N = 950, TR = 11, cx = 960, cy = 450, rx = 440, ry = 270, R = rng(11);
  const P = [...Array(N)].map(() => ({ x: R() * W, y: R() * H, s: R() < .2 }));
  const hist = [];
  for (let f = 0; f < 150 + TR; f++) {
    const w = ss(40, 100, f - TR) * .9;
    for (const p of P) { const a = vn(p.x * .0022, p.y * .0022 + f * .004) * Math.PI * 3.2;
      let vx = Math.cos(a) * .6 + .8, vy = Math.sin(a) * .9;
      const dx = (p.x - cx) / rx, dy = (p.y - cy) / ry, e = Math.hypot(dx, dy) + 1e-4; const nx = dx / e / rx, ny = dy / e / ry, nl = Math.hypot(nx, ny);
      const ux = nx / nl, uy = ny / nl; const tx = -uy, ty = ux; const pull = (1 - e) * 2.4;
      vx = lerp(vx, tx * 1.5 + ux * pull, w * ss(.25, 2.2, e < 1 ? 2 - e : e) + w * .3); vy = lerp(vy, ty * 1.5 + uy * pull, w * ss(.25, 2.2, e < 1 ? 2 - e : e) + w * .3);
      p.x += vx * 3.4; p.y += vy * 3.4; if (p.x > W + 20) { p.x = -10; p.y = R() * H; } if (p.y < -20 || p.y > H + 20) { p.y = (p.y + H) % H; p.x = R() * W * .3; } }
    hist.push(P.map(p => [p.x, p.y]));
  }
  const mem = svgEl(stage, { zIndex: 3 }, `<ellipse class="mb" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" stroke="${C.saff}" stroke-width="1.4" opacity=".0"/>`).querySelector('.mb');
  tl.to(mem, { opacity: .8, duration: 2.2, ease: 'glide' }, 1.5);
  const seeds = [[-190, -60, 6], [-60, -120, 6], [110, -90, 6], [200, 40, 6], [-120, 90, 6], [40, 60, 8]];
  const poly = (x, y, n, r) => [...Array(n)].map((_, i) => { const a = i / n * Math.PI * 2 + (n === 6 ? Math.PI / 6 : Math.PI / 8); return `${(x + Math.cos(a) * r).toFixed(1)},${(y + Math.sin(a) * r).toFixed(1)}`; }).join(' ');
  const R2 = rng(4); const br = (x, y) => { let d = ''; for (let k = 0; k < 3; k++) { const a = R2() * Math.PI * 2, l = 34 + R2() * 26; const x1 = x + Math.cos(a) * 26, y1 = y + Math.sin(a) * 26, x2 = x1 + Math.cos(a) * l, y2 = y1 + Math.sin(a) * l; d += `M${x1} ${y1} L${x2} ${y2} M${x2} ${y2} L${x2 + Math.cos(a + .6) * 18} ${y2 + Math.sin(a + .6) * 18} M${x2} ${y2} L${x2 + Math.cos(a - .6) * 16} ${y2 + Math.sin(a - .6) * 16} `; } return d; };
  const sg = svgEl(stage, { zIndex: 4 }, seeds.map(([x, y, n], i) => `<g class="sd"><path class="br" d="${br(cx + x, cy + y)}" stroke="${C.lsaff}" stroke-width="1.3" stroke-linecap="round"/><polygon points="${poly(cx + x, cy + y, n, n === 8 ? 26 : 22)}" fill="${C.navy}" stroke="${n === 8 ? C.lsaff : C.text}" stroke-width="1.6"/></g>`).join(''));
  tl.from(sg.querySelectorAll('polygon'), { scale: 0, transformOrigin: '50% 50%', duration: .7, ease: 'snap', stagger: .1 }, 1.6);
  sg.querySelectorAll('.br').forEach((b, i) => tl.from(b, { drawSVG: 0, duration: .9, ease: 'reveal' }, 3.5 + i * .12));
  mono('Classes · 06', { left: '1440px', top: '200px' }); mono('Features · growing', { left: '1440px', top: '224px', color: C.lsaff });
  perFrame.push(f => { o.clearRect(0, 0, W, H); o.lineWidth = 1;
    for (let i = 0; i < N; i++) { o.strokeStyle = P[i].s ? 'rgba(217,130,43,.55)' : 'rgba(236,232,223,.2)'; o.beginPath(); let pen = false;
      for (let k = 0; k < TR; k++) { const a = hist[f + k][i]; if (k && Math.abs(a[0] - hist[f + k - 1][i][0]) > 60) pen = false; pen ? o.lineTo(a[0], a[1]) : o.moveTo(a[0], a[1]); pen = true; } o.stroke(); } });
  title('Classes placed today. Features <i class="em">grown</i> with the field.', 'F03 · The womb');
};

// F04 · Claim card and SAMT ticket · glass-product
FR[4] = async () => {
  const bg = liquid(stage, { sat: .45, dim: .5, k: 1.3, seed: 8 });
  const caus = liquid(stage, { x: 560, y: 690, w: 800, h: 260, res: .5, sat: .9, dim: 1.1, k: 3.2, seed: 3, css: { mixBlendMode: 'screen', opacity: .55, transform: 'perspective(700px) rotateX(62deg)', maskImage: 'radial-gradient(ellipse at 50% 50%, #000 20%, transparent 68%)', webkitMaskImage: 'radial-gradient(ellipse at 50% 50%, #000 20%, transparent 68%)' } });
  tl.from(caus.cv, { opacity: 0, duration: 1.4 }, .2);
  const sc = el('div', { ...full, perspective: '1800px', zIndex: 3 });
  const card = el('div', { position: 'absolute', left: '580px', top: '190px', width: '760px', height: '460px', transformStyle: 'preserve-3d' }, sc); gsap.set(card, { rotateX: 6, rotateY: 84 });
  const face = (back) => glass({ left: 0, top: 0, width: '760px', height: '460px', backfaceVisibility: 'hidden', transform: back ? 'rotateY(180deg)' : 'none' }, card, '', { r: 30, fill: .09, blur: 18 });
  const F = face(false), Bk = face(true);
  [-380, 380].forEach(x => el('div', { position: 'absolute', left: (380 - 6 + x) + 'px', top: '14px', width: '12px', height: '432px', borderRadius: '6px', transform: 'rotateY(90deg)', background: 'linear-gradient(180deg, rgba(255,255,255,.75), rgba(242,183,102,.35) 50%, rgba(255,255,255,.5))' }, card));
  mono('Claim · SAMT01/001', { left: '44px', top: '42px', color: C.text, fontSize: '15px' }, F);
  mono('Builder · A. Learner', { left: '44px', top: '68px', fontSize: '12px' }, F);
  const qr = el('div', { position: 'absolute', right: '44px', top: '40px', width: '150px', height: '150px', opacity: .92 }, F, await (await fetch('../shared/qr.svg')).text()); qr.querySelector('svg').setAttribute('width', 150); qr.querySelector('svg').setAttribute('height', 150);
  el('div', { position: 'absolute', left: '44px', right: '44px', top: '236px', height: '1px', background: 'rgba(255,255,255,.18)' }, F);
  const cl = disp('', { left: '44px', top: '262px', fontSize: '40px', lineHeight: '50px', whiteSpace: 'normal', width: '640px', letterSpacing: '-.02em' }, F);
  mono('Stage · Claimed', { left: '44px', bottom: '40px', color: C.lsaff }, F);
  const claim = 'Bracket holds 2 kN at 40% less mass.'; const tw = { n: 0 }; tl.to(tw, { n: claim.length, duration: 1.4, ease: 'none' }, 1.5);
  perFrame.push(() => { cl.textContent = claim.slice(0, Math.round(tw.n)); });
  mono('SAMT01/001 · Stages', { left: '44px', top: '42px', color: C.text, fontSize: '15px' }, Bk);
  ['Claimed', 'Tested', 'Certified', 'Held'].forEach((s, i) => { const x = 60 + i * 172;
    el('div', { position: 'absolute', left: x + 'px', top: '196px', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.4)', background: i ? 'rgba(255,255,255,.04)' : C.saff, boxShadow: i ? 'none' : '0 0 24px rgba(217,130,43,.6), inset 0 2px 3px rgba(255,255,255,.5)' }, Bk);
    if (i < 3) el('div', { position: 'absolute', left: (x + 42) + 'px', top: '211px', width: '118px', height: '1px', background: 'rgba(255,255,255,.22)' }, Bk);
    mono(s, { left: x + 'px', top: '246px', color: i ? C.dim : C.lsaff }, Bk); });
  tl.to(card, { rotateY: 0, rotateX: 4, duration: 1.4, ease: 'glide' }, .1).to(card, { y: -8, duration: 1.6, ease: 'sine.inOut' }, 1.5).to(card, { rotateY: -180, duration: .9, ease: 'glide' }, 3.25);
  illustrative();
  title('Claim · <i class="em">SAMT01/001</i>', 'F04 · Claim card and SAMT ticket');
};

// F05 · Three interface layers · desktop-flythrough
FR[5] = async () => {
  el('div', { ...full, background: `linear-gradient(180deg, ${C.night} 0%, ${C.navy} 100%)` });
  const fl = svgEl(stage, { transformOrigin: '50% 100%', transform: 'perspective(900px) rotateX(64deg) translateY(140px) scale(1.6)', opacity: .6 }, [...Array(25)].map((_, i) => `<path d="M${i * 80} 0V1080" stroke="rgba(236,232,223,.12)"/>`).join('') + [...Array(14)].map((_, i) => `<path d="M0 ${i * 80}H1920" stroke="rgba(236,232,223,.12)"/>`).join(''));
  const sc = el('div', { ...full, perspective: '1600px', zIndex: 3 }); const rig = el('div', { ...full, transformStyle: 'preserve-3d' }, sc);
  tl.fromTo(rig, { x: 60, rotateY: 4 }, { x: -60, rotateY: -4, duration: 5, ease: 'none' }, 0);
  const defs = [['Individual', 'Generative', ['Learner', 'Builder', 'Researcher']], ['Authority', 'Sustainative', ['Reviewer', 'Mentor', 'Steward']], ['Institutional', 'Transmittive', ['School', 'Industry', 'Government']]];
  const cards = defs.map(([a, b, tabs], i) => { const g = glass({ left: (190 + i * 530) + 'px', top: '200px', width: '480px', height: '420px', transformOrigin: '50% 100%' }, rig, '', { r: 26 });
    mono(a, { left: '30px', top: '28px', color: C.text }, g); disp(b, { left: '30px', top: '54px', fontSize: '40px' }, g);
    tabs.forEach((t, j) => el('div', { position: 'absolute', left: (30 + j * 140) + 'px', top: '124px', padding: '7px 14px', borderRadius: '16px', fontFamily: 'JBM', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: j ? C.dim : C.night, background: j ? 'rgba(255,255,255,.06)' : C.lsaff, border: '1px solid rgba(255,255,255,.2)' }, g, t));
    const s = svgEl(g, { left: '30px', top: '176px' }, '', 420, 220); tl.from(g, { y: 260, rotateX: 70, opacity: 0, duration: 1.2, ease: 'glide' }, [.05, 1.6, 3.15][i]); return s; });
  const R = rng(5); cards[0].innerHTML = [...Array(12)].map((_, i) => { const x = 40 + (i % 6) * 68, y = 50 + Math.floor(i / 6) * 90, r = 16 + R() * 14; return i % 3 ? `<circle class="gs" cx="${x}" cy="${y}" r="${r}" stroke="${C.lsaff}" stroke-width="1.5" fill="${i % 4 ? 'none' : 'rgba(217,130,43,.4)'}"/>` : `<rect class="gs" x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" rx="6" stroke="${C.text}" stroke-width="1.5"/>`; }).join('');
  tl.from(cards[0].querySelectorAll('.gs'), { scale: 0, transformOrigin: '50% 50%', duration: .7, ease: 'snap', stagger: { each: .07, from: 'random' } }, .7);
  cards[1].innerHTML = [0, 1, 2].map(i => `<g transform="translate(${70 + i * 140} 120)"><path d="M-52 0 A52 52 0 0 1 52 0" stroke="rgba(236,232,223,.25)" stroke-width="6" stroke-linecap="round"/><path d="M-52 0 A52 52 0 0 1 0 -52" stroke="${C.saff}" stroke-width="6" stroke-linecap="round"/><line class="nd" x1="0" y1="0" x2="0" y2="-44" stroke="${C.text}" stroke-width="2.5" stroke-linecap="round"/><circle r="5" fill="${C.text}"/></g>`).join('') + `<text x="0" y="200" fill="${C.dim}" font-family="JBM" font-size="12" letter-spacing="1.5">HOLDING AT LEVEL</text>`;
  const nd = cards[1].querySelectorAll('.nd');
  const nodes = [[60, 40], [380, 30], [40, 180], [390, 180], [210, 10], [220, 200]];
  cards[2].innerHTML = nodes.map(([x, y]) => `<path class="tx" d="M210 110 L${x} ${y}" stroke="${C.lsaff}" stroke-width="1.4"/><circle class="tn" cx="${x}" cy="${y}" r="9" fill="${C.navy}" stroke="${C.text}" stroke-width="1.5"/>`).join('') + `<circle cx="210" cy="110" r="18" fill="${C.saff}"/>`;
  tl.from(cards[2].querySelectorAll('.tx'), { drawSVG: 0, duration: .8, ease: 'reveal', stagger: .08 }, 3.8).from(cards[2].querySelectorAll('.tn'), { scale: 0, transformOrigin: '50% 50%', duration: .4, ease: 'snap', stagger: .08 }, 4.2);
  perFrame.push((f, t) => nd.forEach((n, i) => { const u = Math.max(0, t - 2.0); const a = 70 * Math.exp(-u * 1.6) * Math.cos(u * 7 + i); n.setAttribute('transform', `rotate(${t < 2 ? -70 : a})`); }));
  title('One platform. Three <i class="em">languages.</i>', 'F05 · Three interface layers');
};

// F06 · Your AI, your data · security-xray
FR[6] = async () => {
  el('div', { ...full, background: `radial-gradient(ellipse at 50% 50%, ${C.navy} 0%, ${C.night} 75%)` });
  const s = svgEl(stage, { zIndex: 2 }, `<path d="M80 720 H1840 M80 734 H1840" stroke="rgba(236,232,223,.28)"/><path class="tk" d="M80 727 H1840" stroke="rgba(236,232,223,.35)" stroke-width="5" stroke-dasharray="2 38"/>`);
  const tk = s.querySelector('.tk'); perFrame.push((f, t) => tk.setAttribute('stroke-dashoffset', String(-(t < 1.3 ? t * 300 : t > 3.3 ? -(t - 3.3) * 300 : 390))));
  mono('Owner side', { left: '120px', top: '200px', color: C.text }); mono('Platform side', { left: '1580px', top: '200px', color: C.text });
  const gate = glass({ left: '900px', top: '230px', width: '120px', height: '500px', zIndex: 4 }, stage, '', { r: 18, fill: .08, blur: 14 });
  const scan = el('div', { position: 'absolute', left: 0, right: 0, height: '2px', top: '20px', background: C.saff, boxShadow: '0 0 18px rgba(217,130,43,.8)' }, gate);
  perFrame.push((f, t) => { scan.style.top = (250 + Math.sin(t * 3.4) * 220) + 'px'; });
  el('div', { position: 'absolute', left: '1020px', top: '612px', width: '40px', height: '6px', borderRadius: '3px', background: 'rgba(242,183,102,.6)', zIndex: 5 });
  const xr = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`;
  const R = rng(2);
  const cs = el('div', { position: 'absolute', left: '460px', top: '420px', width: '420px', height: '300px', zIndex: 3 }, stage, `<svg width="420" height="300" fill="none" stroke="${C.lsaff}" stroke-width="1.3">
    <rect x="4" y="40" width="412" height="256" rx="22" stroke="${C.text}" stroke-width="2" fill="rgba(242,183,102,.06)"/><path d="M150 40 V16 Q150 6 160 6 H260 Q270 6 270 16 V40" stroke="${C.text}" stroke-width="2"/>
    <g opacity=".85">${xr(30, 70, 70, 90)}${xr(44, 84, 70, 90)}${xr(58, 98, 70, 90)}<path d="M70 120h40M70 136h34M70 152h40"/>
    ${[...Array(48)].map((_, i) => `<circle cx="${170 + (i % 8) * 18}" cy="${86 + Math.floor(i / 8) * 18}" r="${2 + R() * 3}" fill="rgba(242,183,102,.5)" stroke="none"/>`).join('')}
    <ellipse cx="350" cy="90" rx="34" ry="10"/><path d="M316 90 V170 M384 90 V170"/><ellipse cx="350" cy="170" rx="34" ry="10"/><ellipse cx="350" cy="130" rx="34" ry="10" opacity=".5"/>
    <path d="M30 230 C90 200 130 270 200 230 S320 200 390 236" stroke="${C.text}" opacity=".6"/><path d="M30 256 H390" stroke-dasharray="3 6"/></g></svg>`);
  const plug = el('div', { position: 'absolute', left: '-6px', top: '-58px', padding: '8px 14px', borderRadius: '14px', fontFamily: 'JBM', fontSize: '12px', letterSpacing: '.12em', color: C.text, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.28)', whiteSpace: 'nowrap' }, cs, `<span style="color:${C.saff}">●</span> YOUR MODEL · API · CONNECTED`);
  tl.from(cs, { x: -330, duration: 1.3, ease: 'glide' }, 0).from(plug, { opacity: 0, y: 8, duration: .5 }, .9).to(cs, { x: -330, duration: 1, ease: 'glide' }, 3.3);
  ['Load 2.0 kN', 'Mass −40%', 'Tests 3/3'].forEach((s, i) => { const p = pill(`<span style="font-family:JBM;font-size:14px;letter-spacing:.12em;text-transform:uppercase">${s}</span>`, { left: '1040px', top: '590px', height: '52px', zIndex: 4 }, stage, { r: 26 });
    tl.fromTo(p, { x: -40, y: 0, opacity: 0, scale: .6 }, { x: 330, y: -360 + i * 76, opacity: 1, scale: 1, duration: .8, ease: 'glide' }, 1.6 + i * .45); });
  illustrative();
  title('Your model. Your data. <i class="em">You</i> choose what to prove.', 'F06 · Your AI, your data');
};

// F07 · Simulation Arena · lidar-survey
FR[7] = async () => {
  el('div', { ...full, background: C.night });
  const cv = el('canvas', { ...full }); cv.width = W; cv.height = H; const o = cv.getContext('2d');
  const R = rng(9); const box = (cx, cy, cz, sx, sy, sz, n) => [...Array(n)].map(() => { const f = Math.floor(R() * 6), a = R() - .5, b = R() - .5, s = f % 2 ? .5 : -.5; const p = f < 2 ? [s, a, b] : f < 4 ? [a, s, b] : [a, b, s]; return [cx + p[0] * sx, cy + p[1] * sy, cz + p[2] * sz]; });
  const cyl = (r, h, n) => [...Array(n)].map(() => { const a = R() * 6.283, y = R() * h; return R() < .25 ? [Math.cos(a) * r * Math.sqrt(R()), R() < .5 ? 0 : h, Math.sin(a) * r * Math.sqrt(R())] : [Math.cos(a) * r, y, Math.sin(a) * r]; });
  const stat = [...box(-1.8, .35, 1.6, 4.2, .7, .9, 1700), ...[0, 1, 2].flatMap(i => box(-3.2 + i * 1.1, .85, 1.6, .35, .3, .35, 90)), ...[...Array(1600)].map(() => [R() * 9 - 4.5, 0, R() * 7 - 3.5])];
  const base = cyl(.5, .35, 500), L1 = box(0, .6, 0, .28, 1.2, .28, 760), L2 = box(.55, 0, 0, 1.1, .22, .22, 640), L3 = box(.35, 0, 0, .7, .18, .18, 440), G = [...box(.1, .12, 0, .2, .06, .14, 60), ...box(.1, -.12, 0, .2, .06, .14, 60)];
  const rotY = (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)], rotZ = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]];
  const add = (p, q) => [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
  const arm = (yaw, sh, el2, wr) => { const out = [...base]; const tr = (pts, chain) => pts.forEach(p => out.push(chain(p)));
    const j1 = [0, .35, 0]; tr(L1, p => add(rotY(p, yaw), j1)); const j2 = [0, 1.55, 0];
    const f2 = p => add(rotY(rotZ(p, sh), yaw), j2); tr(L2, f2); const j3 = f2([1.1, 0, 0]);
    const f3 = p => add(rotY(rotZ(p, sh + el2), yaw), j3); tr(L3, f3); const j4 = f3([.7, 0, 0]);
    tr(G, p => add(rotY(rotZ(p, sh + el2 + wr), yaw), j4)); return out; };
  const cam = [5.6, 3.6, 6.4], tgt = [-.3, .8, .4]; const fw = (() => { const d = [tgt[0] - cam[0], tgt[1] - cam[1], tgt[2] - cam[2]], l = Math.hypot(...d); return d.map(v => v / l); })();
  const rt = (() => { const r = [fw[2], 0, -fw[0]], l = Math.hypot(...r); return r.map(v => v / l); })(); const up = [rt[1] * fw[2] - rt[2] * fw[1], rt[2] * fw[0] - rt[0] * fw[2], rt[0] * fw[1] - rt[1] * fw[0]];
  const proj = p => { const d = [p[0] - cam[0], p[1] - cam[1], p[2] - cam[2]]; const z = d[0] * fw[0] + d[1] * fw[1] + d[2] * fw[2]; return [960 - (d[0] * rt[0] + d[1] * rt[1] + d[2] * rt[2]) / z * 2300, 500 - (d[0] * up[0] + d[1] * up[1] + d[2] * up[2]) / z * 2300, z]; };
  const hud = mono('Scan · 0.00 m', { left: '120px', top: '150px', color: C.text }); const lab = mono('Cell 01 · 3 parallel runs', { left: '120px', top: '176px', color: C.lsaff }); tl.from(lab, { opacity: 0, duration: .6 }, 3.9);
  const runs = ['Run A', 'Run B', 'Run C'].map((s, i) => mono(s, { left: '1480px', top: (300 + i * 26) + 'px', color: [C.lsaff, C.text, C.saff][i] })); tl.from(runs, { opacity: 0, duration: .4, stagger: .1 }, 1.7).to(runs, { opacity: .25, duration: .6 }, 3.9);
  const pose = (t, ph, amp) => { const u = (t / 2.5 + ph) * 6.283; return [Math.sin(u) * .9 * amp - .3, -.5 + Math.sin(u + 1) * .25 * amp, -1.2 + Math.cos(u) * .3 * amp, -.6 + Math.sin(u * 2) * .2]; };
  const dot = (p, a, c) => { const q = proj(p); if (q[2] <= .1) return; o.globalAlpha = a; o.fillStyle = c; const s = 3.4 - q[2] * .14; o.fillRect(q[0], q[1], s, s); };
  perFrame.push((f, t) => { o.clearRect(0, 0, W, H); const sx = lerp(-4.5, 5.5, ss(0, 1.7, t)); hud.textContent = `SCAN · ${Math.max(0, sx + 4.5).toFixed(2)} M`;
    for (const p of stat) { if (p[0] > sx) continue; const near = 1 - clamp((sx - p[0]) / .6); dot(p, .3 + near * .6, near > .3 ? C.lsaff : C.text); }
    const conv = ss(3.3, 4.1, t); const ghosts = t > 1.4 ? [[0, 1, C.lsaff], [.18, 1.15, C.text], [-.16, .85, C.saff]] : [[0, 1, C.text]];
    ghosts.forEach(([ph, amp, c], gi) => { const a = arm(...pose(t, ph * (1 - conv), lerp(amp, 1, conv))); const al = gi ? .5 * (1 - conv) : (t > 1.4 ? lerp(.5, .95, conv) : .9);
      for (const p of a) { if (p[0] > sx) continue; dot(p, al * .9, gi === 0 && conv > .5 ? C.lsaff : c); } });
    o.globalAlpha = .55; o.strokeStyle = C.saff; o.lineWidth = 1; o.beginPath(); [[sx, 0, -3.5], [sx, 3, -3.5], [sx, 3, 3.5], [sx, 0, 3.5], [sx, 0, -3.5]].forEach((p, i) => { const q = proj(p); i ? o.lineTo(q[0], q[1]) : o.moveTo(q[0], q[1]); }); if (t < 1.9) o.stroke(); o.globalAlpha = 1; });
  title('Simulation Arena. Train machines <i class="em">before</i> they exist.', 'F07 · Physical AI');
};

// F08 · Thought to prototype · precise-mechanism
FR[8] = async () => {
  el('div', { ...full, background: `radial-gradient(ellipse at 50% 40%, #16264A 0%, ${C.night} 72%)` });
  const grid = svgEl(stage, { opacity: .5 }, [...Array(49)].map((_, i) => `<path d="M${i * 40} 0V1080" stroke="rgba(236,232,223,.05)"/>`).join('') + [...Array(28)].map((_, i) => `<path d="M0 ${i * 40}H1920" stroke="rgba(236,232,223,.05)"/>`).join(''));
  const parts = [
    { d: 'M-150 -60 H150 V40 H-150 Z', c: C.blue, ex: [0, -120] },
    { d: 'M-60 -170 H60 V-60 H-60 Z M-24 -140 H24 V-90 H-24 Z', c: C.text, ex: [0, -240] },
    { d: 'M-150 40 H-90 V200 Q-90 230 -60 236 L-30 240 V270 H-130 Q-150 270 -150 250 Z', c: C.saff, ex: [-160, 60], jaw: -1 },
    { d: 'M150 40 H90 V200 Q90 230 60 236 L30 240 V270 H130 Q150 270 150 250 Z', c: C.saff, ex: [160, 60], jaw: 1 },
    { d: 'M-30 -60 H30 V100 H-30 Z', c: C.lsaff, ex: [0, 160] },
  ];
  const DEP = 10;
  const s = svgEl(stage, { zIndex: 3 }, `<g transform="translate(960 380)">${parts.map((p, i) => `<g class="pt" data-i="${i}"><g class="ex">${[...Array(DEP)].map((_, k) => `<path d="${p.d}" fill="${p.c}" fill-rule="evenodd" opacity="0" class="ly" data-k="${k}" style="filter:brightness(${.35 + k * .04})"/>`).join('')}</g><path class="ln" d="${p.d}" fill="${p.c}" fill-opacity="0" fill-rule="evenodd" stroke="${C.text}" stroke-width="1.2"/></g>`).join('')}
    <rect class="part" x="-30" y="226" width="60" height="44" rx="6" fill="${C.text}" opacity="0"/></g>`);
  const G = [...s.querySelectorAll('.pt')]; const dep = { v: 0, fill: 0, sw: 1.2 };
  G.forEach((g, i) => { gsap.set(g, { x: parts[i].ex[0], y: parts[i].ex[1] }); tl.from(g.querySelector('.ln'), { drawSVG: 0, duration: 1, ease: 'reveal' }, .1 + i * .14); tl.to(g, { x: 0, y: 0, duration: .8, ease: 'snap' }, 2.3 + i * .06); });
  tl.to(dep, { v: 1, fill: 1, sw: 2.2, duration: 1, ease: 'glide' }, 1.3);
  const jaws = { v: 0 }; tl.to(jaws, { v: 1, duration: .5, ease: 'press' }, 3.3); tl.to(s.querySelector('.part'), { opacity: 1, duration: .3 }, 3.15);
  perFrame.push(() => G.forEach((g, i) => { g.querySelectorAll('.ly').forEach((l, k) => { l.setAttribute('opacity', dep.v ? '1' : '0'); l.setAttribute('transform', `translate(${(DEP - k) * 1.6 * dep.v} ${(DEP - k) * 1.3 * dep.v})`); });
    const ln = g.querySelector('.ln'); ln.setAttribute('fill-opacity', dep.fill); ln.setAttribute('stroke-width', dep.sw); ln.setAttribute('stroke', dep.fill > .5 ? 'rgba(255,255,255,.55)' : C.text);
    if (parts[i].jaw) g.querySelector('.ex').parentNode.setAttribute('data-j', jaws.v), g.style.translate = `${-parts[i].jaw * 28 * jaws.v}px 0`; }));
  const tags = ['Sketch', 'CAD', 'Sim', 'Prototype'].map((t, i) => { const p = pill(`<span style="font-family:JBM;font-size:13px;letter-spacing:.12em;text-transform:uppercase">${t}</span>`, { left: (600 + i * 190) + 'px', top: '700px', height: '46px', padding: '0 22px', opacity: .35, zIndex: 4 }, stage, { r: 23 });
    if (i < 3) mono('→', { left: (600 + i * 190 + 150) + 'px', top: '715px', zIndex: 4 }); tl.to(p, { opacity: 1, borderColor: C.saff, duration: .3 }, [.3, 1.4, 2.4, 3.4][i]); return p; });
  title('From a thought to a part you can <i class="em">hold.</i>', 'F08 · Thought to prototype');
};

// F09 · Certified creation · gilded-illumination
FR[9] = async () => {
  el('div', { ...full, background: '#0D0C0B' });
  const pg = el('div', { position: 'absolute', left: '360px', top: '140px', width: '1200px', height: '660px', borderRadius: '6px', background: 'radial-gradient(ellipse at 40% 30%, #2A2219 0%, #1B1612 60%, #121010 100%)', boxShadow: '0 40px 80px rgba(0,0,0,.6), inset 0 0 80px rgba(0,0,0,.6)', overflow: 'hidden' });
  el('div', { ...full, opacity: .35, mixBlendMode: 'overlay' }, pg, `<svg width="1200" height="660"><filter id="vl"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="4" seed="4"/><feColorMatrix values="0 0 0 0 .95  0 0 0 0 .8  0 0 0 0 .6  0 0 0 1.1 -.2"/></filter><rect width="100%" height="100%" filter="url(#vl)"/></svg>`);
  const hx = (x, y, r, n = 6) => `<polygon points="${[...Array(n)].map((_, i) => { const a = i / n * 6.283 + (n === 6 ? 0 : Math.PI / 8); return (x + Math.cos(a) * r).toFixed(1) + ',' + (y + Math.sin(a) * r).toFixed(1); }).join(' ')}"/>`;
  let orn = ''; for (let x = 100; x <= 1100; x += 40) orn += hx(x, 40, 10) + hx(x, 620, 10); for (let y = 80; y <= 580; y += 40) orn += hx(40, y, 10) + hx(1160, y, 10);
  orn += [[40, 40], [1160, 40], [40, 620], [1160, 620]].map(([x, y]) => hx(x, y, 22, 8)).join('');
  const sun = `<g transform="translate(600 40)"><circle r="16"/>${[...Array(16)].map((_, i) => `<path d="M${Math.cos(i / 16 * 6.283) * 22} ${Math.sin(i / 16 * 6.283) * 22} L${Math.cos(i / 16 * 6.283) * 32} ${Math.sin(i / 16 * 6.283) * 32}"/>`).join('')}</g>`;
  const s = svgEl(pg, {}, `<g class="orn" stroke="rgba(242,183,102,.55)" stroke-width="1.1" fill="none">${orn}${sun}<rect x="70" y="70" width="1060" height="520" stroke="rgba(242,183,102,.3)"/></g>
    <path class="gl" d="M120 228 V312" stroke="url(#gg)" stroke-width="4" stroke-linecap="round"/><path class="gb" d="M70 590 V70 H600" stroke="url(#gg)" stroke-width="2.2"/>
    <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.gold}"/><stop class="hl" offset=".5" stop-color="#F3E2B0"/><stop offset="1" stop-color="${C.gold}"/></linearGradient></defs>`, 1200, 660);
  tl.from(s.querySelectorAll('.orn > *'), { drawSVG: 0, duration: .5, ease: 'reveal', stagger: { each: .008, from: 'center' } }, .05);
  tl.from(s.querySelector('.gl'), { drawSVG: 0, duration: .6, ease: 'glide' }, 3.35).from(s.querySelector('.gb'), { drawSVG: 0, duration: 1, ease: 'glide' }, 3.4);
  const hl = s.querySelector('.hl'); perFrame.push((f, t) => hl.setAttribute('offset', clamp((t - 3.4) / 1.4).toFixed(3)));
  const line = (txt, y) => { const w = el('div', { position: 'absolute', left: '150px', top: y + 'px', overflow: 'hidden', whiteSpace: 'nowrap' }, pg); el('div', { fontFamily: 'PF', fontStyle: 'italic', fontSize: '40px', color: '#EADFC8' }, w, txt); return w; };
  const l1 = line('The lattice bracket carries 2 kN at 40% less mass.', 236), l2 = line('The same lattice cools the part by 12 °C.', 356);
  tl.from(l1, { width: 0, duration: 1, ease: 'none' }, 1.2).from(l2, { width: 0, duration: .8, ease: 'none' }, 2.3);
  const ok = mono(`<span style="color:${C.saff}">✓</span>  Proof reproduced`, { left: '150px', top: '300px', color: C.lsaff }, pg), no = mono('○  Not yet tested', { left: '150px', top: '420px', color: 'rgba(234,223,200,.5)' }, pg);
  tl.from(ok, { opacity: 0, x: -10, duration: .4 }, 2.2).from(no, { opacity: 0, x: -10, duration: .4 }, 3.1);
  const seal = el('div', { position: 'absolute', left: '930px', top: '440px', width: '150px', height: '150px', borderRadius: '50%', border: `2px solid ${C.gold}`, boxShadow: `inset 0 0 0 8px rgba(176,141,60,.15), inset 0 0 0 10px ${C.gold}, 0 10px 30px rgba(0,0,0,.5)`, background: 'radial-gradient(circle at 35% 30%, rgba(243,226,176,.35), rgba(176,141,60,.18) 60%, rgba(0,0,0,.1))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'JBM', fontSize: '12px', letterSpacing: '.12em', color: '#F3E2B0', transform: 'rotate(-8deg)' }, pg, 'CERT<br><span style="font-size:11px">OR-2027-0117</span>');
  tl.from(seal, { scale: 1.8, opacity: 0, duration: .5, ease: 'press' }, 4.05);
  illustrative();
  title('Claim your idea. Prove it. <i class="em">Own</i> the record.', 'F09 · Certified creation');
};

// F10 · Engineering cases · thermal-camera, recoloured
FR[10] = async () => {
  el('div', { ...full, background: `radial-gradient(ellipse at 45% 45%, #101A30 0%, ${C.night} 70%)` });
  const ox = 420, oy = 210, BW = 900, BH = 560, D = 'M0 0 H900 V110 Q900 130 880 130 H220 Q120 130 104 230 V560 H0 Z';
  const cv = el('canvas', { position: 'absolute', left: ox + 'px', top: oy + 'px', width: BW + 'px', height: BH + 'px', clipPath: `path('${D}')`, zIndex: 2 }); const RS = .5; cv.width = BW * RS; cv.height = BH * RS; const o = cv.getContext('2d'); const img = o.createImageData(cv.width, cv.height);
  const ramp = [[10, 11, 14], [19, 33, 61], [31, 58, 122], [217, 130, 43], [242, 183, 102], [255, 240, 214]];
  const col = v => { v = clamp(v) * (ramp.length - 1); const i = Math.min(ramp.length - 2, Math.floor(v)), k = v - i; return ramp[i].map((c, j) => lerp(c, ramp[i + 1][j], k)); };
  const heat = { v: 0 }; tl.to(heat, { v: 1, duration: 1.4, ease: 'glide' }, .3).to(heat, { v: .42, duration: 1.8, ease: 'glide' }, 1.9);
  perFrame.push((f, t) => { const d = img.data; for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) { const X = x / RS, Y = y / RS;
      const hs = Math.exp(-(((X - 150) ** 2) / 9000 + ((Y - 170) ** 2) / 9000)), arm = clamp(1 - X / 900) * clamp(1 - Math.abs(Y - 65) / 90) * .35, plate = clamp(1 - Y / 560) * .25;
      const v = .12 + (hs * .95 + arm + plate) * heat.v + vn(X * .02 + t * .6, Y * .02) * .05; const c = col(v); const i = (y * cv.width + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; }
    o.putImageData(img, 0, 0); });
  let lat = ''; for (let x = 140; x < 880; x += 52) lat += `M${x} 18 L${x + 26} 112 L${x + 52} 18 `; for (let y = 230; y < 540; y += 52) lat += `M14 ${y} L90 ${y + 26} L14 ${y + 52} `;
  lat += 'M120 130 L60 200 M170 130 L80 250 M220 132 L96 300';
  const s = svgEl(stage, { zIndex: 3 }, `<g transform="translate(${ox} ${oy})"><path d="${D}" stroke="rgba(236,232,223,.7)" stroke-width="1.5"/><clipPath id="bk"><path d="${D}"/></clipPath>
    <g clip-path="url(#bk)"><path class="lt" d="${lat}" stroke="rgba(236,232,223,.75)" stroke-width="2.2"/></g>
    <circle cx="48" cy="220" r="18" fill="${C.night}" stroke="rgba(236,232,223,.6)"/><circle cx="48" cy="480" r="18" fill="${C.night}" stroke="rgba(236,232,223,.6)"/>
    <g class="ld"><path d="M840 -150 V-16 M826 -34 L840 -12 L854 -34" stroke="${C.text}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g></g>`);
  mono('Load · 2.0 kN', { left: '1286px', top: '120px', color: C.text, zIndex: 4 });
  tl.from(s.querySelector('.ld'), { y: -40, opacity: 0, duration: .7, ease: 'press' }, .2).from(s.querySelector('.lt'), { drawSVG: 0, duration: 1.6, ease: 'glide' }, 1.8);
  const rd = glass({ left: '1390px', top: '420px', width: '360px', height: '220px', zIndex: 4 }, stage, '', { r: 22 });
  mono('Max stress', { left: '28px', top: '26px' }, rd); const num = disp('248', { left: '26px', top: '52px', fontSize: '84px', letterSpacing: '-.04em' }, rd); mono('MPa', { left: '220px', top: '100px', color: C.text }, rd);
  const dl = mono('', { left: '28px', top: '170px', color: C.lsaff }, rd);
  const sv = { v: 0 }; tl.to(sv, { v: 248, duration: 1.4, ease: 'glide' }, .3).to(sv, { v: 162, duration: 1.8, ease: 'glide' }, 1.9);
  perFrame.push((f, t) => { num.textContent = Math.round(sv.v); dl.textContent = t > 2 ? `Lattice infill · ${Math.round((sv.v - 248) / 248 * 100)}%` : 'Solid part'; });
  mono('Illustrative case', { left: '420px', top: '150px', fontSize: '11px', padding: '6px 10px', border: '1px solid rgba(242,183,102,.45)', borderRadius: '6px', color: C.lsaff, zIndex: 4 });
  title('Engineering cases. Real loads. Real <i class="em">proofs.</i>', 'F10 · Engineering cases');
};

// F11 · Open learning · stained-glass
FR[11] = async () => {
  el('div', { ...full, background: C.night });
  const glow = el('div', { position: 'absolute', left: '360px', top: '100px', width: '1200px', height: '700px', background: 'radial-gradient(ellipse at 50% 50%, rgba(242,183,102,.28), rgba(242,183,102,0) 65%)' });
  const leaf = [...Array(48)].map((_, i) => { const u = i / 48 * Math.PI * 2; const x = Math.cos(u), y = Math.sin(u) * Math.pow(Math.abs(Math.sin(u / 2 + 0)), .0); return [960 + x * 430, 430 + Math.sin(u) * 210 * (1 - .45 * Math.cos(u)) * (.7 + .3 * Math.abs(Math.sin(u)))]; });
  const inLeaf = (x, y) => { let c = false; for (let i = 0, j = leaf.length - 1; i < leaf.length; j = i++) { const [xi, yi] = leaf[i], [xj, yj] = leaf[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const R = rng(21); const P = []; for (let i = 0; i < 9; i++) P.push([560 + i * 100, 430 + (i % 2 ? 8 : -8)]); while (P.length < 70) { const x = 520 + R() * 880, y = 200 + R() * 460; if (inLeaf(x, y)) P.push([x, y]); }
  const vor = d3.Delaunay.from(P).voronoi([480, 180, 1440, 680]);
  const resample = (pts, n) => { const seg = []; let L = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, l]); L += l; }
    const out = []; for (let k = 0; k < n; k++) { let d = k / n * L; for (const [a, b, l] of seg) { if (d <= l) { out.push([lerp(a[0], b[0], d / l), lerp(a[1], b[1], d / l)]); break; } d -= l; } } return out; };
  const cells = P.map((p, i) => { const c = vor.cellPolygon(i); return { c: p, src: resample(c.slice(0, -1), 16) }; });
  cells.sort((a, b) => a.c[0] - b.c[0] || a.c[1] - b.c[1]);
  const cols = 14, rows = 5; cells.forEach((cl, i) => { const ci = Math.floor(i / rows), ri = i % rows; const u0 = ci / cols, u1 = (ci + 1) / cols;
    const pt = (u, r) => { const x = 400 + 1120 * u, y = 640 - 380 * Math.sin(Math.PI * u); const nx = -Math.cos(Math.PI * u) * 380 * Math.PI / 1120, l = Math.hypot(nx, 1); return [x + nx / l * -r * 26 * 0 + 0, y - r * 30]; };
    cl.dst = resample([pt(u0, ri), pt(u1, ri), pt(u1, ri + 1), pt(u0, ri + 1)], 16); });
  const area = q => q.reduce((A, p, i) => { const n = q[(i + 1) % q.length]; return A + p[0] * n[1] - n[0] * p[1]; }, 0);
  const cen = q => [q.reduce((a, p) => a + p[0], 0) / q.length, q.reduce((a, p) => a + p[1], 0) / q.length];
  cells.forEach(cl => { let q = cl.src; if (Math.sign(area(q)) !== Math.sign(area(cl.dst))) q = q.slice().reverse();
    const c1 = cen(q), c2 = cen(cl.dst), a0 = Math.atan2(cl.dst[0][1] - c2[1], cl.dst[0][0] - c2[0]); let bi = 0, bd = 9;
    q.forEach((p, i) => { let d = Math.abs(Math.atan2(p[1] - c1[1], p[0] - c1[0]) - a0); d = Math.min(d, 6.283 - d); if (d < bd) { bd = d; bi = i; } });
    cl.src = [...q.slice(bi), ...q.slice(0, bi)]; });
  const pal = [C.lsaff, C.saff, C.navy, C.blue, C.lsaff, C.blue];
  const s = svgEl(stage, { zIndex: 2 }, `<defs><clipPath id="lc"><path class="lp"/></clipPath></defs><g class="cg" clip-path="url(#lc)">${cells.map((c, i) => `<polygon class="cl" fill="${pal[Math.floor(R() * pal.length)]}" fill-opacity=".86" stroke="#07080A" stroke-width="5" stroke-linejoin="round"/>`).join('')}</g>
    <path class="vn" d="M520 430 C 760 420, 1160 420, 1400 430 ${[0, 1, 2, 3, 4, 5].map(i => `M${640 + i * 120} 430 Q ${690 + i * 120} ${380 - i * 4}, ${720 + i * 120} ${300 + Math.abs(i - 2.5) * 20} M${640 + i * 120} 430 Q ${690 + i * 120} ${480}, ${720 + i * 120} ${560 - Math.abs(i - 2.5) * 20}`).join(' ')}" stroke="#07080A" stroke-width="7" stroke-linecap="round"/>
    <path class="col" d="M400 640 V780 M1520 640 V780 M960 260 V780" stroke="rgba(236,232,223,.5)" stroke-width="3" opacity="0"/>`);
  const polys = [...s.querySelectorAll('.cl')], lp = s.querySelector('.lp');
  const canopy = resample([...[...Array(41)].map((_, i) => { const u = 1 - i / 40; return [400 + 1120 * u, 640 - 380 * Math.sin(Math.PI * u)]; }), ...[...Array(41)].map((_, i) => { const u = i / 40; return [400 + 1120 * u, 640 - 380 * Math.sin(Math.PI * u) - 150]; })], 96);
  const leafR = resample(leaf, 96);
  const m = { v: 0 }; tl.to(m, { v: 1, duration: 2.3, ease: 'glide' }, 1.6);
  tl.from(polys, { opacity: 0, duration: .5, stagger: { each: .012, from: 'center' } }, .1).to(s.querySelector('.vn'), { opacity: 0, y: -30, duration: .8, ease: 'glide' }, 1.5).to(s.querySelector('.col'), { opacity: 1, duration: .8 }, 3.6).to(glow, { opacity: .5, duration: 2 }, 1.8);
  perFrame.push(() => { const k = m.v; polys.forEach((p, i) => { const c = cells[i]; p.setAttribute('points', c.src.map((a, j) => `${lerp(a[0], c.dst[j][0], k).toFixed(1)},${lerp(a[1], c.dst[j][1], k).toFixed(1)}`).join(' ')); p.setAttribute('stroke', k > .5 ? 'rgba(236,232,223,.85)' : '#07080A'); p.setAttribute('stroke-width', lerp(5, 3, k)); });
    lp.setAttribute('d', 'M' + leafR.map((a, j) => `${lerp(a[0], canopy[j][0], k).toFixed(1)} ${lerp(a[1], canopy[j][1], k).toFixed(1)}`).join(' L') + 'Z'); });
  title('Study the leaf. Build the <i class="em">roof.</i>', 'F11 · Open learning');
};

// F12 · Creative Arena · Octagon Portholes
FR[12] = async () => {
  const world = el('div', { ...full, transformOrigin: '960px 450px' });
  el('div', { ...full, background: `linear-gradient(180deg, #0E1424 0%, ${C.night} 100%)` }, world);
  svgEl(world, {}, [...Array(7)].map((_, i) => `<path d="M${i * 320} 0 V1080" stroke="rgba(236,232,223,.06)"/>`).join('') + `<path d="M0 220 H1920 M0 700 H1920" stroke="rgba(236,232,223,.06)"/>` + [...Array(60)].map((_, i) => `<circle cx="${(i % 30) * 64 + 32}" cy="${i < 30 ? 236 : 684}" r="2.2" fill="rgba(236,232,223,.18)"/>`).join(''));
  const oct = r => [...Array(8)].map((_, i) => { const a = i / 8 * 6.283 + Math.PI / 8; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ');
  const pos = [[360, 470], [660, 430], [960, 450], [1260, 430], [1560, 470]]; const S = 260;
  const R = rng(6); const drops = [...Array(60)].map(() => [R() * 260, R() * 260, .6 + R() * .6]); const lights = [...Array(40)].map(() => [R() * 260, 60 + R() * 200, 4 + R() * 12, R() * 6]);
  const draws = [
    (o, t) => { const g = o.createLinearGradient(0, 0, 0, 260); g.addColorStop(0, '#2B3550'); g.addColorStop(1, '#C9B89A'); o.fillStyle = g; o.fillRect(0, 0, 260, 260); for (let k = 0; k < 4; k++) { o.fillStyle = `rgba(${20 + k * 10},${28 + k * 10},${45 + k * 8},${.5 + k * .12})`; o.beginPath(); o.moveTo(0, 260); for (let x = 0; x <= 260; x += 6) o.lineTo(x, 110 + k * 30 + Math.sin(x * .03 + k * 2) * 18 * (1 - k * .2) + vn(x * .02, k) * 20); o.lineTo(260, 260); o.fill(); } o.strokeStyle = 'rgba(242,232,210,.5)'; for (let i = 0; i < 8; i++) { o.beginPath(); const y = 220 + i * 5, x = ((t * 30 + i * 40) % 300) - 40; o.moveTo(x, y); o.lineTo(x + 40, y); o.stroke(); } },
    (o, t) => { o.fillStyle = '#1A1410'; o.fillRect(0, 0, 260, 260); o.fillStyle = C.lsaff; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { o.beginPath(); o.arc(50 + i * 40, 50 + j * 40, 3, 0, 7); o.fill(); } o.strokeStyle = '#F4EDE0'; o.lineWidth = 2.2; o.beginPath(); const n = Math.floor(clamp(t / 3.6) * 400); for (let k = 0; k <= n; k++) { const a = k / 400 * 6.283 * 2; const r = 80 + 30 * Math.cos(4 * a); k ? o.lineTo(130 + Math.cos(a) * r, 130 + Math.sin(a) * r) : o.moveTo(130 + Math.cos(a) * r, 130 + Math.sin(a) * r); } o.stroke(); },
    (o, t) => { const g = o.createLinearGradient(0, 0, 0, 260); g.addColorStop(0, '#FFE2B4'); g.addColorStop(.55, C.saff); g.addColorStop(1, '#2A1B14'); o.fillStyle = g; o.fillRect(0, 0, 260, 260); o.fillStyle = '#FFF6E6'; o.beginPath(); o.arc(130, 170 - t * 14, 34, 0, 7); o.fill(); o.fillStyle = '#1A1512'; o.fillRect(0, 176, 260, 84); o.strokeStyle = 'rgba(255,230,190,.6)'; for (let i = 0; i < 10; i++) { o.beginPath(); o.moveTo(130 - 50 + i * 3, 186 + i * 7); o.lineTo(130 + 50 - i * 3, 186 + i * 7); o.stroke(); } },
    (o, t) => { o.fillStyle = '#16233F'; o.fillRect(0, 0, 260, 260); o.strokeStyle = 'rgba(200,215,240,.55)'; o.lineWidth = 1.2; drops.forEach(([x, y, s]) => { const yy = (y + t * 420 * s) % 300 - 20, xx = (x - t * 80 * s) % 280; o.beginPath(); o.moveTo(xx, yy); o.lineTo(xx - 6, yy + 22); o.stroke(); }); },
    (o, t) => { o.fillStyle = '#0C0A12'; o.fillRect(0, 0, 260, 260); lights.forEach(([x, y, r, p]) => { const a = .35 + .35 * Math.sin(t * 4 + p); const g = o.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,196,110,${a})`); g.addColorStop(1, 'rgba(217,130,43,0)'); o.fillStyle = g; o.beginPath(); o.arc(x, y, r, 0, 7); o.fill(); }); },
  ];
  const ctxs = pos.map(([x, y], i) => { const w = el('div', { position: 'absolute', left: (x - S / 2) + 'px', top: (y - S / 2) + 'px', width: S + 'px', height: S + 'px', clipPath: `polygon(${[...Array(8)].map((_, k) => { const a = k / 8 * 6.283 + Math.PI / 8; return `${50 + Math.cos(a) * 50}% ${50 + Math.sin(a) * 50}%`; }).join(',')})` }, world);
    const cv = el('canvas', { width: '260px', height: '260px', display: 'block' }, w); cv.width = 520; cv.height = 520; const o = cv.getContext('2d'); o.scale(2, 2);
    el('div', { position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 40%)' }, w);
    tl.from(w, { scale: .6, opacity: 0, duration: .9, ease: 'reveal' }, .1 + Math.abs(i - 2) * .12); return o; });
  svgEl(world, {}, pos.map(([x, y]) => `<g transform="translate(${x} ${y})"><polygon points="${oct(S * .54 + 14)}" stroke="#3A4560" stroke-width="16"/><polygon points="${oct(S * .54 + 22)}" stroke="rgba(236,232,223,.3)" stroke-width="1"/><polygon points="${oct(S * .54 + 6)}" stroke="rgba(236,232,223,.45)" stroke-width="1"/></g>`).join(''));
  perFrame.push((f, t) => ctxs.forEach((o, i) => draws[i](o, t)));
  tl.to(world, { scale: 4.4, duration: 1.2, ease: 'glide' }, 3.0).to(world, { filter: 'blur(1.5px)', duration: .6 }, 3.6);
  const fr = el('div', { ...full, zIndex: 6, opacity: 0 }); el('div', { position: 'absolute', left: '170px', top: '150px', width: '1580px', height: '760px', border: '1px solid rgba(236,232,223,.55)', borderRadius: '10px' }, fr);
  const sl = glass({ left: '1300px', top: '180px', width: '420px', height: '110px' }, fr, '', { r: 18 }); mono('Open series', { left: '26px', top: '24px', color: C.lsaff }, sl); disp('Episode 01', { left: '24px', top: '46px', fontSize: '40px' }, sl);
  tl.to(fr, { opacity: 1, duration: .5 }, 3.9);
  title('Creative Arena. Stories of <i class="em">Bharat,</i> by its creators.', 'F12 · Creative Arena');
};

// F13 · The requirements loop · hologram-hud
FR[13] = async () => {
  el('div', { ...full, background: `radial-gradient(ellipse at 50% 46%, #0F1A33 0%, ${C.night} 70%)` });
  const L = [330, 450], Rn = [1590, 450]; const orbs = [...Array(12)].map((_, i) => [520 + i * 80, 450 + (i % 2 ? 1 : -1) * (40 + (i % 3) * 22)]);
  const hit = [3, 6, 9];
  const ticks = [...Array(91)].map((_, i) => `<path d="M${420 + i * 12} 640 V${i % 5 ? 648 : 656}" stroke="rgba(236,232,223,.3)"/>`).join('');
  const node = ([x, y], lab) => `<g transform="translate(${x} ${y})"><circle r="56" stroke="rgba(236,232,223,.6)" class="rg"/><circle r="80" stroke="rgba(236,232,223,.3)" stroke-dasharray="3 7" class="rg"/>${[...Array(36)].map((_, i) => `<path d="M${Math.cos(i / 36 * 6.283) * 92} ${Math.sin(i / 36 * 6.283) * 92} L${Math.cos(i / 36 * 6.283) * (i % 3 ? 96 : 102)} ${Math.sin(i / 36 * 6.283) * (i % 3 ? 96 : 102)}" stroke="rgba(236,232,223,.35)"/>`).join('')}<circle r="8" fill="${C.saff}"/></g><text x="${x}" y="${y + 140}" text-anchor="middle" fill="${C.text}" font-family="JBM" font-size="13" letter-spacing="2">${lab}</text>`;
  const s = svgEl(stage, { zIndex: 2 }, `<path class="ax" d="M${L[0] + 56} 450 H${Rn[0] - 56}" stroke="rgba(236,232,223,.35)"/>${ticks}
    <path class="ar" d="M420 330 Q960 140 1500 330" stroke="rgba(236,232,223,.22)" stroke-dasharray="2 8"/><path class="ar" d="M420 570 Q960 760 1500 570" stroke="rgba(236,232,223,.22)" stroke-dasharray="2 8"/>
    ${node(L, 'REQUIREMENT')}${node(Rn, 'DELIVERY')}
    ${hit.map(i => `<path class="rt" d="M640 450 C 700 450, ${orbs[i][0] - 60} ${orbs[i][1]}, ${orbs[i][0]} ${orbs[i][1]}" stroke="${C.saff}" stroke-width="1.4"/>`).join('')}
    ${orbs.map(([x, y], i) => `<g class="ob" data-i="${i}"><circle cx="${x}" cy="${y}" r="17" fill="${C.night}" stroke="rgba(236,232,223,.55)"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" fill="${C.text}" font-family="JBM" font-size="12">${'ABCDEFGHJKLM'[i]}</text></g>`).join('')}
    <path class="wv" stroke="${C.lsaff}" stroke-width="1.6"/><path class="dl" d="M${orbs[9][0]} ${orbs[9][1]} C ${orbs[9][0] + 120} ${orbs[9][1]}, 1400 450, ${Rn[0] - 56} 450" stroke="${C.saff}" stroke-width="1.4"/>
    <path class="pk" d="M0 -9 L9 0 L0 9 L-9 0Z" fill="${C.lsaff}"/>`);
  tl.from(s.querySelectorAll('.ax,.ar'), { drawSVG: 0, duration: 1, ease: 'glide' }, 0).from(s.querySelectorAll('.ob'), { opacity: 0, scale: .4, transformOrigin: '50% 50%', duration: .5, ease: 'snap', stagger: .03 }, .3)
    .from(s.querySelectorAll('.rt'), { drawSVG: 0, duration: .6, ease: 'reveal', stagger: .1 }, 1.7).from(s.querySelector('.dl'), { drawSVG: 0, duration: .7, ease: 'glide' }, 3.0);
  hit.forEach((i, k) => { const c = s.querySelectorAll('.ob')[i].querySelector('circle'); tl.to(c, { attr: { fill: C.saff, stroke: C.lsaff }, duration: .25 }, 2.1 + k * .12); });
  const pk = s.querySelector('.pk'), wv = s.querySelector('.wv'); const pp = { v: 0 }; tl.to(pp, { v: 1, duration: .8, ease: 'glide' }, .9);
  perFrame.push((f, t) => { const x = lerp(L[0] + 56, 640, pp.v); pk.setAttribute('transform', `translate(${t > 3 ? lerp(orbs[9][0], Rn[0] - 56, ss(3.0, 3.6, t)) : x} 450)`); pk.setAttribute('opacity', t > 3.65 ? 0 : 1);
    const a = ss(2.2, 3.0, t) * 16; let d = ''; for (let k = 0; k <= 120; k++) { const u = k / 120, X = lerp(orbs[3][0], orbs[9][0], u), Y = lerp(orbs[3][1], orbs[9][1], u) + Math.sin(u * 18 - t * 6) * a * Math.sin(u * Math.PI); d += (k ? 'L' : 'M') + X.toFixed(1) + ' ' + Y.toFixed(1); } wv.setAttribute('d', d); });
  const rd = mono('', { left: '1380px', top: '650px', color: C.lsaff }); tl.to(rd, { scrambleText: { text: 'REQ-0081 · ROUTED 3 / 40 · DUE 14 D', chars: '0123456789ABCDEF', speed: .6 }, duration: .8 }, 3.5);
  mono('Agent routing · best fit', { left: '120px', top: '150px', color: C.text });
  illustrative();
  title('Posted by teachers and industry. Built by <i class="em">certified</i> learners.', 'F13 · The requirements loop');
};

// F14 · Tools built with earned tokens · iso-infographic
FR[14] = async () => {
  el('div', { ...full, background: `radial-gradient(ellipse at 50% 55%, #142240 0%, ${C.night} 72%)` });
  const S = 64, cx = 960, cy = 420; const iso = (x, y, z) => [cx + (x - y) * S * .866, cy + (x + y) * S * .5 - z * S];
  const P = a => a.map(p => iso(...p).map(v => v.toFixed(1)).join(',')).join(' ');
  const cube = (x, y, z, w, d, h, c1, c2, c3) => `<polygon points="${P([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])}" fill="${c1}"/><polygon points="${P([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])}" fill="${c2}"/><polygon points="${P([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])}" fill="${c3}"/>`;
  const s = svgEl(stage, { zIndex: 2 }, `<g class="bench">${cube(-3, -1.5, -.4, 6, 3, .4, '#22345C', '#162544', '#1B2C50')}<polyline points="${P([[-3, 1.5, 0], [-3, -1.5, 0], [3, -1.5, 0]])}" stroke="${C.lsaff}" stroke-opacity=".5" fill="none"/></g>
    ${[['LIBRARY', C.blue, '#173068', '#1A3672'], ['SKILL', C.saff, '#A85F1C', '#BF6D22'], ['CONNECTOR', C.lsaff, '#C48B44', '#D69D52']].map(([n, a, b, c], i) => `<g class="bk">${cube(.4, -.6, i * .6, 1.3, 1.3, .6, a, b, c)}</g>`).join('')}
    <polygon class="tool" points="${P([[.4, -.6, 1.8], [1.7, -.6, 1.8], [1.7, .7, 1.8], [.4, .7, 1.8]])}" stroke="${C.lsaff}" stroke-width="2" fill="none" opacity="0"/>`);
  const bks = [...s.querySelectorAll('.bk')];
  bks.forEach((b, i) => { tl.from(b, { y: -420, opacity: 0, duration: .55, ease: 'bounce.out' }, 1.6 + i * .55); const [x, y] = iso(1.7, .7, i * .6 + .3); const lb = mono(['Library', 'Skill', 'Connector'][i], { left: (x + 90) + 'px', top: (y - 8) + 'px', color: C.text, zIndex: 3 }); const ln = svgEl(stage, { zIndex: 3 }, `<path d="M${x + 6} ${y} H${x + 82}" stroke="rgba(236,232,223,.5)"/>`); tl.from([lb, ln], { opacity: 0, duration: .3 }, 2.0 + i * .55); });
  tl.to(s.querySelector('.tool'), { opacity: 1, duration: .4 }, 3.35);
  const tg = glass({ left: '1040px', top: '160px', padding: '14px 20px', zIndex: 4 }, stage, `<span style="font-family:JBM;font-size:13px;letter-spacing:.12em;color:${C.lsaff}">TOOL · LOAD-CHECK V1</span>`, { r: 16 }); tl.from(tg, { opacity: 0, y: 14, duration: .6, ease: 'reveal' }, 3.45);
  const ck = glass({ left: '120px', top: '170px', width: '380px', height: '400px', zIndex: 4 }, stage, '', { r: 24 });
  mono('Checklist', { left: '26px', top: '24px' }, ck);
  ['Read the brief', 'Pick libraries', 'Write the test', 'Earn tokens'].forEach((t, i) => { const r = disp(`<span class="b" style="display:inline-block;width:20px;height:20px;border-radius:6px;border:1px solid rgba(255,255,255,.4);margin-right:14px;vertical-align:-3px;text-align:center;font-size:14px;line-height:20px;color:${C.night}"></span>${t}`, { left: '26px', top: (60 + i * 42) + 'px', fontSize: '22px', fontWeight: 400 }, ck); const b = r.querySelector('.b'); tl.to(b, { backgroundColor: C.saff, borderColor: C.saff, duration: .2, onUpdate() { b.textContent = '✓'; } }, .4 + i * .22); });
  mono('Tokens', { left: '26px', top: '250px' }, ck); const tn = disp('0', { left: '24px', top: '272px', fontSize: '72px', letterSpacing: '-.03em' }, ck);
  const bar = el('div', { position: 'absolute', left: '26px', right: '26px', top: '368px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,.1)' }, ck); const fill = el('div', { width: '0%', height: '100%', borderRadius: '3px', background: C.saff }, bar);
  const tk = { v: 0 }; tl.to(tk, { v: 12, duration: 1.1, ease: 'glide' }, .3); [0, 1, 2].forEach(i => tl.to(tk, { v: 12 - (i + 1) * 4, duration: .25 }, 1.6 + i * .55));
  perFrame.push(() => { tn.textContent = Math.round(tk.v); fill.style.width = (tk.v / 12 * 100) + '%'; });
  const lg = glass({ left: '1420px', top: '300px', width: '380px', height: '300px', zIndex: 4 }, stage, '', { r: 24 }); mono('Agentic history', { left: '24px', top: '22px' }, lg);
  const inner = el('div', { position: 'absolute', left: '24px', top: '56px', right: '20px', fontFamily: 'JBM', fontSize: '12.5px', lineHeight: '26px', color: C.text, whiteSpace: 'nowrap' }, lg,
    ['12:01 clone lib/fea-lite', '12:03 skill unit-check', '12:06 connector sensor-csv', '12:08 spend 4 tokens', '12:10 spend 4 tokens', '12:12 spend 4 tokens', '12:14 tests 3/3 pass', '12:15 tool load-check v1', '12:15 history sealed'].map((l, i) => `<div style="opacity:${i > 5 ? 1 : .65}">${l}</div>`).join(''));
  el('div', { position: 'absolute', left: 0, right: 0, top: '50px', height: '250px', overflow: 'hidden' }, lg).appendChild(inner); inner.style.top = '6px';
  tl.fromTo(inner, { y: 200 }, { y: -20, duration: 3, ease: 'none' }, 1.3);
  illustrative();
  title('Earn tokens. Build the tools. Keep the <i class="em">history.</i>', 'F14 · Tools built with earned tokens');
};

// F15 · Transcendence phase · oscilloscope-math
FR[15] = async () => {
  el('div', { ...full, background: C.night });
  const sc = glass({ left: '300px', top: '130px', width: '1320px', height: '660px' }, stage, '', { r: 36, fill: .04 });
  const cv = el('canvas', { position: 'absolute', left: '40px', top: '40px', width: '1240px', height: '580px', borderRadius: '18px', background: '#0C1529' }, sc); cv.width = 1240; cv.height = 580; const o = cv.getContext('2d');
  const gx = 1240, gy = 580, mid = 290;
  const A = (x, t) => Math.sin(x * .018 - t * 2.2) * 120 + (vn(x * .05, 3) - .5) * 26;
  const ph = { v: 1.7 }; tl.to(ph, { v: 0, duration: 1.8, ease: 'glide' }, 1.5);
  const B = (x, t) => Math.sin(x * .018 - t * 2.2 + ph.v) * 112;
  const Cc = (x, t) => Math.sin(x * .036 - t * 4.4) * 52;
  const trace = (fn, t, col, a, w) => { o.strokeStyle = col; o.globalAlpha = a; o.lineWidth = w; o.beginPath(); for (let x = 0; x <= gx; x += 4) { const y = mid - fn(x, t); x ? o.lineTo(x, y) : o.moveTo(x, y); } o.stroke(); };
  const err = mono('', { left: '60px', top: '60px', color: C.lsaff, zIndex: 3 }, sc);
  const rates = [...Array(5)].map((_, i) => { const m = mono(`◆ Peer ${i + 1}`, { right: '64px', top: (70 + i * 26) + 'px', color: C.text, zIndex: 3 }, sc); tl.from(m, { opacity: 0, x: 10, duration: .3 }, 2.4 + i * .2); return m; });
  const nr = mono('New repo', { left: '1040px', top: '150px', color: C.saff, zIndex: 3, fontSize: '15px' }, sc); tl.from(nr, { opacity: 0, duration: .4 }, 3.9);
  perFrame.push((f, t) => { o.globalAlpha = 1; o.clearRect(0, 0, gx, gy); o.strokeStyle = 'rgba(236,232,223,.07)'; o.lineWidth = 1;
    for (let i = 0; i <= 12; i++) { o.beginPath(); o.moveTo(i * gx / 12, 0); o.lineTo(i * gx / 12, gy); o.stroke(); } for (let i = 0; i <= 8; i++) { o.beginPath(); o.moveTo(0, i * gy / 8); o.lineTo(gx, i * gy / 8); o.stroke(); }
    o.strokeStyle = 'rgba(236,232,223,.2)'; o.beginPath(); o.moveTo(0, mid); o.lineTo(gx, mid); o.stroke();
    const cmb = ss(3.5, 4.2, t); o.globalCompositeOperation = 'lighter';
    for (let k = 6; k >= 0; k--) { const tt = t - k / 30, fa = (1 - k / 7) ** 2;
      trace(A, tt, C.text, .35 * fa * (1 - cmb * .6), 1.6);
      trace((x, q) => B(x, q) + (cmb ? Cc(x, q) * cmb : 0), tt, C.saff, .8 * fa, 2.4);
      if (t > 3.4) trace(Cc, tt, '#8FA8E0', .5 * fa * ss(3.4, 3.7, t) * (1 - cmb * .7), 1.6); }
    o.globalCompositeOperation = 'source-over'; err.textContent = t < 3.6 ? `Trace A · real data   Trace B · tool   Phase error ${(ph.v * 57.3).toFixed(1)}°` : 'Trace B + trace C → new waveform'; });
  tl.from(sc, { opacity: 0, scale: .96, duration: .9, ease: 'reveal' }, 0);
  illustrative();
  title('Tested against reality. Rated by peers. Combined into something <i class="em">new.</i>', 'F15 · Transcendence phase');
};

// F16 · The hive network · dark-keynote
FR[16] = async () => {
  el('div', { ...full, background: `radial-gradient(ellipse at 50% 40%, #151A26 0%, #050608 70%)` });
  const Rr = 60, cx = 960, cy = 500; const cells = []; for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) { if (Math.abs(q + r) > 2) continue; cells.push([cx + Rr * 1.732 * (q + r / 2), cy + Rr * 1.5 * r]); }
  const hexP = (x, y, r) => [...Array(6)].map((_, i) => { const a = i / 6 * 6.283 - Math.PI / 2; return [x + Math.cos(a) * r, y + Math.sin(a) * r]; });
  const names = ['FEA-LITE', 'UNIT-CHECK', 'SENSOR-CSV', 'LATTICE', 'MESH-FIX', 'BOM', 'CFD-2D', 'LOAD-CHECK', 'GRIP-SIM', 'KINE', 'COST', 'TOL', 'PCB', 'THERM', 'IO', 'DOCS', 'QA', 'RIG', 'FIT'];
  const path = [9, 8, 4, 3]; const R = rng(2);
  const s = svgEl(stage, { zIndex: 2 }, `<defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,255,255,.14)"/><stop offset="1" stop-color="rgba(255,255,255,.03)"/></linearGradient><radialGradient id="hl"><stop offset="0" stop-color="${C.lsaff}"/><stop offset="1" stop-color="${C.saff}"/></radialGradient></defs>
    ${cells.map(([x, y], i) => { const p = hexP(x, y, Rr - 5); return `<g class="cell"><polygon class="hx" points="${p.map(a => a.join(',')).join(' ')}" fill="url(#hg)" stroke="rgba(255,255,255,.28)"/><polyline points="${[p[5], p[0], p[1]].map(a => a.join(',')).join(' ')}" stroke="rgba(255,255,255,.55)"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="rgba(236,232,223,.55)" font-family="JBM" font-size="9.5" letter-spacing="1">${names[i]}</text></g>`; }).join('')}
    <polyline class="pp" points="${[[960, 196], ...path.map(i => cells[i])].map(a => a.join(',')).join(' ')}" stroke="${C.lsaff}" stroke-width="2" fill="none"/>`);
  const G = [...s.querySelectorAll('.cell')];
  G.forEach((g, i) => tl.from(g, { x: (R() - .5) * 900, y: (R() - .5) * 600, rotation: (R() - .5) * 120, opacity: 0, transformOrigin: '50% 50%', duration: 1.1, ease: 'snap' }, .05 + R() * .5));
  const bar = glass({ left: '600px', top: '150px', width: '720px', height: '64px', zIndex: 4, display: 'flex', alignItems: 'center', padding: '0 28px', fontFamily: 'SG', fontSize: '22px' }, stage, '', { r: 32 });
  const q = el('span', {}, bar, ''); const qt = 'Which tool checks a bracket under 2 kN?'; const tw = { n: 0 }; tl.from(bar, { opacity: 0, y: -12, duration: .6, ease: 'reveal' }, 1.2).to(tw, { n: qt.length, duration: 1, ease: 'none' }, 1.6);
  perFrame.push(() => { q.textContent = qt.slice(0, Math.round(tw.n)); });
  tl.from(s.querySelector('.pp'), { drawSVG: 0, duration: 1, ease: 'glide' }, 2.7).to(s.querySelector('.pp'), { drawSVG: '100% 100%', duration: .7, ease: 'glide' }, 3.9);
  path.forEach((i, k) => tl.to(G[i].querySelector('.hx'), { attr: { fill: 'url(#hl)' }, duration: .2 }, 2.9 + k * .2).to(G[i].querySelector('text'), { attr: { fill: C.night } , duration: .2 }, 2.9 + k * .2));
  const an = mono('Answer · 4 tools · 312 tokens', { left: '640px', top: '230px', color: C.lsaff, zIndex: 4 }); tl.from(an, { opacity: 0, duration: .4 }, 4.0);
  illustrative();
  title('Every cohort leaves a <i class="em">hive.</i> Ask it what it has built.', 'F16 · The hive network');
};

// F17 · Vision modules · art-deco
FR[17] = async () => {
  el('div', { ...full, background: `linear-gradient(180deg, ${C.night} 0%, #0E1628 100%)` });
  const ox = 960, oy = 820; const rays = [...Array(7)].map((_, i) => { const a = (-90 + (i - 3) * 22) * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; });
  const gates = []; for (let k = 0; k < 13; k++) gates.push({ y: 740 - k * 40, ray: k % 2 === 0 });
  const s = svgEl(stage, { zIndex: 2 }, `${rays.map(([x, y], i) => `<path class="ry" d="M${ox + x * 60} ${oy + y * 60} L${ox + x * 760} ${oy + y * 760}" stroke="${C.lsaff}" stroke-width="${i === 3 ? 1 : 1.4}" opacity=".7"/><path class="ry" d="M${ox + x * 60 + 10 * -y} ${oy + y * 60 + 10 * x} L${ox + x * 700 + 10 * -y} ${oy + y * 700 + 10 * x}" stroke="${C.lsaff}" stroke-width=".6" opacity=".35"/>`).join('')}
    ${[1, 2, 3].map(r => `<path class="ry" d="M${ox - r * 90} ${oy} A${r * 90} ${r * 90} 0 0 1 ${ox + r * 90} ${oy}" stroke="${C.lsaff}" opacity=".45"/>`).join('')}
    ${gates.map((g, k) => g.ray ? `<path class="gt" d="M${ox - 120} ${g.y} H${ox - 90} L${ox - 82} ${g.y - 6} H${ox + 82} L${ox + 90} ${g.y} H${ox + 120}" stroke="rgba(236,232,223,.45)" stroke-width="1.6"/><text x="${ox - 140}" y="${g.y + 4}" text-anchor="end" fill="rgba(236,232,223,.5)" font-family="JBM" font-size="11">${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][k / 2]}</text>`
      : `<path class="gt" d="M${ox - 70} ${g.y - 10} L${ox} ${g.y + 6} L${ox + 70} ${g.y - 10}" stroke="rgba(236,232,223,.45)" stroke-width="1.6"/><text x="${ox + 140}" y="${g.y + 4}" fill="rgba(236,232,223,.5)" font-family="JBM" font-size="11">${(k + 1) / 2}</text>`).join('')}`);
  tl.from(s.querySelectorAll('.ry'), { drawSVG: 0, duration: 1, ease: 'glide', stagger: .03 }, 0).from(s.querySelectorAll('.gt'), { drawSVG: '50% 50%', duration: .5, ease: 'reveal', stagger: .03 }, .6);
  const card = glass({ left: (ox - 80) + 'px', top: '0px', width: '160px', height: '210px', zIndex: 3, clipPath: 'polygon(14% 0, 86% 0, 100% 10%, 100% 90%, 86% 100%, 14% 100%, 0 90%, 0 10%)' }, stage, '', { r: 4, fill: .1 });
  mono('Vision', { left: '0', right: '0', top: '26px', textAlign: 'center', color: C.text }, card); mono('Module', { left: '0', right: '0', top: '44px', textAlign: 'center' }, card);
  const seal = el('div', { position: 'absolute', left: '44px', top: '90px', width: '72px', height: '72px', borderRadius: '50%', border: '1.5px solid rgba(236,232,223,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, card, `<svg width="44" height="44" viewBox="-22 -22 44 44">${[...Array(8)].map((_, i) => `<path d="M0 0 L${Math.cos(i * .785) * 18} ${Math.sin(i * .785) * 18}" stroke="currentColor" stroke-width="1.4"/>`).join('')}<circle r="6" fill="currentColor"/></svg>`); seal.style.color = 'rgba(236,232,223,.5)';
  const cy = { v: 820 }; tl.to(cy, { v: 236, duration: 2.6, ease: 'glide' }, 1.0);
  const gts = [...s.querySelectorAll('.gt')]; const passed = new Array(13).fill(false);
  perFrame.push((f, t) => { card.style.top = (cy.v - 105) + 'px'; gates.forEach((g, k) => { const p = cy.v + 20 < g.y; gts[k].setAttribute('stroke', p ? C.saff : 'rgba(236,232,223,.45)'); gts[k].setAttribute('stroke-width', p ? 2.4 : 1.6); });
    const gld = ss(3.65, 3.95, t); seal.style.color = gld > .5 ? C.gold : 'rgba(236,232,223,.5)'; seal.style.borderColor = gld > .5 ? C.gold : 'rgba(236,232,223,.4)'; seal.style.boxShadow = gld ? `0 0 ${30 * gld}px rgba(176,141,60,${.5 * gld}), inset 0 0 14px rgba(176,141,60,${.4 * gld})` : 'none'; });
  const lb = mono('Vision module · Q1 2027 · Government · Industry', { left: '1180px', top: '170px', color: C.lsaff }); tl.from(lb, { opacity: 0, duration: .5 }, 3.8);
  mono('Seven streams', { left: '600px', top: '150px' }); mono('Six disciplines', { left: '1180px', top: '196px' });
  illustrative();
  title('The <i class="em">vision</i> of the individual, valued highest.', 'F17 · Vision modules');
};

// F18 · Four Es for schools · Liquid Glass UI
FR[18] = async () => {
  const L = liquid(stage, { sat: .58, k: 1.3, seed: 9, dim: .85 });
  const sun = el('div', { position: 'absolute', left: '900px', top: '150px', width: '120px', height: '168px', zIndex: 4, opacity: .9, filter: 'brightness(0) invert(.92)' }, stage, await (await fetch('../shared/sun-full.svg')).text());
  const sv = sun.querySelector('svg'); sv.setAttribute('width', 120); sv.setAttribute('height', 168);
  const halo = el('div', { position: 'absolute', left: '860px', top: '134px', width: '200px', height: '200px', borderRadius: '50%', zIndex: 3, background: 'radial-gradient(circle, rgba(242,183,102,.85), rgba(217,130,43,0) 70%)', opacity: 0 });
  const defs = [['Enable', 'perception'], ['Engage', 'interest'], ['Enhance', 'sense of control'], ['Educate <i class="em" style="font-size:30px;color:inherit">Samatwam</i>', 'the institution learns']];
  const xs = [150, 520, 890, 1260], ws = [330, 330, 330, 510];
  const btns = defs.map(([a, b], i) => { const g = glass({ left: xs[i] + 'px', top: '500px', width: ws[i] + 'px', height: '96px', zIndex: 3 }, stage, '', { r: 48, fill: .08, blur: 18 });
    const fl = el('div', { position: 'absolute', inset: 0, borderRadius: '48px', background: `linear-gradient(180deg, ${C.lsaff}, ${C.saff})`, transformOrigin: '0 50%', transform: 'scaleX(0)', opacity: .9 }, g);
    disp(a, { left: '36px', top: '16px', fontSize: '30px', zIndex: 2 }, g); mono(b, { left: '38px', top: '58px', fontSize: '11px', zIndex: 2 }, g);
    tl.from(g, { opacity: 0, y: 30, duration: .8, ease: 'reveal' }, .1 + i * .08); return fl; });
  const goo = svgEl(stage, { zIndex: 4, pointerEvents: 'none' }, `<defs><filter id="goo"><feGaussianBlur stdDeviation="12"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"/></filter><linearGradient id="lq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.lsaff}"/><stop offset="1" stop-color="${C.saff}"/></linearGradient></defs><g filter="url(#goo)" fill="url(#lq)">${[...Array(6)].map((_, i) => `<circle class="bl" r="${30 - i * 3}" cx="0" cy="0"/>`).join('')}</g>`);
  const bl = [...goo.querySelectorAll('.bl')];
  const stops = [[150 + 60, 548], [520 + 60, 548], [890 + 60, 548], [1260 + 60, 548]];
  const pos = { x: stops[0][0] - 120, y: 548 };
  tl.to(pos, { x: stops[0][0], duration: .5, ease: 'glide' }, .9); [1, 2, 3].forEach(i => tl.to(pos, { x: stops[i][0], duration: .55, ease: 'glide' }, 1.15 + i * .62));
  btns.forEach((b, i) => tl.to(b, { scaleX: 1, duration: .5, ease: 'glide' }, 1.3 + i * .62));
  const up = { v: 0 }; tl.to(up, { v: 1, duration: .9, ease: 'glide' }, 3.6); tl.to(halo, { opacity: 1, duration: .6 }, 4.2).to(sun, { filter: 'brightness(0) invert(.92) drop-shadow(0 0 18px rgba(242,183,102,.9))', duration: .4 }, 4.2);
  const hist = []; perFrame.push((f, t) => { const p0 = [pos.x, pos.y]; const target = [960, 240]; const k = up.v; const st = [lerp(stops[3][0] + 160, target[0], k), lerp(548, target[1], k)];
    const head = k > 0 ? st : p0; bl.forEach((b, i) => { const lag = i * .05; const kk = clamp(k - lag * (k > 0 ? 1 : 0)); const hx = k > 0 ? lerp(stops[3][0] + 160, target[0], kk) : pos.x - i * 14 * Math.sign(1); const hy = k > 0 ? lerp(548, target[1], kk) + Math.sin(kk * Math.PI) * 30 * (i % 2 ? 1 : -1) : 548;
      b.setAttribute('cx', hx); b.setAttribute('cy', hy); b.setAttribute('r', k >= .98 ? 0 : (30 - i * 3) * (t < .9 ? ss(.6, .9, t) : 1)); }); });
  title('Enable. Engage. Enhance. Educate <i class="em">Samatwam.</i>', 'F18 · Four Es for schools');
};
