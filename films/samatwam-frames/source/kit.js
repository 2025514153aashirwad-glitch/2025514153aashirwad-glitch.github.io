// Samatwam Frames · Liquid Night kit. Everything on screen is drawn by code: type, vectors, shaders, procedural noise.
const W = 1920, H = 1080, FPS = 30, DUR = 5;
const C = { night: '#0A0B0E', navy: '#13213D', blue: '#1F3A7A', saff: '#D9822B', lsaff: '#F2B766', gold: '#B08D3C', text: '#ECE8DF', dim: 'rgba(236,232,223,.62)', faint: 'rgba(236,232,223,.16)' };
gsap.registerPlugin(SplitText, DrawSVGPlugin, ScrambleTextPlugin, CustomEase, MotionPathPlugin);
// custom curves, written for this series
CustomEase.create('reveal', 'M0,0 C0.12,0.7 0.2,1 1,1');
CustomEase.create('glide', 'M0,0 C0.55,0 0.15,1 1,1');
CustomEase.create('snap', 'M0,0 C0.18,0 0.22,1.16 0.5,1.05 C0.68,0.97 0.8,1 1,1');
CustomEase.create('settle', 'M0,0 C0.3,0.9 0.45,1.02 0.62,1.01 C0.8,1 0.9,1 1,1');
CustomEase.create('press', 'M0,0 C0.5,0 0.7,0.6 0.8,1.04 C0.88,0.98 0.94,1 1,1');
const stage = document.getElementById('stage');
const tl = gsap.timeline({ paused: true });
const perFrame = [];
const full = { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px' };
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ss = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
function el(tag, css = {}, parent = stage, html = '') { const e = document.createElement(tag); Object.assign(e.style, css); if (html) e.innerHTML = html; parent.appendChild(e); return e; }
function svgEl(parent, css = {}, inner = '', w = W, h = H) { const d = el('div', { position: 'absolute', left: 0, top: 0, ...css }, parent, `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`); return d.querySelector('svg'); }
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const mono = (s, css = {}, p = stage) => el('div', { position: 'absolute', fontFamily: 'JBM', fontSize: '13px', letterSpacing: '.12em', textTransform: 'uppercase', color: C.dim, whiteSpace: 'nowrap', ...css }, p, s);
const disp = (s, css = {}, p = stage) => el('div', { position: 'absolute', fontFamily: 'SG', fontWeight: 500, color: C.text, whiteSpace: 'nowrap', letterSpacing: '-.02em', ...css }, p, s);
const hex3 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
// 2D value noise for canvas work
const vn = (() => { const P = new Uint8Array(512), r = rng(7); const p = [...Array(256).keys()].sort(() => r() - .5); for (let i = 0; i < 512; i++) P[i] = p[i & 255];
  const g = (ix, iy) => P[P[ix & 255] + (iy & 255)] / 255; const f = t => t * t * (3 - 2 * t);
  return (x, y) => { const ix = Math.floor(x), iy = Math.floor(y), fx = f(x - ix), fy = f(y - iy); return lerp(lerp(g(ix, iy), g(ix + 1, iy), fx), lerp(g(ix, iy + 1), g(ix + 1, iy + 1), fx), fy); }; })();

// ---------------------------------------------------------------- LiquidField: domain-warped fBm, one loop per 5 s
const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = `precision highp float;uniform vec2 R;uniform float T,S,D,K,SD;uniform vec3 c0,c1,c2,c3,SP;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*n(p);p=m*p;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=(uv-.5)*vec2(R.x/R.y,1.)*K+vec2(SD,SD*.7);
float a=6.2831853*T/5.;vec2 lo=vec2(cos(a),sin(a))*.3;
vec2 q=vec2(fbm(p+lo),fbm(p+vec2(5.2,1.3)-lo));
vec2 r=vec2(fbm(p+2.6*q+vec2(1.7,9.2)),fbm(p+2.6*q+vec2(8.3,2.8)+lo));
float v=fbm(p+2.6*r);
float s=S;if(SP.z>0.){s=clamp(.5+dot(uv-.5,normalize(SP.xy))*SP.z,0.,1.);}
float w=v+(s-.5)*.55;
vec3 col=mix(c0,c1,smoothstep(.18,.55,v));
col=mix(col,c2,smoothstep(.5,.78,w)*clamp(s*1.2,0.,1.));
col=mix(col,c3,smoothstep(.74,.95,w)*s);
col+=(r.x-.5)*.06;
gl_FragColor=vec4(col*D,1.);}`;
function liquid(parent = stage, o = {}) {
  const w = o.w || W, h = o.h || H, res = o.res || .33;
  const cv = el('canvas', { position: 'absolute', left: (o.x || 0) + 'px', top: (o.y || 0) + 'px', width: w + 'px', height: h + 'px', ...(o.css || {}) }, parent);
  cv.width = Math.round(w * res); cv.height = Math.round(h * res);
  const gl = cv.getContext('webgl', { preserveDrawingBuffer: true });
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  (o.cols || [C.night, C.navy, C.saff, C.lsaff]).forEach((c, i) => gl.uniform3fv(U('c' + i), hex3(c)));
  const u = { sat: o.sat ?? .5, dim: o.dim ?? 1, k: o.k ?? 1.6, sd: o.seed || 0, split: o.split || [0, 0, 0] };
  const L = { cv, u, draw(t) { gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(U('R'), cv.width, cv.height); gl.uniform1f(U('T'), t); gl.uniform1f(U('S'), u.sat); gl.uniform1f(U('D'), u.dim); gl.uniform1f(U('K'), u.k); gl.uniform1f(U('SD'), u.sd); gl.uniform3fv(U('SP'), u.split); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); } };
  perFrame.push((f, t) => L.draw(t)); return L;
}

