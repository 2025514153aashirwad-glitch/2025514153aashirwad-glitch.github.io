// Stack samples: Paper Shaders (texture) + GSAP with SplitText / MorphSVG / DrawSVG (motion and type) + real Mixkit footage.
// Each sample is a paused GSAP timeline; render(t) seeks it, sets the shader frame and the footage frame, and waits for paint.
const W = 1920, H = 1080, DUR = 5, FPS = 30;
const INK = '#0B0F17', BLUE = '#2E6FD6', PALE = '#BFD3F6', PAPER = '#F4F1EA', MUTED = '#6B6B6B';
gsap.registerPlugin(SplitText, MorphSVGPlugin, DrawSVGPlugin);
const stage = document.getElementById('stage');
const tl = gsap.timeline({ paused: true });
const shaders = [], footages = [], perFrame = [];
const C = s => PS.getShaderColorFromString(s);
const sizing = (fit = 'cover') => ({ u_fit: PS.ShaderFitOptions[fit], u_scale: 1, u_rotation: 0, u_originX: .5, u_originY: .5, u_offsetX: 0, u_offsetY: 0, u_worldWidth: 0, u_worldHeight: 0 });
function el(tag, css = {}, parent = stage, html = '') { const e = document.createElement(tag); Object.assign(e.style, css); if (html) e.innerHTML = html; parent.appendChild(e); return e; }
const full = { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px' };
function shaderLayer(frag, uniforms, css = {}) { const d = el('div', { ...full, ...css }); const m = new PS.ShaderMount(d, frag, { ...sizing(), ...uniforms }, { preserveDrawingBuffer: true, premultipliedAlpha: false }, 0, 0, 1, W * H); shaders.push(m); return m; }
function footage(id, css = {}, parent = stage) { const i = el('img', { ...full, objectFit: 'cover', ...css }, parent); footages.push({ i, id }); return i; }
function grainOverlay(op = .14) {   // deterministic film grain: SVG turbulence with a new seed every frame
  const s = el('div', { ...full, mixBlendMode: 'overlay', opacity: op, pointerEvents: 'none' }, stage, `<svg width="${W}" height="${H}"><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="1"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg>`);
  const tb = s.querySelector('feTurbulence'); perFrame.push(f => tb.setAttribute('seed', String(f % 23 + 1)));
}
function text(s, css) { return el('div', { position: 'absolute', fontFamily: 'Geist', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', ...css }, stage, s); }
function mono(s, css) { return text(s, { fontFamily: 'GeistMono', fontWeight: 400, fontSize: '15px', letterSpacing: '4px', textTransform: 'uppercase', ...css }); }
async function noiseTex() { const n = PS.getShaderNoiseTexture(); if (n && !n.complete) await new Promise(r => { n.onload = r; n.onerror = r; }); return n; }

// ------------------------------------------------------------------ the six samples
const SAMPLES = {
  // 1 · GRAIN LIGHT: a grain gradient breathing behind letter-by-letter type
  async grain() {
    shaderLayer(PS.grainGradientFragmentShader, { u_colorBack: C(INK), u_colors: [C('#143566'), C(BLUE), C('#6F95DE')], u_colorsCount: 3, u_softness: .85, u_intensity: .18, u_noise: .28, u_shape: PS.GrainGradientShapes.wave, u_noiseTexture: await noiseTex() }, {}, 1);
    const k = mono('Why Samatvam, why now', { left: '140px', top: '150px', color: PALE });
    const a = text('Making is becoming easy.', { left: '140px', top: '230px', fontSize: '128px', letterSpacing: '-4px' });
    const b = text('Proof is not.', { left: '140px', top: '384px', fontSize: '128px', letterSpacing: '-4px', color: PALE });
    const sa = SplitText.create(a, { type: 'chars', mask: 'chars' }), sb = SplitText.create(b, { type: 'chars', mask: 'chars' });
    tl.from(k, { opacity: 0, x: -20, duration: .8, ease: 'power3.out' }, .2)
      .from(sa.chars, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .022 }, .4)
      .from(sb.chars, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .035 }, 1.6)
      .to(sa.chars, { opacity: .35, duration: .8, ease: 'power2.inOut', stagger: .01 }, 3.0);
  },
  // 2 · REAL + TYPE: real robot footage, graded into the palette, with editorial type and a live counter
  async real() {
    footage(47257, { filter: 'grayscale(1) contrast(1.18) brightness(.82)' });
    el('div', { ...full, background: BLUE, mixBlendMode: 'soft-light', opacity: .55 });
    el('div', { ...full, background: 'linear-gradient(90deg, rgba(11,15,23,.82) 0%, rgba(11,15,23,.35) 46%, rgba(11,15,23,0) 70%)' });
    grainOverlay(.16);
    const k = mono('Class 01 · Physical AI', { left: '140px', top: '640px' });
    const ln = el('div', { position: 'absolute', left: '140px', top: '680px' }, stage, `<svg width="520" height="4"><line x1="0" y1="2" x2="520" y2="2" stroke="#fff" stroke-width="2"/></svg>`).querySelector('line');
    const h = text('Intelligence is proven<br>in motion.', { left: '140px', top: '712px', fontSize: '92px', letterSpacing: '-3px', lineHeight: '96px', whiteSpace: 'normal', width: '1200px' });
    const sh = SplitText.create(h, { type: 'words,lines', mask: 'lines' });
    const ctr = mono('Trial 0000 · 00.0% success', { right: '120px', top: '960px', fontSize: '14px', color: PALE }); const o = { n: 0, r: 0 };
    tl.from(k, { opacity: 0, y: 10, duration: .6, ease: 'power3.out' }, .3).from(ln, { drawSVG: '0%', duration: 1.2, ease: 'power3.inOut' }, .4)
      .from(sh.lines, { yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: .12 }, .6)
      .to(o, { n: 412, r: 94.6, duration: 4, ease: 'power2.out', onUpdate: () => { ctr.textContent = `TRIAL ${String(Math.round(o.n)).padStart(4, '0')} · ${o.r.toFixed(1)}% SUCCESS`; } }, .5);
  },
  // 3 · FLUTED GLASS: the maker at work, seen through ribbed glass that clears
  async glass() {
    const img = await load('../shared/footage/22957/0001.jpg'); const mount = shaderLayer(PS.flutedGlassFragmentShader, { u_image: img, u_colorBack: C('#00000000'), u_colorShadow: C('#000000'), u_colorHighlight: C('#ffffff'), u_shadows: .25, u_size: .55, u_angle: 0, u_distortion: .9, u_shift: 0, u_blur: .15, u_edges: .25, u_marginLeft: 0, u_marginRight: 0, u_marginTop: 0, u_marginBottom: 0, u_stretch: 0, u_distortionShape: Object.values(PS.GlassDistortionShapes)[0], u_highlights: .12, u_shape: Object.values(PS.GlassGridShapes)[0], u_grainMixer: 0, u_grainOverlay: .08 }, {});
    const g = { d: .9, b: .15 }; tl.to(g, { d: .05, b: 0, duration: 2.6, ease: 'power3.inOut' }, 1.0);
    footages.push({ id: 22957, glass: mount, img, g });
    el('div', { ...full, background: 'linear-gradient(0deg, rgba(11,15,23,.78) 0%, rgba(11,15,23,0) 45%)' });
    grainOverlay(.12);
    const k = mono('Class 03 · Open Engineering', { left: '140px', top: '800px', color: PALE });
    const h = text('Learn by making something of your own.', { left: '140px', top: '838px', fontSize: '72px', letterSpacing: '-2.4px' });
    const sh = SplitText.create(h, { type: 'words', mask: 'words' });
    tl.from(k, { opacity: 0, duration: .6 }, 2.4).from(sh.words, { yPercent: 110, duration: 1.0, ease: 'expo.out', stagger: .05 }, 2.6);
  },
  // 4 · MARK DRAW-ON: the traced Samatwam mark drawn line by line on paper, then filled
  async mark() {
    shaderLayer(PS.paperTextureFragmentShader, { u_image: undefined, u_isImage: false, u_colorBack: C('#EDE9DF'), u_colorPaper: C('#F7F4EC'), u_colorShadow: C('#BDB6A6'), u_blending: 0, u_distortion: 0, u_clip: false, u_angle: 0, u_seed: 4, u_roughness: .35, u_roughnessSize: .4, u_roughnessRows: .5, u_fiber: .35, u_fiberSize: .4, u_folds: .15, u_foldSizeX: .5, u_foldSizeY: .5, u_foldOffsetX: .2, u_foldOffsetY: .3, u_wrinkles: .2, u_wrinkleSize: .5, u_crumples: .25, u_crumpleCount: .5, u_drops: .1, u_noiseTexture: await noiseTex() });
    const svg = await (await fetch('../shared/sun-full.svg')).text();
    const box = el('div', { position: 'absolute', left: '760px', top: '120px', width: '400px', height: '560px' }, stage, svg);
    const s = box.querySelector('svg'); s.setAttribute('width', '400'); s.setAttribute('height', '560'); s.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const paths = [...s.querySelectorAll('path')];
    paths.forEach(p => { p.setAttribute('fill', INK); p.setAttribute('fill-opacity', '0'); p.setAttribute('stroke', INK); p.setAttribute('stroke-width', '1.6'); p.setAttribute('vector-effect', 'non-scaling-stroke'); });
    s.querySelectorAll('g').forEach(gg => gg.setAttribute('fill', 'none'));
    const wm = text('SAMATWAM', { left: '0px', width: W + 'px', textAlign: 'center', top: '730px', fontSize: '44px', letterSpacing: '22px', color: INK });
    const tg = text('Never whole. Never incomplete. Always building.', { left: '0px', width: W + 'px', textAlign: 'center', top: '810px', fontSize: '34px', letterSpacing: '-.6px', color: '#3A3A37', fontWeight: 400 });
    const sw = SplitText.create(wm, { type: 'chars', mask: 'chars' }), st = SplitText.create(tg, { type: 'words', mask: 'words' });
    tl.from(paths, { drawSVG: '0%', duration: 2.2, ease: 'power2.inOut', stagger: .004 }, .2)
      .to(paths, { attr: { 'fill-opacity': 1 }, duration: .9, ease: 'power2.out' }, 2.2)
      .to(paths, { attr: { 'stroke-width': 0 }, duration: .6 }, 2.6)
      .from(sw.chars, { yPercent: 110, duration: .9, ease: 'expo.out', stagger: .04 }, 2.5)
      .from(st.words, { yPercent: 110, duration: .9, ease: 'expo.out', stagger: .05 }, 3.1);
  },
  // 5 · MORPH: one shape becoming the six class symbols over a moving mesh gradient
  async morph() {
    shaderLayer(PS.meshGradientFragmentShader, { u_colors: [C(INK), C('#1C3E7A'), C(BLUE), C('#DCE6F8')], u_colorsCount: 4, u_distortion: .85, u_swirl: .35, u_grainMixer: .12, u_grainOverlay: .18 });
    const shapes = ['M300,40 L525,170 L525,430 L300,560 L75,430 L75,170 Z', 'M300,50 A250,250 0 1 1 299.9,50 Z M300,230 A70,70 0 1 0 300.1,230 Z', 'M70,70 L530,70 L530,530 L70,530 Z', 'M300,50 A250,250 0 1 1 299.9,50 Z', 'M70,70 L530,70 L530,530 L70,530 Z M130,190 L470,190 L470,215 L130,215 Z M130,290 L470,290 L470,315 L130,315 Z M130,390 L470,390 L470,415 L130,415 Z', 'M300,60 L545,520 L55,520 Z'];
    const names = ['Physical AI', 'Simulation', 'Open Engineering', 'Open Research', 'Data Interfaces', 'Hackathon'];
    const sv = el('div', { position: 'absolute', left: '200px', top: '240px' }, stage, `<svg width="600" height="600" viewBox="0 0 600 600"><path id="m" d="${shapes[0]}" fill="#fff" fill-rule="evenodd"/></svg>`).querySelector('path');
    const k = mono('Six classes · one discipline of proof', { left: '960px', top: '400px', color: PALE });
    const win = el('div', { position: 'absolute', left: '960px', top: '440px', height: '130px', width: '900px', overflow: 'hidden' });
    const col = el('div', { position: 'absolute', left: 0, top: 0 }, win); names.forEach(n => el('div', { height: '130px', fontFamily: 'Geist', fontWeight: 500, fontSize: '112px', letterSpacing: '-3.6px', color: '#fff', lineHeight: '130px', whiteSpace: 'nowrap' }, col, n));
    const idx = mono('01 / 06', { left: '964px', top: '600px', color: '#fff' });
    tl.from(sv, { scale: .6, opacity: 0, transformOrigin: '50% 50%', duration: .8, ease: 'expo.out' }, 0).from(k, { opacity: 0, duration: .6 }, .2);
    for (let i = 1; i < 6; i++) { const t0 = .25 + i * .72; tl.to(sv, { morphSVG: shapes[i], duration: .62, ease: 'power3.inOut' }, t0).to(col, { y: -130 * i, duration: .62, ease: 'power3.inOut' }, t0).call(() => { idx.textContent = `0${i + 1} / 06`; }, null, t0 + .31); }
  },
  // 6 · MOSAIC: six real clips in an editorial grid, one per class, wiped in on a stagger
  async mosaic() {
    el('div', { ...full, background: INK });
    const ids = [47257, 46748, 47266, 47783, 23511, 22957], names = ['Physical AI', 'Simulation', 'Open Engineering', 'Open Research', 'Data Interfaces', 'Hackathon'], gw = 620, gh = 470, gx = 30, gy = 40, gap = 15;
    const tiles = ids.map((id, i) => { const x = gx + (i % 3) * (gw + gap), y = gy + Math.floor(i / 3) * (gh + gap); const t = el('div', { position: 'absolute', left: x + 'px', top: y + 'px', width: gw + 'px', height: gh + 'px', overflow: 'hidden' });
      footage(id, { width: gw + 'px', height: gh + 'px', filter: 'saturate(.55) contrast(1.12) brightness(.9)' }, t);
      el('div', { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'linear-gradient(0deg, rgba(11,15,23,.7), rgba(11,15,23,0) 40%)' }, t);
      el('div', { position: 'absolute', left: '22px', bottom: '20px', fontFamily: 'GeistMono', fontSize: '13px', letterSpacing: '3px', color: '#fff', textTransform: 'uppercase' }, t, `0${i + 1} · ${names[i]}`); return t; });
    grainOverlay(.12);
    const band = el('div', { position: 'absolute', left: 0, top: '420px', width: W + 'px', height: '240px', background: INK });
    const h = text('Six classes. One discipline of proof.', { left: '0px', width: W + 'px', textAlign: 'center', top: '488px', fontSize: '96px', letterSpacing: '-3px' });
    const sh = SplitText.create(h, { type: 'words', mask: 'words' });
    tiles.forEach((t, i) => tl.fromTo(t, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'expo.inOut' }, .1 + i * .14));
    tl.fromTo(band, { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: .8, ease: 'expo.inOut' }, 2.7).from(sh.words, { yPercent: 110, duration: 1.0, ease: 'expo.out', stagger: .06 }, 3.0);
  },
};

// ------------------------------------------------------------------ frame control for the recorder
window.DUR = DUR; window.EV = [];
const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const ready = (async () => { await document.fonts.load('500 120px Geist'); await document.fonts.load('15px GeistMono'); await document.fonts.load('400 34px Geist'); await SAMPLES[window.SAMPLE](); })();
window.render = async function (t) {
  await ready; const f = Math.min(Math.round(t * FPS), DUR * FPS - 1);
  tl.seek(t, false);
  for (const fo of footages) {
    const src = `../shared/footage/${fo.id}/${String(f + 1).padStart(4, '0')}.jpg`;
    if (fo.glass) { const im = await load(src); fo.glass.setUniforms({ u_image: im, u_distortion: fo.g.d, u_blur: fo.g.b }); }
    else if (fo.i.getAttribute('src') !== src) { fo.i.src = src; await fo.i.decode().catch(() => {}); }
  }
  perFrame.forEach(fn => fn(f));
  shaders.forEach(m => m.setFrame(t * 1000));
  await raf();
};
window.READY = true;
