/* Regenerate favicons + OG from the exact measured glyph. */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const PUB = path.join(__dirname, "..", "public");

const VB = [984.1, 931];
const PTS = [[0,0],[0,931],[80.8,931],[80.8,606.7],[516.4,606.7],[840.7,931],[984.1,931],[659.8,606.7],[977,606.7],[977,261.4],[216.1,261.4],[298.4,343.7],[893.7,343.7],[893.7,519.4],[80.8,519.4],[80.8,83.7],[963.9,83.7],[880.2,0]];
const D = "M" + PTS.map(([x, y]) => `${x} ${y}`).join(" L ") + " Z";

async function main() {
  // simpler: rasterize the REAL tile crop onto a dark rounded square
  const tile = await sharp(path.join(PUB, "brand", "gr-tile.png")).png().toBuffer();
  for (const [file, size, radius] of [["brand/icon-512.png", 512, 48], ["apple-icon.png", 180, 24], ["icon.png", 64, 8]]) {
    const inner = Math.round(size * 0.86);
    const t = await sharp(tile).resize({ width: inner, fit: "inside" }).png().toBuffer();
    const rounded = Buffer.from(
      `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#0b0e09"/></svg>`
    );
    await sharp(rounded).composite([{ input: t, gravity: "center" }]).png().toFile(path.join(PUB, file));
  }

  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#0b0e09"/>
    <g transform="translate(100 130) scale(${(390 / VB[1]).toFixed(4)})"><path fill="#88c047" d="${D}"/></g>
    <text x="560" y="290" font-family="Georgia, serif" font-size="86" fill="#f2f4ec">Gus Renny</text>
    <text x="564" y="352" font-family="Arial, sans-serif" font-size="28" letter-spacing="6" fill="#88c047">BUILDER · INVESTOR · OPERATOR</text>
    <text x="564" y="516" font-family="Arial, sans-serif" font-size="24" letter-spacing="3" fill="#8a8f85">GUSRENNY.COM · EST. 1997</text>
  </svg>`;
  await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile(path.join(PUB, "og.jpg"));
  console.log("brand regenerated");
}

main().catch((e) => { console.error(e); process.exit(1); });
