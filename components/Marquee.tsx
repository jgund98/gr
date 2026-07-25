/**
 * The brand band — his company logos rolling on full-vibrance green.
 * One pre-baked strip image, painted as a REPEATING background on a
 * single element: one decode fills the whole loop, so a seam gap or a
 * late-loading second copy is physically impossible.
 */

// intrinsic strip: 3327 × 192 (2x). Displayed at h/192 scale.
const STRIP_W = 3327;
const STRIP_H = 192;

function band(displayH: number) {
  const w = (STRIP_W * displayH) / STRIP_H;
  return {
    height: displayH,
    // two loop-lengths wide; the -50% translate lands exactly on a repeat
    width: w * 2,
    backgroundImage: "url(/brand/logo-strip.png)",
    backgroundRepeat: "repeat-x",
    backgroundSize: `${w}px ${displayH}px`,
  } as const;
}

export default function Marquee() {
  return (
    <div
      className="relative overflow-hidden bg-green py-2.5 md:py-3"
      role="img"
      aria-label="GDR Development, Renny Realty, Renny Insurance Group, Millennium Health Advisors, Sycamore Behavioral Health, Helping Hand Home Warranty, Decorate One"
    >
      <link rel="preload" as="image" href="/brand/logo-strip.png" />
      {/* mobile */}
      <div className="animate-marquee md:hidden [animation-duration:26s]" style={band(76)} />
      {/* desktop */}
      <div className="animate-marquee hidden md:block [animation-duration:34s]" style={band(96)} />
    </div>
  );
}
