/**
 * Final glyph: 18 corners built purely from measured subpixel edge lines.
 * Verifies against the original alpha and reports mismatch + diff image.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const RAW = path.join(__dirname, "..", "raw-assets");
const SQ = { left: 64, top: 0, w: 374, h: 316 };

// measured edge lines (square space, subpixel)
const stemL = 64.67, stemR = 84.87;
const topT = 45.6, topB = 66.53;
const midT = 110.94, midB = 131.52;
const barT = 175.46, barB = 197.28;
const bot = 278.36;
const rightE = 308.91, counterR = 288.10;
const legL = -5.01;   // x = y + legL
const legR = 36.34;   // x = y + legR
const notch = 7.75;   // x = y + notch
const cut = 239.12;   // x = y + cut

const P = [
  [stemL, topT],
  [stemL, bot],
  [stemR, bot],
  [stemR, barB],
  [barB + legL, barB],   // leg left meets bar bottom
  [bot + legL, bot],     // leg bottom-left
  [bot + legR, bot],     // leg bottom-right
  [barB + legR, barB],   // leg right meets bar bottom
  [rightE, barB],
  [rightE, midT],
  [midT + notch, midT],  // notch top
  [midB + notch, midB],  // notch bottom
  [counterR, midB],
  [counterR, barT],
  [stemR, barT],
  [stemR, topB],
  [topB + cut, topB],    // top bar cut, bottom
  [topT + cut, topT],    // top bar cut, top
];

async function main() {
  const { data, info } = await sharp(path.join(RAW, "gr-logo1.png"))
    .extract({ left: SQ.left, top: SQ.top, width: SQ.w, height: SQ.h })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const cov = (x, y) => {
    const xi = Math.max(0, Math.min(W - 1, Math.round(x)));
    const yi = Math.max(0, Math.min(H - 1, Math.round(y)));
    return 1 - data[(yi * W + xi) * C + 3] / 255;
  };

  const dpath = "M" + P.map(([x, y]) => `${x} ${y}`).join(" L ") + " Z";
  const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 3}" height="${H * 3}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="black"/><path d="${dpath}" fill="white"/></svg>`;
  const render = await sharp(Buffer.from(testSvg)).raw().toBuffer({ resolveWithObject: true });
  const rw = render.info.width, rc = render.info.channels;
  let mismatch = 0, glyphArea = 0;
  const diff = Buffer.alloc(W * 3 * H * 3 * 3);
  for (let y = 0; y < H * 3; y++) {
    for (let x = 0; x < W * 3; x++) {
      const svgOn = render.data[(y * rw + x) * rc] > 127;
      const origOn = cov(x / 3, y / 3) > 0.5;
      const i = (y * W * 3 + x) * 3;
      if (origOn) glyphArea++;
      if (svgOn !== origOn) {
        mismatch++;
        diff[i] = svgOn ? 255 : 40;
        diff[i + 2] = origOn ? 255 : 40;
      } else if (svgOn) {
        diff[i] = diff[i + 1] = diff[i + 2] = 230;
      } else {
        diff[i] = diff[i + 1] = diff[i + 2] = 15;
      }
    }
  }
  await sharp(diff, { raw: { width: W * 3, height: H * 3, channels: 3 } })
    .png().toFile(path.join(RAW, "glyph-diff2.png"));
  console.log("mismatch vs glyph area:", ((mismatch / glyphArea) * 100).toFixed(2) + "%");

  // normalize ×4, origin at bbox min
  const minX = Math.min(...P.map((p) => p[0]));
  const minY = Math.min(...P.map((p) => p[1]));
  const maxX = Math.max(...P.map((p) => p[0]));
  const maxY = Math.max(...P.map((p) => p[1]));
  const K = 4;
  const pts = P.map(([x, y]) => [
    Math.round((x - minX) * K * 10) / 10,
    Math.round((y - minY) * K * 10) / 10,
  ]);
  const vb = [Math.round((maxX - minX) * K * 10) / 10, Math.round((maxY - minY) * K * 10) / 10];
  const result = {
    viewBox: [0, 0, vb[0], vb[1]],
    points: pts,
    square: {
      w: SQ.w * K, h: SQ.h * K,
      glyphLeft: (minX) * K, glyphTop: (minY) * K,
    },
  };
  fs.writeFileSync(path.join(RAW, "glyph-final.json"), JSON.stringify(result, null, 2));
  console.log("viewBox:", vb.join(" x "), "ratio", (vb[0] / vb[1]).toFixed(4));
  console.log("tile: 1496 x 1264, glyph at", result.square.glyphLeft.toFixed(1), result.square.glyphTop.toFixed(1));
}

main().catch((e) => { console.error(e); process.exit(1); });
