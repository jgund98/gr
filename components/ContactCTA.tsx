import { site } from "@/lib/site";
import { Glyph } from "@/components/GRMark";
import Reveal from "@/components/Reveal";
import RevealLines from "@/components/RevealLines";
import PalmShadow from "@/components/PalmShadow";
import { Scribble } from "@/components/Accent";

/** The close — full brand green, nothing shy about it. */
export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-green py-28 text-ink md:py-40">
      <Glyph className="pointer-events-none absolute -right-[8%] top-1/2 h-[150%] w-auto -translate-y-1/2 text-ink opacity-[0.08]" />
      <PalmShadow className="left-[-8%] top-[-10%] h-[28rem] w-[44rem] opacity-25" tone="dark" />
      <div className="relative mx-auto max-w-7xl px-5 text-center md:px-8">
        <Reveal>
          <p className="label text-ink/70">Direct line</p>
        </Reveal>
        <RevealLines
          className="mx-auto mt-5 max-w-4xl text-4xl leading-[1.05] sm:text-6xl md:text-8xl md:leading-[1.0]"
          lines={["Deals move fast.", <Scribble key="s" stroke="#0b0e09">So&nbsp;does&nbsp;Gus.</Scribble>]}
        />
        <Reveal delay={0.12}>
          <div className="mt-14 flex flex-col items-center gap-5">
            <a
              href={site.phoneHref}
              className="chamfer bg-ink px-12 py-6 display text-3xl text-green transition-colors hover:bg-ink-2 hover:text-green-bright md:text-4xl"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="border-b border-ink/40 pb-1 font-medium text-ink/80 transition-colors hover:border-ink hover:text-ink"
            >
              {site.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
