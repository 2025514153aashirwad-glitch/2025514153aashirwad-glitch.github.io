// Samatwam Physical AI · five wearables · 5 s each. One light per shot; every gradient carries light or data.
const WR = {};
const vn = (() => { const P = new Uint8Array(512); let k = 7; const r = () => (k = (k * 9301 + 49297) % 233280) / 233280; const p = [...Array(256).keys()].sort(() => r() - .5); for (let i = 0; i < 512; i++) P[i] = p[i & 255]; const g = (x, y) => P[P[x & 255] + (y & 255)] / 255, f = t => t * t * (3 - 2 * t); return (x, y) => { const ix = Math.floor(x), iy = Math.floor(y), fx = f(x - ix), fy = f(y - iy); return lerp(lerp(g(ix, iy), g(ix + 1, iy), fx), lerp(g(ix, iy + 1), g(ix + 1, iy + 1), fx), fy); }; })();
const KEY = 'rgba(255,244,228,.9)';
// the left column every clip shares: label, headline, spec rows with hairlines (a product page grid, not a centred hero)
function column(code, name, line, specs, at = .3) {
  const lb = label(`${code} · ${name}`, { left: '120px', top: '150px', fontSize: '18px', color: C.lsaff, zIndex: 20 });
  const cn = label('Concept', { left: (120 + 22 * (code.length + name.length + 3) * .62 + 40) + 'px', top: '146px', fontSize: '14px', padding: '5px 10px', border: '1px solid rgba(255,255,255,.35)', borderRadius: '8px', zIndex: 20 });
  tl.from([lb, cn], { opacity: 0, x: -10, duration: .5, ease: 'reveal', stagger: .08 }, at);
  head(line, { l: 116, t: 196, s: 70, w: 700, at: at + .15, mode: 'words', z: 20 });
  specs.forEach(([k, v], i) => { const y = 520 + i * 74;
    const r = el('div', { position: 'absolute', left: '120px', top: y + 'px', width: '560px', height: '74px', borderTop: '1px solid rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Geist', zIndex: 20 }, stage, `<span style="font-size:17px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.6)">${k}</span><span class="v" style="font-size:30px;font-weight:500;letter-spacing:-.02em;color:#F5F3EE"></span>`);
    tl.from(r, { opacity: 0, duration: .4 }, at + .9 + i * .14).to(r.querySelector('.v'), { scrambleText: { text: v, chars: '0123456789.', speed: .6 }, duration: .7 }, at + 1 + i * .14); });
  const ln = el('div', { position: 'absolute', left: '120px', top: (520 + specs.length * 74) + 'px', width: '560px', height: '1px', background: 'rgba(255,255,255,.18)', zIndex: 20 }); tl.from(ln, { scaleX: 0, transformOrigin: '0 0', duration: .6, ease: 'glide' }, at + .9);
  const ft = label('Samatwam Physical AI · edge model · targets, not measurements', { left: '120px', top: '960px', fontSize: '14px', color: 'rgba(255,255,255,.45)', zIndex: 20 }); tl.from(ft, { opacity: 0, duration: .6 }, at + 1.4);
}
// the moment the model decides: one saffron chip, the only accent in the frame
function decision(html, x, y, at) { const p = pill(`<span style="width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 0 10px #fff"></span><span style="font-size:26px">${html}</span>`, { left: x + 'px', top: y + 'px', zIndex: 21, background: `linear-gradient(180deg, ${C.lsaff}, ${C.saff})`, color: C.ink }, stage, { h: 66, pad: 26 });
  tl.from(p, { scale: .7, opacity: 0, duration: .5, ease: 'snap' }, at); return p; }
// a studio: dark cyclorama lit by one key light from the upper left; the floor gradient is that light's falloff
function studio(kx = 30, ky = 18, warm = true) { const s = el('div', { ...full, background: `radial-gradient(70% 90% at ${kx}% ${ky}%, ${warm ? '#2B2620' : '#1C2330'} 0%, #101216 45%, #07080A 100%)` });
  el('div', { position: 'absolute', left: 0, right: 0, top: '62%', bottom: 0, background: `radial-gradient(60% 120% at ${kx + 25}% 0%, rgba(255,240,220,.07), rgba(0,0,0,0) 70%)` }, s); return s; }