// ---------------------------------------------------------------- LiquidGlass panel and GlassButton
function glass(css = {}, parent = stage, html = '', o = {}) {
  const f = o.fill ?? .07;
  const g = el('div', { position: 'absolute', boxSizing: 'border-box', borderRadius: (o.r ?? 28) + 'px', color: C.text,
    background: `linear-gradient(180deg, rgba(255,255,255,${o.top ?? .17}) 0%, rgba(255,255,255,${f}) 34%, rgba(255,255,255,${f * .55}) 100%)`,
    backdropFilter: `blur(${o.blur ?? 22}px) saturate(1.4)`, webkitBackdropFilter: `blur(${o.blur ?? 22}px) saturate(1.4)`,
    border: '1px solid rgba(255,255,255,.28)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55), inset 0 -1px 0 rgba(255,255,255,.08), inset 0 -22px 44px rgba(0,0,0,.26), inset 14px 0 30px -18px rgba(255,255,255,.18), 0 28px 60px rgba(0,0,0,.42)',
    overflow: 'hidden', ...css }, parent, html);
  el('div', { position: 'absolute', left: '6%', right: '6%', top: '1px', height: '38%', borderRadius: 'inherit', background: 'linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,0))', pointerEvents: 'none' }, g);
  return g;
}
function pill(label, css = {}, parent = stage, o = {}) { return glass({ height: '64px', padding: '0 30px', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'SG', fontWeight: 500, fontSize: '24px', whiteSpace: 'nowrap', ...css }, parent, label, { r: 32, ...o }); }

