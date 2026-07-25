/**
 * Rectify the GR glyph to an exact match of the original logo.
 * For each edge of the traced contour, measure the true subpixel edge
 * from the alpha channel; rebuild corners as intersections; verify by diff.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const RAW = path.join(__dirname, "..", "raw-assets");

const SQ = { left: 64, top: 0, w: 374, h: 316 };

// traced points mapped into the measured white bbox of the square:
// x: 63..315 (w 252), y: 44..276 (h 232); trace space 1012x978
// seeds solved from first measurement pass (square-space, subpixel)
const P = [
  [64.67, 45.6], [64.67, 278.36], [84.87, 278.36], [84.87, 197.28], [191.8, 197.28],
  [272.9, 278.36], [312.47, 278.36], [312.47, 274.0], [224.5, 186.0], [308.91, 186.0],
  [308.91, 110.94], [118.3, 110.94], [138.9, 131.52], [288.1, 131.52], [288.1, 175.46],
  [84.87, 175.46], [84.87, 66.53], [305.3, 66.53], [284.4, 45.6],
];

async function main() {
  const { data, info } = await sharp(path.join(RAW, "gr-logo1.png"))
    .extract({ left: SQ.left, top: SQ.top, width: SQ.w, height: SQ.h })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  // coverage of GLYPH (glyph = transparent cutout) — clamp reads
  const cov = (x, y) => {
    const xi = Math.max(0, Math.min(W - 1, Math.round(x)));
    const yi = Math.max(0, Math.min(H - 1, Math.round(y)));
    return 1 - data[(yi * W + xi) * C + 3] / 255;
  };

  // subpixel 0.5-crossing along +axis near a guess
  function crossing(axis, fixed, guess) {
    let best = null;
    for (let v = Math.floor(guess - 5); v <= Math.ceil(guess + 5); v++) {
      const c1 = axis === "x" ? cov(v, fixed) : cov(fixed, v);
      const c2 = axis === "x" ? cov(v + 1, fixed) : cov(fixed, v + 1);
      if ((c1 - 0.5) * (c2 - 0.5) <= 0 && c1 !== c2) {
        const t = (0.5 - c1) / (c2 - c1);
        const pos = v + t;
        if (best === null || Math.abs(pos - guess) < Math.abs(best - guess)) best = pos;
      }
    }
    return best;
  }

  const median = (a) => {
    const s = [...a].sort((x, y) => x - y);
    return s.length ? s[Math.floor(s.length / 2)] : null;
  };

  const N = P.length;
  // classify + measure each segment
  const segs = [];
  for (let i = 0; i < N; i++) {
    const a = P[i], b = P[(i + 1) % N];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    let type, val, slope = 0;
    if (Math.abs(dy) < 0.75) {
      type = "H";
      const y0 = a[1];
      const xs = [];
      const lo = Math.min(a[0], b[0]) + 2, hi = Math.max(a[0], b[0]) - 2;
      for (let x = Math.ceil(lo); x <= hi; x++) {
        const c = crossing("y", x, y0);
        if (c !== null) xs.push(c);
      }
      val = median(xs);
    } else if (Math.abs(dx) < 0.75) {
      type = "V";
      const x0 = a[0];
      const ys = [];
      const lo = Math.min(a[1], b[1]) + 2, hi = Math.max(a[1], b[1]) - 2;
      for (let y = Math.ceil(lo); y <= hi; y++) {
        const c = crossing("x", y, x0);
        if (c !== null) ys.push(c);
      }
      val = median(ys);
    } else {
      type = "D";
      slope = Math.sign(dx) === Math.sign(dy) ? 1 : -1;
      // x = slope*y + c
      const cs = [];
      const lo = Math.min(a[1], b[1]) + 2, hi = Math.max(a[1], b[1]) - 2;
      for (let y = Math.ceil(lo); y <= hi; y++) {
        const t = (y - a[1]) / dy;
        const guessX = a[0] + t * dx;
        const c = crossing("x", y, guessX);
        if (c !== null) cs.push(c - slope * y);
      }
      val = median(cs);
    }
    segs.push({ type, val, slope });
  }

  // rebuild corners: point i = intersection of seg[i-1] and seg[i]
  const out = [];
  for (let i = 0; i < N; i++) {
    const s1 = segs[(i - 1 + N) % N], s2 = segs[i];
    let x, y;
    const pair = s1.type + s2.type;
    if (pair === "VH") { x = s1.val; y = s2.val; }
    else if (pair === "HV") { x = s2.val; y = s1.val; }
    else if (pair === "HD") { y = s1.val; x = s2.slope * y + s2.val; }
    else if (pair === "DH") { y = s2.val; x = s1.slope * y + s1.val; }
    else if (pair === "VD") { x = s1.val; y = (x - s2.val) / s2.slope; }
    else if (pair === "DV") { x = s2.val; y = (x - s1.val) / s1.slope; }
    else { throw new Error("unhandled pair " + pair + " at " + i); }
    out.push([x, y]);
  }

  console.log("segments:", segs.map((s, i) => `${i}:${s.type}=${s.val?.toFixed(2)}`).join(" "));

  // normalize to (0,0) and scale ×4 for a ~1000-unit viewBox
  const minX = Math.min(...out.map((p) => p[0]));
  const minY = Math.min(...out.map((p) => p[1]));
  const maxX = Math.max(...out.map((p) => p[0]));
  const maxY = Math.max(...out.map((p) => p[1]));
  const K = 4;
  const pts = out.map(([x, y]) => [
    Math.round((x - minX) * K * 100) / 100,
    Math.round((y - minY) * K * 100) / 100,
  ]);
  const vbW = Math.round((maxX - minX) * K * 100) / 100;
  const vbH = Math.round((maxY - minY) * K * 100) / 100;
  console.log("viewBox 0 0", vbW, vbH, " (ratio", (vbW / vbH).toFixed(4) + ")");
  console.log("glyph offset in square:", { left: minX, top: minY, right: SQ.w - maxX, bottom: SQ.h - maxY });
  console.log(JSON.stringify(pts));

  // ── verify: rasterize rectified glyph into square-space and diff vs alpha
  const dpath = "M" + out.map(([x, y]) => `${x} ${y}`).join(" L ") + " Z";
  const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 3}" height="${H * 3}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="black"/><path d="${dpath}" fill="white"/></svg>`;
  const render = await sharp(Buffer.from(testSvg)).raw().toBuffer({ resolveWithObject: true });
  const rw = render.info.width, rc = render.info.channels;
  let mismatch = 0, total = 0;
  const diff = Buffer.alloc(W * 3 * H * 3 * 3);
  for (let y = 0; y < H * 3; y++) {
    for (let x = 0; x < W * 3; x++) {
      const svgOn = render.data[(y * rw + x) * rc] > 127;
      const origOn = cov(x / 3, y / 3) > 0.5;
      const i = (y * W * 3 + x) * 3;
      if (svgOn !== origOn) {
        mismatch++;
        diff[i] = svgOn ? 255 : 40;      // red = svg-only
        diff[i + 2] = origOn ? 255 : 40; // blue = original-only
      } else if (svgOn) {
        diff[i] = diff[i + 1] = diff[i + 2] = 230;
      } else {
        diff[i] = diff[i + 1] = diff[i + 2] = 15;
      }
      total++;
    }
  }
  await sharp(diff, { raw: { width: W * 3, height: H * 3, channels: 3 } })
    .png().toFile(path.join(RAW, "glyph-diff.png"));
  console.log("mismatch:", ((mismatch / total) * 100).toFixed(3) + "% of square area");

  fs.writeFileSync(
    path.join(RAW, "glyph-final.json"),
    JSON.stringify({ viewBox: [0, 0, vbW, vbH], points: pts, squareOffsets: { left: minX, top: minY, right: SQ.w - maxX, bottom: SQ.h - maxY }, squareSize: [SQ.w, SQ.h] }, null, 2)
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
