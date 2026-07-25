"use client";

import { motion, useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal";
import PalmShadow from "@/components/PalmShadow";
import { Glyph } from "@/components/GRMark";
import { site } from "@/lib/site";

/**
 * The playbook as a designed object: three verbs on a 45° staircase —
 * the same diagonal the mark is built on. Solid, outline, solid.
 */
const STEPS = [
  { verb: "Buy it.", note: "Acquire — the deal others miss", style: "text-paper" },
  { verb: "Build it.", note: "Develop — from studs to street-ready", style: "text-outline-green" },
  { verb: "Back it.", note: "Protect — insurance, health, home", style: "text-green" },
] as const;

export default function Playbook() {
  const reduced = useReducedMotion();
  return (
    <section className="glow-tl relative overflow-hidden py-24 md:py-32">
      <PalmShadow className="right-[-10%] top-[-6%] h-[28rem] w-[44rem] opacity-[0.13]" tone="green" flip />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex items-center gap-5">
          <p className="tag-index">01 — The playbook</p>
          <span className="h-px flex-1 bg-line" aria-hidden />
          <Glyph className="h-6 w-auto text-green/70" />
        </Reveal>

        <div className="mt-14 flex flex-col gap-2 md:gap-1">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.verb}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-1"
              style={{ paddingLeft: `min(${i * 9}%, ${i * 120}px)` }}
              initial={reduced ? false : { opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={`display text-[clamp(3.4rem,9.5vw,9rem)] leading-[1.02] ${s.style}`}>
                {s.verb}
              </span>
              <span className="label hidden text-faint sm:inline">{s.note}</span>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-14 flex justify-end">
          <p className="lede max-w-xl text-mist md:text-right">
            One playbook since {site.founded} — run across more than{" "}
            <em className="text-green-bright">2,000 properties</em> and every
            company that carries the&nbsp;mark.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
