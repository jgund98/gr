"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Agency-grade headline entrance: each line rises out of a clip mask.
 * The intersection observer sits on the (untranslated) heading itself —
 * the masked children only receive variants, so the clip can never
 * starve the trigger.
 */
export default function RevealLines({
  lines,
  as: Tag = "h2",
  className,
  delay = 0,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <Tag className={cn("display", className)}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }
  return (
    <Tag className={cn("display", className)}>
      <motion.span
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {/* mask bottom-slack fits descenders AND the scribble underline;
            hidden offset exceeds mask height so nothing peeks early */}
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.28em] -mb-[0.28em]">
            <motion.span
              className="block will-change-transform"
              variants={{
                hidden: { y: "140%" },
                show: {
                  y: 0,
                  transition: {
                    duration: 0.85,
                    delay: delay + i * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
