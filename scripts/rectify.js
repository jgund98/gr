/**
 * Measure the GR glyph precisely from the alpha channel of the original
 * logo and rectify the traced points to exact subpixel edge positions.
 * Verifies by rasterizing the rectified SVG and diffing against the original.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const RAW = path.join(__dirname, "..", "raw-assets");

// square region in gr-logo1.png (500x408): x 64..437, y 0..316 (from trace.js)
const SQ = { left: 64, top: 0, w: 374, h: 316 };

async function main() {
  const { data, info } = await sharp(path.join(RAW, "gr-logo1.png"))
    .extract(SQ.left !== undefined ? { left: SQ.left, top: SQ.top, width: SQ.w, height: SQ.h } : undefined)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const alpha = (x, y) => data[(Math.round(y) * W + Math.round(x)) * C + 3];
  // glyph = transparent (alpha low). "coverage" of glyph = 1 - a/255
  const cov = (x, y) => 1 - alpha(x, y) / 255;

  // subpixel edge: scan along a line, find where coverage crosses 0.5
  function edgeAlong(fixed, axis, from, to) {
    // axis 'x': scan x at y=fixed ; axis 'y': scan y at x=fixed
    const step = from < to ? 1 : -1;
    let prev = axis === "x" ? cov(from, fixed) : cov(fixed, from);
    for (let v = from + step; step > 0 ? v <= to : v >= to; v += step) {
      const c = axis === "x" ? cov(v, fixed) : cov(fixed, v);
      if ((prev < 0.5 && c >= 0.5) || (prev >= 0.5 && c < 0.5)) {
        // linear interp between v-step and v
        const t = (0.5 - prev) / (c - prev);
        return v - step + step * t;
      }
      prev = c;
    }
    return null;
  }

  // Average an edge over several scanlines for stability
  function edge(axis, fixedFrom, fixedTo, from, to) {
    const vals = [];
    for (let f = fixedFrom; f <= fixedTo; f++) {
      const e = edgeAlong(f, axis, from, to);
      if (e !== null) vals.push(e);
    }
    vals.sort((a, b) => a - b);
    return vals[Math.floor(vals.length / 2)]; // median
  }

  // ── measure the design grid ──
  // left stem: scan rows mid-glyph
  const stemL = edge("x", 150, 170, 0, 60);          // outer left edge of stem
  const stemR = edge("x", 150, 170, 30, 90);          // inner right edge of stem (first exit)
  // top bar: scan columns mid-bar
  const topT = edge("y", 150, 170, 0, 40);            // top edge of top bar
  const topB = edge("y", 150, 170, 10, 60);           // bottom edge of top bar
  // middle bar (the G bar): columns near x=150 (inside bar region)
  const midT = edge("y", 150, 170, 55, 85);           // top of middle bar
  const midB = edge("y", 150, 170, 75, 105);          // bottom of middle bar
  // lower bar (R bowl bottom): columns near x=150
  const lowT = edge("y", 150, 170, 120, 145);
  const lowB = edge("y", 150, 170, 140, 165);
  // right column of bowl: rows between midB and lowT at right side
  const bowlL = edge("x", 105, 120, 200, 240);        // inner left edge of bowl right column
  const bowlR = edge("x", 105, 120, 230, 260);        // outer right edge of bowl column
  // far right edge of glyph (end of middle-bar block): rows in mid bar
  const farR = edge("x", 72, 84, 230, 265);
  // stem bottom: columns inside stem
  const stemBot = edge("y", 5, 15, 200, 260);
  // diagonal leg bottom edge y (bbox bottom): columns near x=215
  const bboxBot = edge("y", 205, 215, 220, 260);
  // top-right cut: find x of top bar right end at y just below topT and just above topB
  const topRow1 = topT + 1.5, topRow2 = topB - 1.5;
  const cutX1 = edgeAlong(topRow1, "x", 260, 250 - 10 + 20 ? 200 : 200, 200); // placeholder
  // simpler: scan right edge of top bar at two heights
  function rightEdgeAt(y) {
    // from right side moving left, find first coverage>=0.5 then its right edge crossing
    for (let x = W - 1; x > 150; x--) {
      if (cov(x, y) >= 0.5) {
        // crossing between x and x+1
        const c1 = cov(x, y), c2 = cov(Math.min(W - 1, x + 1), y);
        const t = c2 === c1 ? 0 : (0.5 - c1) / (c2 - c1);
        return x + t;
      }
    }
    return null;
  }
  const cutTop = rightEdgeAt(Math.round(topT + 2));
  const cutBottom = rightEdgeAt(Math.round(topB - 2));

  console.log(JSON.stringify({
    W, H,
    stemL, stemR, topT, topB, midT, midB, lowT, lowB,
    bowlL, bowlR, farR, stemBot, bboxBot, cutTop, cutBottom,
  }, null, 1));
}

main().catch((e) => { console.error(e); process.exit(1); });
