// node peek.mjs <page dir under films/studio> t1,t2,... -> contact sheet at 1x
import http from 'http'; import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process'; import { createRequire } from 'module'; const require = createRequire('/home/user/tools/web/'); const { chromium } = require('playwright');
const ROOT = '/home/user/lemomo-ai/lemo-opuscar/films'; const [dir, ts, out] = process.argv.slice(2);
const TY = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TY[path.extname(p)] || 'application/octet-stream' }); r.end(b); }); });
await new Promise(r => srv.listen(0, r)); const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('pageerror', e => console.log('ERR', e.message)); pg.on('console', m => m.type() === 'error' && console.log('CONSOLE', m.text()));
await pg.goto(`http://127.0.0.1:${srv.address().port}/studio/${dir}/index.html`); await pg.waitForFunction(() => window.READY === true);
const fr = []; for (const t of ts.split(',')) { await pg.evaluate(x => window.render(x), +t); const f = `/tmp/peek_${fr.length}.png`; await pg.screenshot({ path: f }); fr.push(f); }
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...fr.flatMap(f => ['-i', f]), '-filter_complex', fr.map((_, i) => `[${i}]scale=640:360[v${i}]`).join(';') + ';' + fr.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${fr.length}:layout=${fr.map((_, i) => `${(i % 3) * 640}_${Math.floor(i / 3) * 360}`).join('|')}`, out]);
await b.close(); srv.close(); console.log(out);
