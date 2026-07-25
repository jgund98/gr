"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { reels } from "@/lib/reels";
import Reveal from "@/components/Reveal";

/**
 * The reel theater — his actual footage, center stage.
 * Vertical scroll drives the filmstrip horizontally (pure transform,
 * native scrolling, nothing hijacked). The centered clip plays muted;
 * tap it for sound; tap a neighbor to fly to it. The whole room takes
 * the color of whatever's playing via a blurred poster backdrop.
 */
export default function ReelTheater() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const reduced = useReducedMotion();

  const [active, setActive] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [shift, setShift] = useState(1000);
  const [inView, setInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const measure = () => {
      const strip = stripRef.current;
      const vp = viewportRef.current;
      if (!strip || !vp) return;
      setShift(Math.max(0, strip.scrollWidth - vp.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stripRef.current) ro.observe(stripRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -shift]);
  const barScale = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const t = Math.min(1, Math.max(0, (p - 0.05) / 0.9));
    const idx = Math.round(t * (reels.length - 1));
    if (idx !== active) setActive(idx);
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView) {
        v.muted = !soundOn;
        const pr = v.play();
        if (pr) {
          pr.catch(() => {
            v.muted = true;
            setSoundOn(false);
            v.play().catch(() => {});
          });
        }
      } else {
        v.pause();
        v.muted = true;
      }
    });
  }, [active, soundOn, inView]);

  const jumpTo = useCallback((i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const travel = el.offsetHeight - window.innerHeight;
    const p = 0.05 + (i / (reels.length - 1)) * 0.9;
    window.scrollTo({ top: top + p * travel, behavior: "smooth" });
  }, []);

  const onCardClick = (i: number) => {
    if (i === active) setSoundOn((s) => !s);
    else jumpTo(i);
  };

  if (reduced) {
    return (
      <section className="border-y border-line bg-ink-2 py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="tag-index">05 — The feed</p>
          <h2 className="mt-4 display text-5xl md:text-6xl">Real footage. Real&nbsp;work.</h2>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-8">
          {reels.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="chamfer-sm relative aspect-[9/16] h-[60svh] shrink-0 snap-center overflow-hidden bg-ink-3"
            >
              <img src={r.poster} alt={r.caption} className="h-full w-full object-cover" loading="lazy" />
              <span className="label absolute bottom-3 left-3 bg-ink/70 px-2 py-1 text-green">{r.caption}</span>
            </a>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[430svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden border-y border-line bg-ink-2 [--ch:min(68svh,calc(100svh-248px))] md:[--ch:56svh]">
        {/* ambient backdrop — the room takes the clip's color */}
        <AnimatePresence>
          <motion.img
            key={reels[active].id}
            src={`/reels/blur-${reels[active].id}.jpg`}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-ink/55" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-2 via-transparent to-ink-2/90" aria-hidden />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-2 pt-20 md:px-8 md:pb-4 md:pt-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="tag-index">05 — The feed</p>
              <h2 className="mt-2 display text-3xl md:mt-3 md:text-6xl">Real footage. Real&nbsp;work.</h2>
            </div>
            <p className="label hidden text-faint sm:block">Scroll — the strip drives itself</p>
          </Reveal>
        </div>

        <div ref={viewportRef} className="relative w-full flex-1">
          <motion.div
            ref={stripRef}
            className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-5 will-change-transform md:gap-7"
            style={{
              x,
              paddingLeft: "max(calc(50vw - var(--ch) * 0.28125), 1.25rem)",
              paddingRight: "max(calc(50vw - var(--ch) * 0.28125), 1.25rem)",
            }}
          >
            {reels.map((r, i) => {
              const isActive = i === active;
              return (
                <div
                  key={r.id}
                  className={
                    "relative shrink-0 transition-[transform,opacity] duration-500 ease-out " +
                    (isActive
                      ? "z-10 scale-100 opacity-100"
                      : "scale-[0.85] opacity-40")
                  }
                  style={{ height: "var(--ch)", aspectRatio: "9 / 16" }}
                >
                  <button
                    type="button"
                    onClick={() => onCardClick(i)}
                    className={"chamfer group relative block h-full w-full overflow-hidden bg-ink-3 text-left " + (isActive ? "shadow-[0_0_60px_rgba(136,192,71,0.22)]" : "")}
                    aria-label={
                      isActive
                        ? soundOn
                          ? `Mute — ${r.caption}`
                          : `Unmute — ${r.caption}`
                        : `Watch: ${r.caption}`
                    }
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      className="h-full w-full object-cover"
                      src={r.src}
                      poster={r.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                    />
                    {isActive && (
                      <span className="label absolute bottom-4 left-1/2 max-w-[88%] -translate-x-1/2 whitespace-nowrap bg-ink/80 px-3 py-2 text-paper backdrop-blur-sm">
                        {soundOn ? "◉ Sound on" : "◎ Tap for sound"}
                      </span>
                    )}
                  </button>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="label absolute right-3 top-3 z-10 bg-ink/80 px-2.5 py-1.5 !text-[0.58rem] text-paper/90 backdrop-blur-sm transition-colors hover:text-green"
                  >
                    IG&ensp;↗
                  </a>
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-6 pt-2 md:pb-8 md:pt-4 md:px-8">
          <div className="flex items-end justify-between gap-4">
            <p className="display text-xl text-paper md:text-3xl">{reels[active].caption}</p>
            <p className="display text-2xl text-green md:text-3xl">
              {String(active + 1).padStart(2, "0")}
              <span className="text-faint">/{String(reels.length).padStart(2, "0")}</span>
            </p>
          </div>
          <div className="mt-3 md:mt-4 h-[3px] w-full bg-paper/10">
            <motion.div
              className="h-full origin-left bg-green"
              style={{ scaleX: barScale }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
