/* One-shot asset pipeline: logos, photos, favicons, OG image. */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const RAW = path.join(ROOT, "raw-assets");
const PUB = path.join(ROOT, "public");
const GDR = "C:/Users/Lucky/gdr-development/public";

const GLYPH = JSON.parse(fs.readFileSync(path.join(RAW, "glyph-clean-path.txt"), "utf8"));
// drop redundant collinear point 966 88
const D = GLYPH.d.replace("L 966 88 ", "");
const VB = GLYPH.viewBox; // [0,0,1012,978]

const glyphSvg = (fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB[2]} ${VB[3]}"><path fill="${fill}" d="${D}"/></svg>`;

// green tile with white glyph, glyph ~72% of tile
const tileSvg = (size, radius = 0) => {
  const g = 0.66 * size;
  const scale = g / Math.max(VB[2], VB[3]);
  const w = VB[2] * scale, h = VB[3] * scale;
  const x = (size - w) / 2, y = (size - h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" rx="${radius}" fill="#88c047"/>
    <g transform="translate(${x} ${y}) scale(${scale})"><path fill="#0B0E09" d="${D}"/></g>
  </svg>`;
};

async function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); }

async function main() {
  for (const d of ["brand", "companies", "site", "videos", "properties"]) await ensure(path.join(PUB, d));

  // ── 1. Company logos: trim transparent edges, export white webp @ 2x height 320
  const logos = {
    "gdr-development": "gdr-logo.png",
    "renny-realty": "renny-realty.png",
    "renny-insurance": "renny-insurance.png",
    "millennium": "millennium.png",
    "helping-hand": "helping-hand.png",
    "sycamore": "sycamore.png",
    "decorate-one": "decorate-one.png",
  };
  for (const [out, src] of Object.entries(logos)) {
    await sharp(path.join(RAW, src))
      .trim({ threshold: 10 })
      .resize({ height: 320, fit: "inside", withoutEnlargement: false })
      .webp({ quality: 92 })
      .toFile(path.join(PUB, "companies", `${out}.webp`));
  }
  console.log("logos done");

  // ── 2. Original square logo (green tile w/ glyph) + favicons + OG
  fs.writeFileSync(path.join(PUB, "brand", "gr-glyph.svg"), glyphSvg("#88c047"));
  fs.writeFileSync(path.join(PUB, "brand", "gr-glyph-white.svg"), glyphSvg("#F2F4EC"));
  await sharp(Buffer.from(tileSvg(512, 48))).png().toFile(path.join(PUB, "brand", "icon-512.png"));
  await sharp(Buffer.from(tileSvg(180, 24))).png().toFile(path.join(PUB, "apple-icon.png"));
  await sharp(Buffer.from(tileSvg(64, 8))).png().toFile(path.join(PUB, "icon.png"));

  // OG image: dark bg, green glyph left, wordmark text is added by layout (keep image typographic-free is hard; bake text)
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#0B0E09"/>
    <g transform="translate(90 135) scale(${(360 / VB[3]).toFixed(4)})"><path fill="#88c047" d="${D}"/></g>
    <text x="530" y="300" font-family="Georgia, serif" font-size="84" fill="#F2F4EC">Gus Renny</text>
    <text x="533" y="360" font-family="Arial, sans-serif" font-size="30" letter-spacing="6" fill="#88c047">BUILDER · INVESTOR · OPERATOR</text>
    <text x="533" y="520" font-family="Arial, sans-serif" font-size="24" letter-spacing="3" fill="#6b7280">GUSRENNY.COM</text>
  </svg>`;
  await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile(path.join(PUB, "og.jpg"));
  console.log("brand done");

  // ── 3. Site photos
  const site = [
    ["gus-workspace.webp", "gus-site.webp", 1400],
    ["gus-renny.webp", "gus-plans.webp", 1200],
    ["century-hotel.webp", "mediterranean.webp", 1400],
    ["about-main.webp", "miami-beach.webp", 1600],
    ["hero-poster.webp", "hero-poster.webp", 1600],
  ];
  for (const [src, out, w] of site) {
    await sharp(path.join(GDR, "site", src)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(PUB, "site", out));
  }
  // family photo from GR.png (large png) — crop a bit tighter, webp
  await sharp(path.join(RAW, "GR.png")).resize({ width: 1200 }).webp({ quality: 82 }).toFile(path.join(PUB, "site", "family.webp"));
  console.log("site photos done");

  // ── 4. Properties: copy all, cap width 1600, quality 78
  const propRoot = path.join(GDR, "properties");
  for (const dir of fs.readdirSync(propRoot)) {
    const outDir = path.join(PUB, "properties", dir);
    await ensure(outDir);
    for (const f of fs.readdirSync(path.join(propRoot, dir))) {
      if (!/\.(webp|jpe?g|png)$/i.test(f)) continue;
      await sharp(path.join(propRoot, dir, f))
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(outDir, f.replace(/\.\w+$/, ".webp")));
    }
  }
  console.log("properties done");
}

main().catch((e) => { console.error(e); process.exit(1); });
