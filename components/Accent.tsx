"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Marker-highlight sweep: green floods in behind the words on scroll. */
export function Mark({
  children,
  className,
  tone = "green",
}: {
  children: ReactNode;
  className?: string;
  tone?: "green" | "ink";
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={cn(
        "inline bg-no-repeat px-1 [background-position:0_78%] [background-size:0%_0.42em] box-decoration-clone",
        tone === "green" ? "text-ink" : "text-green-bright",
        className
      )}
      style={{
        backgroundImage:
          tone === "green"
            ? "linear-gradient(#88c047,#88c047)"
            : "linear-gradient(#0b0e09,#0b0e09)",
      }}
      initial={reduced ? { backgroundSize: "100% 0.42em" } : undefined}
      whileInView={reduced ? undefined : { backgroundSize: ["0% 0.42em", "100% 0.42em"] }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

/** Hand-drawn underline that sketches itself in. */
export function Scribble({
  children,
  className,
  stroke = "#88c047",
}: {
  children: ReactNode;
  className?: string;
  stroke?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      {children}
      <svg
        className="absolute -bottom-[0.18em] left-0 w-full"
        viewBox="0 0 300 24"
        preserveAspectRatio="none"
        aria-hidden
      >
        <motion.path
          d="M4 14 C 60 20, 130 6, 296 12"
          fill="none"
          stroke={stroke}
          strokeWidth={7}
          strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}
