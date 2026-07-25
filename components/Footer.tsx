import Link from "next/link";
import Image from "next/image";
import { FullLogo } from "@/components/GRMark";
import { nav, site } from "@/lib/site";
import Phone from "@/components/Phone";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-2">
      <div className="relative mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-0">
          <div className="md:col-span-5 md:pr-12">
            <Link href="/" aria-label="Gus Renny — home" className="inline-block">
              <FullLogo className="w-36 md:w-44" />
            </Link>
            <p className="mt-6 max-w-sm leading-relaxed text-mist">
              Real estate first — development, brokerage, insurance, and health,
              built over three decades under one&nbsp;mark.
            </p>
            <div className="mt-6 flex gap-6">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="navline label inline-block pb-1 text-paper/70 hover:text-paper"
              >
                Instagram&ensp;↗
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="navline label inline-block pb-1 text-paper/70 hover:text-paper"
              >
                Facebook&ensp;↗
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:border-l md:border-line md:px-10">
            <p className="label mb-5 text-faint">Explore</p>
            <ul className="flex flex-col gap-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-paper/80 transition-colors hover:text-green">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 md:border-l md:border-line md:pl-10">
            <p className="label mb-5 text-faint">Reach Gus</p>
            <Phone className="block w-fit display text-2xl text-green hover:text-green-bright" />
            <a href={`mailto:${site.email}`} className="mt-1 block text-mist hover:text-paper">
              {site.email}
            </a>
            <div className="mt-6 flex flex-col gap-4 text-sm text-mist">
              {site.offices.map((o) => (
                <a
                  key={o.city}
                  href={o.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed transition-colors hover:text-paper"
                >
                  <span className="text-paper/85">{o.city}</span>
                  <br />
                  {o.lines[0]}, {o.lines[1]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-line py-7 sm:flex-row sm:items-center">
          <p className="text-sm text-faint">© {year} GUSRENNY.COM™ — All rights reserved.</p>
          <a
            href="https://epicdevsolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 opacity-70 transition-opacity hover:opacity-100"
          >
            <span className="text-sm text-faint transition-colors group-hover:text-mist">Site by</span>
            <Image
              src="/brand/epic-logo-white.webp"
              alt="Epic Dev Solutions"
              width={101}
              height={24}
              className="h-6 w-auto"
            />
          </a>
        </div>
      </div>

      {/* the sign-off: the name, edge to edge on every screen */}
      <div className="relative overflow-hidden pb-2" aria-hidden>
        <svg viewBox="0 0 1200 116" className="block w-full">
          <text
            x="600"
            y="108"
            textAnchor="middle"
            textLength="1176"
            lengthAdjust="spacingAndGlyphs"
            className="display"
            style={{ fontSize: 138, fill: "rgba(136,192,71,0.92)" }}
          >
            GUSRENNY.COM
          </text>
        </svg>
      </div>
    </footer>
  );
}
