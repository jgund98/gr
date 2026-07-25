/* eslint-disable @next/next/no-img-element */

/**
 * The brand band — his company logos only, optically matched,
 * one quiet divider. Two identical rows, each wider than any
 * monitor, so the -50% loop is seamless everywhere.
 */
const LOGOS: { slug: string; name: string; h: number }[] = [
  { slug: "gdr-development", name: "GDR Development", h: 44 },
  { slug: "renny-realty", name: "Renny Realty", h: 48 },
  { slug: "renny-insurance", name: "Renny Insurance Group", h: 30 },
  { slug: "millennium", name: "Millennium Health Advisors", h: 46 },
  { slug: "sycamore", name: "Sycamore Behavioral Health", h: 44 },
  { slug: "helping-hand", name: "Helping Hand Home Warranty", h: 46 },
  { slug: "decorate-one", name: "Decorate One", h: 26 },
];

export default function Marquee() {
  // repeat the set so one row always exceeds ultrawide viewports
  const items = [...LOGOS, ...LOGOS];
  const row = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((l, i) => (
        <span key={i} className="flex items-center">
          <img
            src={`/companies/ink-${l.slug}.png`}
            alt={ariaHidden ? "" : l.name}
            style={{ height: l.h }}
            className="mx-12 w-auto object-contain opacity-90 md:mx-16"
            loading="lazy"
          />
          <span className="h-7 w-px rotate-[24deg] bg-ink/30" aria-hidden />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden bg-green py-6 md:py-7">
      <div className="animate-marquee flex w-max will-change-transform [animation-duration:60s]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
