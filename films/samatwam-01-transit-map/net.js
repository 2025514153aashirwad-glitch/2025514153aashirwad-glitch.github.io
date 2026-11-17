// Samatwam 01 · The Line of a Work — the network as data. A diagram (metaphor), not a real transit system:
// six parent themes as six lines, the industry partner as one north–south line, Review as a water band crossed in tunnel.
// Units: G = 1 grid step = 100 world units. x grows east, y grows south. Station: [x, y, native, second, tier].
(function () {
const G = 100;
const THEMES = [
  { id: 'BS', name: 'Biomechanical Structures', color: '#C2185B' },
  { id: 'RB', name: 'Resilient Built Environment', color: '#8D5A3B' },
  { id: 'AP', name: 'Autonomous Production', color: '#F2A900', ink: true },
  { id: 'WF', name: 'Water, Flow & Hydraulics', color: '#00897B' },
  { id: 'TE', name: 'Thermal & Energy Habitats', color: '#6A3FA0' },
  { id: 'LS', name: 'Biosensing & Living Signals', color: '#7CB342', ink: true },
];
const YC = [-6.25, -3.75, -1.25, 1.25, 3.75, 6.25];   // where each line crosses the industry line
const ST = {
  INN: [0, -9.6, 'INDUSTRY', '', 3],
  INS: [0, 9.6, 'INDUSTRY', '', 4],
};
const FOCUS = 3;                                        // Water, Flow & Hydraulics carries the story
THEMES.forEach((th, i) => {
  const y = YC[i], y0 = Math.round(y * 1.6 * 10) / 10, f = i === FOCUS;
  ST['C' + i] = [-11, y0, 'CLAIMED', '', f ? 2 : 4];
  ST['A' + i] = [-6, y0, 'ADMITTED', '', f ? 2 : 4];
  ST['X' + i] = [0, y, 'THE CROSSING', '', f ? 1 : 4];
  ST['S' + i] = [2.6, y, 'SUBMITTED', '', f ? 2 : 4];
  ST['H' + i] = [7.4, y, 'HELD', '', f ? 2 : 4];
});
const LINES = THEMES.map((th, i) => ({ id: th.id, color: th.color, ink: !!th.ink, route: ['C' + i, 'A' + i, 'X' + i, 'S' + i, 'H' + i] }));
LINES.push({ id: 'IN', color: '#24346E', route: ['INN', 'X0', 'X1', 'X2', 'X3', 'X4', 'X5', 'INS'] });

const pt = it => { if (typeof it === 'string') { const s = ST[it]; if (!s) throw new Error('no station ' + it); return [s[0], s[1]]; }
  if (typeof it[0] === 'string') { const s = ST[it[0]]; return [s[0] + it[1], s[1] + it[2]]; } return [it[0], it[1]]; };
const sid = it => typeof it === 'string' ? it : (typeof it[0] === 'string' ? it[0] : null);
function expand(route) {
  const out = [], ids = []; let diagFirst = false;
  for (const it of route) {
    if (it === '/') { diagFirst = true; continue; }
    const p = pt(it);
    if (out.length) {
      const a = out[out.length - 1], dx = p[0] - a[0], dy = p[1] - a[1], ax = Math.abs(dx), ay = Math.abs(dy);
      if (ax > 1e-6 && ay > 1e-6 && Math.abs(ax - ay) > 1e-6) {
        const d = Math.min(ax, ay), sx = Math.sign(dx), sy = Math.sign(dy);
        out.push(diagFirst ? [a[0] + sx * d, a[1] + sy * d] : [p[0] - sx * d, p[1] - sy * d]); ids.push(null);
      }
    }
    out.push(p); ids.push(sid(it)); diagFirst = false;
  }
  return { pts: out, ids };
}
// Review: a north–south band; every line crosses it dashed, in tunnel
const REVIEW = [[4.4, -13], [4.4, 13]];
const WATER = [{ id: 'review', line: REVIEW, outer: 0.84, inner: 0.78, tunnel: true }];
const LINKS = [];
window.NET = { G, ST, LINES, WATER, LINKS, pt, sid, expand, THEMES, YC, FOCUS };
})();
