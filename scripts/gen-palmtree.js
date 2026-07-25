/* Full palm-tree silhouette (trunk + frond crown) → pre-blurred shadow PNGs. */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const RAW = path.join(__dirname, "..", "raw-assets");
const PUB = path.join(__dirname, "..", "public", "brand");

const frondD = fs.readFileSync(path.join(RAW, "frond1.txt"), "utf8").trim();

// crown: fronds fanned around the trunk top; trunk: tapered with a slight lean
const CROWN = [
  { r: -105, s: 0.62 }, { r: -75, s: 0.8 }, { r: -45, s: 0.95 }, { r: -18, s: 1 },
  { r: 8, s: 0.98 }, { r: 35, s: 0.9 }, { r: 65, s: 0.78 }, { r: 95, s: 0.6 },
].map(
  (f) =>
    `<g transform="rotate(${f.r}) scale(${f.s})"><path d="${frondD}" fill="currentColor"/></g>`
);

// trunk: gentle S-curve, tapered, with step notches implied by width var
const trunk = `M-26 0 C -10 -260, 34 -520, 16 -820 L 52 -820 C 44 -520, 74 -260, 44 0 Z`;

const svg = (color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-980 -1850 1990 1900" width="1194" height="1140">
  <g style="color:${color}">
    <path d="${trunk}" fill="currentColor" transform="translate(0 0)"/>
    <g transform="translate(30 -810)">${CROWN.join("")}</g>
  </g>
</svg>`;

async function main() {
  for (const [name, color] of [
    ["palm-green", "#88c047"],
    ["palm-ink", "#0b0e09"],
  ]) {
    await sharp(Buffer.from(svg(color))).blur(6).png().toFile(path.join(PUB, `${name}.png`));
  }
  // preview on contrasting bg
  await sharp(path.join(PUB, "palm-green.png"))
    .flatten({ background: "#0b0e09" })
    .resize({ width: 700 })
    .jpeg({ quality: 80 })
    .toFile(path.join(RAW, "palmtree-check.jpg"));
  console.log("palm tree shadows done");
}

main().catch((e) => { console.error(e); process.exit(1); });
