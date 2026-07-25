"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GLYPH_W, GLYPH_H, glyphD, GLYPH_PERIMETER } from "@/lib/glyph";

/**
 * Once-per-session intro: the GR contour draws itself in green,
 * fills, then the curtain lifts. Click anywhere to skip.
 */
export default function Preloader() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    // the mark draws itself in on every HOME load — interior pages stay instant
    if (reduced || pathname !== "/") return;
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setLeaving(true), 2050);
    return () => clearTimeout(t);
  }, [reduced, pathname]);

  useEffect(() => {
    if (leaving) {
      const t = setTimeout(() => {
        setShow(false);
        document.documentElement.style.overflow = "";
      }, 700);
      return () => clearTimeout(t);
    }
  }, [leaving]);

  const skip = () => setLeaving(true);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={false}
          animate={leaving ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          onClick={skip}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-7">
            <svg
              viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`}
              className="h-[28vh] max-h-[280px] w-auto max-w-[64vw]"
            >
              <motion.path
                d={glyphD()}
                fill="none"
                stroke="#88c047"
                strokeWidth={10}
                strokeDasharray={GLYPH_PERIMETER}
                initial={{ strokeDashoffset: GLYPH_PERIMETER }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.path
                d={glyphD()}
                fill="#88c047"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.05, duration: 0.45 }}
              />
            </svg>
            {/* his actual wordmark, rising out of a mask under the mark */}
            <div className="overflow-hidden">
              <motion.img
                src="/brand/gr-wordmark.png"
                alt=""
                className="block h-auto w-[min(46vw,240px)]"
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ delay: 1.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
