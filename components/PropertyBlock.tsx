"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { Property } from "@/lib/properties";

/** One property: title row, hero mosaic, swipeable film-strip of the rest. */
export default function PropertyBlock({ p, eager = false }: { p: Property; eager?: boolean }) {
  const [main, ...rest] = p.gallery;
  const side = rest.slice(0, 2);
  const strip = rest.slice(2);

  return (
    <article id={p.slug} className="scroll-mt-28">
      <Reveal>
        <p className="label text-green">{p.neighborhood}</p>
        <h2 className="mt-2 display text-3xl tracking-tight md:text-5xl">{p.type}</h2>
        <p className="mt-2 max-w-xl text-mist">{p.line}</p>
      </Reveal>

      <Reveal delay={0.08} className="mt-7">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="chamfer relative aspect-[4/3] overflow-hidden bg-ink-3 md:col-span-2 md:aspect-auto md:min-h-full">
            {main && (
              <Image
                src={main}
                alt={`${p.type} — ${p.neighborhood}`}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                priority={eager}
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            {p.video ? (
              <div className="chamfer-sm relative aspect-[4/3] overflow-hidden bg-ink-3">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={p.video}
                  poster={side[0]}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="none"
                />
                <span className="label absolute bottom-3 left-3 bg-ink/70 px-2 py-1 !text-[0.55rem] text-green backdrop-blur-sm">
                  Film
                </span>
              </div>
            ) : (
              side[0] && (
                <div className="chamfer-sm relative aspect-[4/3] overflow-hidden bg-ink-3">
                  <Image
                    src={side[0]}
                    alt={`${p.type} — detail`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                </div>
              )
            )}
            {side[1] && (
              <div className="chamfer-sm relative aspect-[4/3] overflow-hidden bg-ink-3">
                <Image
                  src={side[1]}
                  alt={`${p.type} — detail`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            )}
          </div>
        </div>

        {strip.length > 0 && (
          <div
            
            className="mt-3 flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain pb-2 [touch-action:pan-x_pan-y] [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] [scrollbar-color:rgba(136,192,71,0.4)_transparent]"
            role="group"
            aria-label={`${p.type} photo gallery`}
          >
            {strip.map((src, i) => (
              <div
                key={src}
                className="chamfer-sm relative aspect-[4/3] w-[68vw] max-w-[380px] shrink-0 snap-start overflow-hidden bg-ink-3 sm:w-[320px]"
              >
                <Image
                  src={src}
                  alt={`${p.type} — photo ${i + 3}`}
                  fill
                  sizes="380px"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </article>
  );
}
