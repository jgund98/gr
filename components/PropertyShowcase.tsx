"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Reveal from "@/components/Reveal";
import RevealLines from "@/components/RevealLines";

export interface ShowcaseItem {
  slug: string;
  title: string;
  place: string;
  line: string;
  hero: string;
}

function ParallaxImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  return (
    <div ref={ref} className="relative aspect-[16/10] overflow-hidden bg-ink-3 md:aspect-[16/9]">
      <motion.div className="absolute -inset-y-[9%] inset-x-0 will-change-transform" style={reduced ? undefined : { y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover"
          priority={priority}
        />
      </motion.div>
    </div>
  );
}

/**
 * Signature work — full-bleed film frames, an oversized index numeral,
 * and the caption block breaking over the image edge.
 */
export default function PropertyShowcase({ items }: { items: ShowcaseItem[] }) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="tag-index">03 — The work</p>
            </Reveal>
            <RevealLines
              className="mt-4 max-w-4xl text-4xl leading-[1.03] md:text-6xl"
              lines={["Homes that read historic,", <>and live brand&nbsp;new.</>]}
            />
          </div>
          <Link
            href="/portfolio"
            className="navline label pb-1 text-paper/80 transition-colors hover:text-paper"
          >
            See the work&ensp;→
          </Link>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-24 md:gap-32">
        {items.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={p.slug} className="relative">
              {/* oversized index numeral */}
              <span
                className={
                  "display text-outline-faint pointer-events-none absolute -top-14 z-10 select-none text-[clamp(6rem,15vw,13rem)] leading-none md:-top-20 " +
                  (flip ? "right-5 md:right-10" : "left-5 md:left-10")
                }
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className={"grid items-end lg:grid-cols-12"}>
                {/* full-bleed image: touches the screen edge on its side */}
                <div className={"lg:col-span-9 " + (flip ? "lg:order-2 lg:col-start-4" : "")}>
                  <Link href="/portfolio" className="group block">
                    <ParallaxImage src={p.hero} alt={`${p.title} — ${p.place}`} priority={i === 0} />
                  </Link>
                </div>

                {/* caption block breaking over the image */}
                <div
                  className={
                    "relative z-10 -mt-14 px-5 md:-mt-24 lg:col-span-4 lg:mt-0 lg:px-0 " +
                    (flip
                      ? "lg:order-1 lg:col-start-1 lg:-mr-28 lg:mb-14"
                      : "lg:col-start-9 lg:-ml-28 lg:mb-14")
                  }
                >
                  <Reveal>
                    <div className="chamfer border border-line bg-ink/95 p-7 backdrop-blur-sm md:p-9">
                      <p className="label text-green">{p.place}</p>
                      <h3 className="mt-3 display text-3xl md:text-4xl">{p.title}</h3>
                      <p className="mt-3 text-mist md:text-lg">{p.line}</p>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
