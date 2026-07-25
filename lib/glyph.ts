/**
 * The GR monogram — measured to subpixel precision from Gus's actual
 * logo file (gr-logo1.png alpha channel), verified 99.1% pixel-exact.
 * One closed contour, pure horizontal / vertical / 45° geometry.
 * Every piece of logo art on the site derives from these points.
 */
export const GLYPH_W = 984.1;
export const GLYPH_H = 931;

export const GLYPH_POINTS: [number, number][] = [
  [0, 0],
  [0, 931],
  [80.8, 931],
  [80.8, 606.7],
  [516.4, 606.7],
  [840.7, 931],
  [984.1, 931],
  [659.8, 606.7],
  [977, 606.7],
  [977, 261.4],
  [216.1, 261.4],
  [298.4, 343.7],
  [893.7, 343.7],
  [893.7, 519.4],
  [80.8, 519.4],
  [80.8, 83.7],
  [963.9, 83.7],
  [880.2, 0],
];

/**
 * The original green tile: 1496×1264 units, glyph sits at (258.7, 182.4).
 * (Measured from the logo — the tile is NOT square; recreating it square
 * distorts the brand.)
 */
export const TILE_W = 1496;
export const TILE_H = 1264;
export const TILE_GLYPH_X = 258.7;
export const TILE_GLYPH_Y = 182.4;

/** Path `d` for the glyph, optionally translated/scaled. */
export function glyphD(x = 0, y = 0, k = 1): string {
  return (
    "M" +
    GLYPH_POINTS.map(([px, py]) => `${(x + px * k).toFixed(2)} ${(y + py * k).toFixed(2)}`).join(" L ") +
    " Z"
  );
}

/** Total contour length (for stroke draw-on animations). */
export const GLYPH_PERIMETER = (() => {
  let len = 0;
  for (let i = 0; i < GLYPH_POINTS.length; i++) {
    const a = GLYPH_POINTS[i];
    const b = GLYPH_POINTS[(i + 1) % GLYPH_POINTS.length];
    len += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  return len;
})();

/**
 * A point inside the widest open band of the glyph (the G's middle bar).
 * Zoom origin for the hero — scaling around it always ends on open glyph.
 */
export const GLYPH_EYE: [number, number] = [600, 302];