// ---------------------------------------------------------------- finishing: notched frame, title, scrim, grain, vignette
let TITLE = null, ILLUS = false;
function title(html, kicker) { TITLE = { html, kicker }; }
function illustrative() { ILLUS = true; }
function finish(n) {
  const scrim = el('div', { ...full, background: 'linear-gradient(0deg, rgba(10,11,14,.82) 0%, rgba(10,11,14,.5) 20%, rgba(10,11,14,0) 38%)', zIndex: 38, pointerEvents: 'none' });
  tl.from(scrim, { opacity: 0, duration: .8, ease: 'glide' }, 3.4);
  if (TITLE) {
    const box = el('div', { position: 'absolute', left: '120px', bottom: '104px', zIndex: 45, width: '1340px' });
    const k = mono(TITLE.kicker || '', { position: 'relative', color: C.lsaff, marginBottom: '16px' }, box);
    const h = disp(TITLE.html, { position: 'relative', fontSize: '60px', lineHeight: '68px', whiteSpace: 'normal', letterSpacing: '-.025em' }, box);
    const sp = SplitText.create(h, { type: 'lines', mask: 'lines' });
    tl.from(k, { opacity: 0, x: -14, duration: .6, ease: 'reveal' }, 3.62).from(sp.lines, { yPercent: 112, duration: .95, ease: 'reveal', stagger: .09 }, 3.66);
  }
  if (ILLUS) { const t = mono('Illustrative', { right: '110px', top: '118px', fontSize: '11px', padding: '6px 10px', border: '1px solid rgba(242,183,102,.45)', borderRadius: '6px', color: C.lsaff, zIndex: 46 }); tl.from(t, { opacity: 0, duration: .5 }, .6); }
  // notched bezel: everything outside is night; saffron hairlines and node dots in the corners; three-dot side rail
  const NN = String(n).padStart(2, '0');
  const bez = 'M64 40 H760 Q776 40 784 54 L800 82 Q808 96 824 96 H1096 Q1112 96 1120 82 L1136 54 Q1144 40 1160 40 H1856 Q1880 40 1880 64 V1016 Q1880 1040 1856 1040 H64 Q40 1040 40 1016 V64 Q40 40 64 40Z';
  const corner = (d, a, b) => `<path class="cn" d="${d}" stroke="${C.saff}" stroke-width="1.2" opacity=".9"/><circle class="cd" cx="${a[0]}" cy="${a[1]}" r="2.6" fill="${C.saff}"/><circle class="cd" cx="${b[0]}" cy="${b[1]}" r="2.6" fill="${C.saff}"/>`;
  const s = svgEl(stage, { zIndex: 40, pointerEvents: 'none' }, `
    <path d="M0 0H1920V1080H0Z ${bez}" fill="${C.night}" fill-rule="evenodd"/>
    <path class="bz" d="${bez}" stroke="rgba(236,232,223,.22)" stroke-width="1"/>
    ${corner('M40 150 V64 Q40 40 64 40 H170', [40, 150], [170, 40])}
    ${corner('M1750 40 H1856 Q1880 40 1880 64 V150', [1750, 40], [1880, 150])}
    ${corner('M40 930 V1016 Q40 1040 64 1040 H170', [40, 930], [170, 1040])}
    ${corner('M1750 1040 H1856 Q1880 1040 1880 1016 V930', [1750, 1040], [1880, 930])}
    ${[0, 1, 2].map(i => `<circle class="rail" cx="1854" cy="${500 + i * 40}" r="4" stroke="rgba(236,232,223,.5)" stroke-width="1"/>`).join('')}`);
  const lab = mono(`Samatwam · Frames · ${NN} / 18`, { left: '800px', width: '320px', top: '58px', textAlign: 'center', fontSize: '12px', color: C.text, zIndex: 41 });
  tl.from(s.querySelector('.bz'), { drawSVG: '50% 50%', duration: 1, ease: 'glide' }, 0).from(s.querySelectorAll('.cn'), { drawSVG: 0, duration: .8, ease: 'reveal' }, .2)
    .from(s.querySelectorAll('.cd'), { scale: 0, transformOrigin: '50% 50%', duration: .4, ease: 'snap' }, .7).from(lab, { opacity: 0, duration: .6 }, .3);
  const rails = s.querySelectorAll('.rail');
  perFrame.push(f => rails.forEach((r, i) => r.setAttribute('fill', (f < 30 ? 0 : f < 110 ? 1 : 2) === i ? C.saff : 'none')));
  // vignette 6% and seeded grain 3%
  el('div', { ...full, zIndex: 48, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,.34) 100%)' });
  const gr = el('div', { ...full, zIndex: 49, pointerEvents: 'none', opacity: .07, mixBlendMode: 'overlay' }, stage, `<svg width="${W}" height="${H}"><filter id="gn"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="1"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gn)"/></svg>`);
  const tb = gr.querySelector('feTurbulence'); perFrame.push(f => tb.setAttribute('seed', String(f % 23 + 1)));
}

// ---------------------------------------------------------------- frame control for the recorder
window.DUR = DUR; window.EV = [];
const raf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
const ready = (async () => { for (const f of ['500 60px SG', '400 24px SG', 'italic 400 60px PF', '13px JBM']) await document.fonts.load(f); await FR[window.FRAME](); finish(window.FRAME); })();
window.render = async function (t) { await ready; const f = Math.min(Math.round(t * FPS), DUR * FPS - 1); tl.seek(t, false); for (const fn of perFrame) fn(f, t); await raf(); };
window.READY = true;
