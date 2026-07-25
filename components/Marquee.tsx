/* eslint-disable @next/next/no-img-element */

/**
 * The brand band — his company logos rolling on full-vibrance green.
 * The whole row is ONE pre-baked strip image: a single decode and a
 * single texture, so mobile browsers can't evict individual logos
 * mid-scroll (the cause of the old random pop-in/pop-out).
 */
export default function Marquee() {
  const strip = (hidden: boolean) => (
    <img
      src="/brand/logo-strip.png"
      alt={hidden ? "" : "GDR Development, Renny Realty, Renny Insurance Group, Millennium Health Advisors, Sycamore Behavioral Health, Helping Hand Home Warranty, Decorate One"}
      aria-hidden={hidden || undefined}
      className="h-12 w-auto max-w-none shrink-0 md:h-14"
      loading="eager"
      decoding="sync"
    />
  );
  return (
    <div className="relative overflow-hidden bg-green py-5 md:py-6">
      <div className="animate-marquee flex w-max [animation-duration:22s] md:[animation-duration:40s]">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
