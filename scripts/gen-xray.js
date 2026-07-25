/**
 * "The Builder's Eye" layers:
 *  - eye-photo.webp     the finished room
 *  - eye-blueprint.webp the same room as a green technical drawing
 *    (edge-traced, gridded, annotated — baked, no runtime filters)
 */
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "public", "properties", "greymon-227", "4.webp");
const OUT = path.join(__dirname, "..", "public", "site");
const W = 1600;

async function main() {
  const photo = sharp(SRC).resize({ width: W });
  const meta = await photo.clone().toBuffer({ resolveWithObject: true });
  const H = meta.info.height;
  await photo.clone().webp({ quality: 82 }).toFile(path.join(OUT, "eye-photo.webp"));

  // edge map: laplacian on smoothed greyscale, boosted
  const edges = await sharp(SRC)
    .resize({ width: W })
    .greyscale()
    .blur(0.7)
    .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
    .linear(3.4, -22)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // paint: ink background, edges in brand green (strength = edge value)
  const px = Buffer.alloc(W * H * 3);
  const inkR = 8, inkG = 11, inkB = 7;
  const gR = 0x88, gG = 0xc0, gB = 0x47;
  for (let i = 0; i < W * H; i++) {
    const e = Math.min(255, edges.data[i]) / 255;
    // soften noise floor, keep strong lines crisp
    const k = e < 0.1 ? 0 : Math.pow(e, 0.8);
    px[i * 3] = Math.round(inkR + (gR - inkR) * k);
    px[i * 3 + 1] = Math.round(inkG + (gG - inkG) * k);
    px[i * 3 + 2] = Math.round(inkB + (gB - inkB) * k);
  }

  // drafting garnish: faint grid + border ticks + crosshairs, baked in
  const grid = [];
  for (let x = 80; x < W; x += 80) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`);
  for (let y = 80; y < H; y += 80) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <g stroke="#88c047" stroke-opacity="0.10" stroke-width="1">${grid.join("")}</g>
    <g stroke="#88c047" stroke-opacity="0.5" stroke-width="2">
      <line x1="40" y1="${H - 60}" x2="360" y2="${H - 60}"/>
      <line x1="40" y1="${H - 68}" x2="40" y2="${H - 52}"/>
      <line x1="360" y1="${H - 68}" x2="360" y2="${H - 52}"/>
    </g>
    <text x="52" y="${H - 74}" font-family="Arial" font-size="26" letter-spacing="4" fill="#88c047" fill-opacity="0.8">GR-227 · PLAN VIEW REF</text>
  </svg>`;

  await sharp(px, { raw: { width: W, height: H, channels: 3 } })
    .composite([{ input: Buffer.from(svg) }])
    .webp({ quality: 80 })
    .toFile(path.join(OUT, "eye-blueprint.webp"));

  console.log("eye layers done", W + "x" + H);
}

main().catch((e) => { console.error(e); process.exit(1); });
