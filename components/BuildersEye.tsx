"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import RevealLines from "@/components/RevealLines";

/**
 * The Builder's Eye — drag a lens across a finished room and see it
 * the way Gus does: straight through to the bones.
 *
 * Engineering: both layers are pre-baked images. The photo is drawn on
 * a canvas with a soft destination-out hole at the lens (works on every
 * browser); the blueprint sits beneath as a plain <img>. touch-action
 * is pan-y, so vertical swipes always scroll the page.
 */
export default function BuildersEye() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    if (!wrap || !canvas || !ring) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/site/eye-photo.webp";

    let w = 0, h = 0, dpr = 1, radius = 120;
    // lens state: target follows input, pos glides after it
    let tx = -1, ty = -1, px = -1, py = -1;
    let raf = 0;
    let demoT = -1; // 0..1 auto-sweep on first view
    let seen = false;

    const size = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.max(90, Math.min(180, w * 0.14));
      draw();
    };

    const draw = () => {
      if (!img.naturalWidth) return;
      // cover-fit the photo
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      if (px >= 0) {
        const g = ctx.createRadialGradient(px, py, radius * 0.55, px, py, radius);
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ring.style.transform = `translate(${px - radius}px, ${py - radius}px)`;
        ring.style.width = ring.style.height = `${radius * 2}px`;
        ring.style.opacity = "1";
      }
    };

    const tick = () => {
      raf = 0;
      if (demoT >= 0 && demoT <= 1) {
        // gentle S-curve sweep to demonstrate the lens
        const e = demoT * demoT * (3 - 2 * demoT);
        tx = w * (0.18 + 0.64 * e);
        ty = h * (0.55 + 0.18 * Math.sin(e * Math.PI * 2));
        demoT += 0.008;
        if (demoT > 1) demoT = -1;
      }
      if (tx >= 0) {
        if (px < 0) { px = tx; py = ty; }
        px += (tx - px) * 0.16;
        py += (ty - py) * 0.16;
        draw();
        if (Math.abs(tx - px) > 0.4 || Math.abs(ty - py) > 0.4 || demoT >= 0) queue();
      }
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onPointer = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      demoT = -1; // user takes over
      queue();
    };

    const ro = new ResizeObserver(size);
    ro.observe(wrap);
    wrap.addEventListener("pointermove", onPointer, { passive: true });
    wrap.addEventListener("pointerdown", onPointer, { passive: true });

    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting && !seen) {
          seen = true;
          demoT = 0;
          queue();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(wrap);

    // never paint before the photo is truly ready (slow connections)
    img
      .decode()
      .then(() => requestAnimationFrame(() => { setReady(true); size(); }))
      .catch(() => { setReady(true); size(); });

    return () => {
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onPointer);
      wrap.removeEventListener("pointerdown", onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="tag-index">04 — The builder's eye</p>
            </Reveal>
            <RevealLines
              className="mt-4 max-w-3xl text-4xl leading-[1.03] md:text-6xl"
              lines={["He sees", <>the&nbsp;bones.</>]}
            />
          </div>
          <Reveal>
            <p className="lede max-w-md text-mist">
              Two thousand houses teach you to look straight through drywall.
              Run the lens over one of his finished rooms —{" "}
              <em className="text-green-bright">see what Gus sees</em>.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <div
            ref={wrapRef}
            className="chamfer relative aspect-[16/10] cursor-crosshair overflow-hidden bg-ink-3 md:aspect-[21/10]"
            style={{ touchAction: "pan-y" }}
          >
            {/* the bones */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/site/eye-blueprint.webp"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            {/* the finish, with the lens punched through */}
            <canvas
              ref={canvasRef}
              className={"absolute inset-0 h-full w-full transition-opacity duration-500 " + (ready ? "opacity-100" : "opacity-0")}
              aria-label="Interactive: move to reveal the structural drawing beneath the finished room"
            />
            {/* lens ring */}
            <div
              ref={ringRef}
              className="pointer-events-none absolute left-0 top-0 rounded-full border-2 border-green/80 opacity-0 shadow-[0_0_50px_rgba(136,192,71,0.35)] transition-opacity duration-300"
              aria-hidden
            />
            <span className="label absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink/80 px-3.5 py-2 text-paper/90 backdrop-blur-sm">
              Move across the room
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
