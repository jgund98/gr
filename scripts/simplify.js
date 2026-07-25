/* Simplify potrace staircase path into clean geometric polygons. */
const fs = require("fs");
const path = require("path");
const RAW = path.join(__dirname, "..", "raw-assets");

const svg = fs.readFileSync(path.join(RAW, "glyph-traced.svg"), "utf8");
const dAttr = svg.match(/d="([^"]+)"/)[1];

// tokenize: commands M L Z (potrace uses absolute)
const tokens = dAttr.match(/[MLZmlz]|-?\d+(\.\d+)?/g);
const subpaths = [];
let cur = null;
let i = 0;
let cmd = null;
while (i < tokens.length) {
  const t = tokens[i];
  if (/[MLZmlz]/.test(t)) {
    cmd = t.toUpperCase();
    i++;
    if (cmd === "Z") {
      if (cur) subpaths.push(cur);
      cur = null;
    }
    continue;
  }
  const x = parseFloat(tokens[i]), y = parseFloat(tokens[i + 1]);
  i += 2;
  if (cmd === "M") {
    if (cur) subpaths.push(cur);
    cur = [[x, y]];
    cmd = "L"; // subsequent implicit pairs are linetos
  } else {
    cur.push([x, y]);
  }
}
if (cur) subpaths.push(cur);

// Douglas-Peucker
function dp(pts, eps) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let maxD = 0, idx = 0;
  for (let j = 1; j < pts.length - 1; j++) {
    const p = pts[j];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const d = Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / len;
    if (d > maxD) { maxD = d; idx = j; }
  }
  if (maxD > eps) {
    const l = dp(pts.slice(0, idx + 1), eps);
    const r = dp(pts.slice(idx), eps);
    return l.slice(0, -1).concat(r);
  }
  return [a, b];
}

// closed-polygon DP: rotate start to farthest-pair to avoid bad anchor
function simplifyClosed(pts, eps) {
  // remove duplicate closing point
  if (pts.length > 1) {
    const [f, l] = [pts[0], pts[pts.length - 1]];
    if (f[0] === l[0] && f[1] === l[1]) pts = pts.slice(0, -1);
  }
  // rotate so start is a strong corner: pick point farthest from centroid
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  let far = 0, fd = 0;
  pts.forEach((p, j) => {
    const d = (p[0] - cx) ** 2 + (p[1] - cy) ** 2;
    if (d > fd) { fd = d; far = j; }
  });
  pts = pts.slice(far).concat(pts.slice(0, far));
  // split at point farthest from the new start, DP each half
  let far2 = 0, fd2 = 0;
  pts.forEach((p, j) => {
    const d = (p[0] - pts[0][0]) ** 2 + (p[1] - pts[0][1]) ** 2;
    if (d > fd2) { fd2 = d; far2 = j; }
  });
  const h1 = dp(pts.slice(0, far2 + 1), eps);
  const h2 = dp(pts.slice(far2).concat([pts[0]]), eps);
  return h1.slice(0, -1).concat(h2.slice(0, -1));
}

// snap segments to 0/45/90 degrees by adjusting points (glyph is pure H/V/45 geometry)
function snap(pts) {
  const out = pts.map((p) => [...p]);
  for (let pass = 0; pass < 3; pass++) {
    for (let j = 0; j < out.length; j++) {
      const a = out[j], b = out[(j + 1) % out.length];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const adx = Math.abs(dx), ady = Math.abs(dy);
      if (adx === 0 || ady === 0) continue;
      if (ady < adx * 0.25) { b[1] = a[1]; }        // near-horizontal
      else if (adx < ady * 0.25) { b[0] = a[0]; }   // near-vertical
      else {                                        // near-45: force exact 45
        const m = Math.round((adx + ady) / 2);
        b[0] = a[0] + Math.sign(dx) * m;
        b[1] = a[1] + Math.sign(dy) * m;
      }
    }
  }
  return out.map((p) => [Math.round(p[0]), Math.round(p[1])]);
}

const simplified = subpaths.map((sp) => snap(simplifyClosed(sp, 6)));
console.log("subpaths:", simplified.map((s) => s.length).join(", "));

// bounds
let mnx = 1e9, mny = 1e9, mxx = -1e9, mxy = -1e9;
simplified.flat().forEach(([x, y]) => {
  mnx = Math.min(mnx, x); mny = Math.min(mny, y);
  mxx = Math.max(mxx, x); mxy = Math.max(mxy, y);
});
// normalize to 0,0 with a tidy viewBox
const W = mxx - mnx, H = mxy - mny;
const d = simplified
  .map((sp) => "M" + sp.map(([x, y]) => `${x - mnx} ${y - mny}`).join(" L ") + " Z")
  .join(" ");
console.log("viewBox: 0 0", W, H);
fs.writeFileSync(path.join(RAW, "glyph-clean.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><path fill="#88c047" fill-rule="evenodd" d="${d}"/></svg>`);
fs.writeFileSync(path.join(RAW, "glyph-clean-path.txt"), JSON.stringify({ viewBox: [0, 0, W, H], d }, null, 2));
console.log("path chars:", d.length);
