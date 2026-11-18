// Lucid renderer: 60 fps, captured at 2x (retina) as lossless PNG, downscaled to 1920x1080 with Lanczos, encoded at high quality.
// node lucid.mjs <page dir relative to library root> <out.mp4> [--fps 60] [--workers 4] [--blend]
import http from 'http'; import fs from 'fs'; import path from 'path'; import { spawn, execFileSync } from 'child_process';
import { createRequire } from 'module'; const require = createRequire('/home/user/tools/web/');
const { chromium } = require('playwright');
const ROOT = '/home/user/lemomo-ai/lemo-opuscar';
const [dir, out] = process.argv.slice(2); const opt = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = +opt('--fps', 60), WK = +opt('--workers', 4), BLEND = process.argv.includes('--blend');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); r.end(b); }); });
await new Promise(r => srv.listen(0, r)); const PORT = srv.address().port; const URL = `http://127.0.0.1:${PORT}/${dir}/index.html`;
const open = async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await pg.goto(URL); await pg.waitForFunction(() => window.READY === true); await pg.evaluate(() => window.render(0)); return { b, pg }; };
const probe = await open(); const DUR = await probe.pg.evaluate(() => window.DUR); await probe.b.close();
const SUB = BLEND ? 2 : 1; const TOTAL = Math.round(DUR * FPS * SUB), per = Math.ceil(TOTAL / WK);
const seg = fs.mkdtempSync(path.join(path.dirname(path.resolve(out)), '.lucid-')); const t0 = Date.now();
await Promise.all([...Array(WK)].map(async (_, w) => { const a = w * per, b = Math.min(TOTAL, a + per); if (a >= b) return;
  const { b: br, pg } = await open();
  const vf = ['scale=1920:1080:flags=lanczos'].concat(BLEND ? ['tmix=frames=2', `fps=${FPS}`] : []).join(',');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-c:v', 'png', '-i', '-', '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', '10', '-pix_fmt', 'yuv420p', `seg_${w}.mp4`], { cwd: seg, stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) { await pg.evaluate(t => window.render(t), f / (FPS * SUB)); const buf = await pg.screenshot({ type: 'png' }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await br.close(); }));
fs.writeFileSync(path.join(seg, 'list.txt'), [...Array(WK)].map((_, w) => `file 'seg_${w}.mp4'`).filter((_, w) => fs.existsSync(path.join(seg, `seg_${w}.mp4`))).join('\n'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy', path.resolve(out)], { cwd: seg });
fs.rmSync(seg, { recursive: true, force: true }); srv.close();
console.log(`${out} · ${TOTAL} frames · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
