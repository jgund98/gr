"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  /**
   * The mask ends up scaled ~50×, and a layer left sitting up there while the
   * visitor reads the rest of the page can come back as the tiles the
   * compositor rasterised at that scale — the mark's strokes drawn as black
   * bars across the film. Repainting the canvas on the way back in reuploads
   * its texture and settles it. (Unmounting the element instead would drop
   * the layer too, but a remounted motion element re-renders from stale
   * derived style, so the mask can return invisible.)
   */
  /**
   * The mask ends up scaled ~50×. A layer left sitting up there while the
   * visitor reads the rest of the page comes back as the tiles the compositor
   * rasterised at that scale — the mark's strokes drawn as black bars across
   * the film. Repainting the canvas does not clear them and neither does
   * hiding it; only a new element gets a new layer. So it is unmounted while
   * the hero is away.
   */
  const [onScreen, setOnScreen] = useState(true);
  const repaintRef = useRef<(() => void) | null>(null);

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

  /**
   * The flight is drawn, not transformed.
   *
   * Scaling the canvas element is what produced the black bars: the
   * compositor rasterises a promoted layer once and thereafter only
   * transforms it, so after a fifty-fold zoom it keeps handing that raster
   * back — the mark's strokes blown up across the film. Redrawing the
   * aperture at its true size each frame keeps the canvas 1:1 with the
   * screen, so there is no raster that can go stale: not at rest, and not
   * mid-flight in either direction.
   */
  const glyphPath = useMemo(() => {
    if (typeof Path2D === "undefined") return null; // prerender has no canvas
    const path = new Path2D();
    GLYPH_POINTS.forEach(([px, py], i) => {
      const x = geo.gx + px * geo.k;
      const y = geo.gy + py * geo.k;
      if (i === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    });
    path.closePath();
    return path;
  }, [geo]);

  const drawMask = useCallback(
    (p: number) => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx || !glyphPath) return;
      const o = p <= 0.52 ? 1 : p >= 0.62 ? 0 : 1 - (p - 0.52) / 0.1;
      c.style.opacity = String(o);
      if (o <= 0) return; // invisible — nothing worth drawing
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // exponential zoom feels like flight, not interpolation
      const t = Math.min(1, Math.max(0, (p - 0.06) / 0.5));
      const e = t * t * (3 - 2 * t);
      const s = Math.exp(Math.log(geo.endScale) * e);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, geo.cw, geo.ch);
      ctx.fillStyle = "#0b0e09";
      ctx.fillRect(0, 0, geo.cw, geo.ch);
      ctx.save();
      ctx.translate(geo.ox, geo.oy);
      ctx.scale(s, s);
      ctx.translate(-geo.ox, -geo.oy);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill(glyphPath);
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    },
    [geo, glyphPath]
  );

  // one draw per frame however many scroll events land in it
  const frameRef = useRef(0);
  const schedule = useCallback(
    (p: number) => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => drawMask(p));
    },
    [drawMask]
  );
  useMotionValueEvent(scrollYProgress, "change", schedule);

  /** size the canvas, put it in step, and rebuild it if the browser drops it */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !vp) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      canvas.width = Math.round(geo.cw * dpr);
      canvas.height = Math.round(geo.ch * dpr);
    };
    size();
    drawMask(scrollYProgress.get());
    const raf = requestAnimationFrame(() => drawMask(scrollYProgress.get()));
    const onRestore = () => {
      size(); // a purged backing store comes back blank
      drawMask(scrollYProgress.get());
    };
    document.addEventListener("visibilitychange", onRestore);
    window.addEventListener("pageshow", onRestore);
    repaintRef.current = onRestore;
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frameRef.current);
      document.removeEventListener("visibilitychange", onRestore);
      window.removeEventListener("pageshow", onRestore);
      repaintRef.current = null;
    };
  }, [geo, vp, onScreen, scrollYProgress, drawMask]);

  /**
   * The film must never be caught frozen inside the mark.
   *
   * Playback here cannot be assumed: browsers pause background video and
   * don't always resume it, bfcache restores a page with the element
   * paused, iOS Low Power Mode refuses autoplay outright until a touch,
   * a rejected play() promise used to be swallowed forever, and a stalled
   * range request can wedge the decoder mid-loop. So playback is
   * supervised instead — a watchdog proves currentTime is actually
   * advancing and escalates (nudge → reload) until the picture moves.
   * Off screen it still parks, so nothing burns battery behind the fold.
   */
  useEffect(() => {
    const el = ref.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    let onScreen = true;
    let busy = false;
    let last = -1;
    let strikes = 0;
    const shouldPlay = () => onScreen && !document.hidden;

    const kick = async (reload = false) => {
      if (busy || !shouldPlay()) return;
      busy = true;
      try {
        vid.muted = true; // autoplay is only ever granted to muted video
        if (reload) vid.load();
        await vid.play();
        strikes = 0;
      } catch {
        /* blocked or not ready — the watchdog comes back around */
      } finally {
        busy = false;
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        setOnScreen(e.isIntersecting);
        if (onScreen) {
          kick();
          // returning to the hero: take a new layer and a new texture rather
          // than trusting whatever the compositor kept while we were away
          repaintRef.current?.();
        } else {
          vid.pause();
        }
      },
      { threshold: 0 }
    );
    io.observe(el);

    const tick = window.setInterval(() => {
      if (!shouldPlay()) return;
      if (vid.paused || vid.ended) {
        kick();
        return;
      }
      if (vid.readyState < 2 || vid.currentTime === last) strikes++;
      else strikes = 0;
      last = vid.currentTime;
      if (strikes === 2) kick();
      else if (strikes >= 4) {
        strikes = 0;
        kick(true);
      }
    }, 1200);

    const recover = () => {
      void kick();
    };
    const hardRecover = () => {
      void kick(true);
    };
    const first = () => {
      void kick();
    };

    vid.addEventListener("pause", recover);
    vid.addEventListener("stalled", recover);
    vid.addEventListener("waiting", recover);
    vid.addEventListener("ended", recover);
    vid.addEventListener("error", hardRecover);
    document.addEventListener("visibilitychange", recover);
    window.addEventListener("pageshow", recover);
    window.addEventListener("focus", recover);
    // Low Power Mode only relents once the visitor touches the page
    window.addEventListener("pointerdown", first, { once: true });
    window.addEventListener("touchstart", first, { once: true, passive: true });

    void kick();

    return () => {
      io.disconnect();
      window.clearInterval(tick);
      vid.removeEventListener("pause", recover);
      vid.removeEventListener("stalled", recover);
      vid.removeEventListener("waiting", recover);
      vid.removeEventListener("ended", recover);
      vid.removeEventListener("error", hardRecover);
      document.removeEventListener("visibilitychange", recover);
      window.removeEventListener("pageshow", recover);
      window.removeEventListener("focus", recover);
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("touchstart", first);
    };
  }, []);

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  // stage text is state-driven: entrances/exits play out in full no
  // matter how hard the visitor throws the scroll
  const [act, setAct] = useState<0 | 1>(0);
  // separate thresholds each way: a single one sits right where the reverse
  // flight lingers, and the line flickers as it crosses back and forth
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next: 0 | 1 = act === 0 ? (p >= 0.58 ? 1 : 0) : p <= 0.48 ? 0 : 1;
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
          src="/videos/hero-aerial-1080.mp4"
          poster="/site/hero-poster-1080.webp"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          /* the loop is short and it is the first thing anyone sees —
             buffer it whole so it can never stall mid-flight */
          preload="auto"
        />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />

        {/* the mark as aperture — static texture, GPU-scaled */}
        {!reduced && vp && onScreen && (
          <motion.canvas
            ref={canvasRef}
            className="absolute"
            style={{
              width: geo.cw,
              height: geo.ch,
              left: -(geo.cw - vp.w) / 2,
              top: -(geo.ch - vp.h) / 2,
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
