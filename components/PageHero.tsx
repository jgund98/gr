import type { ReactNode } from "react";
import { GlyphOutline } from "@/components/GRMark";
import Reveal from "@/components/Reveal";
import RevealLines from "@/components/RevealLines";
import PalmShadow from "@/components/PalmShadow";

/** Shared interior-page opener: index tag, rising headline, glyph watermark. */
export default function PageHero({
  label,
  lines,
  children,
}: {
  label: string;
  lines: ReactNode[];
  children?: ReactNode;
}) {
  return (
    <section className="glow-tl relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-52">
      <GlyphOutline
        className="pointer-events-none absolute -right-[14%] -top-[30%] h-[130%] w-auto text-green opacity-[0.05]"
        strokeWidth={4}
      />
      <PalmShadow className="right-[2%] top-[2%] hidden h-[32rem] w-[28rem] opacity-[0.22] lg:block" tone="green" flip />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="tag-index">{label}</p>
        </Reveal>
        <RevealLines
          as="h1"
          className="mt-5 max-w-5xl text-[2.75rem] leading-[1.05] sm:text-6xl md:text-8xl md:leading-[1.0]"
          lines={lines}
          delay={0.08}
        />
        {children ? (
          <Reveal delay={0.25}>
            <div className="lede mt-8 max-w-2xl text-mist">{children}</div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
