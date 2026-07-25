/** Brute-force refine the 4 diagonal params to minimize mismatch, then emit final data. */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const RAW = path.join(__dirname, "..", "raw-assets");
const SQ = { left: 64, top: 0, w: 374, h: 316 };

const stemL = 64.67, stemR = 84.87, topT = 45.6, topB = 66.53;
const midT = 110.94, midB = 131.52, barT = 175.46, barB = 197.28;
const bot = 278.36, rightE = 308.91, counterR = 288.1;

function pointsFor(legL, legR, notch, cut) {
  return [
    [stemL, topT], [stemL, bot], [stemR, bot], [stemR, barB],
    [barB + legL, barB], [bot + legL, bot], [bot + legR, bot], [barB + legR, barB],
    [rightE, barB], [rightE, midT], [midT + notch, midT], [midB + notch, midB],
    [counterR, midB], [counterR, barT], [stemR, barT], [stemR, topB],
    [topB + cut, topB], [topT + cut, topT],
  ];
}

async function main() {
  const { data, info } = await sharp(path.join(RAW, "gr-logo1.png"))
    .extract({ left: SQ.left, top: SQ.top, width: SQ.w, height: SQ.h })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // original coverage sampled at 2x grid
  const S = 2;
  const orig = new Uint8Array(W * S * H * S);
  for (let y = 0; y < H * S; y++)
    for (let x = 0; x < W * S; x++) {
      const a = data[(Math.min(H - 1, Math.round(y / S)) * W + Math.min(W - 1, Math.round(x / S))) * C + 3];
      orig[y * W * S + x] = a < 128 ? 1 : 0;
    }

  async function score(legL, legR, notch, cut) {
    const d = "M" + pointsFor(legL, legR, notch, cut).map(([x, y]) => `${x} ${y}`).join(" L ") + " Z";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="black"/><path d="${d}" fill="white"/></svg>`;
    const r = await sharp(Buffer.from(svg)).raw().toBuffer({ resolveWithObject: true });
    let mm = 0;
    for (let i = 0; i < W * S * H * S; i++) {
      const on = r.data[i * r.info.channels] > 127 ? 1 : 0;
      if (on !== orig[i]) mm++;
    }
    return mm;
  }

  let best = { legL: -5.01, legR: 36.34, notch: 7.75, cut: 239.12 };
  let bestScore = await score(best.legL, best.legR, best.notch, best.cut);
  console.log("start:", bestScore);

  for (const key of ["legL", "legR", "notch", "cut"]) {
    for (let dlt = -3; dlt <= 3; dlt += 0.5) {
      const trial = { ...best, [key]: best[key] + dlt };
      const s = await score(trial.legL, trial.legR, trial.notch, trial.cut);
      if (s < bestScore) { bestScore = s; best = trial; }
    }
    console.log(key, "→", best[key], "score", bestScore);
  }

  const P = pointsFor(best.legL, best.legR, best.notch, best.cut);
  const minX = Math.min(...P.map((p) => p[0])), minY = Math.min(...P.map((p) => p[1]));
  const maxX = Math.max(...P.map((p) => p[0])), maxY = Math.max(...P.map((p) => p[1]));
  const K = 4;
  const pts = P.map(([x, y]) => [
    Math.round((x - minX) * K * 10) / 10,
    Math.round((y - minY) * K * 10) / 10,
  ]);
  const out = {
    viewBox: [0, 0, Math.round((maxX - minX) * K * 10) / 10, Math.round((maxY - minY) * K * 10) / 10],
    points: pts,
    tile: {
      w: SQ.w * K, h: SQ.h * K,
      glyphLeft: Math.round(minX * K * 10) / 10, glyphTop: Math.round(minY * K * 10) / 10,
    },
    params: best,
  };
  fs.writeFileSync(path.join(RAW, "glyph-final.json"), JSON.stringify(out, null, 2));
  const total = W * S * H * S;
  console.log("final mismatch:", ((bestScore / total) * 100).toFixed(3) + "% of square;", JSON.stringify(out.viewBox));
  console.log(JSON.stringify(pts));
}

main().catch((e) => { console.error(e); process.exit(1); });
