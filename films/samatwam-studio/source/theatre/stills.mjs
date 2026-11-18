// node stills.mjs <page under films/> <t1,t2,...> <outdir> <prefix>  → JPG stills at 1920x1080 (canvas drawn at 2x and downsampled)
import http from 'http'; import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; const require = createRequire('/home/user/tools/web/'); const { chromium } = require('playwright');
const ROOT = '/home/user/lemomo-ai/lemo-opuscar/films', [page, ts, out, prefix] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const TY = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TY[path.extname(p)] || 'application/octet-stream' }); r.end(b); }); });
await new Promise(r => srv.listen(0, r)); const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
pg.on('pageerror', e => console.log('ERR', e.message)); pg.on('console', m => m.type() === 'error' && console.log('CONSOLE', m.text()));
await pg.goto(`http://127.0.0.1:${srv.address().port}/${page}`); await pg.waitForFunction(() => window.READY === true, null, { timeout: 120000 });
for (const t of ts.split(',')) { const s = Date.now(); await pg.evaluate(x => window.render(x), +t); await pg.screenshot({ path: `${out}/${prefix}_${t.replace('.', '_')}s.jpg`, type: 'jpeg', quality: 93 }); console.log(t, Date.now() - s, 'ms'); }
await b.close(); srv.close();