// W1 · Ring · light sweep across brushed titanium; a strain arc fills as a heat gradient
WR[1] = () => {
  studio(62, 12);
  const s = svgIn(stage, W, H, `<defs>
      <linearGradient id="ti" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9EBEE"/><stop offset=".35" stop-color="#9DA3AB"/><stop offset=".55" stop-color="#5E646C"/><stop offset=".8" stop-color="#A9AEB5"/><stop offset="1" stop-color="#3E434A"/></linearGradient>
      <linearGradient id="inner" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1C20"/><stop offset="1" stop-color="#4A4F57"/></linearGradient>
      <linearGradient id="sw" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="translate(-600 0) rotate(18)"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".48" stop-color="#fff" stop-opacity=".0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset=".53" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="heat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1F3A7A"/><stop offset=".55" stop-color="${C.saff}"/><stop offset="1" stop-color="${C.lsaff}"/></linearGradient>
      <pattern id="br" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 2 H4" stroke="rgba(255,255,255,.08)" stroke-width="1"/></pattern></defs>
    <ellipse cx="1290" cy="880" rx="330" ry="40" fill="rgba(0,0,0,.55)" filter="blur(18px)"/>
    <g class="ring"><path d="M1290 260 a330 330 0 1 0 .1 0 Z M1290 330 a260 260 0 1 1 -.1 0 Z" fill="url(#ti)" fill-rule="evenodd"/>
      <path d="M1290 260 a330 330 0 1 0 .1 0 Z M1290 330 a260 260 0 1 1 -.1 0 Z" fill="url(#br)" fill-rule="evenodd"/>
      <path d="M1030 590 a260 260 0 0 0 520 0" stroke="url(#inner)" stroke-width="22" opacity=".9"/>
      <rect x="1272" y="268" width="36" height="14" rx="5" fill="#0B0D10"/><circle class="led" cx="1290" cy="275" r="3.5" fill="${C.saff}"/>
      <path class="swp" d="M1290 260 a330 330 0 1 0 .1 0 Z M1290 330 a260 260 0 1 1 -.1 0 Z" fill="url(#sw)" fill-rule="evenodd"/></g>
    <path class="arc" d="M1290 205 a385 385 0 0 1 385 385" stroke="url(#heat)" stroke-width="6" stroke-linecap="round"/>
    <path d="M1290 205 a385 385 0 0 1 385 385" stroke="rgba(255,255,255,.12)" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 0"/>`, { zIndex: 5 });
  const sw = s.querySelector('#sw'); const p = { x: -700 }; tl.to(p, { x: 1900, duration: 2.2, ease: 'glide' }, .4); perFrame.push(() => sw.setAttribute('gradientTransform', `translate(${p.x} 0) rotate(18)`));
  tl.from(s.querySelector('.ring'), { opacity: 0, scale: .94, transformOrigin: '1290px 590px', duration: 1.2, ease: 'reveal' }, 0).fromTo(s.querySelector('.arc'), { drawSVG: '0%' }, { drawSVG: '72%', duration: 1.6, ease: 'glide' }, 1.8);
  tl.to(s.querySelector('.led'), { attr: { r: 6 }, duration: .2, yoyo: true, repeat: 3 }, 3.2);
  const g = label('Grip strain · 72% of your baseline', { left: '1520px', top: '250px', fontSize: '16px', color: C.text, zIndex: 6 }); tl.from(g, { opacity: 0, duration: .4 }, 2.6);
  column('W1', 'Ring', 'Feels the strain before you do.', [['Model on ring', '0.4 MB'], ['Decision in', '4 ms'], ['Weight', '4 g'], ['Band', '8 mm']]);
  decision('Rest 2 min', 1160, 920, 3.4);
};

