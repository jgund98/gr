"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * Ground up — one of Gus' real builds assembles itself on scroll:
 * the lot is staked out, the plans draw in (a wireframe traced from
 * the actual photograph), then the finished house rises out of the
 * ground line until the photo stands complete.
 *
 * Layers are pre-baked images; everything animates with transform,
 * opacity, and one composited clip-path. No per-frame paints.
 */

const ACTS = [
  { at: 0, word: "The lot.", note: "Southland Park, West Palm Beach" },
  { at: 0.18, word: "The plans.", note: "Traced from the finished photograph" },
  { at: 0.42, word: "The build.", note: "From the ground line up" },
  { at: 0.74, word: "The home.", note: "One of Gus' real builds" },
] as const;

export default function GroundUp() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [act, setAct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    let next = 0;
    for (let i = 0; i < ACTS.length; i++) if (p >= ACTS[i].at) next = i;
    if (next !== act) setAct(next);
  });

  // the lot: boundary stakes draw in, then hold
  const lotDraw = useTransform(scrollYProgress, [0.02, 0.16], [100, 0]);
  const lotOpacity = useTransform(scrollYProgress, [0, 0.05, 0.62, 0.74], [0, 1, 1, 0]);
  // the plans: wireframe breathes in, hands off to the build
  const wireOpacity = useTransform(scrollYProgress, [0.16, 0.3, 0.62, 0.78], [0, 1, 1, 0]);
  // the build: the photo rises from the ground line
  const buildClip = useTransform(
    scrollYProgress,
    [0.42, 0.72],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );
  const photoScale = useTransform(scrollYProgress, [0.42, 1], [1.06, 1]);
  const gridOpacity = useTransform(scrollYProgress, [0.62, 0.8], [1, 0]);

  if (reduced) {
    return (
      <section className="relative overflow-hidden border-y border-line bg-ink">
        <img src="/site/build-photo.webp" alt="A restored historic home in Southland Park, West Palm Beach" className="h-auto w-full" />
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="One of Gus' builds, from the ground up" className="relative h-[340svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden border-y border-line bg-ink">
        {/* drafting field */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: gridOpacity,
            backgroundImage:
              "linear-gradient(rgba(136,192,71,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(136,192,71,0.07) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
          aria-hidden
        />

        {/* the lot: surveyed boundary */}
        <motion.svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ opacity: lotOpacity }}
          aria-hidden
        >
          <motion.path
            d="M14 82 L38 74 L86 74 L86 92 L14 92 Z"
            fill="none"
            stroke="#88c047"
            strokeOpacity="0.8"
            strokeWidth="0.35"
            pathLength={100}
            strokeDasharray="100"
            style={{ strokeDashoffset: lotDraw }}
          />
        </motion.svg>

        {/* the plans: wireframe traced from the real photo */}
        <motion.img
          src="/site/build-wire.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: wireOpacity }}
        />

        {/* the build: the real house rises from the ground line */}
        <motion.div className="absolute inset-0" style={{ clipPath: buildClip }}>
          <motion.img
            src="/site/build-photo.webp"
            alt="A restored historic home in Southland Park, West Palm Beach"
            className="h-full w-full object-cover will-change-transform"
            style={{ scale: photoScale }}
          />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink/90 to-transparent" aria-hidden />

        {/* act titles */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-12 md:px-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={act}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.22 } }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="label inline-block bg-green px-3 py-1.5 !text-ink">{ACTS[act].note}</p>
              <p className="mt-3 display text-5xl md:text-8xl">{ACTS[act].word}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
