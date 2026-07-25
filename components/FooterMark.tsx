"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The sign-off: his name, edge to edge, with his own aerial footage
 * playing inside the letters — the site closes the way it opened.
 * The mask is static SVG (computed once); the only moving part is the
 * video layer underneath, so it costs nothing per frame.
 */
export default function FooterMark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) vid.play().catch(() => {});
        else vid.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative overflow-hidden pb-2" aria-hidden>
      {/* the film, sized to the wordmark box */}
      {!reduced && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero-aerial.mp4"
          poster="/site/hero-poster.webp"
          muted
          loop
          playsInline
          preload="none"
        />
      )}
      {reduced && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/site/hero-poster.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* a green wash so the letters stay unmistakably brand */}
      <div className="absolute inset-0 bg-green/40 mix-blend-color" />

      {/* ink plate with the name punched out — everything else hides the film */}
      <svg viewBox="0 0 1200 116" className="relative block w-full">
        <defs>
          <mask id="footer-mark">
            <rect width="1200" height="116" fill="white" />
            <text
              x="600"
              y="108"
              textAnchor="middle"
              textLength="1176"
              lengthAdjust="spacingAndGlyphs"
              className="display"
              style={{ fontSize: 138 }}
              fill="black"
            >
              GUSRENNY.COM
            </text>
          </mask>
        </defs>
        <rect width="1200" height="116" fill="#10140b" mask="url(#footer-mark)" />
        {/* crisp green edge so the letterforms read even on bright frames */}
        <text
          x="600"
          y="108"
          textAnchor="middle"
          textLength="1176"
          lengthAdjust="spacingAndGlyphs"
          className="display"
          style={{ fontSize: 138 }}
          fill="none"
          stroke="#88c047"
          strokeWidth="1.5"
        >
          GUSRENNY.COM
        </text>
      </svg>
    </div>
  );
}