// W2 · Band · real footage mapped through a gradient (navy to saffron); eight muscle channels drive a robot
WR[2] = () => {
  el('div', { position: 'absolute', width: 0, height: 0 }, stage, `<svg width="0" height="0"><filter id="gmap" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues="0.03 0.06 0.11 0.72 0.88"/><feFuncG type="table" tableValues="0.03 0.11 0.20 0.42 0.64"/><feFuncB type="table" tableValues="0.06 0.24 0.48 0.17 0.40"/></feComponentTransfer></filter></svg>`);
  const A = foot(22957, { grade: 'contrast(1.15) brightness(1.05)', zoom: [1.12, 1.02], pos: '60% 55%', tint: 'linear-gradient(90deg, rgba(7,8,10,.85) 0%, rgba(7,8,10,.35) 45%, rgba(7,8,10,0) 70%)' }); A.img.style.filter += ' url(#gmap)';
  const B = cut(47257, 2.4, { grade: 'contrast(1.15) brightness(1.05)', zoom: [1.15, 1.0], pos: '45% 50%', tint: 'linear-gradient(90deg, rgba(7,8,10,.85) 0%, rgba(7,8,10,.35) 45%, rgba(7,8,10,0) 70%)' }); B.img.style.filter += ' url(#gmap)'; wipeIn(B, 2.4, .9, 'left');
  el('div', { ...full, zIndex: 4, background: 'linear-gradient(90deg, rgba(7,8,10,.94) 0%, rgba(7,8,10,.82) 36%, rgba(7,8,10,.25) 58%, rgba(7,8,10,0) 75%)' });
  const s = svgIn(stage, W, H, [...Array(8)].map((_, i) => `<path class="ch" stroke="${i === 2 || i === 5 ? C.lsaff : 'rgba(255,255,255,.55)'}" stroke-width="${i === 2 || i === 5 ? 2.4 : 1.4}"/><text x="1160" y="${236 + i * 64}" fill="rgba(255,255,255,.5)" font-family="Geist" font-size="13" letter-spacing="2">EMG ${i + 1}</text>`).join(''), { zIndex: 6 });
  const ch = [...s.querySelectorAll('.ch')]; const R = (k => () => (k = (k * 9301 + 49297) % 233280) / 233280)(3);
  const noise = [...Array(8)].map(() => [...Array(200)].map(() => R() - .5));
  perFrame.push((f, t) => ch.forEach((c, i) => { const burst = (i === 2 || i === 5) ? Math.exp(-((t - 1.6) ** 2) / .08) * 3 + Math.exp(-((t - 3.2) ** 2) / .08) * 3 : 0; let d = ''; for (let k = 0; k < 200; k++) { const x = 1240 + k * 2.8, n = noise[i][(k + f * 3) % 200]; const y = 230 + i * 64 + n * (8 + burst * 18 * Math.exp(-((k - 160) ** 2) / 900)); d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } c.setAttribute('d', d); }));
  tl.from(s, { opacity: 0, duration: .6 }, .5);
  const m = label('Pinch detected · channels 3 and 6', { left: '1240px', top: '760px', fontSize: '16px', color: C.lsaff, zIndex: 7 }); show(m, 1.7, 2.4);
  column('W2', 'Band', 'Your hand moves. The robot follows.', [['Model on band', '1.5 MB'], ['Gesture to command', '18 ms'], ['Channels', '8'], ['Weight', '38 g']]);
  decision('Gripper close', 1240, 820, 3.3);
};

