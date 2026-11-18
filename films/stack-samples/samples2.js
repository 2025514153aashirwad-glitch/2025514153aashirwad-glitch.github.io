// Visual-craft library, round 2: ten 5-second clips, each a different craft aimed at a different side of Samatwam.
// Libraries: Paper Shaders, GSAP (SplitText, ScrambleText, DrawSVG, Flip, MotionPath), Rough.js, Matter.js, Zdog, D3, Mixkit footage.
const W = 1920, H = 1080, DUR = 5, FPS = 30;
const INK = '#0B0F17', BLUE = '#2E6FD6', PALE = '#BFD3F6', PAPER = '#F4F1EA', RED = '#D9442E', GOLD = '#F2C14E';
gsap.registerPlugin(SplitText, DrawSVGPlugin, ScrambleTextPlugin, Flip, MotionPathPlugin);
const stage = document.getElementById('stage');
const tl = gsap.timeline({ paused: true });
const shaders = [], feeds = [], perFrame = [], canvases = [];
const C = s => PS.getShaderColorFromString(s);
const sizing = (fit = 'cover', scale = 1) => ({ u_fit: PS.ShaderFitOptions[fit], u_scale: scale, u_rotation: 0, u_originX: .5, u_originY: .5, u_offsetX: 0, u_offsetY: 0, u_worldWidth: 0, u_worldHeight: 0 });
const full = { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px' };
function el(tag, css = {}, parent = stage, html = '') { const e = document.createElement(tag); Object.assign(e.style, css); if (html) e.innerHTML = html; parent.appendChild(e); return e; }
function shaderLayer(frag, uniforms, fit = 'cover', scale = 1, css = {}) { const d = el('div', { ...full, ...css }); const m = new PS.ShaderMount(d, frag, { ...sizing(fit, scale), ...uniforms }, { preserveDrawingBuffer: true, premultipliedAlpha: false }, 0, 0, 1, W * H); shaders.push(m); return m; }
function text(s, css) { return el('div', { position: 'absolute', fontFamily: 'Geist', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', ...css }, stage, s); }
function mono(s, css) { return text(s, { fontFamily: 'GeistMono', fontWeight: 400, fontSize: '15px', letterSpacing: '4px', textTransform: 'uppercase', ...css }); }
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
async function noiseTex() { const n = PS.getShaderNoiseTexture(); if (n && !n.complete) await new Promise(r => { n.onload = r; n.onerror = r; }); return n; }
const frameSrc = (id, f) => `../shared/footage/${id}/${String(f + 1).padStart(4, '0')}.jpg`;
function grainOverlay(op = .12) {
  const s = el('div', { ...full, mixBlendMode: 'overlay', opacity: op, pointerEvents: 'none' }, stage, `<svg width="${W}" height="${H}"><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="1"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg>`);
  const tb = s.querySelector('feTurbulence'); perFrame.push(f => tb.setAttribute('seed', String(f % 23 + 1)));
}
const svgNS = 'http://www.w3.org/2000/svg';
function svgLayer(css = {}) { const s = document.createElementNS(svgNS, 'svg'); s.setAttribute('width', W); s.setAttribute('height', H); Object.assign(s.style, { position: 'absolute', left: 0, top: 0, ...css }); stage.appendChild(s); return s; }

const CRAFTS = {
  // 07 · DITHERED ARCHIVE — microscope footage resolving into two-tone ordered dither; the claim decodes
  async dither() {
    const first = await load(frameSrc(47783, 0));
    const m = shaderLayer(PS.imageDitheringFragmentShader, { u_image: first, u_colorFront: C(PALE), u_colorBack: C(INK), u_colorHighlight: C('#FFFFFF'), u_type: 3, u_pxSize: 14, u_colorSteps: 2, u_originalColors: false, u_inverted: false });
    const p = { px: 14 }; tl.to(p, { px: 3, duration: 2.2, ease: 'power3.inOut' }, .2);
    feeds.push({ id: 47783, m, extra: () => ({ u_pxSize: p.px }) });
    el('div', { position: 'absolute', left: '120px', top: '760px', width: '1260px', height: '200px', background: INK });
    const k = mono('Class 04 · Open Research', { left: '160px', top: '800px', color: PALE });
    const h = text('', { left: '160px', top: '842px', fontSize: '64px', letterSpacing: '-2px' });
    const tag = mono('R3 · Reproduced', { left: '1180px', top: '804px', color: INK, background: PALE, padding: '6px 12px', letterSpacing: '2px', fontSize: '13px' });
    tl.from(k, { opacity: 0, duration: .5 }, .4).to(h, { scrambleText: { text: 'A claim is only as good as its proof.', chars: '01░▒▓/\\|', revealDelay: .3, speed: .6 }, duration: 2.2, ease: 'none' }, .6).from(tag, { opacity: 0, x: 20, duration: .5, ease: 'power3.out' }, 3.2);
  },
  // 08 · LIQUID CHROME — the mark as flowing liquid metal
  async chrome() {
    el('div', { ...full, background: `radial-gradient(1100px 700px at 50% 42%, #1A2233 0%, ${INK} 70%)` });
    const img = await load('../shared/mark-sun.png');
    shaderLayer(PS.liquidMetalFragmentShader, { u_image: img, u_isImage: true, u_colorBack: C('#00000000'), u_colorTint: C('#DCE6F8'), u_repetition: 2.2, u_shiftRed: .35, u_shiftBlue: .35, u_contour: .4, u_softness: .12, u_distortion: .08, u_angle: 70, u_shape: 0 }, 'contain', .95, { top: '-90px' });
    const wm = text('SAMATWAM', { left: 0, width: W + 'px', textAlign: 'center', top: '850px', fontSize: '46px', letterSpacing: '26px' });
    const tg = text('Uniting People, Building Systems', { left: 0, width: W + 'px', textAlign: 'center', top: '922px', fontSize: '30px', fontWeight: 400, color: PALE, letterSpacing: '-.4px' });
    const sw = SplitText.create(wm, { type: 'chars', mask: 'chars' }), st = SplitText.create(tg, { type: 'words', mask: 'words' });
    tl.from(sw.chars, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: .05 }, 1.4).from(st.words, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: .06 }, 2.1);
  },
  // 09 · HALFTONE PRESS — a team on site printed as a CMYK poster; the hackathon clock runs
  async halftone() {
    const first = await load(frameSrc(23511, 0));
    const m = shaderLayer(PS.halftoneCmykFragmentShader, { u_image: first, u_noiseTexture: await noiseTex(), u_colorBack: C(PAPER), u_colorC: C(BLUE), u_colorM: C(RED), u_colorY: C(GOLD), u_colorK: C(INK), u_size: .55, u_contrast: 1.15, u_softness: .25, u_grainSize: .5, u_grainMixer: .15, u_grainOverlay: .15, u_gridNoise: .15, u_floodC: 0, u_floodM: 0, u_floodY: 0, u_floodK: 0, u_gainC: 0, u_gainM: 0, u_gainY: 0, u_gainK: 0, u_type: Object.values(PS.HalftoneCmykTypes)[0] });
    feeds.push({ id: 23511, m });
    el('div', { position: 'absolute', left: 0, top: 0, width: '900px', height: H + 'px', background: PAPER });
    const k = mono('Class 06 · Hackathon', { left: '90px', top: '110px', color: INK });
    const a = text('PRESSURE', { left: '84px', top: '170px', fontSize: '150px', letterSpacing: '-6px', color: INK, lineHeight: '150px' });
    const b = text('REVEALS', { left: '84px', top: '320px', fontSize: '150px', letterSpacing: '-6px', color: INK, lineHeight: '150px' });
    const c = text('STRUCTURE.', { left: '84px', top: '470px', fontSize: '136px', letterSpacing: '-5px', color: RED, lineHeight: '150px' });
    const clock = text('47:59:59', { left: '90px', top: '760px', fontFamily: 'GeistMono', fontSize: '84px', color: INK, fontWeight: 400 });
    const sub = mono('Two to four people · a real brief · one working prototype', { left: '90px', top: '880px', color: INK, fontSize: '13px', letterSpacing: '2px' });
    [a, b, c].forEach((e, i) => { const s = SplitText.create(e, { type: 'chars', mask: 'chars' }); tl.from(s.chars, { yPercent: 105, duration: .9, ease: 'expo.out', stagger: .03 }, .3 + i * .25); });
    const o = { s: 48 * 3600 - 1 }; tl.to(o, { s: 31 * 3600 + 12 * 60, duration: 4.6, ease: 'power1.in', onUpdate: () => { const v = Math.floor(o.s); clock.textContent = [Math.floor(v / 3600), Math.floor(v % 3600 / 60), v % 60].map(x => String(x).padStart(2, '0')).join(':'); } }, .2)
      .from(k, { opacity: 0, duration: .5 }, .2).from(sub, { opacity: 0, duration: .5 }, 1.4).from(clock, { opacity: 0, duration: .4 }, .9);
  },
  // 10 · ENGINEER'S NOTEBOOK — the toolchain sketched by hand, the key step circled in red
  async notebook() {
    el('div', { ...full, background: '#FBFAF6', backgroundImage: 'linear-gradient(#DCE4F2 1px, transparent 1px), linear-gradient(90deg, #DCE4F2 1px, transparent 1px)', backgroundSize: '40px 40px' });
    el('div', { position: 'absolute', left: '150px', top: 0, width: '2px', height: H + 'px', background: '#E9A8A0' });
    const s = svgLayer(), rc = rough.svg(s), ink = '#1D3A78';
    const title = text('Learn by making something of your own.', { left: '200px', top: '90px', fontFamily: 'Caveat', fontWeight: 600, fontSize: '74px', color: ink });
    const stages = ['Problem', 'Principles', 'Build', 'Validate', 'Document', 'Certify'];
    const nodes = [];
    stages.forEach((st, i) => { const x = 210 + i * 275, y = 430, w = 220, h = 120;
      const box = rc.rectangle(x, y, w, h, { seed: 10 + i, roughness: 1.6, bowing: 1.2, stroke: ink, strokeWidth: 2.6, fill: i === 3 ? 'rgba(217,68,46,.10)' : undefined, fillStyle: 'hachure', hachureGap: 9 }); s.appendChild(box); nodes.push(box);
      const lbl = text(st, { left: x + 'px', width: w + 'px', textAlign: 'center', top: (y + 32) + 'px', fontFamily: 'Caveat', fontWeight: 600, fontSize: '44px', color: ink });
      if (i < stages.length - 1) { const ar = rc.line(x + w + 8, y + 60, x + 267, y + 60, { seed: 30 + i, stroke: ink, strokeWidth: 2.4, roughness: 1.4 }); const hd = rc.linearPath([[x + 252, y + 48], [x + 267, y + 60], [x + 252, y + 72]], { seed: 40 + i, stroke: ink, strokeWidth: 2.4 }); s.appendChild(ar); s.appendChild(hd); nodes.push(ar, hd); }
      tl.from(lbl, { opacity: 0, duration: .25 }, .5 + i * .38); });
    const circ = rc.ellipse(210 + 3 * 275 + 110, 490, 330, 220, { seed: 77, stroke: RED, strokeWidth: 3.4, roughness: 2.2 }); s.appendChild(circ);
    const note = text('every equation explained,<br>one reference case validated', { left: '1010px', top: '660px', fontFamily: 'Caveat', fontWeight: 600, fontSize: '46px', color: RED, lineHeight: '50px' });
    const arrow = rc.curve([[1000, 700], [960, 650], [1000, 590]], { seed: 81, stroke: RED, strokeWidth: 3, roughness: 1.6 }); s.appendChild(arrow);
    const paths = el => [...el.querySelectorAll('path')];
    tl.from(title, { opacity: 0, y: 10, duration: .6 }, .1);
    nodes.forEach((n, i) => tl.from(paths(n), { drawSVG: '0%', duration: .45, ease: 'power2.inOut' }, .35 + i * .19));
    tl.from(paths(circ), { drawSVG: '0%', duration: .7, ease: 'power2.inOut' }, 3.0).from(paths(arrow), { drawSVG: '0%', duration: .4 }, 3.5).from(note, { opacity: 0, duration: .4 }, 3.7);
  },
  // 11 · HEAT SIGNATURE — the Build hexagon as a thermal field; Forge stages climb
  async heat() {
    const img = await load('../shared/mark-hexagon.webp');
    shaderLayer(PS.heatmapFragmentShader, { u_image: img, u_contour: .9, u_angle: 0, u_noise: .08, u_innerGlow: 1, u_outerGlow: 1, u_colorBack: C(INK), u_colors: [C('#112D5C'), C(BLUE), C(RED), C(GOLD), C('#FFF6DD')], u_colorsCount: 5 }, 'contain', .72, { left: '-260px' });
    const k = mono('The Forge · from thought to hardware', { left: '1180px', top: '300px', color: PALE });
    const lad = ['F0  Thought', 'F1  Specification', 'F2  Digital model', 'F3  Simulation', 'F4  Fabrication', 'F5  Instrumentation', 'F6  Tested prototype'];
    lad.forEach((s, i) => { const e = mono(s, { left: '1180px', top: (360 + i * 54) + 'px', color: '#fff', fontSize: '20px', letterSpacing: '2px', textTransform: 'none' }); tl.from(e, { opacity: 0, x: -14, duration: .35, ease: 'power3.out' }, .5 + i * .45).to(e, { color: i === 6 ? GOLD : '#7D8698', duration: .3 }, .5 + (i + 1) * .45); });
    tl.from(k, { opacity: 0, duration: .5 }, .2);
  },
  // 12 · SELECTION — real 2D physics: claims fall onto a sieve; only tested ones pass
  async selection() {
    const cv = el('canvas', { ...full }); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    const E = Matter.Engine.create({ gravity: { y: 1.1 } }), Bodies = Matter.Bodies, wd = E.world;
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const st = { isStatic: true };
    const walls = [Bodies.rectangle(800, 540, 20, 1000, st), Bodies.rectangle(1600, 540, 20, 1000, st), Bodies.rectangle(1200, 1070, 1000, 20, st)];
    const sieve = []; for (let x = 810; x < 1590; x += 60) sieve.push(Bodies.rectangle(x + 16, 560, 32, 14, st));   // slots 20 px wide
    const bodies = [];
    for (let i = 0; i < 70; i++) { const tested = rnd() < .3, s = tested ? 14 : 34 + rnd() * 20; const b = Bodies.rectangle(860 + rnd() * 680, -60 - i * 26, s, tested ? s : s * .7, { restitution: .15, friction: .3, angle: rnd() * 6 }); b.tested = tested; bodies.push(b); }
    Matter.World.add(wd, [...walls, ...sieve, ...bodies]);
    const rec = []; for (let f = 0; f < DUR * FPS; f++) { for (let k = 0; k < 4; k++) Matter.Engine.update(E, 1000 / FPS / 4); rec.push(bodies.map(b => [b.position.x, b.position.y, b.angle])); }
    const draw = f => {
      g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, H);
      g.strokeStyle = '#E4E4E1'; g.lineWidth = 1; for (let x = 0; x < W; x += 60) { g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, H); g.stroke(); }
      g.fillStyle = INK; for (const w of [...walls, ...sieve]) { const v = w.vertices; g.beginPath(); v.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.closePath(); g.fill(); }
      g.font = '14px GeistMono'; g.fillStyle = BLUE; g.fillText('TEST', 1620, 566); g.fillText('ONLY WHAT IS PROVEN PASSES', 1620, 590);
      bodies.forEach((b, i) => { const [x, y, a] = rec[f][i]; const w = b.bounds.max.x - b.bounds.min.x; g.save(); g.translate(x, y); g.rotate(a); const v = b.vertices.map(p => [p.x - b.position.x, p.y - b.position.y]);
        g.rotate(-b.angle); g.beginPath(); v.forEach((p, k) => k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fillStyle = b.tested ? BLUE : '#C9CBD0'; g.fill(); g.restore(); });
      const passed = bodies.filter((b, i) => rec[f][i][1] > 600).length, stuck = bodies.filter((b, i) => rec[f][i][1] > 380 && rec[f][i][1] <= 600).length;
      g.font = '15px GeistMono'; g.fillStyle = INK; g.fillText(`ON THE SIEVE  ${String(stuck).padStart(2, '0')}`, 130, 860); g.fillStyle = BLUE; g.fillText(`PASSED  ${String(passed).padStart(2, '0')}`, 130, 892);
    };
    canvases.push(draw);
    const h = text('Selection.', { left: '120px', top: '150px', fontSize: '96px', letterSpacing: '-3px', color: INK });
    const p = text('Not everything passes.<br>Noise is removed<br>where claims meet the test.', { left: '124px', top: '290px', fontSize: '30px', fontWeight: 400, color: '#4A4A47', lineHeight: '40px', whiteSpace: 'normal', width: '400px' });
    tl.from(SplitText.create(h, { type: 'chars', mask: 'chars' }).chars, { yPercent: 105, duration: .9, ease: 'expo.out', stagger: .04 }, .2).from(p, { opacity: 0, y: 10, duration: .7 }, .6);
  },
  // 13 · ISOMETRIC STUDIO — the six classes rise as blocks around the shared spine
  async iso() {
    el('div', { ...full, background: '#FFFFFF' });
    const cv = el('canvas', { ...full }); cv.width = W; cv.height = H; const TAU = Zdog.TAU;
    const illo = new Zdog.Illustration({ element: cv, rotate: { x: -Math.atan(1 / Math.SQRT2), y: TAU / 8 }, zoom: 1.25, resize: false });
    const root = new Zdog.Anchor({ addTo: illo, translate: { x: 330, y: 40 } });
    new Zdog.Box({ addTo: root, width: 760, depth: 760, height: 24, translate: { y: 72 }, color: '#E9EDF4', topFace: '#F3F5F9', leftFace: '#D7DEEA', rightFace: '#C9D2E2', stroke: false });
    new Zdog.Ellipse({ addTo: root, diameter: 500, rotate: { x: TAU / 4 }, translate: { y: 59 }, stroke: 3, color: BLUE });
    const grow = []; const mk = (h, opts) => { const a = new Zdog.Anchor({ addTo: root, translate: { x: opts.x, z: opts.z, y: 60 } }); new Zdog.Box({ addTo: a, width: opts.w, depth: opts.w, height: h, translate: { y: -h / 2 }, color: opts.c, topFace: opts.top, leftFace: opts.l, rightFace: opts.r, stroke: false }); grow.push(a); return a; };
    mk(360, { x: 0, z: 0, w: 74, c: BLUE, top: '#7FA6EE', l: '#2459B4', r: '#1C478F' });
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, r = 250; mk(110 + i * 26, { x: Math.cos(a) * r, z: Math.sin(a) * r, w: 104, c: INK, top: i === 2 ? BLUE : '#3A4458', l: '#1B2231', r: '#0B0F17' }); }
    const P = { lift: 0, rot: 0 };
    tl.to(P, { lift: 1, duration: 2.6, ease: 'expo.out' }, .2).to(P, { rot: 1, duration: 5, ease: 'none' }, 0);
    canvases.push(() => {
      grow.forEach((a, i) => { const k = gsap.utils.clamp(.001, 1, P.lift * 1.5 - (i ? (i - 1) * .1 + .1 : 0)); a.scale = { x: 1, y: k, z: 1 }; });
      root.rotate.y = P.rot * TAU / 6; illo.updateRenderGraph();
    });
    const h = text('Six classes.<br>One spine.', { left: '120px', top: '150px', fontSize: '86px', letterSpacing: '-3px', color: INK, lineHeight: '90px', whiteSpace: 'normal', width: '600px' });
    const names = ['Physical AI', 'Simulation', 'Open Engineering', 'Open Research', 'Data Interfaces', 'Hackathon'];
    names.forEach((n, i) => { const e = mono(n, { left: '124px', top: (420 + i * 40) + 'px', color: i === 2 ? BLUE : INK, letterSpacing: '2px' }); tl.from(e, { opacity: 0, x: -10, duration: .3 }, 1.0 + i * .18); });
    const sp = mono('Blue column · the shared spine: Studio · Test Bench · Certification · Build Record', { left: '124px', top: '700px', color: BLUE, fontSize: '13px', letterSpacing: '2px' });
    tl.from(SplitText.create(h, { type: 'lines', mask: 'lines' }).lines, { yPercent: 105, duration: 1, ease: 'expo.out', stagger: .1 }, .2).from(sp, { opacity: 0, duration: .5 }, 2.6);
  },
  // 14 · DATA WEAVE — thirty days of ward air quality drawn from the data, over a dot grid
  async data() {
    shaderLayer(PS.dotGridFragmentShader, { u_colorBack: C('#FFFFFF'), u_colorFill: C('#C9D3E6'), u_colorStroke: C('#00000000'), u_dotSize: 2, u_gapX: 28, u_gapY: 28, u_strokeWidth: 0, u_sizeRange: 0, u_opacityRange: .4, u_shape: 0 }, 'none');
    const s = d3.select(svgLayer()), x0 = 140, x1 = 1240, y0 = 300, y1 = 820;
    let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const data = d3.range(30).map(i => ({ d: i, v: 118 + 34 * Math.sin(i / 4.2) + i * 1.6 + (rnd() - .5) * 26 })); data[29].v = 176;
    const x = d3.scaleLinear([0, 29], [x0, x1]), y = d3.scaleLinear([60, 200], [y1, y0]);
    const ax = s.append('g').attr('transform', `translate(0,${y1})`).call(d3.axisBottom(x).ticks(6).tickFormat(d => `Nov ${d + 1}`).tickSizeOuter(0));
    const ay = s.append('g').attr('transform', `translate(${x0},0)`).call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
    s.selectAll('.tick text').attr('font-family', 'GeistMono').attr('font-size', 14).attr('fill', '#5E6470'); s.selectAll('.domain,.tick line').attr('stroke', '#9AA3B2');
    const lim = s.append('line').attr('x1', x0).attr('x2', x1).attr('y1', y(150)).attr('y2', y(150)).attr('stroke', RED).attr('stroke-width', 2).attr('stroke-dasharray', '8 8');
    const limT = s.append('text').attr('x', x1).attr('y', y(150) - 12).attr('text-anchor', 'end').attr('font-family', 'GeistMono').attr('font-size', 14).attr('fill', RED).text('150 · UNHEALTHY');
    const area = s.append('path').datum(data).attr('d', d3.area().x(d => x(d.d)).y0(y1).y1(d => y(d.v)).curve(d3.curveMonotoneX)).attr('fill', 'rgba(46,111,214,.10)');
    const line = s.append('path').datum(data).attr('d', d3.line().x(d => x(d.d)).y(d => y(d.v)).curve(d3.curveMonotoneX)).attr('fill', 'none').attr('stroke', BLUE).attr('stroke-width', 4);
    const dots = s.selectAll('.dot').data(data).join('circle').attr('cx', d => x(d.d)).attr('cy', d => y(d.v)).attr('r', d => d.d === 29 ? 10 : 4).attr('fill', d => d.d === 29 ? RED : BLUE);
    const k = mono('Class 05 · Data Interfaces · Ward 7 air quality', { left: '140px', top: '160px', color: '#5E6470' });
    const h = text('Data is useful only when someone can use it.', { left: '140px', top: '196px', fontSize: '54px', letterSpacing: '-1.8px', color: INK });
    const big = text('0', { left: '1380px', top: '330px', fontSize: '200px', letterSpacing: '-8px', color: INK, fontFamily: 'Geist' });
    const cap = mono('AQI today · highest in 30 days', { left: '1388px', top: '580px', color: RED, fontSize: '14px', letterSpacing: '2px' });
    const done = mono('✓  Ward officer · alert sent in 38 s', { left: '1388px', top: '640px', color: '#1F7A3A', fontSize: '14px', letterSpacing: '2px' });
    const o = { v: 0 };
    tl.from(k, { opacity: 0, duration: .4 }, .1).from(SplitText.create(h, { type: 'words', mask: 'words' }).words, { yPercent: 105, duration: .8, ease: 'expo.out', stagger: .04 }, .2)
      .from([ax.node(), ay.node()], { opacity: 0, duration: .5 }, .5).from(line.node(), { drawSVG: '0%', duration: 2.2, ease: 'power2.inOut' }, .8).from(area.node(), { opacity: 0, duration: 1.2 }, 1.6)
      .from(dots.nodes(), { scale: 0, transformOrigin: '50% 50%', duration: .3, stagger: .06 }, .9).from([lim.node(), limT.node()], { opacity: 0, duration: .4 }, 2.6)
      .to(o, { v: 176, duration: 1.6, ease: 'power3.out', onUpdate: () => { big.textContent = Math.round(o.v); } }, 2.4).from(cap, { opacity: 0, duration: .4 }, 3.2).from(done, { opacity: 0, x: -10, duration: .4 }, 3.8);
  },
  // 15 · FIRST LIGHT — light spreading from one hub, then a federation
  async light() {
    shaderLayer(PS.godRaysFragmentShader, { u_colorBack: C(INK), u_colorBloom: C('#2E6FD6'), u_colors: [C(PALE), C(BLUE), C(GOLD)], u_colorsCount: 3, u_spotty: .3, u_midSize: .18, u_midIntensity: .55, u_density: .35, u_intensity: .6, u_bloom: .45, u_noiseTexture: await noiseTex() }, 'cover', 1, { opacity: 1 });
    const hubs = svgLayer(); const cx = 960, cy = 540; const pts = [[cx, cy, 'DELHI · NCR', 0]];
    [[-1, -1], [1, -1], [0, 1]].forEach(([a, b], i) => pts.push([cx + a * 300, cy + b * 210, '', 1]));
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 - Math.PI / 2; pts.push([cx + Math.cos(a) * 560, cy + Math.sin(a) * 380, '', 2]); }
    pts.forEach(([x, y, lbl, lv], i) => { if (i) { const par = lv === 1 ? pts[0] : pts[1 + Math.round((i - 4) / 3) % 3]; const l = document.createElementNS(svgNS, 'line'); Object.entries({ x1: par[0], y1: par[1], x2: x, y2: y, stroke: '#BFD3F6', 'stroke-width': 1.5, opacity: .7 }).forEach(([k, v]) => l.setAttribute(k, v)); hubs.appendChild(l); tl.from(l, { drawSVG: '0%', duration: .6, ease: 'power2.out' }, lv === 1 ? 1.8 + i * .12 : 2.6 + (i - 4) * .08); }
      const c = document.createElementNS(svgNS, 'circle'); Object.entries({ cx: x, cy: y, r: lv === 0 ? 14 : lv === 1 ? 9 : 6, fill: lv === 0 ? '#FFFFFF' : lv === 1 ? PALE : 'none', stroke: '#FFFFFF', 'stroke-width': 2 }).forEach(([k, v]) => c.setAttribute(k, v)); hubs.appendChild(c);
      tl.from(c, { scale: 0, transformOrigin: `${x}px ${y}px`, duration: .4, ease: 'back.out(2)' }, lv === 0 ? .4 : lv === 1 ? 2.1 + i * .1 : 2.9 + (i - 4) * .08); });
    const lb = mono('Delhi · NCR', { left: '990px', top: '510px', color: '#fff', fontSize: '13px', letterSpacing: '3px' });
    const h = text('First our own light,', { left: '120px', top: '110px', fontSize: '64px', letterSpacing: '-2px' });
    const h2 = text('then a federation.', { left: '120px', top: '184px', fontSize: '64px', letterSpacing: '-2px', color: PALE });
    const f = mono('1 hub → 3 → 9 · one standard of certification', { left: '120px', top: '960px', color: PALE, fontSize: '14px', letterSpacing: '3px' });
    tl.from(SplitText.create(h, { type: 'words', mask: 'words' }).words, { yPercent: 105, duration: .9, ease: 'expo.out', stagger: .05 }, .3).from(SplitText.create(h2, { type: 'words', mask: 'words' }).words, { yPercent: 105, duration: .9, ease: 'expo.out', stagger: .05 }, 1.6)
      .from(lb, { opacity: 0, duration: .4 }, .8).from(f, { opacity: 0, duration: .5 }, 3.4);
  },
  // 16 · KINETIC LIFE — the seven steps of a work, rearranged with Flip: a list becomes a line, Certify takes the light
  async kinetic() {
    shaderLayer(PS.colorPanelsFragmentShader, { u_colors: [C('#14305E'), C(BLUE), C('#5C86D6'), C('#9DB8EC')], u_colorsCount: 4, u_colorBack: C(INK), u_angle1: .3, u_angle2: .3, u_length: 1.1, u_edges: false, u_blur: .25, u_fadeIn: 1, u_fadeOut: .3, u_density: 3, u_gradient: .2 });
    el('div', { ...full, background: 'rgba(11,15,23,.35)' });
    const steps = ['Question', 'Author', 'Build', 'Test', 'Certify', 'Share', 'Combine'];
    const ctx = document.createElement('canvas').getContext('2d'); const wOf = (s, px) => { ctx.font = `500 ${px}px Geist`; return ctx.measureText(s).width - s.length * (px * .035); };
    let bx = 140; const B = steps.map((s, i) => { const px = i === 4 ? 96 : 48, x = bx; bx += wOf(s, px) + 70 + (i === 4 ? 10 : 0); return { x, y: i === 4 ? 640 : 680, px }; });
    const items = steps.map((s, i) => { const e = el('div', { position: 'absolute', left: '0px', top: '0px', fontFamily: 'Geist', fontWeight: 500, fontSize: '96px', letterSpacing: '-.035em', lineHeight: '1', color: i === 4 ? '#fff' : 'rgba(255,255,255,.45)', whiteSpace: 'nowrap' }, stage, s);
      const n = mono('0' + (i + 1), { left: '0px', top: '0px', color: i === 4 ? PALE : 'rgba(255,255,255,.55)', fontSize: '14px', letterSpacing: '2px' });
      gsap.set(e, { x: 220, y: 140 + i * 112 }); gsap.set(n, { x: 140, y: 140 + i * 112 + 44 }); return [e, n]; });
    const k = mono('The life of a work · the same in every class', { left: '140px', top: '96px', color: PALE });
    tl.from(items.map(p => p[0]), { yPercent: 60, opacity: 0, duration: .8, ease: 'expo.out', stagger: .07 }, .1).from(items.map(p => p[1]), { opacity: 0, duration: .5, stagger: .07 }, .2).from(k, { opacity: 0, duration: .4 }, .1);
    items.forEach(([e, n], i) => { tl.to(e, { x: B[i].x, y: B[i].y, fontSize: B[i].px + 'px', duration: 1.2, ease: 'expo.inOut' }, 2.0 + i * .04).to(n, { x: B[i].x, y: B[i].y - 34, duration: 1.2, ease: 'expo.inOut' }, 2.0 + i * .04); });
    const p = text('People certify.', { left: '140px', top: '860px', fontSize: '40px', color: PALE, letterSpacing: '-1px', fontWeight: 400 });
    tl.from(p, { opacity: 0, y: 10, duration: .5 }, 3.6);
  },
};

// ------------------------------------------------------------------ frame control for the recorder
window.DUR = DUR; window.EV = [];
const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
const ready = (async () => { for (const f of ['500 120px Geist', '400 34px Geist', '15px GeistMono', '600 44px Caveat']) await document.fonts.load(f); await CRAFTS[window.SAMPLE](); })();
window.render = async function (t) {
  await ready; const f = Math.min(Math.round(t * FPS), DUR * FPS - 1);
  tl.seek(t, false);
  for (const fd of feeds) { const im = await load(frameSrc(fd.id, f)); fd.m.setUniforms({ u_image: im, ...(fd.extra ? fd.extra() : {}) }); }
  perFrame.forEach(fn => fn(f)); canvases.forEach(fn => fn(f));
  shaders.forEach(m => m.setFrame(t * 1000));
  await raf();
};
window.READY = true;
