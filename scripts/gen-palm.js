/* Generate natural palm-frond silhouette paths (curved rachis + leaflets). */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

function frond({ len = 900, curve = 260, leaflets = 26, spread = 150, seed = 1 }) {
  // deterministic pseudo-random
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);

  // rachis: quadratic curve from origin drooping right-down
  const pts = [];
  for (let i = 0; i <= leaflets; i++) {
    const t = i / leaflets;
    const x = len * t;
    const y = curve * t * t;
    pts.push([x, y, t]);
  }
  let d = "";
  // rachis as tapered stroke
  d += `M0 0 Q ${len * 0.55} ${curve * 0.18} ${len} ${curve} L ${len} ${curve + 3} Q ${len * 0.55} ${curve * 0.22 + 6} 0 7 Z `;
  // leaflets: pairs above (+/-) the rachis, swept toward the tip, drooping
  for (let i = 2; i <= leaflets; i++) {
    const t = i / leaflets;
    const [x, y] = pts[i];
    const L = spread * (1 - Math.pow(t, 1.7)) * (0.8 + rnd() * 0.4) + 24;
    const ang = Math.atan2(2 * curve * t, len); // rachis tangent
    for (const side of [-1, 1]) {
      const lean = (1.05 - t * 0.4) * (0.85 + rnd() * 0.3); // radians off the rachis
      const la = ang + side * lean;
      const tipX = x + Math.cos(la) * L;
      const tipY = y + Math.sin(la) * L + 10 * t; // slight droop toward tip
      const cx = x + (tipX - x) * 0.45;
      const cy = y + (tipY - y) * 0.45 + 12; // gravity bow
      const w = 6.5 * (1 - t * 0.45);
      d += `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q ${(cx + w).toFixed(1)} ${(cy + w).toFixed(1)} ${(x + w * 1.3).toFixed(1)} ${(y + w * 0.7).toFixed(1)} Z `;
    }
  }
  return d;
}

async function main() {
  const d1 = frond({ seed: 7 });
  fs.writeFileSync(path.join(__dirname, "..", "raw-assets", "frond1.txt"), d1);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -260 1400 900"><rect x="-200" y="-260" width="1400" height="900" fill="#88c047"/><g fill="#0b0e09" opacity="0.85"><path d="${d1}"/></g></svg>`;
  await sharp(Buffer.from(svg)).resize(1000).png().toFile(path.join(__dirname, "..", "raw-assets", "frond-preview.png"));
  console.log("frond path chars:", d1.length);
}

main().catch((e) => { console.error(e); process.exit(1); });