// W3 · Glasses · the world seen through the lens; lens falloff and a faint chromatic edge are the gradients
WR[3] = () => {
  el('div', { ...full, background: '#07080A' });
  const lens = (cx) => foot(47266, { box: { left: (cx - 250) + 'px', top: '300px', width: '500px', height: '400px' }, z: 2, zoom: [1.25, 1.1], rate: .6, grade: 'saturate(.85) contrast(1.08) brightness(.9)', tint: 'radial-gradient(75% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(7,8,10,.75) 100%)', css: { clipPath: 'path("M30 60 Q30 0 110 0 L390 0 Q470 0 470 70 L460 270 Q450 400 300 400 L180 400 Q40 400 30 270 Z")' } });
  const L1 = lens(1030), L2 = lens(1530); [L1, L2].forEach((l, i) => { l.img.style.objectPosition = i ? '70% 50%' : '30% 50%'; tl.from(l, { opacity: 0, duration: 1 }, .1); });
  const fr = svgIn(stage, W, H, `<defs><linearGradient id="fr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3F47"/><stop offset=".4" stop-color="#15181C"/><stop offset="1" stop-color="#2A2E35"/></linearGradient></defs>
    ${[1030, 1530].map(cx => `<path d="M${cx - 220} 360 Q${cx - 220} 300 ${cx - 140} 300 L${cx + 140} 300 Q${cx + 220} 300 ${cx + 220} 370 L${cx + 210} 570 Q${cx + 200} 700 ${cx + 50} 700 L${cx - 70} 700 Q${cx - 210} 700 ${cx - 220} 570 Z" stroke="url(#fr)" stroke-width="22"/><path d="M${cx - 200} 330 Q${cx - 100} 312 ${cx + 60} 316" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <path d="M1250 360 Q1280 335 1310 360" stroke="url(#fr)" stroke-width="18"/><circle cx="1280" cy="322" r="11" fill="#0B0D10" stroke="#3A3F47" stroke-width="3"/><circle cx="1280" cy="322" r="4" fill="#24314F"/>
    <path d="M810 360 H700 M1750 360 H1860" stroke="url(#fr)" stroke-width="16" stroke-linecap="round"/>`, { zIndex: 4 });
  tl.from(fr, { opacity: 0, y: 20, duration: 1, ease: 'reveal' }, 0);
  const boxes = svgIn(stage, W, H, `<g class="bx"><rect x="1430" y="430" width="150" height="110" rx="6" stroke="${C.lsaff}" stroke-width="2"/><path d="M1430 450 V430 H1450 M1560 430 H1580 V450" stroke="#fff" stroke-width="3"/></g><g class="bx"><rect x="900" y="470" width="190" height="130" rx="6" stroke="rgba(255,255,255,.75)" stroke-width="1.6" stroke-dasharray="5 6"/></g>`, { zIndex: 5 });
  tl.from(boxes.querySelectorAll('.bx'), { opacity: 0, scale: 1.2, transformOrigin: '50% 50%', duration: .4, ease: 'snap', stagger: .3 }, 1.6);
  const t1 = label('M6 bolt · step 3 of 7', { left: '1430px', top: '552px', fontSize: '14px', color: C.lsaff, zIndex: 6, background: 'rgba(7,8,10,.6)', padding: '4px 8px', borderRadius: '6px' }); show(t1, 1.9);
  const t2 = label('Torque tool · next', { left: '900px', top: '612px', fontSize: '14px', color: C.text, zIndex: 6, background: 'rgba(7,8,10,.6)', padding: '4px 8px', borderRadius: '6px' }); show(t2, 2.2);
  column('W3', 'Glasses', 'It sees the part you are holding.', [['Model on glasses', '20 MB'], ['Frame rate', '15 fps'], ['Images sent out', '0'], ['Weight', '42 g']]);
  decision('Tighten to 9 N·m', 1170, 780, 3.2);
};

// W4 · Glove · a pressure field on the fingertips (the gradient is the force), mirrored as a robot grasp
WR[4] = () => {
  studio(70, 10, false);
  const ox = 1020, oy = 170;
  const tips = [[78, 150], [178, 60], [262, 42], [346, 72], [450, 300]];
  const fingers = [[40, 120, 76, 330, -8], [140, 30, 78, 360, -3], [226, 10, 78, 380, 0], [312, 40, 76, 350, 4], [400, 260, 80, 250, 38]];
  const gl = svgIn(stage, W, H, `<defs><linearGradient id="knit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B4250"/><stop offset=".6" stop-color="#1A1E26"/><stop offset="1" stop-color="#262B35"/></linearGradient><pattern id="kp" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3 Q1.5 0 3 3 T6 3" stroke="rgba(255,255,255,.06)" fill="none"/></pattern></defs>
    <g transform="translate(${ox} ${oy})">${fingers.map(([x, y, w, h, r]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" transform="rotate(${r} ${x + w / 2} ${y + h})" fill="url(#knit)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" transform="rotate(${r} ${x + w / 2} ${y + h})" fill="url(#kp)"/>`).join('')}
    <rect x="30" y="330" width="400" height="420" rx="90" fill="url(#knit)"/><rect x="30" y="330" width="400" height="420" rx="90" fill="url(#kp)"/><rect x="60" y="690" width="340" height="60" rx="10" fill="#0F1218"/>
    ${tips.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#0B0D10" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>`).join('')}</g>`, { zIndex: 3 });
  tl.from(gl, { opacity: 0, y: 30, duration: 1, ease: 'reveal' }, 0);
  const cv = el('canvas', { ...full, zIndex: 4, mixBlendMode: 'screen' }); cv.width = W / 2; cv.height = H / 2; const o = cv.getContext('2d');
  const force = [.9, .55, .7, .35, 1.0];
  perFrame.push((f, t) => { o.clearRect(0, 0, cv.width, cv.height); const k = ss(1.0, 2.4, t) * (1 - .25 * ss(3.6, 4.4, t));
    tips.forEach(([x, y], i) => { const v = force[i] * k * (1 + .05 * Math.sin(t * 9 + i)); if (v < .01) return; const r = 30 + 60 * v; const X = (ox + x) / 2, Y = (oy + y) / 2; const g = o.createRadialGradient(X, Y, 0, X, Y, r);
      g.addColorStop(0, `rgba(255,236,200,${.95 * v})`); g.addColorStop(.25, `rgba(242,183,102,${.85 * v})`); g.addColorStop(.6, `rgba(217,130,43,${.45 * v})`); g.addColorStop(1, 'rgba(31,58,122,0)'); o.fillStyle = g; o.beginPath(); o.arc(X, Y, r, 0, 7); o.fill(); }); });
  const bars = el('div', { position: 'absolute', left: '1560px', top: '300px', width: '240px', zIndex: 6 });
  label('Grasp sent to robot', { left: 0, top: '-40px', fontSize: '15px', color: 'rgba(255,255,255,.6)' }, bars);
  ['Thumb', 'Index', 'Middle', 'Ring', 'Little'].forEach((n, i) => { const v = [force[4], force[0], force[1], force[2], force[3]][i];
    label(n, { left: 0, top: (i * 70) + 'px', fontSize: '14px' }, bars); const tr = el('div', { position: 'absolute', left: 0, top: (i * 70 + 26) + 'px', width: '240px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.12)' }, bars);
    const b = el('div', { width: (v * 100) + '%', height: '100%', borderRadius: '4px', background: `linear-gradient(90deg, #1F3A7A, ${C.saff} 70%, ${C.lsaff})`, transformOrigin: '0 50%' }, tr); tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'glide' }, 1.2 + i * .06);
    const nv = label('0.0 N', { left: '170px', top: (i * 70) + 'px', fontSize: '14px', color: C.text }, bars); count(nv, v * 6, 1.2, 1.2, x => x.toFixed(1) + ' N'); });
  tl.from(bars, { opacity: 0, x: 20, duration: .6 }, 1.0);
  column('W4', 'Glove', 'Show a robot once. It learns the grasp.', [['Model on glove', '3 MB'], ['Fingertip pads', '16'], ['Sample rate', '200 Hz'], ['Weight', '55 g']]);
  decision('Grasp saved · 1 of 1', 1100, 960 - 80, 3.4);
};

// W5 · Pendant · sound as rings and a spectrogram; the fault band turns saffron
WR[5] = () => {
  const bg = foot(23377, { grade: 'saturate(.5) contrast(1.05) brightness(.35)', blur: 6, zoom: [1.1, 1.0] });
  el('div', { ...full, background: 'linear-gradient(90deg, rgba(7,8,10,.92) 0%, rgba(7,8,10,.55) 50%, rgba(7,8,10,.3) 100%)' });
  const cx = 1180, cy = 420;
  const rings = svgIn(stage, W, H, [...Array(7)].map(() => `<circle class="rg" cx="${cx}" cy="${cy}" r="100" stroke="rgba(255,255,255,.5)" stroke-width="1.4"/>`).join(''), { zIndex: 3 });
  const rgs = [...rings.querySelectorAll('.rg')];
  perFrame.push((f, t) => rgs.forEach((r, i) => { const ph = ((t * .55 + i / 7) % 1); const rad = 110 + ph * 420; r.setAttribute('r', rad.toFixed(1)); const hot = t > 2.6 && t < 4.4 && i % 3 === 0; r.setAttribute('stroke', hot ? C.saff : 'rgba(255,255,255,.5)'); r.setAttribute('opacity', ((1 - ph) * .8).toFixed(2)); r.setAttribute('stroke-width', hot ? 2.6 : 1.4); }));
  const disc = el('div', { position: 'absolute', left: (cx - 95) + 'px', top: (cy - 95) + 'px', width: '190px', height: '190px', borderRadius: '50%', zIndex: 5, background: 'conic-gradient(from 210deg, #F2F3F5, #9EA4AC 18%, #5E646C 32%, #D6D9DD 50%, #7C828A 66%, #EEF0F2 82%, #F2F3F5)', boxShadow: 'inset 0 0 0 10px rgba(0,0,0,.12), inset 0 2px 2px rgba(255,255,255,.9), 0 30px 60px rgba(0,0,0,.6)' });
  [0, 1, 2, 3].forEach(i => { const a = i * Math.PI / 2 + Math.PI / 4; el('div', { position: 'absolute', left: (95 + Math.cos(a) * 52 - 5) + 'px', top: (95 + Math.sin(a) * 52 - 5) + 'px', width: '10px', height: '10px', borderRadius: '50%', background: '#1B1F26', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.8)' }, disc); });
  const led = el('div', { position: 'absolute', left: '90px', top: '90px', width: '10px', height: '10px', borderRadius: '50%', background: '#3A3F47' }, disc); tl.to(led, { background: C.saff, boxShadow: `0 0 14px ${C.saff}`, duration: .2 }, 2.8);
  tl.from(disc, { scale: .8, opacity: 0, duration: 1, ease: 'reveal' }, 0);
  const sp = el('canvas', { position: 'absolute', left: '880px', top: '720px', width: '920px', height: '200px', borderRadius: '14px', zIndex: 6, border: '1px solid rgba(255,255,255,.2)' }); sp.width = 460; sp.height = 100; const o = sp.getContext('2d');
  const ramp = v => { v = clamp(v); const s = [[7, 8, 10], [19, 33, 61], [31, 58, 122], [217, 130, 43], [242, 183, 102]]; const x = v * 4, i = Math.min(3, Math.floor(x)), k = x - i; return s[i].map((c, j) => Math.round(lerp(c, s[i + 1][j], k))); };
  const img = o.createImageData(460, 100);
  perFrame.push((f, t) => { const cols = Math.min(460, Math.round(f / 149 * 460)); const d = img.data;
    for (let x = 0; x < 460; x++) for (let y = 0; y < 100; y++) { const i = (y * 460 + x) * 4; if (x > cols) { d[i + 3] = 0; continue; } const tt = x / 460 * 5; const fy = 1 - y / 100;
      let v = .18 + .5 * Math.exp(-((fy - .12) ** 2) / .002) + .25 * Math.exp(-((fy - .3) ** 2) / .003) + vn(x * .3, y * .3) * .15; if (tt > 2.6) v += .7 * Math.exp(-((fy - .62) ** 2) / .0015) * ss(2.6, 3.0, tt); const c = ramp(v); d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; }
    o.putImageData(img, 0, 0); });
  tl.from(sp, { opacity: 0, duration: .6 }, .4);
  label('Machine sound · 0 to 2 kHz', { left: '880px', top: '690px', fontSize: '14px', color: 'rgba(255,255,255,.6)', zIndex: 6 });
  const fb = label('Bearing wear · 1.2 kHz band', { left: '1520px', top: '690px', fontSize: '14px', color: C.lsaff, zIndex: 6 }); show(fb, 3.0);
  column('W5', 'Pendant', 'It hears a machine fail before it does.', [['Model on pendant', '2 MB'], ['Microphones', '4'], ['Warning ahead', '3 days'], ['Weight', '22 g']]);
  decision('Service line 2 on Friday', 880, 580, 3.4);
};
