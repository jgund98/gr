/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/cn";

/**
 * A palm-frond shadow cast across the section — South Florida sunlight,
 * implied. The blur is baked into the PNG, so the sway animation only
 * ever rotates a static GPU texture.
 */
export default function PalmShadow({
  className,
  tone = "dark",
  delay = 0,
  flip = false,
}: {
  className?: string;
  tone?: "dark" | "green";
  delay?: number;
  flip?: boolean;
}) {
  return (
    <div className={cn("pointer-events-none absolute select-none", className)} aria-hidden>
      <img
        src={tone === "dark" ? "/brand/frond-ink.png" : "/brand/frond-green.png"}
        alt=""
        className="animate-sway h-full w-full object-contain will-change-transform"
        style={{
          transformOrigin: "0% 45%",
          animationDelay: `${delay}s`,
          // `scale` is an independent property — it composes with the
          // sway keyframes instead of being overwritten by them
          ...(flip ? { scale: "-1 1" } : {}),
        }}
        loading="lazy"
      />
    </div>
  );
}
