/* eslint-disable @next/next/no-img-element */
import { GLYPH_W, GLYPH_H, glyphD, TILE_W, TILE_H } from "@/lib/glyph";
import { cn } from "@/lib/cn";

/**
 * The bare GR glyph (vector, measured pixel-exact from the logo file).
 * Use ONLY for large animated art — chrome-level marks use the real
 * raster asset via <TileMark/>.
 */
export function Glyph({
  className,
  fill = "currentColor",
  title,
}: {
  className?: string;
  fill?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`}
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={glyphD()} fill={fill} />
    </svg>
  );
}

/** Outline-only glyph (watermarks / draw-on moments). */
export function GlyphOutline({
  className,
  stroke = "currentColor",
  strokeWidth = 8,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`} className={className} aria-hidden>
      <path d={glyphD()} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}

/**
 * The REAL logo tile — an exact crop from Gus's own logo file.
 * The glyph is a transparent cutout, so the page shows through it,
 * exactly like the original brand usage.
 */
export function TileMark({ className, alt = "" }: { className?: string; alt?: string }) {
  return (
    <img
      src="/brand/gr-tile.png"
      alt={alt}
      width={TILE_W / 4}
      height={TILE_H / 4}
      className={cn("block", className)}
      style={{ aspectRatio: `${TILE_W} / ${TILE_H}` }}
    />
  );
}

/** The complete original logo file — tile plus GUSRENNY.COM wordmark. */
export function FullLogo({ className, alt = "GUSRENNY.COM" }: { className?: string; alt?: string }) {
  return (
    <img
      src="/brand/gr-logo-full.png"
      alt={alt}
      width={500}
      height={408}
      className={cn("block", className)}
    />
  );
}
