"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import RevealLines from "@/components/RevealLines";
import { Scribble } from "@/components/Accent";
import Btn from "@/components/Btn";

/**
 * The bright moment — South Florida sky, palms, home turf.
 * Deliberately the most vibrant band on the site.
 */
export default function HomeBase() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    const vid = videoRef.current;
    if (!el || !vid) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) vid.play().catch(() => {});
        else vid.pause();
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/homebase.mp4"
        poster="/site/homebase-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
      />
      {/* keep the sky bright — just enough scrim for type */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/70 to-transparent" />

      <div className="relative mx-auto flex min-h-[82svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-40 md:px-8 md:pb-20">
        <Reveal>
          <p className="tag-index">07 — Home base</p>
        </Reveal>
        <RevealLines
          className="mt-4 max-w-5xl text-4xl leading-[1.06] sm:text-5xl md:text-7xl md:leading-[1.02]"
          lines={[<>West&nbsp;Palm&nbsp;Beach</>, <Scribble key="s">is&nbsp;home.</Scribble>]}
        />
        <Reveal delay={0.15}>
          <p className="lede mt-7 max-w-xl text-paper/90">
            New York wired him. Miami Beach made him. But Palm Beach County is
            where Gus plants flags — the neighborhoods he restores, the streets
            his companies serve, the place his family calls&nbsp;home.
          </p>
          <Btn href="/story" className="mt-9">
            The full story
          </Btn>
        </Reveal>
      </div>
    </section>
  );
}
