"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { TileMark } from "@/components/GRMark";
import Reveal from "@/components/Reveal";
import RevealLines from "@/components/RevealLines";
import Btn from "@/components/Btn";
import PalmShadow from "@/components/PalmShadow";

/**
 * The guy behind the mark — clean framed portrait, tile stamped on the
 * frame, the year drifting quietly behind the copy. No collisions.
 */
export default function StoryTeaser() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yearY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-line bg-ink-2 py-24 md:py-32"
    >
      <PalmShadow className="left-[-8%] top-[-4%] h-[26rem] w-[42rem] opacity-[0.12]" tone="green" />

      {/* the year, drifting behind the copy column */}
      <motion.p
        className="display text-outline-faint pointer-events-none absolute -right-6 bottom-6 select-none text-[clamp(7rem,20vw,18rem)] leading-none"
        style={reduced ? undefined : { y: yearY }}
        aria-hidden
      >
        1996
      </motion.p>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-12 lg:gap-16">
        {/* framed portrait */}
        <div className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:mx-0">
          <div className="chamfer absolute -bottom-3.5 -left-3.5 h-full w-full border-2 border-green/50" aria-hidden />
          <div className="chamfer relative aspect-[3/4] overflow-hidden bg-ink-3">
            <Image
              src="/site/gus-hero.webp"
              alt="Gus Renny on a job site, holding the plans"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <TileMark
            className="absolute -right-5 -top-6 h-16 w-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:h-20"
            alt=""
          />
        </div>

        {/* copy */}
        <div className="relative lg:col-span-7">
          <Reveal>
            <p className="tag-index">06 — The story</p>
          </Reveal>
          <RevealLines
            className="mt-4 text-5xl leading-[1.0] md:text-7xl"
            lines={["The guy behind", <>the&nbsp;mark.</>]}
          />
          <Reveal delay={0.1}>
            <p className="lede mt-7 max-w-xl text-mist">
              New York born, Miami Beach made — his first project was the
              renovation of the historic Century Hotel on Ocean Drive. Thirty
              years and more than{" "}
              <em className="text-green-bright">two thousand properties</em>{" "}
              later, the green square is on job sites all over Palm
              Beach&nbsp;County.
            </p>
          </Reveal>
          <Reveal delay={0.18} className="mt-10">
            <Btn href="/story" variant="outline">
              Read the story
            </Btn>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
