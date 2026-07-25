/* Vectorize the white GR glyph from gr-logo1.png and sample brand colors. */
const sharp = require("sharp");
const potrace = require("potrace");
const fs = require("fs");
const path = require("path");

const RAW = path.join(__dirname, "..", "raw-assets");

async function main() {
  const img = sharp(path.join(RAW, "gr-logo1.png")).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const px = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };

  // 1. Find the green square bounds + dominant green
  const greenCount = {};
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = px(x, y);
      if (a > 200 && g > 120 && g > r + 20 && g > b + 40) {
        const key = `${r},${g},${b}`;
        greenCount[key] = (greenCount[key] || 0) + 1;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const domGreen = Object.entries(greenCount).sort((a, b) => b[1] - a[1])[0][0];
  const [gr, gg, gb] = domGreen.split(",").map(Number);
  const hex = "#" + [gr, gg, gb].map((v) => v.toString(16).padStart(2, "0")).join("");
  console.log("GREEN:", hex, "square bounds:", { minX, maxX, minY, maxY });

  // The square is the top region (wordmark below is also green).
  // Square rows = rows where green+white opaque pixels form a dense band (>60% of width).
  const isGreenAt = (x, y) => {
    const [r, g, b, a] = px(x, y);
    return a > 200 && g > 120 && g > r + 20 && g > b + 40;
  };
  const isWhiteAt = (x, y) => {
    const [r, g, b, a] = px(x, y);
    return a > 200 && r > 180 && g > 180 && b > 180;
  };
  const rowDense = [];
  for (let y = 0; y < height; y++) {
    let n = 0, gMin = width, gMax = 0;
    for (let x = 0; x < width; x++) {
      if (isGreenAt(x, y) || isWhiteAt(x, y)) {
        n++;
        if (x < gMin) gMin = x;
        if (x > gMax) gMax = x;
      }
    }
    rowDense.push({ n, span: gMax - gMin, gMin, gMax });
  }
  // square rows: dense fill (n close to span) — wordmark rows are sparse outlines
  const sqRows = rowDense.map((r, y) => ({ ...r, y })).filter((r) => r.span > 100 && r.n > r.span * 0.55);
  const sqTop = sqRows[0].y, sqBottom = sqRows[sqRows.length - 1].y;
  const sqLeft = Math.min(...sqRows.map((r) => r.gMin));
  const sqRight = Math.max(...sqRows.map((r) => r.gMax));
  minX = sqLeft; maxX = sqRight; minY = sqTop;
  console.log("square:", { sqLeft, sqRight, sqTop, sqBottom });

  // 2. Build a black-glyph-on-white bitmap for potrace, from white pixels inside the square
  const pad = 2;
  const sq = { left: minX + pad, top: minY + pad, w: maxX - minX - pad * 2, h: sqBottom - minY - pad * 2 };
  const bmp = Buffer.alloc(sq.w * sq.h * 3, 255);
  let whiteMinX = sq.w, whiteMaxX = 0, whiteMinY = sq.h, whiteMaxY = 0;
  for (let y = 0; y < sq.h; y++) {
    for (let x = 0; x < sq.w; x++) {
      const [r, g, b, a] = px(sq.left + x, sq.top + y);
      // glyph = transparent cutout OR white pixels inside the green square
      const isWhite = a < 60 || (a > 200 && r > 180 && g > 180 && b > 180);
      if (isWhite) {
        const i = (y * sq.w + x) * 3;
        bmp[i] = bmp[i + 1] = bmp[i + 2] = 0;
        if (x < whiteMinX) whiteMinX = x;
        if (x > whiteMaxX) whiteMaxX = x;
        if (y < whiteMinY) whiteMinY = y;
        if (y > whiteMaxY) whiteMaxY = y;
      }
    }
  }
  console.log("glyph bounds in square:", { whiteMinX, whiteMaxX, whiteMinY, whiteMaxY });

  // Upscale 4x for smoother trace, then trace
  const glyphPng = path.join(RAW, "glyph-bw.png");
  await sharp(bmp, { raw: { width: sq.w, height: sq.h, channels: 3 } })
    .extract({ left: Math.max(0, whiteMinX - 4), top: Math.max(0, whiteMinY - 4), width: Math.min(sq.w, whiteMaxX - whiteMinX + 8), height: Math.min(sq.h, whiteMaxY - whiteMinY + 8) })
    .resize({ width: (whiteMaxX - whiteMinX + 8) * 4, kernel: "nearest" })
    .png()
    .toFile(glyphPng);

  await new Promise((res, rej) => {
    potrace.trace(
      glyphPng,
      { threshold: 128, turdSize: 20, alphaMax: 0.0, optTolerance: 0.01, color: "#ffffff" },
      (err, svg) => {
        if (err) return rej(err);
        fs.writeFileSync(path.join(RAW, "glyph-traced.svg"), svg);
        // extract path d
        const m = svg.match(/d="([^"]+)"/);
        fs.writeFileSync(path.join(RAW, "glyph-path.txt"), m ? m[1] : "NO PATH");
        const vb = svg.match(/width="(\d+)" height="(\d+)"/);
        console.log("traced. svg size:", vb && vb.slice(1, 3).join("x"), "path length:", m && m[1].length);
        res();
      }
    );
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
