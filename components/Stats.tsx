"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { stats } from "@/lib/site";

function Counter({ value, suffix, plain }: { value: number; suffix: string; plain?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const dur = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  return (
    <span ref={ref}>
      {plain ? String(n) : n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="glow-br relative overflow-hidden border-y border-line bg-ink-2">
      <div className="relative mx-auto grid max-w-7xl md:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={
              "flex flex-col gap-3 px-6 py-12 md:px-12 md:py-20 " +
              (i > 0 ? "border-line max-md:border-t md:border-l" : "")
            }
          >
            <span className="display text-7xl text-green md:text-8xl">
              <Counter value={s.value} suffix={s.suffix} plain={"plain" in s ? (s as { plain?: boolean }).plain : false} />
            </span>
            <span className="max-w-[26ch] text-base leading-snug text-mist md:text-lg">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
