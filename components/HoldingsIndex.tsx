"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { TileMark } from "@/components/GRMark";
import { companies, categories } from "@/lib/companies";
import Reveal from "@/components/Reveal";
import RevealLines from "@/components/RevealLines";
import Btn from "@/components/Btn";
import { site } from "@/lib/site";

/**
 * The holdings board — his logos, clean and evenly weighted,
 * on a ruled exchange-board grid. Nothing else competing.
 */

/** optical size normalization per logo (box is uniform; this trims outliers) */
const SCALE: Record<string, number> = {
  "gdr-development": 1,
  "renny-realty": 1.04,
  "renny-insurance": 0.92,
  millennium: 1,
  sycamore: 1.06,
  "helping-hand": 1,
  "decorate-one": 0.78,
};

export default function HoldingsIndex() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-line bg-gradient-to-b from-ink-2 via-ink-3/60 to-ink-2 py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* rail */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <p className="tag-index">02 — The portfolio</p>
                <TileMark className="mt-7 h-24 w-auto md:h-32" alt="GR — the mark" />
              </Reveal>
              <RevealLines
                className="mt-8 text-5xl leading-[1.04] md:text-6xl lg:text-5xl xl:text-6xl"
                lines={["Everything", "under", <>one&nbsp;mark.</>]}
              />
              <Reveal>
                <p className="lede mt-6 max-w-sm text-mist">
                  Real estate leads. Insurance, health, and home run alongside
                  it — all of it under GR&nbsp;Investment&nbsp;Group,
                  est.&nbsp;{site.founded}.
                </p>
                <Btn href="/companies" variant="outline" className="mt-9">
                  Explore the portfolio
                </Btn>
              </Reveal>
            </div>
          </div>

          {/* board */}
          <div className="flex flex-col gap-12 lg:col-span-8">
            {categories.map((cat, ci) => {
              const list = companies.filter((c) => c.category === cat);
              return (
                <div key={cat}>
                  <Reveal className="flex items-center gap-4">
                    <span className="display text-xl text-green">
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                    <h3 className="label text-paper/90">{cat}</h3>
                    <span className="h-px flex-1 bg-line" aria-hidden />
                  </Reveal>
                  <div
                    className={
                      "mt-5 grid grid-cols-2 gap-px bg-line/60 " +
                      (list.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")
                    }
                  >
                    {list.map((c, i) => (
                      <motion.div
                        key={c.slug}
                        className="bg-ink-2"
                        initial={reduced ? false : { opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.45, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={`/companies#${c.slug}`}
                          className="group flex h-full flex-col items-center justify-center gap-4 px-6 py-9 transition-colors duration-300 hover:bg-green-deep/30 md:py-11"
                        >
                          <span className="flex h-16 w-full items-center justify-center md:h-20">
                            <Image
                              src={c.logo}
                              alt={`${c.name} logo`}
                              width={220}
                              height={80}
                              className="max-h-full w-auto max-w-[72%] object-contain opacity-85 transition-all duration-300 group-hover:scale-[1.05] group-hover:opacity-100"
                              style={{ transform: `scale(${SCALE[c.slug] ?? 1})` }}
                            />
                          </span>
                          <span className="text-center text-sm font-medium text-mist transition-colors duration-300 group-hover:text-paper">
                            {c.name}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                    {/* odd count on the 2-col mobile grid: fill the hole with the mark */}
                    {list.length % 2 === 1 && (
                      <div className="flex items-center justify-center bg-ink-2 md:hidden" aria-hidden>
                        <TileMark className="h-10 w-auto opacity-25" alt="" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
