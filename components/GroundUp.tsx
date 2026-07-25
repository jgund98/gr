"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * The journey — a scroll-driven film in five scenes, every frame a real
 * Gus asset: land, bones, plans, home, landmark. Scenes crossfade with
 * slow push-ins like a trailer; two of them are actual motion footage.
 * All transform/opacity — each scene is one composited layer.
 */

interface Scene {
  word: string;
  note: string;
  src: string;
  video?: boolean;
  poster?: string;
}

const SCENES: Scene[] = [
  {
    word: "Land.",
    note: "The Palm Beach shoreline",
    src: "/videos/homebase.mp4",
    video: true,
    poster: "/site/homebase-poster.jpg",
  },
  {
    word: "Bones.",
    note: "A century-old frame, stripped honest",
    src: "/site/bones.webp",
  },
  {
    word: "Plans.",
    note: "Traced from the finished photograph",
    src: "/site/build-wire.webp",
  },
  {
    word: "Home.",
    note: "Filmed above one of Gus' rebuilds",
    src: "/videos/hero-aerial.mp4",
    video: true,
    poster: "/site/hero-poster.webp",
  },
  {
    word: "Legacy.",
    note: "The Century Hotel, where it started",
    src: "/site/century.webp",
  },
];

const N = SCENES.length;

function SceneLayer({
  scene,
  index,
  progress,
  inView,
}: {
  scene: Scene;
  index: number;
  progress: MotionValue<number>;
  inView: boolean;
}) {
  // each scene owns an equal slice; crossfade bands overlap neighbours
  const start = index / N;
  const end = (index + 1) / N;
  const fade = 0.06;
  const opacity = useTransform(
    progress,
    index === 0
      ? [0, end - fade, end + fade]
      : index === N - 1
        ? [start - fade, start + fade, 1]
        : [start - fade, start + fade, end - fade, end + fade],
    index === 0 ? [1, 1, 0] : index === N - 1 ? [0, 1, 1] : [0, 1, 1, 0]
  );
  // slow push-in across the scene's life
  const scale = useTransform(progress, [start - fade, end + fade], [1.0, 1.1]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(index === 0);
  useMotionValueEvent(progress, "change", (p) => {
    const on = p > start - 0.12 && p < end + 0.12;
    if (on !== active) setActive(on);
  });
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active && inView) v.play().catch(() => {});
    else v.pause();
  }, [active, inView]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {scene.video ? (
        <motion.video
          ref={videoRef}
          className="h-full w-full object-cover will-change-transform"
          style={{ scale }}
          src={scene.src}
          poster={scene.poster}
          muted
          loop
          playsInline
          preload="none"
        />
      ) : (
        <motion.img
          src={scene.src}
          alt=""
          aria-hidden
          className="h-full w-full object-cover will-change-transform"
          style={{ scale }}
        />
      )}
    </motion.div>
  );
}

export default function GroundUp() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [act, setAct] = useState(0);
  const [inView, setInView] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
    if (next !== act) setAct(next);
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (reduced) {
    return (
      <section className="relative overflow-hidden border-y border-line bg-ink">
        <img
          src="/site/build-photo.webp"
          alt="A restored historic home in Southland Park, West Palm Beach"
          className="h-auto w-full"
        />
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-label="The journey of a Gus build, in five scenes"
      className="relative h-[480svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden border-y border-line bg-ink">
        {SCENES.map((s, i) => (
          <SceneLayer key={s.src} scene={s} index={i} progress={scrollYProgress} inView={inView} />
        ))}

        {/* filmic grade: edges settle dark so the word always reads */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" aria-hidden />

        {/* the word */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-12 md:px-14 md:pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={act}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22, transition: { duration: 0.22 } }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="label inline-block bg-green px-3 py-1.5 !text-ink">{SCENES[act].note}</p>
              <p className="mt-3 display text-6xl md:text-9xl">{SCENES[act].word}</p>
            </motion.div>
          </AnimatePresence>
          {/* scene rail */}
          <div className="mt-6 flex gap-2" aria-hidden>
            {SCENES.map((_, i) => (
              <span
                key={i}
                className={
                  "h-[3px] w-10 transition-colors duration-500 " +
                  (i <= act ? "bg-green" : "bg-paper/15")
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
