// Render one frame of each page at 2x, saved as PNG at 3840x2160 and a 1920 JPG for sharing.
import http from 'http'; import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; const require = createRequire('/home/user/tools/web/'); const { chromium } = require('playwright');
const ROOT = '/home/user/lemomo-ai/lemo-opuscar'; const [outDir, t, ...dirs] = process.argv.slice(2); fs.mkdirSync(outDir, { recursive: true });
const TY = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': TY[path.extname(p)] || 'application/octet-stream' }); r.end(b); }); });
await new Promise(r => srv.listen(0, r)); const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
for (const d of dirs) { await pg.goto(`http://127.0.0.1:${srv.address().port}/${d}/index.html`); await pg.waitForFunction(() => window.READY === true); await pg.evaluate(x => window.render(x), +t); await pg.waitForTimeout(300);
  const f = path.join(outDir, path.basename(d) + '.png'); await pg.screenshot({ path: f, type: 'png' }); console.log(f); }
await b.close(); srv.close();
