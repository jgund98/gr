"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { GLYPH_W, GLYPH_H, GLYPH_POINTS, GLYPH_EYE } from "@/lib/glyph";
import { site } from "@/lib/site";

/**
 * The signature moment: the site opens inside Gus's monogram.
 * Aerial footage of his own build plays through the GR glyph;
 * scrolling flies the visitor through the mark into the film.
 *
 * Engineering: the dark overlay with the glyph-shaped hole is drawn
 * ONCE into a viewport-sized canvas (plain fills + destination-out,
 * works everywhere), then only transform-scaled — a static GPU
 * texture, zero re-rasterization, no per-frame paints.
 */
export default function MaskHero() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [vp, setVp] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const read = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(read, 150);
    };
    read();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const geo = useMemo(() => {
    const w = vp?.w ?? 1280;
    const h = vp?.h ?? 800;
    // canvas covers viewport + 6% margin (scale only ever grows from 1)
    const cw = Math.ceil(w * 1.06);
    const ch = Math.ceil(h * 1.06);
    // glyph height: 56% of viewport, capped by width and reserved zones
    const gh = Math.max(160, Math.min(0.56 * h, (0.86 * w * GLYPH_H) / GLYPH_W, h - 240));
    const k = gh / GLYPH_H;
    const gw = GLYPH_W * k;
    // glyph optical center: dead center, nudged up for the bottom line
    const gx = (cw - gw) / 2;
    const gy = (ch - gh) / 2 - 0.02 * h;
    const ox = gx + GLYPH_EYE[0] * k;
    const oy = gy + GLYPH_EYE[1] * k;
    const band = 82 * k; // widest open band of the glyph
    const endScale = Math.min(64, (1.35 * Math.hypot(w, h)) / band);
    return { cw, ch, k, gx, gy, ox, oy, endScale };
  }, [vp]);

  // paint the overlay texture (once per geometry change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !vp) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(geo.cw * dpr);
    canvas.height = Math.round(geo.ch * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, geo.cw, geo.ch);
    ctx.fillStyle = "#0b0e09";
    ctx.fillRect(0, 0, geo.cw, geo.ch);
    const path = new Path2D();
    GLYPH_POINTS.forEach(([px, py], i) => {
      const x = geo.gx + px * geo.k;
      const y = geo.gy + py * geo.k;
      if (i === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    });
    path.closePath();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill(path);
    ctx.globalCompositeOperation = "source-over";
  }, [geo, vp]);

  // pause the film while it's off screen
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

  // exponential zoom feels like flight, not interpolation
  const scale = useTransform(scrollYProgress, (p) => {
    const t = Math.min(1, Math.max(0, (p - 0.06) / 0.5));
    const e = t * t * (3 - 2 * t);
    return Math.exp(Math.log(geo.endScale) * e);
  });
  const maskOpacity = useTransform(scrollYProgress, [0.52, 0.62], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  // stage text is state-driven: entrances/exits play out in full no
  // matter how hard the visitor throws the scroll
  const [act, setAct] = useState<0 | 1>(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = p >= 0.56 ? 1 : 0;
    if (next !== act) setAct(next);
  });

  return (
    <section ref={ref} aria-label="Gus Renny" className={reduced ? "relative" : "relative h-[300svh]"}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
        {/* the film: his own build, from the air */}
        <motion.video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={reduced ? undefined : { scale: videoScale }}
          src="/videos/hero-aerial.mp4"
          poster="/site/hero-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />

        {/* the mark as aperture — static texture, GPU-scaled */}
        {!reduced && vp && (
          <motion.canvas
            ref={canvasRef}
            className="absolute will-change-transform"
            style={{
              width: geo.cw,
              height: geo.ch,
              left: -(geo.cw - vp.w) / 2,
              top: -(geo.ch - vp.h) / 2,
              scale,
              opacity: maskOpacity,
              transformOrigin: `${geo.ox}px ${geo.oy}px`,
            }}
            aria-hidden
          />
        )}
        {/* static veil for reduced motion */}
        {reduced && (
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/80" />
        )}

        <h1 className="sr-only">Gus Renny</h1>
        <AnimatePresence mode="wait">
          {act === 0 ? (
            /* act 1 — the mark speaks for itself */
            <motion.div
              key="act1"
              className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-6 pb-7 text-center"
              initial={false}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
            >
              <p className="display text-xl tracking-tight text-paper/95 md:text-2xl">
                Builder. Investor.&nbsp;Operator.
              </p>
              <p className="label text-green">Est. {site.founded}&ensp;·&ensp;GUSRENNY.COM</p>
              <div className="mt-1 flex flex-col items-center gap-2 text-faint">
                <motion.span
                  className="block h-8 w-px bg-green"
                  animate={reduced ? undefined : { scaleY: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          ) : (
            /* act 2 — inside the film, holds for the whole back half */
            <motion.div
              key="act2"
              className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 px-6 pb-14 md:px-14"
              initial={reduced ? false : { opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="label inline-block bg-green px-3 py-1.5 !text-ink">
                Filmed above one of Gus' rebuilds
              </p>
              <p className="display text-4xl md:text-6xl [text-shadow:0_2px_30px_rgba(11,14,9,0.6)]">
                <span className="block">Thirty&nbsp;years.</span>
                <span className="block text-green">One&nbsp;mark.</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
